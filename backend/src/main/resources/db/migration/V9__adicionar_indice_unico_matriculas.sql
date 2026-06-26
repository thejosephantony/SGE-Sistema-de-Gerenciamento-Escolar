/*
 * Garante que o mesmo discente não seja matriculado
 * mais de uma vez na mesma turma.
 *
 * A combinação discente_id + turma_id deve ser única.
 */
CREATE UNIQUE INDEX IF NOT EXISTS uk_matriculas_discente_turma
ON matriculas (discente_id, turma_id);