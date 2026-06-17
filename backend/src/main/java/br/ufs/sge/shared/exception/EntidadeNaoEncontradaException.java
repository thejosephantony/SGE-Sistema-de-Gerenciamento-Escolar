package br.ufs.sge.shared.exception;

/**
 * Exceção lançada quando um recurso/entidade solicitado não é encontrado no banco.
 */
public class EntidadeNaoEncontradaException extends RuntimeException {
    public EntidadeNaoEncontradaException(String message) {
        super(message);
    }
}
