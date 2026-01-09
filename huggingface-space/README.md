---
title: Llama 3.2 3B Content Generator
emoji: 🦙
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: llama3.2
---

# Llama 3.2 3B Content Generator API

This Hugging Face Space provides an OpenAI-compatible API endpoint for content generation using Meta's Llama 3.2 3B Instruct model, optimized for CPU.

## Features

- 🚀 Fast inference with Llama 3.2 3B
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
  "model": "meta-llama/Llama-3.2-3B-Instruct",
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
  "model": "meta-llama/Llama-3.2-3B-Instruct",
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
    "https://YOUR-SPACE-URL.hf.space/v1/chat/completions",
    json={
        "model": "meta-llama/Llama-3.2-3B-Instruct",
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
- **RAM**: 16GB
- **Storage**: 12GB

## Model

- **Model**: meta-llama/Llama-3.2-3B-Instruct
- **Size**: 3B parameters
- **License**: Llama 3.2 Community License
- **Provider**: Meta AI
- **Optimized for**: CPU inference

## Health Check

`GET /health` - Returns model status and health information
