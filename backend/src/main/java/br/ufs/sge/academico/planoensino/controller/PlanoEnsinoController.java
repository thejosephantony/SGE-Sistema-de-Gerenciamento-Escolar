package br.ufs.sge.academico.planoensino.controller;

import br.ufs.sge.academico.planoensino.dto.PlanoEnsinoRequest;
import br.ufs.sge.academico.planoensino.dto.PlanoEnsinoResponse;
import br.ufs.sge.academico.planoensino.service.PlanoEnsinoService;
import br.ufs.sge.usuario.model.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints do plano de ensino.
 */
@RestController
@RequestMapping("/api/planos-ensino")
@RequiredArgsConstructor
public class PlanoEnsinoController {

    private final PlanoEnsinoService planoEnsinoService;

    /**
     * Consulta o plano de ensino de uma turma.
     */
    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<PlanoEnsinoResponse> buscarPorTurma(
            @PathVariable Long turmaId
    ) {
        PlanoEnsinoResponse response = planoEnsinoService.buscarPorTurma(turmaId);
        return ResponseEntity.ok(response);
    }

    /**
     * Cadastra ou atualiza o plano de ensino de uma turma.
     *
     * Apenas o docente responsável pela turma ou um administrador pode alterar.
     */
    @PutMapping("/turma/{turmaId}")
    public ResponseEntity<PlanoEnsinoResponse> salvarOuAtualizar(
            @PathVariable Long turmaId,
            @RequestBody @Valid PlanoEnsinoRequest request,
            @AuthenticationPrincipal Usuario usuarioAutenticado
    ) {
        PlanoEnsinoResponse response = planoEnsinoService.salvarOuAtualizar(
                turmaId,
                request,
                usuarioAutenticado
        );

        return ResponseEntity.ok(response);
    }
}
