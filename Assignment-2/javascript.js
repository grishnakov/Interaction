// Define your fonts array
const fonts = [
    '"erotica-big", sans-serif',
    // '"glammo", sans-serif',
    // '"am-serie-610", sans-serif',
    '"jacquarda-bastarda-9", sans-serif',
    '"dazzle-unicase", sans-serif',
    '"courier-std", monospace',

];

// Global variable to store the current RMS (intensity)
let currentRMS = 0;

// --------------------------
// Letter Morphing Code
// --------------------------
document.querySelectorAll('.letter-wrapper').forEach(wrapper => {
    const letters = wrapper.querySelectorAll('.letter');
    // Initialize with a random starting font for each letter
    let currentFontIndex = Math.floor(Math.random() * fonts.length);
    letters[0].style.fontFamily = fonts[currentFontIndex];

    // Function to update (crossfade) this letter's font
    function updateLetter() {
        // Only update if there is sufficient sound.
        if (currentRMS < 0.05) {
            // If there's little to no sound, check again in a short while.
            setTimeout(updateLetter, 100);
            return;
        }

        const nextFontIndex = (currentFontIndex + 1) % fonts.length;
        let visibleEl, hiddenEl;
        if (letters[0].classList.contains('visible')) {
            visibleEl = letters[0];
            hiddenEl = letters[1];
        } else {
            visibleEl = letters[1];
            hiddenEl = letters[0];
        }

        // Prepare the hidden element with the new font
        hiddenEl.textContent = visibleEl.textContent;
        hiddenEl.style.fontFamily = fonts[nextFontIndex];
        hiddenEl.classList.remove('visible');

        // Force reflow to ensure the transition applies
        void hiddenEl.offsetWidth;

        // Crossfade the letters
        visibleEl.classList.remove('visible');
        hiddenEl.classList.add('visible');

        // Update the font index
        currentFontIndex = nextFontIndex;

        // Calculate delay based on currentRMS:
        // - When currentRMS is high (loud), the delay is short.
        // - When it's just above the threshold, the delay is longer.
        const delay = Math.random() * (3000 * (1 - currentRMS)) + 100;
        setTimeout(updateLetter, delay);
    }

    // Start the update loop for this letter with an initial delay.
    setTimeout(updateLetter, 1000);
});

// --------------------------
// Microphone Input & Debug Bar Code
// --------------------------
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256; // Smaller FFT size for faster analysis
        source.connect(analyser);

        // Create a Uint8Array to hold time-domain data
        const dataArray = new Uint8Array(analyser.fftSize);

        // --- Create the Debug Bar ---
        const debugBarContainer = document.createElement('div');
        // debugBarContainer.style.position = 'fixed';
        // debugBarContainer.style.top = '50%';
        // debugBarContainer.style.right = '20px';
        // debugBarContainer.style.transform = 'translateY(-50%)';
        // debugBarContainer.style.width = '30px';
        // debugBarContainer.style.height = '200px';
        // debugBarContainer.style.backgroundColor = '#eee';
        // debugBarContainer.style.border = '1px solid #aaa';
        document.body.appendChild(debugBarContainer);

        const levelIndicator = document.createElement('div');
        levelIndicator.style.width = '100%';
        levelIndicator.style.height = '0%';
        levelIndicator.style.backgroundColor = 'red';
        debugBarContainer.appendChild(levelIndicator);

        // --- Update Loop for the Debug Bar & RMS Calculation ---
        function updateDebugBar() {
            analyser.getByteTimeDomainData(dataArray);

            let sumSquares = 0;
            for (let i = 0; i < dataArray.length; i++) {
                // Normalize sample from [0,255] to roughly [-1, 1]
                const normalized = (dataArray[i] - 128) / 128;
                sumSquares += normalized * normalized;
            }
            const rms = Math.sqrt(sumSquares / dataArray.length);

            // Update the global RMS value
            currentRMS = rms;

            // Map the RMS (roughly 0–1) to a percentage for the debug bar height.
            const heightPercent = Math.min(100, rms * 100);
            levelIndicator.style.height = `${heightPercent}%`;

            requestAnimationFrame(updateDebugBar);
        }
        updateDebugBar();
    })
    .catch(err => {
        console.error('Error accessing microphone:', err);
    });

