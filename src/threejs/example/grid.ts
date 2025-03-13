import { gui } from "../common/gui";
import { scene, THREE } from "../common/main";

const vertexShader = /* glsl */ `
uniform float uGridCount;

varying vec2 textureCoord;
varying vec2 st;

void main() {
    textureCoord = uv;
    st = uv * uGridCount;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uGridCount;

varying vec2 textureCoord;
varying vec2 st;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec3 color = vec3(
        random(st),
        random(st + vec2(1.0)),
        random(st + vec2(2.0))
    );
    gl_FragColor = vec4(color, 1.0);
}
`;

const folder = gui.addFolder("grid");
const params = {
    gridCount: 5
};

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        uGridCount: { value: params.gridCount }
    }
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

folder.add(params, 'gridCount', 1, 20, 1).onChange((value) => {
    material.uniforms.uGridCount.value = value;
});

