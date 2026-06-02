package com.sge.modulos.academico.domain;

import com.sge.modulos.usuario.domain.Docente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String periodoLetivo;

    // Relacionamento: Vários docentes podem estar em uma turma (ou 1 pra N, dependendo da sua regra final)
    @ManyToOne 
    @JoinColumn(name = "docente_id", nullable = false)
    private Docente docenteResponsavel;

}
