package br.ufs.sge.usuario.service;

import br.ufs.sge.shared.exception.EmailDuplicadoException;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.usuario.dto.UsuarioRequest;
import br.ufs.sge.usuario.dto.UsuarioResponse;
import br.ufs.sge.usuario.dto.UsuarioUpdateRequest;
import br.ufs.sge.usuario.model.StatusUsuario;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável pelas regras de negócio relacionadas aos usuários.
 *
 * Esta classe concentra as validações e operações principais do módulo de usuários,
 * evitando que regras importantes fiquem espalhadas pelos controllers.
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Cadastra um novo usuário no sistema.
     *
     * Regras aplicadas:
     *
     * - o e-mail não pode estar duplicado;
     * - a matrícula do discente não pode estar duplicada;
     * - o registro docente não pode estar duplicado;
     * - a matrícula administrativa não pode estar duplicada;
     * - a senha deve ser criptografada antes de ser salva.
     */
    public UsuarioResponse cadastrarUsuario(UsuarioRequest request) {

        /*
         * Antes de criar o usuário, validamos todos os campos que devem ser únicos.
         *
         * Como se trata de cadastro, ainda não existe usuário atual.
         * Por isso, o idUsuarioAtual é null.
         */
        validarDadosUnicos(
                request.email(),
                request.matricula(),
                request.registroDocente(),
                request.matriculaAdministrativa(),
                null
        );

        /*
         * A senha nunca deve ser salva em texto puro.
         * Por isso, usamos BCrypt por meio do PasswordEncoder.
         */
        String senhaCriptografada = passwordEncoder.encode(request.senha());

        Usuario novoUsuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(senhaCriptografada)
                .perfil(request.perfil())
                .status(StatusUsuario.ATIVO)
                .matricula(request.matricula())
                .curso(request.curso())
                .registroDocente(request.registroDocente())
                .titulacao(request.titulacao())
                .matriculaAdministrativa(request.matriculaAdministrativa())
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
     *
     * Regras aplicadas:
     *
     * - o usuário precisa existir;
     * - o novo e-mail não pode pertencer a outro usuário;
     * - a nova matrícula não pode pertencer a outro discente;
     * - o novo registro docente não pode pertencer a outro docente;
     * - a nova matrícula administrativa não pode pertencer a outro administrador;
     * - a senha só será alterada se for enviada no request.
     */
    public UsuarioResponse atualizarUsuario(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = buscarEntidadePorId(id);

        /*
         * Na edição, também validamos duplicidade.
         *
         * Porém, passamos o ID do próprio usuário que está sendo editado.
         * Isso permite que ele mantenha seus próprios dados sem o sistema
         * acusar duplicidade contra ele mesmo.
         */
        validarDadosUnicos(
                request.email(),
                request.matricula(),
                request.registroDocente(),
                request.matriculaAdministrativa(),
                id
        );

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setPerfil(request.perfil());
        usuario.setMatricula(request.matricula());
        usuario.setCurso(request.curso());
        usuario.setRegistroDocente(request.registroDocente());
        usuario.setTitulacao(request.titulacao());
        usuario.setMatriculaAdministrativa(request.matriculaAdministrativa());

        /*
         * A senha na edição é opcional.
         *
         * Se o campo vier vazio ou nulo, mantemos a senha atual.
         * Se vier preenchido, criptografamos e substituímos a senha antiga.
         */
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
     * Busca a entidade Usuario pelo ID.
     *
     * Este método evita repetição de código, pois várias operações precisam
     * buscar um usuário antes de executar alguma ação.
     */
    private Usuario buscarEntidadePorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário não encontrado."));
    }

    /**
     * Valida se os principais identificadores do usuário já existem no sistema.
     *
     * Campos verificados:
     *
     * - e-mail;
     * - matrícula de discente;
     * - registro docente;
     * - matrícula administrativa.
     *
     * O parâmetro idUsuarioAtual serve para diferenciar cadastro de edição:
     *
     * - no cadastro, ele será null;
     * - na edição, ele será o ID do próprio usuário editado.
     *
     * Isso permite que, ao editar um usuário, ele possa manter seu próprio e-mail,
     * matrícula, registro docente ou matrícula administrativa sem gerar falso erro
     * de duplicidade.
     */
    private void validarDadosUnicos(
            String email,
            String matricula,
            String registroDocente,
            String matriculaAdministrativa,
            Long idUsuarioAtual
    ) {

        /*
         * Validação de e-mail.
         *
         * O e-mail é usado para login, portanto não pode existir em outro usuário.
         */
        usuarioRepository.findByEmail(email)
                .filter(usuarioEncontrado -> !usuarioEncontrado.getId().equals(idUsuarioAtual))
                .ifPresent(usuarioEncontrado -> {
                    throw new EmailDuplicadoException(
                            "Já existe um usuário cadastrado com este e-mail."
                    );
                });

        /*
         * Validação da matrícula do discente.
         *
         * Essa regra só é aplicada se a matrícula foi informada.
         * Usuários que não são discentes normalmente não possuem esse campo.
         */
        if (matricula != null && !matricula.isBlank()) {
            usuarioRepository.findByMatricula(matricula)
                    .filter(usuarioEncontrado -> !usuarioEncontrado.getId().equals(idUsuarioAtual))
                    .ifPresent(usuarioEncontrado -> {
                        throw new IllegalArgumentException(
                                "Já existe um discente cadastrado com esta matrícula."
                        );
                    });
        }

        /*
         * Validação do registro docente.
         *
         * Essa regra evita que dois professores sejam cadastrados
         * com o mesmo registro docente.
         */
        if (registroDocente != null && !registroDocente.isBlank()) {
            usuarioRepository.findByRegistroDocente(registroDocente)
                    .filter(usuarioEncontrado -> !usuarioEncontrado.getId().equals(idUsuarioAtual))
                    .ifPresent(usuarioEncontrado -> {
                        throw new IllegalArgumentException(
                                "Já existe um docente cadastrado com este registro docente."
                        );
                    });
        }

        /*
         * Validação da matrícula administrativa.
         *
         * Essa regra evita que dois administradores sejam cadastrados
         * com a mesma matrícula administrativa.
         */
        if (matriculaAdministrativa != null && !matriculaAdministrativa.isBlank()) {
            usuarioRepository.findByMatriculaAdministrativa(matriculaAdministrativa)
                    .filter(usuarioEncontrado -> !usuarioEncontrado.getId().equals(idUsuarioAtual))
                    .ifPresent(usuarioEncontrado -> {
                        throw new IllegalArgumentException(
                                "Já existe um administrador cadastrado com esta matrícula administrativa."
                        );
                    });
        }
    }
}