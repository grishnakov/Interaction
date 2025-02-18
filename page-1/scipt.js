const toggleButton = document.getElementById("text");

toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    toggleButton.textContent = toggleButton.textContent === "ON" ? "OFF" : "ON";
});