package br.ufs.sge.ava.material.controller;

import br.ufs.sge.ava.material.dto.MaterialDidaticoRequest;
import br.ufs.sge.ava.material.dto.MaterialDidaticoResponse;
import br.ufs.sge.ava.material.service.MaterialDidaticoService;
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
@RequestMapping("/api/materiais")
@RequiredArgsConstructor
public class MaterialDidaticoController {

    private final MaterialDidaticoService materialService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<MaterialDidaticoResponse> cadastrar(
            @Valid @RequestBody MaterialDidaticoRequest request,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(materialService.cadastrarMaterial(request, usuarioAutenticado.getId()));
    }

    @GetMapping("/turma/{turmaId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MaterialDidaticoResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(materialService.listarPorTurma(turmaId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MaterialDidaticoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<MaterialDidaticoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MaterialDidaticoRequest request,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        return ResponseEntity.ok(materialService.atualizarMaterial(id, request, usuarioAutenticado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<Void> remover(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        materialService.removerMaterial(id, usuarioAutenticado);
        return ResponseEntity.noContent().build();
    }
}
