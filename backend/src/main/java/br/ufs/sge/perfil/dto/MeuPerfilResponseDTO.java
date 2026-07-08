package br.ufs.sge.perfil.dto;

import br.ufs.sge.usuario.model.PerfilUsuario;
import br.ufs.sge.usuario.model.StatusUsuario;

public record MeuPerfilResponseDTO(
        Long id,
        String nome,
        String email,
        PerfilUsuario perfil,
        StatusUsuario status
) {
}
