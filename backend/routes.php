<?php
    require 'controllers/AuthController.php';
    require 'controllers/UserController.php';
    require 'controllers/DashboardController.php';

    // cria instância de controlador
    $authController         = new AuthController();
    $userController         = new UserController();
    $dashboardController    = new DashboardController();

    $action = $_GET['action'] ?? 'login';

    switch ($action){
        case 'login':
                $authController->login();
                break;
            case 'register':
                $userController->register();
                break;
            case 'list':
                $userController->list();
                break;
            case 'dashboard':
                $userController->dashboard();
                break;
            case 'edit':
                $id = $_GET['id'];
                $userController->edit($id);
                break;
        default:
                $authController->login();
                break;
    }
?>