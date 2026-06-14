package br.ufs.sge.auth.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO que recebe as credenciais do usuário na tentativa de login.
 */


public record LoginRequest(
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "O e-mail informado é inválido.")
    String email,
        
    @NotBlank(message = "A senha é obrigatória.")
    String senha
    ) {
}
