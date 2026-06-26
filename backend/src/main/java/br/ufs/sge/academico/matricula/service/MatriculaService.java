package br.ufs.sge.academico.matricula.service;

import br.ufs.sge.academico.matricula.dto.MatriculaRequest;
import br.ufs.sge.academico.matricula.dto.MatriculaResponse;
import br.ufs.sge.academico.matricula.dto.NotasFaltasRequest;
import br.ufs.sge.academico.matricula.model.Matricula;
import br.ufs.sge.academico.matricula.model.StatusMatricula;
import br.ufs.sge.academico.matricula.repository.MatriculaRepository;
import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.academico.turma.repository.TurmaRepository;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.shared.exception.MatriculaDuplicadaException;
import br.ufs.sge.shared.exception.TurmaCheiaException;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço responsável pelas regras de negócio de Matrículas.
 *
 * Esta classe controla operações como:
 *
 * - matricular discente em turma;
 * - listar matrículas;
 * - buscar matrícula por ID;
 * - buscar matrículas por discente;
 * - buscar matrículas por turma;
 * - cancelar matrícula;
 * - atualizar notas e faltas.
 */
@Service
@RequiredArgsConstructor
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final TurmaRepository turmaRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Matricula um discente em uma turma.
     *
     * Regras aplicadas:
     *
     * - o discente deve existir;
     * - a turma deve existir;
     * - o mesmo discente não pode ser matriculado duas vezes na mesma turma;
     * - a turma não pode ultrapassar sua capacidade máxima;
     * - toda nova matrícula começa com status ATIVA.
     */
    @Transactional
    public MatriculaResponse matricularDiscente(MatriculaRequest request) {

        /*
         * Busca o discente pelo ID informado no request.
         *
         * Se não existir usuário com esse ID, o fluxo é interrompido.
         */
        Usuario discente = usuarioRepository.findById(request.discenteId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException(
                        "Discente não encontrado com ID: " + request.discenteId()
                ));

        /*
         * Busca a turma pelo ID informado no request.
         *
         * Se não existir turma com esse ID, o fluxo também é interrompido.
         */
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException(
                        "Turma não encontrada com ID: " + request.turmaId()
                ));

        /*
         * Validação 1: impede matrícula duplicada.
         *
         * A combinação discente + turma deve ser única.
         *
         * Isso evita que o mesmo aluno seja matriculado mais de uma vez
         * na mesma turma.
         */
        if (matriculaRepository.existsByDiscenteIdAndTurmaId(
                request.discenteId(),
                request.turmaId()
        )) {
            throw new MatriculaDuplicadaException(
                    "O aluno já está matriculado na turma \"" +
                            turma.getCodigo() + "\" de \"" +
                            turma.getDisciplina().getNome() + "\"."
            );
        }

        /*
         * Validação 2: verifica a capacidade da turma.
         *
         * Aqui contamos apenas as matrículas com status ATIVA.
         * Matrículas canceladas não ocupam vaga.
         */
        long matriculadosAtivos = matriculaRepository.countByTurmaIdAndStatus(
                request.turmaId(),
                StatusMatricula.ATIVA
        );

        if (matriculadosAtivos >= turma.getCapacidade()) {
            throw new TurmaCheiaException(
                    "A turma \"" + turma.getCodigo() +
                            "\" já atingiu a capacidade máxima de " +
                            turma.getCapacidade() + " alunos."
            );
        }

        /*
         * Cria a nova matrícula.
         *
         * Toda matrícula criada por este fluxo começa como ATIVA.
         */
        Matricula matricula = Matricula.builder()
                .discente(discente)
                .turma(turma)
                .dataMatricula(LocalDateTime.now())
                .status(StatusMatricula.ATIVA)
                .build();

        Matricula salva = matriculaRepository.save(matricula);

        return MatriculaResponse.fromEntity(salva);
    }

    /**
     * Lista todas as matrículas cadastradas no sistema.
     */
    @Transactional(readOnly = true)
    public List<MatriculaResponse> listarMatriculas() {
        return matriculaRepository.findAll()
                .stream()
                .map(MatriculaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Busca uma matrícula pelo ID.
     */
    @Transactional(readOnly = true)
    public MatriculaResponse buscarMatriculaPorId(Long id) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException(
                        "Matrícula não encontrada com ID: " + id
                ));

        return MatriculaResponse.fromEntity(matricula);
    }

    /**
     * Lista todas as matrículas de um determinado discente.
     */
    @Transactional(readOnly = true)
    public List<MatriculaResponse> buscarPorDiscente(Long discenteId) {
        return matriculaRepository.findByDiscenteId(discenteId)
                .stream()
                .map(MatriculaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Lista todas as matrículas de uma determinada turma.
     */
    @Transactional(readOnly = true)
    public List<MatriculaResponse> buscarPorTurma(Long turmaId) {
        return matriculaRepository.findByTurmaId(turmaId)
                .stream()
                .map(MatriculaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Cancela uma matrícula existente.
     *
     * A matrícula não é apagada do banco.
     * Apenas seu status é alterado para CANCELADA.
     */
    @Transactional
    public void cancelarMatricula(Long id) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException(
                        "Matrícula não encontrada com ID: " + id
                ));

        matricula.setStatus(StatusMatricula.CANCELADA);

        matriculaRepository.save(matricula);
    }

    /**
     * Atualiza notas e faltas de uma matrícula.
     *
     * Este método será útil para o módulo de notas e frequência.
     */
    @Transactional
    public MatriculaResponse atualizarNotasFaltas(Long id, NotasFaltasRequest request) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException(
                        "Matrícula não encontrada com ID: " + id
                ));

        matricula.setNotaP1(request.notaP1());
        matricula.setNotaP2(request.notaP2());
        matricula.setFaltas(request.faltas());

        Matricula atualizada = matriculaRepository.save(matricula);

        return MatriculaResponse.fromEntity(atualizada);
    }
}