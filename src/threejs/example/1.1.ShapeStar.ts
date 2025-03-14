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
    float pointX = abs(st.x);
    float pointY = abs(st.y);
    /* 因为 st 在 0-1 的范围，所以只要判断当前点的 y 值都小于两个函数，说明在内侧 */
    float y1X = -B / A;
    float y2X = -D / C;
    float y1Y = pointX * A  + B;
    float y2Y = pointX * C + D;
    bool isInsideY1 = pointX <= y1X && pointY <= y1Y; 
    bool isInsideY2 = pointX <= y2X && pointY <= y2Y;
    if (isInsideY1 || isInsideY2) {
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

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
