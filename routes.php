<?php
    require 'backend/controllers/AuthController.php';


    // cria instância de controlador
    $authController = new AuthController();

    $action = $_GET['action'] ?? 'login';

    switch ($action){
        case 'login':
            $authController->login();
            break;
        default:
            $authController->login();
            break;
    }
?>