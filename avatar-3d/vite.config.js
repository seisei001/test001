import { defineConfig } from 'vite';

// GitHub Pagesでサブフォルダ(例: /test001/avatar-3d/)配下に置いても
// 相対パスでアセットを解決できるようにする
export default defineConfig({
  base: './',
  build: {
    outDir: '../docs/avatar-3d',
    emptyOutDir: true,
  },
});
