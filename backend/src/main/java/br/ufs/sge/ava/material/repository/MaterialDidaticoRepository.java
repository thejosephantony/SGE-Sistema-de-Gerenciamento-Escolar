package br.ufs.sge.ava.material.repository;

import br.ufs.sge.ava.material.model.MaterialDidatico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialDidaticoRepository extends JpaRepository<MaterialDidatico, Long> {
    List<MaterialDidatico> findByTurmaId(Long turmaId);
}
