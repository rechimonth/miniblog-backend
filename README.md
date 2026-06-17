# MiniBlog API

## Descripción del proyecto
MiniBlog API es un backend REST construido con **Node.js + Express + PostgreSQL (pg Pool)** para administrar:
- **Authors**
- **Posts**
- **Comments** (extra credit), asociados a *posts* y *authors*.

Incluye:
- CRUD completo para Authors y Posts
- Endpoints para crear/listar Comments
- Middleware de validación y manejo global de errores
- Suite de pruebas con **Jest + Supertest**
- Documentación de la API con **OpenAPI 3.0** (`docs/openapi.yaml`)

## Arquitectura
La aplicación sigue una arquitectura por capas:

- **Routes**: definen los endpoints HTTP
- **Middlewares**: validación global y manejo de errores
- **Services**: lógica de negocio + persistencia
- **DB**: conexión PostgreSQL con `pg` y consultas SQL parametrizadas

Flujo típico:
**Express Route → Service → Pool de PostgreSQL**

## Tecnologías utilizadas
- Node.js
- Express
- PostgreSQL
- `pg` (Pool de conexiones)
- `dotenv`
- Jest
- Supertest
- OpenAPI 3.0

## Requisitos
- Node.js 18+ recomendado
- PostgreSQL 13+ (local)
- Acceso a una base PostgreSQL en Railway (para despliegue)

## Instalación local

1) Instalar dependencias:
```bash
npm install
```

2) Asegúrate de tener una base PostgreSQL corriendo (local).

## Variables de entorno

1) Copia el ejemplo:
```bash
copy .env.example .env
```

2) Edita `.env` con tus valores reales.

### Explicación de `.env.example`
El archivo `.env.example` debe contener **todas** las variables necesarias para:
- Conectar a PostgreSQL (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`)
- Definir el puerto del servidor (`PORT`)
- Configuración opcional del Pool (timeouts y tamaño)

Ejemplo de variables (estructura; usa tus valores reales):
- `PORT`
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

> No se incluyen credenciales reales en `.env.example`.

## Configuración PostgreSQL

1) Crea tu base de datos PostgreSQL (si no existe).
2) Ejecuta el esquema y datos iniciales con los scripts del proyecto.

## Ejecutar setup.sql
Ejecuta el esquema de tablas y llaves foráneas:

```bash
psql "$PGDATABASE" -f database/setup.sql
```

> Nota: el comando anterior asume que `psql` está disponible y que las variables `PG*` aplican en tu shell.

## Ejecutar seed.sql
Inserta datos iniciales:

```bash
psql "$PGDATABASE" -f database/seed.sql
```

## Iniciar servidor

```bash
node src/server.js
```

El servidor inicia en:
- `PORT` (por defecto sugerido: `3000`)

## Ejecutar tests
Los tests usan **Jest + Supertest** y requieren acceso a PostgreSQL real usando las variables `PG*`.

1) Ejecuta:
```bash
npm test
```

2) Importante:
- Los tests truncan tablas en `beforeAll` y cierran el pool en `afterAll`.
- Si no hay conexión válida a PostgreSQL, los tests fallarán por timeout/conexión.

## Documentación OpenAPI
La especificación OpenAPI se encuentra en:
- `docs/openapi.yaml`

Puedes revisarla en cualquier viewer OpenAPI/Swagger compatible.

## Endpoints disponibles

Prefijo: `/api`

### Authors
- `GET /api/authors`
- `GET /api/authors/{id}`
- `POST /api/authors`
- `PUT /api/authors/{id}`
- `DELETE /api/authors/{id}`

### Posts
- `GET /api/posts`
- `GET /api/posts/{id}`
- `GET /api/posts/author/{authorId}`
- `POST /api/posts`
- `PUT /api/posts/{id}`
- `DELETE /api/posts/{id}`

### Comments (extra credit)
- `POST /api/comments`
- `GET /api/comments/post/{postId}`

## Despliegue en Railway

### Variables Railway
En Railway configura variables de entorno (obligatorias) equivalentes a `.env.example`:

- `PORT`
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

### Cómo aprovisionar PostgreSQL en Railway
1) En Railway, crea/adjunta un servicio **PostgreSQL**.
2) Copia los valores de conexión (host/port/db/user/password) desde Railway.
3) Pégalos en las variables de entorno del servicio Node.

### Comandos de producción
En Railway ejecuta el servidor con:

```bash
node src/server.js
```

## Registro del uso de IA en el proyecto
Este proyecto se desarrolló por fases siguiendo un proceso de prompts por rubrica:

- **Fase 1**: creación de esquema SQL (`setup.sql`) y datos de prueba (`seed.sql`), y conexión DB con `pg`.
- **Fase 2**: implementación de services de persistencia para Authors/Posts/Comments con consultas parametrizadas.
- **Fase 3**: construcción del servidor Express, routers y middlewares globales (validación + error handler).
- **Fase 4**: creación de pruebas con Jest + Supertest para cubrir rutas principales y casos de error.
- **Fase 5**: documentación OpenAPI (`docs/openapi.yaml`) y preparación del README con instrucciones reproducibles.

La asistencia con prompts se utilizó para acelerar estructura, asegurar cumplimiento de códigos HTTP y completar documentación, sin introducir nuevas dependencias ni reestructurar la arquitectura base.
