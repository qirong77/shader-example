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
        u_scanIntensity: { value: 2.0 },
        u_scanSmoothness: { value: 0.05 }
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
    uniform float u_scanSmoothness;

    void main(){
        vec4 text_color = texture2D(u_texture, v_uv);
        
        // 获取当前扫描位置
        float scanPos = mod(u_time * u_scanSpeed, 1.0);
        
        // 创建柔和的扫描线效果
        float scanStart = scanPos;
        float scanEnd = scanPos + u_scanWidth;
        
        // 使用smoothstep创建平滑过渡的扫描线
        float scanLine = smoothstep(scanStart - u_scanSmoothness, scanStart + u_scanSmoothness, v_uv.x) - 
                         smoothstep(scanEnd - u_scanSmoothness, scanEnd + u_scanSmoothness, v_uv.x);
        
        // 混合原始纹理和扫描线
        vec3 finalColor = text_color.rgb + vec3(scanLine * u_scanIntensity);
        gl_FragColor = vec4(finalColor, text_color.a);
    }
    `,

    blending: THREE.AdditiveBlending,
});
const mesh = new THREE.Mesh(plane, material);
scene.add(mesh);

// 添加GUI控制
folder.add(material.uniforms.u_scanWidth, "value", 0.01, 0.5).name("扫描宽度");
folder.add(material.uniforms.u_scanSpeed, "value", 0.1, 3.0).name("扫描速度");
folder.add(material.uniforms.u_scanIntensity, "value", 0.1, 5.0).name("扫描强度");
folder.add(material.uniforms.u_scanSmoothness, "value", 0.001, 0.2).name("扫描柔和度");

// 更新动画
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.u_time.value += 0.01;
}
animate();
