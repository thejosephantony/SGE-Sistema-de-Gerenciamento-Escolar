package br.ufs.sge.auth.service;

import br.ufs.sge.auth.dto.EsqueciSenhaRequest;
import br.ufs.sge.auth.dto.MensagemResponse;
import br.ufs.sge.auth.dto.RedefinirSenhaRequest;
import br.ufs.sge.auth.model.TokenRecuperacaoSenha;
import br.ufs.sge.auth.repository.TokenRecuperacaoSenhaRepository;
import br.ufs.sge.usuario.model.StatusUsuario;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Serviço responsável pelo fluxo de recuperação de senha.
 *
 * Em ambiente local, o link de recuperação é exibido no console da aplicação.
 * Em produção, esse ponto pode ser substituído por envio real de e-mail.
 */
@Service
@RequiredArgsConstructor
public class RecuperacaoSenhaService {

    private static final int MINUTOS_EXPIRACAO_TOKEN = 30;

    private static final String MENSAGEM_SOLICITACAO =
            "Se o e-mail informado estiver cadastrado, enviaremos as instruções para redefinição de senha.";

    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacaoSenhaRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Solicita recuperação de senha.
     *
     * A resposta é sempre genérica para evitar exposição de quais e-mails
     * existem ou não existem no sistema.
     */
    @Transactional
    public MensagemResponse solicitarRedefinicao(EsqueciSenhaRequest request) {
        String email = request.email().trim();

        usuarioRepository.findByEmail(email)
                .filter(usuario -> usuario.getStatus() == StatusUsuario.ATIVO)
                .ifPresent(this::gerarTokenParaUsuario);

        return new MensagemResponse(MENSAGEM_SOLICITACAO);
    }

    /**
     * Redefine a senha usando um token válido e ainda não utilizado.
     */
    @Transactional
    public MensagemResponse redefinirSenha(RedefinirSenhaRequest request) {
        TokenRecuperacaoSenha tokenRecuperacao = tokenRepository.findByToken(request.token().trim())
                .orElseThrow(() -> new IllegalArgumentException("Token inválido ou expirado."));

        if (!tokenRecuperacao.podeSerUsado()) {
            throw new IllegalArgumentException("Token inválido ou expirado.");
        }

        Usuario usuario = tokenRecuperacao.getUsuario();

        usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        tokenRecuperacao.setUsado(true);
        tokenRepository.save(tokenRecuperacao);

        return new MensagemResponse("Senha redefinida com sucesso.");
    }

    private void gerarTokenParaUsuario(Usuario usuario) {
        invalidarTokensAnteriores(usuario);

        String token = UUID.randomUUID().toString();

        TokenRecuperacaoSenha tokenRecuperacao = TokenRecuperacaoSenha.builder()
                .usuario(usuario)
                .token(token)
                .dataExpiracao(LocalDateTime.now().plusMinutes(MINUTOS_EXPIRACAO_TOKEN))
                .usado(false)
                .build();

        tokenRepository.save(tokenRecuperacao);

        String linkLocal = "http://localhost:5173/redefinir-senha?token=" + token;

        System.out.println();
        System.out.println("====================================================");
        System.out.println("[SGE] Link de recuperação de senha gerado:");
        System.out.println(linkLocal);
        System.out.println("Validade: " + MINUTOS_EXPIRACAO_TOKEN + " minutos");
        System.out.println("====================================================");
        System.out.println();
    }

    private void invalidarTokensAnteriores(Usuario usuario) {
        List<TokenRecuperacaoSenha> tokensAtivos =
                tokenRepository.findByUsuarioIdAndUsadoFalse(usuario.getId());

        tokensAtivos.forEach(token -> token.setUsado(true));

        tokenRepository.saveAll(tokensAtivos);
    }
}
