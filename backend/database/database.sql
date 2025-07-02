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

-- Atividades Práticas
CREATE TABLE Atividade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aluno_id INT,
    titulo VARCHAR(100),
    subtitulo VARCHAR(100),
    descricao TEXT,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES Usuario(id)
);

-- Feedback
CREATE TABLE Feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT,
    atividade_id INT,
    comentario TEXT,
    data_feedback DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES Usuario(id),
    FOREIGN KEY (atividade_id) REFERENCES Atividade(id)
);