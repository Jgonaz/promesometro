-- Respuestas anónimas del juego. Se ejecuta una vez contra la base de datos de Neon:
--   psql "$DATABASE_URL" -f db/esquema.sql
-- Sin datos personales: ni IP, ni agente de usuario, ni identificadores persistentes.
CREATE TABLE IF NOT EXISTS respuestas (
  id          bigserial PRIMARY KEY,
  creada      timestamptz NOT NULL DEFAULT now(),
  partida     uuid        NOT NULL,          -- aleatorio y distinto en cada ronda
  frase       text        NOT NULL,          -- id de src/data/frases.json
  partido     text        NOT NULL,          -- autor real de la frase
  elegido     text        NOT NULL,          -- partido que votó el jugador
  acierto     boolean     NOT NULL,          -- calculado en el servidor
  posicion    smallint    NOT NULL CHECK (posicion BETWEEN 1 AND 10),
  explicacion boolean     NOT NULL           -- abrió «En otras palabras» antes de votar
);

CREATE INDEX IF NOT EXISTS respuestas_frase_idx ON respuestas (frase);
CREATE INDEX IF NOT EXISTS respuestas_creada_idx ON respuestas (creada);
