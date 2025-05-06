import requests, base64
import os
from dotenv import load_dotenv

# ─── Configuration ─────────────────────────────────────────────────────────────
API_KEY = os.getenv("KEY")
CENTER = "40.7831,-73.9712"  # Approximate center of Manhattan
ZOOM = 13  # Street‑level detail
SIZE = "800x800"  # Output image size in pixels
SCALE = 2  # High‑DPI support (1 or 2)

# Style: hide everything except roads, drawn in black
STYLE = [
    "feature:all|element:labels|visibility:off",
    "feature:road|element:geometry|color:0x000000",
    "feature:road|element:labels|visibility:off",
]

# Construct the Static Maps API URL
base_url = "https://maps.googleapis.com/maps/api/staticmap"
params = {
    "center": CENTER,
    "zoom": ZOOM,
    "size": SIZE,
    "scale": SCALE,
    "maptype": "roadmap",
    "key": API_KEY,
}
# Add each style rule
for style_rule in STYLE:
    params.setdefault("style", []).append(style_rule)

# Fetch the PNG map
response = requests.get(base_url, params=params)
response.raise_for_status()
png_data = response.content

# Encode PNG as Base64 for embedding in SVG
b64_png = base64.b64encode(png_data).decode("ascii")
data_uri = f"data:image/png;base64,{b64_png}"  # Data URI scheme :contentReference[oaicite:3]{index=3}

# Build the SVG wrapper
width, height = SIZE.split("x")
svg_template = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">
  <image width="{width}" height="{height}" href="{data_uri}" />
</svg>'''  # SVG <image> element supports PNG embedding :contentReference[oaicite:4]{index=4}

# Write to file
with open("manhattan_map.svg", "w") as f:
    f.write(svg_template)

print("Generated manhattan_map.svg")
