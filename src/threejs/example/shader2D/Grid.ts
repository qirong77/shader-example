import { gui } from "../../common/gui";
import { scene, THREE } from "../../common/main";

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
 */
uniform float uGridCount;
varying vec2 textureCoord;

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
uniform float uGridCount;
varying vec2 textureCoord;

// 随机数生成函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    /* 计算当前的坐标是第几个格子
    如果当前x的坐标是0.11,有 10个格子。那么应该是第 2 个格子
    0.11 * 10 = 1.1
    floor(1.1) = 1
    所以当前的坐标是第 1 个格子
    */
    float row = floor(textureCoord.x * uGridCount);
    float col = floor(textureCoord.y * uGridCount);
    // gl_FragColor = vec4(vec3(random(vec2(row,col))),1.0);
    /* 计算归一化的坐标，范围在 [-1,1] 之间
    例如当前的坐标是[1.5,1.5]，那么归一化的坐标是[0,0]
    例如当前的坐标是[1.1,1.1]，那么归一化的坐标是[-0.4,0.4]

     */
    vec2 st = fract(textureCoord * uGridCount);  // 获取格子内的相对位置（0-1范围）
    st = st * 2.0 - 1.0;  // 将相对位置映射到[-1,1]范围
    float radius = 0.9; // 圆的半径
    float circle = 1.0 - step(radius, length(st)); // 如果距离大于半径，返回0（黑色），否则返回1（白色）
    gl_FragColor = vec4(vec3(0.0, 0.0, 0.0), circle); // 使用红色绘制圆形
}
`;

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide, // 双面渲染
    uniforms: {
        uGridCount: { value: 10.0 },
    },
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 添加GUI控制
const folder = gui.addFolder("uGridCount");
folder.add(material.uniforms.uGridCount, "value", 1, 50, 1).name("格子数量");