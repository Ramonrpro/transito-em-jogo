import fs from 'node:fs';
import { PLACAS } from '../src/conteudo/index.ts';

/** Gera tmp/folha-placas-N.html com páginas de 30 placas (imagem, código e nome oficial) para conferência visual. */
const POR_PAGINA = 30;
fs.mkdirSync('tmp', { recursive: true });
for (let n = 0; n * POR_PAGINA < PLACAS.length; n++) {
  const itens = PLACAS.slice(n * POR_PAGINA, (n + 1) * POR_PAGINA)
    .map(
      (p) =>
        `<figure><img src="../public/placas/${p.codigo}.svg" alt=""><figcaption><b>${p.codigo}</b><br>${p.nome}</figcaption></figure>`,
    )
    .join('');
  fs.writeFileSync(
    `tmp/folha-placas-${n + 1}.html`,
    `<!doctype html><meta charset="utf-8"><style>
body{font:16px sans-serif;margin:12px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
figure{margin:0;text-align:center;border:1px solid #ccc;padding:8px}
img{width:180px;height:180px;object-fit:contain}</style>${itens}`,
  );
}
console.log('folhas geradas em tmp/');
