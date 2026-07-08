CREATE TABLE tokens_recuperacao_senha (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    token VARCHAR(120) NOT NULL UNIQUE,
    data_expiracao TIMESTAMP NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tokens_recuperacao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_tokens_recuperacao_senha_token
    ON tokens_recuperacao_senha(token);

CREATE INDEX idx_tokens_recuperacao_senha_usuario
    ON tokens_recuperacao_senha(usuario_id);
