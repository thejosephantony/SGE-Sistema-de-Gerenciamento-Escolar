package br.ufs.sge.academico.disciplina.controller;

import br.ufs.sge.academico.disciplina.dto.DisciplinaRequest;
import br.ufs.sge.academico.disciplina.dto.DisciplinaResponse;
import br.ufs.sge.academico.disciplina.service.DisciplinaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gerenciar operações relacionadas a Disciplinas.
 */
@RestController
@RequestMapping("/api/disciplinas")
@RequiredArgsConstructor
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<DisciplinaResponse> cadastrar(@RequestBody @Valid DisciplinaRequest request) {
        DisciplinaResponse response = disciplinaService.cadastrarDisciplina(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DisciplinaResponse>> listarTodas() {
        List<DisciplinaResponse> response = disciplinaService.listarDisciplinas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaResponse> buscarPorId(@PathVariable Long id) {
        DisciplinaResponse response = disciplinaService.buscarDisciplinaPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<DisciplinaResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid DisciplinaRequest request) {
        DisciplinaResponse response = disciplinaService.atualizarDisciplina(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/desativar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        disciplinaService.desativarDisciplina(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> ativar(@PathVariable Long id) {
        disciplinaService.ativarDisciplina(id);
        return ResponseEntity.noContent().build();
    }
}
