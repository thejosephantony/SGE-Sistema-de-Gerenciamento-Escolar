package br.ufs.sge.usuario.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Entidade Usuario que representa a tabela "usuarios" no banco de dados.
 * Implementa UserDetails para integração direta com a autenticação do Spring Security.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    private static final long serialVersionUID = 1L;

    /* Identificador único para cada usuário. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* Nome completo do usuário. */
    @Column(nullable = false, length = 120)
    private String nome;

    /* E-mail único utilizado para login. */
    @Column(nullable = false, unique = true, length = 120)
    private String email;

    /* Senha criptografada do usuário. */
    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    /* Perfil de acesso do usuário no sistema. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PerfilUsuario perfil;

    /* Indica o status do usuário no sistema. */
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusUsuario status = StatusUsuario.ATIVO;

    @Column(length = 50)
    private String matricula;

    @Column(length = 100)
    private String curso;

    @Column(name = "registro_docente", length = 50)
    private String registroDocente;

    @Column(length = 50)
    private String titulacao;

    @Column(name = "matricula_administrativa", length = 50)
    private String matriculaAdministrativa;


    /**
     * Define as permissões do usuário com base no perfil.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    /**
     * Retorna a senha criptografada usada pelo Spring Security.
     */
    @Override
    public String getPassword() {
        return senhaHash;
    }

    /**
     * Retorna o e-mail usado como identificador de login.
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * A conta não possui expiração nesta versão do sistema.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * A conta só é considerada desbloqueada se o status for ATIVO.
     */
    @Override
    public boolean isAccountNonLocked() {
        return StatusUsuario.ATIVO.equals(status);
    }

    /**
     * A senha não possui expiração nesta versão do sistema.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Só é permitido login se o status for ATIVO.
     */
    @Override
    public boolean isEnabled() {
        return StatusUsuario.ATIVO.equals(status);
    }
}