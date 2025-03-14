import { scene, THREE } from "../common/main";

/*
==================================================================================================
================================================================================================== 
==================================================================================================
==================================================================================================
==================================================================================================
Shader 内置的变量
gl_Position;
gl_PointSize;
THREEJS  Vextex Shader 内置的变量 https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram
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
varying vec2 textureCoord;
varying vec2 st;
void main() {
    textureCoord = uv/* 取值范围通常在[0,1] */;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
/* ================================================================================================== */
const fragmentShader = /* glsl */ `
varying vec2 textureCoord;
void main() {
    /* 下面这三行代码表示 uv 的取值范围在 0-1 之间 */
    gl_FragColor = vec4(textureCoord.x,textureCoord.x,textureCoord.x, 1.0);
    // gl_FragColor = vec4(fract(textureCoord.x),fract(textureCoord.x),fract(textureCoord.x), 1.0);
    // gl_FragColor = vec4(floor(textureCoord.x),floor(textureCoord.x),floor(textureCoord.x), 1.0);
}
`;
/*
==================================================================================================
================================================================================================== 
==================================================================================================
==================================================================================================
==================================================================================================
*/

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
