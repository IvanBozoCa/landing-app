
# Sitio profesional — Iván Bozo Catalán

Portfolio desarrollado con React, TypeScript y Vite. Presenta experiencia profesional, proyectos destacados y casos de estudio con evidencia real del proceso de ingeniería.

## Vistas disponibles

- Home (perfil profesional): `/` — hero, forma de trabajo, trabajo seleccionado, sobre mí, fundador de Eunomi, experiencia, capacidades y contacto. Contenido en `src/app/HomePage.tsx`; enlaces, CV y foto en `src/app/profile.ts`.
- Servicios profesionales: `/servicios`
- Productos propios: `/productos`
- Contacto guiado: `/contacto`
- Caso de estudio de GCMS: `/proyectos/gcms`
- Caso de estudio de Eunomi Escolar: `/proyectos/eunomi`
- Demo preservada de Eunomi Escolar: `/proyectos/eunomi/demo`

Las direcciones anteriores basadas en `?page=` y `?project=` se conservan temporalmente por compatibilidad.

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

## Datos pendientes del perfil

`src/app/profile.ts` concentra los datos que no deben inventarse:

- `profileLinks.cv`: ruta del CV (por ejemplo `/cv/ivan-bozo-catalan.pdf` dentro de `public/`). Mientras sea `null`, la web muestra «CV disponible próximamente».
- `profilePhoto`: fotografía real (WebP 4:5, mínimo 800 × 1000 px en `public/profile/`). Mientras sea `null`, el espacio se oculta en móvil y queda reservado en escritorio.
- `profileLinks.linkedin`: confirmar que sea la URL pública vigente.

## SEO

- Cada ruta prerenderizada recibe title, description, canonical, Open Graph y Twitter desde `src/app/routeMetadata.ts`; `noIndex: true` la excluye del índice.
- JSON-LD (`src/seo/SiteStructuredData.tsx`): `Person` (Iván), `Organization` (Eunomi, enlazada por `@id`), `WebSite` y `ProfilePage` en la portada.
- La portada social se edita en `public/og-cover.svg` y se exporta a `public/og-cover.png` (1200 × 630).
