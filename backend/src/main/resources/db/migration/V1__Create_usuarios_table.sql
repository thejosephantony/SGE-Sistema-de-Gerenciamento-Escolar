CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Inserindo um usuário administrador padrão (admin@sge.ufs.br / admin123)
-- A senha abaixo é o hash bcrypt de 'admin123'
INSERT INTO usuarios (nome, email, senha, perfil, ativo)
VALUES ('Administrador', 'admin@sge.ufs.br', '$2a$10$Wp8IhxH.yLwD7M45wG.mMe6V055nZ1M8QfBf3fK/yq8aQo04t72H.', 'ADMINISTRADOR', true);
