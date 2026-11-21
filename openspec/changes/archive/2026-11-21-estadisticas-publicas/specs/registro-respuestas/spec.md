## MODIFIED Requirements

### Requirement: Analíticas privadas

Los datos registrados SHALL consultarse en bruto solo de forma privada. El
sitio MUST NOT exponer filas individuales ni identificadores de partida; solo
puede publicar los agregados definidos en `estadisticas-publicas`, con su
calendario de activación.

#### Scenario: Consulta pública
- **WHEN** alguien visita el sitio o llama a sus endpoints
- **THEN** solo obtiene agregados permitidos por `estadisticas-publicas`, nunca filas sueltas
