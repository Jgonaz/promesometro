## Contexto

Las frases se extraen de los PDF oficiales (`data/programas/`, texto por
páginas en `data/texto/`), se escriben por partido en `data/candidatas/v2/` y
`scripts/unir-frases.mjs` las une en `src/data/frases.json`.

## Decisiones

### Escala de calidad

| Nota | Significado |
| --- | --- |
| 3 | Gran pregunta: la gente duda de verdad entre varios partidos, sorprende al revelarse o da para discutir. |
| 2 | Buena: funciona, pero se resuelve con algo de razonamiento sin mucha discusión. |
| 1 | Floja: obvia, demasiado técnica o poco llamativa. Candidata a sustituirse. |

Etiquetas (cero o más, sin orden):

- `ambigua`: verosímil en al menos dos partidos.
- `polemica`: toca un asunto que divide a la opinión pública.
- `titular`: llamativa y fácil de compartir; resume bien en una frase.

La valoración es una estimación editorial previa a los datos de juego; el
calibrado privado (`revisar-frases.mjs`) sigue siendo la medida real de
dificultad.

### Selección de las 40 nuevas

- Temas poco cubiertos primero (defensa, consumo, empleo, educación,
  cultura…), sin repetir el asunto de una frase existente del mismo partido.
- Se priorizan candidatas de calidad 2–3; no se añaden frases de calidad 1.
- Ids correlativos por partido (`psoe-21`…`psoe-30`) para no tocar los
  existentes, que ya tienen respuestas registradas.

### Proceso

Un explorador de solo lectura por partido propone candidatas con cita literal
y página; el orquestador selecciona, redacta «En otras palabras» y la
comparativa, y el verificador comprueba cada cita contra el texto del PDF.

## Riesgos

- **Cambio del reto del día al desplegar**: aceptable; conviene desplegar de
  madrugada si se quiere evitar.
- **Subjetividad de la nota**: la propone el agente y la revisa la persona.
- **Calendario**: la votación es el 29 de noviembre; el banco ampliado solo
  aporta si se publica antes.
