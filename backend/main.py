# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from regression import predict_next_score  # your existing prediction function

app = FastAPI(title="Student Performance Predictor")

# CORS middleware to allow requests from any frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # allow any origin
    allow_credentials=True,
    allow_methods=["*"],       # allow GET, POST, OPTIONS, etc.
    allow_headers=["*"],       # allow all headers
)

# Request model for prediction
class ScoresRequest(BaseModel):
    previous_scores: list[float]

# Prediction endpoint
@app.post("/predict")
def predict_score(data: ScoresRequest):
    predicted_value = predict_next_score(data.previous_scores)
    return {"predicted_score": predicted_value}

# Test endpoint to check Render deployment
@app.get("/test")
def test_render():
    return {"status": "Render is working!"}