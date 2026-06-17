package br.ufs.sge.shared.exception;

/**
 * Exceção lançada quando ocorre tentativa de duplicação de e-mail no cadastro/atualização.
 */
public class EmailDuplicadoException extends RuntimeException {
    public EmailDuplicadoException(String message) {
        super(message);
    }
}
