import numpy as np
from sklearn.linear_model import LinearRegression

def predict_next_exam(scores):
    if len(scores) < 2:
        return {"error": "At least 2 previous scores needed"}

    X = np.array(scores[:-1]).reshape(-1, 1)
    y = np.array(scores[1:]).reshape(-1, 1)

    model = LinearRegression()
    model.fit(X, y)

    last_score = np.array([[scores[-1]]])
    predicted = model.predict(last_score)[0][0]

    return {
        "next_score": round(float(predicted), 2)
    }
