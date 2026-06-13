package br.ufs.sge.usuario.dto;
import br.ufs.sge.usuario.model.PerfilUsuario;
import br.ufs.sge.usuario.model.StatusUsuario;
import br.ufs.sge.usuario.model.Usuario;


/**
 * DTO utilizado para retornar os dados de um usuário para o Front-end.
 * Garante a segurança da aplicação ao omitir dados sensíveis, como o hash da senha.
 */

public record UsuarioResponse(
    Long id,
    String nome,
    String email,
    PerfilUsuario perfil,
    StatusUsuario status
    
){
    public static UsuarioResponse fromEntity(Usuario usuario){
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.getStatus()
        );
    }
}
