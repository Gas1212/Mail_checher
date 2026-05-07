import asyncio
import base64
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class TTSThrottle(AnonRateThrottle):
    rate = '10/min'


# Microsoft Edge Neural voices — high quality, free, no API key
VOICES = {
    'arabic':  'ar-SA-ZariyahNeural',
    'english': 'en-US-JennyNeural',
    'french':  'fr-FR-DeniseNeural',
    'german':  'de-DE-KatjaNeural',
}

MAX_CHARS = 500


async def _edge_tts(text: str, voice: str) -> bytes:
    import edge_tts
    communicate = edge_tts.Communicate(text, voice)
    chunks = []
    async for chunk in communicate.stream():
        if chunk['type'] == 'audio':
            chunks.append(chunk['data'])
    return b''.join(chunks)


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

    if language not in VOICES:
        return Response({'error': f'Unsupported language: {language}.'}, status=status.HTTP_400_BAD_REQUEST)

    voice = VOICES[language]

    try:
        audio_bytes = asyncio.run(_edge_tts(text, voice))
    except RuntimeError:
        # Fallback if event loop already running (unlikely in WSGI but safe)
        loop = asyncio.new_event_loop()
        try:
            audio_bytes = loop.run_until_complete(_edge_tts(text, voice))
        finally:
            loop.close()
    except Exception as e:
        return Response(
            {'error': f'TTS generation failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if not audio_bytes:
        return Response({'error': 'No audio generated. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')

    return Response({
        'audio': audio_b64,
        'format': 'mp3',
        'voice': voice,
    })
