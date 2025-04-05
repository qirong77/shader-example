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
        u_scanSmoothness: { value: 0.05 },
        u_starCount: { value: 100 },
        u_starSize: { value: 0.005 },
        u_starBrightness: { value: 0.8 },
        u_twinkleSpeed: { value: 2.0 },
        u_starMovementSpeed: { value: 0.2 }
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
    uniform float u_starCount;
    uniform float u_starSize;
    uniform float u_starBrightness;
    uniform float u_twinkleSpeed;
    uniform float u_starMovementSpeed;
    
    // 简单的伪随机函数
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // 星星函数，根据位置和时间生成星星
    float star(vec2 uv, float index) {
        // 为每个星星生成一个随机位置
        float randomX = random(vec2(index, 0.5));
        float randomY = random(vec2(index, 0.8));
        
        // 添加基于时间的移动
        float moveX = sin(u_time * 0.1 * random(vec2(index, 0.3))) * u_starMovementSpeed;
        float moveY = cos(u_time * 0.1 * random(vec2(index, 0.7))) * u_starMovementSpeed;
        
        // 星星位置
        vec2 starPos = vec2(randomX + moveX, randomY + moveY);
        
        // 计算当前像素到星星中心的距离
        float dist = distance(uv, starPos);
        
        // 星星闪烁效果
        float twinkle = sin(u_time * u_twinkleSpeed * random(vec2(index, 0.9))) * 0.5 + 0.5;
        
        // 如果距离小于星星大小，则显示星星
        return smoothstep(u_starSize, 0.0, dist) * u_starBrightness * twinkle;
    }
    
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
        
        // 添加星星
        float starLight = 0.0;
        for(float i = 0.0; i < 1000.0; i++) {
            if(i >= u_starCount) break; // 限制星星数量
            starLight += star(v_uv, i);
        }
        
        // 混合原始纹理、扫描线和星星
        vec3 finalColor = text_color.rgb + vec3(scanLine * u_scanIntensity) + vec3(starLight);
        gl_FragColor = vec4(finalColor, text_color.a);
    }
    `,

    blending: THREE.AdditiveBlending,
});
const mesh = new THREE.Mesh(plane, material);
scene.add(mesh);

// 添加GUI控制
// 扫描线控制
folder.add(material.uniforms.u_scanWidth, "value", 0.01, 0.5).name("扫描宽度");
folder.add(material.uniforms.u_scanSpeed, "value", 0.1, 3.0).name("扫描速度");
folder.add(material.uniforms.u_scanIntensity, "value", 0.1, 5.0).name("扫描强度");
folder.add(material.uniforms.u_scanSmoothness, "value", 0., 0.5).name("扫描柔和度");

// 星星控制
folder.add(material.uniforms.u_starCount, "value", 0, 500).name("星星数量");
folder.add(material.uniforms.u_starSize, "value", 0.001, 0.01).name("星星大小");
folder.add(material.uniforms.u_starBrightness, "value", 0.1, 2.0).name("星星亮度");
folder.add(material.uniforms.u_twinkleSpeed, "value", 0.5, 5.0).name("闪烁速度");
folder.add(material.uniforms.u_starMovementSpeed, "value", 0.0, 0.5).name("移动速度");

// 更新动画
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.u_time.value += 0.01;
}
animate();
