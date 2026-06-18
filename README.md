 # MiniBlog API

API REST en **Node.js + Express + PostgreSQL** para gestionar **Authors**, **Posts** y (extra credit) **Comments**.

- Arquitectura por capas: **Routes / Middlewares / Services / DB**.
- Consultas parametrizadas con `pg`.
- Manejo centralizado de errores (incluye mapeo `PostgreSQL 23505 → 409`).
- Documentación formal: **OpenAPI 3.0 (Swagger)**.
- Suite de pruebas con **Jest + Supertest**.

---

## Tabla de contenidos

1. [Descripción del proyecto y propósito](#descripción-del-proyecto-y-propósito)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos](#requisitos)
5. [Instalación local (paso a paso)](#instalación-local-paso-a-paso)
6. [Configuración de base de datos (scripts SQL)](#configuración-de-base-de-datos-scripts-sql)
7. [Variables de entorno](#variables-de-entorno)
8. [Ejecutar la API local](#ejecutar-la-api-local)
9. [Tests (Jest + Supertest)](#tests-jest--supertest)
10. [Documentación OpenAPI / Swagger](#documentación-openapi--swagger)
11. [Despliegue en Railway](#despliegue-en-railway)
12. [Registro de uso de AI (Bitácora)](#registro-de-uso-de-ai-bitácora)

---

## Descripción del proyecto y propósito

MiniBlog API es un backend REST para un sistema de contenidos. Permite:

- **Authors**: CRUD de autores con validación de payload y constraint de unicidad para `email`.
- **Posts**: CRUD de posts referenciando un `author_id`.
- **Comments (extra credit)**: creación y listado de comentarios asociados a un `post_id`.

Propósito principal:

- Mostrar un backend robusto, mantenible y consistente.
- Cumplir criterios típicos de evaluaciones finales: capas separadas, pruebas de integración, documentación OpenAPI y buenas prácticas con PostgreSQL.

---

## Tecnologías utilizadas

| Categoría | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| DB | PostgreSQL |
| Driver | `pg` (Pool de conexiones) |
| Validaciones | Middlewares propios |
| Tests | Jest + Supertest |
| Especificación | OpenAPI 3.0 (archivo `docs/openapi.yaml`) |

---

## Estructura del proyecto

```text
miniblog-backend
├── database/
│   ├── setup.sql          # Crea tablas
│   └── seed.sql           # Datos semilla
├── docs/
│   └── openapi.yaml       # Swagger/OpenAPI
├── src/
│   ├── app.js             # Montaje de rutas + middlewares
│   ├── server.js          # Arranque del servidor
│   ├── config/
│   │   └── db.js          # pg Pool (con variables de entorno)
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── authors.js
│   │   ├── posts.js
│   │   └── comments.js
│   └── services/
│       ├── authorService.js
│       ├── postService.js
│       └── commentService.js
└── tests/
    ├── authors.test.js
    ├── posts.test.js
    └── comments.test.js
```

---

## Requisitos

- Node.js (compatible con `node` moderno)
- PostgreSQL local (para correr la versión con integración real)
- Un cliente SQL (opcional): `psql`

---

## Instalación local (paso a paso)

> Objetivo: dejar el proyecto corriendo localmente contra tu PostgreSQL.

### 1) Instalar dependencias

```bash
npm install
```

### 2) Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto. Usa `.env.example` si existe, o usa el siguiente patrón.

> Si tu proyecto no trae `.env.example`, igualmente el backend usa `dotenv` y estas variables son necesarias.

### 3) Crear la base de datos y el esquema

Asegúrate de tener PostgreSQL corriendo y de tener una base de datos (ej: `miniblog`).

Ejecuta:

```bash
psql -U <usuario> -d <tu_base_de_datos> -f database/setup.sql
```

### 4) Insertar semilla (opcional)

```bash
psql -U <usuario> -d <tu_base_de_datos> -f database/seed.sql
```

> Los scripts de setup/seed están separados para facilitar evaluación y despliegues.

---

## Configuración de base de datos (scripts SQL)

- `database/setup.sql`: define tablas `authors`, `posts` y `comments` (con constraints y claves foráneas).
- `database/seed.sql`: inserta datos iniciales (idealmente de forma idempotente).

---

## Variables de entorno

El pool de conexiones en `src/config/db.js` prioriza variables tipo **Railway** y cae a **PG*** si están.

Ejemplo de `.env`:

```env
PORT=3000
NODE_ENV=development

# Railway-style (preferido)
DB_HOST=...
DB_PORT=5432
DB_NAME=...
DB_USER=...
DB_PASSWORD=...

# o fallbacks PG*
PGHOST=localhost
PGPORT=5432
PGDATABASE=miniblog
PGUSER=postgres
PGPASSWORD=tu_password

# Pool tuning (opcional)
PG_POOL_MAX=10
PG_IDLE_TIMEOUT_MS=30000
PG_CONN_TIMEOUT_MS=15000
```

---

## Ejecutar la API local

### Producción / normal

```bash
npm start
```

### Desarrollo

Docs (Swagger UI): http://localhost:3000/api-docs/




> Requiere `nodemon` instalado.


```bash
npm run dev
```

Una vez levantado, los endpoints principales quedan bajo:

- `/api/authors`
- `/api/posts`
- `/api/comments`

---

## Tests (Jest + Supertest)

La suite valida el comportamiento mediante HTTP requests reales y contra PostgreSQL.

Ejecuta:

```bash
:http://localhost:3000/api-docs/npm test
```

Si tienes problemas intermitentes por conexiones, asegúrate de:

- Tener PostgreSQL accesible.
- Que tu `.env` apunte a la DB correcta.
- Que los scripts `setup.sql` / `seed.sql` se ejecutaron antes.

---

## Documentación OpenAPI / Swagger

La especificación está en:

- `docs/openapi.yaml`

### Cómo visualizarla

1. Abre el archivo `docs/openapi.yaml`.
2. Pégalo en: https://editor.swagger.io/

> Alternativa (si tu proyecto expone una ruta Swagger/Docs en runtime): revisa el README o rutas disponibles. En este repo la especificación está en el archivo.

---

## Despliegue en Railway

### URLs de ejemplo (según tu entrega)

- **API pública**: https://miniblog-backend-production-7a64.up.railway.app
- **DB (Postgres)**: postgres-production-c8a9a.up.railway.app

**Endpoints de producción (API pública)**

- https://miniblog-backend-production-7a64.up.railway.app/api/authors
- https://miniblog-backend-production-7a64.up.railway.app/api/posts
- https://miniblog-backend-production-7a64.up.railway.app/api/comments/post/1

(Usá un `postId` existente si `/post/1` no tiene datos.)


### Variables de entorno recomendadas en Railway

En Railway agrega variables como:

- `DB_HOST` → host de tu Postgres en Railway
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `PORT` (si aplica)


### URLs internas y públicas

- **API (public)**: https://miniblog-backend-production-7a64.up.railway.app
- **Authors**: https://miniblog-backend-production-7a64.up.railway.app/authors
- **Posts**: https://miniblog-backend-production-7a64.up.railway.app/posts
- **Comments**: https://miniblog-backend-production-7a64.up.railway.app/comments

> Nota: En esta app los endpoints están montados bajo `/api/...` en tiempo de ejecución. Por eso, si al probar en Railway no coincide, intenta también:
>
> - `/api/authors`
> - `/api/posts`
> - `/api/comments`

- La base de datos usa la URL interna de Postgres provista por Railway.

### Guía rápida de deploy en Railway

1. Crea un proyecto en Railway y vincula tu repositorio GitHub.
2. Agrega un servicio **Postgres** (si aún no existe).
3. Define las variables de entorno en Railway (Settings → Variables):
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `PORT` (si aplica)
4. Asegúrate de que Railway ejecute `npm run start`.
5. (Opcional) Ejecuta los scripts SQL en el esquema de la DB en el mismo entorno.

Si usas SSL con Railway Postgres, el backend ya configura `ssl.rejectUnauthorized=false` en `src/config/db.js`.


---

## Registro de uso de AI (Bitácora)

Registro técnico de decisiones tomadas durante el desarrollo usando asistencia por IA. (Transparencia para evaluación.)


### Caso A — Conversión de errores PostgreSQL `23505` a HTTP `409`

**Problema**: al violar una restricción de unicidad en PostgreSQL (código `23505`), la API respondía un **500**.

**Solución**: se implementó en `src/middlewares/errorHandler.js` un mapeo explícito:

- Si `err.code === '23505'` ⇒ `res.status(409).json({ error: { message: 'Email already exists' } })`

Resultado: la API devuelve el conflicto esperado en `PUT/POST /authors` cuando el email ya existe.

### Caso B — Diagnóstico y validación de conectividad a PostgreSQL

Para aislar fallas de pruebas, se validó la conexión con una consulta `SELECT NOW()` usando el mismo módulo `src/config/db.js`.

### Caso C — Ajuste de rutas de Comments para cumplir el contrato de tests

En `src/routes/comments.js` se añadieron rutas faltantes necesarias para cumplir el comportamiento esperado por los tests:

- `POST /api/comments`
- `GET /api/comments/post/:postId`
- (y se preserva `DELETE /api/comments/:id`)

---

## Notas finales

- Si tus tests fallan, primero confirma:
  1) que tu `.env` apunta al PostgreSQL correcto,
  2) que ejecutaste `database/setup.sql`,
  3) que la seed opcional (`database/seed.sql`) no rompe constraints.

---

## Autor

**Nicolás Rechimont**

- GitHub: https://github.com/rechimonth
- Proyecto: miniblog-backend

