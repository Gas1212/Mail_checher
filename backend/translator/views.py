import requests
from django.conf import settings
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class TranslatorThrottle(AnonRateThrottle):
    rate = '10/min'


HF_MODEL = 'facebook/nllb-200-distilled-600M'
HF_API_URL = f'https://api-inference.huggingface.co/models/{HF_MODEL}'

MAX_CHARS = 1000

# NLLB-200 language codes
LANGUAGES = {
    'arabic':     'arb_Arab',
    'english':    'eng_Latn',
    'french':     'fra_Latn',
    'german':     'deu_Latn',
    'spanish':    'spa_Latn',
    'italian':    'ita_Latn',
    'portuguese': 'por_Latn',
    'russian':    'rus_Cyrl',
    'chinese':    'zho_Hans',
    'japanese':   'jpn_Jpan',
    'turkish':    'tur_Latn',
    'dutch':      'nld_Latn',
}


@api_view(['POST'])
@throttle_classes([TranslatorThrottle])
def translate(request):
    text = request.data.get('text', '').strip()
    source = request.data.get('source_lang', 'english').lower()
    target = request.data.get('target_lang', 'french').lower()

    if not text:
        return Response({'error': 'Text is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(text) > MAX_CHARS:
        return Response(
            {'error': f'Text too long. Maximum {MAX_CHARS} characters.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if source not in LANGUAGES:
        return Response({'error': f'Unsupported source language: {source}.'}, status=status.HTTP_400_BAD_REQUEST)

    if target not in LANGUAGES:
        return Response({'error': f'Unsupported target language: {target}.'}, status=status.HTTP_400_BAD_REQUEST)

    if source == target:
        return Response({'translation': text})

    token = settings.HF_API_TOKEN
    if not token:
        return Response({'error': 'Translation service not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    payload = {
        'inputs': text,
        'parameters': {
            'src_lang': LANGUAGES[source],
            'tgt_lang': LANGUAGES[target],
        },
    }

    try:
        resp = requests.post(HF_API_URL, headers=headers, json=payload, timeout=30)
    except requests.Timeout:
        return Response({'error': 'Translation timed out. Please try again.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.RequestException as e:
        return Response({'error': f'Network error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

    if resp.status_code == 503:
        # Model loading
        return Response({'error': 'Model is loading, please retry in 20 seconds.', 'loading': True}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    if resp.status_code != 200:
        return Response(
            {'error': f'Translation service error ({resp.status_code}). Please try again.'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    data = resp.json()

    if isinstance(data, list) and len(data) > 0 and 'translation_text' in data[0]:
        return Response({'translation': data[0]['translation_text']})

    return Response({'error': 'Unexpected response from translation service.'}, status=status.HTTP_502_BAD_GATEWAY)
