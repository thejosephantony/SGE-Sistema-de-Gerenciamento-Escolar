package br.ufs.sge.ava.entrega.controller;

import br.ufs.sge.ava.entrega.dto.EntregaAtividadeRequest;
import br.ufs.sge.ava.entrega.dto.EntregaAtividadeResponse;
import br.ufs.sge.ava.entrega.service.EntregaAtividadeService;
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
@RequestMapping("/api/entregas")
@RequiredArgsConstructor
public class EntregaAtividadeController {

    private final EntregaAtividadeService entregaService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DISCENTE')")
    public ResponseEntity<EntregaAtividadeResponse> enviar(
            @Valid @RequestBody EntregaAtividadeRequest request,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(entregaService.enviarEntrega(request, usuarioAutenticado.getId()));
    }

    @GetMapping("/atividade/{atividadeId}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<List<EntregaAtividadeResponse>> listarPorAtividade(@PathVariable Long atividadeId) {
        return ResponseEntity.ok(entregaService.listarPorAtividade(atividadeId));
    }

    @GetMapping("/minhas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DISCENTE')")
    public ResponseEntity<List<EntregaAtividadeResponse>> listarMinhas(
            @AuthenticationPrincipal Usuario usuarioAutenticado) {
        return ResponseEntity.ok(entregaService.listarMinhasEntregas(usuarioAutenticado.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EntregaAtividadeResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(entregaService.buscarPorId(id));
    }
}
