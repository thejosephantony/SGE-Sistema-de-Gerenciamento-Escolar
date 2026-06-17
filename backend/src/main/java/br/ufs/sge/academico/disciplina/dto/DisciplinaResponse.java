package br.ufs.sge.academico.disciplina.dto;

import br.ufs.sge.academico.disciplina.model.Disciplina;
import br.ufs.sge.academico.disciplina.model.StatusDisciplina;

/**
 * DTO de resposta contendo os dados expostos da disciplina.
 */
public record DisciplinaResponse(
    Long id,
    String nome,
    String codigo,
    Integer cargaHoraria,
    String ementa,
    StatusDisciplina status
) {
    public static DisciplinaResponse fromEntity(Disciplina disciplina) {
        return new DisciplinaResponse(
            disciplina.getId(),
            disciplina.getNome(),
            disciplina.getCodigo(),
            disciplina.getCargaHoraria(),
            disciplina.getEmenta(),
            disciplina.getStatus()
        );
    }
}
