# Promesómetro.es

¿Sabrías decir de qué partido es cada promesa? Un juego con medidas reales de
los programas electorales de las generales del 29 de noviembre de 2026.

## Desarrollo

```sh
pnpm install
pnpm dev      # servidor local
pnpm build    # compilación estática en dist/
```

## Fuentes

Los programas oficiales se listan en `data/programas/fuentes.json`. Para
regenerar las frases, descarga los PDF en `data/programas/` con los nombres
indicados en ese archivo, extrae su texto a `data/texto/` y comprueba la
selección con `node scripts/verificar-frases.mjs --final src/data/frases.json`.

## Créditos de imágenes

- Logotipos: propiedad de sus partidos; versiones de Wikimedia Commons (dominio público o CC0) y de la web oficial del Frente Amplio. Se usan solo para identificar a cada partido.
- Ilustraciones: generadas con IA para este proyecto.
