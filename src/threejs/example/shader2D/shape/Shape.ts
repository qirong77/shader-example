/**
 * @file Shape.ts
 * @description 使用着色器实现基础图形的绘制，包括圆形、五角星和月亮等形状。
 * 通过 SDF（有符号距离场）技术来实现图形的渲染。
 */

import { scene, THREE } from "../../../common/main";


/* 
 * 距离场（Distance Field, DF）技术是一种用于表示空间中点到最近物体表面距离的数学方法。
 * 它在图像处理、计算机图形学、物理学等领域有广泛应用。距离场的值通常为非负数，表示点到最近表面的距离。
 * 
 * 而有符号距离场（Signed Distance Field, SDF）是距离场的一种变体，它在距离值的基础上添加了符号信息：
 * 正值表示点在物体外部，负值表示点在物体内部，零值表示点在物体表面上。
 */

/**
 * @description 顶点着色器代码
 * @type {string}
 */
const vertexShader = /* glsl */ `
/**
 * @varying {vec2} textureCoord - 传递给片元着色器的纹理坐标
 */
varying vec2 textureCoord;
varying vec2 st;

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
 * @varying {vec2} textureCoord - 从顶点着色器接收的纹理坐标
 */
varying vec2 textureCoord;

/**
 * @description 辅助函数：实现平滑过渡效果
 * @param {float} edge0 - 过渡起始边界值
 * @param {float} edge1 - 过渡结束边界值
 * @param {float} x - 输入值
 * @return {float} 返回平滑插值后的结果
 */
float smootherstep(float edge0, float edge1, float x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

/**
 * @description 计算月亮形状的有向距离场（SDF）
 * @param {vec2} st - 标准化的纹理坐标，范围在 [0,1] 之间
 * @return {float} 返回 1.0 表示在月亮形状内部，0.0 表示在外部
 */
float moonSDF(vec2 st) {
    st = st * 2.0 - 1.0;  // 将坐标范围调整为[-1,1]
    float d1 = length(st);  // 第一个圆的距离
    float d2 = length(st - vec2(0.2, 0.0));  // 第二个圆的距离
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

/**
 * @description 创建一个平面几何体用于渲染图形
 * @type {THREE.PlaneGeometry}
 */
const geometry = new THREE.PlaneGeometry(1, 1);

/**
 * @description 创建着色器材质，包含了顶点着色器和片元着色器的代码
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
