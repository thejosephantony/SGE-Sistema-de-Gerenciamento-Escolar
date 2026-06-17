package br.ufs.sge.shared.exception;

/**
 * Exceção lançada ao tentar logar com credenciais de acesso inválidas.
 */
public class CredenciaisInvalidasException extends RuntimeException {
    public CredenciaisInvalidasException(String message) {
        super(message);
    }
}
