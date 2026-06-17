package br.ufs.sge.ava.entrega.controller;

import br.ufs.sge.ava.entrega.dto.EntregaAtividadeRequest;
import br.ufs.sge.ava.entrega.dto.EntregaAtividadeResponse;
import br.ufs.sge.ava.entrega.service.EntregaAtividadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/entregas")
@RequiredArgsConstructor
public class EntregaAtividadeController {
    private final EntregaAtividadeService entregaService;

    @PostMapping
    public ResponseEntity<EntregaAtividadeResponse> enviar(
            @Valid @RequestBody EntregaAtividadeRequest request, @RequestParam Long discenteId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(entregaService.enviarEntrega(request, discenteId));
    }

    @GetMapping("/atividade/{atividadeId}")
    public ResponseEntity<List<EntregaAtividadeResponse>> listarPorAtividade(@PathVariable Long atividadeId) {
        return ResponseEntity.ok(entregaService.listarPorAtividade(atividadeId));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<EntregaAtividadeResponse>> listarMinhas(@RequestParam Long discenteId) {
        return ResponseEntity.ok(entregaService.listarMinhasEntregas(discenteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntregaAtividadeResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(entregaService.buscarPorId(id));
    }
}
