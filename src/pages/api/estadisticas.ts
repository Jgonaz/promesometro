import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from 'astro:env/server';

// Solo lectura y solo agregados: nunca filas sueltas ni ids de partida.
export const prerender = false;

// Hasta esta fecha (fin de la veda, Europe/Madrid, horario de invierno) solo se
// sirve el número de partidas. Para probar la activación, cámbiala aquí a una
// fecha pasada (o futura para simular la veda) y NO la dejes así al fusionar.
const ACTIVACION = new Date('2026-11-30T00:00:00+01:00');

// Mínimo de respuestas para publicar un porcentaje, para no mostrar cifras
// ridículas ni deducibles de unas pocas personas.
const MIN_RESPUESTAS = 30;

const json = (cuerpo: unknown, cache: string, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  });

const pct = (parte: number, total: number) => Math.round((1000 * parte) / total) / 10;

export const GET: APIRoute = async () => {
  // Sin base de datos o con la consulta fallida: 503 sin caché, y el cliente oculta todo.
  if (!DATABASE_URL) return json({ error: 'sin-datos' }, 'no-store', 503);

  const sql = neon(DATABASE_URL);
  const activa = Date.now() >= ACTIVACION.getTime();

  try {
    // Todos los recuentos salen como int (no bigint) para llegar como números.
    const [partidas, frases, matriz, explicacion] = await Promise.all([
      sql`SELECT count(DISTINCT partida)::int AS n FROM respuestas`,
      activa
        ? sql`
            SELECT frase, count(*)::int AS n, count(*) FILTER (WHERE acierto)::int AS aciertos
            FROM respuestas GROUP BY frase HAVING count(*) >= ${MIN_RESPUESTAS}`
        : [],
      activa
        ? sql`SELECT partido, elegido, count(*)::int AS n FROM respuestas GROUP BY partido, elegido`
        : [],
      activa
        ? sql`
            SELECT explicacion, count(*)::int AS n, count(*) FILTER (WHERE acierto)::int AS aciertos
            FROM respuestas GROUP BY explicacion`
        : [],
    ]);

    const cuerpo: Record<string, unknown> = { partidas: partidas[0]?.n ?? 0 };

    if (activa) {
      cuerpo.frases = Object.fromEntries(
        frases.map((r) => [r.frase, { n: r.n, pct: Math.round((100 * r.aciertos) / r.n) }]),
      );

      // Porcentaje sobre el total de cada partido real (cada fila suma ~100).
      const totales: Record<string, number> = {};
      for (const r of matriz) totales[r.partido] = (totales[r.partido] ?? 0) + r.n;
      const m: Record<string, Record<string, number>> = {};
      for (const r of matriz) (m[r.partido] ??= {})[r.elegido] = pct(r.n, totales[r.partido]);
      cuerpo.matriz = m;

      // Sin respuestas suficientes en un grupo, su pct es null y no se compara.
      const grupo = (con: boolean) => {
        const r = explicacion.find((x) => x.explicacion === con);
        const n: number = r?.n ?? 0;
        return { n, pct: r && n >= MIN_RESPUESTAS ? Math.round((100 * r.aciertos) / n) : null };
      };
      cuerpo.explicacion = { con: grupo(true), sin: grupo(false) };
    }

    return json(cuerpo, 'public, s-maxage=300, stale-while-revalidate=60');
  } catch (e) {
    console.error('No se pudieron calcular las estadísticas', e);
    return json({ error: 'sin-datos' }, 'no-store', 503);
  }
};
