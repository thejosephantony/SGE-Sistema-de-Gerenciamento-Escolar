package br.ufs.sge.academico.matricula.repository;

import br.ufs.sge.academico.matricula.model.Matricula;
import br.ufs.sge.academico.matricula.model.StatusMatricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para gerenciar operações de banco de dados para a entidade Matricula.
 */
@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    List<Matricula> findByDiscenteId(Long discenteId);
    List<Matricula> findByTurmaId(Long turmaId);
    
    @Query("SELECT COUNT(m) FROM Matricula m WHERE m.turma.id = :turmaId AND m.status = :status")
    long countByTurmaIdAndStatus(Long turmaId, StatusMatricula status);

    boolean existsByDiscenteIdAndTurmaIdAndStatus(Long discenteId, Long turmaId, StatusMatricula status);
}
