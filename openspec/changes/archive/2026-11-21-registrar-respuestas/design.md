## Context

Astro 7 estático desplegado en Vercel (proyecto `promesometro` ya vinculado).
Toda la lógica del juego está en el `<script>` de `src/pages/index.astro`; las
frases se leen de `src/data/frases.json` en el build. Ver proposal.md (Why).

## Goals / Non-Goals

**Goals:**
- Añadir un único endpoint de escritura sin perder el prerender del resto.
- Que el envío no afecte al rendimiento ni a la experiencia del juego.

**Non-Goals:**
- Panel de analíticas o páginas de estadísticas (se consulta con SQL).
- Seguir usuarios entre rondas o sesiones.
- Limitación de frecuencia por cliente (exigiría guardar IPs o estado).

## Decisions

**Neon con `@neondatabase/serverless` (HTTP).** Postgres permite cruces libres
(matriz de confusión, abandono por posición) que un contador en Redis o los
eventos de una herramienta de analítica no dan. El driver HTTP evita gestionar
conexiones en funciones efímeras. Alternativas: Upstash Redis (solo
contadores), Vercel Web Analytics (eventos personalizados en plan Pro y sin
cruces), Umami (otro servicio que mantener).

**Adaptador `@astrojs/vercel` con salida estática y `prerender = false` solo
en el endpoint.** Las páginas siguen siendo HTML estático servido desde la
CDN; solo `/api/respuesta` es función.

**Envío con `fetch(..., { keepalive: true })` sin `await`.** `keepalive`
garantiza la entrega aunque se cierre la página justo después de votar, y no
bloquea la revelación. Se descarta `sendBeacon` porque envía `text/plain`
y complica validar el tipo de contenido; `keepalive` cubre el mismo caso.

**El servidor valida contra `frases.json` importado en build.** Así conoce el
autor real (acierto calculado en servidor) y rechaza ids inventados sin
consultar la base de datos.

**Esquema:** una tabla `respuestas` (`id bigserial`, `creada timestamptz
default now()`, `partida uuid`, `frase text`, `partido text` (autor real,
para no depender de que los ids de `frases.json` no cambien), `elegido text`,
`acierto boolean`, `posicion smallint`, `explicacion boolean`). Índices por `frase` y
`creada`. Se crea con `db/esquema.sql`, ejecutado una vez. Consultas útiles en
`db/consultas.sql`.

**Sin `DATABASE_URL` el endpoint responde 204 sin guardar.** Permite
desarrollar en local y en previews sin base de datos.

## Risks / Trade-offs

- [Respuestas falsas por scripts] → validación estricta y tope de tamaño; si
  aparece abuso, reglas del firewall de Vercel. Los datos son orientativos, no
  un sondeo.
- [Los datos parecen un sondeo si se publican] → analíticas privadas; la veda
  del 24 al 29N sigue vigente para cualquier publicación futura.
- [Coste o cuotas] → una fila pequeña por voto; el plan gratuito de Neon basta
  para el volumen esperado. Si se agotara, el registro falla en silencio.
- [Arranque en frío de la función] → no afecta al jugador porque el envío es
  asíncrono.

## Migration Plan

1. Provisionar Neon desde el Marketplace en el proyecto de Vercel.
2. Ejecutar `db/esquema.sql` contra la base de datos.
3. Desplegar. Rollback: revertir el commit; la base de datos puede quedarse.
