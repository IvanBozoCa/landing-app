# Auditoría UX — Eunomi Escolar

Fecha: 13 de septiembre de 2026. Alcance: página comercial desplegada, código fuente, navegación móvil a 390 × 844 y política vinculada. Revisión heurística y mediciones del navegador; no es una prueba con clientes ni certificación de accesibilidad. No se han cambiado la página ni sus funciones durante esta auditoría.

## Diagnóstico

La identidad visual es coherente con la app. El mensaje expresa una aspiración, pero tarda en explicar que el producto es una aplicación y qué problemas concretos resuelve. La prioridad es aclarar el contenido y reducir el esfuerzo para entenderlo y contactar; la tecnología debe apoyar esas tareas.

## Hallazgos priorizados

| Prioridad | Evidencia | Impacto | Acción propuesta |
|---|---|---|---|
| Alta | El primer bloque no dice explícitamente que Eunomi es una app. La distinción respecto a un servicio de transporte está dentro de una FAQ cerrada. | El visitante puede confundir software con contratación de un furgón. | Añadir una definición visible en el primer bloque y aclarar que acompaña al transportista existente. |
| Alta | Titulares como «Tres miradas» y «Más conexión» no identifican problemas concretos. | Una persona poco tecnológica debe interpretar la propuesta. | Usar ejemplos: preguntar si ya llegó, avisar una ausencia, organizar las paradas y confirmar entregas. Expresarlos como propuesta en desarrollo. |
| Alta | Los tres perfiles tienen igual peso; TE-37 identifica al transportista como cliente y al apoderado como invitado. | No queda claro quién incorpora el servicio. | Explicar primero el beneficio para quien gestiona el transporte y después cómo participan conductores y familias. |
| Alta | Landing: iv.bozo.calatan@gmail.com. Política: iv.bozo.catalan@gmail.com. | Una letra diferente puede impedir el contacto. | Confirmar el correo comercial y si el de privacidad debe ser distinto. No corregir por inferencia. |
| Media | A 390 px el menú tiene display:none sin alternativa. | Se obliga a recorrer la página o usar únicamente el CTA. | Menú móvil accesible con enlaces a beneficios, ejemplo, preguntas y contacto; cierre con Escape y foco consistente. |
| Media | Página móvil de 6162 px; contacto a aproximadamente 5475 px. Existen anclas al contacto desde el inicio. | Mucho recorrido de lectura, aunque el contacto sí tiene acceso rápido. | Reducir repetición y altura del teléfono; mostrar un CTA directo y explícito en el primer bloque. |
| Media | Etiquetas de 8–10 px y pies de tarjetas de 11 px. | Dificulta la lectura, especialmente en móvil y con baja visión. | Aumentar notas relevantes a 13–14 px; cuerpo de lectura de 16–18 px como objetivos de diseño, no como criterio normativo. Verificar zoom, contraste y teclado. |
| Media | Los pies de tarjetas tienen flecha ↗ pero son spans sin acción. | Parecen enlaces que no responden. | Quitar las flechas o convertirlos en enlaces con destino claro. |
| Media | El teléfono es una ilustración estática con texto pequeño. | Aporta ambientación, pero explica poco el uso. | Ejemplo guiado opcional con estados ficticios y controles manuales; aclaración visible de simulación. |
| Media | La política usa otro estilo visual y su enlace de retorno lleva a la demo raíz. | El visitante sale del recorrido comercial y pierde contexto. | Alinear presentación y retorno a la landing; revisar aparte el contenido de la política cuando se defina el producto. |
| Media | Logo PNG de 927611 bytes y 1254 px, mostrado a 28–44 px. | Descarga sobredimensionada para un elemento pequeño. | Exportar una versión web pequeña conservando el original. Medir el peso y apariencia tras optimizar. |
| Media | La vista previa requiere enlace compartido temporal. | No es una URL pública estable para futuros clientes. | Verificar sin sesión la publicación final y todos sus recursos; el enlace temporal sirve sólo para revisión. |

