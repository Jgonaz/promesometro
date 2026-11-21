## Context

`frases.json` tiene 80 frases; cada una incluye la `comparativa` con la cita y
la página de los otros tres partidos sobre el mismo `subtema`. El sitio es
estático salvo dos endpoints; el juego vive en `index.astro`.

## Goals / Non-Goals

**Goals:** afinidad honesta (sin interpretar posturas), neutralidad visual y
textual, cero datos guardados, lista antes de que acabe la campaña.

**Non-Goals:** recomendar voto, ponderar temas, guardar o publicar resultados.

## Decisions

- **Elegir entre cuatro posturas, no «de acuerdo/en desacuerdo»**. Puntuar un
  «sí/no» obligaría a codificar qué opina cada partido de una frase ajena, es
  decir, a deducir posturas. Elegir entre las cuatro posturas reales no
  requiere interpretación.
- **Asuntos solo con las cuatro posturas presentes y comparables**. Se
  descartan los que tienen un partido «sin postura», los que repiten cita entre
  asuntos y aquellos en los que la cita de un partido trata de otra cosa.
  Quedan 16 asuntos de temas distintos.
- **Texto propio por postura**. Los `resumen` de la comparativa se escribieron
  para leerse tras revelar el partido y pueden delatarlo; las opciones se
  redactan de nuevo en infinitivo, con la misma forma para todas, fieles a la
  cita y sin vocabulario identificativo. Tras terminar, cada opción muestra su
  cita literal y su página.
- **Las citas no se duplican**: `coincidencias.json` guarda el `id` de la
  frase, la pregunta y los cuatro textos propios; la cita y la página se toman
  en el build de `frases.json` (frase propia o su comparativa). El build falla
  si falta un partido o una frase, y `verificar-frases.mjs` comprueba lo mismo.
- **Puntuación**: cada elección suma uno al partido elegido; «Ninguna me
  convence» no suma. Porcentaje = elecciones del partido / asuntos con
  elección. Resultados en orden alfabético con barras del mismo color; se
  nombra a los partidos con el máximo (todos si hay empate). Si no hay ninguna
  elección, no hay porcentajes.
- **Orden de las opciones** aleatorio en cada asunto (`Math.random`), con
  letras A–D en vez de logos.
- **Sin servidor**: nada se envía. Compartir solo invita a hacer el test; no
  incluye porcentajes ni partidos, para que no circule como sondeo durante la
  veda.

## Risks / Trade-offs

- [Afinidad con pocas preguntas] → aviso visible de que no es una
  recomendación de voto y repaso con las citas para contrastar.
- [Una postura más vaga que otras atrae o repele] → se prefieren asuntos con
  posturas concretas; los textos propios mantienen el nivel de detalle de la
  cita, sin añadir.
- [Redacción con sesgo] → mismo criterio que «En otras palabras» y revisión
  del responsable editorial antes de integrar.
