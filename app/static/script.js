// const imgWidth = 6583,
//   imgHeight = 16838;
// const anchorPx = [3048, 11835];
// const anchorLatLng = [40.735863, -73.991084];
// const totalLonSpan = 0.12,
//   totalLatSpan = 0.182;

// // 2) Compute your imgBounds exactly as before
// const degPerPxLon = totalLonSpan / imgWidth;
// const degPerPxLat = totalLatSpan / imgHeight;
// const [ax, ay] = anchorPx;
// const [alat, alon] = anchorLatLng;
// const latNorth = alat + ay * degPerPxLat;
// const lonWest = alon - ax * degPerPxLon;
// const latSouth = latNorth - totalLatSpan;
// const lonEast = lonWest + totalLonSpan;
// const imgBounds = L.latLngBounds(
//   L.latLng(latSouth, lonWest),
//   L.latLng(latNorth, lonEast),
// );


// //NEW TO RENDER THE CAFES
// const BASE_FONT_SIZE = 2; // The font size (e.g., 12px) at your REFERENCE_ZOOM
// let REFERENCE_ZOOM; // Will be set when labels are first drawn

// // 2) Compute your imgBounds exactly as before
// // ... (imgBounds calculation) ...

// // 3) Create the map
// const map = L.map("map", {
//   center: imgBounds.getCenter(),
//   attributionControl: false,
//   zoom: 12, // Initial map zoom
//   minZoom: 14,
//   maxZoom: 24,
//   maxBounds: imgBounds.pad(0.05),
//   maxBoundsViscosity: 1.0,
// });

// // 4) Overlay your SVG
// L.imageOverlay("static/map.svg", imgBounds).addTo(map);

// // NEW TO RENDER THE CAFES
// map.createPane("svgLabels");
// map.getPane("svgLabels").style.pointerEvents = "none";

// L.svg({ pane: "svgLabels" }).addTo(map);
// const svg = map.getPanes().svgLabels.querySelector("svg");
// const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
// // No 'leaflet-zoom-animated' here, scaling is handled by parent svg or manually
// svg.appendChild(g);

// fetch("static/cafes.json")
//   .then((r) => r.json())
//   .then((cafes) => {
//     cafes.forEach((cafe) => {
//       const point = map.latLngToLayerPoint([cafe.lat, cafe.lng]);
//       const txt = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "text",
//       );
//       txt.setAttribute("x", point.x);
//       txt.setAttribute("y", point.y);
//       txt.setAttribute("dy", "-0.6em");
//       txt.setAttribute("text-anchor", "middle");
//       txt.textContent = cafe.name;
//       txt.classList.add(
//         cafe.status === "OPERATIONAL" ? "cafe-ok" : "cafe-down",
//       );

//       // Set initial font size (optional if CSS handles it, but good for consistency)
//       txt.setAttribute("font-size", BASE_FONT_SIZE);

//       g.appendChild(txt);
//     });

//     // Capture the zoom level at which the initial font sizes are set
//     if (REFERENCE_ZOOM === undefined) {
//       REFERENCE_ZOOM = map.getZoom();
//     }

//     // Function to update label positions
//     function updateLabelPositions() {
//       g.querySelectorAll("text").forEach((txt, i) => {
//         // Ensure cafes array is accessible if you need to re-access cafe data
//         // For this specific function, if only index 'i' is not enough,
//         // you might need to re-fetch or ensure 'cafes' is available in this scope.
//         // Assuming 'cafes' array from the fetch closure is still accessible:
//         if (cafes && cafes[i]) {
//           const cafe = cafes[i];
//           const pt = map.latLngToLayerPoint([cafe.lat, cafe.lng]);
//           txt.setAttribute("x", pt.x);
//           txt.setAttribute("y", pt.y);
//         }
//       });
//     }

//     // Function to update label styles (specifically font size for scaling)
//     function updateLabelStyles() {
//       if (typeof REFERENCE_ZOOM === "undefined") {
//         // Not ready yet, or map not fully initialized
//         console.warn("REFERENCE_ZOOM for label scaling is not set.");
//         return;
//       }

//       const currentZoom = map.getZoom();
//       const scale = map.getZoomScale(currentZoom, REFERENCE_ZOOM);

