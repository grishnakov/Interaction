document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const itemHeight = 24; // height of each letter wrapper (in pixels)
  const buffer = 5; // render extra items above and below the viewport
  let fonts = [
    '"erotica-big", sans-serif',
    '"glammo", sans-serif',
    '"dazzle-unicase", sans-serif'
  ];

  // Global microphone RMS value (used in your morphing logic)
  let currentRMS = 0;

  // Reference to our containers
  const viewport = document.getElementById("viewport");
  const spacer = document.getElementById("spacer");
  const visibleContainer = document.getElementById("visible-container");

  // Load the full text from text.txt
  fetch('text.txt')
    .then(response => response.text())
    .then(fullText => {
      // Convert text to an array of characters
      // (You can modify this if you want to preserve words/punctuation)
      const lettersArray = fullText.split('');
      const totalItems = lettersArray.length;

      // Set the spacer height to represent the total virtual height
      spacer.style.height = (totalItems * itemHeight) + "px";

      // Function to render only the letters that should be visible
      function renderVisible() {
        const scrollTop = viewport.scrollTop;
        const viewportHeight = viewport.clientHeight;
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
        const endIndex = Math.min(
          totalItems,
          Math.ceil((scrollTop + viewportHeight) / itemHeight) + buffer
        );

        // Position the visible container at the correct offset
        visibleContainer.style.transform = `translateY(${startIndex * itemHeight}px)`;
        visibleContainer.innerHTML = ""; // clear previous content

        // Render the letter wrappers for indices [startIndex, endIndex)
        for (let i = startIndex; i < endIndex; i++) {
          // Create the outer div container with class "second" (as in your example)
          const wordDiv = document.createElement("div");
          wordDiv.className = "second";
          wordDiv.setAttribute("alt", "flex");

          // Create the inner morph container
          const morphContainer = document.createElement("div");
          morphContainer.className = "morph-container-aesthetic";

          // Create the letter wrapper structure for this single character
          const wrapper = document.createElement("span");
          wrapper.className = "letter-wrapper";

          const letterVisible = document.createElement("span");
          letterVisible.className = "letter visible";
          letterVisible.textContent = lettersArray[i];

          const letterHidden = document.createElement("span");
          letterHidden.className = "letter";

          wrapper.appendChild(letterVisible);
          wrapper.appendChild(letterHidden);
          morphContainer.appendChild(wrapper);
          wordDiv.appendChild(morphContainer);

          visibleContainer.appendChild(wordDiv);
        }

        // After rendering the visible letter wrappers, initialize the morphing effect.
        initializeMorphing(visibleContainer);
      }

      // Attach scroll event listener to update the visible portion on scroll
      viewport.addEventListener("scroll", renderVisible);
      // Initial render
      renderVisible();
    })
    .catch(err => console.error("Error loading text.txt:", err));

  // -------------------------------
  // Morphing Code for each letter wrapper
  // -------------------------------
  function initializeMorphing(container) {
    // For each letter-wrapper in the current container, attach the morphing update logic.
    container.querySelectorAll('.letter-wrapper').forEach(wrapper => {
      const letters = wrapper.querySelectorAll('.letter');
      // Initialize with a random font for the visible letter span.
      let currentFontIndex = Math.floor(Math.random() * fonts.length);
      letters[0].style.fontFamily = fonts[currentFontIndex];

      function updateLetter() {
        // Only update if there is sufficient sound RMS.
        if (currentRMS < 0.05) {
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
        hiddenEl.textContent = visibleEl.textContent;
        hiddenEl.style.fontFamily = fonts[nextFontIndex];
        hiddenEl.classList.remove('visible');
        // Force reflow to trigger the transition
        void hiddenEl.offsetWidth;
        visibleEl.classList.remove('visible');
        hiddenEl.classList.add('visible');
        currentFontIndex = nextFontIndex;
        // Delay based on currentRMS (loudness)
        const delay = Math.random() * (3000 * (1 - currentRMS)) + 100;
        setTimeout(updateLetter, delay);
      }
      setTimeout(updateLetter, 1000);
    });
  }

  // -------------------------------
  // Microphone Input & Debug Bar (unchanged)
  // -------------------------------
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.fftSize);

      const debugBarContainer = document.createElement('div');
      debugBarContainer.style.position = 'fixed';
      debugBarContainer.style.top = '50%';
      debugBarContainer.style.right = '20px';
      debugBarContainer.style.transform = 'translateY(-50%)';
      debugBarContainer.style.width = '30px';
      debugBarContainer.style.height = '200px';
      debugBarContainer.style.backgroundColor = '#eee';
      debugBarContainer.style.border = '1px solid #aaa';
      document.body.appendChild(debugBarContainer);

      const levelIndicator = document.createElement('div');
      levelIndicator.style.width = '100%';
      levelIndicator.style.height = '0%';
      levelIndicator.style.backgroundColor = 'red';
      debugBarContainer.appendChild(levelIndicator);

      function updateDebugBar() {
        analyser.getByteTimeDomainData(dataArray);
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 64;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        currentRMS = rms;
        const heightPercent = Math.min(100, rms * 100);
        levelIndicator.style.height = `${heightPercent}%`;
        requestAnimationFrame(updateDebugBar);
      }
      updateDebugBar();
    })
    .catch(err => {
      console.error('Error accessing microphone:', err);
    });
});
