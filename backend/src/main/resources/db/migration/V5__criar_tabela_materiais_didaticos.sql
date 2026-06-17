CREATE TABLE materiais_didaticos (
    id               BIGSERIAL    PRIMARY KEY,
    titulo           VARCHAR(120) NOT NULL,
    descricao        TEXT,
    link_arquivo     TEXT,
    data_publicacao  TIMESTAMP    NOT NULL DEFAULT NOW(),
    turma_id         BIGINT       NOT NULL REFERENCES turmas(id),
    docente_id       BIGINT       NOT NULL REFERENCES usuarios(id)
);
