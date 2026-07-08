package br.ufs.sge.academico.planoensino.repository;

import br.ufs.sge.academico.planoensino.model.PlanoEnsino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlanoEnsinoRepository extends JpaRepository<PlanoEnsino, Long> {

    Optional<PlanoEnsino> findByTurmaId(Long turmaId);

    boolean existsByTurmaId(Long turmaId);
}
