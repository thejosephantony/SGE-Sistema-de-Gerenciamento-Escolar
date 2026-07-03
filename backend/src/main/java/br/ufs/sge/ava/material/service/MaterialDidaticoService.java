package br.ufs.sge.ava.material.service;

import br.ufs.sge.academico.turma.model.Turma;
import br.ufs.sge.academico.turma.repository.TurmaRepository;
import br.ufs.sge.ava.material.dto.MaterialDidaticoRequest;
import br.ufs.sge.ava.material.dto.MaterialDidaticoResponse;
import br.ufs.sge.ava.material.model.MaterialDidatico;
import br.ufs.sge.ava.material.repository.MaterialDidaticoRepository;
import br.ufs.sge.shared.exception.AcessoNegadoException;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.usuario.model.PerfilUsuario;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialDidaticoService {

    private final MaterialDidaticoRepository materialRepository;
    private final TurmaRepository turmaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public MaterialDidaticoResponse cadastrarMaterial(MaterialDidaticoRequest request, Long docenteId) {
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com o ID: " + request.turmaId()));
        Usuario docente = usuarioRepository.findById(docenteId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Docente não encontrado com o ID: " + docenteId));
        MaterialDidatico material = MaterialDidatico.builder()
                .titulo(request.titulo())
                .descricao(request.descricao())
                .linkArquivo(request.linkArquivo())
                .turma(turma)
                .docente(docente)
                .build();
        return MaterialDidaticoResponse.fromEntity(materialRepository.save(material));
    }

    @Transactional(readOnly = true)
    public List<MaterialDidaticoResponse> listarPorTurma(Long turmaId) {
        return materialRepository.findByTurmaId(turmaId).stream()
                .map(MaterialDidaticoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MaterialDidaticoResponse buscarPorId(Long id) {
        return MaterialDidaticoResponse.fromEntity(materialRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Material não encontrado com o ID: " + id)));
    }

    @Transactional
    public MaterialDidaticoResponse atualizarMaterial(Long id, MaterialDidaticoRequest request, Usuario usuarioAutenticado) {
        MaterialDidatico material = materialRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Material não encontrado com o ID: " + id));
        verificarPropriedade(material, usuarioAutenticado, "editar");
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Turma não encontrada com o ID: " + request.turmaId()));
        material.setTitulo(request.titulo());
        material.setDescricao(request.descricao());
        material.setLinkArquivo(request.linkArquivo());
        material.setTurma(turma);
        return MaterialDidaticoResponse.fromEntity(materialRepository.save(material));
    }

    @Transactional
    public void removerMaterial(Long id, Usuario usuarioAutenticado) {
        MaterialDidatico material = materialRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Material não encontrado com o ID: " + id));
        verificarPropriedade(material, usuarioAutenticado, "remover");
        materialRepository.deleteById(id);
    }

    private void verificarPropriedade(MaterialDidatico material, Usuario usuario, String acao) {
        boolean isAdmin = usuario.getPerfil() == PerfilUsuario.ADMINISTRADOR;
        boolean isDono = material.getDocente().getId().equals(usuario.getId());
        if (!isAdmin && !isDono) {
            throw new AcessoNegadoException("Você não tem permissão para " + acao + " este material.");
        }
    }
}
