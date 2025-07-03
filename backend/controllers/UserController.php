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

    // função para exibir as anotações de um aluno específico
    // Esta função é chamada quando um professor deseja ver as anotações de um aluno específico

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

        $atividade = User::buscarAnotacoesPorAluno($alunoId);

        include 'views/views_prof.php';
    }

    public function salvarFeedback() {
    session_start();

    if (!isset($_SESSION['usuario_id']) || $_SESSION['tipo'] !== 'professor') {
        http_response_code(403);
        echo json_encode(['erro' => 'Acesso negado']);
        return;
    }

    $professor_id = $_SESSION['usuario_id'];
    $atividade_id = $_POST['atividade_id'] ?? null;
    $comentario = trim($_POST['comentario'] ?? '');

    if (!$atividade_id || empty($comentario)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Dados incompletos']);
        return;
    }

    try {
        $sucesso = User::salvarFeedback($professor_id, $atividade_id, $comentario);
        
        if ($sucesso) {
            // Busca os dados atualizados para retornar
            $feedback = [
                'professor_nome' => $_SESSION['nome'] ?? 'Professor',
                'comentario' => $comentario,
                'data_feedback' => date('Y-m-d H:i:s')
            ];
            
            echo json_encode([
                'sucesso' => true,
                'feedback' => $feedback
            ]);
        } else {
            echo json_encode([
                'sucesso' => false,
                'erro' => 'Falha ao salvar no banco de dados'
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'erro' => 'Erro no servidor: ' . $e->getMessage()
        ]);
    }
}

    public function listarFeedbacks($atividade_id) {
        return User::listarFeedbacksPorAtividade($atividade_id);
    }

    // Função para salvar uma anotação feita por um aluno

    public function salvarAnotacao()
    {
        session_start();

        $dados = json_decode(file_get_contents("php://input"), true);
        $titulo = $dados['titulo'] ?? '';
        $subtitulo = $dados['subtitulo'] ?? '';
        $descricao = $dados['descricao'] ?? '';
        $alunoId = $_SESSION['id'] ?? null;

        if (!$alunoId || empty($titulo) || empty($subtitulo) || empty($descricao)) {
            echo json_encode(['erro' => 'Dados inválidos ou sessão expirada']);
            return;
        }

        require_once 'models/User.php';
        $userModel = new User();
        $salvo = $userModel->salvarAnotacao($alunoId, $titulo, $subtitulo, $descricao);

        echo json_encode([
            'mensagem' => $salvo ? 'Anotação salva com sucesso!' : 'Erro ao salvar anotação.'
        ]);
    }




}