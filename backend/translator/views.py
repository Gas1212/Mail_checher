import requests
from django.conf import settings
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class TranslatorThrottle(AnonRateThrottle):
    rate = '10/min'


HF_BASE = 'https://router.huggingface.co/hf-inference/models/Helsinki-NLP'

MAX_CHARS = 1000

# ISO 639-1 codes used by Helsinki-NLP opus-mt models
LANGUAGES = {
    'arabic':     'ar',
    'english':    'en',
    'french':     'fr',
    'german':     'de',
    'spanish':    'es',
    'italian':    'it',
    'portuguese': 'pt',
    'russian':    'ru',
    'chinese':    'zh',
    'turkish':    'tr',
    'dutch':      'nl',
}

LANG_LABELS = {k: k.capitalize() for k in LANGUAGES}


def _hf_translate(text: str, src_code: str, tgt_code: str, token: str) -> str:
    """Call Helsinki-NLP opus-mt-{src}-{tgt} model. Raises on failure."""
    url = f'{HF_BASE}/opus-mt-{src_code}-{tgt_code}'
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    resp = requests.post(url, headers=headers, json={'inputs': text}, timeout=30)

    if resp.status_code == 404:
        raise ValueError('no_model')
    if resp.status_code == 503:
        raise RuntimeError('loading')
    if resp.status_code != 200:
        raise RuntimeError(f'hf_{resp.status_code}')

    data = resp.json()
    if isinstance(data, list) and data and 'translation_text' in data[0]:
        return data[0]['translation_text']
    raise RuntimeError('bad_response')


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

    src_code = LANGUAGES[source]
    tgt_code = LANGUAGES[target]

    try:
        # Try direct model (e.g. opus-mt-en-fr)
        translation = _hf_translate(text, src_code, tgt_code, token)
        return Response({'translation': translation})

    except ValueError:
        # No direct model — pivot through English
        if source == 'english' or target == 'english':
            return Response(
                {'error': f'No translation model for {LANG_LABELS[source]} → {LANG_LABELS[target]}.'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        try:
            en_text = _hf_translate(text, src_code, 'en', token)
            translation = _hf_translate(en_text, 'en', tgt_code, token)
            return Response({'translation': translation})
        except ValueError:
            return Response(
                {'error': f'No translation model for {LANG_LABELS[source]} → {LANG_LABELS[target]}.'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        except RuntimeError as e:
            if 'loading' in str(e):
                return Response(
                    {'error': 'Model is loading, please retry in 20 seconds.', 'loading': True},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
            return Response({'error': 'Translation failed. Please try again.'}, status=status.HTTP_502_BAD_GATEWAY)

    except RuntimeError as e:
        if 'loading' in str(e):
            return Response(
                {'error': 'Model is loading, please retry in 20 seconds.', 'loading': True},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({'error': 'Translation failed. Please try again.'}, status=status.HTTP_502_BAD_GATEWAY)

    except requests.Timeout:
        return Response({'error': 'Translation timed out. Please try again.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)

    except requests.RequestException as e:
        return Response({'error': f'Network error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)
