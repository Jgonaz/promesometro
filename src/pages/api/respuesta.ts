import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from 'astro:env/server';
import frases from '../../data/frases.json';

// Única ruta con servidor: el resto del sitio sigue prerenderizado.
export const prerender = false;

// Autor real de cada frase, para calcular el acierto aquí y no fiarse del cliente.
const autor = new Map(frases.map((f) => [f.id, f.partido]));
const PARTIDOS = new Set(['Frente Amplio', 'PP', 'PSOE', 'Vox']);
const MODOS = new Set(['ronda', 'reto']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BYTES = 1024;

const vacia = (status: number) => new Response(null, { status });

export const POST: APIRoute = async ({ request }) => {
  const cuerpo = await request.text();
  if (cuerpo.length > MAX_BYTES) return vacia(413);

  let r: Record<string, unknown>;
  try {
    r = JSON.parse(cuerpo);
  } catch {
    return vacia(400);
  }
  const { partida, frase, elegido, posicion, explicacion, modo } = r ?? {};
  if (
    typeof partida !== 'string' || !UUID.test(partida) ||
    typeof frase !== 'string' || !autor.has(frase) ||
    typeof elegido !== 'string' || !PARTIDOS.has(elegido) ||
    !Number.isInteger(posicion) || (posicion as number) < 1 || (posicion as number) > 10 ||
    typeof explicacion !== 'boolean' ||
    typeof modo !== 'string' || !MODOS.has(modo)
  ) {
    return vacia(400);
  }

  // Sin base de datos (desarrollo local, previews) se acepta sin guardar.
  if (!DATABASE_URL) return vacia(204);

  // Solo los campos validados: ni IP ni agente de usuario ni cabeceras.
  const sql = neon(DATABASE_URL);
  const partido = autor.get(frase)!;
  try {
    await sql`
      INSERT INTO respuestas (partida, frase, partido, elegido, acierto, posicion, explicacion, modo)
      VALUES (${partida}, ${frase}, ${partido}, ${elegido}, ${partido === elegido}, ${posicion}, ${explicacion}, ${modo})
    `;
  } catch (e) {
    console.error('No se pudo guardar la respuesta', e);
    return vacia(503);
  }
  return vacia(204);
};
