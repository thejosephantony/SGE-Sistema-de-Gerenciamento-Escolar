package br.ufs.sge.academico.turma.dto;

import br.ufs.sge.academico.turma.model.StatusTurma;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * DTO de entrada para cadastro e atualização de turmas.
 */
public record TurmaRequest(
    @NotBlank(message = "O código da turma é obrigatório.")
    @Pattern(regexp = "^T\\d{2}$", message = "O código deve seguir o padrão T + 2 dígitos (ex: T01).")
    String codigo,

    @NotNull(message = "A capacidade é obrigatória.")
    @Min(value = 1, message = "A capacidade deve ser de pelo menos 1 aluno.")
    Integer capacidade,

    @NotBlank(message = "O período letivo é obrigatório.")
    @Pattern(regexp = "^\\d{4}$", message = "O ano letivo deve seguir o formato AAAA.")
    String periodoLetivo,

    @NotNull(message = "A disciplina associada é obrigatória.")
    Long disciplinaId,

    @NotNull(message = "O docente responsável é obrigatório.")
    Long docenteId,

    StatusTurma status
) {}
