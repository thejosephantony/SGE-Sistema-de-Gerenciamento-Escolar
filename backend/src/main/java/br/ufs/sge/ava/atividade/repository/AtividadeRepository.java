package br.ufs.sge.ava.atividade.repository;

import br.ufs.sge.ava.atividade.model.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    List<Atividade> findByTurmaId(Long turmaId);
}
