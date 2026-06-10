package br.ufs.sge;

import br.ufs.sge.usuario.model.PerfilUsuario;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

    @PostConstruct
    public void init() {
        Usuario admin = usuarioRepository.findByEmail("admin@sge.ufs.br").orElse(new Usuario());
        admin.setNome("Administrador");
        admin.setEmail("admin@sge.ufs.br");
        admin.setSenha(passwordEncoder.encode("admin123"));
        admin.setPerfil(PerfilUsuario.ADMINISTRADOR);
        admin.setAtivo(true);
        usuarioRepository.save(admin);
        System.out.println("--- SENHA DO ADMIN ATUALIZADA COM SUCESSO (admin123) ---");
    }
}
