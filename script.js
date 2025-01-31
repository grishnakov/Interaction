const textcontainer = document.getElementById("textcontainer");
let easeFactor = 0.02;
let scene, camera, renderer, planeMesh;
let mousPoisiton = { x: 0.5, y: 0.5 };
let prevPosition = { x: 0.5, y: 0.5 };
const vertexShader = `

