<?php

class UserController
{
    public function __construct()
    {
        // Inicia a sessão automaticamente para todas as ações
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function register()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Validação básica dos dados
            if (empty($_POST['nome']) || empty($_POST['email']) || empty($_POST['senha_hash'])) {
                $_SESSION['error'] = "Todos os campos são obrigatórios!";
                header('Location: index.php?action=register');
                exit;
            }

            $data = [
                'nome'      => trim($_POST['nome']),
                'email'     => trim($_POST['email']),
                'senha_hash'=> password_hash($_POST['senha_hash'], PASSWORD_DEFAULT),
                'tipo'      => $_POST['tipo']
            ];

            try {
                User::create($data);
                $_SESSION['success'] = "Usuário cadastrado com sucesso!";
                header('Location: views/dashboard.php');
                exit;
            } catch (Exception $e) {
                $_SESSION['error'] = "Erro ao cadastrar usuário: " . $e->getMessage();
                header('Location: index.php?action=register');
                exit;
            }
        } else { 
            include 'views/register.php';
        }
    }

    public function edit($id)
    {
        // Verifica permissão
        if ($_SESSION['tipo'] != 'administrador') {
            $_SESSION['error'] = "Acesso negado. Você não tem permissão para editar usuários.";
            header('Location: index.php');
            exit;
        }

        $user = User::find($id);
        if (!$user) {
            $_SESSION['error'] = "Usuário não encontrado!";
            header('Location: index.php?action=list');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = [
                'nome'      => trim($_POST['nome']),
                'email'     => trim($_POST['email']),
                'tipo'      => $_POST['tipo']
            ];

            // Só atualiza a senha se foi fornecida
            if (!empty($_POST['password'])) {
                $data['senha_hash'] = password_hash($_POST['password'], PASSWORD_DEFAULT);
            }

            try {
                User::update($id, $data);
                $_SESSION['success'] = "Usuário atualizado com sucesso!";
                header('Location: index.php?action=list');
                exit;
            } catch (Exception $e) {
                $_SESSION['error'] = "Erro ao atualizar usuário: " . $e->getMessage();
                header("Location: index.php?action=edit&id=$id");
                exit;
            }
        } else {
            include 'views/edit_user.php';
        }
    }

    public function list()
    {
        // Verifica se o usuário tem permissão
        if ($_SESSION['tipo'] != 'administrador') {
            $_SESSION['error'] = "Acesso negado. Você não tem permissão para ver esta página.";
            header('Location: index.php');
            exit;
        }

        try {
            $users = User::all();
            include 'views/list_users.php';
        } catch (Exception $e) {
            $_SESSION['error'] = "Erro ao carregar usuários: " . $e->getMessage();
            header('Location: index.php');
            exit;
        }
    }
    

    public function dashboard()
    {
        if (!isset($_SESSION['tipo'])) {
            header('Location: login.php');
            exit;
        }

        try {
            $users = ($_SESSION['tipo'] == 'administrador') ? User::all() : [];
            include 'views/dashboard.php';
        } catch (Exception $e) {
            $_SESSION['error'] = "Erro ao carregar dashboard: " . $e->getMessage();
            header('Location: index.php');
            exit;
        }
    }
}