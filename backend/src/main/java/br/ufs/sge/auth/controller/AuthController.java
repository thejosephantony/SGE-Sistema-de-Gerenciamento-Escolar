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
import br.ufs.sge.auth.dto.EsqueciSenhaRequest;
import br.ufs.sge.auth.dto.MensagemResponse;
import br.ufs.sge.auth.dto.RedefinirSenhaRequest;
import br.ufs.sge.auth.service.RecuperacaoSenhaService;

/**
 * Controller responsável pelos endpoints de autenticação.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RecuperacaoSenhaService recuperacaoSenhaService;

    /**
     * Realiza login do usuário e retorna um token JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /**
 * Solicita a recuperação de senha.
 *
 * A resposta é genérica para evitar informar se o e-mail existe ou não no sistema.
 */
	@PostMapping("/esqueci-senha")
	public ResponseEntity<MensagemResponse> esqueciSenha(
			@RequestBody @Valid EsqueciSenhaRequest request
	) {
		MensagemResponse response = recuperacaoSenhaService.solicitarRedefinicao(request);
		return ResponseEntity.ok(response);
	}

	/**
	 * Redefine a senha do usuário usando um token válido.
	 */
	@PostMapping("/redefinir-senha")
	public ResponseEntity<MensagemResponse> redefinirSenha(
			@RequestBody @Valid RedefinirSenhaRequest request
	) {
		try {
			MensagemResponse response = recuperacaoSenhaService.redefinirSenha(request);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.badRequest().body(new MensagemResponse(ex.getMessage()));
		}
	}
		

    /**
     * Retorna os dados do usuário autenticado a partir do token JWT.
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuario));
    }
}
