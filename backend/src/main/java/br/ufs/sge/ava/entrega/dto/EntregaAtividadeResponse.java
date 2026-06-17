package br.ufs.sge.ava.entrega.dto;

import br.ufs.sge.ava.entrega.model.EntregaAtividade;
import br.ufs.sge.ava.entrega.model.StatusEntrega;
import java.time.LocalDateTime;

public record EntregaAtividadeResponse(
        Long id, String textoResposta, String linkArquivo,
        LocalDateTime dataEntrega, StatusEntrega status,
        Long atividadeId, String atividadeTitulo,
        Long discenteId, String discenteNome
) {
    public static EntregaAtividadeResponse fromEntity(EntregaAtividade e) {
        return new EntregaAtividadeResponse(
                e.getId(), e.getTextoResposta(), e.getLinkArquivo(),
                e.getDataEntrega(), e.getStatus(),
                e.getAtividade().getId(), e.getAtividade().getTitulo(),
                e.getDiscente().getId(), e.getDiscente().getNome());
    }
}
