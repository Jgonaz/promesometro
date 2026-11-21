# banco-de-frases Specification

## Purpose
TBD - created by archiving change ampliar-frases. Update Purpose after archive.
## Requirements
### Requirement: Composición del banco de frases

El banco SHALL tener 30 frases por partido (PSOE, PP, Vox y Frente Amplio),
15 de tipo «deducible» y 15 de tipo «sorpresa». Cada frase MUST ser una cita
literal (recortable con «[…]») de la página indicada del programa oficial e ir
con «En otras palabras» y la comparativa de los otros tres partidos. El
verificador con `--final` MUST fallar si no se cumple el reparto.

#### Scenario: Reparto incompleto
- **WHEN** un partido tiene 14 frases «sorpresa»
- **THEN** `verificar-frases.mjs --final` lo indica como error y termina con código 1

#### Scenario: Ids existentes
- **WHEN** se añaden las frases nuevas
- **THEN** las 80 anteriores conservan su id y su contenido

### Requirement: Valoración editorial de cada frase

Cada frase SHALL tener `calidad` con valor 1, 2 o 3 y `etiquetas`, una lista
(posiblemente vacía) sin repetidos con valores de `ambigua`, `polemica` y
`titular`. El juego MUST NOT usar ni mostrar estos campos.

#### Scenario: Calidad inválida
- **WHEN** una frase tiene `calidad: 4` o la etiqueta `facil`
- **THEN** el verificador lo indica como error

#### Scenario: El juego no cambia
- **WHEN** alguien juega una ronda o el reto del día
- **THEN** la selección no depende de `calidad` ni de `etiquetas`

