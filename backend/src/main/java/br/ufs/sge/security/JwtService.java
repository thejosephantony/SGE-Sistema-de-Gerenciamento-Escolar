package br.ufs.sge.security;

import br.ufs.sge.usuario.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

/**
 * Serviço responsável por gerar, interpretar e validar tokens JWT.
 */
@Service
public class JwtService {

    @Value("${sge.jwt.secret}")
    private String jwtSecret;

    @Value("${sge.jwt.expiration-ms}")
    private Long jwtExpirationMs;

    /**
     * Gera um token JWT com dados básicos do usuário autenticado.
     */
    public String gerarToken(Usuario usuario) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("id", usuario.getId())
                .claim("nome", usuario.getNome())
                .claim("perfil", usuario.getPerfil().name())
                .claim("status", usuario.getStatus().name())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(getChaveAssinatura(), Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Extrai o e-mail do usuário armazenado no subject do token.
     */
    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    /**
     * Verifica se o token pertence ao usuário informado e se ainda não expirou.
     */
    public boolean tokenValido(String token, UserDetails userDetails) {
        String email = extrairEmail(token);
        return email.equals(userDetails.getUsername()) && !tokenExpirado(token);
    }

    private boolean tokenExpirado(String token) {
        Date dataExpiracao = extrairClaim(token, Claims::getExpiration);
        return dataExpiracao.before(new Date());
    }

    private <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extrairTodasClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extrairTodasClaims(String token) {
        return Jwts.parser()
                .verifyWith(getChaveAssinatura())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getChaveAssinatura() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}