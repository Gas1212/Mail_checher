from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import requests
import xml.etree.ElementTree as ET
from urllib.parse import urljoin, urlparse
from datetime import datetime
import re
from bs4 import BeautifulSoup


class SitemapToolsViewSet(viewsets.ViewSet):
    """
    ViewSet for SEO sitemap operations
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='generate-sitemap')
    def generate_sitemap(self, request):
        """
        Generate a sitemap from provided URLs
        POST /api/seo/generate-sitemap/
        Body: {
            "urls": [
                {
                    "loc": "https://example.com/page1",
                    "priority": "1.0",
                    "changefreq": "daily"
                }
            ],
            "domain": "https://example.com"
        }
        """
        try:
            urls = request.data.get('urls', [])
            domain = request.data.get('domain', '')

            if not urls:
                return Response(
                    {'error': 'URLs list is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create sitemap XML
            urlset = ET.Element('urlset')
            urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

            for url_data in urls:
                url_elem = ET.SubElement(urlset, 'url')

                loc = ET.SubElement(url_elem, 'loc')
                loc.text = url_data.get('loc', '')

                if url_data.get('lastmod'):
                    lastmod = ET.SubElement(url_elem, 'lastmod')
                    lastmod.text = url_data.get('lastmod')

                if url_data.get('changefreq'):
                    changefreq = ET.SubElement(url_elem, 'changefreq')
                    changefreq.text = url_data.get('changefreq')

                if url_data.get('priority'):
                    priority = ET.SubElement(url_elem, 'priority')
                    priority.text = str(url_data.get('priority'))

            # Convert to string
            xml_string = ET.tostring(urlset, encoding='unicode', method='xml')

            # Pretty print
            xml_declaration = '<?xml version="1.0" encoding="UTF-8"?>\n'
            formatted_xml = xml_declaration + xml_string

            return Response({
                'sitemap': formatted_xml,
                'url_count': len(urls),
                'generated_at': datetime.now().isoformat(),
                'download_instructions': [
                    'Save this sitemap as sitemap.xml',
                    'Upload it to your website root directory',
                    'Submit it to Google Search Console',
                    'Add sitemap URL to your robots.txt file'
                ]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Failed to generate sitemap: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], url_path='validate-sitemap')
    def validate_sitemap(self, request):
        """
        Validate a sitemap XML
        POST /api/seo/validate-sitemap/
        Body: {
            "sitemap_url": "https://example.com/sitemap.xml"
            OR
            "sitemap_content": "<xml>...</xml>"
        }
        """
        try:
            sitemap_url = request.data.get('sitemap_url')
            sitemap_content = request.data.get('sitemap_content')

            errors = []
            warnings = []
            url_count = 0
            urls = []
            response_time = 0
            import time

            # Get sitemap content
            if sitemap_url:
                start_time = time.time()
                try:
                    response = requests.get(sitemap_url, timeout=10, headers={
                        'User-Agent': 'Mozilla/5.0 (compatible; SitemapValidator/1.0)'
                    })
                    response.raise_for_status()
                    sitemap_content = response.text
                    response_time = int((time.time() - start_time) * 1000)  # Convert to milliseconds
                except requests.exceptions.RequestException as e:
                    return Response(
                        {'error': f'Failed to fetch sitemap: {str(e)}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            if not sitemap_content:
                return Response(
                    {'error': 'Either sitemap_url or sitemap_content is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Parse XML
            try:
                root = ET.fromstring(sitemap_content)
            except ET.ParseError as e:
                errors.append(f'Invalid XML syntax: {str(e)}')
                return Response({
                    'is_valid': False,
                    'errors': errors,
                    'warnings': warnings,
                    'url_count': 0,
                    'urls': []
                }, status=status.HTTP_200_OK)

            # Check namespace
            namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

            # Extract URLs
            url_elements = root.findall('.//ns:url', namespace)
            if not url_elements:
                # Try without namespace
                url_elements = root.findall('.//url')

            if not url_elements:
                errors.append('No URL entries found in sitemap')

            for idx, url_elem in enumerate(url_elements):
                loc_elem = url_elem.find('ns:loc', namespace) or url_elem.find('loc')

                if loc_elem is None or not loc_elem.text:
                    errors.append(f'URL #{idx + 1}: Missing <loc> element')
                    continue

                url = loc_elem.text.strip()
                url_info = {'loc': url}

                # Validate URL format
                if not url.startswith(('http://', 'https://')):
                    errors.append(f'URL #{idx + 1}: Invalid URL format - {url}')

                # Check URL length
                if len(url) > 2048:
                    warnings.append(f'URL #{idx + 1}: URL exceeds 2048 characters')

                # Extract other elements
                lastmod_elem = url_elem.find('ns:lastmod', namespace) or url_elem.find('lastmod')
                if lastmod_elem is not None and lastmod_elem.text:
                    url_info['lastmod'] = lastmod_elem.text.strip()

                changefreq_elem = url_elem.find('ns:changefreq', namespace) or url_elem.find('changefreq')
                if changefreq_elem is not None and changefreq_elem.text:
                    changefreq = changefreq_elem.text.strip()
                    url_info['changefreq'] = changefreq
                    valid_changefreq = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
                    if changefreq not in valid_changefreq:
                        warnings.append(f'URL #{idx + 1}: Invalid changefreq value - {changefreq}')

                priority_elem = url_elem.find('ns:priority', namespace) or url_elem.find('priority')
                if priority_elem is not None and priority_elem.text:
                    try:
                        priority = float(priority_elem.text.strip())
                        url_info['priority'] = priority
                        if priority < 0 or priority > 1:
                            warnings.append(f'URL #{idx + 1}: Priority should be between 0.0 and 1.0')
                    except ValueError:
                        warnings.append(f'URL #{idx + 1}: Invalid priority value')

                urls.append(url_info)
                url_count += 1

            # Check URL count limit
            if url_count > 50000:
                warnings.append(f'Sitemap contains {url_count} URLs. Maximum recommended is 50,000')

            # Check file size
            size_bytes = len(sitemap_content.encode('utf-8'))
            size_kb = size_bytes / 1024
            size_mb = size_bytes / (1024 * 1024)
            if size_mb > 50:
                warnings.append(f'Sitemap size is {size_mb:.2f}MB. Maximum recommended is 50MB')

            is_valid = len(errors) == 0

            # Calculate metadata coverage
            metadata_coverage = self._calculate_metadata_coverage(urls)

            # Calculate performance score
            score = self._calculate_score(is_valid, errors, warnings, url_count, size_mb, metadata_coverage)

            return Response({
                'is_valid': is_valid,
                'score': score,
                'errors': errors,
                'warnings': warnings,
                'url_count': url_count,
                'urls': urls[:100],  # Return first 100 URLs for preview
                'total_size_kb': round(size_kb, 1),
                'total_size_mb': round(size_mb, 2),
                'response_time': response_time,
                'metadata_coverage': metadata_coverage,
                'validated_at': datetime.now().isoformat(),
                'recommendations': self._get_validation_recommendations(errors, warnings, url_count, size_mb)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Validation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], url_path='find-sitemap')
    def find_sitemap(self, request):
        """
        Find and check sitemap for a domain
        POST /api/seo/find-sitemap/
        Body: { "domain": "https://example.com" }
        """
        try:
            domain = request.data.get('domain', '').strip()

            if not domain:
                return Response(
                    {'error': 'Domain is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Normalize domain
            if not domain.startswith(('http://', 'https://')):
                domain = 'https://' + domain

            parsed = urlparse(domain)
            base_url = f"{parsed.scheme}://{parsed.netloc}"

            sitemaps_found = []
            errors = []

            # Common sitemap locations
            sitemap_paths = [
                '/sitemap.xml',
                '/sitemap_index.xml',
                '/sitemap1.xml',
                '/sitemap-index.xml',
                '/sitemap/sitemap.xml',
                '/sitemaps/sitemap.xml',
            ]

            # Check robots.txt first
            try:
                robots_url = urljoin(base_url, '/robots.txt')
                response = requests.get(robots_url, timeout=5, headers={
                    'User-Agent': 'Mozilla/5.0 (compatible; SitemapFinder/1.0)'
                })

                if response.status_code == 200:
                    # Extract sitemap URLs from robots.txt
                    for line in response.text.split('\n'):
                        if line.lower().startswith('sitemap:'):
                            sitemap_url = line.split(':', 1)[1].strip()
                            if sitemap_url not in [s['url'] for s in sitemaps_found]:
                                # Check if sitemap exists
                                try:
                                    sitemap_response = requests.head(sitemap_url, timeout=5, headers={
                                        'User-Agent': 'Mozilla/5.0 (compatible; SitemapFinder/1.0)'
                                    })
                                    if sitemap_response.status_code == 200:
                                        sitemaps_found.append({
                                            'url': sitemap_url,
                                            'source': 'robots.txt',
                                            'status': 'accessible',
                                            'status_code': 200
                                        })
                                except:
                                    pass
            except Exception as e:
                errors.append(f'Failed to check robots.txt: {str(e)}')

            # Check common sitemap locations
            for path in sitemap_paths:
                sitemap_url = urljoin(base_url, path)

                # Skip if already found from robots.txt
                if sitemap_url in [s['url'] for s in sitemaps_found]:
                    continue

                try:
                    response = requests.head(sitemap_url, timeout=5, headers={
                        'User-Agent': 'Mozilla/5.0 (compatible; SitemapFinder/1.0)'
                    }, allow_redirects=True)

                    if response.status_code == 200:
                        sitemaps_found.append({
                            'url': sitemap_url,
                            'source': 'common location',
                            'status': 'accessible',
                            'status_code': response.status_code
                        })
                except:
                    pass

            # Get details for each sitemap found
            for sitemap in sitemaps_found:
                try:
                    response = requests.get(sitemap['url'], timeout=10, headers={
                        'User-Agent': 'Mozilla/5.0 (compatible; SitemapFinder/1.0)'
                    })

                    if response.status_code == 200:
                        # Parse XML to count URLs
                        try:
                            root = ET.fromstring(response.content)
                            namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

                            # Check if it's a sitemap index
                            sitemap_elems = root.findall('.//ns:sitemap', namespace)
                            if sitemap_elems:
                                sitemap['type'] = 'sitemap_index'
                                sitemap['sitemap_count'] = len(sitemap_elems)
                            else:
                                # Regular sitemap
                                url_elems = root.findall('.//ns:url', namespace) or root.findall('.//url')
                                sitemap['type'] = 'urlset'
                                sitemap['url_count'] = len(url_elems)

                            # Get file size
                            sitemap['size_bytes'] = len(response.content)
                            sitemap['size_mb'] = round(len(response.content) / (1024 * 1024), 2)

                            # Get last modified
                            if 'Last-Modified' in response.headers:
                                sitemap['last_modified'] = response.headers['Last-Modified']

                        except ET.ParseError:
                            sitemap['type'] = 'invalid_xml'
                            sitemap['error'] = 'Failed to parse XML'
                except Exception as e:
                    sitemap['error'] = str(e)

            if not sitemaps_found:
                return Response({
                    'found': False,
                    'domain': domain,
                    'sitemaps': [],
                    'errors': errors if errors else ['No sitemaps found'],
                    'checked_at': datetime.now().isoformat(),
                    'recommendations': [
                        'Create a sitemap.xml file for your website',
                        'Add sitemap URL to robots.txt',
                        'Submit sitemap to Google Search Console',
                        'Use common sitemap locations like /sitemap.xml'
                    ]
                }, status=status.HTTP_200_OK)

            return Response({
                'found': True,
                'domain': domain,
                'sitemaps': sitemaps_found,
                'sitemap_count': len(sitemaps_found),
                'errors': errors,
                'checked_at': datetime.now().isoformat(),
                'recommendations': self._get_finder_recommendations(sitemaps_found)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Failed to find sitemaps: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _calculate_metadata_coverage(self, urls):
        """Calculate metadata coverage percentage"""
        if not urls:
            return {
                'lastmod': 0,
                'priority': 0,
                'changefreq': 0
            }

        lastmod_count = sum(1 for url in urls if url.get('lastmod'))
        priority_count = sum(1 for url in urls if url.get('priority') is not None)
        changefreq_count = sum(1 for url in urls if url.get('changefreq'))

        total_urls = len(urls)

        return {
            'lastmod': round((lastmod_count / total_urls) * 100, 1) if total_urls > 0 else 0,
            'priority': round((priority_count / total_urls) * 100, 1) if total_urls > 0 else 0,
            'changefreq': round((changefreq_count / total_urls) * 100, 1) if total_urls > 0 else 0
        }

    def _calculate_score(self, is_valid, errors, warnings, url_count, size_mb, metadata_coverage):
        """Calculate overall sitemap score (0-100)"""
        score = 100

        # Deduct points for errors (critical)
        score -= len(errors) * 20  # -20 points per error

        # Deduct points for warnings (minor)
        score -= len(warnings) * 5  # -5 points per warning

        # Deduct points for size issues
        if size_mb > 50:
            score -= 15
        elif size_mb > 40:
            score -= 10

        # Deduct points for too many URLs
        if url_count > 50000:
            score -= 15
        elif url_count > 40000:
            score -= 10

        # Deduct points for no URLs
        if url_count == 0:
            score -= 50

        # Bonus for good metadata coverage
        avg_coverage = (metadata_coverage['lastmod'] + metadata_coverage['priority'] + metadata_coverage['changefreq']) / 3
        if avg_coverage > 80:
            score += 5
        elif avg_coverage < 30:
            score -= 5

        # Ensure score is between 0 and 100
        return max(0, min(100, score))

    def _get_validation_recommendations(self, errors, warnings, url_count, size_mb):
        """Generate recommendations based on validation results"""
        recommendations = []

        if errors:
            recommendations.append('Fix all errors before submitting to search engines')

        if warnings:
            recommendations.append('Review warnings to improve sitemap quality')

        if url_count > 40000:
            recommendations.append('Consider splitting sitemap into multiple files')

        if url_count == 0:
            recommendations.append('Add URLs to your sitemap')

        if size_mb > 40:
            recommendations.append('Consider compressing large sitemaps with gzip')

        recommendations.extend([
            'Keep your sitemap updated regularly',
            'Submit sitemap to Google Search Console',
            'Add sitemap reference to robots.txt'
        ])

        return recommendations

    def _get_finder_recommendations(self, sitemaps):
        """Generate recommendations based on found sitemaps"""
        recommendations = []

        has_index = any(s.get('type') == 'sitemap_index' for s in sitemaps)
        has_robots = any(s.get('source') == 'robots.txt' for s in sitemaps)

        if not has_robots:
            recommendations.append('Add sitemap reference to robots.txt')

        if has_index:
            recommendations.append('Sitemap index found - good for large sites')

        for sitemap in sitemaps:
            if sitemap.get('size_mb', 0) > 40:
                recommendations.append(f"Sitemap {sitemap['url']} is large - consider splitting")

            if sitemap.get('url_count', 0) > 40000:
                recommendations.append(f"Sitemap {sitemap['url']} has many URLs - consider splitting")

        recommendations.extend([
            'Verify all sitemaps in Google Search Console',
            'Keep sitemaps updated regularly',
            'Monitor sitemap errors in search console'
        ])

        return recommendations
