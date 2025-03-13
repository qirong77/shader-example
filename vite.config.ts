// vite.config.js
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [
    glsl() // 添加这行配置以启用 GLSL 文件加载
  ],
  resolve:{
    alias:{
      '@public':'./public'
    }
  }
});
