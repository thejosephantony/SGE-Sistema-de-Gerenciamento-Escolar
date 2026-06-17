package br.ufs.sge.ava.material.model;

import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "materiais_didaticos")
public class MaterialDidatico {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "link_arquivo", columnDefinition = "TEXT")
    private String linkArquivo;

    @Builder.Default
    @Column(name = "data_publicacao", nullable = false)
    private LocalDateTime dataPublicacao = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    private Usuario docente;
}
