document.addEventListener("DOMContentLoaded", function () {
    const cafeListContainer = document.getElementById("cafe-list-container");
  
    // Check if the container element exists
    if (!cafeListContainer) {
      console.error("Error: The element #cafe-list-container was not found.");
      return;
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
          // Sanitize cafe name for use in attributes (id, name)
          // Removes special characters (except spaces and hyphens), converts to lowercase, and replaces spaces with hyphens
          const safeCafeNameSlug = cafe.name
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .toLowerCase();
  
          // Create a unique ID for the checkbox and its label
          const checkboxId = `cafe-checkbox-${safeCafeNameSlug}-${index}`;
  
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = checkboxId;
          // Use the slugified name for the 'name' attribute, similar to your original hardcoded list
          checkbox.name = safeCafeNameSlug || `cafe-${index}`; // Fallback if name becomes empty
          checkbox.value = cafe.name; // The actual cafe name as the value
  
          const label = document.createElement("label");
          label.htmlFor = checkboxId;
          label.textContent = cafe.name;
  
          const br = document.createElement("br"); // To maintain line breaks like in the original
  
          cafeListContainer.appendChild(checkbox);
          cafeListContainer.appendChild(label);
          cafeListContainer.appendChild(br);
        });
      })
      .catch((error) => {
        console.error("Error fetching or processing cafes.json:", error);
        if (cafeListContainer) {
          // Display a user-friendly error message in the list container
          cafeListContainer.textContent =
            "Failed to load the cafe collection. Please try again later.";
        }
      });
  });