import { scene, THREE } from "../../../common/main";
import texturePath from "../../../../../public/assets/texture.png";
import { gui } from "../../../common/gui";
const plane = new THREE.PlaneGeometry(1, 1);
const texture = new THREE.TextureLoader().load(texturePath);
const folder = gui.addFolder("texture-border");
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
    uniform float u_time;
    void main(){
        vec4 text_color = texture2D(u_texture, v_uv);
        gl_FragColor = vec4(text_color.rgb, text_color.a);
    }
    `,

    blending: THREE.AdditiveBlending,
});
const mesh = new THREE.Mesh(plane, material);
scene.add(mesh);



// 更新动画
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.u_time.value += 0.01;
}
animate();
