package br.ufs.sge.academico.planoensino.service;

import br.ufs.sge.academico.planoensino.dto.PlanoEnsinoRequest;
import br.ufs.sge.academico.planoensino.dto.PlanoEnsinoResponse;
import br.ufs.sge.academico.planoensino.model.PlanoEnsino;
import br.ufs.sge.academico.planoensino.repository.PlanoEnsinoRepository;
import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.academico.turma.repository.TurmaRepository;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.usuario.model.PerfilUsuario;
import br.ufs.sge.usuario.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Regras de negócio do plano de ensino.
 *
 * O docente só pode cadastrar ou alterar o plano de ensino das turmas
 * às quais está vinculado.
 */
@Service
@RequiredArgsConstructor
public class PlanoEnsinoService {

    private final PlanoEnsinoRepository planoEnsinoRepository;
    private final TurmaRepository turmaRepository;

    @Transactional(readOnly = true)
    public PlanoEnsinoResponse buscarPorTurma(Long turmaId) {
        PlanoEnsino plano = planoEnsinoRepository.findByTurmaId(turmaId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException(
                        "Plano de ensino não encontrado para esta turma."
                ));

        return PlanoEnsinoResponse.fromEntity(plano);
    }

    @Transactional
    public PlanoEnsinoResponse salvarOuAtualizar(
            Long turmaId,
            PlanoEnsinoRequest request,
            Usuario usuarioAutenticado
    ) {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException(
                        "Turma não encontrada com ID: " + turmaId
                ));

        validarPermissaoEdicao(turma, usuarioAutenticado);

        PlanoEnsino plano = planoEnsinoRepository.findByTurmaId(turmaId)
                .orElseGet(() -> PlanoEnsino.builder()
                        .turma(turma)
                        .build()
                );

        plano.setEmenta(request.ementa());
        plano.setObjetivos(request.objetivos());
        plano.setConteudoProgramatico(request.conteudoProgramatico());
        plano.setMetodologia(request.metodologia());
        plano.setAvaliacao(request.avaliacao());
        plano.setBibliografia(request.bibliografia());

        PlanoEnsino salvo = planoEnsinoRepository.save(plano);

        return PlanoEnsinoResponse.fromEntity(salvo);
    }

    private void validarPermissaoEdicao(Turma turma, Usuario usuarioAutenticado) {
        if (usuarioAutenticado == null) {
            throw new AccessDeniedException("Usuário não autenticado.");
        }

        if (usuarioAutenticado.getPerfil() == PerfilUsuario.ADMINISTRADOR) {
            return;
        }

        if (usuarioAutenticado.getPerfil() == PerfilUsuario.DOCENTE) {
            Long idDocenteTurma = turma.getDocente().getId();
            Long idUsuarioAutenticado = usuarioAutenticado.getId();

            if (idDocenteTurma.equals(idUsuarioAutenticado)) {
                return;
            }
        }

        throw new AccessDeniedException(
                "Você não possui permissão para alterar o plano de ensino desta turma."
        );
    }
}
