# estadisticas-publicas Specification

## Purpose
TBD - created by archiving change estadisticas-publicas. Update Purpose after archive.
## Requirements
### Requirement: Contador de partidas

La portada SHALL mostrar el número de partidas distintas registradas (con al
menos una respuesta) en cualquier fecha, incluida la veda. El contador MUST
ocultarse mientras haya menos de 100 partidas o si los datos no están
disponibles.

#### Scenario: Suficientes partidas
- **WHEN** hay 1.234 partidas registradas y alguien abre la portada
- **THEN** ve «1.234 partidas jugadas»

#### Scenario: Pocas partidas o error
- **WHEN** hay 40 partidas registradas o el servicio de datos falla
- **THEN** la portada no muestra contador y el juego funciona igual

### Requirement: Activación tras la votación

Los agregados de aciertos (por frase, por partido, matriz de confusión y
efecto de «En otras palabras») MUST NOT servirse antes del 30 de noviembre de
2026 a las 00:00, hora de Europe/Madrid. La comprobación SHALL hacerse en el
servidor, de modo que ni la web ni una llamada directa obtengan esos datos
antes de la fecha.

#### Scenario: Llamada directa durante la veda
- **WHEN** alguien pide los datos públicos el 27 de noviembre
- **THEN** solo recibe el número de partidas, sin ningún dato de aciertos

#### Scenario: Tras la activación
- **WHEN** alguien pide los datos públicos el 30 de noviembre a las 00:05
- **THEN** recibe también los agregados de aciertos

### Requirement: Porcentaje de acierto por frase

Tras la activación, al revelar el partido de una frase, el juego SHALL mostrar
el porcentaje de jugadores que la acertaron, solo si la frase tiene al menos
30 respuestas. Si no las tiene, o antes de la activación, no se muestra nada.

#### Scenario: Frase con suficientes respuestas
- **WHEN** tras la activación el jugador vota una frase con 200 respuestas y un 38 % de aciertos
- **THEN** la revelación indica que el 38 % de los jugadores la acertó

#### Scenario: Frase con pocas respuestas
- **WHEN** la frase tiene 12 respuestas
- **THEN** la revelación no muestra porcentaje

### Requirement: Página de resultados

El sitio SHALL tener una página `/resultados` que, tras la activación, muestre:
la matriz de confusión entre el partido real y el elegido (en porcentaje por
partido real), las 5 frases más acertadas y las 5 más falladas (entre las que
tengan al menos 30 respuestas, con su texto literal y su partido), el acierto
con y sin abrir «En otras palabras» y el total de partidas. Antes de la
activación MUST indicar que estará disponible tras las elecciones, sin datos
de aciertos. Los partidos MUST aparecer en orden alfabético, con el mismo
tamaño y sin colores que evoquen a un partido (acierto en marino, fallo en
lacre).

#### Scenario: Durante la veda
- **WHEN** alguien visita `/resultados` el 25 de noviembre
- **THEN** ve que los resultados se publicarán tras las elecciones y, como mucho, el número de partidas

#### Scenario: Tras la activación
- **WHEN** alguien visita `/resultados` el 1 de diciembre
- **THEN** ve la matriz, las frases destacadas, el efecto de la explicación y el total de partidas

### Requirement: Solo agregados y cacheados

Los datos públicos MUST ser agregados: nunca filas individuales ni
identificadores de partida. Las respuestas SHALL poder cachearse en la CDN un
máximo de 5 minutos para no consultar la base de datos en cada visita.

#### Scenario: Contenido de la respuesta pública
- **WHEN** se piden los datos públicos
- **THEN** la respuesta no contiene identificadores de partida ni filas sueltas

