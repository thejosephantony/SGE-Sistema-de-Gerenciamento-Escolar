package br.ufs.sge.ava.atividade.service;

import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.academico.turma.repository.TurmaRepository;
import br.ufs.sge.ava.atividade.dto.AtividadeRequest;
import br.ufs.sge.ava.atividade.dto.AtividadeResponse;
import br.ufs.sge.ava.atividade.model.Atividade;
import br.ufs.sge.ava.atividade.model.StatusAtividade;
import br.ufs.sge.ava.atividade.repository.AtividadeRepository;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
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
                .titulo(request.titulo()).descricao(request.descricao())
                .prazo(request.prazo()).turma(turma).docente(docente).build();
        return AtividadeResponse.fromEntity(atividadeRepository.save(atividade));
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarPorTurma(Long turmaId) {
        return atividadeRepository.findByTurmaId(turmaId).stream()
                .map(AtividadeResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AtividadeResponse buscarPorId(Long id) {
        return AtividadeResponse.fromEntity(atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id)));
    }

    @Transactional
    public AtividadeResponse atualizarAtividade(Long id, AtividadeRequest request) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id));
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com o ID: " + request.turmaId()));
        atividade.setTitulo(request.titulo()); atividade.setDescricao(request.descricao());
        atividade.setPrazo(request.prazo()); atividade.setTurma(turma);
        return AtividadeResponse.fromEntity(atividadeRepository.save(atividade));
    }

    @Transactional
    public void encerrarAtividade(Long id) {
        Atividade a = atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id));
        a.setStatus(StatusAtividade.ENCERRADA);
        atividadeRepository.save(a);
    }

    @Transactional
    public void cancelarAtividade(Long id) {
        Atividade a = atividadeRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + id));
        a.setStatus(StatusAtividade.CANCELADA);
        atividadeRepository.save(a);
    }
}
