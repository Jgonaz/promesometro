# Instrucciones de Promesómetro

## Qué es

Juego web: se muestra de forma anónima una medida extraída de los programas
electorales de PSOE, PP, Vox y Frente Amplio para las generales del 29N de 2026,
y el usuario adivina a qué partido pertenece. Antes de votar puede abrir «En
otras palabras», una explicación en lenguaje llano. Tras responder se revela el
partido con el enlace a la página del programa oficial y qué proponen los otros
tres partidos sobre lo mismo.

## Criterios editoriales (no negociables)

- Cada frase sale literal del programa oficial; se puede recortar, nunca reescribir.
- 30 preguntas por partido: 15 «deducibles» (un votante informado puede
  razonar de quién son) y 15 «sorpresa» (inesperadas para ese partido, pero
  claramente suyas). Nada que podría haber escrito cualquiera.
- Cada frase lleva una valoración editorial interna, que el juego no usa ni
  envía al navegador: `calidad` 3 (gran pregunta: hace dudar entre partidos,
  sorprende o da que hablar), 2 (buena, se resuelve razonando) o 1 (floja,
  candidata a sustituirse; no se añaden nuevas con 1), y `etiquetas` entre
  `ambigua` (verosímil en al menos dos partidos), `polemica` (asunto que
  divide) y `titular` (llamativa y compartible).
- Se evitan las frases que delatan al partido por su vocabulario: siglas,
  líderes, eslóganes, nombres propios de sus planes o autorreferencias.
- «En otras palabras» y los resúmenes de la comparativa son textos propios:
  fieles a la cita, neutrales y, antes de votar, sin pistas del partido. Cada
  resumen va con su cita literal y su página. Si un partido no dice nada sobre
  el asunto, se indica así, sin deducir su postura.
- `node scripts/verificar-frases.mjs --final src/data/frases.json` comprueba
  las citas, las páginas, el reparto y la valoración.
- Logos oficiales de los cuatro partidos, todos con el mismo tamaño y en orden
  alfabético; ningún partido destaca visualmente. Nunca se generan ni se
  modifican con IA.
- Acierto en tinta marino y fallo en rojo lacre: nada de verdes ni de otros
  colores que evoquen a un partido. Los logos se igualan por área, no por altura.
- No se publican estadísticas agregadas de aciertos por partido durante los
  cinco días previos a la votación, para que no se confundan con un sondeo.

## Stack

- Astro con las páginas prerenderizadas y desplegado en Vercel
  (`@astrojs/vercel`). Las frases viven en un JSON del repositorio.
- Únicos endpoints de servidor (el resto del sitio es estático):
  `src/pages/api/respuesta.ts` guarda cada voto de forma anónima en Neon
  (Postgres, vía Vercel Marketplace, variable `DATABASE_URL`; sin esa variable
  acepta y no guarda nada) y `src/pages/api/estadisticas.ts` (GET) publica
  agregados. Esquema en `db/esquema.sql`; consultas de análisis en
  `db/consultas.sql`.
- `/coincidencias` («¿Con quién coincides?»): 16 asuntos con una postura
  propia por partido (`src/data/coincidencias.json`, enlazado por id a
  `frases.json`, de donde salen la cita y la página; `src/lib/coincidencias.ts`
  hace fallar el build si falta alguna). El cálculo es solo en el navegador:
  no se guarda ni se envía nada, y compartir invita sin porcentajes ni
  partidos. Si cambia la selección o el cálculo, actualiza `/metodologia`.
- Estadísticas públicas: `/api/estadisticas` siempre devuelve el número de
  partidas; los agregados de aciertos (por frase con al menos 30 respuestas,
  matriz de confusión y efecto de «En otras palabras») solo se sirven desde
  el 30 de noviembre de 2026 a las 00:00 (Europe/Madrid, constante
  `ACTIVACION` del endpoint), comprobado en el servidor. Con esos datos se
  muestran el porcentaje tras votar y `/resultados`. Respuesta cacheada 5
  minutos en la CDN; sin base de datos o con error, 503 y el cliente lo oculta.
  El contador de partidas se muestra desde 100.
- Modos de juego: ronda de 10 frases y reto del día de 5, igual para todos
  cada día de Europe/Madrid (selección determinista por la fecha, sin
  `Math.random` ni almacenamiento en el navegador; `/#reto` lo abre). Cada
  respuesta guarda su `modo` (`ronda` | `reto`).
- El resultado compartible usa `●` (acierto) y `○` (fallo), nunca emojis de
  colores que evoquen partidos.
- `/metodologia` explica criterios, fuentes y política de datos: si cambian
  los criterios editoriales o los datos que se guardan, actualízala.
- Calibrado editorial privado: `node --env-file=.env.local
  scripts/revisar-frases.mjs` lista las frases con más del 90 % o menos del
  10 % de aciertos en rondas (mín. 50 respuestas). No se publica.
- Las respuestas son anónimas: no se guardan IP, agente de usuario, cookies
  ni identificadores persistentes; el id de partida vive en memoria y cambia
  en cada ronda. Solo se publican agregados (nunca filas sueltas ni ids de
  partida), y los datos en bruto solo se consultan en privado.
- Gestor de paquetes: pnpm.
- Los PDF originales van en `data/programas/` y no se suben a Git; sus URL
  oficiales están en `data/programas/fuentes.json`.

## Desarrollo

Arranca el servidor en segundo plano con `pnpm astro dev --background` y
gestiónalo con `astro dev stop`, `astro dev status` y `astro dev logs`.
Documentación de Astro: https://docs.astro.build

## Imágenes

- Logos en `public/img/partidos/` (Wikimedia Commons, dominio público o CC0;
  el del Frente Amplio, de su web oficial).
- Ilustraciones generadas con Codex en `src/assets/` (se optimizan con
  `<Image>` de Astro). Estilo: risografía, crema, azul marino, rojo lacre y
  mostaza; sin símbolos de partidos ni personas reconocibles.
- `public/img/og.jpg` (1200×630) se compone a partir de `src/assets/compartir.png`.

## Revisión de diseño

Se audita con la skill Impeccable (`critique`, `polish`); las críticas quedan
en `.impeccable/critique/`.

## Validación

`pnpm build` debe terminar sin errores.
