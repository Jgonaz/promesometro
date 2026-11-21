## ADDED Requirements

### Requirement: Test por posturas

La sección `/coincidencias` SHALL presentar, uno a uno, los asuntos de
`src/data/coincidencias.json`. En cada asunto MUST mostrar las cuatro posturas
en lenguaje llano, sin partido, logo ni color identificativo, en orden
aleatorio, y una opción «Ninguna me convence». Solo entran asuntos en los que
los cuatro partidos tienen una postura con cita literal y página.

#### Scenario: Responder un asunto
- **WHEN** la persona elige una postura
- **THEN** pasa al siguiente asunto sin revelar de qué partido era

#### Scenario: Ninguna postura
- **WHEN** la persona elige «Ninguna me convence»
- **THEN** ese asunto no suma a ningún partido

### Requirement: Resultado de afinidad

Al terminar, la sección SHALL mostrar el porcentaje de coincidencia con cada
partido (elecciones de ese partido entre los asuntos con elección), en orden
alfabético y con el mismo estilo para todos, y nombrar al partido o partidos
con más coincidencias. MUST incluir el aviso de que no es una recomendación de
voto y el repaso de cada asunto con el partido de cada postura, la elegida, la
cita literal y el enlace a su página del programa.

#### Scenario: Empate
- **WHEN** dos partidos tienen el máximo de coincidencias
- **THEN** se nombran ambos, sin destacar a uno

#### Scenario: Sin elecciones
- **WHEN** la persona responde «Ninguna me convence» a todo
- **THEN** no se muestran porcentajes y se explica por qué

### Requirement: Sin datos guardados

La sección MUST NOT enviar ni guardar las respuestas ni el resultado, ni en el
servidor ni en el navegador. Compartir solo invita a hacer el test, sin
porcentajes ni partidos.

#### Scenario: Completar el test
- **WHEN** la persona termina el test
- **THEN** no se hace ninguna petición con sus respuestas
