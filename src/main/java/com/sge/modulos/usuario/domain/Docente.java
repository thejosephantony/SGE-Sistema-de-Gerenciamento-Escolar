package com.sge.modulos.usuario.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "docente")
public class Docente extends Usuario {
    
    @Column(nullable = false, unique = true)
    private String matriculaSiape; // Exemplo de atributo específico
    
}
