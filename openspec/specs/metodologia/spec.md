# metodologia Specification

## Purpose
TBD - created by archiving change mejoras-lanzamiento. Update Purpose after archive.
## Requirements
### Requirement: Página de metodología

El sitio SHALL tener una página `/metodologia`, enlazada desde el pie, que
explique: que las frases son citas literales recortables y nunca reescritas,
el reparto de 30 frases por partido (15 deducibles y 15 sorpresa), que se
evitan las frases que delatan al partido por su vocabulario, que «En otras
palabras» y los resúmenes son textos propios, enlaces a los cuatro programas
oficiales, qué datos se guardan y cuáles no, y que no se publican aciertos por
partido durante los cinco días previos a la votación. MUST NOT afirmar nada
que no esté en los criterios del proyecto o en sus datos.

#### Scenario: Visitante escéptico
- **WHEN** alguien abre `/metodologia`
- **THEN** encuentra los criterios de selección, los enlaces a los cuatro programas y la política de datos

### Requirement: Metodología de «¿Con quién coincides?»

`/metodologia` SHALL explicar cómo se eligen los asuntos, que las posturas son
textos propios con su cita literal, cómo se calcula el porcentaje, que no es
una recomendación de voto y que no se guarda ninguna respuesta de esa sección.

#### Scenario: Consultar la metodología
- **WHEN** alguien abre `/metodologia`
- **THEN** encuentra un apartado sobre «¿Con quién coincides?» con esos puntos

