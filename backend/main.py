# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from regression import predict_next_score

app = FastAPI(title="Student Performance Predictor")

# Allow requests from anywhere (for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class ScoresRequest(BaseModel):
    previous_scores: list[float]

@app.post("/predict")
def predict_score(data: ScoresRequest):
    predicted_value = predict_next_score(data.previous_scores)
    return {"predicted_score": predicted_value}
