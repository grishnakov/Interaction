let scene, camera, renderer, texture, material, mesh, clock;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    const geometry = new THREE.PlaneGeometry(2, 2);

    const loader = new THREE.TextureLoader();
    texture = loader.load("png-clipart-rose-rose.png");

    material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            texture: { value: texture },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D texture;
            varying vec2 vUv;

            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
            }

            void main() {
                vec2 uv = vUv;

                // Apply a wavy distortion
                uv.x += sin(uv.y * 10.0 + time) * 0.02;
                uv.y += cos(uv.x * 10.0 + time) * 0.02;

                // Color shifting effect
                vec4 color = texture2D(texture, uv);
                color.r += sin(time + uv.x * 3.0) * 0.1;
                color.g += cos(time + uv.y * 3.0) * 0.1;
                color.b += sin(time * 0.5) * 0.1;

                // Subtle noise
                float n = noise(uv * 100.0 + time);
                color.rgb += vec3(n * 0.05);

                gl_FragColor = color;
            }
        `
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    material.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});

init();