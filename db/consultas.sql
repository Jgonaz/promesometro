-- Consultas de análisis. Uso privado: no publicar agregados de aciertos por
-- partido del 24 al 29 de noviembre (criterios editoriales del AGENTS.md).

-- 1. Volumen: respuestas y partidas por día.
SELECT date_trunc('day', creada) AS dia, count(*) AS respuestas, count(DISTINCT partida) AS partidas
FROM respuestas GROUP BY 1 ORDER BY 1;

-- 2. Matriz de confusión: partido real frente al elegido.
SELECT partido AS real, elegido, count(*) AS n,
       round(100.0 * count(*) / sum(count(*)) OVER (PARTITION BY partido), 1) AS pct
FROM respuestas
GROUP BY 1, 2 ORDER BY 1, 2;

-- 3. Frases más difíciles (mínimo 30 respuestas).
SELECT frase, count(*) AS n, round(100.0 * avg(acierto::int), 1) AS pct_acierto
FROM respuestas GROUP BY frase HAVING count(*) >= 30
ORDER BY pct_acierto ASC LIMIT 15;

-- 4. ¿Ayuda «En otras palabras»? Acierto con y sin abrirla.
SELECT explicacion, count(*) AS n, round(100.0 * avg(acierto::int), 1) AS pct_acierto
FROM respuestas GROUP BY explicacion;

-- 5. Abandono: hasta qué papeleta llega cada partida.
SELECT ultima, count(*) AS partidas
FROM (SELECT partida, max(posicion) AS ultima FROM respuestas GROUP BY partida) p
GROUP BY ultima ORDER BY ultima;
