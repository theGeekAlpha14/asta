import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import json

def train_dummy_model():
    """
    Trains a simple Random Forest model to predict safety scores based on:
    - Hour of day
    - Lighting quality (0-1)
    - Crowd density (0-1)
    - Historical crime rate (0-1)
    """
    # Synthetic training data
    data = {
        'hour': np.random.randint(0, 24, 1000),
        'lighting': np.random.rand(1000),
        'crowd': np.random.rand(1000),
        'crime_rate': np.random.rand(1000)
    }
    df = pd.DataFrame(data)

    # Target safety score (0-100)
    # Simple logic: higher lighting and crowd is safer, night and high crime is dangerous
    df['safety_score'] = (
        df['lighting'] * 40 +
        df['crowd'] * 20 -
        (df['crime_rate'] * 30) +
        (np.abs(df['hour'] - 14) / 14 * 10)  # Mid-day is safer
    ).clip(0, 100)

    X = df[['hour', 'lighting', 'crowd', 'crime_rate']]
    y = df['safety_score']

    model = RandomForestRegressor(n_estimators=100)
    model.fit(X, y)

    return model

def predict_safety(model, features):
    """
    features: [hour, lighting, crowd, crime_rate]
    """
    prediction = model.predict([features])
    return float(prediction[0])

if __name__ == "__main__":
    model = train_dummy_model()
    # Sample prediction for 10 PM, low light, low crowd, high crime
    score = predict_safety(model, [22, 0.2, 0.1, 0.8])
    print(f"Predicted Safety Score: {score}")
