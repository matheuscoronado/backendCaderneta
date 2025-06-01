<?php
    require_once 'backend/models/database.php';

    class User{

        // Função para encontrar usuário por email
        public static function findByEmail($email){

            $conn = Database::getConnection();

            $stmt = $conn->prepare("SELECT * FROM usuario WHERE email = :email");

            $stmt->execute(['email' => $email]);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        // Função para criar usuário no banco de dados
        public static function create($data){
            $conn = Database::getConnection();
            $stmt = $conn->prepare("INSERT INTO usuario (nome, email, senha_hash, tipo) VALUES (:nome, :email, :senha_hash, :tipo)");

            $stmt->execute($data);

        }
    }
?>