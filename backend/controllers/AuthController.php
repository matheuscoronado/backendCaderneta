<?php
    require_once 'backend/models/user.php';

    class AuthController {

        public function login(){
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $email = $_POST['email'];
                $password = $_POST['password'];

                $user = User::findByEmail($email);

                if ($user && password_verify($password, $user['password'])) {
                    session_start();

                    $_SESSION['usuario_id'] = $user['id'];
                    $_SESSION['tipo'] = $user['tipo'];

                    header('Location: index.php?action=dashboard');
                } else {
                    echo "E-mail ou senha inválidos.";
                }
            }else {
                // Renderiza a página de login
                include 'backend/views/login.php';
            }
        }
    }
?>