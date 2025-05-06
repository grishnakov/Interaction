// document.addEventListener("DOMContentLoaded", function () {
//     const cafeListContainer = document.getElementById("cafe-list-container");
  
//     // Check if the container element exists
//     if (!cafeListContainer) {
//       console.error("Error: The element #cafe-list-container was not found.");
//       return;
//     }
  
//     fetch("static/cafes.json")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((cafes) => {
//         if (cafes.length === 0) {
//           cafeListContainer.textContent = "No cafes found.";
//           return;
//         }
  
//         cafes.forEach((cafe, index) => {
//           // Sanitize cafe name for use in attributes (id, name)
//           // Removes special characters (except spaces and hyphens), converts to lowercase, and replaces spaces with hyphens
//           const safeCafeNameSlug = cafe.name
//             .replace(/[^a-zA-Z0-9\s-]/g, "")
//             .trim()
//             .replace(/\s+/g, "-")
//             .toLowerCase();
  
//           // Create a unique ID for the checkbox and its label
//           const checkboxId = `cafe-checkbox-${safeCafeNameSlug}-${index}`;
  
//           const checkbox = document.createElement("input");
//           checkbox.type = "checkbox";
//           checkbox.id = checkboxId;
//           // Use the slugified name for the 'name' attribute, similar to your original hardcoded list
//           checkbox.name = safeCafeNameSlug || `cafe-${index}`; // Fallback if name becomes empty
//           checkbox.value = cafe.name; // The actual cafe name as the value
  
//           const label = document.createElement("label");
//           label.htmlFor = checkboxId;
//           label.textContent = cafe.name;
  
//           const br = document.createElement("br"); // To maintain line breaks like in the original
  
//           cafeListContainer.appendChild(checkbox);
//           cafeListContainer.appendChild(label);
//           cafeListContainer.appendChild(br);
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching or processing cafes.json:", error);
//         if (cafeListContainer) {
//           // Display a user-friendly error message in the list container
//           cafeListContainer.textContent =
//             "Failed to load the cafe collection. Please try again later.";
//         }
//       });
//   });

// Your script that runs on DOMContentLoaded (e.g., in your HTML or a separate UI script)
document.addEventListener("DOMContentLoaded", function () {
  const cafeListContainer = document.getElementById("cafe-list-container");

  if (!cafeListContainer) {
    console.error("Error: The element #cafe-list-container was not found.");
    return;
  }

  // Helper function to generate slugs (ensure this is identical to the one in your map script)
  // Ensure this exact function is in BOTH list.js AND script.js
  function generateCafeSlug(name) {
    return name
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
  }

  fetch("static/cafes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((cafes) => {
      if (cafes.length === 0) {
        cafeListContainer.textContent = "No cafes found.";
        return;
      }

      cafes.forEach((cafe, index) => {
        const safeCafeNameSlug = generateCafeSlug(cafe.name);
        const uniqueMapId = `${safeCafeNameSlug}-${index}`; // Unique ID for map linking

        const checkboxId = `cafe-checkbox-${uniqueMapId}`; // Make checkbox ID also fully unique

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = checkboxId;
        checkbox.name = safeCafeNameSlug || `cafe-${index}`;
        checkbox.value = cafe.name;
        checkbox.dataset.mapId = uniqueMapId; // Store the map ID for the event listener

        checkbox.addEventListener("change", function () {
          if (typeof window.updateCafeHighlightOnMap === "function") {
            window.updateCafeHighlightOnMap(
              this.dataset.mapId,
              this.checked,
            );
          } else {
            console.error(
              "updateCafeHighlightOnMap function not found. Ensure map script (script.js) is loaded and the function is globally available.",
            );
          }
        });

        const label = document.createElement("label");
        label.htmlFor = checkboxId;
        label.textContent = cafe.name;

        const br = document.createElement("br");

        cafeListContainer.appendChild(checkbox);
        cafeListContainer.appendChild(label);
        cafeListContainer.appendChild(br);
      });
    })
    .catch((error) => {
      console.error("Error fetching or processing cafes.json:", error);
      if (cafeListContainer) {
        cafeListContainer.textContent =
          "Failed to load the cafe collection. Please try again later.";
      }
    });
});
