from langchain_classic.chains import LLMChain
from langchain_classic.memory import ConversationBufferMemory

from models import Castiel, Sam, Dean
from prompts import Castiel_prompt, Sam_prompt, Dean_prompt

Castiel_memory = ConversationBufferMemory(memory_key="history", return_messages=True)

Sam_memory = ConversationBufferMemory(memory_key="history", return_messages=True)

Dean_memory = ConversationBufferMemory(memory_key="history", return_messages=True)


chains = {
    "Castiel": LLMChain(llm=Castiel, prompt=Castiel_prompt, memory=Castiel_memory),
    "Sam": LLMChain(llm=Sam, prompt=Sam_prompt, memory=Sam_memory),
    "Dean": LLMChain(llm=Dean, prompt=Dean_prompt, memory=Dean_memory),
}
