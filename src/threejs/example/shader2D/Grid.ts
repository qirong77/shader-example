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
 * @varying {vec2} st - 传递给片元着色器的标准化坐标
 * @uniform {float} uPointSize - 点的大小
 */
uniform float uPointSize;
varying vec2 textureCoord;
varying vec2 st;

void main() {
    // uv 坐标的取值范围在 [0,1] 之间
    textureCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uPointSize;
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
    // 使用纹理坐标生成随机的RGB颜色
    gl_FragColor = vec4(vec3(textureCoord.x), 1.0);
}
`;

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide, // 双面渲染
    transparent: true, // 启用透明
    uniforms: {
        uPointSize: { value: 10.0 },
    },
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 添加GUI控制
const folder = gui.addFolder("grid");
folder.add(material.uniforms.uPointSize, "value", 1, 50, 1).name("点大小");
