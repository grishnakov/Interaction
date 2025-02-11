setInterval(animateRandomness, 500);

function animateRandomness() {
    let typefaces = ["'jacquarda-bastarda-9'", "'Times New Roman'", "'Helvetica'", "'parlare"];

    console.log(typefaces);

    let text = document.getElementById('body-text');

    text.style.fontFamily = typefaces[Math.floor(Math.random() * typefaces.length)];

}