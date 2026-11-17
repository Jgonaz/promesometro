// Une las preguntas de cada partido (data/candidatas/v2/*.json) en el archivo
// que usa el juego. Uso: node scripts/unir-frases.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SLUGS = ['frente-amplio', 'pp', 'psoe', 'vox'];
const frases = SLUGS.flatMap((s) => JSON.parse(readFileSync(`data/candidatas/v2/${s}.json`, 'utf8')));
writeFileSync('src/data/frases.json', `${JSON.stringify(frases, null, 2)}\n`);
console.log(`${frases.length} preguntas escritas en src/data/frases.json`);
