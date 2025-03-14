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
    float x = abs(st.x);
    float y = abs(st.y);
    bool isInside = y < (-1. * x + 1.);
    if (isInside) {
        return 0.0;
    }
    return 1.0;
}

void main() {
    vec2 st = textureCoord;
    st = st * 2.0 - 1.0;  // 将坐标范围调整为[-1,1]
    float d = starSDF(st);
    // 添加平滑过渡
    d = smoothstep(0.0, 0.1, d);
    gl_FragColor = vec4(vec3(d), 1.0);
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
