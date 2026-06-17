package br.ufs.sge.ava.entrega.dto;

import jakarta.validation.constraints.NotNull;

public record EntregaAtividadeRequest(
        String textoResposta,
        String linkArquivo,
        @NotNull(message = "ID da atividade é obrigatório") Long atividadeId
) {}
