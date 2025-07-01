<?php
// Definição da classe UserController, responsável por gerenciar as ações relacionadas aos usuários
class UserController
{
    // Função para registrar um novo usuário
    public function register()
    {
        // Verifica se a requisição HTTP é do tipo POST (se o formulário foi enviado)
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Coleta os dados enviados pelo formulário e organiza em um array
            $data = [
                'nome' => $_POST['nome'], // Nome do usuário
                'email' => $_POST['email'], // E-mail do usuário
                'senha_hash' => password_hash($_POST['senha_hash'], PASSWORD_DEFAULT), // Criptografa a senha
                'tipo' => $_POST['tipo'] // Perfil do usuário 
            ];
            // Chama o método create do Model User para criar o novo usuário no banco de dados
            User::create($data);
            // Após o registro, redireciona o usuário para a página inicial
            header('Location: index.php?action=dashboard');
        } else {
            // Se a requisição não for POST (por exemplo, GET), carrega a página de registro
            include 'views/register.php';
        }
    }

    // Função para editar os dados de um usuário existente
    public function edit($id)
    {
        session_start();
        // Permitir apenas admin editar usuários
        if ($_SESSION['tipo'] == 'administrador') {
            $user = User::find($id);

            if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                $data = [
                    'nome' => $_POST['nome'],
                    'email' => $_POST['email'],
                    'senha_hash' => password_hash($_POST['senha_hash'], PASSWORD_DEFAULT), // Criptografa a senha
                    'tipo' => $_POST['tipo']
                ];

                User::update($id, $data);
                header('Location: index.php?action=dashboard');
            } else {
                include 'views/edit_user.php';
            }
        } else {
            // Exibir mensagem de erro se não tiver permissão
            echo "Você não tem permissão para editar usuários.";
        }
    }


    // Função para excluir um usuário
    public function delete($id)
    {
        // Chama o método delete do Model User para remover o usuário pelo ID
        User::delete($id);
        // Após a exclusão, redireciona para a lista de usuários
        header('Location: index.php?action=dashboard');
    }

    // Função para listar todos os usuários
    public function list()
    {
        // Chama o método all do Model User para obter todos os usuários do banco de dados
        $users = User::all();
        // Inclui a View que exibe a lista de usuários
        include 'views/list_users.php';
    }

    public function verAnotacoes()
{
    if (!isset($_GET['aluno_id'])) {
        echo "ID do aluno não fornecido.";
        exit;
    }

    $alunoId = $_GET['aluno_id'];

    $aluno = User::buscarAlunoPorId($alunoId);
    if (!$aluno) {
        echo "Aluno não encontrado.";
        exit;
    }

    $cadernetas = User::buscarAnotacoesPorAluno($alunoId);

    include 'views/anotacoes.php';
}



}