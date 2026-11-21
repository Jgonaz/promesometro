## MODIFIED Requirements

### Requirement: Registro de cada respuesta

El sistema SHALL registrar cada respuesta del jugador en cuanto vota, sin
esperar al final de la ronda, para poder medir también las rondas abandonadas.
Cada registro MUST contener: identificador de la frase, partido elegido,
acierto, posición de la papeleta en la partida, modo de juego (`ronda` o
`reto`), si se abrió «En otras palabras» antes de votar, identificador de
partida y fecha de registro.

#### Scenario: Respuesta registrada
- **WHEN** el jugador vota un partido en una papeleta
- **THEN** se guarda un registro con los campos indicados para esa papeleta

#### Scenario: Ronda abandonada
- **WHEN** el jugador responde 4 papeletas y cierra la página
- **THEN** quedan guardados los 4 registros de esa partida

#### Scenario: Respuesta del reto
- **WHEN** el jugador vota en el reto del día
- **THEN** el registro se guarda con modo `reto`
