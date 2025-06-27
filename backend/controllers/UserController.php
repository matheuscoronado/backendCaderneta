<?php
// Definição da classe UserController, responsável por gerenciar as ações relacionadas aos usuários
class UserController
{
    // Função para registrar um novo usuário
    public function register()
{
    // Verifica se a requisição HTTP é do tipo POST (se o formulário foi enviado)
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['register'])) {
        // Sanitiza os dados de entrada
        $data = [
            'nome' => filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING),
            'email' => filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL),
            'senha_hash' => password_hash($_POST['senha_hash'], PASSWORD_DEFAULT),
            'tipo' => filter_input(INPUT_POST, 'tipo', FILTER_SANITIZE_STRING)
        ];
        
        // Tenta criar o usuário
        if (User::create($data)) {
            // Redireciona com mensagem de sucesso
            header('Location: dashboard.php?success=1');
            exit;
        } else {
            // Redireciona com mensagem de erro
            header('Location: dashboard.php?error=1');
            exit;
        }
    }
    
    // Se não for POST ou não tiver o botão register, redireciona
    header('Location: dashboard.php');
    exit;
}

    // Função para editar os dados de um usuário existente
    public function edit($id)
    {
        session_start();
        // Permitir apenas admin e gestor editarem usuários
        if ($_SESSION['tipo'] == 'administrador') {
            $user = User::find($id);

            if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                $data = [
                    'nome' => $_POST['nome'],
                    'email' => $_POST['email'],
                    'tipo' => $_POST['tipo']
                ];

                User::update($id, $data);
                header('Location: index.php?action=list');
            } else {
                include 'views/edit_user.php';
            }
        } else {
            // Exibir mensagem de erro se não tiver permissão
            echo "Você não tem permissão para editar usuários.";
        }
    }


    // Função para excluir um usuário
    public function delete($id)
    {
        // Chama o método delete do Model User para remover o usuário pelo ID
        User::delete($id);
        // Após a exclusão, redireciona para a lista de usuários
        header('Location: index.php?action=list');
    }

    // Função para listar todos os usuários
    public function list()
    {
        // Chama o método all do Model User para obter todos os usuários do banco de dados
        $users = User::all();
        // Inclui a View que exibe a lista de usuários
        include 'views/dashboard.php';
    }
}