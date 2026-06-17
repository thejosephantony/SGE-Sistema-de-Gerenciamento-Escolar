package br.ufs.sge.ava.entrega.model;

import br.ufs.sge.ava.atividade.model.Atividade;
import br.ufs.sge.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "entregas_atividades",
    uniqueConstraints = @UniqueConstraint(columnNames = {"atividade_id", "discente_id"}))
public class EntregaAtividade {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "texto_resposta", columnDefinition = "TEXT")
    private String textoResposta;

    @Column(name = "link_arquivo", columnDefinition = "TEXT")
    private String linkArquivo;

    @Builder.Default
    @Column(name = "data_entrega", nullable = false)
    private LocalDateTime dataEntrega = LocalDateTime.now();

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusEntrega status = StatusEntrega.ENVIADA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atividade_id", nullable = false)
    private Atividade atividade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discente_id", nullable = false)
    private Usuario discente;
}
