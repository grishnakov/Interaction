import requests, base64

import os
from dotenv import load_dotenv

load_dotenv()
# ─── Configuration ─────────────────────────────────────────────────────────────
API_KEY = os.getenv("KEY")
MAP_ID = "c1e8f216a4fa1dff"  # ← Your cloud‑style ID
CENTER = "40.762,-73.982"  # Manhattan center
ZOOM = 16  # Street‑level zoom
SIZE = "6000x12000"  # Portrait layout
SCALE = 2  # Retina support
ANGLE = -29.5  # Rotation angle (° east of north)

# ─── Fetch Map Using Map ID ────────────────────────────────────────────────────
url = "https://maps.googleapis.com/maps/api/staticmap"
params = {
    "center": CENTER,
    "zoom": ZOOM,
    "size": SIZE,
    "scale": SCALE,
    "map_id": MAP_ID,  # ← Use your style ID here
    "key": API_KEY,
}
response = requests.get(url, params=params)
response.raise_for_status()
png_data = response.content

# ─── Wrap in a Rotated SVG ─────────────────────────────────────────────────────
b64 = base64.b64encode(png_data).decode("ascii")
data_uri = f"data:image/png;base64,{b64}"
w, h = map(int, SIZE.split("x"))

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}">
  <g transform="rotate({ANGLE} {w / 2} {h / 2})">
    <image width="{w}" height="{h}" href="{data_uri}" />
  </g>
</svg>'''

with open("manhattan_customstyle.svg", "w") as f:
    f.write(svg)

print("Generated manhattan_customstyle.svg")
