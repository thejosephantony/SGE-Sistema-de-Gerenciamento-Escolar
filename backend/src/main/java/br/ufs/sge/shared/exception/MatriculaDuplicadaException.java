package br.ufs.sge.shared.exception;

/**
 * Exceção lançada quando ocorre tentativa de matricular um aluno duplicadamente em uma turma.
 */
public class MatriculaDuplicadaException extends RuntimeException {
    public MatriculaDuplicadaException(String message) {
        super(message);
    }
}
