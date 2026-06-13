package br.ufs.sge.usuario.repository;

import br.ufs.sge.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositório responsável pelo acesso aos dados da entidade Usuario.
 * Estende JpaRepository para reutilizar operações padrão de CRUD, paginação e ordenação.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo e-mail, utilizado principalmente no processo de autenticação.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica se já existe um usuário cadastrado com o e-mail informado.
     */
    boolean existsByEmail(String email);
}