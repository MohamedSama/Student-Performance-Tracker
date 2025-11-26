from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import predict_next_exam

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScoreData(BaseModel):
    scores: list

@app.post("/predict")
def predict(data: ScoreData):
    return predict_next_exam(data.scores)
