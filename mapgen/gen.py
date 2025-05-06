import requests, base64
import os
from dotenv import load_dotenv

load_dotenv()
# ─── Configuration ─────────────────────────────────────────────────────────────
API_KEY = os.getenv("KEY")
SIZE = "600x1200"  # Portrait layout: narrow and tall
SCALE = 2  # High‑DPI support

# Bounding‑box corners for Manhattan Island (north‑west & south‑east)
VISIBLE_CORNERS = [
    "40.8776,-74.0193",  # northwest corner :contentReference[oaicite:3]{index=3}
    "40.6998,-73.9104",  # southeast corner :contentReference[oaicite:4]{index=4}
]

STYLE = [
    "feature:all|element:labels|visibility:off",
    "feature:road|element:geometry|color:0x000000",
    "feature:road|element:labels|visibility:off",
]

# ─── Build Request ─────────────────────────────────────────────────────────────
url = "https://maps.googleapis.com/maps/api/staticmap"
params = {
    "size": SIZE,  # portrait size :contentReference[oaicite:5]{index=5}
    "scale": SCALE,
    "maptype": "roadmap",
    "key": API_KEY,  # include your API key :contentReference[oaicite:6]{index=6}
}
# Add each style rule
for rule in STYLE:
    params.setdefault("style", []).append(rule)
# Add visible corners to constrain viewport
for corner in VISIBLE_CORNERS:
    params.setdefault("visible", []).append(
        corner
    )  # ensures only Manhattan :contentReference[oaicite:7]{index=7}

# ─── Fetch & Wrap in SVG ───────────────────────────────────────────────────────
response = requests.get(url, params=params)
response.raise_for_status()
png_data = response.content

# Encode as Base64 and build SVG
b64_png = base64.b64encode(png_data).decode("ascii")
data_uri = f"data:image/png;base64,{b64_png}"
w, h = SIZE.split("x")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}">'
    f'<image width="{w}" height="{h}" href="{data_uri}" />'
    "</svg>"
)

with open("manhattan_island_vertical.svg", "w") as f:
    f.write(svg)

print("Generated manhattan_island_vertical.svg")
