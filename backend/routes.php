<?php
//é um arquivo que define como as URLs de um site são mapeadas para as diferentes funcionalidades da aplicação$a
// Inclui arquivos de controlador necessários para lidar com diferentes ações
require 'controllers/AuthController.php'; // Inclui o controlador de autenticação
require 'controllers/UserController.php'; // Inclui o controlador de usuários
require 'controllers/DashboardController.php'; // Inclui o controlador do dashboard


// Cria instâncias dos controladores para utilizar seus métodos
$authController = new AuthController(); // Instancia o controlador de autenticação
$userController = new UserController(); // Instancia o controlador de usuários
$dashboardController = new DashboardController(); // Instancia o controlador do dashboard
$controller = new UserController();

// Coleta a ação da URL, se não houver ação definida, usa 'login' como padrão
$action = $_GET['action'] ?? 'login'; // Usa o operador de coalescência nula (??) para definir 'login' se 'action' não estiver presente

// Verifica a ação solicitada e chama o método apropriado do controlador
switch ($action) {
    case 'login':
        $authController->login(); // Chama o método de login do controlador de autenticação
        break;
    case 'ver-anotacoes':
        $controller->verAnotacoes(); // Chama o método de ver anotações do controlador de usuários
        break;
    case 'salvar-feedback':
        $userController->salvarFeedback(); // Chama o método de salvar feedback do controlador de usuários
        break;
    case 'total_anotacoes':
        $userController->listarUsuariosComContagemDeAnotacoes(); // Chama o método de total de anotações do controlador de usuários
        break;
    case 'atualizar-anotacao':
        $userController->atualizarAnotacao(); // Chama o método de atualizar anotação do controlador de usuários
        break;
    case 'excluir-anotacao':
        $userController->excluirAnotacao(); // Chama o método de excluir anotação do controlador de usuários
        break;
    case 'salvar-anotacao':
        $userController->salvarAnotacao(); // Chama o método de salvar anotação do controlador de usuários
        break;
    case 'listar-anotacoes-aluno':
        $userController->listarAnotacoesAluno(); // Chama o método de listar anotações de aluno do controlador de usuários
        break;
    case 'logout':
        $authController->logout(); // Chama o método de logout do controlador de autenticação
        break;
    case 'register':
        $userController->register(); // Chama o método de registro do controlador de usuários
        break;
    case 'dashboard':
        $dashboardController->index(); // Chama o método de exibição do dashboard do controlador do dashboard
        break;
    case 'list':
        $userController->list(); // Chama o método de listagem de usuários do controlador de usuários
        break;
    case 'edit':
        $userController->edit();
        break;
    case 'delete':
        $id = $_GET['id']; // Obtém o ID do usuário a ser excluído da URL
        $userController->delete($id); // Chama o método de exclusão do controlador de usuários passando o ID
        break;
    default:
        $authController->login(); // Caso a ação não corresponda a nenhum caso acima, redireciona para o login
        break;
}