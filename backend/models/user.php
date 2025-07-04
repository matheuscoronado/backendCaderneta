<?php
// Inclui o arquivo 'database.php' que contém a classe Database para gerenciar a conexão com o banco de dados
require_once 'models/database.php';

// Definição da classe User, que representa as operações relacionadas aos usuários no sistema
class User
{
     // Função para encontrar um usuário pelo email
     public static function findByEmail($email)
     {
         // Obtém a conexão com o banco de dados
         $conn = Database::getConnection();
         
         // Prepara uma consulta SQL para buscar o usuário pelo email
         $stmt = $conn->prepare("SELECT * FROM usuario WHERE email = :email");
         
         // Executa a consulta com o email passado como parâmetro
         $stmt->execute(['email' => $email]);
         
         // Retorna os dados do usuário encontrado como um array associativo
         return $stmt->fetch(PDO::FETCH_ASSOC);
     }

    // Função para encontrar um usuário pelo ID
    public static function find($id)
    {
        // Obtém a conexão com o banco de dados usando o método getConnection da classe Database
        $conn = Database::getConnection();
        
        // Prepara uma consulta SQL para buscar o usuário pelo ID
        $stmt = $conn->prepare("SELECT * FROM usuario WHERE id = :id");
        
        // Executa a consulta com o valor do ID passado como parâmetro
        $stmt->execute(['id' => $id]);
        
        // Retorna os dados do usuário encontrado como um array associativo
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

        // Função para criar um novo usuário no banco de dados
        public static function create($data)
        {
            // Obtém a conexão com o banco de dados
            $conn = Database::getConnection();
            
            // Prepara uma consulta SQL para inserir um novo usuário na tabela 'usuario'
            $stmt = $conn->prepare("INSERT INTO usuario (nome, email, senha_hash, tipo) VALUES (:nome, :email, :senha_hash, :tipo)");
            
            // Executa a consulta, passando os dados do novo usuário (nome, email, senha e perfil)
            $stmt->execute($data);
        }
        
    // Função para buscar todos os usuários do banco de dados
    public static function all()
    {
        // Obtém a conexão com o banco de dados
        $conn = Database::getConnection();
        
        // Executa uma consulta SQL simples para buscar todos os registros da tabela 'usuarios'
        $stmt = $conn->query("SELECT * FROM usuario");
        
        // Retorna todos os resultados como um array associativo
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Função para atualizar os dados de um usuário existente
    public static function update($id, $data)
    {
        // Obtém a conexão com o banco de dados
        $conn = Database::getConnection();
            
        // Prepara uma consulta SQL para atualizar o nome, email e perfil de um usuário baseado no ID
        $stmt = $conn->prepare("UPDATE usuario SET nome = :nome, email = :email, senha_hash = :senha_hash, tipo = :tipo WHERE id = :id");
        
        // Adiciona o ID ao array de dados que será usado na consulta
        $data['id'] = $id;
        
        // Executa a consulta para atualizar os dados do usuário
        $stmt->execute($data);
    }

    // Função para excluir um usuário pelo ID
    public static function delete($id)  
    {
        // Obtém a conexão com o banco de dados
        $conn = Database::getConnection();
        
        // Prepara uma consulta SQL para excluir o usuário baseado no ID
        $stmt = $conn->prepare("DELETE FROM usuario WHERE id = :id");
        
        // Executa a consulta com o ID do usuário a ser excluído
        $stmt->execute(['id' => $id]);
    }


    // Função para buscar anotações de um aluno específico
    public static function buscarAnotacoesPorAluno($alunoId)
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("SELECT * FROM atividade WHERE aluno_id = :aluno_id ORDER BY data_registro DESC");
        $stmt->execute([':aluno_id' => $alunoId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Função para buscar o nome de um aluno pelo ID

    public static function buscarAlunoPorId($alunoId)
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("SELECT nome FROM usuario WHERE id = :id AND tipo = 'aluno'");
        $stmt->execute([':id' => $alunoId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Função para salvar feedback de um professor sobre uma atividade
    public static function salvarFeedback($professor_id, $atividade_id, $comentario) 
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("INSERT INTO Feedback (professor_id, atividade_id, comentario, data_feedback) VALUES (?, ?, ?, NOW())");
        return $stmt->execute([$professor_id, $atividade_id, $comentario]);
    }

    // Função para listar todos os feedbacks de uma atividade específica

    public static function listarFeedbacksPorAtividade($atividade_id) 
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("SELECT F.comentario, U.nome AS professor_nome, F.data_feedback
                            FROM Feedback F
                            JOIN Usuario U ON F.professor_id = U.id
                            WHERE F.atividade_id = ?
                            ORDER BY F.data_feedback DESC");
        $stmt->execute([$atividade_id]);
        return $stmt->fetchAll();
    }

    // Função para salvar uma anotação de um aluno

    public static function salvarAnotacao($alunoId, $titulo, $subtitulo, $descricao)
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("INSERT INTO atividade (aluno_id, titulo, subtitulo, descricao) 
                                VALUES (:aluno_id, :titulo, :subtitulo, :descricao)");
        return $stmt->execute([
            ':aluno_id' => $alunoId,
            ':titulo' => $titulo,
            ':subtitulo' => $subtitulo,
            ':descricao' => $descricao
        ]);
    }

    // Função para buscar uma anotação específica pelo ID
    public static function buscarAnotacaoPorId($id)
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("SELECT * FROM atividade WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

// Função para atualizar uma anotação existente
    
    public static function atualizarAnotacao($id, $titulo, $subtitulo,  $descricao)
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("UPDATE atividade SET titulo = :titulo, subtitulo = :subtitulo, descricao = :descricao WHERE id = :id");
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':subtitulo', $subtitulo);
        $stmt->bindParam(':descricao', $descricao);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Função para excluir uma anotação pelo ID

    public static function excluirAnotacao($id)
    {
        $conn = Database::getConnection();
        $stmt = $conn->prepare("DELETE FROM atividade WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

}
