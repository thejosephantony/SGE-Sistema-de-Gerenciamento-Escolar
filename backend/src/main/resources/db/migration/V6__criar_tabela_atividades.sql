CREATE TABLE atividades (
    id               BIGSERIAL    PRIMARY KEY,
    titulo           VARCHAR(120) NOT NULL,
    descricao        TEXT,
    prazo            TIMESTAMP    NOT NULL,
    data_publicacao  TIMESTAMP    NOT NULL DEFAULT NOW(),
    status           VARCHAR(20)  NOT NULL DEFAULT 'ABERTA',
    turma_id         BIGINT       NOT NULL REFERENCES turmas(id),
    docente_id       BIGINT       NOT NULL REFERENCES usuarios(id)
);
