USE UsersDB;

-- Insertion d'utilisateurs fictifs avec des rôles et niveaux d'accès variés
INSERT INTO Users (username, email, first_name, last_name, password, date_of_birth, city, country, sexe, profession, role_id, data_access_level) VALUES
    ('user1', 'user1@client.com', 'Jean', 'Dupont', 'password123', '1990-05-15', 'Paris', 'France', 'Homme', 'Client', 1, 0),   -- Client (données en clair)
    ('user2', 'user2@communication.com', 'Sophie', 'Martin', 'password456', '1985-08-22', 'Lyon', 'France', 'Femme', 'Communications', 2, 3), -- Communication (pas d'accès)
    ('user3', 'user3@compta.com', 'Pierre', 'Lemoine', 'password789', '1979-11-10', 'Marseille', 'France', 'Homme', 'Comptable', 3, 3), -- Compta (pas d'accès)
    ('user4', 'user4@rh.com', 'Clara', 'Girard', 'password101', '1980-01-30', 'Toulouse', 'France', 'Femme', 'RH', 4, 3),           -- RH (pas d'accès)
    ('user5', 'user5@dev.com', 'Lucas', 'Bernard', 'password112', '1995-12-10', 'Bordeaux', 'France', 'Homme', 'Developer', 5, 2),  -- Dev (anonymisé)
    ('user6', 'user6@devops.com', 'Elise', 'Robert', 'password131', '1993-03-25', 'Nice', 'France', 'Femme', 'DevOps', 6, 1),     -- DevOps (pseudonymisé)
    ('user7', 'user7@client.com', 'Julien', 'Moreau', 'password415', '1991-07-19', 'Paris', 'France', 'Homme', 'Client', 1, 0),   -- Client (données en clair)
    ('user8', 'user8@communication.com', 'Nina', 'Fournier', 'password161', '1988-04-05', 'Lyon', 'France', 'Femme', 'Communications', 2, 3), -- Communication (pas d'accès)
    ('user9', 'user9@dev.com', 'Mathieu', 'Leclerc', 'password171', '1994-09-14', 'Marseille', 'France', 'Homme', 'Developer', 5, 2),  -- Dev (anonymisé)
    ('user10', 'user10@devops.com', 'Alice', 'Lemoine', 'password181', '1996-02-03', 'Paris', 'France', 'Femme', 'DevOps', 6, 1);  -- DevOps (pseudonymisé)

-- Insertion de rôles pour chaque utilisateur dans la table de liaison (User_Roles)
INSERT INTO User_Roles (user_id, role_id) VALUES
    (1, 1),  -- user1: client
    (2, 2),  -- user2: communication
    (3, 3),  -- user3: compta
    (4, 4),  -- user4: RH
    (5, 5),  -- user5: dev
    (6, 6),  -- user6: devops
    (7, 1),  -- user7: client
    (8, 2),  -- user8: communication
    (9, 5),  -- user9: dev
    (10, 6); -- user10: devops

-- Insertion de données personnelles fictives pour chaque utilisateur avec différents niveaux d'accès
INSERT INTO Personal_Data (user_id, data_field, data_value, access_level) VALUES
    (1, 'Nom', 'Dupont', 0),                 -- Donnée en clair pour user1 (client)
    (2, 'Nom', 'Martin', 3),                 -- Pas d'accès pour user2 (communication)
    (3, 'Nom', 'Lemoine', 3),                -- Pas d'accès pour user3 (compta)
    (4, 'Nom', 'Girard', 3),                 -- Pas d'accès pour user4 (RH)
    (5, 'Nom', 'Bernard', 2),                -- Anonymisé pour user5 (dev)
    (6, 'Nom', 'Robert', 1),                 -- Pseudonymisé pour user6 (devops)
    (7, 'Nom', 'Moreau', 0),                 -- Donnée en clair pour user7 (client)
    (8, 'Nom', 'Fournier', 3),               -- Pas d'accès pour user8 (communication)
    (9, 'Nom', 'Leclerc', 2),                -- Anonymisé pour user9 (dev)
    (10, 'Nom', 'Lemoine', 1);               -- Pseudonymisé pour user10 (devops)

-- Insertion des politiques d'accès pour chaque rôle
INSERT INTO Access_Policies (role_id, data_access_level, description) VALUES
    (1, 0, 'Client : accès à ses propres données en clair.'),
    (2, 3, 'Communication : aucun accès aux données des clients.'),
    (3, 3, 'Compta : aucun accès aux données des clients.'),
    (4, 3, 'RH : aucun accès aux données des clients.'),
    (5, 2, 'Dev : accès anonymisé aux données des clients.'),
    (6, 1, 'DevOps : accès pseudonymisé aux données des clients.');
