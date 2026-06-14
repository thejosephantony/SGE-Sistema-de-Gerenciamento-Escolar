package br.ufs.sge.auth.controller;

import br.ufs.sge.auth.dto.LoginRequest;
import br.ufs.sge.auth.dto.LoginResponse;
import br.ufs.sge.auth.service.AuthService;
import br.ufs.sge.usuario.dto.UsuarioResponse;
import br.ufs.sge.usuario.model.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável pelos endpoints de autenticação.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Realiza login do usuário e retorna um token JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Retorna os dados do usuário autenticado a partir do token JWT.
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuario));
    }
}