


// const imgWidth = 6583, imgHeight = 16838;
// const anchorPx = [3048, 11835];
// const anchorLatLng = [40.735863, -73.991084];
// const totalLonSpan = 0.120, totalLatSpan = 0.182;

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
//     L.latLng(latSouth, lonWest),
//     L.latLng(latNorth, lonEast)
// );

// // 3) Create the map **with a default center+zoom** (we'll override below)
// const map = L.map('map', {
//     center: imgBounds.getCenter(),
//     attributionControl: false,
//     zoom: 12,
//     minZoom: 11,
//     maxZoom: 24,
//     maxBounds: imgBounds.pad(0.05),
//     maxBoundsViscosity: 1.0,
// });

// // 4) Overlay your SVG
// L.imageOverlay('/static/map.svg', imgBounds).addTo(map);

// // 5) Prepare the user marker (hidden until we get a fix)
// const userMarker = L.circleMarker([0, 0], {
//     radius: 8, fillColor: '#007AFF', color: '#fff',
//     weight: 2, fillOpacity: 0.8
// }).addTo(map);

// // 6) Helper: on first GPS fix, center the map there
// function onInitialPosition(pos) {
//     const ll = [pos.coords.latitude, pos.coords.longitude];
//     if (imgBounds.contains(ll)) {
//         map.setView(ll, 17);            // zoom in on them
//         userMarker.setLatLng(ll);
//     } else {
//         // outside area → keep default fitBounds
//         map.fitBounds(imgBounds);
//     }
//     // start continuous tracking
//     navigator.geolocation.watchPosition(onUpdatePosition, onPosError, {
//         enableHighAccuracy: true,
//         maximumAge: 1000,
//         timeout: 5000
//     });
// }

// // 7) Continuous updates just move the marker (and optionally pan)
// function onUpdatePosition(pos) {
//     const ll = [pos.coords.latitude, pos.coords.longitude];
//     if (imgBounds.contains(ll)) {
//         userMarker.setLatLng(ll);
//         // uncomment to follow them:
//         // map.panTo(ll);
//     }
// }

// function onPosError(err) {
//     console.error('Geolocation error:', err);
//     // fallback: show the full map
//     map.fitBounds(imgBounds);
// }

