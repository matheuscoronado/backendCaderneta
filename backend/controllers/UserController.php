<?php
require_once 'backend/models/user.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Coleta os dados do formulário
    $nome = $_POST['name'];
    $email = $_POST['email'];
    $senha = password_hash($_POST['password'], PASSWORD_DEFAULT); // Criptografa a senha
    $funcao = $_POST['funcao'];

    try {
        // Prepara os dados no formato esperado pelo método create
        $data = [
        'nome' => $nome,
        'email' => $email,
        'senha_hash' => password_hash($senha, PASSWORD_DEFAULT),
        'tipo' => $funcao,
        ];


        User::create($data);

        // Redireciona para a tela de listagem de usuários (ou dashboard)
        header('Location: admin.php');
        exit();

    } catch (PDOException $e) {
        echo "Erro ao cadastrar usuário: " . $e->getMessage();
    }
} else {
    echo "Método inválido.";
}
