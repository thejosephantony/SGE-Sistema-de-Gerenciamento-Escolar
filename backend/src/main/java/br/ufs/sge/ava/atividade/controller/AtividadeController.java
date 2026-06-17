package br.ufs.sge.ava.atividade.controller;

import br.ufs.sge.ava.atividade.dto.AtividadeRequest;
import br.ufs.sge.ava.atividade.dto.AtividadeResponse;
import br.ufs.sge.ava.atividade.service.AtividadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/atividades")
@RequiredArgsConstructor
public class AtividadeController {
    private final AtividadeService atividadeService;

    @PostMapping
    public ResponseEntity<AtividadeResponse> criar(
            @Valid @RequestBody AtividadeRequest request, @RequestParam Long docenteId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(atividadeService.criarAtividade(request, docenteId));
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<AtividadeResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(atividadeService.listarPorTurma(turmaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AtividadeResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(atividadeService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AtividadeResponse> atualizar(
            @PathVariable Long id, @Valid @RequestBody AtividadeRequest request) {
        return ResponseEntity.ok(atividadeService.atualizarAtividade(id, request));
    }

    @PatchMapping("/{id}/encerrar")
    public ResponseEntity<Void> encerrar(@PathVariable Long id) {
        atividadeService.encerrarAtividade(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        atividadeService.cancelarAtividade(id);
        return ResponseEntity.noContent().build();
    }
}
