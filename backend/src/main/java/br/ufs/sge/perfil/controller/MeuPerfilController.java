package br.ufs.sge.perfil.controller;

import br.ufs.sge.perfil.dto.MeuPerfilResponseDTO;
import br.ufs.sge.perfil.service.MeuPerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meu-perfil")
@RequiredArgsConstructor
public class MeuPerfilController {

    private final MeuPerfilService meuPerfilService;

    @GetMapping
    public MeuPerfilResponseDTO buscarMeuPerfil(Authentication authentication) {
        return meuPerfilService.buscarPerfil(authentication);
    }
}