//       g.querySelectorAll("text").forEach((txt) => {
//         const newFontSize = BASE_FONT_SIZE * scale;
//         txt.setAttribute("font-size", newFontSize);
//       });
//     }

//     // Initial positioning and styling
//     updateLabelPositions();
//     updateLabelStyles();

//     // e) On zoom/pan, re‑project and re-style labels:
//     map.on("zoomend viewreset", () => {
//       // Use zoomend for styles to avoid rapid updates during zoom animation
//       updateLabelPositions();
//       updateLabelStyles();
//     });
//     map.on("moveend", updateLabelPositions); // Update positions on pan
//   })
//   .catch(console.error);

// // 5) Prepare the user marker (hidden until we get a fix)
// const userIcon = L.icon({
//   iconUrl: 'icon.png',   // your image path
//   iconSize: [70, 70],              // size in pixels
//   iconAnchor: [16, 16],              // point of the icon that maps to the marker’s latlng
//   popupAnchor: [0, -16]               // where popups point, relative to iconAnchor
// });

// const userMarker = L.marker([0, 0], { icon: userIcon })
//   .addTo(map);

// // 6) Helper: on first GPS fix, center the map there
// function onInitialPosition(pos) {
//   const ll = [pos.coords.latitude, pos.coords.longitude];
//   if (imgBounds.contains(ll)) {
//     map.setView(ll, 17); // zoom in on them
//     userMarker.setLatLng(ll);
//   } else {
//     // outside area → keep default fitBounds
//     map.fitBounds(imgBounds);
//   }
//   // start continuous tracking
//   navigator.geolocation.watchPosition(onUpdatePosition, onPosError, {
//     enableHighAccuracy: true,
//     maximumAge: 1000,
//     timeout: 5000,
//   });
// }

// // 7) Continuous updates just move the marker (and optionally pan)
// function onUpdatePosition(pos) {
//   const ll = [pos.coords.latitude, pos.coords.longitude];
//   if (imgBounds.contains(ll)) {
//     userMarker.setLatLng(ll);
//     map.panTo(ll);
//   }
// }

// function onPosError(err) {
//   console.error("Geolocation error:", err);
//   // fallback: show the full map
//   map.fitBounds(imgBounds);
// }

