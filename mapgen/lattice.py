# 40.756162, -74.018933
# 40.703559, -73.971236

#!/usr/bin/env python3
"""
Generate a square lattice of points (spacing in meters) over any bounding box
by approximating degrees→meters conversions (suitable for small areas).
Writes out a CSV of latitude,longitude.
"""

import csv
import math

# ─── CONFIG ────────────────────────────────────────────────────────────────────
# Upper‑left and lower‑right corners of your box:
UL_LAT = 40.756162  # upper‑left latitude
UL_LON = -74.018933  # upper‑left longitude
LR_LAT = 40.703559  # lower‑right latitude
LR_LON = -73.971236  # lower‑right longitude

SPACING_M = 300  # grid spacing in meters
OUTPUT_CSV = "grid.csv"  # output filename
# ───────────────────────────────────────────────────────────────────────────────


def meters_to_degrees(lat_deg, meters):
    """
    Approximate conversion: returns (dlat, dlon) in degrees corresponding to
    'meters' at latitude 'lat_deg'.
    """
    # 1° lat ≈ 110574 m
    dlat = meters / 110574.0
    # 1° lon ≈ 111320 * cos(lat) m
    dlon = meters / (111320.0 * math.cos(math.radians(lat_deg)))
    return dlat, dlon


def generate_grid(ul_lat, ul_lon, lr_lat, lr_lon, spacing_m):
    # use mean latitude for longitude spacing
    mean_lat = (ul_lat + lr_lat) / 2.0
    dlat, dlon = meters_to_degrees(mean_lat, spacing_m)

    # build lists of latitudes (descending) and longitudes (ascending)
    lats = []
    lat = ul_lat
    while lat >= lr_lat:
        lats.append(lat)
        lat -= dlat

    lons = []
    lon = ul_lon
    while lon <= lr_lon:
        lons.append(lon)
        lon += dlon

    # cross‑product
    for lat in lats:
        for lon in lons:
            yield lat, lon


def main():
    points = list(generate_grid(UL_LAT, UL_LON, LR_LAT, LR_LON, SPACING_M))

    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["latitude", "longitude"])
        writer.writerows(points)

    print(f"✔ Generated {len(points)} points → '{OUTPUT_CSV}'")


if __name__ == "__main__":
    main()
