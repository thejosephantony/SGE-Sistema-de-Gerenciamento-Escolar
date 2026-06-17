package br.ufs.sge.ava.material.dto;

import br.ufs.sge.ava.material.model.MaterialDidatico;
import java.time.LocalDateTime;

public record MaterialDidaticoResponse(
        Long id, String titulo, String descricao, String linkArquivo,
        LocalDateTime dataPublicacao, Long turmaId, String turmaCode,
        Long docenteId, String docenteNome
) {
    public static MaterialDidaticoResponse fromEntity(MaterialDidatico m) {
        return new MaterialDidaticoResponse(
                m.getId(), m.getTitulo(), m.getDescricao(), m.getLinkArquivo(),
                m.getDataPublicacao(), m.getTurma().getId(), m.getTurma().getCodigo(),
                m.getDocente().getId(), m.getDocente().getNome());
    }
}
