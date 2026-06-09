-- Script SQL pour créer la base de données avec XAMPP MySQL
-- Exécutez ce script dans phpMyAdmin ou via la ligne de commande MySQL

CREATE DATABASE IF NOT EXISTS miscadin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Optionnel: Créer un utilisateur dédié (si vous ne voulez pas utiliser root)
-- CREATE USER IF NOT EXISTS 'miscadin_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
-- GRANT ALL PRIVILEGES ON miscadin.* TO 'miscadin_user'@'localhost';
-- FLUSH PRIVILEGES;



