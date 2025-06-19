<?php
// Requer o arquivo 'User.php', que contém o Model User com as funções para manipulação de dados de usuários.
require_once 'models/user.php';

class AuthController
{
    // Função responsável pelo processo de login
    public function login()
    {
        // Verifica se a requisição HTTP é do tipo POST, ou seja, se o formulário foi enviado
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Obtém os valores do formulário (e-mail e senha) enviados pelo usuário
            $email = $_POST['email'];
            $senha = $_POST['senha_hash'];

            // Chama o método do Model para encontrar o usuário pelo e-mail fornecido
            $user = User::findByEmail($email);

            // Verifica se o usuário foi encontrado e se a senha fornecida está correta
            if ($user && password_verify($senha, $user['senha_hash'])) { //Verifica se uma senha corresponde a um hash
                // Inicia uma sessão
                session_start();
                // Armazena na sessão o ID do usuário e o perfil do usuário logado
                $_SESSION['usuario_id'] = $user['id'];
                $_SESSION['tipo'] = $user['tipo'];
                // Redireciona o usuário para o dashboard ou área restrita
                header('Location: index.php?action=dashboard');
            } else {
                // Se o e-mail ou a senha estiverem incorretos, exibe uma mensagem de erro
                echo "Email ou senha incorretos!";
            }
        } else {
            // Se a requisição não for POST (ou seja, se for GET), exibe o formulário de login
            include 'views/login.php';
        }
    }

    // Função responsável por fazer o logout (encerrar a sessão do usuário)
    public function logout()
    {
        // Inicia a sessão para poder destruí-la
        session_start();
        // Destrói todas as informações da sessão, efetivamente fazendo o logout
        session_destroy();
        // Redireciona o usuário para a página inicial (ou página de login)
        header('Location: index.php');
    }
}