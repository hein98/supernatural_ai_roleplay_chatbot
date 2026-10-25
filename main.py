from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from memory import chains

app = FastAPI()
BASE_DIR = Path(__file__).resolve().parent

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


@app.get("/", response_class=HTMLResponse)
def homepage():
    html_file = BASE_DIR / "templates" / "index.html"
    return html_file.read_text(encoding="utf-8")


class ChatRequest(BaseModel):
    model: str
    message: str


class ResetRequest(BaseModel):
    model: str


@app.get("/models")
def get_models():
    available_models = list(chains.keys())
    return {"models": available_models}


@app.post("/chat")
def chat(request: ChatRequest):

    if request.model not in chains:
        raise HTTPException(status_code=404, detail="Character not found")

    selected_chain = chains[request.model]

    result = selected_chain.invoke({"message": request.message})
    # print(result)
    return {"model": request.model, "response": result["text"]}


@app.post("/reset-chat")
def reset_chat(request: ResetRequest):
    if request.model not in chains:
        raise HTTPException(status_code=404, detail="Character not found")
    chains[request.model].memory.clear()
    return {"message": "conversation cleared"}
