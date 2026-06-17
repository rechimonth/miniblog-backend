-- database/seed.sql
INSERT INTO authors (name, email, bio)
VALUES
  ('Ada Lovelace', 'ada@example.com', 'First computer programmer.'),
  ('Alan Turing', 'alan@example.com', 'Father of theoretical computer science.')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (title, content, author_id, published)
VALUES
  ('Notes on the Analytical Engine', 'A detailed overview of early computing.', 1, TRUE),
  ('Computing Machinery and Intelligence', 'Turing proposes machine intelligence.', 2, TRUE)
ON CONFLICT DO NOTHING;
