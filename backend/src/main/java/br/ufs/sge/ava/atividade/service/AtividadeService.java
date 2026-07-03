package br.ufs.sge.ava.atividade.service;

import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.academico.turma.repository.TurmaRepository;
import br.ufs.sge.ava.atividade.dto.AtividadeRequest;
import br.ufs.sge.ava.atividade.dto.AtividadeResponse;
import br.ufs.sge.ava.atividade.model.Atividade;
import br.ufs.sge.ava.atividade.model.StatusAtividade;
import br.ufs.sge.ava.atividade.repository.AtividadeRepository;
import br.ufs.sge.shared.exception.AcessoNegadoException;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.usuario.model.PerfilUsuario;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;
    private final TurmaRepository turmaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public AtividadeResponse criarAtividade(AtividadeRequest request, Long docenteId) {
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com o ID: " + request.turmaId()));
        Usuario docente = usuarioRepository.findById(docenteId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Docente não encontrado com o ID: " + docenteId));
        Atividade atividade = Atividade.builder()
                .titulo(request.titulo())
                .descricao(request.descricao())
                .prazo(request.prazo())
                .turma(turma)
                .docente(docente)
                .build();
        return AtividadeResponse.fromEntity(atividadeRepository.save(atividade));
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarPorTurma(Long turmaId) {
        return atividadeRepository.findByTurmaId(turmaId).stream()
                .map(AtividadeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AtividadeResponse buscarPorId(Long id) {
        return AtividadeResponse.fromEntity(atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id)));
    }

    @Transactional
    public AtividadeResponse atualizarAtividade(Long id, AtividadeRequest request, Usuario usuarioAutenticado) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id));
        verificarPropriedade(atividade, usuarioAutenticado, "editar");
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com o ID: " + request.turmaId()));
        atividade.setTitulo(request.titulo());
        atividade.setDescricao(request.descricao());
        atividade.setPrazo(request.prazo());
        atividade.setTurma(turma);
        return AtividadeResponse.fromEntity(atividadeRepository.save(atividade));
    }

    @Transactional
    public void encerrarAtividade(Long id, Usuario usuarioAutenticado) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id));
        verificarPropriedade(atividade, usuarioAutenticado, "encerrar");
        atividade.setStatus(StatusAtividade.ENCERRADA);
        atividadeRepository.save(atividade);
    }

    @Transactional
    public void cancelarAtividade(Long id, Usuario usuarioAutenticado) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id));
        verificarPropriedade(atividade, usuarioAutenticado, "cancelar");
        atividade.setStatus(StatusAtividade.CANCELADA);
        atividadeRepository.save(atividade);
    }

    /**
     * Garante que apenas o docente dono da atividade (ou um administrador) pode modificá-la.
     */
    private void verificarPropriedade(Atividade atividade, Usuario usuario, String acao) {
        boolean isAdmin = usuario.getPerfil() == PerfilUsuario.ADMINISTRADOR;
        boolean isDono = atividade.getDocente().getId().equals(usuario.getId());
        if (!isAdmin && !isDono) {
            throw new AcessoNegadoException("Você não tem permissão para " + acao + " esta atividade.");
        }
    }
}
