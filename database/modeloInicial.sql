create database cadernetaDigital;

use cadernetaDigital;

-- Usuários (Alunos, Professores, Admins)
CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha_hash VARCHAR(255),
    tipo ENUM('aluno', 'professor', 'administrador'),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cursos (Enfermagem, Radiologia etc.)
CREATE TABLE Curso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT
);

-- Turmas
CREATE TABLE Turma (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    curso_id INT,
    ano INT,
    semestre INT,
    FOREIGN KEY (curso_id) REFERENCES Curso(id)
);

-- Disciplinas
CREATE TABLE Disciplina (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    curso_id INT,
    FOREIGN KEY (curso_id) REFERENCES Curso(id)
);

-- Estágios
CREATE TABLE Estagio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT,
    local VARCHAR(255),
    inicio DATE,
    fim DATE,
    supervisor_id INT,
    validado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (aluno_id) REFERENCES Usuario(id),
    FOREIGN KEY (supervisor_id) REFERENCES Usuario(id)
);

-- Atividades Práticas
CREATE TABLE Atividade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    data DATE,
    disciplina_id INT,
    professor_id INT,
    FOREIGN KEY (disciplina_id) REFERENCES Disciplina(id),
    FOREIGN KEY (professor_id) REFERENCES Usuario(id)
);

-- Cadernos de Anotações
CREATE TABLE Caderneta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT,
    atividade_id INT,
    conteudo TEXT,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Usuario(id),
    FOREIGN KEY (atividade_id) REFERENCES Atividade(id)
);

-- Feedback
CREATE TABLE Feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    caderneta_id INT,
    professor_id INT,
    comentario TEXT,
    data_feedback DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caderneta_id) REFERENCES Caderneta(id),
    FOREIGN KEY (professor_id) REFERENCES Usuario(id)
);

-- Relatórios
CREATE TABLE Relatorio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT,
    conteudo TEXT,
    data_envio DATETIME,
    aprovado BOOLEAN DEFAULT FALSE,
    avaliador_id INT,
    FOREIGN KEY (aluno_id) REFERENCES Usuario(id),
    FOREIGN KEY (avaliador_id) REFERENCES Usuario(id)
);

-- Notificações
CREATE TABLE Notificacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    mensagem TEXT,
    lida BOOLEAN DEFAULT FALSE,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Comunicação entre Usuários
CREATE TABLE Mensagem (
    id INT PRIMARY KEY AUTO_INCREMENT,
    remetente_id INT,
    destinatario_id INT,
    mensagem TEXT,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (remetente_id) REFERENCES Usuario(id),
    FOREIGN KEY (destinatario_id) REFERENCES Usuario(id)
);

-- Permissões / Papéis Extras (caso queira granularidade maior)
CREATE TABLE Permissao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    descricao TEXT
);

CREATE TABLE UsuarioPermissao (
    usuario_id INT,
    permissao_id INT,
    PRIMARY KEY (usuario_id, permissao_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (permissao_id) REFERENCES Permissao(id)
);

-- Instituição
CREATE TABLE Instituicao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    endereco TEXT,
    telefone VARCHAR(20)
);

-- Log de Acesso
CREATE TABLE LogAcesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    acao TEXT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Anexos
CREATE TABLE Anexo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    caderneta_id INT,
    nome_arquivo VARCHAR(255),
    tipo_arquivo VARCHAR(50),
    caminho_arquivo TEXT,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caderneta_id) REFERENCES Caderneta(id)
);