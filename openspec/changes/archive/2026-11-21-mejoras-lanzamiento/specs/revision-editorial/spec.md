## ADDED Requirements

### Requirement: Calibrado privado de frases

El proyecto SHALL incluir una herramienta de uso privado que, a partir de las
respuestas registradas en las rondas normales, liste las frases con al menos
50 respuestas cuyo porcentaje de acierto supere el 90 % o no llegue al 10 %,
con su id, partido, tipo, texto, número de respuestas y porcentaje. MUST NOT
publicar sus resultados en el sitio.

#### Scenario: Frase demasiado fácil
- **WHEN** una frase tiene 120 respuestas y un 95 % de aciertos
- **THEN** aparece en el listado como candidata a revisión por fácil

#### Scenario: Pocos datos
- **WHEN** ninguna frase llega a 50 respuestas
- **THEN** la herramienta indica que aún no hay datos suficientes
