let scene, camera, renderer, texture, mesh, clock;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    // Create renderer with alpha enabled for transparency
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Set clear color to transparent
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    texture = new THREE.TextureLoader().load("seashell.png");

    let geometry = new THREE.PlaneGeometry(2, 2);
    let material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            texture1: { value: texture }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D texture1;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                uv.x += sin(uv.y * 2.0 + time) * 0.001;
                uv.y += cos(uv.x * 2.0 + time) * 0.01;
                vec4 color = texture2D(texture1, uv);
                gl_FragColor = color;
            }
        `,
        transparent: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    clock = new THREE.Clock();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    mesh.material.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init();
