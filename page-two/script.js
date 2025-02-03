const toggleButton = document.getElementById("text");

toggleButton.addEventListener("click", function () {
    toggleButton.textContent = toggleButton.textContent === "ON" ? "OFF" : "ON";
});



