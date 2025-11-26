# backend/regression.py
from sklearn.linear_model import LinearRegression
import numpy as np

def predict_next_score(prev_scores: list[float]) -> float:
    if len(prev_scores) < 2:
        return prev_scores[-1] if prev_scores else 0

    X = np.array(range(1, len(prev_scores) + 1)).reshape(-1, 1)
    y = np.array(prev_scores)

    model = LinearRegression()
    model.fit(X, y)

    next_test_number = len(prev_scores) + 1
    predicted = model.predict([[next_test_number]])
    return round(float(predicted[0]), 2)
