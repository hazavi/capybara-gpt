# backend/ollama_client.py
# HTTP client for Ollama-style local LLM server with streaming support
import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1"  # Change to your pulled model: e.g. "llama3.1", "llama3:8b", "gpt-oss:20b", "deepseek-r1"

def ask_ollama(prompt: str, stream: bool = False, max_tokens: int = 512, temperature: float = 0.8, system: str = None):
    """
    Send a prompt to Ollama and get response.
    
    Args:
        prompt: The prompt to send
        stream: Whether to stream the response
        max_tokens: Maximum tokens to generate
        temperature: Temperature for generation (0.0-1.0)
        system: System prompt with conversation history and context
    
    Returns:
        If stream=False: Complete response string
        If stream=True: Generator yielding response chunks
    """
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": stream,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
            "num_ctx": 4096,  # Increased for conversation history
            "top_k": 40,
            "top_p": 0.9,
            "repeat_penalty": 1.1,
        }
    }
    
    if system:
        payload["system"] = system
    
    try:
        resp = requests.post(OLLAMA_URL, json=payload, stream=stream, timeout=120)
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
