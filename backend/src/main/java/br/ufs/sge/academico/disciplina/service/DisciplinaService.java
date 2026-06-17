package br.ufs.sge.academico.disciplina.service;

import br.ufs.sge.academico.disciplina.dto.DisciplinaRequest;
import br.ufs.sge.academico.disciplina.dto.DisciplinaResponse;
import br.ufs.sge.academico.disciplina.model.Disciplina;
import br.ufs.sge.academico.disciplina.model.StatusDisciplina;
import br.ufs.sge.academico.disciplina.repository.DisciplinaRepository;
import br.ufs.sge.shared.exception.CodigoDisciplinaDuplicadoException;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Camada de serviço para gerenciar as regras de negócio de Disciplinas.
 */
@Service
@RequiredArgsConstructor
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;

    @Transactional
    public DisciplinaResponse cadastrarDisciplina(DisciplinaRequest request) {
        if (disciplinaRepository.existsByCodigo(request.codigo())) {
            throw new CodigoDisciplinaDuplicadoException("Código de disciplina \"" + request.codigo() + "\" já está sendo utilizado.");
        }

        Disciplina disciplina = Disciplina.builder()
                .nome(request.nome())
                .codigo(request.codigo())
                .cargaHoraria(request.cargaHoraria())
                .ementa(request.ementa())
                .status(StatusDisciplina.ATIVO)
                .build();

        Disciplina salva = disciplinaRepository.save(disciplina);
        return DisciplinaResponse.fromEntity(salva);
    }

    @Transactional(readOnly = true)
    public List<DisciplinaResponse> listarDisciplinas() {
        return disciplinaRepository.findAll().stream()
                .map(DisciplinaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DisciplinaResponse buscarDisciplinaPorId(Long id) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Disciplina não encontrada com o ID: " + id));
        return DisciplinaResponse.fromEntity(disciplina);
    }

    @Transactional
    public DisciplinaResponse atualizarDisciplina(Long id, DisciplinaRequest request) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Disciplina não encontrada com o ID: " + id));

        // Se o código foi alterado, checar duplicidade
        if (!disciplina.getCodigo().equalsIgnoreCase(request.codigo()) && 
            disciplinaRepository.existsByCodigo(request.codigo())) {
            throw new CodigoDisciplinaDuplicadoException("Código de disciplina \"" + request.codigo() + "\" já está sendo utilizado.");
        }

        disciplina.setNome(request.nome());
        disciplina.setCodigo(request.codigo());
        disciplina.setCargaHoraria(request.cargaHoraria());
        disciplina.setEmenta(request.ementa());

        Disciplina atualizada = disciplinaRepository.save(disciplina);
        return DisciplinaResponse.fromEntity(atualizada);
    }

    @Transactional
    public void desativarDisciplina(Long id) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Disciplina não encontrada com o ID: " + id));
        disciplina.setStatus(StatusDisciplina.INATIVO);
        disciplinaRepository.save(disciplina);
    }

    @Transactional
    public void ativarDisciplina(Long id) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Disciplina não encontrada com o ID: " + id));
        disciplina.setStatus(StatusDisciplina.ATIVO);
        disciplinaRepository.save(disciplina);
    }
}
