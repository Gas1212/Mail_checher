"""
Hugging Face Space - Phi-3.5-mini Content Generator API (llama.cpp)
FastAPI endpoint with llama.cpp for ultra-fast CPU inference
Compatible with Django backend OpenAI format
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from llama_cpp import Llama
from huggingface_hub import hf_hub_download

# Initialize FastAPI
app = FastAPI(
    title="Phi-3.5-mini Content Generator (llama.cpp)",
    description="AI Content Generation API using Phi-3.5-mini with llama.cpp (3-4x faster)",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_REPO = "bartowski/Phi-3.5-mini-instruct-GGUF"
MODEL_FILE = "Phi-3.5-mini-instruct-Q4_K_M.gguf"  # 4-bit quantized, ~2.2GB
print(f"Downloading model: {MODEL_REPO}/{MODEL_FILE}")

# Download model from HuggingFace
try:
    model_path = hf_hub_download(
        repo_id=MODEL_REPO,
        filename=MODEL_FILE,
        cache_dir="./models"
    )
    print(f"Model downloaded to: {model_path}")
except Exception as e:
    print(f"Error downloading model: {e}")
    raise

# Load model with llama.cpp
print("Loading model with llama.cpp...")
llm = Llama(
    model_path=model_path,
    n_ctx=2048,           # Context window
    n_threads=4,          # CPU threads (adjust based on your CPU)
    n_gpu_layers=0,       # CPU only (0 GPU layers)
    verbose=False,
    chat_format="chatml"  # Phi uses ChatML format
)
print("Model loaded successfully with llama.cpp!")

# Request model
class GenerateRequest(BaseModel):
    model: str
    messages: list
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9
    stream: Optional[bool] = False

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "engine": "llama.cpp",
        "model": MODEL_FILE,
        "message": "Phi-3.5-mini Content Generator API is ready (llama.cpp optimized)"
    }

@app.post("/v1/chat/completions")
async def chat_completions(request: GenerateRequest):
    """
    OpenAI-compatible chat completions endpoint
    Compatible with Django backend format
    Ultra-fast inference with llama.cpp
    """
    try:
        # Extract user message
        user_message = ""
        for msg in request.messages:
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break

        if not user_message:
            raise HTTPException(status_code=400, detail="No user message found")

        # Generate with llama.cpp (OpenAI-compatible)
        response = llm.create_chat_completion(
            messages=[
                {"role": "user", "content": user_message}
            ],
            max_tokens=min(request.max_tokens, 300),
            temperature=request.temperature,
            top_p=request.top_p,
            stop=["<|end|>", "<|endoftext|>"],  # Phi stop tokens
            stream=False
        )

        # llama.cpp already returns OpenAI format!
        # Just need to replace model name
        response["model"] = request.model

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    """Health check for monitoring"""
    return {
        "status": "healthy",
        "model_loaded": llm is not None,
        "engine": "llama.cpp",
        "model": MODEL_FILE
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
