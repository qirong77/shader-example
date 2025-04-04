import { scene, THREE } from "../../common/main";
import texturePath from "../../../../public/assets/texture.png";
import { gui } from "../../common/gui";
const plane = new THREE.PlaneGeometry(1, 1);
const texture = new THREE.TextureLoader().load(texturePath);
const folder = gui.addFolder("texture");
const material = new THREE.ShaderMaterial({
    uniforms: {
        u_time: { value: 0 },
        u_texture: { value: texture },
        u_scanWidth: { value: 0.1 },
        u_scanSpeed: { value: 1.0 },
        u_scanIntensity: { value: 2.0 }
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
    uniform float u_scanWidth;
    uniform float u_scanSpeed;
    uniform float u_scanIntensity;

    void main(){
        vec4 text_color = texture2D(u_texture, v_uv);
        
        // 创建扫描线效果
        float scanLine = step(v_uv.x, mod(u_time * u_scanSpeed, 1.0) + u_scanWidth) - 
                        step(v_uv.x, mod(u_time * u_scanSpeed, 1.0));
        
        // 混合原始纹理和扫描线
        vec3 finalColor = text_color.rgb + vec3(scanLine * u_scanIntensity);
        gl_FragColor = vec4(finalColor, text_color.a);
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
