/**
 * @file QuickStart.ts
 * @description 着色器基础示例，展示了顶点着色器和片元着色器的基本用法
 */

import { scene, THREE } from "../common/main";

/**
 * @description 顶点着色器代码
 * @type {string}
 * 
 * @description 顶点着色器中可用的内置变量说明
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
 * 
 * @description 片元着色器中可用的内置变量说明
 * @property {vec2} gl_PointCoord - 点精灵内部的坐标，范围在[0,1]之间
 * @property {vec4} gl_FragCoord - 片元在窗口坐标系中的位置，包含深度值
 * @property {float} gl_FragDepth - 片元的深度值，可读写
 * @property {vec4} gl_FragColor - 片元着色器输出的颜色值，包含RGBA四个分量
 * @property {vec4} gl_FrontFacing - 布尔值，表示当前片元是否属于正面
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



const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,  // 双面渲染
    transparent: true,       // 启用透明
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
