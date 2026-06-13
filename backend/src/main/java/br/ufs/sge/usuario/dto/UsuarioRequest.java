package br.ufs.sge.usuario.dto;

import br.ufs.sge.usuario.model.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO utilizado para receber os dados de cadastro e atualização de usuários.
 * A senha recebida neste DTO será criptografada antes de ser persistida.
 */

public record UsuarioRequest(
    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    String nome,
    
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "O e-mail informado é inválido.")
    @Size(max = 120, message = "O e-mail informado deve ter no máximo 120 caracteres.")
    String email,
    
    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    String senha,
    
    @NotNull(message = "O perfil do usuário é obrigatório.")
    PerfilUsuario perfil
){

}
