<?php
// Definição da classe DashboardController, responsável por gerenciar a exibição do painel (dashboard)
class DashboardController
{
    // Função index, responsável por exibir a página do dashboard
    public function index()
    {
        // Inicia uma sessão para verificar se o usuário está autenticado
        session_start();

        // Verifica se a variável de sessão 'usuario_id' está definida
        // Se não estiver, significa que o usuário não está autenticado
        if (!isset($_SESSION['usuario_id'])) {
            // Redireciona o usuário de volta para a página inicial (ou login) se ele não estiver logado
            header('Location: index.php');
            exit; // Garante que o script seja interrompido após o redirecionamento
        }

        // Se o usuário estiver autenticado, inclui a View 'dashboard.php', que exibe o painel de controle
        include 'views/dashboard.php';
    }
}
?>