package br.ufs.sge.auth.model;

import br.ufs.sge.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Token de uso único utilizado no fluxo de recuperação de senha.
 *
 * Atende ao RF04, permitindo que o usuário redefina a senha por meio
 * de um token temporário associado ao e-mail cadastrado.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tokens_recuperacao_senha")
public class TokenRecuperacaoSenha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Usuário dono da solicitação de recuperação.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    /**
     * Token único enviado ao usuário.
     */
    @Column(nullable = false, unique = true, length = 120)
    private String token;

    /**
     * Momento em que o token deixa de ser válido.
     */
    @Column(name = "data_expiracao", nullable = false)
    private LocalDateTime dataExpiracao;

    /**
     * Indica se o token já foi utilizado.
     */
    @Builder.Default
    @Column(nullable = false)
    private Boolean usado = false;

    /**
     * Data de criação do token.
     */
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }

        if (usado == null) {
            usado = false;
        }
    }

    public boolean expirado() {
        return LocalDateTime.now().isAfter(dataExpiracao);
    }

    public boolean podeSerUsado() {
        return Boolean.FALSE.equals(usado) && !expirado();
    }
}
