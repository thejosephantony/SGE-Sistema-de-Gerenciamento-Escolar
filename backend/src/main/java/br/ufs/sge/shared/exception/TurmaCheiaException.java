package br.ufs.sge.shared.exception;

/**
 * Exceção lançada quando ocorre tentativa de matricular um discente em uma turma cheia.
 */
public class TurmaCheiaException extends RuntimeException {
    public TurmaCheiaException(String message) {
        super(message);
    }
}
