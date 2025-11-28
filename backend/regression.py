from sklearn.linear_model import LinearRegression
import numpy as np

def predict_next_score(prev_scores: list[float]) -> float:
    """
    Predict the next score based on previous scores using simple linear regression.
    prev_scores: list of previous marks (ints or floats)
    Returns predicted next score as float rounded to 2 decimals.
    """

    if len(prev_scores) < 1:
        return 0.0  # no history

    # Build feature matrix (test numbers) and target array (marks)
    X = np.array([[i] for i in range(1, len(prev_scores)+1)])  # [[1], [2], [3], ...]
    y = np.array(prev_scores)

    # Train linear regression model
    model = LinearRegression()
    model.fit(X, y)

    # Predict next score
    next_test_number = len(prev_scores) + 1
    predicted_mark = model.predict([[next_test_number]])

    return round(float(predicted_mark[0]), 2)