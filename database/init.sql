-- Создание базы данных
CREATE DATABASE property_store_db;

-- Подключение к базе
\c property_store_db;

-- Выполнение схемы
\i schema.sql;