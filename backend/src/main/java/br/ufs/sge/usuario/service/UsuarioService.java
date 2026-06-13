package br.ufs.sge.usuario.service;

import br.ufs.sge.usuario.dto.UsuarioRequest;
import br.ufs.sge.usuario.dto.UsuarioResponse;
import br.ufs.sge.usuario.model.StatusUsuario;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável pelas regras de negócio relacionadas aos usuários.
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Cadastra um novo usuário no sistema.
     * A senha recebida no DTO é criptografada antes de ser persistida.
     */
    public UsuarioResponse cadastrarUsuario(UsuarioRequest request) {

        if (usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Já existe um usuário com este e-mail.");
        }

        String senhaCriptografada = passwordEncoder.encode(request.senha());

        Usuario novoUsuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(senhaCriptografada)
                .perfil(request.perfil())
                .status(StatusUsuario.ATIVO)
                .build();

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        return UsuarioResponse.fromEntity(usuarioSalvo);
    }

    /**
     * Lista todos os usuários cadastrados.
     */
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    /**
     * Busca um usuário pelo identificador.
     */
    public UsuarioResponse buscarUsuarioPorId(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        return UsuarioResponse.fromEntity(usuario);
    }

    /**
     * Atualiza os dados de um usuário existente.
     */
    public UsuarioResponse atualizarUsuario(Long id, UsuarioRequest request) {
        Usuario usuario = buscarEntidadePorId(id);

        usuarioRepository.findByEmail(request.email())
                .filter(usuarioEncontrado -> !usuarioEncontrado.getId().equals(id))
                .ifPresent(usuarioEncontrado -> {
                    throw new RuntimeException("Já existe outro usuário cadastrado com este e-mail.");
                });

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setPerfil(request.perfil());

        if (request.senha() != null && !request.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);

        return UsuarioResponse.fromEntity(usuarioAtualizado);
    }

    /**
     * Desativa um usuário, impedindo seu acesso ao sistema.
     */
    public void desativarUsuario(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        usuario.setStatus(StatusUsuario.INATIVO);
        usuarioRepository.save(usuario);
    }

    /**
     * Reativa um usuário previamente inativado.
     */
    public void ativarUsuario(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        usuario.setStatus(StatusUsuario.ATIVO);
        usuarioRepository.save(usuario);
    }

    /**
     * Método auxiliar para buscar a entidade Usuario ou lançar exceção caso não exista.
     */
    private Usuario buscarEntidadePorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }
}