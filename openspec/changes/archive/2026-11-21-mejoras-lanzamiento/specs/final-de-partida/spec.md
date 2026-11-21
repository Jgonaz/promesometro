## ADDED Requirements

### Requirement: Retrato de la partida

Al terminar una partida, el escrutinio SHALL mostrar, calculado solo con las
respuestas de esa partida: la confusión más repetida (partido elegido y
partido real, con el número de medidas) y el partido cuyas medidas más se han
fallado. Con todas acertadas MUST mostrar que no hubo confusiones. Los empates
se resuelven por el orden alfabético de los partidos.

#### Scenario: Partida con fallos
- **WHEN** el jugador atribuye al PP dos medidas de Vox y falla además una del PSOE
- **THEN** el retrato dice que dio al PP 2 medidas de Vox y que Vox fue el partido que más se le resistió

#### Scenario: Pleno
- **WHEN** el jugador acierta todas las medidas
- **THEN** el retrato indica que no confundió a ningún partido

### Requirement: Resultado compartible neutro

El texto para compartir MUST representar cada papeleta con `●` (acierto) u
`○` (fallo), sin emojis de colores, e incluir aciertos sobre el total, la
confusión principal si la hay y el enlace. En el reto diario MUST incluir la
fecha del reto.

#### Scenario: Compartir una ronda
- **WHEN** el jugador comparte un 7/10
- **THEN** el texto contiene «7/10», diez símbolos `●`/`○` en el orden jugado y el enlace

#### Scenario: Compartir el reto
- **WHEN** el jugador comparte el reto del 24 de noviembre
- **THEN** el texto indica que es el reto del 24/11 y lleva cinco símbolos
