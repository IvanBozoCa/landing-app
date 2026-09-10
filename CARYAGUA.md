# Demo Caryagua

Ruta pública: `/caryagua/`. Prototipo estático, con `noindex, nofollow`, datos de contacto pendientes e imagen referencial identificada.

`public/caryagua/` contiene el build del proyecto independiente Caryagua (base de origen: commit `0c873aa`). Se generó mediante `node node_modules/vite/bin/vite.js build --base=/caryagua/` en `B:\landing aguapotable`, y se copió el contenido de `dist/` a esta carpeta. Para futuras actualizaciones, editar y validar el proyecto fuente y reemplazar solo esta salida, conservando la base `/caryagua/`.

La integración parte de `main` en `ef6e92f`, que contiene la política de privacidad de Eunomi Escolar. No cambia la portada existente ni `public/eunomi-escolar/privacidad/index.html`. No incorpora la rama pendiente `feature/portfolio-foundation`.

Validación: lint y build del portfolio correctos. La landing se valida también en su repositorio fuente. La instalación del portfolio informa 15 vulnerabilidades en dependencias ya presentes; no se modificó el lockfile ni se amplió esta tarea a una actualización de dependencias.
