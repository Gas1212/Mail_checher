import io
import base64
from PIL import Image
from rest_framework.decorators import api_view, throttle_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class UpscalerThrottle(AnonRateThrottle):
    rate = '10/min'


MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_DIMENSION = 2000              # px — limit input so 4x doesn't exceed 8000px
SCALE = 4

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

    try:
        img = Image.open(image_file)
        img = img.convert('RGBA')

        w, h = img.size
        if w > MAX_DIMENSION or h > MAX_DIMENSION:
            return Response(
                {'error': f'Image too large. Maximum {MAX_DIMENSION}×{MAX_DIMENSION} px.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_w, new_h = w * SCALE, h * SCALE
        upscaled = img.resize((new_w, new_h), Image.LANCZOS)

        # Apply a mild unsharp mask to enhance details post-upscale
        from PIL import ImageFilter
        upscaled = upscaled.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=3))

        buf = io.BytesIO()
        upscaled.save(buf, format='PNG', optimize=True)
        buf.seek(0)

        result_b64 = base64.b64encode(buf.read()).decode('utf-8')
        return Response({
            'image': result_b64,
            'format': 'png',
            'original_size': f'{w}×{h}',
            'upscaled_size': f'{new_w}×{new_h}',
        })

    except Exception as e:
        return Response({'error': f'Upscaling failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
