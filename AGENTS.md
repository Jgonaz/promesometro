# Instrucciones de Promesómetro

## Qué es

Juego web: se muestra de forma anónima una medida extraída de los programas
electorales de PSOE, PP, Vox y Frente Amplio para las generales del 29N de 2026,
y el usuario adivina a qué partido pertenece. Tras responder se revela el
partido con la cita y el enlace a la página del programa oficial.

## Criterios editoriales (no negociables)

- Cada frase sale literal del programa oficial; se puede recortar, nunca reescribir.
- Mismo número de frases por partido y dificultad equilibrada.
- Se priorizan medidas ambiguas o poco conocidas; se evitan las emblemáticas,
  las polémicas y las que delatan al partido por su vocabulario.
- Logos oficiales de los cuatro partidos, todos con el mismo tamaño y en orden
  alfabético; ningún partido destaca visualmente. Nunca se generan ni se
  modifican con IA.
- Acierto en tinta marino y fallo en rojo lacre: nada de verdes ni de otros
  colores que evoquen a un partido. Los logos se igualan por área, no por altura.
- No se publican estadísticas agregadas de aciertos por partido durante los
  cinco días previos a la votación, para que no se confundan con un sondeo.

## Stack

- Astro estático, sin backend. Las frases viven en un JSON del repositorio.
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
