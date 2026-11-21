// Calibrado editorial (uso privado, no se publica): lista las frases que casi
// todo el mundo acierta o casi nadie acierta, para decidir si se sustituyen.
// Solo cuenta las rondas normales: en el reto todos ven las mismas frases el
// mismo día y eso sesgaría los porcentajes. Uso:
//   vercel env pull .env.local --environment=production   (una vez)
//   node --env-file=.env.local scripts/revisar-frases.mjs [--min 50] [--alto 90] [--bajo 10]
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const arg = (nombre, defecto) => {
  const i = process.argv.indexOf(`--${nombre}`);
  return i > -1 ? Number(process.argv[i + 1]) : defecto;
};
const MIN = arg('min', 50);
const ALTO = arg('alto', 90);
const BAJO = arg('bajo', 10);

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL. Ejecuta con: node --env-file=.env.local scripts/revisar-frases.mjs');
  process.exit(1);
}

const frases = new Map(
  JSON.parse(readFileSync(new URL('../src/data/frases.json', import.meta.url), 'utf8')).map((f) => [f.id, f]),
);
const sql = neon(process.env.DATABASE_URL);
const filas = await sql`
  SELECT frase, count(*)::int AS n, round(100.0 * avg(acierto::int))::int AS pct
  FROM respuestas WHERE modo = 'ronda'
  GROUP BY frase HAVING count(*) >= ${MIN}
  ORDER BY pct DESC`;

if (filas.length === 0) {
  console.log(`Aún no hay datos suficientes: ninguna frase llega a ${MIN} respuestas en rondas normales.`);
  process.exit(0);
}

const mostrar = (titulo, lista) => {
  console.log(`\n${titulo} (${lista.length})`);
  for (const { frase, n, pct } of lista) {
    const f = frases.get(frase);
    const texto = f ? f.texto.replace(/\s+/g, ' ') : '(frase ya no está en frases.json)';
    console.log(`\n  ${frase} · ${f?.partido ?? '?'} · ${f?.tipo ?? '?'} · ${pct} % de ${n}`);
    console.log(`  ${texto.length > 160 ? `${texto.slice(0, 160)}…` : texto}`);
  }
};

console.log(`Frases con al menos ${MIN} respuestas en rondas normales: ${filas.length} de ${frases.size}.`);
mostrar(`Demasiado fáciles (más del ${ALTO} %)`, filas.filter((r) => r.pct > ALTO));
mostrar(`Demasiado difíciles (menos del ${BAJO} %)`, filas.filter((r) => r.pct < BAJO).reverse());
