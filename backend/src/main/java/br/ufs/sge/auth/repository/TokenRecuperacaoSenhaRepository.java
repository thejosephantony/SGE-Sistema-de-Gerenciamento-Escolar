package br.ufs.sge.auth.repository;

import br.ufs.sge.auth.model.TokenRecuperacaoSenha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRecuperacaoSenhaRepository extends JpaRepository<TokenRecuperacaoSenha, Long> {

    Optional<TokenRecuperacaoSenha> findByToken(String token);

    List<TokenRecuperacaoSenha> findByUsuarioIdAndUsadoFalse(Long usuarioId);
}
