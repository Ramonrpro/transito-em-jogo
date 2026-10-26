import fs from 'node:fs';
import path from 'node:path';
import { lerTabelaPlacas } from '../src/conteudo/placasParser.ts';
import type { Credito } from '../src/conteudo/tipos.ts';

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'transito-em-jogo/1.0 (https://github.com/Ramonrpro/transito-em-jogo)';
const PASTA_SVG = 'public/placas';

/** Correções achadas na conferência visual: código -> outro arquivo da mesma linha de 02-sinalizacao.md. */
const ARQUIVO_FORCADO: Record<string, string> = {};

interface InfoArquivo {
  url: string;
  autor: string;
  licenca: string;
  urlLicenca: string | null;
  urlPagina: string;
}

const semHtml = (s: string) =>
  s.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();

async function pegar(url: string): Promise<Response> {
  for (let tentativa = 1; ; tentativa++) {
    const r = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (r.ok) return r;
    if (tentativa >= 5 || (r.status !== 429 && r.status < 500)) {
      throw new Error(`${r.status} ${r.statusText} em ${url}`);
    }
    await new Promise((ok) => setTimeout(ok, 2000 * tentativa));
  }
}

async function consultar(titulos: string[]): Promise<Map<string, InfoArquivo>> {
  const mapa = new Map<string, InfoArquivo>();
  for (let i = 0; i < titulos.length; i += 50) {
    const lote = titulos.slice(i, i + 50);
    const url =
      `${API}?action=query&prop=imageinfo&iiprop=url|extmetadata&format=json&redirects=1` +
      `&titles=${encodeURIComponent(lote.join('|'))}`;
    const json = (await (await pegar(url)).json()) as any;
    const normal = new Map<string, string>();
    for (const n of [...(json.query.normalized ?? []), ...(json.query.redirects ?? [])]) {
      normal.set(n.from, n.to);
    }
    const paginas = Object.values(json.query.pages) as any[];
    const porTitulo = new Map(paginas.map((p) => [p.title as string, p]));
    for (const t of lote) {
      let alvo = t;
      for (let k = 0; k < 3 && normal.has(alvo); k++) alvo = normal.get(alvo)!;
      const info = porTitulo.get(alvo)?.imageinfo?.[0];
      if (!info) throw new Error(`Arquivo não encontrado no Commons: ${t}`);
      const m = info.extmetadata ?? {};
      mapa.set(t, {
        url: info.url,
        autor: semHtml(m.Artist?.value ?? ''),
        licenca: semHtml(m.LicenseShortName?.value ?? ''),
        urlLicenca: m.LicenseUrl?.value || null,
        urlPagina: info.descriptionurl,
      });
    }
  }
  return mapa;
}

async function main() {
  const forcar = process.argv.includes('--forcar');
  const placas = lerTabelaPlacas(fs.readFileSync('pesquisa/02-sinalizacao.md', 'utf8')).map((p) => ({
    ...p,
    arquivoCommons: ARQUIVO_FORCADO[p.codigo] ?? p.arquivoCommons,
  }));
  const info = await consultar([...new Set(placas.map((p) => p.arquivoCommons))]);

  fs.mkdirSync(PASTA_SVG, { recursive: true });
  const creditos: Credito[] = [];
  let baixados = 0;
  for (const p of placas) {
    const i = info.get(p.arquivoCommons)!;
    const destino = path.join(PASTA_SVG, `${p.codigo}.svg`);
    if (forcar || !fs.existsSync(destino)) {
      fs.writeFileSync(destino, Buffer.from(await (await pegar(i.url)).arrayBuffer()));
      baixados++;
    }
    creditos.push({
      codigo: p.codigo,
      arquivoCommons: p.arquivoCommons,
      autor: i.autor,
      licenca: i.licenca,
      urlLicenca: i.urlLicenca,
      urlPagina: i.urlPagina,
    });
  }
  const json = (x: unknown) => JSON.stringify(x, null, 2) + '\n';
  fs.writeFileSync('src/conteudo/placas.json', json(placas));
  fs.writeFileSync('src/conteudo/creditos.json', json(creditos));
  console.log(`${placas.length} placas, ${baixados} SVGs baixados, ${creditos.length} créditos`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
