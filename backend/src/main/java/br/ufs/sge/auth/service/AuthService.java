package br.ufs.sge.auth.service;

import br.ufs.sge.auth.dto.LoginRequest;
import br.ufs.sge.auth.dto.LoginResponse;
import br.ufs.sge.security.JwtService;
import br.ufs.sge.usuario.dto.UsuarioResponse;
import br.ufs.sge.usuario.model.StatusUsuario;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável pelas regras de autenticação do sistema.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Autentica o usuário com e-mail e senha e retorna um token JWT.
     */
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos."));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        if (!StatusUsuario.ATIVO.equals(usuario.getStatus())) {
            throw new RuntimeException("Usuário inativo. Entre em contato com a administração.");
        }

        String token = jwtService.gerarToken(usuario);

        return new LoginResponse(
                token,
                "Bearer",
                UsuarioResponse.fromEntity(usuario)
        );
    }
}