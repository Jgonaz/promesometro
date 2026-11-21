// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // URL pública: hace absolutas las URL de la imagen para redes (og:image).
  // Cámbiala si se configura un dominio propio.
  site: 'https://promesometro.es',
  // Las páginas siguen prerenderizadas; el adaptador solo hace falta para el
  // endpoint de registro de respuestas (src/pages/api/respuesta.ts).
  adapter: vercel(),
  // Secreto de servidor leído en ejecución (no se incrusta en el build).
  // Opcional: sin él, el endpoint acepta los votos sin guardarlos.
  env: {
    schema: {
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
