---
target: index del Promesómetro
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-11-16T22-17-09Z
slug: src-pages-index-astro
---
# Crítica: src/pages/index.astro — 29/40 (Bien)

Heurísticas: 1·3 2·4 3·2 4·3 5·3 6·4 7·2 8·3 9·2 10·3.
Especificidad: alta (metáfora papeleta→sobre→escrutinio). Genérico: antetítulo en versalitas, botón píldora con sombra desplazada, revelación con borde izquierdo, escrutinio tipo informe.

## Prioridades
- [P1] Logos con mismo alto pero distinto peso óptico (PP 62×42 vs PSOE 119×42): normalizar por área (ancho/alto del viewBox), recortar viewBox.
- [P1] Escrutinio entierra compartir tras 10 citas: acciones arriba, resumen en <details>, fila de 10 sobres, sello final con título, feedback «¡Copiado!» en el botón.
- [P2] Sello tapa tema y primera línea: estamparlo en el borde inferior, opacidad 1.
- [P2] Contraste: antetítulo 4,21:1, fallo en sobre 4,00:1, progreso vacío 1,37:1; sobres apagados grises en oscuro → grayscale solo en el logo.
- [P2] Cabecera apretada en escritorio, antetítulo redundante con sello 29·N, escala de 14 tamaños → consolidar; pie a 99 caracteres por línea → 68ch; textos funcionales <13 px.
- [P2] Foco cae en BODY tras «Siguiente»; sin atajos 1-4/Intro; sin scroll-margin.

## Detector
CLI: side-tab (.revelacion), bounce-easing (.sello), overused-font (Fraunces, brief fijado → se mantiene). Navegador: low-contrast + all-caps + eyebrow (antetítulo), thin-border-wide-shadow (.papeleta), line-length (pie), cream-palette (brief).

## Menores
Recorte del resumen a mitad de palabra; «se parecen más de lo que parece»; verde de acierto fuera de paleta y coincide con Vox; .boton-secundario sin hover; «Ojo:» pareja merece más peso; «0 aciertos» al empezar; aria-label por punto de progreso; CLS 0,034 por font swap.
