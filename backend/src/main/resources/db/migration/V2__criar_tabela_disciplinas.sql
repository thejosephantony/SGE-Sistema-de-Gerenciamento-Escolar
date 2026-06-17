CREATE TABLE disciplinas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    carga_horaria INTEGER NOT NULL,
    ementa TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO'
);
