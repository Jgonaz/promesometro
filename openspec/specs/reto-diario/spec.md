# reto-diario Specification

## Purpose
TBD - created by archiving change mejoras-lanzamiento. Update Purpose after archive.
## Requirements
### Requirement: Reto del día

La portada SHALL ofrecer, además de la ronda normal, el reto del día: 5 frases
iguales para todos los jugadores durante un mismo día natural de
Europe/Madrid, elegidas de forma determinista a partir de la fecha, con al
menos una frase de cada partido y sin dos temas iguales seguidos cuando sea
posible. Cambia a las 00:00 hora peninsular.

#### Scenario: Dos personas el mismo día
- **WHEN** dos personas abren el reto el 24 de noviembre desde dispositivos distintos
- **THEN** ven las mismas 5 frases en el mismo orden

#### Scenario: Día siguiente
- **WHEN** alguien abre el reto el 25 de noviembre
- **THEN** ve un conjunto de frases distinto al del día anterior

### Requirement: Reto sin rastro

El reto MUST NOT guardar nada en el navegador; se puede repetir. Al terminarlo,
el escrutinio usa el mismo retrato y permite jugar una ronda normal.

#### Scenario: Repetir el reto
- **WHEN** el jugador termina el reto y vuelve a abrirlo
- **THEN** puede jugarlo de nuevo con las mismas frases

