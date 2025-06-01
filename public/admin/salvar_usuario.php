<?php
// Evita que warnings/erros sejam enviados no output JSON
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Importa a classe User
require_once 'backend/models/database.php';
require_once 'backend/models/user.php';

// Define que a saída será JSON
header('Content-Type: application/json');

// Função para enviar resposta JSON e encerrar script
function responder($success, $message = '') {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Só aceita método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método inválido.');
}

// Usa $_POST porque o frontend envia FormData (multipart/form-data)
$nome = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['password'] ?? '';
$funcao = $_POST['funcao'] ?? '';

// Validação básica
if (empty($nome) || empty($email) || empty($senha) || empty($funcao)) {
    responder(false, 'Todos os campos são obrigatórios.');
}

try {
    // Verifica se o e-mail já existe
    if (User::findByEmail($email)) {
        responder(false, 'E-mail já cadastrado.');
    }

    // Cria dados para salvar
    $data = [
        'nome' => $nome,
        'email' => $email,
        'senha' => password_hash($senha, PASSWORD_DEFAULT),
        'tipo' => $funcao
    ];

    // Salva usuário
    User::create($data);

    // Sucesso
    responder(true);

} catch (PDOException $e) {
    responder(false, 'Erro ao salvar: ' . $e->getMessage());
} catch (Exception $e) {
    responder(false, 'Erro inesperado: ' . $e->getMessage());
}
