import { NextRequest, NextResponse } from 'next/server';
import { generateContent, GenerateContentRequest } from '@/lib/huggingface';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Rate limiting (simple in-memory store)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body: GenerateContentRequest = await request.json();

    // Validate required fields
    if (!body.contentType) {
      return NextResponse.json(
        {
          success: false,
          error: 'contentType is required',
        },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = [
      'product-title',
      'meta-description',
      'product-description',
      'linkedin-post',
      'facebook-post',
      'instagram-post',
      'tiktok-post',
      'email-subject',
      'email-body',
    ];

    if (!validContentTypes.includes(body.contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content type',
        },
        { status: 400 }
      );
    }

    // Validate that productName is provided for most content types
    if (!body.productName && body.contentType !== 'email-body') {
      return NextResponse.json(
        {
          success: false,
          error: 'productName is required for this content type',
        },
        { status: 400 }
      );
    }

    // Generate content using Hugging Face
    const result = await generateContent(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate content',
        },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        content: result.content,
        model: result.model,
        metadata: {
          contentType: body.contentType,
          tone: body.tone || 'professional',
          language: body.language || 'en',
          characterCount: result.content.length,
        },
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    );
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST.',
    },
    { status: 405 }
  );
}
