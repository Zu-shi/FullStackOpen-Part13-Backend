CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) values ('Dan Abramov', 'www', 'On let vs const');
INSERT INTO blogs (author, url, title) values ('Laurenz Albe', 'www', 'Gaps in sequences in PostgreSQL');