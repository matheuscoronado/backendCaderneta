<?php

    class UserController
    {
        public function register(){
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = [
            'nome'      => $_POST['nome'],
            'email'     => $_POST['email'],
            'senha_hash'=> password_hash($_POST['password'], PASSWORD_DEFAULT),
            'tipo'      => $_POST['funcao']
            ];

            User::create($data);

            header('Location: admin.php');
            } else { 
                include'bakend/views/register.php';
            }
        }

        public function edit($id)
        {
            session_start();
            if ($_SESSION['tipo'] == 'administrador') {
                $user = User::find($id);
                if($_SERVER['REQUEST_METHOD'] == 'POST') {
                    $data = [
                        'nome'      => $_POST['nome'],
                        'email'     => $_POST['email'],
                        'senha_hash'=> password_hash($_POST['password'], PASSWORD_DEFAULT),
                        'tipo'      => $_POST['tipo']
                    ];
                    User::update($id, $data);
                    header('Location: index.php?action=list');
                } else {
                    include 'backend/views/edit_user.php';
                }
            } else{
                echo "Acesso negado. Você não tem permissão para editar usuários.";
            }
        }

        public function list()
        {
            session_start();
                $users = User::all();
                include 'backend/views/list_users.php';
            }
        }
?>
