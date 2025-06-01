<?php
    require 'backend/controllers/AuthController.php';
    require 'backend/controllers/UserController.php';


    // cria instância de controlador
    $authController = new AuthController();
    $userController = new UserController();

    $action = $_GET['action'] ?? 'login';

    switch ($action){
        case 'login':
            $authController->login();
            break;
            case 'register':
            $userController->register();
            break;
        default:
            $authController->login();
            break;
    }
?>