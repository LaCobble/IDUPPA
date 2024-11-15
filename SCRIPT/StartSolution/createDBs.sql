-- 0. Ajustation de la base de donnée de base
USE UsersDB;
-- Table des rôles (client, communication, dev, devops)
CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Table de liaison pour associer les utilisateurs à leurs rôles
CREATE TABLE User_Roles (
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

-- Table pour stocker des données personnelles fictives
CREATE TABLE Personal_Data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    data_field VARCHAR(100),
    data_value TEXT,
    access_level TINYINT,  -- 0 = CLEAR, 1 = PSEUDONYMIZED, 2 = ANONYMIZED, 3 = NONE
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Table des politiques d'accès, définissant les droits de chaque rôle
CREATE TABLE Access_Policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    data_access_level TINYINT,  -- 0 = CLEAR, 1 = PSEUDONYMIZED, 2 = ANONYMIZED, 3 = NONE
    description TEXT,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

-- Insertion des rôles
INSERT INTO Roles (role_name) VALUES
    ('client'),
    ('communication'),
    ('compta'),
    ('RH'),
    ('dev'),
    ('devops');

-- 1. Création de la base de données pour la pseudonymisation
CREATE DATABASE IF NOT EXISTS PseudonymizationDB;
USE PseudonymizationDB;

CREATE TABLE Pseudonymized_Data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    pseudonymized_name TEXT,
    pseudonymized_firstname TEXT,
    pseudonymized_email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES UsersDB.Users(id)
);

-- 2. Création de la base de données pour l’anonymisation
CREATE DATABASE IF NOT EXISTS AnonymizationDB;
USE AnonymizationDB;

CREATE TABLE Anonymized_Data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    anonymized_name TEXT,
    anonymized_firstname TEXT,
    anonymized_email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES UsersDB.Users(id)
);

-- Insertion d'un user blank anonyme
INSERT INTO Anonymized_Data (user_id, anonymized_name, anonymized_firstname, anonymized_email) VALUES (01, 'John', 'Doe', 'John.Doe@email.fr');

-- 3. Création de la base de données des logs
CREATE DATABASE IF NOT EXISTS LogsDB;
USE LogsDB;

CREATE TABLE Access_Logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50),  -- 'READ', 'WRITE', 'DELETE', etc.
    target_data VARCHAR(100),  -- Données concernées par l'action
    access_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_outcome VARCHAR(20), -- 'GRANTED' ou 'DENIED'
    FOREIGN KEY (user_id) REFERENCES UsersDB.Users(id)
);

-- Table pour les traitements de données (conformes ou non conformes)
CREATE TABLE Data_Processing_Status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    processing_description TEXT,
    is_compliant BOOLEAN,
    justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Création de la base de données pour la gestion dynamique des autorisations
CREATE DATABASE IF NOT EXISTS AccessControlDB;
USE AccessControlDB;

CREATE TABLE Dynamic_Access_Control (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    data_access_level TINYINT,
    context_info TEXT,  -- Informations contextuelles sur l'accès (horaires, localisation, etc.)
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES UsersDB.Users(id)
);
