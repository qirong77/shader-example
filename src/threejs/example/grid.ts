import { scene, THREE } from "../common/main";

/* 

vertex shader 内置变量 
float gl_PointSize
vec4 gl_Position;

THREEJS内置变量 
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
*/
const vertexShader = /* glsl */ `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 10.0;
}
`;

/* 
THREEJS内置变量 
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

const fragmentShader = /* glsl */ `
void main() {
    gl_FragColor = vec4(1.0, .8, 0.0, 1.0);
}
`;
const geomertry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geomertry, material);
scene.add(mesh);
