// alert("Warning! Visual Satisfactory Advisory!")

document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector("video");

    function setPlaybackSpeed() {
        video.playbackRate = 10.0; // Adjust speed as needed
        console.log("Playback speed set to:", video.playbackRate);
    }

    if (video.readyState >= 2) {
        setPlaybackSpeed(); // If already loaded, apply speed
    } else {
        video.addEventListener("loadeddata", setPlaybackSpeed); // Wait until it's ready
    }
});


const toggleButton = document.getElementById("text");

toggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    toggleButton.textContent = toggleButton.textContent === "ON" ? "OFF" : "ON";
});
