setInterval(animateRandomness, 1500);

function animateRandomness() {

    let images = ['ocean-waves.jpg', 'fish.jpeg', 'ripple.jpeg', 'Michael Kukla.jpeg', 'bread.jpeg'];

    console.log(images);

    let rectangle = document.getElementById('rectangle');

    let wave = document.getElementById('wavy-line');

    let sea = document.getElementById('sea');

    let secondrectangle = document.getElementById('rectangletwo')

    rectangle.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;

    wave.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;
    rectangletwo.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`;

    let palette = ['#163655', '#401E01', '#D9C3B0', '#F2F2F2'];

    sea.style.color = palette[Math.floor(Math.random() * palette.length)];

    // alert("Refresh Page for More Visual Texture"); // 

} let typefaces = ["\"Arial, sans-serif\",",
    "Georgia, serif",
    "'Courier New', monospace",
    "'Comic Sans MS', cursive, sans-serif",
    "'Times New Roman', serif",
    "'Trebuchet MS', sans-serif",
    "'Verdana', sans-serif", "jacquarda-bastarda-9", "]",

    setInterval(animateRandomness, 1500)];

