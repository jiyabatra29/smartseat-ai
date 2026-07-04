import pandas as pd
import random

restaurants = [
    "Subway",
    "McDonald's",
    "KFC",
    "Domino's",
    "Burger King",
    "Pizza Hut"
]

days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]

data = []

for _ in range(3000):

    restaurant = random.choice(restaurants)

    day = random.choice(days)

    hour = random.randint(9, 22)

    weekend = 1 if day in ["Saturday", "Sunday"] else 0

    # Peak hour logic
    if 12 <= hour <= 14:
        crowd = random.randint(60, 90)

    elif 18 <= hour <= 21:
        crowd = random.randint(70, 100)

    else:
        crowd = random.randint(10, 60)

    # Weekend increases crowd
    if weekend:
        crowd = min(100, crowd + random.randint(5, 15))

    # Wait time based on crowd
    if crowd < 30:
        wait = random.randint(0, 5)

    elif crowd < 50:
        wait = random.randint(5, 12)

    elif crowd < 70:
        wait = random.randint(12, 20)

    elif crowd < 85:
        wait = random.randint(20, 30)

    else:
        wait = random.randint(30, 45)

    data.append([
        restaurant,
        day,
        hour,
        weekend,
        crowd,
        wait
    ])

df = pd.DataFrame(
    data,
    columns=[
        "Restaurant",
        "Day",
        "Hour",
        "Weekend",
        "Crowd",
        "WaitTime"
    ]
)

df.to_csv("dataset.csv", index=False)

print("✅ dataset.csv generated successfully!")
print(df.head())