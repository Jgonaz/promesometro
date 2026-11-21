## Context

Ya existen la tabla `respuestas` en Neon y el endpoint de escritura
`/api/respuesta` (ver spec `registro-respuestas`). Las páginas son
prerenderizadas y `DATABASE_URL` se lee con `astro:env`.

## Goals / Non-Goals

**Goals:**
- Un único endpoint de lectura para portada, juego y resultados.
- Páginas prerenderizadas: los datos se piden desde el cliente.

**Non-Goals:**
- Gráficos interactivos o librerías de visualización.
- Datos en tiempo real (basta con 5 minutos de retraso).

## Decisions

**`GET /api/estadisticas` con caché en la CDN.** Cabecera `Cache-Control:
public, s-maxage=300, stale-while-revalidate=60`. Vercel la cachea en su CDN,
así que Neon recibe como mucho unas pocas consultas cada 5 minutos aunque haya
miles de visitas. En el cambio de fecha, una respuesta cacheada puede retrasar
la activación unos minutos, nunca adelantarla.

**Fecha de activación en el servidor** (`2026-11-30T00:00:00+01:00`, en una
constante). Antes de la fecha la respuesta solo lleva `partidas`; después,
también `frases` (id → n, pct, solo si n ≥ 30), `matriz` (real → elegido →
pct), `explicacion` (pct con y sin abrirla). Alternativa descartada: ocultar
en el cliente, porque el endpoint es público.

**Páginas prerenderizadas que piden los datos desde el cliente.** `/resultados`
importa `frases.json` en el build (textos y partidos) y combina con los
agregados. Evita convertir páginas en funciones y mantiene la portada en la
CDN. Si la petición falla, las secciones se ocultan sin romper nada.

**Consultas agregadas en SQL** (`count(DISTINCT partida)`, `GROUP BY frase`,
`GROUP BY partido, elegido`, `GROUP BY explicacion`), en paralelo. Con el
volumen esperado no hace falta materializarlas.

**Umbrales:** contador visible desde 100 partidas (evita cifras ridículas el
día del lanzamiento); porcentajes por frase desde 30 respuestas.

## Risks / Trade-offs

- [Se confunda con un sondeo] → nada de aciertos durante la veda, y la página
  de resultados aclara que son jugadores de un juego, no una muestra
  representativa.
- [Votos falsos inflan los datos] → igual que en el registro: validación y,
  si hace falta, firewall de Vercel.
- [Error en la fecha por zona horaria] → constante con desfase explícito
  (+01:00, horario de invierno en la península).

## Migration Plan

Desplegar con el merge. No hay cambios de esquema. Rollback: revertir el commit.
