// Hugging Face API Client for Content Generation

export type ContentType =
  | 'product-title'
  | 'meta-description'
  | 'product-description'
  | 'linkedin-post'
  | 'facebook-post'
  | 'instagram-post'
  | 'tiktok-post'
  | 'email-subject'
  | 'email-body';

export type ToneType = 'professional' | 'casual' | 'enthusiastic' | 'formal';
export type LanguageType = 'en' | 'fr';

export interface GenerateContentRequest {
  contentType: ContentType;
  productName?: string;
  productFeatures?: string;
  targetAudience?: string;
  tone?: ToneType;
  language?: LanguageType;
  additionalContext?: string;
}

export interface GenerateContentResponse {
  content: string;
  model: string;
  success: boolean;
  error?: string;
}

// Hugging Face models configuration
const MODELS = {
  primary: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
  fallback: 'mistralai/Mistral-7B-Instruct-v0.2',
};

// Prompt templates for each content type
const getPrompt = (request: GenerateContentRequest): string => {
  const { contentType, productName, productFeatures, targetAudience, tone, language, additionalContext } = request;

  const toneMap: Record<ToneType, string> = {
    professional: 'professional and authoritative',
    casual: 'casual and friendly',
    enthusiastic: 'enthusiastic and energetic',
    formal: 'formal and polished',
  };

  const selectedTone = tone ? toneMap[tone] : 'professional';
  const langInstruction = language === 'fr' ? 'Write in French.' : 'Write in English.';

  const prompts: Record<ContentType, string> = {
    'product-title': `${langInstruction} Generate a compelling, SEO-optimized product title for: ${productName}.
Keep it under 60 characters. Make it ${selectedTone}.
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the title, nothing else.`,

    'meta-description': `${langInstruction} Write a meta description (150-160 characters) for: ${productName}.
${productFeatures ? `Key features: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone} and include a call-to-action.
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the meta description, nothing else.`,

    'product-description': `${langInstruction} Write a detailed product description for: ${productName}.
${productFeatures ? `Key features: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone}. Include benefits, use cases, and value proposition.
Aim for 150-200 words.
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the description, nothing else.`,

    'linkedin-post': `${langInstruction} Write a professional LinkedIn post about: ${productName}.
${productFeatures ? `Key points: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone}. Include:
- Hook/opening line
- Value proposition
- Key insights
- Call-to-action
- 3-5 relevant hashtags
Aim for 150-200 words.
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the post content with hashtags at the end.`,

    'facebook-post': `${langInstruction} Write an engaging Facebook post about: ${productName}.
${productFeatures ? `Key points: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone} and conversational. Include:
- Attention-grabbing opening
- Engaging story or benefit
- Clear call-to-action
- 2-3 emojis
Aim for 100-150 words.
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the post content.`,

    'instagram-post': `${langInstruction} Create an Instagram caption for: ${productName}.
${productFeatures ? `Key points: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone} and visually engaging. Include:
- Compelling caption
- 5-8 emojis placed naturally
- 8-12 relevant hashtags at the end
- Call-to-action
Aim for 125-150 words.
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the caption with emojis and hashtags.`,

    'tiktok-post': `${langInstruction} Write a TikTok video caption/script for: ${productName}.
${productFeatures ? `Key points: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone}, catchy, and trend-worthy. Include:
- Hook in first 3 seconds
- Quick value proposition
- Call-to-action
- 5-8 trending/relevant hashtags
Keep it short and punchy (50-100 words).
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the caption with hashtags.`,

    'email-subject': `${langInstruction} Write a compelling email subject line for: ${productName}.
${productFeatures ? `Key message: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone}. Keep it under 50 characters.
Make it attention-grabbing and encourage opens.
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the subject line, nothing else.`,

    'email-body': `${langInstruction} Write an email body for: ${productName}.
${productFeatures ? `Key points: ${productFeatures}.` : ''}
${targetAudience ? `Target audience: ${targetAudience}.` : ''}
Make it ${selectedTone}. Include:
- Personalized greeting
- Clear value proposition
- Key benefits
- Strong call-to-action
- Professional closing
Aim for 150-200 words.
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Return ONLY the email body content.`,
  };

  return prompts[contentType];
};

// Call Hugging Face Inference API
export async function generateContent(
  request: GenerateContentRequest
): Promise<GenerateContentResponse> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return {
      content: '',
      model: '',
      success: false,
      error: 'Hugging Face API key not configured',
    };
  }

  const prompt = getPrompt(request);

  try {
    // Try primary model first
    const response = await callHuggingFaceAPI(MODELS.primary, prompt, apiKey);

    if (response.success) {
      return response;
    }

    // Fallback to secondary model if primary fails
    console.log('Primary model failed, trying fallback...');
    return await callHuggingFaceAPI(MODELS.fallback, prompt, apiKey);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return {
      content: '',
      model: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Internal function to call Hugging Face API
async function callHuggingFaceAPI(
  model: string,
  prompt: string,
  apiKey: string
): Promise<GenerateContentResponse> {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Handle different response formats
  let generatedText = '';
  if (Array.isArray(data) && data.length > 0) {
    generatedText = data[0].generated_text || '';
  } else if (data.generated_text) {
    generatedText = data.generated_text;
  }

  // Clean up the response
  generatedText = generatedText.trim();

  return {
    content: generatedText,
    model,
    success: true,
  };
}
