-- Runs once when the PostgreSQL volume is first created (docker-entrypoint-initdb.d).
-- The application database is created by POSTGRES_DB. This adds the optional Umami analytics database.
CREATE DATABASE umami;
