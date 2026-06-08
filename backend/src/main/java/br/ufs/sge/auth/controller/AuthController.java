package br.ufs.sge.auth.controller;

import br.ufs.sge.auth.dto.LoginRequest;
import br.ufs.sge.auth.dto.LoginResponse;
import br.ufs.sge.auth.security.JwtUtil;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Tentativa de login para o e-mail: " + request.getEmail());
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getSenha()
                    )
            );

            // Se chegou aqui, a autenticação foi bem sucedida
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado após autenticação"));

            String jwtToken = jwtUtil.generateToken(usuario);

            LoginResponse response = LoginResponse.builder()
                    .token(jwtToken)
                    .id(usuario.getId())
                    .nome(usuario.getNome())
                    .email(usuario.getEmail())
                    .perfil(usuario.getPerfil())
                    .build();

            System.out.println("Login bem-sucedido!");
            return ResponseEntity.ok(response);
            
        } catch (org.springframework.security.core.AuthenticationException e) {
            System.err.println("Erro de credenciais (Senha ou E-mail incorretos): " + e.getMessage());
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Credenciais incorretas. Erro: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Erro interno durante o login: " + e.getMessage());
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Erro interno no servidor: " + e.getMessage()));
        }
    }
}
