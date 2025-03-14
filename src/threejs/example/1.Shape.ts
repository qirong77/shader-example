import { scene, THREE } from "../common/main";
/* 
距离场（Distance Field, DF）技术是一种用于表示空间中点到最近物体表面距离的数学方法。它在图像处理、计算机图形学、物理学等领域有广泛应用。距离场的值通常为非负数，表示点到最近表面的距离。
而有符号距离场（Signed Distance Field, SDF）是距离场的一种变体，它在距离值的基础上添加了符号信息：正值表示点在物体外部，负值表示点在物体内部，零值表示点在物体表面上。
*/
const vertexShader = /* glsl */ `
varying vec2 textureCoord;
varying vec2 st;
void main() {
    textureCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float u_shape; // 控制显示的形状：0-圆形, 1-五角星, 2-月亮

varying vec2 textureCoord;

// 辅助函数：平滑过渡
float smootherstep(float edge0, float edge1, float x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

// 五角星SDF
float starSDF(vec2 st, float size) {
    st = st * 2.0 - 1.0;
    float angle = atan(st.y, st.x);
    float radius = length(st);

    float ma = mod(angle + 3.14159 / 2.0, 2.0 * 3.14159 / 5.0) - 3.14159 / 5.0;
    float r = size * cos(ma) / cos(2.0 * 3.14159 / 5.0 - ma);

    return 1.0 - smoothstep(0.0, 0.1, abs(radius - r));
}

// 月亮SDF
float moonSDF(vec2 st) {
    st = st * 2.0 - 1.0;
    float d1 = length(st);
    float d2 = length(st - vec2(0.2, 0.0));
    float moon = smoothstep(0.0, 0.1, d1 - 0.3) - smoothstep(0.0, 0.1, d2 - 0.4);
    return 1.0 - moon;
}

void main() {
    vec2 st = textureCoord;
    float d;
    // 圆形
    // vec2 coordinateUv = st * 2.0 - vec2(1.0, 1.0);
    // d = length(coordinateUv);
    // d = smoothstep(0.0, 1.0, d);
    // 五角星
    d = starSDF(st, 0.5);
    // 月亮
    // d = moonSDF(st);
    gl_FragColor = vec4(d, d, d, 1.0);
}
`;

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        u_shape: { value: 0.0 },
    },
    side: THREE.DoubleSide,
    transparent: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 动画效果：每3秒切换一次形状
let currentShape = 0;
setInterval(() => {
    currentShape = (currentShape + 1) % 3;
    material.uniforms.u_shape.value = currentShape;
}, 3000);
