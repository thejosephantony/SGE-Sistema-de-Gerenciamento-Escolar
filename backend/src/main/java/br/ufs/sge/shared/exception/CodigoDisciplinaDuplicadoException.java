package br.ufs.sge.shared.exception;

/**
 * Exceção lançada quando ocorre tentativa de duplicação de código de disciplina.
 */
public class CodigoDisciplinaDuplicadoException extends RuntimeException {
    public CodigoDisciplinaDuplicadoException(String message) {
        super(message);
    }
}
