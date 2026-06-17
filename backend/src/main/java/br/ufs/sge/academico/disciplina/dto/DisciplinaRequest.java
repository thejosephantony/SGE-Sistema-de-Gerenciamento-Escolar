package br.ufs.sge.academico.disciplina.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO para cadastro e atualização de disciplinas.
 */
public record DisciplinaRequest(
    @NotBlank(message = "O nome da disciplina é obrigatório.")
    @Size(max = 120, message = "O nome da disciplina deve ter no máximo 120 caracteres.")
    String nome,

    @NotBlank(message = "O código da disciplina é obrigatório.")
    @Size(max = 30, message = "O código da disciplina deve ter no máximo 30 caracteres.")
    String codigo,

    @NotNull(message = "A carga horária é obrigatória.")
    @Positive(message = "A carga horária deve ser um número positivo.")
    Integer cargaHoraria,

    String ementa
) {}
