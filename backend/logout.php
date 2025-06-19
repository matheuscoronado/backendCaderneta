<?php
session_start();
session_destroy(); // Destroi todas as variáveis de sessão
header('Location: index.php?action=login'); // Redireciona para a página de login
exit(); // Garante que o script será interrompido após o redirecionamento
?>