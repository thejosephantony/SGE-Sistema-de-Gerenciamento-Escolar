package br.ufs.sge.ava.atividade.dto;

import br.ufs.sge.ava.atividade.model.Atividade;
import br.ufs.sge.ava.atividade.model.StatusAtividade;
import java.time.LocalDateTime;

public record AtividadeResponse(
        Long id, String titulo, String descricao, LocalDateTime prazo,
        LocalDateTime dataPublicacao, StatusAtividade status,
        Long turmaId, String turmaCode, Long docenteId, String docenteNome
) {
    public static AtividadeResponse fromEntity(Atividade a) {
        return new AtividadeResponse(
                a.getId(), a.getTitulo(), a.getDescricao(), a.getPrazo(),
                a.getDataPublicacao(), a.getStatus(),
                a.getTurma().getId(), a.getTurma().getCodigo(),
                a.getDocente().getId(), a.getDocente().getNome());
    }
}
