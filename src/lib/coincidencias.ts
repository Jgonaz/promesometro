// Une cada asunto de «¿Con quién coincides?» con las citas de frases.json, en
// el build. Las citas no se duplican: así verificar-frases.mjs las sigue
// cubriendo todas. Si un asunto no tiene a los cuatro partidos con cita, el
// build falla en vez de publicar un asunto cojo.
import asuntos from '../data/coincidencias.json';
import frases from '../data/frases.json';
import { PARTIDOS } from './partidos';

export type Postura = { partido: string; texto: string; cita: string; paginaPdf: number };
export type Asunto = { id: string; pregunta: string; posturas: Postura[] };

export function cargarAsuntos(): Asunto[] {
  return asuntos.map((a) => {
    const f = frases.find((x) => x.id === a.frase);
    if (!f) throw new Error(`coincidencias: «${a.id}» apunta a la frase inexistente «${a.frase}»`);
    const posturas = PARTIDOS.map(({ nombre }) => {
      const texto = (a.posturas as Record<string, string | undefined>)[nombre];
      const fuente =
        f.partido === nombre
          ? { texto: f.texto, paginaPdf: f.paginaPdf }
          : f.comparativa.find((c) => c.partido === nombre);
      if (!texto || !fuente?.texto || !Number.isInteger(fuente.paginaPdf)) {
        throw new Error(`coincidencias: «${a.id}» no tiene postura y cita de ${nombre}`);
      }
      return { partido: nombre, texto, cita: fuente.texto, paginaPdf: fuente.paginaPdf as number };
    });
    return { id: a.id, pregunta: a.pregunta, posturas };
  });
}
