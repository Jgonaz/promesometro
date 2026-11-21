// Comprueba que cada frase aparece literalmente en el programa de su partido y
// en la página indicada, igual que cada cita de la comparativa, y que cada
// pregunta tiene la estructura que espera el juego. Uso:
//   node scripts/verificar-frases.mjs src/data/frases.json [...]
// Con --final, además, exige 30 preguntas por partido, 15 de cada tipo, y
// comprueba los asuntos de src/data/coincidencias.json.
// Requiere los textos extraídos en data/texto/<partido>.paginas.txt
// (pdftotext -layout + marcas «=== PÁGINA PDF N ===»).
import { readFileSync } from 'node:fs';

const ARCHIVO_TEXTO = {
  PSOE: 'psoe',
  PP: 'pp',
  Vox: 'vox',
  'Frente Amplio': 'frente-amplio',
};
const PARTIDOS = Object.keys(ARCHIVO_TEXTO);
const TIPOS = ['deducible', 'sorpresa'];
const POR_TIPO = 15;
// Valoración editorial interna (el juego no la usa): nota 1–3 y etiquetas.
const ETIQUETAS = ['ambigua', 'polemica', 'titular'];

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
  const partes = bruto.split(/\n=== PÁGINA PDF (\d+) ===\n/).slice(1);
  const paginas = new Map();
  for (let i = 0; i < partes.length; i += 2) paginas.set(Number(partes[i]), normalizar(partes[i + 1] ?? ''));
  return paginas;
}

const cache = new Map();
function paginasDe(partido) {
  const slug = ARCHIVO_TEXTO[partido];
  if (!cache.has(slug)) cache.set(slug, cargarPaginas(slug));
  return cache.get(slug);
}

// Devuelve null si la cita está en su página (o cruza a la siguiente), o un
// mensaje con pista si no.
function comprobarCita(partido, texto, pagina) {
  if (!ARCHIVO_TEXTO[partido]) return `partido desconocido «${partido}»`;
  if (typeof texto !== 'string' || !texto.trim()) return 'texto vacío';
  if (!Number.isInteger(pagina)) return 'paginaPdf no es un entero';
  const paginas = paginasDe(partido);
  // Los recortes se marcan con «[…]»: cada fragmento debe existir por separado.
  const fragmentos = normalizar(texto).split('[…]').map((s) => s.trim()).filter(Boolean);
  const contexto = `${paginas.get(pagina) ?? ''} ${paginas.get(pagina + 1) ?? ''}`;
  const faltan = fragmentos.filter((frag) => !contexto.includes(frag));
  if (!faltan.length) return null;
  const enOtra = [...paginas].find(([, t]) => faltan.every((frag) => t.includes(frag)));
  const pista = enOtra ? `aparece en la página ${enOtra[0]}` : 'no aparece literal';
  return `p.${pagina} (${pista}): «${faltan[0].slice(0, 80)}…»`;
}

const final = process.argv.includes('--final');
const rutas = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const errores = [];
const todas = [];

for (const ruta of rutas) {
  for (const f of JSON.parse(readFileSync(ruta, 'utf8'))) {
    todas.push(f);
    const mal = (msg) => errores.push(`✗ ${f.id ?? '(sin id)'}: ${msg}`);

    const fallo = comprobarCita(f.partido, f.texto, f.paginaPdf);
    if (fallo) mal(fallo);
    if (!f.tema) mal('falta tema');
    if (!TIPOS.includes(f.tipo)) mal(`tipo debe ser ${TIPOS.join(' o ')}`);
    if (typeof f.enOtrasPalabras !== 'string' || f.enOtrasPalabras.length < 20) mal('falta enOtrasPalabras');
    if (![1, 2, 3].includes(f.calidad)) mal('calidad debe ser 1, 2 o 3');
    const etiquetas = Array.isArray(f.etiquetas) ? f.etiquetas : null;
    if (!etiquetas) mal('etiquetas debe ser una lista (puede estar vacía)');
    else {
      const raras = etiquetas.filter((e) => !ETIQUETAS.includes(e));
      if (raras.length) mal(`etiquetas desconocidas: ${raras.join(', ')} (válidas: ${ETIQUETAS.join(', ')})`);
      if (new Set(etiquetas).size !== etiquetas.length) mal('etiquetas repetidas');
    }

    // La comparativa recoge a los otros tres partidos, una vez cada uno.
    const esperados = PARTIDOS.filter((p) => p !== f.partido).sort();
    const comparativa = Array.isArray(f.comparativa) ? f.comparativa : [];
    const presentes = comparativa.map((c) => c.partido).sort();
    if (presentes.join('|') !== esperados.join('|')) {
      mal(`la comparativa debe tener a ${esperados.join(', ')} (tiene: ${presentes.join(', ') || 'nada'})`);
    }
    for (const c of comparativa) {
      // Sin medida sobre el tema: resumen, texto y página van a null.
      if (c.texto === null) {
        if (c.resumen !== null || c.paginaPdf !== null) mal(`${c.partido}: sin medida, resumen y paginaPdf deben ser null`);
        continue;
      }
      if (typeof c.resumen !== 'string' || c.resumen.length < 10) mal(`${c.partido}: falta resumen`);
      const falloCita = comprobarCita(c.partido, c.texto, c.paginaPdf);
      if (falloCita) mal(`comparativa ${c.partido} ${falloCita}`);
    }
  }
}

const ids = todas.map((f) => f.id);
for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) errores.push(`✗ id repetido: ${id}`);

if (final) {
  for (const p of PARTIDOS) {
    for (const t of TIPOS) {
      const n = todas.filter((f) => f.partido === p && f.tipo === t).length;
      if (n !== POR_TIPO) errores.push(`✗ ${p}: ${n} preguntas de tipo ${t} (deben ser ${POR_TIPO})`);
    }
  }

  // «¿Con quién coincides?» reutiliza estas citas: cada asunto necesita las
  // cuatro, y ninguna cita puede repetirse entre asuntos.
  const asuntos = JSON.parse(readFileSync('src/data/coincidencias.json', 'utf8'));
  const usadas = new Map();
  for (const a of asuntos) {
    const f = todas.find((x) => x.id === a.frase);
    if (!f) {
      errores.push(`✗ coincidencias ${a.id}: frase inexistente «${a.frase}»`);
      continue;
    }
    for (const p of PARTIDOS) {
      const cita = f.partido === p ? f.texto : f.comparativa.find((c) => c.partido === p)?.texto;
      if (!cita) errores.push(`✗ coincidencias ${a.id}: ${p} no tiene cita`);
      if (typeof a.posturas?.[p] !== 'string' || a.posturas[p].length < 20) errores.push(`✗ coincidencias ${a.id}: falta la postura de ${p}`);
      if (cita && usadas.has(cita)) errores.push(`✗ coincidencias ${a.id}: cita de ${p} repetida en ${usadas.get(cita)}`);
      if (cita) usadas.set(cita, a.id);
    }
  }
  console.log(`${asuntos.length} asuntos de «¿Con quién coincides?» revisados.`);
}

for (const e of errores) console.log(e);
const citas = todas.reduce((n, f) => n + 1 + (f.comparativa ?? []).filter((c) => c.texto).length, 0);
console.log(`\n${todas.length} preguntas y ${citas} citas revisadas; ${errores.length} errores.`);
process.exit(errores.length ? 1 : 0);
