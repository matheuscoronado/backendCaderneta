<?php
    require_once 'models/database.php';

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

    public static function find($id){
        $conn = Database::getConnection();
        $stmt = $conn->prepare("SELECT * FROM usuario WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function update($id, $data){
        $conn = Database::getConnection();
        $stmt = $conn->prepare("UPDATE usuario SET nome = :nome, email = :email, senha_hash = :senha_hash, tipo = :tipo WHERE id = :id");
       
        $data['id'] = $id;

        $stmt->execute($data);
    }

    public static function all(){
        $conn = Database::getConnection();
        $stmt = $conn->query("SELECT * FROM usuario");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>