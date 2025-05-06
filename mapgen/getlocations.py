import os
import time
from dotenv import load_dotenv
import requests
import json

load_dotenv()
# 1) Set your API key (export GOOGLE_PLACES_API_KEY or replace here)
API_KEY = os.getenv("KEY")


def fetch_nearby_cafes(lat, lng, radius=1000, rnum=100):
    """
    Returns a list of dicts for up to 100 cafes within `radius` meters
    of (lat, lng) using the new Places API v1 searchNearby endpoint.
    Each dict has keys: name, lat, lng
    """
    endpoint = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.location",
    }
    body = {
        "includedTypes": ["cafe"],
        "maxResultCount": rnum,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(radius),
            }
        },
    }

    resp = requests.post(endpoint, headers=headers, json=body)
    resp.raise_for_status()
    data = resp.json()

    cafes = []
    for p in data.get("places", []):
        # displayName is a LocalizedText {text, languageCode}
        dn = p.get("displayName")
        name = dn.get("text") if isinstance(dn, dict) else dn
        loc = p.get("location", {})
        cafes.append({"name": name, "lat": loc.get("lat"), "lng": loc.get("lng")})

    return cafes


if __name__ == "__main__":
    # center point in Manhattan
    LAT, LNG = 40.735085378543296, -73.99444540644667

    # fetch all cafes within 1.5 km
    cafes = fetch_nearby_cafes(LAT, LNG, radius=500)

    # write out JSON
    out_path = "cafes_manhattan_nearby.json"
    with open(out_path, "w") as f:
        json.dump(cafes, f, indent=2)

    print(f"✅ Saved {len(cafes)} cafes to {out_path}")
