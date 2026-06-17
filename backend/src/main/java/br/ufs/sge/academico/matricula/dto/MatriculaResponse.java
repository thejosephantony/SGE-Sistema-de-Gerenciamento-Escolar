package br.ufs.sge.academico.matricula.dto;

import br.ufs.sge.academico.matricula.model.Matricula;
import br.ufs.sge.academico.matricula.model.StatusMatricula;

import java.time.format.DateTimeFormatter;

/**
 * DTO para retorno de informações de matrícula de discentes.
 * Inclui campos calculados: média final e situação acadêmica.
 */
public record MatriculaResponse(
    Long id,
    String dataMatricula,
    StatusMatricula status,
    Long discenteId,
    String discenteNome,
    String discenteMatricula,
    Long turmaId,
    String turmaCodigo,
    String disciplinaNome,
    String disciplinaCodigo,
    Double notaP1,
    Double notaP2,
    Integer faltas,
    Double media,
    String situacao
) {
    /** Mínimo de frequência para aprovação (75%). */
    private static final double FREQUENCIA_MINIMA = 75.0;
    /** Nota mínima para aprovação. */
    private static final double NOTA_APROVACAO = 6.0;
    /** Total de aulas no semestre para cálculo de frequência. */
    private static final int TOTAL_AULAS = 100;

    public static MatriculaResponse fromEntity(Matricula matricula) {
        Double p1 = matricula.getNotaP1();
        Double p2 = matricula.getNotaP2();
        Integer faltas = matricula.getFaltas();

        // Cálculo da média aritmética
        Double media = (p1 != null && p2 != null) ? (p1 + p2) / 2.0 : null;

        // Cálculo da frequência
        int faltasNum = (faltas != null) ? faltas : 0;
        double frequencia = Math.max(0.0, 100.0 - (faltasNum * (100.0 / TOTAL_AULAS)));

        // Determinação da situação acadêmica
        String situacao;
        if (frequencia < FREQUENCIA_MINIMA) {
            situacao = "REPROVADO_FREQUENCIA";
        } else if (media == null) {
            situacao = "SEM_NOTAS";
        } else if (media >= NOTA_APROVACAO) {
            situacao = "APROVADO";
        } else {
            situacao = "EM_RECUPERACAO";
        }

        return new MatriculaResponse(
            matricula.getId(),
            matricula.getDataMatricula() != null
                ? matricula.getDataMatricula().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null,
            matricula.getStatus(),
            matricula.getDiscente().getId(),
            matricula.getDiscente().getNome(),
            matricula.getDiscente().getMatricula(),
            matricula.getTurma().getId(),
            matricula.getTurma().getCodigo(),
            matricula.getTurma().getDisciplina().getNome(),
            matricula.getTurma().getDisciplina().getCodigo(),
            p1,
            p2,
            faltas,
            media,
            situacao
        );
    }
}
