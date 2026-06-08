package br.ufs.sge.auth.dto;

import br.ufs.sge.usuario.model.Perfil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private Long id;
    private String nome;
    private String email;
    private Perfil perfil;
}
