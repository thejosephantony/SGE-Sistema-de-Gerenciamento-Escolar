package br.ufs.sge.academico.turma.repository;

import br.ufs.sge.academico.turma.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para gerenciar operações de banco de dados para a entidade Turma.
 */
@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByDocenteId(Long docenteId);
    List<Turma> findByDisciplinaId(Long disciplinaId);
    List<Turma> findByPeriodoLetivo(String periodoLetivo);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Turma t WHERE t.codigo = :codigo AND t.disciplina.id = :disciplinaId AND t.periodoLetivo = :periodoLetivo")
    boolean existsByCodigoAndDisciplinaIdAndPeriodoLetivo(String codigo, Long disciplinaId, String periodoLetivo);
}
