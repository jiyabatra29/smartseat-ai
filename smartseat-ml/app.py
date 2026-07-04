from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load Model
model = joblib.load("model.pkl")
restaurant_encoder = joblib.load("restaurant_encoder.pkl")
day_encoder = joblib.load("day_encoder.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    print(data)

    restaurant = data["restaurant"]
    crowd = int(data["crowd"])

    now = datetime.now()

    day = now.strftime("%A")
    hour = now.hour
    weekend = 1 if day in ["Saturday", "Sunday"] else 0

    # Encode Restaurant
    if restaurant in restaurant_encoder.classes_:
        restaurant_encoded = restaurant_encoder.transform([restaurant])[0]
    else:
        restaurant_encoded = 0

    # Encode Day
    day_encoded = day_encoder.transform([day])[0]

    input_df = pd.DataFrame([{
        "Restaurant": restaurant_encoded,
        "Day": day_encoded,
        "Hour": hour,
        "Weekend": weekend,
        "Crowd": crowd
    }])

    prediction = model.predict(input_df)[0]

    futureCrowd = max(crowd - 20, 10)

    confidence = 94

    return jsonify({
        "currentCrowd": crowd,
        "predictedWaitTime": round(float(prediction), 1),
        "futureCrowd": futureCrowd,
        "recommendedArrival": f"{round(float(prediction))} mins later",
        "confidence": confidence,
        "day": day,
        "hour": f"{hour}:00"
    })


@app.route("/")
def home():
    return "SmartSeat AI ML Server Running"


if __name__ == "__main__":
    app.run(port=5001, debug=True)