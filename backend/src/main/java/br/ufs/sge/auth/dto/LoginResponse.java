package br.ufs.sge.auth.dto;
import br.ufs.sge.usuario.dto.UsuarioResponse;

/**
 * DTO utilizado para retornar o token JWT e os dados básicos do usuário autenticado.
 */

public record LoginResponse(
        String token,
        String tipo,
        UsuarioResponse usuario
    ) {

}
