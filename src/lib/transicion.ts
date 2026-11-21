// Transiciones entre pantallas de una misma página con la View Transitions API.
// `pantalla` cambia de pantalla (portada, juego, final) con un fundido que sube;
// `paso` avanza dentro de la misma pantalla con un fundido cruzado.
// Sin soporte o con movimiento reducido, el cambio se aplica al instante.
export type TipoTransicion = 'pantalla' | 'paso';

// El navegador aplica el cambio en el siguiente fotograma: mientras tanto se
// ignoran otros, para que un doble clic no salte una papeleta o un asunto.
let pendiente = false;

export function transicion(actualizar: () => void, tipo: TipoTransicion = 'pantalla') {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    actualizar();
    return;
  }
  if (pendiente) return;
  pendiente = true;
  const aplicar = () => {
    pendiente = false;
    actualizar();
  };
  try {
    // Los tipos permiten que el CSS distinga la animación de cada caso.
    document.startViewTransition({ update: aplicar, types: [tipo] });
  } catch {
    // Navegadores con la API pero sin tipos: solo aceptan la función.
    document.startViewTransition(aplicar);
  }
}
