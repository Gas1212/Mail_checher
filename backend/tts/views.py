import requests
import base64
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from django.conf import settings


class TTSThrottle(AnonRateThrottle):
    rate = '10/min'


LANGUAGE_MODELS = {
    'arabic':  'facebook/mms-tts-ara',
    'english': 'facebook/mms-tts-eng',
    'german':  'facebook/mms-tts-deu',
    'french':  'facebook/mms-tts-fra',
}

MAX_CHARS = 500


@api_view(['POST'])
@throttle_classes([TTSThrottle])
def tts_generate(request):
    text = request.data.get('text', '').strip()
    language = request.data.get('language', 'english').lower()

    if not text:
        return Response({'error': 'Text is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(text) > MAX_CHARS:
        return Response(
            {'error': f'Text too long. Maximum {MAX_CHARS} characters.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if language not in LANGUAGE_MODELS:
        return Response({'error': f'Unsupported language: {language}.'}, status=status.HTTP_400_BAD_REQUEST)

    model_id = LANGUAGE_MODELS[language]
    hf_token = getattr(settings, 'HF_API_TOKEN', '').strip()

    headers = {'Content-Type': 'application/json'}
    if hf_token:
        headers['Authorization'] = f'Bearer {hf_token}'

    try:
        resp = requests.post(
            f'https://api-inference.huggingface.co/models/{model_id}',
            headers=headers,
            json={'inputs': text},
            timeout=40,
        )
    except requests.Timeout:
        return Response({'error': 'Request timed out. Please try again.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except Exception:
        return Response({'error': 'Network error connecting to TTS service.'}, status=status.HTTP_502_BAD_GATEWAY)

    if resp.status_code == 503:
        try:
            retry_after = int(resp.json().get('estimated_time', 20))
        except Exception:
            retry_after = 20
        return Response(
            {'error': f'Model is loading, please retry in {retry_after}s.', 'retry_after': retry_after},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    if resp.status_code == 401:
        return Response({'error': 'Invalid HuggingFace API token.'}, status=status.HTTP_502_BAD_GATEWAY)

    if resp.status_code != 200:
        return Response(
            {'error': f'TTS service returned error {resp.status_code}. Please try again.'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # Determine audio content type
    content_type = resp.headers.get('Content-Type', 'audio/wav')
    audio_format = 'wav'
    if 'flac' in content_type:
        audio_format = 'flac'
    elif 'mpeg' in content_type or 'mp3' in content_type:
        audio_format = 'mp3'

    audio_b64 = base64.b64encode(resp.content).decode('utf-8')

    return Response({
        'audio': audio_b64,
        'format': audio_format,
        'model': model_id,
    })
