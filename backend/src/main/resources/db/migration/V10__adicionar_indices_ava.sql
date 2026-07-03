-- Índices para melhorar performance das consultas mais frequentes do AVA

-- Materiais: busca por turma (listagem na tela do aluno/professor)
CREATE INDEX IF NOT EXISTS idx_materiais_turma_id
    ON materiais_didaticos (turma_id);

-- Materiais: busca por docente (para filtrar materiais próprios)
CREATE INDEX IF NOT EXISTS idx_materiais_docente_id
    ON materiais_didaticos (docente_id);

-- Atividades: busca por turma (listagem na tela do aluno/professor)
CREATE INDEX IF NOT EXISTS idx_atividades_turma_id
    ON atividades (turma_id);

-- Atividades: busca por status (filtrar atividades abertas)
CREATE INDEX IF NOT EXISTS idx_atividades_status
    ON atividades (status);

-- Entregas: busca por atividade (docente vê todas as entregas de uma atividade)
CREATE INDEX IF NOT EXISTS idx_entregas_atividade_id
    ON entregas_atividades (atividade_id);

-- Entregas: busca por discente (aluno vê suas próprias entregas)
CREATE INDEX IF NOT EXISTS idx_entregas_discente_id
    ON entregas_atividades (discente_id);

-- Matrículas: busca por turma (diário de classe do professor)
CREATE INDEX IF NOT EXISTS idx_matriculas_turma_id
    ON matriculas (turma_id);

-- Matrículas: busca por discente (boletim do aluno)
CREATE INDEX IF NOT EXISTS idx_matriculas_discente_id
    ON matriculas (discente_id);

-- Matrículas: busca por status (contar ativos para capacidade)
CREATE INDEX IF NOT EXISTS idx_matriculas_status
    ON matriculas (status);
