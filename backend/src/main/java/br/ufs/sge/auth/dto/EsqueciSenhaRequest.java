package br.ufs.sge.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Requisição para solicitar recuperação de senha.
 */
public record EsqueciSenhaRequest(

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O e-mail informado é inválido.")
        String email
) {
}