// // 8) Kick things off: request a one-time position
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(onInitialPosition, onPosError, {
//     enableHighAccuracy: true,
//     maximumAge: 0,
//     timeout: 10000,
//   });
// } else {
//   alert("Geolocation not supported, showing full map.");
//   map.fitBounds(imgBounds);
// }

// script.js (Map Script)

const imgWidth = 6583,
  imgHeight = 16838;
const anchorPx = [3048, 11835];
const anchorLatLng = [40.735863, -73.991084];
const totalLonSpan = 0.12,
  totalLatSpan = 0.182;

const degPerPxLon = totalLonSpan / imgWidth;
const degPerPxLat = totalLatSpan / imgHeight;
const [ax, ay] = anchorPx;
const [alat, alon] = anchorLatLng;
const latNorth = alat + ay * degPerPxLat;
const lonWest = alon - ax * degPerPxLon;
const latSouth = latNorth - totalLatSpan;
const lonEast = lonWest + totalLonSpan;
const imgBounds = L.latLngBounds(
  L.latLng(latSouth, lonWest),
  L.latLng(latNorth, lonEast),
);

const BASE_FONT_SIZE = 2;
let REFERENCE_ZOOM;

const map = L.map("map", {
  center: imgBounds.getCenter(),
  attributionControl: false,
  zoom: 12,
  minZoom: 14,
  maxZoom: 24,
  maxBounds: imgBounds.pad(0.05),
  maxBoundsViscosity: 1.0,
});

L.imageOverlay("static/map.svg", imgBounds).addTo(map);

map.createPane("svgLabels");
map.getPane("svgLabels").style.pointerEvents = "none";

L.svg({ pane: "svgLabels" }).addTo(map);
const svgMapRoot = map.getPanes().svgLabels.querySelector("svg"); // Renamed for clarity
const gSvgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); // Renamed for clarity
svgMapRoot.appendChild(gSvgGroup);

// Helper function to generate slugs (ensure this is identical to the one in your HTML/DOM script)
// Ensure this exact function is in BOTH list.js AND script.js
function generateCafeSlug(name) {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}


fetch("static/cafes.json")
  .then((r) => r.json())
  .then((cafes) => {
    cafes.forEach((cafe, index) => {
      const point = map.latLngToLayerPoint([cafe.lat, cafe.lng]);
      const txt = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      txt.setAttribute("x", point.x);
      txt.setAttribute("y", point.y);
      txt.setAttribute("dy", "-0.6em");
      txt.setAttribute("text-anchor", "middle");
      txt.textContent = cafe.name;

      // Create a unique ID for linking with checkboxes
      const cafeSlug = generateCafeSlug(cafe.name);
      const uniqueMapId = `${cafeSlug}-${index}`;
      txt.setAttribute("data-map-id", uniqueMapId); // Used for selection

      txt.classList.add(
        cafe.status === "OPERATIONAL" ? "cafe-ok" : "cafe-down",
      );
      txt.setAttribute("font-size", BASE_FONT_SIZE);
      gSvgGroup.appendChild(txt);
    });

    if (REFERENCE_ZOOM === undefined) {
      REFERENCE_ZOOM = map.getZoom();
    }

    function updateLabelPositions() {
      gSvgGroup.querySelectorAll("text").forEach((txt, i) => {
        if (cafes && cafes[i]) {
          const cafe = cafes[i];
          const pt = map.latLngToLayerPoint([cafe.lat, cafe.lng]);
          txt.setAttribute("x", pt.x);
          txt.setAttribute("y", pt.y);
        }
      });
    }

    function updateLabelStyles() {
      if (typeof REFERENCE_ZOOM === "undefined") {
        console.warn("REFERENCE_ZOOM for label scaling is not set.");
        return;
      }
      const currentZoom = map.getZoom();
      const scale = map.getZoomScale(currentZoom, REFERENCE_ZOOM);
      gSvgGroup.querySelectorAll("text").forEach((txt) => {
        const newFontSize = BASE_FONT_SIZE * scale;
        txt.setAttribute("font-size", newFontSize);
      });
    }

    updateLabelPositions();
    updateLabelStyles();

    map.on("zoomend viewreset", () => {
      updateLabelPositions();
      updateLabelStyles();
    });
    map.on("moveend", updateLabelPositions);
  })
  .catch(console.error);

// Function to be called by checkbox event listeners
window.updateCafeHighlightOnMap = function (mapId, isChecked) {
  if (!gSvgGroup) {
    console.error(
      "SVG group 'gSvgGroup' not found for updating cafe highlight.",
    );
    return;
  }
  const cafeTextElement = gSvgGroup.querySelector(
    `text[data-map-id="${mapId}"]`,
  );
  if (cafeTextElement) {
    if (isChecked) {
      cafeTextElement.classList.add("cafe-selected-highlight");
    } else {
      cafeTextElement.classList.remove("cafe-selected-highlight");
    }
  } else {
    console.warn(`Cafe text element with map-id "${mapId}" not found on map.`);
  }
};

// ... rest of your map script (userIcon, userMarker, geolocation, etc.)
const userIcon = L.icon({
  iconUrl: "icon.png", // your image path
  iconSize: [70, 70], // size in pixels
  iconAnchor: [16, 16], // point of the icon that maps to the marker’s latlng
  popupAnchor: [0, -16], // where popups point, relative to iconAnchor
});

const userMarker = L.marker([0, 0], { icon: userIcon }).addTo(map);

function onInitialPosition(pos) {
  const ll = [pos.coords.latitude, pos.coords.longitude];
  if (imgBounds.contains(ll)) {
    map.setView(ll, 17);
    userMarker.setLatLng(ll);
  } else {
    map.fitBounds(imgBounds);
  }
  navigator.geolocation.watchPosition(onUpdatePosition, onPosError, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 5000,
  });
}

function onUpdatePosition(pos) {
  const ll = [pos.coords.latitude, pos.coords.longitude];
  if (imgBounds.contains(ll)) {
    userMarker.setLatLng(ll);
    map.panTo(ll); // Optionally pan to keep user centered
  }
}

function onPosError(err) {
  console.error("Geolocation error:", err);
  map.fitBounds(imgBounds);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(onInitialPosition, onPosError, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000,
  });
} else {
  alert("Geolocation not supported, showing full map.");
  map.fitBounds(imgBounds);
}
