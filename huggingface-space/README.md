---
title: Qwen 2.5 1.5B Content Generator
emoji: ⚡
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: apache-2.0
---

# Qwen 2.5 1.5B Content Generator API

This Hugging Face Space provides an OpenAI-compatible API endpoint for content generation using Qwen 2.5 1.5B Instruct model, optimized for fast CPU inference.

## Features

- ⚡ Ultra-fast inference with Qwen 2.5 1.5B (2x faster than 3B)
- 💻 Runs on CPU (no GPU required)
- 🆓 Works on Hugging Face free tier
- 🔄 OpenAI-compatible API format
- 🌐 CORS enabled for web applications
- 📊 Built with FastAPI
- 🎯 Optimized for marketing content generation

## API Endpoint

`POST /v1/chat/completions`

### Request Format

```json
{
  "model": "Qwen/Qwen2.5-1.5B-Instruct",
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here"
    }
  ],
  "max_tokens": 500,
  "temperature": 0.7,
  "top_p": 0.9
}
```

### Response Format

```json
{
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Generated content here"
      },
      "finish_reason": "stop"
    }
  ],
  "model": "Qwen/Qwen2.5-1.5B-Instruct",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

## Usage

```python
import requests

response = requests.post(
    "https://gas-tn-sugesto.hf.space/v1/chat/completions",
    json={
        "model": "Qwen/Qwen2.5-1.5B-Instruct",
        "messages": [{"role": "user", "content": "Write a product title"}],
        "max_tokens": 100,
        "temperature": 0.7
    }
)

result = response.json()
print(result["choices"][0]["message"]["content"])
```

## Hardware Requirements

This Space runs on:
- **CPU**: CPU Basic (free tier) ✅
- **RAM**: 8GB
- **Storage**: 6GB

## Model

- **Model**: Qwen/Qwen2.5-1.5B-Instruct
- **Size**: 1.5B parameters (2x faster than 3B)
- **License**: Apache 2.0
- **Provider**: Alibaba Cloud (Qwen Team)
- **Optimized for**: Fast CPU inference

## Health Check

`GET /health` - Returns model status and health information
