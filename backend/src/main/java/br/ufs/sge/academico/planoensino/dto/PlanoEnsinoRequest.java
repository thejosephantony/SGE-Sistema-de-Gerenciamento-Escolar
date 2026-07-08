package br.ufs.sge.academico.planoensino.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Dados enviados pelo docente para cadastrar ou atualizar o plano de ensino.
 */
public record PlanoEnsinoRequest(

        @NotBlank(message = "A ementa é obrigatória.")
        String ementa,

        @NotBlank(message = "Os objetivos são obrigatórios.")
        String objetivos,

        @NotBlank(message = "O conteúdo programático é obrigatório.")
        String conteudoProgramatico,

        @NotBlank(message = "A metodologia é obrigatória.")
        String metodologia,

        @NotBlank(message = "A avaliação é obrigatória.")
        String avaliacao,

        String bibliografia
) {
}
