package br.ufs.sge.ava.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MaterialDidaticoRequest(
        @NotBlank(message = "Título é obrigatório") String titulo,
        String descricao,
        String linkArquivo,
        @NotNull(message = "ID da turma é obrigatório") Long turmaId
) {}
