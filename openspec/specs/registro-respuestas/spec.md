# registro-respuestas Specification

## Purpose
TBD - created by archiving change registrar-respuestas. Update Purpose after archive.
## Requirements
### Requirement: Registro de cada respuesta

El sistema SHALL registrar cada respuesta del jugador en cuanto vota, sin
esperar al final de la ronda, para poder medir también las rondas abandonadas.
Cada registro MUST contener: identificador de la frase, partido elegido,
acierto, posición de la papeleta en la ronda (1 a 10), si se abrió «En otras
palabras» antes de votar, identificador de partida y fecha de registro.

#### Scenario: Respuesta registrada
- **WHEN** el jugador vota un partido en una papeleta
- **THEN** se guarda un registro con los campos indicados para esa papeleta

#### Scenario: Ronda abandonada
- **WHEN** el jugador responde 4 papeletas y cierra la página
- **THEN** quedan guardados los 4 registros de esa partida

### Requirement: Anonimato

El sistema MUST NOT guardar datos que identifiquen al jugador ni permitan
seguirlo entre rondas: ni dirección IP, ni agente de usuario, ni cookies, ni
identificadores persistentes en el navegador. El identificador de partida
MUST ser aleatorio, vivir solo en memoria y renovarse en cada ronda.

#### Scenario: Nueva ronda
- **WHEN** el jugador termina una ronda y pulsa «Otra ronda»
- **THEN** las respuestas de la nueva ronda llevan un identificador de partida distinto

#### Scenario: Sin rastro en el navegador
- **WHEN** el jugador completa una ronda
- **THEN** el registro no crea cookies ni escribe en el almacenamiento del navegador

### Requirement: Acierto calculado en el servidor

El servidor SHALL determinar el acierto comparando el partido elegido con el
autor real de la frase según los datos publicados, sin fiarse del cliente.

#### Scenario: Cliente que declara un acierto falso
- **WHEN** llega una respuesta que elige un partido distinto del autor de la frase
- **THEN** se guarda como fallo

### Requirement: Validación de entradas

El servidor MUST rechazar sin guardar nada las peticiones con una frase
inexistente, un partido fuera de los cuatro del juego, una posición fuera de
1 a 10, un identificador de partida mal formado o un cuerpo de más de 1 KB.

#### Scenario: Frase inexistente
- **WHEN** llega una respuesta con un identificador de frase que no existe
- **THEN** se responde con un error de cliente y no se guarda nada

### Requirement: El juego no depende del registro

El registro MUST ser invisible para el jugador: no retrasa la revelación, no
muestra errores y, si el servidor o la base de datos fallan o no están
configurados, el juego funciona igual.

#### Scenario: Base de datos caída
- **WHEN** el jugador vota y el registro falla
- **THEN** la revelación y el resto de la ronda se muestran con normalidad

### Requirement: Analíticas privadas

Los datos registrados SHALL consultarse solo de forma privada. Este cambio
MUST NOT exponer en el sitio ningún agregado de respuestas.

#### Scenario: Consulta pública
- **WHEN** alguien visita el sitio
- **THEN** no hay ninguna página ni endpoint que devuelva datos agregados de respuestas

