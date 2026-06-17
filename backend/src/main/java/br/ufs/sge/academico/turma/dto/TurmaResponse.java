package br.ufs.sge.academico.turma.dto;

import br.ufs.sge.academico.turma.model.StatusTurma;
import br.ufs.sge.academico.turma.model.Turma;

/**
 * DTO de saída seguro contendo dados de turmas.
 */
public record TurmaResponse(
    Long id,
    String codigo,
    Integer capacidad, // Mantendo o mesmo nome da capacidade usado no frontend (tipos.ts espera: capacidade)
    Integer capacidade, // Adicionando também capacidade com e sem o typo para evitar qualquer inconsistência
    StatusTurma status,
    String periodoLetivo,
    Long disciplinaId,
    String disciplinaNome,
    String disciplinaCodigo,
    Long docenteId,
    String docenteNome
) {
    public static TurmaResponse fromEntity(Turma turma) {
        return new TurmaResponse(
            turma.getId(),
            turma.getCodigo(),
            turma.getCapacidade(),
            turma.getCapacidade(),
            turma.getStatus(),
            turma.getPeriodoLetivo(),
            turma.getDisciplina().getId(),
            turma.getDisciplina().getNome(),
            turma.getDisciplina().getCodigo(),
            turma.getDocente().getId(),
            turma.getDocente().getNome()
        );
    }
}
