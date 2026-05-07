import requests
import base64
from django.conf import settings
from rest_framework.decorators import api_view, throttle_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class STTThrottle(AnonRateThrottle):
    rate = '5/min'


HF_MODEL = 'openai/whisper-large-v3'
HF_API_URL = f'https://router.huggingface.co/hf-inference/models/{HF_MODEL}'

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_TYPES = {
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav',
    'audio/ogg', 'audio/webm', 'audio/flac', 'audio/mp4', 'audio/m4a',
    'audio/x-m4a', 'video/webm',
}


@api_view(['POST'])
@throttle_classes([STTThrottle])
@parser_classes([MultiPartParser, FormParser])
def transcribe(request):
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({'error': 'Audio file is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if audio_file.size > MAX_FILE_SIZE:
        return Response({'error': 'File too large. Maximum 10 MB.'}, status=status.HTTP_400_BAD_REQUEST)

    content_type = audio_file.content_type or 'audio/mpeg'
    if content_type not in ALLOWED_TYPES:
        return Response({'error': f'Unsupported audio format: {content_type}.'}, status=status.HTTP_400_BAD_REQUEST)

    token = settings.HF_API_TOKEN
    if not token:
        return Response({'error': 'Transcription service not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    audio_bytes = audio_file.read()

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': content_type,
    }

    try:
        resp = requests.post(HF_API_URL, headers=headers, data=audio_bytes, timeout=60)
    except requests.Timeout:
        return Response({'error': 'Transcription timed out. Please try a shorter audio file.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.RequestException as e:
        return Response({'error': f'Network error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

    if resp.status_code == 503:
        return Response({'error': 'Model is loading, please retry in 20 seconds.', 'loading': True}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    if resp.status_code != 200:
        return Response(
            {'error': f'Transcription service error ({resp.status_code}). Please try again.'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    data = resp.json()

    if 'text' in data:
        return Response({'text': data['text']})

    return Response({'error': 'Unexpected response from transcription service.'}, status=status.HTTP_502_BAD_GATEWAY)
