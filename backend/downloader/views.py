from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle


class DownloaderThrottle(AnonRateThrottle):
    rate = '5/min'


PLATFORM_MAP = {
    'youtube': 'youtube',
    'youtu': 'youtube',
    'twitter': 'twitter',
    'x.com': 'twitter',
    'instagram': 'instagram',
    'facebook': 'facebook',
    'fb': 'facebook',
    'tiktok': 'tiktok',
    'vimeo': 'vimeo',
    'dailymotion': 'dailymotion',
}

QUALITY_LABELS = {
    2160: '4K',
    1440: '1440p',
    1080: '1080p',
    720: '720p',
    480: '480p',
    360: '360p',
    240: '240p',
    144: '144p',
}


def detect_platform(url, extractor=''):
    src = (url + extractor).lower()
    for key, val in PLATFORM_MAP.items():
        if key in src:
            return val
    return 'other'


def format_duration(seconds):
    if not seconds:
        return None
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h:
        return f'{h}:{m:02d}:{s:02d}'
    return f'{m}:{s:02d}'


@api_view(['POST'])
@throttle_classes([DownloaderThrottle])
def extract_info(request):
    url = request.data.get('url', '').strip()
    if not url:
        return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)

    if not (url.startswith('http://') or url.startswith('https://')):
        return Response({'error': 'Invalid URL'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        import yt_dlp
    except ImportError:
        return Response({'error': 'yt-dlp not installed on server'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'socket_timeout': 15,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
    except Exception as e:
        msg = str(e)
        if 'impersonation' in msg.lower() or 'impersonate' in msg.lower():
            return Response(
                {'error': 'This platform requires browser emulation not available on this server. Try YouTube, Twitter, Instagram or Facebook instead.'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        if 'private' in msg.lower() or 'login' in msg.lower():
            return Response({'error': 'This content is private or requires login'}, status=status.HTTP_403_FORBIDDEN)
        if 'not available' in msg.lower() or 'unavailable' in msg.lower():
            return Response({'error': 'Video not available in your region or has been removed'}, status=status.HTTP_404_NOT_FOUND)
        if 'unsupported url' in msg.lower():
            return Response({'error': 'This URL is not supported. Try YouTube, Twitter, Instagram or Facebook.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Could not extract video. The platform may be unsupported or the content unavailable.'}, status=status.HTTP_400_BAD_REQUEST)

    platform = detect_platform(url, info.get('extractor', ''))

    # Collect video formats (with both video and audio streams)
    raw_formats = info.get('formats', [])
    video_formats = []
    seen_heights = set()
    audio_format = None

    # Find best audio-only format
    for f in reversed(raw_formats):
        if f.get('vcodec') == 'none' and f.get('acodec') != 'none':
            ext = f.get('ext', 'm4a')
            if ext in ('m4a', 'mp3', 'ogg', 'opus', 'webm'):
                audio_format = {
                    'url': f.get('url', ''),
                    'ext': ext,
                }
                break

    # Find combined video+audio formats
    for f in reversed(raw_formats):
        vcodec = f.get('vcodec', 'none')
        acodec = f.get('acodec', 'none')
        height = f.get('height')
        ext = f.get('ext', 'mp4')

        if vcodec == 'none' or acodec == 'none':
            continue
        if not height:
            continue
        if ext not in ('mp4', 'webm', 'mov'):
            continue
        if height in seen_heights:
            continue

        seen_heights.add(height)
        label = QUALITY_LABELS.get(height, f'{height}p')
        video_formats.append({
            'quality': label,
            'height': height,
            'ext': ext,
            'url': f.get('url', ''),
            'filesize': f.get('filesize') or f.get('filesize_approx'),
        })

    # Sort best quality first
    video_formats.sort(key=lambda x: x['height'], reverse=True)

    # If no combined formats (e.g. YouTube high-quality), use best single format
    if not video_formats and raw_formats:
        best = max(
            (f for f in raw_formats if f.get('height') and f.get('ext') in ('mp4', 'webm')),
            key=lambda f: f.get('height', 0),
            default=None,
        )
        if best:
            height = best.get('height', 0)
            video_formats.append({
                'quality': QUALITY_LABELS.get(height, f'{height}p'),
                'height': height,
                'ext': best.get('ext', 'mp4'),
                'url': best.get('url', ''),
                'filesize': best.get('filesize') or best.get('filesize_approx'),
            })

    return Response({
        'title': info.get('title', 'Video'),
        'thumbnail': info.get('thumbnail'),
        'duration': format_duration(info.get('duration')),
        'platform': platform,
        'formats': video_formats,
        'audio': audio_format,
    })
