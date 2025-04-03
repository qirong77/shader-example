/**
 * @file QuickStart.ts
 * @description 着色器基础示例，展示了顶点着色器和片元着色器的基本用法
 */

import { scene, THREE } from "../common/main";

/**
 * @description Three.js WebGL 程序中的内置变量说明
 * @see {@link https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram}
 * 
 * @typedef {Object} ShaderBuiltins
 * @property {vec4} gl_Position - 顶点着色器输出的裁剪空间坐标
 * @property {float} gl_PointSize - 点精灵大小
 * @property {mat4} modelMatrix - 模型矩阵
 * @property {mat4} modelViewMatrix - 模型视图矩阵
 * @property {mat4} projectionMatrix - 投影矩阵
 * @property {mat4} viewMatrix - 视图矩阵
 * @property {mat3} normalMatrix - 法线矩阵
 * @property {vec3} cameraPosition - 相机位置
 * @property {vec3} position - 顶点位置属性
 * @property {vec3} normal - 顶点法线属性
 * @property {vec2} uv - 顶点纹理坐标属性
 */

/**
 * @description 顶点着色器代码
 * @type {string}
 */
const vertexShader = /* glsl */ `
/**
 * @varying {vec2} textureCoord - 传递给片元着色器的纹理坐标
 * @varying {vec2} st - 传递给片元着色器的标准化坐标
 */
varying vec2 textureCoord;
varying vec2 st;

void main() {
    // uv 坐标的取值范围在 [0,1] 之间
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

void main() {
    // 使用纹理坐标的 x 分量作为灰度值，展示 uv 坐标在 [0,1] 范围内的变化
    gl_FragColor = vec4(textureCoord.x, textureCoord.x, textureCoord.x, 1.0);
    // 以下是其他可选的效果：
    // 使用 fract 函数获取小数部分
    // gl_FragColor = vec4(fract(textureCoord.x), fract(textureCoord.x), fract(textureCoord.x), 1.0);
    // 使用 floor 函数获取整数部分
    // gl_FragColor = vec4(floor(textureCoord.x), floor(textureCoord.x), floor(textureCoord.x), 1.0);
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
    side: THREE.DoubleSide,  // 双面渲染
    transparent: true,       // 启用透明
});

/**
 * @description 创建网格对象并添加到场景中
 * @type {THREE.Mesh}
 */
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
