# Distribución y medición del portfolio

Este documento define cómo compartir el trabajo sin inventar resultados, clientes ni evidencia. El objetivo es aprender qué canales generan conversaciones útiles, no identificar personas ni reconstruir su navegación.

## Enlaces por origen

Usar una sola convención en enlaces públicos:

| Canal | Enlace |
| --- | --- |
| Tarjeta comercial | `https://ivanbozocatalan.com/hola?origen=tarjeta` |
| LinkedIn | `https://ivanbozocatalan.com/hola?origen=linkedin` |
| Recomendación directa | `https://ivanbozocatalan.com/hola?origen=referido` |
| GitHub | `https://ivanbozocatalan.com/hola?origen=github` |

El origen se conserva al pasar desde `/hola` hacia `/contacto` y se incorpora al mensaje que la persona puede revisar antes de enviar. Esa es la referencia principal para saber qué canal generó una conversación.

Web Analytics se utiliza para observar páginas visitadas, dispositivos y referentes de forma agregada. Antes de medir una visita, el sitio elimina todos los parámetros salvo un origen aprobado; no se envían nombres, datos del formulario ni contenido de las consultas.

## Microhistorias reutilizables

### GCMS

**Problema:** administrar estaciones, clientes y sesiones desde herramientas separadas dificulta ver la operación diaria.

**Trabajo realizado:** diseñé e implementé un sistema centralizado con reglas para sesiones registradas y de invitados, permisos y persistencia.

**Evidencia disponible:** caso de estudio, arquitectura y pruebas de reglas de negocio, base de datos y concurrencia.

**Aplicación comercial:** si una operación depende de registros dispersos o tareas manuales, podemos revisar qué conviene centralizar primero.

Evidencia: `https://ivanbozocatalan.com/proyectos/gcms?origin=linkedin`

Consulta: `https://ivanbozocatalan.com/hola?origen=linkedin`

### Eunomi Escolar

**Problema:** las rutas dependían de conocimiento tácito y la coordinación manual dificultaba delegar y mantener informadas a las familias.

**Trabajo realizado:** desarrollé una plataforma por roles con rutas, asistencia y seguimiento para administración, conductores y apoderados.

**Evidencia disponible:** caso de estudio y demo navegable; la disponibilidad comercial y el alcance definitivo continúan en validación.

**Aplicación comercial:** procesos coordinados por mensajes, memoria o planillas pueden transformarse en un flujo compartido y comprobable.

Evidencia: `https://ivanbozocatalan.com/proyectos/eunomi?origin=linkedin`

Consulta: `https://ivanbozocatalan.com/hola?origen=linkedin`

### CaryCar

**Problema abordado:** presentar con claridad un servicio local de reparto de agua potable y facilitar una futura consulta.

**Trabajo realizado:** landing responsive con propuesta de valor, servicios, cobertura, proceso y llamados a la acción.

**Límite explícito:** es una propuesta visual; el contacto, las fotografías y otros datos comerciales siguen pendientes de confirmación.

**Aplicación comercial:** una página puede ayudar a que una persona entienda qué ofrece un negocio, dónde atiende y cuál es el siguiente paso.

Enlace público: `https://ivanbozocatalan.com/carycar`

## Ritmo semanal inicial

1. Publicar una microhistoria centrada en un problema real y una evidencia disponible.
2. Compartir el enlace correspondiente al canal, sin variantes innecesarias.
3. Responder consultas usando el formulario del portfolio para conservar el origen.
4. Revisar una vez por semana visitas por página, referentes y consultas recibidas.
5. Ajustar contenido solamente cuando existan dudas o patrones reales; no cambiar títulos o textos para perseguir métricas aisladas.

## Registro mínimo de aprendizaje

Registrar únicamente información comercial agregada:

| Campo | Ejemplo permitido |
| --- | --- |
| Semana | `2026-W38` |
| Origen | `linkedin` |
| Página o proyecto | `gcms` |
| Consultas recibidas | `2` |
| Tema general | `ordenar reservas y tiempos` |
| Siguiente aprendizaje | `explicar mejor cómo comienza el diagnóstico` |

No registrar nombres, teléfonos, correos, presupuestos individuales ni el contenido completo de conversaciones en este seguimiento.

## Pendiente manual

Web Analytics debe estar habilitado en el panel del proyecto `landing-app` de Vercel. Después del siguiente despliegue se debe comprobar que `/_vercel/insights/*` carga correctamente y que las visitas aparecen de forma agregada en el panel.
