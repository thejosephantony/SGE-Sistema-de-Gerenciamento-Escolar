package br.ufs.sge.academico.matricula.controller;

import br.ufs.sge.academico.matricula.dto.MatriculaRequest;
import br.ufs.sge.academico.matricula.dto.MatriculaResponse;
import br.ufs.sge.academico.matricula.dto.NotasFaltasRequest;
import br.ufs.sge.academico.matricula.service.MatriculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gerenciar operações relacionadas a Matrículas.
 */
@RestController
@RequestMapping("/api/matriculas")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<MatriculaResponse> cadastrar(@RequestBody @Valid MatriculaRequest request) {
        MatriculaResponse response = matriculaService.matricularDiscente(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MatriculaResponse>> listarTodas() {
        List<MatriculaResponse> response = matriculaService.listarMatriculas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatriculaResponse> buscarPorId(@PathVariable Long id) {
        MatriculaResponse response = matriculaService.buscarMatriculaPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/discente/{discenteId}")
    public ResponseEntity<List<MatriculaResponse>> buscarPorDiscente(@PathVariable Long discenteId) {
        List<MatriculaResponse> response = matriculaService.buscarPorDiscente(discenteId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<MatriculaResponse>> buscarPorTurma(@PathVariable Long turmaId) {
        List<MatriculaResponse> response = matriculaService.buscarPorTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        matriculaService.cancelarMatricula(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/notas-faltas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<MatriculaResponse> lançarNotasFaltas(
            @PathVariable Long id,
            @RequestBody @Valid NotasFaltasRequest request) {
        MatriculaResponse response = matriculaService.atualizarNotasFaltas(id, request);
        return ResponseEntity.ok(response);
    }
}
