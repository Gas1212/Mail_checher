"""
Hybrid Content Generation Service
Uses Groq API (fast) with HuggingFace Space fallback (reliable)
"""
import os
from typing import Dict, Optional
from .groq_service import GroqService, ContentType, ToneType, LanguageType
from .huggingface_service import HuggingFaceService


class HybridContentService:
    """
    Hybrid service that uses Groq API (1-2s) with HuggingFace Space fallback (23s)

    Strategy:
    1. Try Groq API first (ultra-fast, free 30 req/min)
    2. If Groq fails (rate limit, error), fallback to HuggingFace Space
    3. Always reliable, optimal speed
    """

    def __init__(
        self,
        groq_api_key: Optional[str] = None,
        hf_api_key: Optional[str] = None,
        hf_space_url: Optional[str] = None
    ):
        """
        Initialize hybrid service

        Args:
            groq_api_key: Groq API key (optional, reads from env)
            hf_api_key: HuggingFace API key (optional)
            hf_space_url: HuggingFace Space URL (optional, reads from env)
        """
        self.groq_enabled = bool(groq_api_key or os.getenv('GROQ_API_KEY'))

        # Initialize Groq if available
        if self.groq_enabled:
            try:
                self.groq = GroqService(api_key=groq_api_key)
                print("[OK] Groq API initialized (Primary - Ultra-fast)")
            except Exception as e:
                print(f"[WARNING] Groq API initialization failed: {e}")
                self.groq_enabled = False

        # Always initialize HuggingFace Space as fallback
        try:
            # Force use of custom Space (disable Inference API)
            os.environ['USE_INFERENCE_API'] = 'false'
            self.hf = HuggingFaceService(api_key=hf_api_key)
            print("[OK] HuggingFace Space initialized (Fallback - Reliable)")
        except Exception as e:
            print(f"[ERROR] HuggingFace Space initialization failed: {e}")
            raise ValueError("At least HuggingFace Space must be available")

        print(f"\n[HYBRID] Mode: {'Groq (fast) + HF Space (fallback)' if self.groq_enabled else 'HF Space only'}")

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
        Generate content using hybrid approach

        Returns:
            {
                'success': bool,
                'content': str,
                'model': str,
                'provider': str,  # 'groq' or 'huggingface'
                'error': Optional[str]
            }
        """
        # Try Groq first if available
        if self.groq_enabled:
            try:
                result = self.groq.generate_content(
                    content_type=content_type,
                    product_name=product_name,
                    product_features=product_features,
                    target_audience=target_audience,
                    tone=tone,
                    language=language,
                    additional_context=additional_context
                )

                if result['success']:
                    result['provider'] = 'groq'
                    return result
                else:
                    print(f"[WARNING] Groq failed: {result['error']}, falling back to HF Space...")

            except Exception as e:
                print(f"[WARNING] Groq error: {e}, falling back to HF Space...")

        # Fallback to HuggingFace Space
        try:
            result = self.hf.generate_content(
                content_type=content_type,
                product_name=product_name,
                product_features=product_features,
                target_audience=target_audience,
                tone=tone,
                language=language,
                additional_context=additional_context
            )

            result['provider'] = 'huggingface'
            return result

        except Exception as e:
            return {
                'success': False,
                'content': '',
                'model': '',
                'provider': 'none',
                'error': f'All providers failed. Last error: {str(e)}'
            }
