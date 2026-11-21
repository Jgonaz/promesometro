## Why

El juego actual va de la medida al partido. Falta el camino inverso: que cada
persona diga qué haría ella ante un asunto y descubra con qué partidos
coincide. Los datos ya existen: cada frase trae la postura de los otros tres
partidos sobre lo mismo, con cita literal y página.

## What Changes

- **Nueva sección `/coincidencias` («¿Con quién coincides?»)**: 16 asuntos;
  en cada uno se muestran las cuatro posturas, sin partido y en orden
  aleatorio, más «Ninguna me convence». Al final, el porcentaje de
  coincidencia con cada partido y el repaso de cada asunto con el partido, la
  cita literal y el enlace a su página.
- **Selección editorial** en `src/data/coincidencias.json`: solo asuntos en los
  que los cuatro partidos dicen algo concreto y comparable. Las posturas se
  redactan en lenguaje llano y sin pistas; las citas se reutilizan de
  `frases.json`, ya verificadas.
- **Sin datos**: el resultado se calcula en el navegador; no se envía ni se
  guarda nada.
- Enlaces desde la portada, el escrutinio y el pie; `/metodologia` explica la
  sección.

## Capabilities

### New Capabilities

- `coincidencias`: test de afinidad por posturas.

### Modified Capabilities

- `metodologia`: explica cómo se eligen los asuntos y cómo se calcula el resultado.

## Impact

- Nuevos: `src/pages/coincidencias.astro`, `src/data/coincidencias.json`,
  `src/lib/coincidencias.ts`.
- Modificados: `src/pages/index.astro` (enlaces), `src/pages/metodologia.astro`,
  `scripts/verificar-frases.mjs`, `AGENTS.md`.
- Sin cambios en la base de datos ni en los endpoints.

## No objetivos

- Recomendar un voto o asignar un partido por una sola respuesta.
- Pesos por importancia del tema, ejes ideológicos o gráficos de posición.
- Guardar respuestas o publicar agregados.
