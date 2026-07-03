package br.ufs.sge.ava.atividade.controller;

import br.ufs.sge.ava.atividade.dto.AtividadeRequest;
import br.ufs.sge.ava.atividade.dto.AtividadeResponse;
import br.ufs.sge.ava.atividade.service.AtividadeService;
import br.ufs.sge.usuario.model.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atividades")
@RequiredArgsConstructor
public class AtividadeController {

    private final AtividadeService atividadeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<AtividadeResponse> criar(
            @Valid @RequestBody AtividadeRequest request,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(atividadeService.criarAtividade(request, usuarioAutenticado.getId()));
    }

    @GetMapping("/turma/{turmaId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AtividadeResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(atividadeService.listarPorTurma(turmaId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AtividadeResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(atividadeService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<AtividadeResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AtividadeRequest request,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        return ResponseEntity.ok(atividadeService.atualizarAtividade(id, request, usuarioAutenticado));
    }

    @PatchMapping("/{id}/encerrar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<Void> encerrar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        atividadeService.encerrarAtividade(id, usuarioAutenticado);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        atividadeService.cancelarAtividade(id, usuarioAutenticado);
        return ResponseEntity.noContent().build();
    }
}
