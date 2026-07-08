package br.ufs.sge.perfil.service;

import br.ufs.sge.perfil.dto.MeuPerfilResponseDTO;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MeuPerfilService {

    private final UsuarioRepository usuarioRepository;

    public MeuPerfilResponseDTO buscarPerfil(Authentication authentication) {
        String email = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado."));

        return new MeuPerfilResponseDTO(
        usuario.getId(),
        usuario.getNome(),
        usuario.getEmail(),
        usuario.getPerfil(),
        usuario.getStatus()
		);
    }
}
