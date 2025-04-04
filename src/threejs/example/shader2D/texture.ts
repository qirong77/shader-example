import { scene, THREE } from "../../common/main";
import texturePath from "../../../../public/assets/texture.png";
const plane = new THREE.PlaneGeometry(1, 1);
const texture = new THREE.TextureLoader().load(texturePath);

const material = new THREE.ShaderMaterial({
    uniforms: {
        u_time: { value: 0 },
        u_texture: { value: texture },
    },
    vertexShader: /* glsl */ `
    varying vec2 v_uv;
    uniform float u_time;
    void main(){
        v_uv = uv;
        vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
    `,
    fragmentShader: /* glsl */ `
    precision lowp float;
    varying vec2 v_uv;
    uniform sampler2D u_texture;
    void main(){
        vec4 text_color = texture2D(u_texture, v_uv);
        gl_FragColor = text_color;
    }
    `,

    blending: THREE.AdditiveBlending,
});
const mesh = new THREE.Mesh(plane, material);
scene.add(mesh);
