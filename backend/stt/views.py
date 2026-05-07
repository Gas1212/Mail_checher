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

# Models tried in order; fallback if first is unavailable
HF_MODELS = [
    'openai/whisper-large-v3-turbo',
    'openai/whisper-large-v3',
]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_TYPES = {
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav',
    'audio/ogg', 'audio/webm', 'audio/flac', 'audio/mp4', 'audio/m4a',
    'audio/x-m4a', 'video/webm', 'audio/x-flac',
}

# Normalize browser/OS MIME types to what HF router accepts
CT_NORMALIZE = {
    'audio/mp3':   'audio/mpeg',
    'audio/wave':  'audio/wav',
    'audio/x-wav': 'audio/wav',
    'video/webm':  'audio/webm',
    'audio/x-m4a': 'audio/m4a',
    'audio/x-flac': 'audio/flac',
}


def _normalize_ct(ct: str) -> str:
    """Strip codec params and normalize to HF-accepted MIME type."""
    base = ct.split(';')[0].strip().lower()
    return CT_NORMALIZE.get(base, base)


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
    base_ct = raw_ct.split(';')[0].strip().lower()
    if base_ct not in ALLOWED_TYPES:
        return Response({'error': f'Unsupported audio format: {raw_ct}.'}, status=status.HTTP_400_BAD_REQUEST)

    hf_ct = _normalize_ct(raw_ct)
    token = settings.HF_API_TOKEN
    if not token:
        return Response({'error': 'Transcription service not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    audio_bytes = audio_file.read()
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': hf_ct}

    last_err = ''
    try:
        for model in HF_MODELS:
            resp = requests.post(f'{HF_BASE}/{model}', headers=headers, data=audio_bytes, timeout=60)

            if resp.status_code == 200:
                data = resp.json()
                if 'text' in data:
                    return Response({'text': data['text']})
                return Response({'error': 'Unexpected response from transcription service.'}, status=status.HTTP_502_BAD_GATEWAY)

            if resp.status_code == 503:
                return Response({'error': 'Model is loading, please retry in 20 seconds.', 'loading': True}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            err_body = resp.text[:300]
            # "not supported by provider" → try next model
            if resp.status_code == 400 and 'not supported' in err_body.lower():
                last_err = err_body
                continue

            # Any other error (bad audio, etc.) → return immediately
            return Response({'error': f'Transcription failed: {err_body}'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': f'No Whisper model available. {last_err}'}, status=status.HTTP_502_BAD_GATEWAY)

    except requests.Timeout:
        return Response({'error': 'Transcription timed out. Please try a shorter audio file.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.RequestException as e:
        return Response({'error': f'Network error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)
