import requests
import base64
from django.conf import settings
from rest_framework.decorators import api_view, throttle_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class UpscalerThrottle(AnonRateThrottle):
    rate = '5/min'


HF_MODEL = 'caidas/swin2SR-realworld-sr-x4-64'
HF_API_URL = f'https://api-inference.huggingface.co/models/{HF_MODEL}'

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

ALLOWED_TYPES = {'image/jpeg', 'image/jpg', 'image/png', 'image/webp'}


@api_view(['POST'])
@throttle_classes([UpscalerThrottle])
@parser_classes([MultiPartParser, FormParser])
def upscale(request):
    image_file = request.FILES.get('image')
    if not image_file:
        return Response({'error': 'Image file is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if image_file.size > MAX_FILE_SIZE:
        return Response({'error': 'File too large. Maximum 5 MB.'}, status=status.HTTP_400_BAD_REQUEST)

    content_type = image_file.content_type or 'image/jpeg'
    if content_type not in ALLOWED_TYPES:
        return Response({'error': 'Unsupported format. Use JPEG, PNG, or WebP.'}, status=status.HTTP_400_BAD_REQUEST)

    token = settings.HF_API_TOKEN
    if not token:
        return Response({'error': 'Upscaling service not configured.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    image_bytes = image_file.read()

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': content_type,
    }

    try:
        resp = requests.post(HF_API_URL, headers=headers, data=image_bytes, timeout=60)
    except requests.Timeout:
        return Response({'error': 'Request timed out. Please try a smaller image.'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.RequestException as e:
        return Response({'error': f'Network error: {str(e)}'}, status=status.HTTP_502_BAD_GATEWAY)

    if resp.status_code == 503:
        return Response({'error': 'Model is loading, please retry in 20 seconds.', 'loading': True}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    if resp.status_code != 200:
        return Response(
            {'error': f'Upscaling failed ({resp.status_code}). Please try again.'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # Response is binary PNG image
    result_b64 = base64.b64encode(resp.content).decode('utf-8')
    return Response({'image': result_b64, 'format': 'png'})
