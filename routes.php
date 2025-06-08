<?php
    require 'backend/controllers/AuthController.php';
    require 'backend/controllers/UserController.php';
    require 'backend/controllers/DashboardController.php';

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
                $dashboardController->index();
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