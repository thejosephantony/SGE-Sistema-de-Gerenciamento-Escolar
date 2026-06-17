package br.ufs.sge.academico.matricula.dto;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para recebimento de dados de matrícula de discente em turma.
 */
public record MatriculaRequest(
    @NotNull(message = "O discente associado é obrigatório.")
    Long discenteId,

    @NotNull(message = "A turma associada é obrigatória.")
    Long turmaId
) {}
