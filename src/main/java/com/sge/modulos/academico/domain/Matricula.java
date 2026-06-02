package com.sge.modulos.academico.domain;

import com.sge.modulos.usuario.domain.Discente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "matricula", uniqueConstraints = @UniqueConstraint(columnNames = { "discente_id", "turma_id" })) // Evita duplicidade
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "discente_id", nullable = false)
    private Discente discente;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

}
