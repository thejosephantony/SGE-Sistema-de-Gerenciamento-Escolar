package br.ufs.sge.academico.planoensino.model;

import br.ufs.sge.academico.turma.model.Turma;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Representa o plano de ensino de uma turma.
 *
 * Atende ao RF28, permitindo que o docente registre informações pedagógicas
 * como ementa, objetivos, conteúdo programático, metodologia, avaliação e bibliografia.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "planos_ensino",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_planos_ensino_turma",
                        columnNames = "turma_id"
                )
        }
)
public class PlanoEnsino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Cada turma possui no máximo um plano de ensino.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String ementa;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String objetivos;

    @Column(name = "conteudo_programatico", nullable = false, columnDefinition = "TEXT")
    private String conteudoProgramatico;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String metodologia;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String avaliacao;

    @Column(columnDefinition = "TEXT")
    private String bibliografia;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @PrePersist
    public void prePersist() {
        LocalDateTime agora = LocalDateTime.now();

        if (criadoEm == null) {
            criadoEm = agora;
        }

        atualizadoEm = agora;
    }

    @PreUpdate
    public void preUpdate() {
        atualizadoEm = LocalDateTime.now();
    }
}
