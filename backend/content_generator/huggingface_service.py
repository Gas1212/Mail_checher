"""
Hugging Face AI Content Generation Service
"""
import requests
import os
from typing import Dict, Optional, Literal

ContentType = Literal[
    'product-title',
    'meta-description',
    'product-description',
    'linkedin-post',
    'facebook-post',
    'instagram-post',
    'tiktok-post',
    'email-subject',
    'email-body'
]

ToneType = Literal['professional', 'casual', 'enthusiastic', 'formal']
LanguageType = Literal['en', 'fr']


class HuggingFaceService:
    """Service for generating content using Hugging Face models"""

    # Model configuration
    PRIMARY_MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct'
    FALLBACK_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'
    API_URL = 'https://api-inference.huggingface.co/models/'

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('HUGGINGFACE_API_KEY')
        if not self.api_key:
            raise ValueError('HUGGINGFACE_API_KEY not configured')

    def _get_prompt(
        self,
        content_type: ContentType,
        product_name: str,
        product_features: Optional[str] = None,
        target_audience: Optional[str] = None,
        tone: ToneType = 'professional',
        language: LanguageType = 'en',
        additional_context: Optional[str] = None
    ) -> str:
        """Generate prompt based on content type and parameters"""

        tone_map = {
            'professional': 'professional and authoritative',
            'casual': 'casual and friendly',
            'enthusiastic': 'enthusiastic and energetic',
            'formal': 'formal and polished',
        }

        selected_tone = tone_map.get(tone, 'professional')
        lang_instruction = 'Write in French.' if language == 'fr' else 'Write in English.'

        prompts = {
            'product-title': f"""{lang_instruction} Generate a compelling, SEO-optimized product title for: {product_name}.
Keep it under 60 characters. Make it {selected_tone}.
{f"Target audience: {target_audience}." if target_audience else ""}
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the title, nothing else.""",

            'meta-description': f"""{lang_instruction} Write a meta description (150-160 characters) for: {product_name}.
{f"Key features: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone} and include a call-to-action.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the meta description, nothing else.""",

            'product-description': f"""{lang_instruction} Write a detailed product description for: {product_name}.
{f"Key features: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}. Include benefits, use cases, and value proposition.
Aim for 150-200 words.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the description, nothing else.""",

            'linkedin-post': f"""{lang_instruction} Write a professional LinkedIn post about: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}. Include:
- Hook/opening line
- Value proposition
- Key insights
- Call-to-action
- 3-5 relevant hashtags
Aim for 150-200 words.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the post content with hashtags at the end.""",

            'facebook-post': f"""{lang_instruction} Write an engaging Facebook post about: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone} and conversational. Include:
- Attention-grabbing opening
- Engaging story or benefit
- Clear call-to-action
- 2-3 emojis
Aim for 100-150 words.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the post content.""",

            'instagram-post': f"""{lang_instruction} Create an Instagram caption for: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone} and visually engaging. Include:
- Compelling caption
- 5-8 emojis placed naturally
- 8-12 relevant hashtags at the end
- Call-to-action
Aim for 125-150 words.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the caption with emojis and hashtags.""",

            'tiktok-post': f"""{lang_instruction} Write a TikTok video caption/script for: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}, catchy, and trend-worthy. Include:
- Hook in first 3 seconds
- Quick value proposition
- Call-to-action
- 5-8 trending/relevant hashtags
Keep it short and punchy (50-100 words).
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the caption with hashtags.""",

            'email-subject': f"""{lang_instruction} Write a compelling email subject line for: {product_name}.
{f"Key message: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}. Keep it under 50 characters.
Make it attention-grabbing and encourage opens.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the subject line, nothing else.""",

            'email-body': f"""{lang_instruction} Write an email body for: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}. Include:
- Personalized greeting
- Clear value proposition
- Key benefits
- Strong call-to-action
- Professional closing
Aim for 150-200 words.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the email body content.""",
        }

        return prompts.get(content_type, '')

    def _call_api(self, model: str, prompt: str) -> Dict:
        """Make API call to Hugging Face"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }

        payload = {
            'inputs': prompt,
            'parameters': {
                'max_new_tokens': 500,
                'temperature': 0.7,
                'top_p': 0.9,
                'do_sample': True,
                'return_full_text': False,
            }
        }

        response = requests.post(
            f'{self.API_URL}{model}',
            headers=headers,
            json=payload,
            timeout=30
        )

        if not response.ok:
            raise Exception(f'API request failed: {response.status_code} - {response.text}')

        return response.json()

    def generate_content(
        self,
        content_type: ContentType,
        product_name: str,
        product_features: Optional[str] = None,
        target_audience: Optional[str] = None,
        tone: ToneType = 'professional',
        language: LanguageType = 'en',
        additional_context: Optional[str] = None
    ) -> Dict:
        """
        Generate content using Hugging Face models

        Returns:
            {
                'success': bool,
                'content': str,
                'model': str,
                'error': Optional[str]
            }
        """
        try:
            prompt = self._get_prompt(
                content_type=content_type,
                product_name=product_name,
                product_features=product_features,
                target_audience=target_audience,
                tone=tone,
                language=language,
                additional_context=additional_context
            )

            # Try primary model
            try:
                data = self._call_api(self.PRIMARY_MODEL, prompt)
                model_used = self.PRIMARY_MODEL
            except Exception as e:
                print(f'Primary model failed: {e}, trying fallback...')
                # Fallback to secondary model
                data = self._call_api(self.FALLBACK_MODEL, prompt)
                model_used = self.FALLBACK_MODEL

            # Extract generated text
            generated_text = ''
            if isinstance(data, list) and len(data) > 0:
                generated_text = data[0].get('generated_text', '')
            elif isinstance(data, dict):
                generated_text = data.get('generated_text', '')

            generated_text = generated_text.strip()

            return {
                'success': True,
                'content': generated_text,
                'model': model_used,
                'error': None
            }

        except Exception as e:
            return {
                'success': False,
                'content': '',
                'model': '',
                'error': str(e)
            }
