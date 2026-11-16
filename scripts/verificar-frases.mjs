// Comprueba que cada frase candidata aparece literalmente en el programa de su
// partido y en la página indicada. Uso:
//   node scripts/verificar-frases.mjs data/candidatas/pp.json [...]
// Requiere los textos extraídos en data/texto/<partido>.paginas.txt
// (pdftotext -layout + marcas «=== PÁGINA PDF N ===»).
import { readFileSync } from 'node:fs';

const ARCHIVO_TEXTO = {
  PSOE: 'psoe',
  PP: 'pp',
  Vox: 'vox',
  'Frente Amplio': 'frente-amplio',
};

// Normaliza para comparar sin depender de la maquetación del PDF: une palabras
// partidas con guion a final de línea, quita viñetas y unifica comillas,
// guiones y espacios.
function normalizar(texto) {
  return texto
    .replace(/(\p{L})-\s*\n\s*(\p{L})/gu, '$1$2')
    .replace(/[•▪●■◦]/g, ' ')
    .replace(/[«»“”"]/g, '"')
    .replace(/[‘’']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function cargarPaginas(slug) {
  const bruto = readFileSync(`data/texto/${slug}.paginas.txt`, 'utf8');
  const paginas = new Map();
  for (const trozo of bruto.split(/\n=== PÁGINA PDF (\d+) ===\n/).slice(1).reduce((acc, v, i, arr) => {
    if (i % 2 === 0) acc.push([Number(v), arr[i + 1] ?? '']);
    return acc;
  }, [])) {
    paginas.set(trozo[0], normalizar(trozo[1]));
  }
  return paginas;
}

const cache = new Map();
let fallos = 0;
let total = 0;

for (const ruta of process.argv.slice(2)) {
  const frases = JSON.parse(readFileSync(ruta, 'utf8'));
  for (const f of frases) {
    total++;
    const slug = ARCHIVO_TEXTO[f.partido];
    if (!slug) {
      console.log(`✗ ${f.id}: partido desconocido «${f.partido}»`);
      fallos++;
      continue;
    }
    if (!cache.has(slug)) cache.set(slug, cargarPaginas(slug));
    const paginas = cache.get(slug);
    // Los recortes se marcan con «[…]»: cada fragmento debe existir por separado.
    const fragmentos = normalizar(f.texto).split('[…]').map((s) => s.trim()).filter(Boolean);
    // Una frase puede cruzar el salto de página: se busca en su página y la siguiente juntas.
    const contexto = `${paginas.get(f.paginaPdf) ?? ''} ${paginas.get(f.paginaPdf + 1) ?? ''}`;
    const faltan = fragmentos.filter((frag) => !contexto.includes(frag));
    if (faltan.length) {
      fallos++;
      const enOtra = [...paginas].find(([, t]) => faltan.every((frag) => t.includes(frag)));
      const pista = enOtra ? ` (aparece en la página ${enOtra[0]})` : ' (no aparece literal)';
      console.log(`✗ ${f.id} p.${f.paginaPdf}${pista}: «${faltan[0].slice(0, 80)}…»`);
    }
  }
}

console.log(`\n${total - fallos}/${total} frases verificadas.`);
process.exit(fallos ? 1 : 0);
