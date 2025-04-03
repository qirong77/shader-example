import { gui } from "../../common/gui";
import { scene, THREE } from "../../common/main";
/** 
 * @file starBox.ts
 * @description 3D星星盒子
*/

// 创建 GUI 文件夹
const folder = gui.addFolder("3D星星盒子");

// 定义盒子尺寸和星星数量
const boxSize = 10;
const starCount = 1000;

// 创建 BufferGeometry 并随机分布星星
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * boxSize; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * boxSize; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * boxSize; // z
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// 定义 ShaderMaterial
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uStarSize: { value: 8.0 },
        uTwinkleSpeed: { value: 1.0 }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uStarSize;
        varying float vTwinkle;
        void main() {
            vTwinkle = 1.0;
            gl_PointSize = uStarSize;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying float vTwinkle;
        void main() {
            float alpha = vTwinkle;
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
    `,
    transparent: true
});

// 创建 Mesh 并添加到场景
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

// 添加 GUI 控制
folder.add(material.uniforms.uStarSize, "value", 0.1, 10.0).name("星星大小");
folder.add(material.uniforms.uTwinkleSpeed, "value", 0.1, 5.0).name("闪烁速度");

// 让盒子绕 x 轴旋转
function animate() {
    material.uniforms.uTime.value += 0.01 * material.uniforms.uTwinkleSpeed.value;
    mesh.rotation.x += 0.0001;
    requestAnimationFrame(animate);
}
animate();