-- Crear la base de datos
CREATE DATABASE chatbot_db;

-- Seleccionar la base de datos
USE chatbot_db;

-- Crear la tabla de usuarios
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de historial de búsqueda
CREATE TABLE search_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    search_query TEXT NOT NULL,
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);