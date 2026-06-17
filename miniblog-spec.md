# Project Specification: MiniBlog API (DevSpark)

## 1. Core Stack & Architecture
- [cite_start]**Runtime & Framework:** Node.js, Express.js[cite: 3].
- [cite_start]**Database:** PostgreSQL using raw queries via `pg` (Pool), no ORM[cite: 7, 10, 36].
- [cite_start]**Testing:** Jest and Supertest (Minimum 6 unit/integration tests)[cite: 20, 40, 77].
- [cite_start]**Documentation:** OpenAPI 3.0 (YAML/JSON)[cite: 6, 29].
- [cite_start]**Pattern:** Layered Architecture: Routes -> Controllers/Middlewares -> Services -> DB[cite: 37, 54, 73].

## 2. Database Schema (PostgreSQL)
[cite_start]All queries must be parameterized to prevent SQL Injection[cite: 20, 51].

```sql
CREATE TABLE authors (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 bio TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
 id SERIAL PRIMARY KEY,
 title VARCHAR(200) NOT NULL,
 content TEXT NOT NULL,
 author_id INTEGER NOT NULL,
 published BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- EXTRA CREDIT ENTITY
CREATE TABLE comments (
 id SERIAL PRIMARY KEY,
 post_id INTEGER NOT NULL,
 author_id INTEGER NOT NULL,
 content TEXT NOT NULL,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
 FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);