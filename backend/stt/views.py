import requests
from django.conf import settings
from rest_framework.decorators import api_view, throttle_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class STTThrottle(AnonRateThrottle):
    rate = '5/min'


HF_BASE = 'https://router.huggingface.co/hf-inference/models'

# Try models in order — largest/best first, fallback to smaller
HF_MODELS = [
    'openai/whisper-large-v3-turbo',
    'openai/whisper-large-v3',
    'openai/whisper-base',
]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_TYPES = {
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav',
    'audio/ogg', 'audio/webm', 'audio/flac', 'audio/mp4', 'audio/m4a',
    'audio/x-m4a', 'video/webm',
}


def _normalize_content_type(ct: str) -> str:
    """Strip codec params: 'audio/webm; codecs=opus' → 'audio/webm'"""
    return ct.split(';')[0].strip()


def _hf_transcribe(audio_bytes: bytes, content_type: str, token: str) -> str:
    """Try each Whisper model in order; raises ValueError if none work."""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': content_type,
    }
    last_error = ''
    for model in HF_MODELS:
        url = f'{HF_BASE}/{model}'
        resp = requests.post(url, headers=headers, data=audio_bytes, timeout=60)
        if resp.status_code == 200:
            data = resp.json()
            if 'text' in data:
                return data['text']
            raise ValueError(f'Unexpected response: {resp.text[:200]}')
        if resp.status_code == 503:
            raise RuntimeError('loading')
        # 400 = model not supported on this provider — try next model
        last_error = f'{resp.status_code}: {resp.text[:200]}'
    raise ValueError(f'No working model found. Last error: {last_error}')


@api_view(['POST'])
@throttle_classes([STTThrottle])
@parser_classes([MultiPartParser, FormParser])
def transcribe(request):
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({'error': 'Audio file is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if audio_file.size > MAX_FILE_SIZE:
        return Response({'error': 'File too large. Maximum 10 MB.'}, status=status.HTTP_400_BAD_REQUEST)

    raw_ct = audio_file.content_type or 'audio/mpeg'
    content_type = _normalize_content_type(raw_ct)
    if content_type not in ALLOWED_TYPES:
        return Response({'error': f'Unsupported audio format: {raw_ct}.'}, status=status.HTTP_400_BAD_REQUEST)

    token = settings.HF_API_TOKEN
    if not token:
        return Response({'error': 'Transcription service not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    audio_bytes = audio_file.read()

    try:
        text = _hf_transcribe(audio_bytes, content_type, token)
        return Response({'text': text})
    except RuntimeError:
        return Response(
            {'error': 'Model is loading, please retry in 20 seconds.', 'loading': True},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
    except requests.Timeout:
        return Response({'error': 'Transcription timed out. Please try a shorter audio file.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.RequestException as e:
        return Response({'error': f'Network error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)
