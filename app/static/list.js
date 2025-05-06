// static/list.js
document.addEventListener("DOMContentLoaded", function () {
  const cafeListContainer = document.getElementById("cafe-list-container");

  if (!cafeListContainer) {
    console.error("Error: The element #cafe-list-container was not found.");
    return;
  }

  // Helper function to generate slugs (if still needed)
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
      if (!cafes || cafes.length === 0) { // Added a check for !cafes
        cafeListContainer.textContent = "No cafes found.";
        return;
      }

      // 1. Create a list of unique cafe names first
      const uniqueCafeNames = [
        ...new Set(cafes.map(cafe => cafe.name)),
      ];

      // 2. Sort the unique cafe names alphabetically
      uniqueCafeNames.sort((a, b) => a.localeCompare(b));

      if (uniqueCafeNames.length === 0) {
        cafeListContainer.textContent = "No cafes found.";
        return;
      }

      // 3. Iterate over the sorted unique names to create checkboxes
      uniqueCafeNames.forEach((cafeName) => {
        const safeCafeNameSlug = generateCafeSlug(cafeName);
        const checkboxId = `cafe-checkbox-${safeCafeNameSlug}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = checkboxId;
        checkbox.name = `cafe-group-${safeCafeNameSlug}`;
        checkbox.value = cafeName; // The actual cafe name as the value

        checkbox.addEventListener("change", function () {
          if (typeof window.updateCafeHighlightOnMap === "function") {
            window.updateCafeHighlightOnMap(this.value, this.checked);
          } else {
            console.error(
              "updateCafeHighlightOnMap function not found. Ensure map script (script.js) is loaded and the function is globally available.",
            );
          }
        });

        const label = document.createElement("label");
        label.htmlFor = checkboxId;
        label.textContent = cafeName;

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
