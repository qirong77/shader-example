import { scene, THREE } from "../../common/main";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    uniform float time;
    void main() {
        vec2 uv = vUv;
    }
`;

const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// 动画循环
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.time.value += 0.01;
}
animate();
