package br.ufs.sge.shared.exception;

/**
 * Exceção lançada quando ocorre tentativa de criar turma duplicada.
 */
public class TurmaDuplicadaException extends RuntimeException {
    public TurmaDuplicadaException(String message) {
        super(message);
    }
}
