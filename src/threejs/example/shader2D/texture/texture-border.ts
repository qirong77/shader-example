import { scene, THREE } from "../../../common/main";
import texturePath from "../../../../../public/assets/texture.png";
import { gui } from "../../../common/gui";
const plane = new THREE.PlaneGeometry(1, 1);
const texture = new THREE.TextureLoader().load(texturePath);
const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
        u_time: { value: 0 },
        u_borderWidth: { value: 0.01 },
        u_borderColor: { value: new THREE.Color(0xffffff) },
        u_borderSmoothness: { value: 0.01 },
        u_borderRadius: { value: 0.1 },
        u_texture: { value: texture },
        u_rhombusSize: { value: 0.1 },
        u_rhombusOffset: { value: 0.2 },
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
    uniform float u_borderWidth;
    uniform float u_borderColor;
    uniform float u_borderSmoothness;
    uniform float u_borderRadius;
    uniform float u_rhombusSize;
    uniform float u_rhombusOffset;

    float rhombusSDF(vec2 st) {
        float x = abs(st.x);
        float y = abs(st.y);
        bool isInside = y < (-1. * x + u_rhombusSize);
        return isInside ? 0.0 : 1.0;
    }

    void main(){
        vec2 st = v_uv;
        st = st * 2.0 - 1.0;  // 将坐标范围调整为[-1,1]
        
        // 计算距离中心点的距离
        float distance = length(st);
        // 判断是否在边框内
        float radius = 1.0 - u_borderRadius;
        float borderStart = radius - u_borderWidth;
        float alpha = smoothstep(radius + u_borderSmoothness, radius, distance) * 
                     smoothstep(borderStart - u_borderSmoothness, borderStart, distance);
        
        // 在四个方向添加菱形
        vec2 rhombusTop = vec2(st.x, st.y - u_rhombusOffset);
        vec2 rhombusBottom = vec2(st.x, st.y + u_rhombusOffset);
        vec2 rhombusLeft = vec2(st.x + u_rhombusOffset, st.y);
        vec2 rhombusRight = vec2(st.x - u_rhombusOffset, st.y);
        
        float rhombusAlpha = min(
            min(rhombusSDF(rhombusTop), rhombusSDF(rhombusBottom)),
            min(rhombusSDF(rhombusLeft), rhombusSDF(rhombusRight))
        );
        
        vec4 text_color = texture2D(u_texture, v_uv);
        vec4 finalColor = mix(text_color, vec4(1.0), alpha);
        finalColor = mix(finalColor, vec4(1.0), (1.0 - rhombusAlpha) * 0.8);
        gl_FragColor = finalColor;
    }
    `,

    blending: THREE.AdditiveBlending,
});
const mesh = new THREE.Mesh(plane, material);
scene.add(mesh);
const folder = gui.addFolder("texture-border");
folder.add(material.uniforms.u_borderWidth, "value", 0.01, 0.1, 0.01).name("边框宽度");
folder.add(material.uniforms.u_borderSmoothness, "value", 0.001, 0.05, 0.001).name("边框平滑度");
folder.add(material.uniforms.u_borderRadius, "value", 0, 0.5, 0.01).name("圆角半径");
folder.add(material.uniforms.u_rhombusSize, "value", 0.05, 0.2, 0.01).name("菱形大小");
folder.add(material.uniforms.u_rhombusOffset, "value", 0.1, 2.5, 0.01).name("菱形位置");
const borderColorController = folder.addColor({
    color: '#ffffff'
}, 'color').name("边框颜色");
borderColorController.onChange((value) => {
    material.uniforms.u_borderColor.value = new THREE.Color(value);
});

// 更新动画
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.u_time.value += 0.01;
}
animate();
