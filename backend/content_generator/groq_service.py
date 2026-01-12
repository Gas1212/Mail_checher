"""
Groq API Content Generation Service
Ultra-fast inference with free tier
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


class GroqService:
    """Service for generating content using Groq API (ultra-fast)"""

    # Groq API configuration
    API_URL = 'https://api.groq.com/openai/v1/chat/completions'

    # Models available on Groq (all free)
    PRIMARY_MODEL = 'llama-3.1-8b-instant'  # Fast and good quality
    FALLBACK_MODEL = 'llama-3.2-3b-preview'  # Faster, lighter

    # Generation parameters per content type
    GENERATION_CONFIGS = {
        'product-title': {
            'max_tokens': 80,
            'temperature': 0.7,
        },
        'meta-description': {
            'max_tokens': 200,
            'temperature': 0.7,
        },
        'product-description': {
            'max_tokens': 300,
            'temperature': 0.8,
        },
        'linkedin-post': {
            'max_tokens': 80,
            'temperature': 0.8,
        },
        'facebook-post': {
            'max_tokens': 80,
            'temperature': 0.8,
        },
        'instagram-post': {
            'max_tokens': 80,
            'temperature': 0.85,
        },
        'tiktok-post': {
            'max_tokens': 80,
            'temperature': 0.9,
        },
        'email-subject': {
            'max_tokens': 50,
            'temperature': 0.7,
        },
        'email-body': {
            'max_tokens': 150,
            'temperature': 0.75,
        },
    }

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('GROQ_API_KEY')

        if not self.api_key:
            raise ValueError('GROQ_API_KEY must be configured')

        print(f"Content Generator configured: Groq API (Ultra-fast, Free)")

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

        # Language enforcement
        if language == 'fr':
            lang_instruction = 'IMPORTANT: Write ENTIRELY in French. No English.'
        else:
            lang_instruction = 'IMPORTANT: Write ENTIRELY in English. No French.'

        prompts = {
            'product-title': f"""{lang_instruction} Generate a compelling product title for: {product_name}.
Must be 55-65 characters. {selected_tone} tone.
{f"Target: {target_audience}." if target_audience else ""}
Return ONLY the title.""",

            'meta-description': f"""{lang_instruction} Write meta description for: {product_name}.
EXACTLY 150-160 characters. Include call-to-action.
{f"Features: {product_features}." if product_features else ""}
{selected_tone} tone. Return ONLY the description.""",

            'product-description': f"""{lang_instruction} Write product description for: {product_name}.
{f"Features: {product_features}." if product_features else ""}
{selected_tone} tone. MAX 150 words. Include benefits and value.
Return ONLY the description.""",

            'linkedin-post': f"""{lang_instruction} Write LinkedIn post about: {product_name}.
{f"Points: {product_features}." if product_features else ""}
{selected_tone} tone. MAX 50 words + 3 hashtags.
Return ONLY the post.""",

            'facebook-post': f"""{lang_instruction} Write Facebook post about: {product_name}.
{f"Points: {product_features}." if product_features else ""}
{selected_tone} tone. MAX 50 words. Use 2-3 emojis.
Return ONLY the post.""",

            'instagram-post': f"""{lang_instruction} Create Instagram caption for: {product_name}.
{f"Points: {product_features}." if product_features else ""}
{selected_tone} tone. MAX 50 words + 5-8 hashtags. Use emojis.
Return ONLY the caption.""",

            'tiktok-post': f"""{lang_instruction} Write TikTok caption for: {product_name}.
{f"Points: {product_features}." if product_features else ""}
{selected_tone} tone. MAX 50 words + 5-8 hashtags.
Return ONLY the caption.""",

            'email-subject': f"""{lang_instruction} Write email subject for: {product_name}.
{f"Message: {product_features}." if product_features else ""}
{selected_tone} tone. Under 50 characters. Attention-grabbing.
Return ONLY the subject.""",

            'email-body': f"""{lang_instruction} Write email body for: {product_name}.
{f"Points: {product_features}." if product_features else ""}
{selected_tone} tone. MAX 100 words. Include greeting, benefits, CTA, closing.
Return ONLY the email body.""",
        }

        return prompts.get(content_type, '')

    def _call_api(self, model: str, prompt: str, content_type: ContentType) -> Dict:
        """Make API call to Groq"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }

        config = self.GENERATION_CONFIGS.get(content_type, {
            'max_tokens': 300,
            'temperature': 0.7,
        })

        payload = {
            'model': model,
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'max_tokens': config['max_tokens'],
            'temperature': config['temperature'],
            'stream': False
        }

        response = requests.post(
            self.API_URL,
            headers=headers,
            json=payload,
            timeout=30  # Groq is very fast
        )

        if not response.ok:
            raise Exception(f'Groq API failed: {response.status_code} - {response.text}')

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
        Generate content using Groq API

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
                data = self._call_api(self.PRIMARY_MODEL, prompt, content_type)
                model_used = self.PRIMARY_MODEL
            except Exception as e:
                print(f'Primary model failed: {e}, trying fallback...')
                data = self._call_api(self.FALLBACK_MODEL, prompt, content_type)
                model_used = self.FALLBACK_MODEL

            # Extract generated text
            generated_text = ''
            if isinstance(data, dict):
                choices = data.get('choices', [])
                if choices and len(choices) > 0:
                    message = choices[0].get('message', {})
                    generated_text = message.get('content', '')

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
