## Why

Hoy no sabemos cómo se juega: qué frases confunden más, qué partido se toma
por cuál, si «En otras palabras» ayuda o en qué papeleta se abandona. Quedan
pocos días para el 29N y el pico de tráfico no se repetirá, así que conviene
empezar a recoger respuestas ya, de forma anónima, para analizarlas en privado.

## What Changes

- Cada respuesta del jugador se envía, en segundo plano, a un endpoint propio
  que la guarda en una base de datos Postgres (Neon, vía Vercel Marketplace).
- Se guarda solo lo necesario para analizar el juego: frase, partido elegido,
  acierto (calculado en el servidor), posición en la ronda, si se abrió «En
  otras palabras», un identificador aleatorio de partida y la fecha.
- Sin datos personales: ni IP, ni cookies, ni identificadores persistentes en
  el navegador. El identificador de partida vive solo en memoria y cambia en
  cada ronda. Por eso no hace falta banner de consentimiento.
- El juego nunca depende del registro: si falla o tarda, se sigue jugando igual.
- Las analíticas son privadas (consultas SQL en Neon). Esta propuesta no
  publica ningún agregado; publicar aciertos por partido seguirá prohibido del
  24 al 29N por los criterios editoriales.
- **BREAKING (arquitectura):** el sitio deja de ser 100 % estático. Las páginas
  siguen prerenderizadas, pero se añade una función de servidor en Vercel.

## Capabilities

### New Capabilities

- `registro-respuestas`: recogida anónima de las respuestas del juego para
  analítica privada, con sus garantías de privacidad, validación y tolerancia
  a fallos.

### Modified Capabilities

(ninguna; no hay specs previas)

## Impact

- `src/pages/index.astro`: envío de cada respuesta tras votar.
- Nuevo endpoint `src/pages/api/respuesta.ts` (no prerenderizado).
- `astro.config.mjs`: adaptador `@astrojs/vercel`.
- Dependencias nuevas: `@astrojs/vercel` (necesario para ejecutar el endpoint
  en Vercel) y `@neondatabase/serverless` (driver HTTP de Neon, pensado para
  funciones sin conexión persistente).
- Infraestructura: recurso Neon en el proyecto de Vercel `promesometro`, con
  `DATABASE_URL` inyectada por la integración.
- `AGENTS.md` del proyecto: el stack pasa de «sin backend» a «estático con un
  endpoint de registro».
