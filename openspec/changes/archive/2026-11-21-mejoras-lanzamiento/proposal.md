## Why

El juego se lanza el lunes 23N y solo tiene una semana de vida antes del 29N.
Para que se difunda hace falta un final más personal y compartible, un motivo
para volver cada día y una explicación pública de cómo se hizo; y, con los
datos que ya se recogen, una forma de detectar frases mal calibradas.

## What Changes

- **Retrato al terminar**: en el escrutinio, la confusión más repetida de la
  partida («Le diste al PP 2 medidas de Vox») y el partido que más se ha
  fallado. Se calcula en el navegador con la propia partida.
- **Resultado compartible neutro**: las casillas `🟦🟥` (colores que evocan a
  partidos) pasan a `●` (acierto) y `○` (fallo); el texto incluye el retrato
  breve y, en el reto, la fecha.
- **Página `/metodologia`**: criterios editoriales, fuentes oficiales, qué
  datos se guardan y la veda de estadísticas. Enlazada desde el pie.
- **Reto diario**: 5 frases iguales para todo el mundo cada día (Europe/Madrid),
  elegidas de forma determinista a partir de la fecha. Sin guardar nada en el
  navegador; se puede repetir.
- **Columna `modo`** (`ronda` | `reto`) en `respuestas`, para separar
  analíticas. Migración aditiva con valor por defecto.
- **Revisión editorial**: script privado que lista las frases demasiado fáciles
  o difíciles según los datos, con su texto. No publica nada.

## Capabilities

### New Capabilities

- `final-de-partida`: retrato y resultado compartible.
- `reto-diario`: reto de 5 frases por día.
- `metodologia`: página pública de metodología.
- `revision-editorial`: herramienta privada de calibrado de frases.

### Modified Capabilities

- `registro-respuestas`: cada registro guarda también el modo de juego.

## Impact

- `src/pages/index.astro`, `src/lib/`, nueva `src/pages/metodologia.astro`.
- `src/pages/api/respuesta.ts` y `db/esquema.sql` (columna `modo`), migración en
  Neon antes del despliegue.
- Nuevo `scripts/revisar-frases.mjs` y consulta en `db/consultas.sql`.
- `AGENTS.md`. Sin dependencias nuevas.
