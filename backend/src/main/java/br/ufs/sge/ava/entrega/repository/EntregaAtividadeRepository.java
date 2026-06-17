package br.ufs.sge.ava.entrega.repository;

import br.ufs.sge.ava.entrega.model.EntregaAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EntregaAtividadeRepository extends JpaRepository<EntregaAtividade, Long> {
    List<EntregaAtividade> findByAtividadeId(Long atividadeId);
    List<EntregaAtividade> findByDiscenteId(Long discenteId);
    Optional<EntregaAtividade> findByAtividadeIdAndDiscenteId(Long atividadeId, Long discenteId);
    boolean existsByAtividadeIdAndDiscenteId(Long atividadeId, Long discenteId);
}
