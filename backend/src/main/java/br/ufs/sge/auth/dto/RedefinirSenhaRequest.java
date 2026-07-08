package br.ufs.sge.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Requisição para redefinir senha usando token de recuperação.
 */
public record RedefinirSenhaRequest(

        @NotBlank(message = "O token é obrigatório.")
        String token,

        @NotBlank(message = "A nova senha é obrigatória.")
        @Size(min = 6, message = "A nova senha deve possuir pelo menos 6 caracteres.")
        String novaSenha
) {
}