## Estructura de contenido propuesta

1. Qué es: aplicación para organizar el transporte escolar y mantener informadas a las familias. Estado en desarrollo visible.
2. Qué problema busca resolver: mensajes dispersos, incertidumbre sobre recogidas/entregas y coordinación de rutas/asistencia.
3. Para quién: transportista como cliente, conductor como operador y apoderado como invitado.
4. Ejemplo de un día: preparar recorrido, registrar recogida, consultar estado, registrar entrega. Escenario ilustrativo y sin datos reales.
5. Confianza: lenguaje sencillo sobre información por familia y organización, expresado como trabajo en curso.
6. Lanzamiento: cómo será el contacto y la incorporación acompañada; sin precios ni fechas inventadas.
7. Preguntas prácticas y contacto directo.

Texto inicial sugerido: «Organiza tu transporte escolar. Mantén informadas a las familias». Bajada: «Eunomi Escolar es una app en desarrollo que busca reunir rutas, asistencia y avisos de recogida y entrega en un mismo lugar. Pensada para transportistas, conductores y apoderados». CTA: «Consultar por WhatsApp». Secundario: «Ver un ejemplo». Aclaración: «Una app para acompañar tu servicio de transporte escolar».

## Interacciones con valor real

- Ejemplo guiado: botones Anterior, Siguiente y Reiniciar; estado anunciado de forma accesible; sin reproducción automática ni mapa real. Contenido básico legible sin activar la interacción.
- Selector de perfil: personaliza ejemplos y el mensaje sugerido de contacto. No debe ocultar información indispensable ni bloquear la lectura general.
- Contacto asistido: elegir perfil y abrir WhatsApp con texto editable. El usuario envía el mensaje. Mantener correo visible y opción de copiarlo con confirmación y alternativa si falla el portapapeles.
- Menú móvil: navegación por secciones con botones semánticos y estados accesibles.
- Conservar FAQ nativa: ya funciona sin JavaScript; un buscador no se justifica para seis preguntas.

## Propuesta técnica

El repositorio ya tiene React 19, TypeScript 5.9 y Vite; la landing actual es HTML/CSS en public y no utiliza React. Recomiendo mantener este stack y compilar una entrada dedicada a la landing, con TypeScript para interacciones pequeñas. React puede montar sólo el ejemplo guiado y el selector si la complejidad lo justifica. El texto comercial y contacto deben estar disponibles sin depender de JavaScript.

No es necesario migrar a Next.js ni incorporar una base de datos para esta fase. No se justifica un chatbot, login, pagos, carrusel automático ni mapa en vivo para explicar un producto todavía en desarrollo.

Separar contenido comercial, datos del ejemplo, constantes de contacto, estilos/tokens e interacciones. Mantener /eunomi-escolar y /eunomi-escolar/privacidad independientes de la demo raíz. Configurar la entrada con la API correspondiente a la versión de Vite instalada; no copiar sin revisión configuraciones de versiones posteriores.

Referencias oficiales: https://react.dev/learn/add-react-to-an-existing-project y https://vite.dev/guide/build.html#multi-page-app.

## Validación de la siguiente versión

- En una prueba breve, una persona nueva puede explicar qué es, a quién sirve, qué resuelve, si ya está disponible y cómo contactar. Validar con usuarios reales; esta auditoría no demuestra comprensión real.
- Probar a 320, 390, 768 y 1440 px, con zoom y navegación por teclado. Comprobar contraste antes de afirmar conformidad de accesibilidad.
- CTA, correo, menú, ejemplo y FAQ operables. No enviar mensajes durante las pruebas.
- Mantener contenido esencial sin JavaScript y respetar reducción de movimiento.
- Revisar rendimiento con mediciones de laboratorio; no se han medido Core Web Vitals de usuarios reales.
- Comprobar la URL final sin sesión, CSS/imágenes, política y ausencia de errores de consola.

Orden de implementación: claridad y contacto → navegación/legibilidad móvil → ejemplo guiado y perfiles → rendimiento y publicación verificada.
