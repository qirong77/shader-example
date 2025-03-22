/**
 * @file ShapeRhombus.ts
 * @description 使用着色器实现菱形图案的绘制
 */
import { scene, THREE } from "../common/main";

/**
 * @description 顶点着色器代码
 * @type {string}
 */
const vertexShader = /* glsl */ `
/**
 * @varying {vec2} textureCoord - 传递给片元着色器的纹理坐标
 */
varying vec2 textureCoord;

void main() {
    textureCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * @description 片元着色器代码
 * @type {string}
 */
const fragmentShader = /* glsl */ `
/**
 * @uniform {float} u_time - 动画时间参数
 * @varying {vec2} textureCoord - 从顶点着色器接收的纹理坐标
 */
uniform float u_time;
varying vec2 textureCoord;

/**
 * @description 计算菱形的有向距离场（SDF）
 * @param {vec2} st - 标准化的纹理坐标，范围在 [-1,1] 之间
 * @return {float} 返回 0.0 表示在菱形内部，1.0 表示在外部
 */
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

/**
 * @description 创建一个平面几何体
 * @type {THREE.PlaneGeometry}
 */
const geometry = new THREE.PlaneGeometry(1, 1);

/**
 * @description 创建着色器材质
 * @type {THREE.ShaderMaterial}
 */
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
});

/**
 * @description 创建网格对象并添加到场景中
 * @type {THREE.Mesh}
 */
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
