## Why

Con 80 frases, quien juega varias rondas empieza a repetir pronto (cada ronda
usa 10). Además no hay forma de saber qué frases funcionan mejor como pregunta
(las que dividen, sorprenden o dan que hablar) hasta tener datos de juego, y
para entonces la campaña ya habrá terminado.

## What Changes

- **40 frases nuevas**, 10 por partido (5 «deducibles» y 5 «sorpresa»): el
  banco pasa a 120 frases, 30 por partido, 15 de cada tipo. Mismos criterios
  editoriales: cita literal recortable, sin vocabulario que delate al partido,
  «En otras palabras» y comparativa con cita y página de los otros tres.
- **Campo de calidad editorial** en cada una de las 120 frases: `calidad`
  (1, 2 o 3) y `etiquetas` opcionales (`ambigua`, `polemica`, `titular`). Es
  una valoración interna: el juego no la usa ni se muestra.
- El verificador (`--final`) exige el nuevo reparto y valida los dos campos.
- `/metodologia` y `AGENTS.md` pasan de «20 por partido» a «30 por partido».

## Capabilities

### New Capabilities

- `banco-de-frases`: composición del banco de frases y su valoración editorial.

### Modified Capabilities

- `metodologia`: el reparto que explica pasa a 30 frases por partido.

## Impact

- Datos: `data/candidatas/v2/*.json` y `src/data/frases.json` (generado con
  `scripts/unir-frases.mjs`).
- `scripts/verificar-frases.mjs`, `src/pages/metodologia.astro`, `AGENTS.md`.
- Sin cambios en la base de datos ni en los endpoints: los ids nuevos
  (`fa-21`…`fa-30`, etc.) los acepta `api/respuesta.ts` porque lee el JSON.
- El reto del día depende de la lista de frases: al desplegar cambiará el reto
  de ese día para quien juegue después.

## No objetivos

- Usar la calidad en el juego (selección de rondas o del reto).
- Cambiar «¿Con quién coincides?» (sigue con sus 16 asuntos).
- Retirar o reescribir frases existentes.
