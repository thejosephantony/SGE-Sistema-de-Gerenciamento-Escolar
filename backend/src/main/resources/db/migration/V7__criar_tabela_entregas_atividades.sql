CREATE TABLE entregas_atividades (
    id              BIGSERIAL   PRIMARY KEY,
    texto_resposta  TEXT,
    link_arquivo    TEXT,
    data_entrega    TIMESTAMP   NOT NULL DEFAULT NOW(),
    status          VARCHAR(20) NOT NULL DEFAULT 'ENVIADA',
    atividade_id    BIGINT      NOT NULL REFERENCES atividades(id),
    discente_id     BIGINT      NOT NULL REFERENCES usuarios(id),
    CONSTRAINT uq_entrega_atividade_discente UNIQUE (atividade_id, discente_id)
);
