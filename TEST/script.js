document.addEventListener("DOMContentLoaded", () => {
  const itemHeight = 24; // Fixed height per letter-wrapper (must match your CSS)
  const buffer = 10; // Extra items above and below viewport
  const maxNativeHeight = 50000; // Cap for the native scrollable height

  const fonts = [
    '"erotica-big", sans-serif',
    '"glammo", sans-serif',
    '"dazzle-unicase", sans-serif'
  ];
  let currentRMS = 0;

  const viewport = document.getElementById("viewport");
  const spacer = document.getElementById("spacer");
  const visibleContainer = document.getElementById("visible-container");

  // Load full text from text.txt
  fetch('text.txt')
    .then(response => response.text())
    .then(fullText => {
      // Split the text into an array of characters (or words if you prefer)
      const lettersArray = fullText.split('');
      const totalItems = lettersArray.length;
      const totalVirtualHeight = totalItems * itemHeight;

      // Calculate scaleFactor. If totalVirtualHeight exceeds maxNativeHeight, we scale.
      const scaleFactor = totalVirtualHeight > maxNativeHeight
        ? (maxNativeHeight / totalVirtualHeight)
        : 1;

      // Set the spacer's height to our capped native height
      spacer.style.height = (totalVirtualHeight > maxNativeHeight
        ? maxNativeHeight
        : totalVirtualHeight) + "px";

      // Create a flex paragraph container for visible content
      const flexParagraph = document.createElement('p');
      flexParagraph.className = "flex-paragraph";
      flexParagraph.style.margin = "0";
      visibleContainer.appendChild(flexParagraph);

      function renderVisible() {
        // Use the native scrollTop and scale it to get the virtual scrollTop.
        const nativeScrollTop = viewport.scrollTop;
        const virtualScrollTop = nativeScrollTop / scaleFactor;

        const viewportHeight = viewport.clientHeight;
        const startIndex = Math.max(0, Math.floor(virtualScrollTop / itemHeight) - buffer);
        const endIndex = Math.min(
          totalItems,
          Math.ceil((virtualScrollTop + viewportHeight) / itemHeight) + buffer
        );

        // Debug: log scroll values and computed indices.
        console.log(`Native scrollTop: ${nativeScrollTop} | Virtual: ${virtualScrollTop} | Render indices: ${startIndex} to ${endIndex}`);

        // Position the flex paragraph at the right offset.
        flexParagraph.style.transform = `translateY(${startIndex * itemHeight}px)`;
        flexParagraph.innerHTML = "";

        // Render each letter in the current visible window.
        for (let i = startIndex; i < endIndex; i++) {
          const letterWrapper = document.createElement('span');
          letterWrapper.className = "letter-wrapper";

          const letterVisible = document.createElement('span');
          letterVisible.className = "letter visible";
          letterVisible.textContent = lettersArray[i];

          const letterHidden = document.createElement('span');
          letterHidden.className = "letter";

          letterWrapper.appendChild(letterVisible);
          letterWrapper.appendChild(letterHidden);
          flexParagraph.appendChild(letterWrapper);
        }
        initializeMorphing(flexParagraph);
      }

      viewport.addEventListener("scroll", renderVisible);
      renderVisible();
    })
    .catch(err => console.error("Error loading text.txt:", err));

  function initializeMorphing(container) {
    container.querySelectorAll('.letter-wrapper').forEach(wrapper => {
      const letters = wrapper.querySelectorAll('.letter');
      let currentFontIndex = Math.floor(Math.random() * fonts.length);
      letters[0].style.fontFamily = fonts[currentFontIndex];

      function updateLetter() {
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
        void hiddenEl.offsetWidth;
        visibleEl.classList.remove('visible');
        hiddenEl.classList.add('visible');
        currentFontIndex = nextFontIndex;
        const delay = Math.random() * (3000 * (1 - currentRMS)) + 100;
        setTimeout(updateLetter, delay);
      }
      setTimeout(updateLetter, 1000);
    });
  }

  // Microphone input and debug bar remain unchanged.
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
      console.error("Error accessing microphone:", err);
    });
});
