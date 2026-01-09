"""
Hugging Face Space - Llama 3.2 11B Content Generator API
FastAPI endpoint compatible with Django backend
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Initialize FastAPI
app = FastAPI(
    title="Qwen 2.5 3B Content Generator",
    description="AI Content Generation API using Qwen 2.5 3B Instruct (CPU-optimized)",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer - Optimized for CPU with INT8 quantization
# Using Qwen2.5-3B-Instruct (no gated access, excellent quality)
MODEL_NAME = "Qwen/Qwen2.5-3B-Instruct"
print(f"Loading model: {MODEL_NAME}")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# Load model optimized for CPU inference
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float32,
    device_map="cpu",
    low_cpu_mem_usage=True
)

# Set to eval mode for inference optimization (disables dropout, etc.)
model.eval()

print("Model loaded and optimized successfully!")

# Request model
class GenerateRequest(BaseModel):
    model: str
    messages: list
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9
    stream: Optional[bool] = False

# Response model
class GenerateResponse(BaseModel):
    choices: list
    model: str
    usage: dict

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "model": MODEL_NAME,
        "message": "Llama 3.2 11B Content Generator API is ready"
    }

@app.post("/v1/chat/completions")
async def chat_completions(request: GenerateRequest):
    """
    OpenAI-compatible chat completions endpoint
    Compatible with Django backend format
    """
    try:
        # Extract the user prompt from messages
        user_message = ""
        for msg in request.messages:
            if msg.get("role") == "user":
                user_message = msg.get("content", "")
                break

        if not user_message:
            raise HTTPException(status_code=400, detail="No user message found")

        # Prepare the prompt for Qwen (uses chat template)
        messages = [{"role": "user", "content": user_message}]
        prompt = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        # Tokenize
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

        # Generate with optimized parameters for speed
        with torch.no_grad():
            # Use faster generation with minimal quality loss
            outputs = model.generate(
                **inputs,
                max_new_tokens=min(request.max_tokens, 300),  # Cap at 300 tokens for speed
                temperature=request.temperature,
                top_p=request.top_p,
                do_sample=request.temperature > 0,  # Disable sampling if temp=0 (faster)
                num_beams=1,  # Greedy decoding (fastest)
                pad_token_id=tokenizer.eos_token_id,
                use_cache=True  # Enable KV cache for faster inference
            )

        # Decode ONLY the generated tokens (skip input prompt)
        input_length = inputs.input_ids.shape[1]
        generated_tokens = outputs[0][input_length:]
        generated_text = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()

        # Clean up system prompt artifacts if present
        lines_to_remove = ["system", "You are Qwen", "created by Alibaba Cloud", "user", "assistant"]
        for line_marker in lines_to_remove:
            if generated_text.startswith(line_marker):
                # Find the first line that doesn't start with these markers
                lines = generated_text.split('\n')
                for i, line in enumerate(lines):
                    if not any(marker in line for marker in lines_to_remove):
                        generated_text = '\n'.join(lines[i:]).strip()
                        break

        # Return in OpenAI format
        return {
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": generated_text
                    },
                    "finish_reason": "stop"
                }
            ],
            "model": request.model,
            "usage": {
                "prompt_tokens": len(inputs.input_ids[0]),
                "completion_tokens": len(outputs[0]) - len(inputs.input_ids[0]),
                "total_tokens": len(outputs[0])
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    """Health check for monitoring"""
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
