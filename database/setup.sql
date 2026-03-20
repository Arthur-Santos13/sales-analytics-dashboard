-- database/setup.sql
-- Run once as the postgres superuser:
--   psql -U postgres -f database/setup.sql
--
-- Creates the application role and database for sales_analytics.

-- 1. Create role (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin WITH LOGIN PASSWORD 'secret';
  END IF;
END
$$;

-- 2. Create database owned by the new role (skip if already exists)
SELECT 'CREATE DATABASE sales_analytics OWNER admin'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sales_analytics')\gexec

-- 3. Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE sales_analytics TO admin;

\echo ''
\echo 'Setup complete!'
\echo '  DB   : sales_analytics'
\echo '  User : admin / secret'
\echo ''
\echo 'Next step -> run migrations:'
\echo '  cd backend && npm run migrate:seed'