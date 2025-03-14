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
/* 四角星的✦实现思路
1. 输入任何一个点，都使用绝对值规划到第一象限
2. 定义两个线性函数y1 = Ax + B; y2 = Cx + D，他们两个相交的点作为一个控制点(pointX, pointY)。
3. 判断当前的点是否在函数 y1、y2、X 轴、Y 轴组成的封闭图形里面，如果是，则为黑色，否则为白色
*/
float A = -3.0;
float B = 1.0;
float C = -0.5;
float D = 0.5;
float starSDF(vec2 st) {
    float x = abs(st.x);
    float y = abs(st.y);
    /* 因为 st 在 0-1 的范围，所以只要判断当前点的 y 值都小于两个函数，说明在内侧 */
    bool isInside = (y <= (A * x + B)) && (y <= (C * y + D));
    if (isInside) {
        return 0.0;
    } else {
        return 1.0;
    }
}

void main() {
    vec2 st = textureCoord;
    st -= 0.5;
    // 计算四角星的 SDF
    float d = starSDF(st);
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