import os
from google import genai

client = genai.Client(api_key=os.environ.get("GOOGLE_AI_API_KEY"))

# Create chat
chat = client.chats.create(model="gemma-3-27b-it")

BASE_SYSTEM_PROMPT = """You are a helpful assistant. Answer {user_name}'s questions in a friendly and informative manner specifically in {language} language. If you don't know the answer, say "I don't know"."""

async def ask_ai(message: str, user_name: str, language: str) -> str:
    system_prompt = BASE_SYSTEM_PROMPT.format(user_name=user_name, language=language)
    user_prompt = f"{system_prompt}\n{message}"
    response = chat.send_message(user_prompt)
    return response.text