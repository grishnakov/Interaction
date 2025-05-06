document.addEventListener("DOMContentLoaded", () => {
  const uncheckedCt = document.getElementById("unchecked-container");
  const checkedCt = document.getElementById("checked-container");
  const searchInput = document.getElementById("cafe-search");
  let names = [];

  function slugify(n) {
    return n.replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
  }

  // render into the unchecked container by default
  function renderList(list) {
    uncheckedCt.innerHTML = "";
    list.forEach(name => {
      const id = `cafe-${slugify(name)}`;
      const wrap = document.createElement("div");
      wrap.className = "cafe-item";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = id;
      cb.value = name;

      const label = document.createElement("label");
      label.htmlFor = id;
      label.textContent = name;

      // move the wrapper on toggle
      cb.addEventListener("change", () => {
        if (cb.checked) {
          checkedCt.appendChild(wrap);
        } else {
          uncheckedCt.appendChild(wrap);
        }
        // also notify the map
        if (window.updateCafeHighlightOnMap) {
          window.updateCafeHighlightOnMap(name, cb.checked);
        }
      });

      wrap.appendChild(cb);
      wrap.appendChild(label);
      uncheckedCt.appendChild(wrap);
    });
  }

  fetch("static/cafes.json")
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(cafes => {
      names = [...new Set(cafes.map(c => c.name))]
        .sort((a, b) => a.localeCompare(b));
      renderList(names);
    })
    .catch(err => {
      console.error(err);
      uncheckedCt.textContent = "Error loading cafés.";
    });

  // simple search filter
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    renderList(
      names.filter(n => n.toLowerCase().includes(q))
    );
    // on re-render all become unchecked visually,
    // but any you’d already clicked will live in checkedCt
  });
});
