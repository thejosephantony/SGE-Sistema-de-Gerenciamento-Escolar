package br.ufs.sge.academico.matricula.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 * DTO para lançamento de notas e faltas do discente pelo docente.
 */
public record NotasFaltasRequest(
    @Min(value = 0, message = "A nota P1 não pode ser menor que 0.0.")
    @Max(value = 10, message = "A nota P1 não pode ser maior que 10.0.")
    Double notaP1,

    @Min(value = 0, message = "A nota P2 não pode ser menor que 0.0.")
    @Max(value = 10, message = "A nota P2 não pode ser maior que 10.0.")
    Double notaP2,

    @Min(value = 0, message = "O número de faltas não pode ser negativo.")
    Integer faltas
) {}
