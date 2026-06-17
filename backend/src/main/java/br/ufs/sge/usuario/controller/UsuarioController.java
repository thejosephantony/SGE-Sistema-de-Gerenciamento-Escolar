package br.ufs.sge.usuario.controller;

import br.ufs.sge.usuario.dto.UsuarioRequest;
import br.ufs.sge.usuario.dto.UsuarioResponse;
import br.ufs.sge.usuario.dto.UsuarioUpdateRequest;
import br.ufs.sge.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gerenciar as operações de usuários.
 * Define os endpoints da API e mapeia os verbos HTTP para os serviços adequados.
 */
@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMINISTRADOR')")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * Endpoint para criar um novo usuário.
     * POST /api/usuarios
     */
    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrar(@RequestBody @Valid UsuarioRequest request) {
        UsuarioResponse response = usuarioService.cadastrarUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint para listar todos os usuários.
     * GET /api/usuarios
     */
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        List<UsuarioResponse> response = usuarioService.listarUsuarios();
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para buscar um usuário específico pelo ID.
     * GET /api/usuarios/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        UsuarioResponse response = usuarioService.buscarUsuarioPorId(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para atualizar os dados de um usuário.
     * PUT /api/usuarios/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioUpdateRequest request) {
        UsuarioResponse response = usuarioService.atualizarUsuario(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para desativar um usuário.
     * PATCH /api/usuarios/{id}/desativar
     */
    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        usuarioService.desativarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para reativar um usuário.
     * PATCH /api/usuarios/{id}/ativar
     */
    @PatchMapping("/{id}/ativar")
    public ResponseEntity<Void> ativar(@PathVariable Long id) {
        usuarioService.ativarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}