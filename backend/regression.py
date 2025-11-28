# backend/regression.py
from sklearn.linear_model import LinearRegression
import numpy as np

def predict_next_score(prev_scores: list[float], future_effort: int = 6) -> float:

    if len(prev_scores) < 1:
        return 0  # no history

    # Build feature matrix and target array
    X = []
    y = []

    for i, mark in enumerate(prev_scores, start=1):
        X.append([i])           # marks as target

    X = np.array(X)
    y = np.array(y)

    model = LinearRegression()
    model.fit(X, y)

    # Predict next score with effort influence
    next_test_number = len(prev_scores) + 1
    predicted_mark = model.predict([[next_test_number, future_effort]])

    return round(float(predicted_mark[0]), 2)
