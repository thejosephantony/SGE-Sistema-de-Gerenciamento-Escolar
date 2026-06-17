package br.ufs.sge.ava.atividade.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record AtividadeRequest(
        @NotBlank(message = "Título é obrigatório") String titulo,
        String descricao,
        @NotNull(message = "Prazo é obrigatório") @Future(message = "O prazo deve ser uma data futura") LocalDateTime prazo,
        @NotNull(message = "ID da turma é obrigatório") Long turmaId
) {}
