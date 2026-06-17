package br.ufs.sge.academico.turma.controller;

import br.ufs.sge.academico.turma.dto.TurmaRequest;
import br.ufs.sge.academico.turma.dto.TurmaResponse;
import br.ufs.sge.academico.turma.service.TurmaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gerenciar operações relacionadas a Turmas.
 */
@RestController
@RequestMapping("/api/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final TurmaService turmaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<TurmaResponse> cadastrar(@RequestBody @Valid TurmaRequest request) {
        TurmaResponse response = turmaService.cadastrarTurma(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TurmaResponse>> listarTodas() {
        List<TurmaResponse> response = turmaService.listarTurmas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponse> buscarPorId(@PathVariable Long id) {
        TurmaResponse response = turmaService.buscarTurmaPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<List<TurmaResponse>> buscarPorDocente(@PathVariable Long docenteId) {
        List<TurmaResponse> response = turmaService.buscarPorDocente(docenteId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/disciplina/{disciplinaId}")
    public ResponseEntity<List<TurmaResponse>> buscarPorDisciplina(@PathVariable Long disciplinaId) {
        List<TurmaResponse> response = turmaService.buscarPorDisciplina(disciplinaId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<TurmaResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid TurmaRequest request) {
        TurmaResponse response = turmaService.atualizarTurma(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/desativar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        turmaService.desativarTurma(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> ativar(@PathVariable Long id) {
        turmaService.ativarTurma(id);
        return ResponseEntity.noContent().build();
    }
}
