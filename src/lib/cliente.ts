// Utilidades del lado del cliente compartidas por el juego y /resultados.

export type Estadisticas = {
  partidas: number;
  // Solo llegan tras la activación (fin de la veda).
  frases?: Record<string, { n: number; pct: number }>;
  matriz?: Record<string, Record<string, number>>;
  explicacion?: { con: { n: number; pct: number | null }; sin: { n: number; pct: number | null } };
};

// Contador visible solo desde este número de partidas (evita cifras ridículas).
export const MIN_PARTIDAS = 100;

// Una sola petición por carga de página. Cualquier fallo (503 sin base de
// datos, red, JSON roto) devuelve null: los datos nunca son imprescindibles.
export async function pedirEstadisticas(): Promise<Estadisticas | null> {
  try {
    const r = await fetch('/api/estadisticas');
    if (!r.ok) return null;
    const d = await r.json();
    return typeof d?.partidas === 'number' ? d : null;
  } catch {
    return null;
  }
}

// 'always' agrupa también los miles de 4 cifras («1.234»); es-ES no lo hace por defecto.
const enteros = new Intl.NumberFormat('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions);
export const numero = (n: number) => enteros.format(n);

// Convención española: espacio de no separación antes de «%».
export const porcentaje = (n: number) => `${Math.round(n)} %`;

// Presentación: mayúscula inicial y puntos suspensivos si el recorte deja
// la frase abierta. El texto guardado sigue siendo literal.
export function presentar(texto: string): string {
  let t = texto.charAt(0).toUpperCase() + texto.slice(1);
  if (!/[.!?…)»"]$/.test(t)) t += '…';
  return t;
}
