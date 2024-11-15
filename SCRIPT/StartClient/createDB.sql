-- Création de la base de données des utilisateurs en clair
CREATE DATABASE IF NOT EXISTS UsersDB;
USE UsersDB;

-- Table pour stocker les informations des utilisateurs
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    sexe VARCHAR(10) NOT NULL,
    profession VARCHAR(50) NOT NULL,
    role_id INT,
    data_access_level TINYINT DEFAULT 0,  -- 0 = CLEAR, 1 = PSEUDONYMIZED, 2 = ANONYMIZED, 3 = NONE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);