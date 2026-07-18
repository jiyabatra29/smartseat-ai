from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load ML Model
model = joblib.load("model.pkl")
restaurant_encoder = joblib.load("restaurant_encoder.pkl")
day_encoder = joblib.load("day_encoder.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    restaurant = data["restaurant"]
    crowd = int(data["crowd"])

    now = datetime.now()

    day = now.strftime("%A")
    hour = now.hour

    weekend = 1 if day in ["Saturday", "Sunday"] else 0

    # Restaurant Encoding
    if restaurant in restaurant_encoder.classes_:
        restaurant_encoded = restaurant_encoder.transform([restaurant])[0]
    else:
        restaurant_encoded = 0

    # Day Encoding
    day_encoded = day_encoder.transform([day])[0]

    input_df = pd.DataFrame([{
        "Restaurant": restaurant_encoded,
        "Day": day_encoded,
        "Hour": hour,
        "Weekend": weekend,
        "Crowd": crowd
    }])

    # ML Prediction
    predicted_wait = float(model.predict(input_df)[0])

    # -----------------------------
    # Smart AI Logic
    # -----------------------------

    futureCrowd = crowd

    # Lunch Peak
    if 12 <= hour <= 15:
        futureCrowd += 15

    # Dinner Peak
    elif 18 <= hour <= 22:
        futureCrowd += 20

    else:
        futureCrowd -= 10

    if weekend == 1:
        futureCrowd += 10

    futureCrowd = max(10, min(100, futureCrowd))

    # Adjust Wait Time
    adjustedWait = predicted_wait

    if futureCrowd > crowd:
        adjustedWait += (futureCrowd - crowd) * 0.35
    else:
        adjustedWait -= (crowd - futureCrowd) * 0.20

    adjustedWait = max(5, round(adjustedWait))

    # Recommendation
    if futureCrowd >= 85:
        recommendation = "Visit after 45-60 minutes"
    elif futureCrowd >= 70:
        recommendation = "Visit after 30 minutes"
    elif futureCrowd >= 50:
        recommendation = "Current time is okay"
    else:
        recommendation = "Best time to visit now"

    # Confidence
    confidence = 95

    return jsonify({

        "currentCrowd": crowd,

        "futureCrowd": futureCrowd,

        "predictedWaitTime": adjustedWait,

        "recommendedArrival": recommendation,

        "confidence": confidence,

        "day": day,

        "hour": f"{hour}:00"

    })


@app.route("/")
def home():
    return "SmartSeat AI Server Running"


if __name__ == "__main__":
    app.run(debug=True, port=5001)