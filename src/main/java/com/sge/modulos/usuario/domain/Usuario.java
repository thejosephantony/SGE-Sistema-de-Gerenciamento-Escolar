package com.sge.modulos.usuario.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED) // Cria tabelas separadas que se ligam por FK
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true) // Restrição de integridade
    private String email;

    @Column(nullable = false)
    private String senha; // Deve ser armazenada em hash

    private boolean ativo = true;

}
