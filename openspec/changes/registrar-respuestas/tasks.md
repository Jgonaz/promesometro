## 1. Infraestructura

- [ ] 1.1 Provisionar Neon en el proyecto de Vercel y comprobar que existe `DATABASE_URL`
- [ ] 1.2 Crear `db/esquema.sql` y `db/consultas.sql`, y aplicar el esquema

## 2. Servidor

- [ ] 2.1 Añadir `@astrojs/vercel` y `@neondatabase/serverless`; configurar el adaptador
- [ ] 2.2 Crear `src/pages/api/respuesta.ts` con validación, acierto en servidor y 204 sin `DATABASE_URL`

## 3. Cliente

- [ ] 3.1 Generar un id de partida en memoria por ronda y enviar cada respuesta con `keepalive`
- [ ] 3.2 Registrar si se abrió «En otras palabras» antes de votar

## 4. Validación y documentación

- [ ] 4.1 `pnpm build` sin errores y prueba local del endpoint (válida, inválida, sin base de datos)
- [ ] 4.2 Probar contra Neon que se guardan filas correctas
- [ ] 4.3 Actualizar `AGENTS.md` del proyecto (stack y analíticas)
