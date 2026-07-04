import pandas as pd
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load Dataset
df = pd.read_csv("dataset.csv")

# Label Encoding
restaurant_encoder = LabelEncoder()
day_encoder = LabelEncoder()

df["Restaurant"] = restaurant_encoder.fit_transform(df["Restaurant"])
df["Day"] = day_encoder.fit_transform(df["Day"])

# Features
X = df[["Restaurant", "Day", "Hour", "Weekend", "Crowd"]]

# Target
y = df["WaitTime"]

# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Accuracy
score = model.score(X_test, y_test)

print(f"Model Accuracy: {score*100:.2f}%")

# Save Model
joblib.dump(model, "model.pkl")

joblib.dump(restaurant_encoder, "restaurant_encoder.pkl")

joblib.dump(day_encoder, "day_encoder.pkl")

print("Model Saved Successfully!")