// // 8) Kick things off: request a one-time position
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(onInitialPosition, onPosError, {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 10000
//     });
// } else {
//     alert('Geolocation not supported, showing full map.');
//     map.fitBounds(imgBounds);
// }

// const navView = document.getElementById('nav-view');

// // function loadNavPage(url, pushState = true) {
// //     fetch(url)
// //         .then(res => {
// //             if (!res.ok) throw new Error(res.statusText);
// //             return res.text();
// //         })
// //         .then(html => {
// //             navView.innerHTML = html;
// //             if (pushState) history.pushState({ page: url }, '', url);
// //         })

// //         .catch(err => {
// //             navView.innerHTML = `<p style="color:red">Error loading page.<br>${err}</p>`;
// //         });
// // }
// function loadNavPage(url, pushState = true) {
//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(res.statusText);
//         return res.text();
//       })
//       .then((html) => {
//         navView.innerHTML = html;
//         // Remove or comment out the line below:
//         // if (pushState) history.pushState({ page: url }, '', url);
//       })
//       .catch((err) => {
//         navView.innerHTML = `<p style="color:red">Error loading page.<br>${err}</p>`;
//       });
//   }
  

// // Attach click‐handlers to every <a class="nav-link">
// document.querySelectorAll('.nav-link').forEach(link => {
//     link.addEventListener('click', e => {
//         e.preventDefault();
//         const href = link.getAttribute('href');
//         loadNavPage(href);
//     });
// });

// // Back/forward support
// window.addEventListener('popstate', e => {
//     if (e.state && e.state.page) {
//         loadNavPage(e.state.page, false);
//     }
// });


// script.js

const imgWidth = 6583,
  imgHeight = 16838;
const anchorPx = [3048, 11835];
const anchorLatLng = [40.735863, -73.991084];
const totalLonSpan = 0.12,
  totalLatSpan = 0.182;

// 2) Compute your imgBounds exactly as before
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

// 3) Create the map **with a default center+zoom** (we'll override below)
const map = L.map("map", {
  center: imgBounds.getCenter(),
  attributionControl: false,
  zoom: 12,
  minZoom: 11,
  maxZoom: 24,
  maxBounds: imgBounds.pad(0.05),
  maxBoundsViscosity: 1.0,
});

// 4) Overlay your SVG
L.imageOverlay("/static/map.svg", imgBounds).addTo(map);

// 5) Prepare the user marker (hidden until we get a fix)
const userMarker = L.circleMarker([0, 0], {
  radius: 8,
  fillColor: "#007AFF",
  color: "#fff",
  weight: 2,
  fillOpacity: 0.8,
}).addTo(map);

// 6) Helper: on first GPS fix, center the map there
function onInitialPosition(pos) {
  const ll = [pos.coords.latitude, pos.coords.longitude];
  if (imgBounds.contains(ll)) {
    map.setView(ll, 17); // zoom in on them
    userMarker.setLatLng(ll);
  } else {
    // outside area → keep default fitBounds
    map.fitBounds(imgBounds);
  }
  // start continuous tracking
  navigator.geolocation.watchPosition(onUpdatePosition, onPosError, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 5000,
  });
}

// 7) Continuous updates just move the marker (and optionally pan)
function onUpdatePosition(pos) {
  const ll = [pos.coords.latitude, pos.coords.longitude];
  if (imgBounds.contains(ll)) {
    userMarker.setLatLng(ll);
    // uncomment to follow them:
    // map.panTo(ll);
  }
}

function onPosError(err) {
  console.error("Geolocation error:", err);
  // fallback: show the full map
  map.fitBounds(imgBounds);
}

// 8) Kick things off: request a one-time position
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

// --- Navigation Logic ---
const navElement = document.querySelector("nav");
const navView = document.getElementById("nav-view");
const initialNavViewContent = navView.innerHTML; // Store initial content
let currentNavUrl = null; // Track the currently loaded content URL

// Function to show the main menu (hide content, show UL)
function showMainMenu() {
  navView.innerHTML = initialNavViewContent; // Restore initial content
  navElement.classList.remove("content-loaded"); // Remove class to show UL
  currentNavUrl = null; // Reset tracker
}

// Function to load content into the nav view
function loadNavPage(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.text();
    })
    .then((html) => {
      // Check if the fetched content is just an HTML document wrapper
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML; // Try to get only body content

      // Use body content if available, otherwise use the full HTML
      navView.innerHTML = bodyContent || html;

      navElement.classList.add("content-loaded"); // Add class to hide UL
      currentNavUrl = url; // Update tracker

      // Re-attach event listeners if the loaded content has forms/buttons
      // Example for login form:
      const loginForm = navView.querySelector('form[action="/login"]');
      if (loginForm) {
        loginForm.addEventListener("submit", handleLoginFormSubmit);
      }
      // Add similar logic for other forms/interactive elements if needed
    })
    .catch((err) => {
      // On error, revert to main menu state
      showMainMenu();
      // Display an error message within the restored view
      navView.insertAdjacentHTML(
        "beforeend",
        `<p style="color:red; margin-top: 1rem;">Error loading page: ${err.message}</p>`,
      );
      console.error("Fetch error:", err);
    });
}

// Example handler for a form loaded into nav-view
function handleLoginFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission
  const form = event.target;
  const formData = new FormData(form);

  // Use fetch to submit the form data to your FastAPI backend
  fetch(form.action, {
    method: form.method,
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed"); // Or handle specific errors
      }
      return response.json(); // Or text(), depending on what your backend returns
    })
    .then((data) => {
      console.log("Login successful:", data);
      // Maybe show a success message or redirect
      navView.innerHTML = `<p>Login successful!</p>`;
      // Optionally, automatically close the nav or show the menu again
      // setTimeout(showMainMenu, 2000);
    })
    .catch((error) => {
      console.error("Login error:", error);
      // Show error message within the nav-view
      const errorElement =
        form.querySelector(".error-message") ||
        document.createElement("p");
      errorElement.textContent = `Login failed: ${error.message}`;
      errorElement.style.color = "red";
      errorElement.classList.add("error-message"); // For potential re-use
      if (!form.contains(errorElement)) {
        form.insertAdjacentElement("afterend", errorElement);
      }
    });
}

// Attach click‐handlers to every <a class="nav-link">
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link navigation
    const href = link.getAttribute("href");

    if (href === currentNavUrl) {
      // If the clicked link's content is already showing, hide it and show menu
      showMainMenu();
    } else {
      // Otherwise, load the new content
      loadNavPage(href);
    }
  });
});

// Note: The popstate listener might need adjustment if you re-enable history.pushState
// window.addEventListener('popstate', e => {
//     if (e.state && e.state.page) {
//         loadNavPage(e.state.page, false); // false might not be needed now
//     } else {
//         showMainMenu(); // Revert to main menu if no state
//     }
// });
