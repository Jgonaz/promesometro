// Orden alfabético fijo: no favorece a ningún partido por posición.
// `ar` es la proporción ancho/alto de cada logo; con ella se igualan por área
// (no por altura), para que ninguno pese visualmente más que otro.
export const PARTIDOS = [
  { nombre: 'Frente Amplio', logo: '/img/partidos/frente-amplio.svg', ar: 2.951 },
  { nombre: 'PP', logo: '/img/partidos/pp.svg', ar: 1.483 },
  { nombre: 'PSOE', logo: '/img/partidos/psoe.svg', ar: 5.128 },
  { nombre: 'Vox', logo: '/img/partidos/vox.svg', ar: 2.075 },
].map((p) => ({ ...p, raiz: Math.sqrt(p.ar).toFixed(3) }));
