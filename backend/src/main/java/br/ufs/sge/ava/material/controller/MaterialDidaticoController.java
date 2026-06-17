package br.ufs.sge.ava.material.controller;

import br.ufs.sge.ava.material.dto.MaterialDidaticoRequest;
import br.ufs.sge.ava.material.dto.MaterialDidaticoResponse;
import br.ufs.sge.ava.material.service.MaterialDidaticoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materiais")
@RequiredArgsConstructor
public class MaterialDidaticoController {
    private final MaterialDidaticoService materialService;

    @PostMapping
    public ResponseEntity<MaterialDidaticoResponse> cadastrar(
            @Valid @RequestBody MaterialDidaticoRequest request, @RequestParam Long docenteId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(materialService.cadastrarMaterial(request, docenteId));
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<MaterialDidaticoResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(materialService.listarPorTurma(turmaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialDidaticoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialDidaticoResponse> atualizar(
            @PathVariable Long id, @Valid @RequestBody MaterialDidaticoRequest request) {
        return ResponseEntity.ok(materialService.atualizarMaterial(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        materialService.removerMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
