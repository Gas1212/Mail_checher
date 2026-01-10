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
    PRIMARY_MODEL = 'meta-llama/Llama-3.2-3B-Instruct'
    FALLBACK_MODEL = 'meta-llama/Llama-3.2-1B-Instruct'

    # API endpoints - use custom Space if configured, otherwise use Router API
    ROUTER_API_URL = 'https://router.huggingface.co/v1/chat/completions'

    # Generation parameters per content type
    GENERATION_CONFIGS = {
        'product-title': {
            'max_tokens': 80,       # Titles courts ~60 chars
            'temperature': 0.7,
            'top_p': 0.9,
        },
        'meta-description': {
            'max_tokens': 200,      # Meta descriptions ~160 chars
            'temperature': 0.7,
            'top_p': 0.9,
        },
        'product-description': {
            'max_tokens': 180,      # Descriptions max 120 mots (~150 tokens)
            'temperature': 0.7,     # Moins créatif = plus concis
            'top_p': 0.85,          # Réduit pour plus de focus
        },
        'linkedin-post': {
            'max_tokens': 80,       # Posts max 50 mots
            'temperature': 0.8,
            'top_p': 0.9,
        },
        'facebook-post': {
            'max_tokens': 80,       # Posts max 50 mots
            'temperature': 0.8,
            'top_p': 0.9,
        },
        'instagram-post': {
            'max_tokens': 80,       # Captions max 50 mots
            'temperature': 0.85,    # Plus créatif pour Instagram
            'top_p': 0.9,
        },
        'tiktok-post': {
            'max_tokens': 80,       # Captions max 50 mots
            'temperature': 0.9,     # Très créatif pour TikTok
            'top_p': 0.95,
        },
        'email-subject': {
            'max_tokens': 50,       # Sujets courts ~50 chars
            'temperature': 0.7,
            'top_p': 0.9,
        },
        'email-body': {
            'max_tokens': 150,      # Corps email max 100 mots
            'temperature': 0.75,
            'top_p': 0.9,
        },
    }

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('HUGGINGFACE_API_KEY')
        self.custom_space_url = os.getenv('HUGGINGFACE_SPACE_URL', '')

        # If using custom Space, API key is optional
        if not self.custom_space_url and not self.api_key:
            raise ValueError('Either HUGGINGFACE_SPACE_URL or HUGGINGFACE_API_KEY must be configured')

        # Use custom Space if available, otherwise use Router API
        self.api_url = f"{self.custom_space_url}/v1/chat/completions" if self.custom_space_url else self.ROUTER_API_URL
        self.using_custom_space = bool(self.custom_space_url)

        print(f"Content Generator configured: {'Custom Space' if self.using_custom_space else 'Router API'}")

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

        # Strong language enforcement
        if language == 'fr':
            lang_instruction = 'IMPORTANT: You MUST write ENTIRELY in French language. Do NOT use English words or phrases.'
        else:
            lang_instruction = 'IMPORTANT: You MUST write ENTIRELY in English language. Do NOT use French words or phrases.'

        prompts = {
            'product-title': f"""{lang_instruction} Generate a compelling, SEO-optimized product title for: {product_name}.
CRITICAL: The title must be between 55-65 characters long. Make it {selected_tone}.
{f"Target audience: {target_audience}." if target_audience else ""}
{f"Additional context: {additional_context}" if additional_context else ""}

Write a complete, full-length title. Do not write anything short. Return ONLY the title text.""",

            'meta-description': f"""{lang_instruction} Write a meta description for: {product_name}.
CRITICAL: The description must be EXACTLY 150-160 characters long (not shorter).
{f"Key features: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone} and include a call-to-action.
{f"Additional context: {additional_context}" if additional_context else ""}

Write a complete, detailed description. Fill the 150-160 character requirement. Return ONLY the description text.""",

            'product-description': f"""{lang_instruction} Write a product description for: {product_name}.
{f"Key features: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}. Include benefits and value proposition.

STRICT REQUIREMENTS:
- MAXIMUM 120 words (count carefully!)
- Write 3-4 short paragraphs
- Use short, clear sentences
- Be concise and direct
- Focus on key benefits only
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the description text. NO extra content.""",

            'linkedin-post': f"""{lang_instruction} Write a professional LinkedIn post about: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}. Include a hook, value proposition, and call-to-action.
CRITICAL: MAXIMUM 50 words. Keep it short and punchy. Add 3 hashtags.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the post content with hashtags at the end.""",

            'facebook-post': f"""{lang_instruction} Write an engaging Facebook post about: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone} and conversational. Include a hook, benefit, and call-to-action with 2-3 emojis.
CRITICAL: MAXIMUM 50 words. Keep it short and engaging.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the post content.""",

            'instagram-post': f"""{lang_instruction} Create an Instagram caption for: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone} and visually engaging. Include emojis and call-to-action.
CRITICAL: MAXIMUM 50 words + 5-8 hashtags at the end.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the caption with emojis and hashtags.""",

            'tiktok-post': f"""{lang_instruction} Write a TikTok video caption/script for: {product_name}.
{f"Key points: {product_features}." if product_features else ""}
{f"Target audience: {target_audience}." if target_audience else ""}
Make it {selected_tone}, catchy, and trend-worthy. Include a hook, value proposition, and call-to-action.
CRITICAL: MAXIMUM 50 words + 5-8 trending hashtags.
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
Make it {selected_tone}. Include greeting, value proposition, benefits, call-to-action, and closing.
CRITICAL: MAXIMUM 100 words. Keep it concise and persuasive.
{f"Additional context: {additional_context}" if additional_context else ""}

Return ONLY the email body content.""",
        }

        return prompts.get(content_type, '')

    def _call_api(self, model: str, prompt: str, content_type: ContentType) -> Dict:
        """Make API call to Hugging Face Space or Router API (OpenAI-compatible format)"""
        headers = {
            'Content-Type': 'application/json',
        }

        # Add authorization only if using Router API (not needed for custom Space)
        if not self.using_custom_space and self.api_key:
            headers['Authorization'] = f'Bearer {self.api_key}'

        # Get generation config for this content type
        config = self.GENERATION_CONFIGS.get(content_type, {
            'max_tokens': 300,
            'temperature': 0.7,
            'top_p': 0.9,
        })

        # Use OpenAI-compatible chat completions format
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
            'top_p': config['top_p'],
            'stream': False
        }

        response = requests.post(
            self.api_url,
            headers=headers,
            json=payload,
            timeout=90  # Increased timeout for custom Space cold starts
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
                data = self._call_api(self.PRIMARY_MODEL, prompt, content_type)
                model_used = self.PRIMARY_MODEL
            except Exception as e:
                print(f'Primary model failed: {e}, trying fallback...')
                # Fallback to secondary model
                data = self._call_api(self.FALLBACK_MODEL, prompt, content_type)
                model_used = self.FALLBACK_MODEL

            # Extract generated text from chat completions response
            generated_text = ''
            if isinstance(data, dict):
                # OpenAI-compatible format: data.choices[0].message.content
                choices = data.get('choices', [])
                if choices and len(choices) > 0:
                    message = choices[0].get('message', {})
                    generated_text = message.get('content', '')
                # Fallback for old format
                else:
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
