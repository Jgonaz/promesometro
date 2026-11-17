// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // URL pública: hace absolutas las URL de la imagen para redes (og:image).
  // Cámbiala si se configura un dominio propio.
  site: 'https://promesometro.es',
  // Las páginas siguen prerenderizadas; el adaptador solo hace falta para el
  // endpoint de registro de respuestas (src/pages/api/respuesta.ts).
  adapter: vercel(),
});
