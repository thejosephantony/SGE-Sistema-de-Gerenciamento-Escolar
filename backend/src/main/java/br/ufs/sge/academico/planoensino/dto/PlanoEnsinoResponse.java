package br.ufs.sge.academico.planoensino.dto;

import br.ufs.sge.academico.planoensino.model.PlanoEnsino;

import java.time.LocalDateTime;

/**
 * Dados retornados ao frontend ao consultar um plano de ensino.
 */
public record PlanoEnsinoResponse(
        Long id,
        Long turmaId,
        String turmaCodigo,
        String periodoLetivo,
        Long disciplinaId,
        String disciplinaCodigo,
        String disciplinaNome,
        Long docenteId,
        String docenteNome,
        String ementa,
        String objetivos,
        String conteudoProgramatico,
        String metodologia,
        String avaliacao,
        String bibliografia,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {

    public static PlanoEnsinoResponse fromEntity(PlanoEnsino plano) {
        return new PlanoEnsinoResponse(
                plano.getId(),
                plano.getTurma().getId(),
                plano.getTurma().getCodigo(),
                plano.getTurma().getPeriodoLetivo(),
                plano.getTurma().getDisciplina().getId(),
                plano.getTurma().getDisciplina().getCodigo(),
                plano.getTurma().getDisciplina().getNome(),
                plano.getTurma().getDocente().getId(),
                plano.getTurma().getDocente().getNome(),
                plano.getEmenta(),
                plano.getObjetivos(),
                plano.getConteudoProgramatico(),
                plano.getMetodologia(),
                plano.getAvaliacao(),
                plano.getBibliografia(),
                plano.getCriadoEm(),
                plano.getAtualizadoEm()
        );
    }
}
