package br.ufs.sge.shared.exception;

/**
 * Exceção lançada ao tentar logar com um usuário inativo.
 */
public class UsuarioInativoException extends RuntimeException {
    public UsuarioInativoException(String message) {
        super(message);
    }
}
