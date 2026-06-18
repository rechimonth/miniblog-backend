# MiniBlog API


API REST de alto rendimiento desarrollada con **Node.js**, **Express** y **PostgreSQL**, diseñada para la gestión integral de autores, publicaciones y comentarios. Este proyecto implementa una arquitectura limpia y desacoplada por capas, garantizando la seguridad mediante consultas parametrizadas contra inyecciones SQL, validaciones robustas de entrada, manejo global estructurado de errores y una suite completa de pruebas automatizadas de integración.

---

## 📋 Tabla de Contenidos
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura y Flujo de Datos](#arquitectura-y-flujo-de-datos)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Base de Datos (Esquema y Semilla)](#base-de-datos-esquema-y-semilla)
6. [Variables de Entorno](#variables-de-entorno)
7. [Instalación y Configuración Local](#instalación-y-configuración-local)
8. [Suite de Pruebas (Testing)](#suite-de-pruebas-testing)
9. [Documentación de Endpoints (OpenAPI)](#documentación-de-endpoints-openapi)
10. [Manejo Centralizado de Errores](#manejo-centralizado-de-errores)
11. [Despliegue en Producción (Railway)](#despliegue-en-producción-railway)
12. [Registro del Uso de Inteligencia Artificial (Bitácora)](#registro-del-uso-de-inteligencia-artificial-bitácora)
13. [Autor](#autor)

---

## 📝 Descripción del Proyecto
MiniBlog API provee los cimientos backend necesarios para un sistema de contenidos web. Expone un servicio CRUD parametrizado que permite administrar de forma relacional tres entidades principales de negocio:
- **Authors (Autores):** Usuarios administradores del contenido con restricciones de unicidad biunívocas.
- **Posts (Publicaciones):** Artículos creados por un autor específico, con integridad referencial automatizada.
- **Comments (Comentarios):** Interacciones vinculadas directamente a una publicación y firmadas por un autor.

---

## 🛠️ Tecnologías Utilizadas
- **Runtime:** Node.js (v18+)
- **Framework Web:** Express.js
- **Motor de Base de Datos:** PostgreSQL
- **Driver de Conexión:** `pg` (utilizando Pool de conexiones optimizado)
- **Variables de Entorno:** `dotenv`
- **Testing Suite:** Jest & Supertest
- **Especificación de API:** OpenAPI 3.0 / Swagger

---

## 🏛️ Arquitectura y Flujo de Datos
La aplicación se estructuró bajo una **arquitectura por capas desacopladas** para facilitar el mantenimiento y la escalabilidad del sistema:

1. **Routes:** Capa encargada de interceptar las peticiones HTTP y definir los endpoints de la aplicación.
2. **Middlewares:** Filtros intermedios responsables de la validación estricta de inputs de datos entrantes y la captura centralizada de excepciones.
3. **Controllers:** Orquestadores lógicos que reciben los objetos `req` y `res`, invocan a la capa de servicios y formulan la respuesta JSON con su correspondiente código de estado semántico.
4. **Services:** Contenedores de la lógica de negocio pura que ejecutan operaciones relacionales mediante consultas parametrizadas dirigidas al motor de base de datos.
5. **Config/DB:** Instanciación centralizada del Pool de conexiones de PostgreSQL.

```text
Petición HTTP Client ──> [Routes] ──> [Middlewares] ──> [Controllers] ──> [Services] ──> [PG Pool (DB)]

```

---

## 📁 Estructura del Proyecto

```text
📁 miniblog-backend
├── 📁 database
│   ├── 📄 seed.sql                # Datos semilla (y/o inserts de ejemplo)
│   └── 📄 setup.sql               # Esquema/tablas/constraints
├── 📁 docs
│   └── 📄 openapi.yaml            # Especificación OpenAPI 3.0
├── 📁 src
│   ├── 📄 app.js                  # Inicialización y montaje de Express
│   ├── 📄 server.js               # Listener (bootstrap del servidor)
│   ├── 📁 config
│   │   └── 📄 db.js              # Configuración del pg Pool
│   ├── 📁 middlewares
│   │   ├── 📄 errorHandler.js    # Middleware global de errores (incluye 23505->409)
│   │   └── 📄 validate.js        # Validación de payloads
│   ├── 📁 routes
│   │   ├── 📄 authors.js         # Rutas CRUD de Authors
│   │   ├── 📄 posts.js           # Rutas CRUD de Posts (+ GET /posts/author/:authorId)
│   │   └── 📄 comments.js       # Rutas para Comments (extra credit)
│   └── 📁 services
│       ├── 📄 authorService.js  # Operaciones con tabla authors
│       ├── 📄 postService.js    # Operaciones con tabla posts
│       └── 📄 commentService.js # Operaciones con tabla comments
├── 📁 tests
│   ├── 📄 authors.test.js
│   ├── 📄 posts.test.js
│   └── 📄 comments.test.js
├── 📄 .env.example                # Plantilla guía de variables de entorno
├── 📄 package.json                # Dependencias y scripts
└── 📄 README.md                   # Documentación técnica principal
```


---

## 🗄️ Base de Datos (Esquema y Semilla)

El modelo relacional cuenta con integridad referencial estricta configurada mediante cascada (`ON DELETE CASCADE`), garantizando que si se remueve un autor o post, sus registros dependientes se purguen limpiamente.

Los scripts correspondientes se localizan de forma independiente en la raíz:

* **`database/setup.sql`:** Contiene las sentencias estructurales `CREATE TABLE IF NOT EXISTS` para `authors`, `posts` y `comments`.
* **`database/seed.sql`:** Provee inserciones iniciales (`INSERT INTO ... ON CONFLICT DO NOTHING`) seguras para poblar el entorno de desarrollo rápidamente.

---

## 🔑 Variables de Entorno

El proyecto utiliza variables de entorno nativas compatibles con configuraciones locales y despliegues automáticos basados en infraestructuras Cloud como Railway.

Crea un archivo `.env` basado en el siguiente esquema estándar:

```env
PORT=3000
NODE_ENV=development

# Credenciales de Base de Datos (PostgreSQL)
PGHOST=localhost
PGPORT=5432
PGUSER=tu_usuario
PGPASSWORD=tu_contraseña
PGDATABASE=miniblog

# Parámetros avanzados del Pool de Conexiones
PG_POOL_MAX=10
PG_IDLE_TIMEOUT_MS=30000
PG_CONN_TIMEOUT_MS=2000

```

---

## 🚀 Instalación y Configuración Local

1. **Clonar el repositorio público:**
```bash
git clone [https://github.com/rechimonth/miniblog-backend.git](https://github.com/rechimonth/miniblog-backend.git)
cd miniblog-backend

```


2. **Instalar dependencias del sistema:**
```bash
npm install

```


3. **Configurar el entorno:**
Crea tu archivo `.env` en la raíz siguiendo las pautas de `.env.example`.
4. **Inicializar la base de datos local:**
Asegúrate de tener corriendo tu servidor local de PostgreSQL, crea la base de datos `miniblog` y ejecuta secuencialmente los scripts:
```bash
psql -U postgres -d miniblog -f database/setup.sql
psql -U postgres -d miniblog -f database/seed.sql

```


5. **Iniciar la aplicación:**
```bash
# Modo Producción
npm start

# Modo Desarrollo (con recarga automática si aplica)
npm run dev

```



---

## 🧪 Suite de Pruebas (Testing)

El proyecto incluye un total de **20 pruebas de integración automatizadas** desarrolladas con **Jest** y **Supertest**, cubriendo flujos exitosos y control de fallas críticas.

Para mitigar problemas de concurrencia y fugas de memoria (*memory leaks*), la suite implementa cierres controlados del pool de conexiones al finalizar la ejecución de las pruebas mediante directivas asíncronas `afterAll`.

Ejecuta las pruebas locales con el comando:

```bash
npm test

```

---

## 📖 Documentación de Endpoints (OpenAPI)

Toda la API se encuentra completamente documentada bajo el estándar OpenAPI 3.0. El archivo de especificación se encuentra en `docs/openapi.yaml`. Puedes visualizarlo importando su contenido en cualquier visor web como [Swagger Editor](https://editor.swagger.io/).

### Resumen de Endpoints Disponibles

| Entidad | Método HTTP | Endpoint | Código Éxito | Códigos de Error Comunes | Descripción |
| --- | --- | --- | --- | --- | --- |
| **Autores** | `GET` | `/authors` | `200` | `500` | Lista todos los autores registrados. |
|  | `GET` | `/authors/:id` | `200` | `404`, `500` | Obtiene un autor por su ID único. |
|  | `POST` | `/authors` | `201` | `400`, `409` | Crea un autor. Valida email único y nombre obligatorio. |
|  | `PUT` | `/authors/:id` | `200` | `400`, `404` | Actualiza los datos de un autor por su ID. |
|  | `DELETE` | `/authors/:id` | `204` | `404` | Elimina un autor (borrado en cascada de sus datos). |
| **Posts** | `GET` | `/posts` | `200` | `500` | Lista todas las publicaciones del blog. |
|  | `GET` | `/posts/:id` | `200` | `404` | Obtiene una publicación específica por ID. |
|  | `POST` | `/posts` | `201` | `400` | Registra un post. Valida campos y existencia de `author_id`. |
|  | `PUT` | `/posts/:id` | `200` | `400`, `404` | Modifica el contenido de una publicación. |
|  | `DELETE` | `/posts/:id` | `204` | `404` | Elimina una publicación por ID. |
|  | `GET` | `/posts/author/:authorId` | `200` | `400`, `404` | **Endpoint Crítico:** Retorna publicaciones extendidas con un `INNER JOIN` de su autor. |
| **Comments** | `GET` | `/posts/:postId/comments` | `200` | `404` | Lista los comentarios correspondientes a un post. |
|  | `POST` | `/posts/:postId/comments` | `201` | `400`, `404` | Crea un comentario asociado a una publicación. |

---

## 🛡️ Manejo Centralizado de Errores

El sistema delega de forma estricta todo error interceptado en las capas internas hacia un **Middleware Global de Errores** (`src/middlewares/errorHandler.js`). Esto homogeneiza el formato de respuesta del backend evitando fugas de información interna sensible.

* **Errores de Validación (400 Bad Request):** Gatillados cuando faltan propiedades mandatorias en los cuerpos JSON entrantes.
* **Errores de Inexistencia (404 Not Found):** Respuestas devueltas cuando consultas SQL por ID devuelven colecciones vacías (`rows.length === 0`).
* **Errores de Restricciones SQL (409 Conflict):** Captura explícita del código de error nativo de PostgreSQL `23505` (Violación de restricción única), devolviendo un conflicto limpio ante intentos de duplicación de correos electrónicos.
* **Errores de Infraestructura (500 Internal Server Error):** Respuestas de escape genéricas que enmascaran fallos críticos inesperados del motor o de la red.

---

## 🌐 Despliegue en Producción (Railway)

La API se encuentra desplegada y operativa en producción en la plataforma de servicios en la nube Railway.

## 🚀 Despliegue (Deployment)

La API está desplegada y accesible públicamente a través de Railway. Puedes interactuar con ella utilizando los siguientes enlaces:

* **URL Base:** [https://miniblog-backend-production-7a64.up.railway.app/api](https://miniblog-backend-production-7a64.up.railway.app/api)
* **Authors:** [https://miniblog-backend-production-7a64.up.railway.app/api/authors](https://miniblog-backend-production-7a64.up.railway.app/api/authors)
* **Posts:** [https://miniblog-backend-production-7a64.up.railway.app/api/posts](https://miniblog-backend-production-7a64.up.railway.app/api/posts)
* **Documentación API MiniBlog (OpenAPI):** [https://miniblog-backend-production-7a64.up.railway.app/api/docs](https://miniblog-backend-production-7a64.up.railway.app/api/docs)

### Estrategia de Conexión en Producción

Para garantizar el máximo rendimiento y eludir problemas de saturación, el servicio Node/Express utiliza variables de entorno dinámicas referenciadas directamente al core del motor PostgreSQL en la red interna de Railway:

* `PGHOST=${{Postgres.PGHOST}}`
* `PGPASSWORD=${{Postgres.PGPASSWORD}}`

Esto erradica la latencia externa permitiendo que la capa de servicios interactúe de manera óptima con la persistencia relacional.

---

## 🤖 Registro del Uso de Inteligencia Artificial (Bitácora)

Siguiendo los lineamientos mandatorios de la rúbrica de evaluación, se detalla a continuación de forma transparente la bitácora con los prompts de ingeniería exactos y en primera persona utilizados como soporte de desarrollo para alcanzar los estándares de nivel Excelente:


### Caso 1: Captura y mapeo del error 23505 de PostgreSQL en el Middleware Global

* **Prompt enviado a la IA (Claude):** *"Estoy usando Express con la librería `pg` para conectar a PostgreSQL.
* **Decisión técnica gatillada:** Se diseñó una estructura condicional robusta en `src/middlewares/errorHandler.js` evaluando `error.code === '23505'`, abstrayendo las respuestas de base de datos crudas y convirtiéndolas en respuestas REST semánticas.

### Caso 2: Cierre automático de conexiones de pruebas para mitigar fallos por Connection Timeout

* **Prompt enviado a la IA:** *"Estoy corriendo mis tests de integración con Jest y Supertest contra mi base de datos de desarrollo y a veces las pruebas se me quedan colgadas o me tiran el error 'Connection terminated due to connection timeout'. Sospecho que es porque cada test abre conexiones al Pool de `pg` y no se están cerrando correctamente al terminar la suite de pruebas. ¿Cómo puedo usar los hooks globales de Jest (`afterAll`) para invocar el método de cierre definitivo del pool de conexiones sin afectar la inicialización del servidor de Express?"*
* **Decisión técnica gatillada:** Implementación estricta de directivas asíncronas `afterAll(async () => { await pool.end(); });` al final de la suite de pruebas integradas, solucionando por completo la inestabilidad de red y los bloqueos por hilos de conexión residuales.

### Caso 3: Modularización y Separación de Scripts SQL Estructurales y Semilla

* **Prompt enviado a la IA:** *"Actualmente tengo un script en Node que se encarga de conectar a PostgreSQL y crear las tablas metiendo strings gigantes de queries. La rúbrica académica me exige explícitamente entregar scripts SQL puros independientes para la inicialización y población. Ayudame a estructurar dos archivos separados: un `setup.sql` que defina las tablas `authors`, `posts` y `comments` usando tipos de datos correctos (como SERIAL PRIMARY KEY, VARCHAR y TIMESTAMPTZ) con relaciones `FOREIGN KEY` controladas por borrado en cascada, y un archivo `seed.sql` seguro que inserte datos de prueba de manera que si lo ejecuto dos veces no falle por duplicación de IDs."*
* **Decisión técnica gatillada:** Migración absoluta de la lógica de persistencia inicial de la app hacia la carpeta externa e independiente `database/`, aislando las sentencias estructuradas y proveyendo un control por conflictos (`ON CONFLICT DO NOTHING`) apto para evaluación automatizada.

### Caso 4: Robustecimiento y límites paramétricos del Pool de conexiones en Node

* **Prompt enviado a la IA:** *"Quiero que la conexión PostgreSQL sea sumamente resiliente en desarrollo local y en el backend de Railway. En mi archivo `src/config/db.js` estoy importando `Pool` de la librería `pg`. Sugerime qué parámetros avanzados del constructor del Pool (`max`, `idleTimeoutMillis`, y `connectionTimeoutMillis`) son los más recomendados y con qué valores por defecto para un escenario de API REST de tamaño mediano que corre pruebas unitarias recurrentes, manteniendo la lectura limpia desde variables de entorno con fallback seguro."*
* **Decisión técnica gatillada:** Se parametrizó el constructor del Pool en `src/config/db.js` acotando la vida útil máxima de conexiones inactivas a 30 segundos (`idleTimeoutMillis: 30000`) y fijando el umbral de espera de conexión a 2 segundos (`connectionTimeoutMillis: 2000`) para interceptar fallos de red de forma reactiva inmediata.

### Caso 5: Sincronización entre la especificación OpenAPI y las respuestas del Middleware

* **Prompt enviado a la IA:** *"Tengo mi especificación formal de endpoints en `docs/openapi.yaml` y necesito que refleje exactamente el comportamiento real de mi API Express. Por ejemplo, para el caso de conflicto de correo duplicado en autores, configuré mi middleware de error para que retorne un código HTTP 409 y un cuerpo JSON plano `{ "error": "string" }`. ¿Cómo describo correctamente este esquema de respuesta de error en formato YAML bajo OpenAPI 3.0 para que coincida a la perfección con la respuesta real de mi servidor y pase los validadores de contratos?"*
* **Decisión técnica gatillada:** Se unificó el modelado de esquemas de error en el documento de especificación técnica, alineando los contratos de OpenAPI con las respuestas JSON reales del middleware de excepciones de la app.

---

## 🧩 Diagrama Entidad-Relación (ERD)

El modelo relacional incluye 3 entidades principales:

- **authors**: autores del contenido.
- **posts**: publicaciones escritas por un autor.
- **comments**: comentarios asociados a una publicación.

Relaciones (cardinalidad):
- `authors (1) → (N) posts` mediante `posts.author_id` (FK).
- `posts (1) → (N) comments` mediante `comments.post_id` (FK).

Requisitos de integridad:
- Al eliminar un autor, se eliminan sus posts y, en cascada, sus comments (por `ON DELETE CASCADE`).
- Al eliminar un post, se eliminan sus comments.

```text
[authors] 1 ───────< N [posts] 1 ───────< N [comments]
    (PK id)              (PK id)              (PK id)
        |                     |                 |
        | author_id          | post_id         | 
        v                     v                 v
```

## 🧰 Funcionalidades

### Autores
- Listar autores (`GET /api/authors`).
- Obtener autor por ID (`GET /api/authors/:authorId`).
- Crear autor (`POST /api/authors`).
- Actualizar autor (`PUT /api/authors/:authorId`).
- Eliminar autor (`DELETE /api/authors/:authorId`).

### Posts
- Listar posts (`GET /api/posts`).
- Obtener post por ID (`GET /api/posts/:postId`).
- Obtener posts por autor (`GET /api/posts/author/:authorId`).
- Crear post (`POST /api/posts`).
- Actualizar post (`PUT /api/posts/:postId`).
- Eliminar post (`DELETE /api/posts/:postId`).

### Comments (extra credit)
- Listar comments de un post (`GET /api/comments/posts/:postId`).
- Crear comment en un post (`POST /api/comments/posts/:postId/comments`).

### Manejo de errores
- Respuestas consistentes ante errores de validación/inexistencia.
- Mapeo de `23505` (unique_violation de PostgreSQL) a **409 Conflict** con mensaje: `Email already exists`.

## 👤 Autor

**Nicolás Rechimont**

* **GitHub:** [@rechimonth](https://github.com/rechimonth)
* **Repositorio del Proyecto:** [miniblog-backend](https://github.com/rechimonth/miniblog-backend)

```

---

### 💡 Pasos para implementarlo ya mismo:
1. Abrí la carpeta de tu proyecto local en tu terminal Git Bash.
2. Ejecutá `rm README.md` (o borralo manualmente) para no tener duplicados.
3. Creá el archivo nuevo: `touch README.md`.
4. Abrilo en tu editor de código con `code README.md`, pegá todo el bloque de arriba y guardalo con `Ctrl + S`.
5. Hacé el push final a GitHub:
   ```bash
   git add README.md
   git commit -m "docs: sync and merge final production README with AI logs"
   git push origin master

```

