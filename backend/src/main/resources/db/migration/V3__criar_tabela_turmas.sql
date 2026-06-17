CREATE TABLE turmas (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL,
    capacidade INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANEJADA',
    periodo_letivo VARCHAR(30) NOT NULL,
    disciplina_id BIGINT NOT NULL REFERENCES disciplinas(id),
    docente_id BIGINT NOT NULL REFERENCES usuarios(id)
);
