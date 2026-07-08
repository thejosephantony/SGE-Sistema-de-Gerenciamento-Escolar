CREATE TABLE planos_ensino (
    id BIGSERIAL PRIMARY KEY,
    turma_id BIGINT NOT NULL UNIQUE,

    ementa TEXT NOT NULL,
    objetivos TEXT NOT NULL,
    conteudo_programatico TEXT NOT NULL,
    metodologia TEXT NOT NULL,
    avaliacao TEXT NOT NULL,
    bibliografia TEXT,

    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_planos_ensino_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_planos_ensino_turma
    ON planos_ensino(turma_id);
