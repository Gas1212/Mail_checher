from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Site, Review
from .serializers import SiteSerializer, ReviewSerializer


@api_view(['GET', 'POST'])
def site_list(request):
    if request.method == 'GET':
        sites = Site.objects.prefetch_related('reviews').all()
        serializer = SiteSerializer(sites, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = SiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_review(request, site_id):
    try:
        site = Site.objects.get(pk=site_id)
    except Site.DoesNotExist:
        return Response({'error': 'Site not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(site=site)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
