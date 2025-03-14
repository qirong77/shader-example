import { scene, THREE } from "../common/main";

const vertexShader = /* glsl */ `
varying vec2 textureCoord;

void main() {
    textureCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float u_time;

varying vec2 textureCoord;

float starSDF(vec2 st) {
}

void main() {
    vec2 st = textureCoord;

    // 计算四角星的 SDF
    float d = starSDF(st, 0.4); // 控制四角星大小


    gl_FragColor = 
}
`;

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);