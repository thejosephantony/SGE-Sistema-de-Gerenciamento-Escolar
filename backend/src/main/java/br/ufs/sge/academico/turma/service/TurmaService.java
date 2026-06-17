package br.ufs.sge.academico.turma.service;

import br.ufs.sge.academico.disciplina.model.Disciplina;
import br.ufs.sge.academico.disciplina.repository.DisciplinaRepository;
import br.ufs.sge.academico.turma.dto.TurmaRequest;
import br.ufs.sge.academico.turma.dto.TurmaResponse;
import br.ufs.sge.academico.turma.model.StatusTurma;
import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.academico.turma.repository.TurmaRepository;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.shared.exception.TurmaDuplicadaException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço para gerenciar as regras de negócio de Turmas.
 */
@Service
@RequiredArgsConstructor
public class TurmaService {

    private final TurmaRepository turmaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public TurmaResponse cadastrarTurma(TurmaRequest request) {
        // Validar duplicidade
        if (turmaRepository.existsByCodigoAndDisciplinaIdAndPeriodoLetivo(
                request.codigo(), request.disciplinaId(), request.periodoLetivo())) {
            throw new TurmaDuplicadaException("A turma \"" + request.codigo() + 
                    "\" já está cadastrada para esta disciplina no período " + request.periodoLetivo() + ".");
        }

        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Disciplina não encontrada com ID: " + request.disciplinaId()));

        Usuario docente = usuarioRepository.findById(request.docenteId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Docente não encontrado com ID: " + request.docenteId()));

        Turma turma = Turma.builder()
                .codigo(request.codigo())
                .capacidade(request.capacidade())
                .periodoLetivo(request.periodoLetivo())
                .disciplina(disciplina)
                .docente(docente)
                .status(request.status() != null ? request.status() : StatusTurma.PLANEJADA)
                .build();

        Turma salva = turmaRepository.save(turma);
        return TurmaResponse.fromEntity(salva);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponse> listarTurmas() {
        return turmaRepository.findAll().stream()
                .map(TurmaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TurmaResponse buscarTurmaPorId(Long id) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com ID: " + id));
        return TurmaResponse.fromEntity(turma);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponse> buscarPorDocente(Long docenteId) {
        return turmaRepository.findByDocenteId(docenteId).stream()
                .map(TurmaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TurmaResponse> buscarPorDisciplina(Long disciplinaId) {
        return turmaRepository.findByDisciplinaId(disciplinaId).stream()
                .map(TurmaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TurmaResponse atualizarTurma(Long id, TurmaRequest request) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com ID: " + id));

        // Se alterou código, disciplina ou período, validar duplicidade
        boolean alterouChaveUnica = !turma.getCodigo().equalsIgnoreCase(request.codigo()) ||
                !turma.getDisciplina().getId().equals(request.disciplinaId()) ||
                !turma.getPeriodoLetivo().equalsIgnoreCase(request.periodoLetivo());

        if (alterouChaveUnica && turmaRepository.existsByCodigoAndDisciplinaIdAndPeriodoLetivo(
                request.codigo(), request.disciplinaId(), request.periodoLetivo())) {
            throw new TurmaDuplicadaException("A turma \"" + request.codigo() + 
                    "\" já está cadastrada para esta disciplina no período " + request.periodoLetivo() + ".");
        }

        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Disciplina não encontrada com ID: " + request.disciplinaId()));

        Usuario docente = usuarioRepository.findById(request.docenteId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Docente não encontrado com ID: " + request.docenteId()));

        turma.setCodigo(request.codigo());
        turma.setCapacidade(request.capacidade());
        turma.setPeriodoLetivo(request.periodoLetivo());
        turma.setDisciplina(disciplina);
        turma.setDocente(docente);
        if (request.status() != null) {
            turma.setStatus(request.status());
        }

        Turma atualizada = turmaRepository.save(turma);
        return TurmaResponse.fromEntity(atualizada);
    }

    @Transactional
    public void desativarTurma(Long id) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com ID: " + id));
        turma.setStatus(StatusTurma.CANCELADA);
        turmaRepository.save(turma);
    }

    @Transactional
    public void ativarTurma(Long id) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com ID: " + id));
        turma.setStatus(StatusTurma.ABERTA);
        turmaRepository.save(turma);
    }
}
