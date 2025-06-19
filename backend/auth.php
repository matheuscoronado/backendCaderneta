<?php
// Arquivo middleware -  camada intermediária entre a requisição do usuário e a lógica principal da aplicação que serve para interceptar e processar a requisição antes que ela continue. Em sistemas com autenticação é usado principalmente para proteger páginas que só devem ser acessadas por usuários logados ou com certos perfis.
session_start(); // Inicia uma nova sessão ou retoma a sessão atual. Isso é necessário para acessar variáveis de sessão.

if (!isset($_SESSION['usuario_id'])) { // Verifica se a variável de sessão 'usuario_id' está definida.
    header('Location: index.php?action=login'); // Redireciona o usuário para a página de login se a variável 'usuario_id' não estiver definida.
    exit; // Interrompe a execução do script após o redirecionamento para garantir que o código abaixo não seja executado.
}