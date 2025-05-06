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
