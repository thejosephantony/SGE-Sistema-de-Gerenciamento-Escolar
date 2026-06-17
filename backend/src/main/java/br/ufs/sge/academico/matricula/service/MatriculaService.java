package br.ufs.sge.academico.matricula.service;

import br.ufs.sge.academico.matricula.dto.MatriculaRequest;
import br.ufs.sge.academico.matricula.dto.MatriculaResponse;
import br.ufs.sge.academico.matricula.dto.NotasFaltasRequest;
import br.ufs.sge.academico.matricula.model.Matricula;
import br.ufs.sge.academico.matricula.model.StatusMatricula;
import br.ufs.sge.academico.matricula.repository.MatriculaRepository;
import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.academico.turma.repository.TurmaRepository;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.shared.exception.MatriculaDuplicadaException;
import br.ufs.sge.shared.exception.TurmaCheiaException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço para gerenciar as regras de negócio de Matrículas.
 */
@Service
@RequiredArgsConstructor
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final TurmaRepository turmaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public MatriculaResponse matricularDiscente(MatriculaRequest request) {
        // Buscar discente
        Usuario discente = usuarioRepository.findById(request.discenteId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Discente não encontrado com ID: " + request.discenteId()));

        // Buscar turma
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com ID: " + request.turmaId()));

        // Validação 1: Evitar matrículas duplicadas ativas
        if (matriculaRepository.existsByDiscenteIdAndTurmaIdAndStatus(request.discenteId(), request.turmaId(), StatusMatricula.ATIVA)) {
            throw new MatriculaDuplicadaException("O aluno já possui matrícula ativa na turma \"" + 
                    turma.getCodigo() + "\" de \"" + turma.getDisciplina().getNome() + "\".");
        }

        // Validação 2: Verificar limite de capacidade da turma
        long matriculadosAtivos = matriculaRepository.countByTurmaIdAndStatus(request.turmaId(), StatusMatricula.ATIVA);
        if (matriculadosAtivos >= turma.getCapacidade()) {
            throw new TurmaCheiaException("A turma \"" + turma.getCodigo() + 
                    "\" já atingiu a capacidade máxima de " + turma.getCapacidade() + " alunos.");
        }

        Matricula matricula = Matricula.builder()
                .discente(discente)
                .turma(turma)
                .dataMatricula(LocalDateTime.now())
                .status(StatusMatricula.ATIVA)
                .build();

        Matricula salva = matriculaRepository.save(matricula);
        return MatriculaResponse.fromEntity(salva);
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponse> listarMatriculas() {
        return matriculaRepository.findAll().stream()
                .map(MatriculaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatriculaResponse buscarMatriculaPorId(Long id) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Matrícula não encontrada com ID: " + id));
        return MatriculaResponse.fromEntity(matricula);
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponse> buscarPorDiscente(Long discenteId) {
        return matriculaRepository.findByDiscenteId(discenteId).stream()
                .map(MatriculaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponse> buscarPorTurma(Long turmaId) {
        return matriculaRepository.findByTurmaId(turmaId).stream()
                .map(MatriculaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelarMatricula(Long id) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Matrícula não encontrada com ID: " + id));
        matricula.setStatus(StatusMatricula.CANCELADA);
        matriculaRepository.save(matricula);
    }

    @Transactional
    public MatriculaResponse atualizarNotasFaltas(Long id, NotasFaltasRequest request) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Matrícula não encontrada com ID: " + id));

        matricula.setNotaP1(request.notaP1());
        matricula.setNotaP2(request.notaP2());
        matricula.setFaltas(request.faltas());

        Matricula atualizada = matriculaRepository.save(matricula);
        return MatriculaResponse.fromEntity(atualizada);
    }
}
