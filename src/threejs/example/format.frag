uniform float u_shape; // 控制显示的形状：0-圆形, 1-五角星, 2-月亮

varying vec2 textureCoord;

// 辅助函数：平滑过渡
float smootherstep(float edge0, float edge1, float x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

// 五角星SDF
float starSDF(vec2 st, float size) {
    st = st * 2.0 - 1.0;
    float angle = atan(st.y, st.x);
    float radius = length(st);

    float ma = mod(angle + 3.14159 / 2.0, 2.0 * 3.14159 / 5.0) - 3.14159 / 5.0;
    float r = size * cos(ma) / cos(2.0 * 3.14159 / 5.0 - ma);

    return 1.0 - smoothstep(0.0, 0.1, abs(radius - r));
}

// 月亮SDF
float moonSDF(vec2 st) {
    st = st * 2.0 - 1.0;
    float d1 = length(st);
    float d2 = length(st - vec2(0.2, 0.0));
    float moon = smoothstep(0.0, 0.1, d1 - 0.3) - smoothstep(0.0, 0.1, d2 - 0.4);
    return 1.0 - moon;
}

void main() {
    vec2 st = textureCoord;
    float d;
    // 圆形
    // vec2 coordinateUv = st * 2.0 - vec2(1.0, 1.0);
    // d = length(coordinateUv);
    // d = smoothstep(0.0, 1.0, d);
    // 五角星
    // d = starSDF(st, 0.5);
    // 月亮
    d = moonSDF(st);
    gl_FragColor = vec4(d, d, d, 1.0);
}