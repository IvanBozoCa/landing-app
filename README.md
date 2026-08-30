
# Portfolio profesional — Iván Bozo Catalán

Portfolio desarrollado con React, TypeScript y Vite. Presenta experiencia profesional, proyectos destacados y casos de estudio con evidencia real del proceso de ingeniería.

## Vistas disponibles

- Home: `/`
- Caso de estudio de GCMS: `/?project=gcms`
- Demo preservada de Transporte Escolar: `/?project=school-transport`

La navegación por query es temporal. No se utiliza React Router porque la estrategia definitiva de rutas se decidirá junto con el hosting.

## Desarrollo local

```bash
npm ci
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173/`.

## Validación

```bash
npm run lint
npm run build
git diff --check
```

## Configuración de Transporte Escolar

La demo admite estas variables de entorno:

- `VITE_URL_CONDUCTOR` o `VITE_CONDUCTOR_URL`
- `VITE_URL_APODERADO` o `VITE_APODERADO_URL`
- `VITE_URL_ADMIN` o `VITE_ADMIN_URL`
- `VITE_DASHBOARD_URL`

También conserva overrides temporales mediante query:

- `conductor`
- `apoderado`
- `admin`
- `swagger`

Las URLs, credenciales de demostración, iframes y comportamiento de Transporte Escolar se mantienen sin cambios respecto de la landing original.

## Estructura principal

```text
src/
├── app/                         # Home y sistema visual del portfolio
└── projects/
    ├── gaming-center/           # Caso de estudio de GCMS
    └── school-transport/        # Landing y demo preservada
```

## Estado

El portfolio continúa en desarrollo. Las capturas definitivas de GCMS, la adaptación final para móviles, el routing y la publicación se abordarán cuando el producto y la estrategia de hosting estén preparados.
