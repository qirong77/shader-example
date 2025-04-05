import { scene, THREE } from "../../common/main";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
    // 简单的伪随机函数
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    // 星星函数，根据位置和时间生成星星
    float star(vec2 uv, float index) {
        // 为每个星星生成一个随机位置
        float randomX = random(vec2(index, 0.5));
        float randomY = random(vec2(index, 0.8));
        // 添加基于时间的移动
        float timeOffset = 0.1 * index;
        float movementX = sin(timeOffset + randomX * 10.0);
        float movementY = sin(timeOffset + randomY * 10.0);
        // 计算星星的位置
        vec2 starPos = vec2(randomX, randomY) + vec2(movementX, movementY) * 0.01;
        // 计算星星的大小和亮度
        float size = 0.005 + 0.005 * random(vec2(index, 0.3));
        float brightness = 0.8 + 0.2 * random(vec2(index, 0.7));
        // 计算星星的形状
        float dist = length(uv - starPos);
        float shape = smoothstep(size, size * 0.9, dist);
        // 返回星星的亮度
        return shape * brightness;
    }
    varying vec2 vUv;
    uniform float time;
    void main() {
        vec2 uv = vUv;
        // 生成多个星星
        float stars = 0.0;
        for (float i = 0.0; i < 100.0; i++) {
            stars += star(uv, i);
        }
        // 输出最终颜色
        gl_FragColor = vec4(vec3(stars), 1.0);
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