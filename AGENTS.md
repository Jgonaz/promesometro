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
- 20 preguntas por partido: 10 «deducibles» (un votante informado puede
  razonar de quién son) y 10 «sorpresa» (inesperadas para ese partido, pero
  claramente suyas). Nada que podría haber escrito cualquiera.
- Se evitan las frases que delatan al partido por su vocabulario: siglas,
  líderes, eslóganes, nombres propios de sus planes o autorreferencias.
- «En otras palabras» y los resúmenes de la comparativa son textos propios:
  fieles a la cita, neutrales y, antes de votar, sin pistas del partido. Cada
  resumen va con su cita literal y su página. Si un partido no dice nada sobre
  el asunto, se indica así, sin deducir su postura.
- `node scripts/verificar-frases.mjs --final src/data/frases.json` comprueba
  las citas, las páginas y el reparto.
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
- Único endpoint de servidor: `src/pages/api/respuesta.ts` guarda cada voto
  de forma anónima en Neon (Postgres, vía Vercel Marketplace, variable
  `DATABASE_URL`). Sin esa variable acepta y no guarda nada. Esquema en
  `db/esquema.sql`; consultas de análisis en `db/consultas.sql`.
- Las respuestas son anónimas: no se guardan IP, agente de usuario, cookies
  ni identificadores persistentes; el id de partida vive en memoria y cambia
  en cada ronda. Las analíticas son privadas y no se exponen en el sitio.
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
