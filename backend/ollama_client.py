# backend/ollama_client.py
# HTTP client for Ollama-style local LLM server with streaming support
import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gpt-oss:20b"  # Change to your pulled model: e.g. "llama3.1", "llama3:8b", "gpt-oss:20b", "deepseek-r1"

def ask_ollama(prompt: str, stream: bool = False, max_tokens: int = 2048, temperature: float = 0.7, system: str = None, model_name: str = None):
    """
    Send a prompt to Ollama and get response.
    
    Args:
        prompt: The prompt to send
        stream: Whether to stream the response
        max_tokens: Maximum tokens to generate (default 2048 for complete responses)
        temperature: Temperature for generation (0.0-1.0)
        system: System prompt with conversation history and context
        model_name: Override the default model name
    
    Returns:
        If stream=False: Complete response string
        If stream=True: Generator yielding response chunks
    """
    # ========================================
    # ⚡ PERFORMANCE TUNING - ADJUST THESE VALUES FOR FASTER/BETTER RESPONSES
    # ========================================
    
    payload = {
        "model": model_name or MODEL_NAME,
        "prompt": prompt,
        "stream": stream,
        "options": {
            # 🎯 temperature: Controls randomness (0.0-1.0)
            #    Lower = more focused/deterministic, Higher = more creative/random
            #    Default: 0.7 (balanced)
            "temperature": temperature,
            
            # 🎯 num_predict: Maximum tokens to generate
            #    Lower = faster but may cut off responses, Higher = complete but slower
            #    Default: 2048 (good for most responses)
            #    Try: 1024 for faster, 4096 for very long responses
            "num_predict": max_tokens,
            
            # 🎯 num_ctx: Context window size (how much conversation history to remember)
            #    Lower = faster, Higher = better context understanding
            #    Default: 2048 (balanced speed/context)
            #    Try: 1024 for faster, 4096 for better long conversations
            "num_ctx": 2048,
            
            # 🎯 top_k: Limits next token selection to top K candidates
            #    Lower = more focused, Higher = more diverse
            #    Default: 40 (good balance)
            "top_k": 40,
            
            # 🎯 top_p: Nucleus sampling - cumulative probability threshold
            #    Lower = more focused, Higher = more diverse
            #    Default: 0.9 (recommended)
            "top_p": 0.9,
            
            # 🎯 repeat_penalty: Penalizes repetitive text
            #    1.0 = no penalty, >1.0 = reduce repetition
            #    Default: 1.1 (slight penalty)
            "repeat_penalty": 1.1,
            
            # 🎯 num_thread: CPU threads for processing (⚡ SPEED BOOST)
            #    More threads = faster processing (if CPU allows)
            #    Default: 8 threads
            #    Try: 4 for low-end CPUs, 16+ for high-end CPUs
            "num_thread": 8,
            
            # 🎯 num_gpu: Number of GPU layers to use (⚡⚡ MAJOR SPEED BOOST)
            #    0 = CPU only (slow), 1 = use GPU (fast), -1 = use all GPU layers
            #    Default: 1 (enable GPU if available)
            #    Set to 0 if no GPU, or -1 to max GPU usage
            "num_gpu": 1,
        }
    }
    
    if system:
        payload["system"] = system
    
    try:
        # 🎯 timeout: Maximum wait time for response (in seconds)
        #    Lower = fail faster on errors, Higher = allow slower models to complete
        #    Default: 300 seconds (5 minutes) - good for large models
        #    Try: 120 for faster models, 600 for very large models
        resp = requests.post(OLLAMA_URL, json=payload, stream=stream, timeout=300)
        resp.raise_for_status()
        
        if stream:
            return _stream_response(resp)
        else:
            return _parse_response(resp)
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error communicating with Ollama: {str(e)}")

def _stream_response(response):
    """Generator that yields chunks from streaming response."""
    for line in response.iter_lines():
        if line:
            try:
                data = json.loads(line)
                if "response" in data:
                    yield data["response"]
                
                # Check if done
                if data.get("done", False):
                    break
            except json.JSONDecodeError:
                continue

def _parse_response(response):
    """Parse non-streaming response."""
    try:
        data = response.json()
        
        # Ollama format - check for DeepSeek-R1 style thinking + response
        if isinstance(data, dict):
            # DeepSeek-R1 puts reasoning in 'thinking' and answer in 'response'
            # If response is empty but thinking exists, use thinking
            answer = data.get("response", "")
            thinking = data.get("thinking", "")
            
            if thinking and (not answer or answer.strip() == ""):
                print("DEBUG: Using thinking field from DeepSeek-R1")
                # Extract just the conclusion from thinking (last paragraph usually has the answer)
                lines = thinking.strip().split('\n')
                # Get last few meaningful lines
                answer = '\n'.join([line for line in lines[-3:] if line.strip()])
            
            if answer and answer.strip():
                return answer.strip()
            
            # Try other formats
            if "message" in data:
                return data["message"].get("content", "")
        
        # OpenAI-style format
        if "choices" in data and len(data["choices"]) > 0:
            choice = data["choices"][0]
            if "message" in choice:
                return choice["message"].get("content", "")
            elif "text" in choice:
                return choice["text"]
        
        # Fallback
        print(f"WARNING: Could not extract answer from response")
        return "I apologize, but I couldn't generate a proper response. Please try again."
    except Exception as e:
        print(f"ERROR parsing Ollama response: {str(e)}")
        raise Exception(f"Error parsing Ollama response: {str(e)}")

def check_ollama_connection():
    """Check if Ollama server is reachable."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False

def get_available_models():
    """Get list of available Ollama models."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        response.raise_for_status()
        data = response.json()
        models = []
        if "models" in data:
            for model in data["models"]:
                models.append({
                    "name": model.get("name", ""),
                    "size": model.get("size", 0),
                    "modified_at": model.get("modified_at", "")
                })
        return models
    except Exception as e:
        print(f"Error fetching models: {e}")
        return []
