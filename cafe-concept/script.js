// 1. Create map with a simple, pixel‑based coordinate system
var map = L.map('map', {
    // Simple CRS: 1 unit = 1px
    crs: L.CRS.Simple,
    minZoom: 3,    // allow zooming out
    maxZoom: 6      // adjust as you like
});

// 2. Figure out your image’s pixel dimensions
//    Let’s say your PNG is 2000×1200px
var w = 6583,
    h = 16838;

// 3. Define the image’s bounds in “map units”
var southWest = map.unproject([0, h], map.getMaxZoom());
var northEast = map.unproject([w, 0], map.getMaxZoom());
var bounds = new L.LatLngBounds(southWest, northEast);


L.imageOverlay('test-map.svg', bounds).addTo(map);

// 5. Tell the map to fit those bounds
map.fitBounds(bounds);
