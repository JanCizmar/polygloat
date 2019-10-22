CREATE DATABASE app;
CREATE USER app WITH PASSWORD 'app';
GRANT ALL PRIVILEGES ON DATABASE app TO app;
\connect app
CREATE TABLE public.users
(
    id serial NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    expiration_time timestamp without time zone,
    account_locked boolean NOT NULL DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username_key UNIQUE (username)
);
