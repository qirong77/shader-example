import { scene, THREE } from "../../common/main";

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float time;
varying vec2 vUv;

// 随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 噪声函数
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    // 缩放UV坐标以创建更多星星
    vec2 st = vUv * 20.0;
    
    // 使用噪声函数创建星星分布
    float n = noise(st);
    
    // 创建星星闪烁效果
    float sparkle = sin(time * 2.0 + n * 10.0) * 0.5 + 0.5;
    
    // 星星亮度阈值
    float brightness = smoothstep(0.7, 0.71, n + sparkle * 0.2);
    
    // 添加一些颜色变化
    vec3 color = vec3(brightness);
    color += vec3(0.2, 0.2, 0.6) * brightness; // 添加蓝色调
    
    // 输出最终颜色
    gl_FragColor = vec4(color, 1.0);
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