## Context

Juego en `src/pages/index.astro` (rondas de 10, constante `RONDA`, puntos de
progreso fijos), registro en `/api/respuesta` y tabla `respuestas` en Neon con
datos reales desde el lanzamiento.

## Goals / Non-Goals

**Goals:** todo en el cliente salvo la columna `modo`; sin dependencias.

**Non-Goals:** recordar si ya se jugó el reto; clasificación entre jugadores;
editar frases a partir del calibrado (lo decide la persona).

## Decisions

**Símbolos `●`/`○` en lugar de `🟦🟥`.** Los cuadrados azul y rojo evocan a
PP y PSOE, contra los criterios editoriales. Los símbolos monocromos se leen en
cualquier red y no favorecen a nadie.

**Reto determinista sin backend.** Semilla = fecha `YYYY-MM-DD` en
Europe/Madrid (`Intl.DateTimeFormat` con `timeZone`), hash a entero y PRNG
pequeño (mulberry32) para barajar. Cupos 2+1+1+1 con el partido doble elegido
por la semilla. Al no depender de `Math.random`, todos ven lo mismo.

**La partida pasa a tener longitud variable** (10 o 5): los puntos de progreso
y los textos «x/10» se generan según la partida en curso.

**Columna `modo` con `DEFAULT 'ronda'`.** Migración aditiva aplicada antes del
despliegue: el código antiguo sigue funcionando y el nuevo envía el modo. El
endpoint valida `modo` y acepta `posicion` 1–10 como hasta ahora.

**Calibrado con un script Node** que consulta Neon con `DATABASE_URL` de
`.env.local` y cruza con `frases.json` para mostrar el texto; solo cuenta el
modo `ronda`, porque en el reto todos ven las mismas frases el mismo día.

## Risks / Trade-offs

- [Reto repetido mejora la puntuación compartida] → aceptado: es un juego; no
  se guarda nada en el navegador por coherencia con la política de datos.
- [Aciertos del reto mezclados en las estadísticas públicas] → la columna
  `modo` permite filtrarlos; las estadísticas públicas siguen contando todo
  (cada voto es una atribución real).

## Migration Plan

1. `ALTER TABLE respuestas ADD COLUMN IF NOT EXISTS modo ...` en Neon.
2. Merge y despliegue. Rollback: revertir el commit; la columna puede quedarse.
