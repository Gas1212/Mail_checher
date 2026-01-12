---
title: Phi-3.5-mini Content Generator (llama.cpp)
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: Ultra-fast AI content generation with Phi-3.5-mini
---

# Phi-3.5-mini Content Generator API (llama.cpp)

This Hugging Face Space provides an OpenAI-compatible API endpoint for ultra-fast content generation using **Phi-3.5-mini** with **llama.cpp** optimization.

## Features

- 🚀 **Ultra-fast inference** with llama.cpp (3-4x faster than transformers)
- 🎯 **Phi-3.5-mini**: Microsoft's best small model for instructions
- 💻 **CPU optimized**: Runs efficiently on CPU (no GPU required)
- 📦 **Compact**: 2.2GB quantized model (Q4_K_M)
- 🆓 **Free tier compatible**: Works on Hugging Face free tier
- 🔄 **OpenAI-compatible**: Drop-in replacement for OpenAI API
- 🌐 **CORS enabled**: Ready for web applications
- ⚡ **Fast startup**: Downloads model once, then cached

## Why Phi-3.5-mini + llama.cpp?

| Feature | Old (Qwen transformers) | New (Phi llama.cpp) | Improvement |
|---------|------------------------|---------------------|-------------|
| **Speed** | 30-45s per generation | 10-15s per generation | **3-4x faster** |
| **Memory** | 3GB RAM | 2.2GB RAM | **27% less** |
| **Quality** | Good | Excellent | **Better** |
| **Size** | 3GB model | 2.2GB model | **Smaller** |

## API Endpoint

`POST /v1/chat/completions`

### Request Format

```json
{
  "model": "microsoft/Phi-3.5-mini-instruct",
  "messages": [
    {
      "role": "user",
      "content": "Your prompt here"
    }
  ],
  "max_tokens": 300,
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
  "model": "microsoft/Phi-3.5-mini-instruct",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

## Usage Example

```python
import requests

response = requests.post(
    "https://gas-tn-sugesto.hf.space/v1/chat/completions",
    json={
        "model": "microsoft/Phi-3.5-mini-instruct",
        "messages": [{"role": "user", "content": "Write a product description for wireless earbuds"}],
        "max_tokens": 200,
        "temperature": 0.8
    }
)

result = response.json()
print(result["choices"][0]["message"]["content"])
```

## Hardware Requirements

This Space runs on:
- **CPU**: CPU Basic (free tier) ✅
- **RAM**: 4GB (model uses ~2.2GB)
- **Storage**: 3GB
- **Inference**: 10-15 seconds per generation

## Model Details

- **Model**: microsoft/Phi-3.5-mini-instruct
- **Size**: 3.8B parameters → 2.2GB quantized (Q4_K_M)
- **Engine**: llama.cpp (optimized C++ inference)
- **Format**: GGUF (quantized for speed)
- **License**: MIT
- **Provider**: Microsoft
- **Specialty**: Instruction following, short-form content

## Endpoints

- `GET /` - Health check and model info
- `POST /v1/chat/completions` - Generate content (OpenAI-compatible)
- `GET /health` - Detailed health status

## Performance Benchmarks

**Tested on HuggingFace CPU Basic (free tier)**:

| Content Type | Tokens | Time | Speed |
|-------------|--------|------|-------|
| Product Title | 80 | 5-8s | ~10 tok/s |
| Description | 200 | 10-15s | ~13 tok/s |
| Social Post | 100 | 6-10s | ~10 tok/s |

**Old Qwen with transformers**: 30-45s for same tasks ❌
**New Phi with llama.cpp**: 10-15s for same tasks ✅

## Technical Stack

- **FastAPI**: Web framework
- **llama-cpp-python**: Python bindings for llama.cpp
- **huggingface-hub**: Model download
- **GGUF**: Quantized model format
- **ChatML**: Prompt format

## License

MIT License - Phi-3.5-mini is open source and free to use commercially.
