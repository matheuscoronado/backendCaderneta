CREATE DATABASE cadernetadigital;
USE cadernetadigital;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo ENUM('aluno', 'professor', 'administrador') NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE atividade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    titulo ENUM(
        'Sinais Vitais - Conceitos Gerais', 
        'Temperatura Corporal', 
        'Pulso e Frequência Cardíaca', 
        'Frequência Respiratória', 
        'Pressão Arterial', 
        'Dor como Sinal Vital', 
        'Administração de Medicamentos - Vias Oral e Sublingual',
        'Administração Parenteral - IM, ID, SC', 
        'Administração Endovenosa e Inalatória'
    ) NOT NULL,
    subtitulo VARCHAR(100),
    descricao TEXT,
    data_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atividade_aluno FOREIGN KEY (aluno_id) REFERENCES usuario(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_aluno_id (aluno_id)
);

CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NULL, -- Alterado para aceitar NULL
    atividade_id INT NOT NULL,
    comentario TEXT NOT NULL,
    data_feedback DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_professor FOREIGN KEY (professor_id) REFERENCES usuario(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_feedback_atividade FOREIGN KEY (atividade_id) REFERENCES atividade(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_professor_id (professor_id),
    INDEX idx_atividade_id (atividade_id)
);
