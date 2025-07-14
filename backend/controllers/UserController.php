<?php

// Definição da classe UserController, responsável por gerenciar as ações relacionadas aos usuários
class UserController
{
    // Função para registrar um novo usuário
    public function register()
    {
        session_start(); // garante que a sessão está ativa

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Recebe dados do formulário
            $nome = trim($_POST['nome']);
            $email = trim($_POST['email']);
            $senha = $_POST['senha_hash'];
            $tipo = $_POST['tipo'];

            // Validação básica
            if (empty($nome) || empty($email) || empty($senha)) {
                $_SESSION['erro_cadastro'] = "Por favor, preencha todos os campos.";
                $_SESSION['abrir_modal_cadastro'] = true;
                $_SESSION['dados_cadastro'] = [
                    'nome' => $nome,
                    'email' => $email,
                    'tipo' => $tipo
                ];
                header('Location: index.php?action=dashboard');
                exit;
            }

            // Verifica se já existe usuário com esse email
            if (User::emailExists($email)) {
                $_SESSION['erro_cadastro'] = "O email informado já está cadastrado.";
                $_SESSION['abrir_modal_cadastro'] = true;
                $_SESSION['dados_cadastro'] = [
                    'nome' => $nome,
                    'email' => $email,
                    'tipo' => $tipo
                ];
                header('Location: index.php?action=dashboard');
                exit;
            }

            // Se email não existe, cria usuário normalmente
            $data = [
                'nome' => $nome,
                'email' => $email,
                'senha_hash' => password_hash($senha, PASSWORD_DEFAULT),
                'tipo' => $tipo
            ];

            User::create($data);
            header('Location: index.php?action=dashboard');
            exit;
        } else {
            include 'views/register.php';
        }
    }



    // Função para editar os dados de um usuário existente
    public function edit()
    {
        session_start();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $email = $_POST['email'];

            // Se o e-mail já existe em outro usuário
            if (User::emailExisteParaOutroUsuario($email, $id)) {
                $_SESSION['erro'] = "O e-mail já está em uso por outro usuário.";
                $_SESSION['abrir_modal'] = true;

                // Salva os dados no session para reusar no modal
                $_SESSION['dados_edicao'] = [
                    'id' => $id,
                    'nome' => $_POST['nome'],
                    'email' => $email,
                    'tipo' => $_POST['tipo']
                ];

                header('Location: index.php?action=dashboard');
                exit;
            }

            // Prepara os dados para update
            $data = [
                'nome' => $_POST['nome'],
                'email' => $email,
                'tipo' => $_POST['tipo']
            ];

            if (isset($_POST['senha_hash']) && trim($_POST['senha_hash']) !== '') {
                $data['senha_hash'] = password_hash($_POST['senha_hash'], PASSWORD_DEFAULT);
            }

            User::update($id, $data);

            // Atualiza sessão se o usuário editado for o usuário logado
            if ($_SESSION['id'] == $id) {
                $_SESSION['nome'] = $data['nome'];
                $_SESSION['email'] = $data['email'];
                $_SESSION['tipo'] = $data['tipo'];
            }

            $_SESSION['sucesso'] = "Usuário atualizado com sucesso.";
            header('Location: index.php?action=dashboard');
            exit;
        } else {
            include 'views/dashboard.php';
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

    // Função para salvar feedback de um professor sobre uma atividade

    public function salvarFeedback() 
    {
        session_start();

        if (!isset($_SESSION['usuario_id']) || $_SESSION['tipo'] !== 'professor') 
        {
            http_response_code(403);
            echo json_encode(['erro' => 'Acesso negado']);
            return;
        }

            $professor_id = $_SESSION['usuario_id'];
            $atividade_id = $_POST['atividade_id'] ?? null;
            $comentario = trim($_POST['comentario'] ?? '');

        if (!$atividade_id || empty($comentario)) 
        {
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

    // Função para listar feedbacks de uma atividade específica

    public function listarFeedbacks($atividade_id) 
    {
        return User::listarFeedbacksPorAtividade($atividade_id);
    }

    // Função para salvar uma anotação feita por um aluno

    public function salvarAnotacao()
    {
        session_start();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $alunoId = $_SESSION['usuario_id'];
            $titulo = $_POST['titulo'];
            $subtitulo = $_POST['subtitulo'];
            $descricao = $_POST['descricao'];

            if (empty($titulo) || empty($subtitulo) || empty($descricao)) {
                echo "Todos os campos são obrigatórios!";
                return;
            }
            User::salvarAnotacao($alunoId, $titulo, $subtitulo, $descricao);
        }
    }

    // Função para listar as anotações de um aluno específico
    public function listarAnotacoesAluno() 
    {
        session_start();
        $alunoId = $_SESSION['usuario_id'];

        if (!$alunoId) {
            echo json_encode([]);
            return;
        }

        require_once 'models/User.php';
        $userModel = new User();
        $anotacoes = $userModel->buscarAnotacoesPorAluno($alunoId);

        echo json_encode($anotacoes);
    }

    // Funções para gerenciar anotações (CRUD)

    public function getAnotacao()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode(['erro' => 'ID não fornecido']);
            return;
        }

        $anotacao = User::buscarAnotacaoPorId($id);

        if ($anotacao) {
            echo json_encode($anotacao);
        } else {
            echo json_encode(['erro' => 'Anotação não encontrada']);
        }
    }


    // Função para atualizar uma anotação existente

    public function atualizarAnotacao()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'] ?? null;
            $titulo = $_POST['titulo'] ?? '';
            $subtitulo = $_POST['subtitulo'] ?? ''; 
            $descricao = $_POST['descricao'] ?? '';

            if (!$id || empty($titulo) || empty($subtitulo) || empty($descricao)) {
                echo json_encode(['erro' => 'Campos obrigatórios ausentes.']);
                return;
            }

            $resultado = User::atualizarAnotacao($id, $titulo, $subtitulo, $descricao);

            if ($resultado) {
                echo json_encode(['sucesso' => true]);
            } else {
                echo json_encode(['erro' => 'Erro ao atualizar anotação.']);
            }
        }
    }

    // Função para excluir uma anotação existente

    public function excluirAnotacao()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'] ?? null;

            if (!$id) {
                echo json_encode(['erro' => 'ID não fornecido']);
                return;
            }

            $excluido = User::excluirAnotacao($id);

            if ($excluido) {
                echo json_encode(['sucesso' => true]);
            } else {
                echo json_encode(['erro' => 'Erro ao excluir anotação']);
            }
        }
    }

    // Função para listar todos os usuários com a contagem de anotações para cada aluno

    public function listarUsuariosComContagemDeAnotacoes() 
    {
        $usuarios = User::all(); 

        foreach ($usuarios as &$usuario) {
            if ($usuario['tipo'] === 'aluno') {
                $usuario['total_anotacoes'] = User::contarAnotacoesPorAluno($usuario['id']);
            }
        }
        return $usuarios;
    }

}

// Verifica se o parâmetro 'action' está definido na URL e se seu valor é 'listarFeedbacksPorAtividade',
// e também se o parâmetro 'atividade_id' está presente
if (isset($_GET['action']) && $_GET['action'] === 'listarFeedbacksPorAtividade' && isset($_GET['atividade_id'])) {
    
    // Inclui o arquivo que contém a definição da classe UserController
    require_once 'models/user.php'; 

    // Desabilita a exibição de erros para o usuário (para evitar mostrar erros no JSON)
    error_reporting(0);
    ini_set('display_errors', 0);

    // Limpa qualquer conteúdo que possa ter sido enviado antes (como espaços ou quebras de linha)
    ob_clean();

    // Cria uma instância do controlador de usuários
    $userController = new UserController();

    // Chama o método para listar feedbacks relacionados à atividade cujo ID foi passado via GET
    $feedbacks = $userController->listarFeedbacks($_GET['atividade_id']);

    // Define o cabeçalho da resposta HTTP como JSON
    header('Content-Type: application/json');

    // Converte o array de feedbacks em JSON e envia na resposta
    echo json_encode($feedbacks);

    // Encerra a execução do script para garantir que nada mais será enviado
    exit;
}
