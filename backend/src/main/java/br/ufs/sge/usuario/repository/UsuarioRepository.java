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
    
        /**
     * Busca um discente pela matrícula acadêmica.
     *
     * A matrícula deve ser única para evitar dois alunos com
     * o mesmo identificador acadêmico.
     */
    Optional<Usuario> findByMatricula(String matricula);

    /**
     * Busca um docente pelo registro docente.
     *
     * O registro docente deve ser único para evitar duplicidade
     * entre professores.
     */
    Optional<Usuario> findByRegistroDocente(String registroDocente);

    /**
     * Busca um administrador pela matrícula administrativa.
     *
     * A matrícula administrativa deve ser única para evitar
     * duplicidade entre usuários administrativos.
     */
    Optional<Usuario> findByMatriculaAdministrativa(String matriculaAdministrativa);
}