## Why

Los votos ya se guardan en Neon, pero solo los ve el autor. Mostrarlos en la
web anima a jugar (contador) y, tras las elecciones, da un contenido muy
compartible (cómo se confundieron los jugadores). La veda del 24 al 29N
obliga a separar lo que se puede enseñar ya de lo que espera al 30N.

## What Changes

- Contador «X partidas jugadas» en la portada, visible desde ya.
- A partir del 30N a las 00:00 (Europe/Madrid): tras votar, porcentaje de
  jugadores que acertaron esa frase (con un mínimo de respuestas).
- Nueva página `/resultados`: matriz de confusión entre partidos, frases más
  y menos acertadas, efecto de «En otras palabras» y total de partidas. Antes
  del 30N muestra que estará disponible tras las elecciones.
- Nuevo endpoint público de solo lectura con agregados, cacheado en la CDN.
  La fecha de activación se aplica en el servidor.
- **BREAKING (garantía documentada):** las analíticas dejan de ser
  exclusivamente privadas; se publican agregados, nunca filas sueltas.

## Capabilities

### New Capabilities

- `estadisticas-publicas`: publicación de agregados de las respuestas, con
  su calendario de activación, umbrales y caché.

### Modified Capabilities

- `registro-respuestas`: el requisito «Analíticas privadas» pasa a permitir
  agregados públicos según `estadisticas-publicas`.

## Impact

- Nuevo `src/pages/api/estadisticas.ts` y `src/pages/resultados.astro`.
- `src/pages/index.astro`: contador en portada, porcentaje tras votar y
  enlace a resultados.
- `AGENTS.md` del proyecto: stack y garantías de privacidad.
- Sin dependencias nuevas.
