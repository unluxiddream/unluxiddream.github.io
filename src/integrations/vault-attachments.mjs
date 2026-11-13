/**
 * Obsidian 볼트의 첨부 이미지 폴더를 사이트의 /images/ 경로로 제공하는 Astro 통합.
 *  - 개발 서버(npm run dev): /images/파일명 요청을 볼트 폴더에서 찾아 응답
 *  - 빌드(npm run build): 볼트 폴더의 이미지를 dist/images/ 로 복사
 * 하위 폴더가 있어도 되며, Obsidian 위키링크처럼 「파일명」으로만 찾습니다.
 * 같은 파일명이 public/images/ 에도 있으면 public 쪽이 우선합니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml',
};

/** 폴더를 재귀적으로 훑어 { 파일명: 절대경로 } 를 만듭니다. (. 으로 시작하는 폴더/파일은 무시) */
function indexDir(dir, logger) {
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue;
      const abs = path.join(d, ent.name);
      if (ent.isDirectory()) walk(abs);
      else if (MIME[path.extname(ent.name).toLowerCase()]) {
        const key = ent.name.normalize('NFC');
        if (map.has(key)) logger?.warn(`같은 이름의 이미지가 여러 개 있습니다: ${key} (첫 번째 파일만 사용)`);
        else map.set(key, abs);
      }
    }
  };
  walk(dir);
  return map;
}

export default function vaultAttachments({ dir }) {
  let attachDir;
  let publicImages;
  let base = '/';

  return {
    name: 'vault-attachments',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        const root = fileURLToPath(config.root);
        attachDir = path.resolve(root, dir);
        publicImages = path.join(fileURLToPath(config.publicDir), 'images');
        base = config.base.endsWith('/') ? config.base : `${config.base}/`;
        const prefix = `${base}images/`;

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vault-attachments-dev',
                configureServer(server) {
                  server.watcher.add(attachDir);
                  server.middlewares.use((req, res, next) => {
                    const url = (req.url || '').split('?')[0];
                    if (!url.startsWith(prefix)) return next();
                    let name;
                    try { name = decodeURIComponent(url.slice(prefix.length)).normalize('NFC'); } catch { return next(); }
                    if (fs.existsSync(path.join(publicImages, name))) return next(); // public 우선
                    const file = indexDir(attachDir).get(path.basename(name));
                    if (!file) return next();
                    res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()]);
                    res.setHeader('Cache-Control', 'no-cache');
                    fs.createReadStream(file).pipe(res);
                  });
                },
              },
            ],
          },
        });
      },

      'astro:build:done': ({ dir: outDir, logger }) => {
        const out = path.join(fileURLToPath(outDir), 'images');
        fs.mkdirSync(out, { recursive: true });
        let copied = 0;
        for (const [name, abs] of indexDir(attachDir, logger)) {
          const target = path.join(out, name);
          if (fs.existsSync(target)) continue; // public/images 쪽이 이미 복사됨
          fs.copyFileSync(abs, target);
          copied++;
        }
        logger.info(`볼트 첨부 이미지 ${copied}개를 images/ 로 복사했습니다.`);
      },
    },
  };
}
