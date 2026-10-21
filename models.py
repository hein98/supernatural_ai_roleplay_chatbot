import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from prompts import Castiel_prompt, Sam_prompt, Dean_prompt

load_dotenv()

API_KEY = os.getenv("OLLAMA_API_KEY")

if not API_KEY:
    raise ValueError("Missing API KEY")


Castiel = ChatOllama(
    model="gpt-oss:20b",
    temperature=0.5,
    # top_p=0.9,
    num_predict=500,
    base_url="https://ollama.com",
    client_kwargs={"headers": {"Authorization": f"Bearer {API_KEY}"}},
)

Sam = ChatOllama(
    model="gpt-oss:120b",
    temperature=0.5,
    num_predict=500,
    base_url="https://ollama.com",
    client_kwargs={"headers": {"Authorization": f"Bearer {API_KEY}"}},
)

Dean = ChatOllama(
    model="gemma4:31b",
    temperature=0.7,
    num_predict=500,
    base_url="https://ollama.com",
    client_kwargs={"headers": {"Authorization": f"Bearer {API_KEY}"}},
)


models = {
    "Castiel": Castiel,
    "Sam": Sam,
    "Dean": Dean,
}

chains = {
    "Castiel": Castiel_prompt | Castiel,
    "Sam": Sam_prompt | Sam,
    "Dean": Dean_prompt | Dean,
}
# response = models["Castiel"].invoke("Hello Castiel! Introduce yourself.")

# print(response.content)
