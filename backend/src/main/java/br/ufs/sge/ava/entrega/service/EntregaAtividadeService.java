package br.ufs.sge.ava.entrega.service;

import br.ufs.sge.ava.atividade.model.Atividade;
import br.ufs.sge.ava.atividade.model.StatusAtividade;
import br.ufs.sge.ava.atividade.repository.AtividadeRepository;
import br.ufs.sge.ava.entrega.dto.EntregaAtividadeRequest;
import br.ufs.sge.ava.entrega.dto.EntregaAtividadeResponse;
import br.ufs.sge.ava.entrega.model.EntregaAtividade;
import br.ufs.sge.ava.entrega.model.StatusEntrega;
import br.ufs.sge.ava.entrega.repository.EntregaAtividadeRepository;
import br.ufs.sge.shared.exception.EntidadeNaoEncontradaException;
import br.ufs.sge.usuario.model.Usuario;
import br.ufs.sge.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntregaAtividadeService {
    private final EntregaAtividadeRepository entregaRepository;
    private final AtividadeRepository atividadeRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public EntregaAtividadeResponse enviarEntrega(EntregaAtividadeRequest request, Long discenteId) {
        Atividade atividade = atividadeRepository.findById(request.atividadeId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Atividade não encontrada com o ID: " + request.atividadeId()));
        if (atividade.getStatus() != StatusAtividade.ABERTA)
            throw new IllegalStateException("Esta atividade não está aberta para entregas.");
        Usuario discente = usuarioRepository.findById(discenteId)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Discente não encontrado com o ID: " + discenteId));
        EntregaAtividade entrega = entregaRepository
                .findByAtividadeIdAndDiscenteId(request.atividadeId(), discenteId)
                .orElse(EntregaAtividade.builder().atividade(atividade).discente(discente).build());
        entrega.setTextoResposta(request.textoResposta());
        entrega.setLinkArquivo(request.linkArquivo());
        entrega.setDataEntrega(LocalDateTime.now());
        entrega.setStatus(LocalDateTime.now().isAfter(atividade.getPrazo())
                ? StatusEntrega.ATRASADA : StatusEntrega.ENVIADA);
        return EntregaAtividadeResponse.fromEntity(entregaRepository.save(entrega));
    }

    @Transactional(readOnly = true)
    public List<EntregaAtividadeResponse> listarPorAtividade(Long atividadeId) {
        return entregaRepository.findByAtividadeId(atividadeId).stream()
                .map(EntregaAtividadeResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EntregaAtividadeResponse> listarMinhasEntregas(Long discenteId) {
        return entregaRepository.findByDiscenteId(discenteId).stream()
                .map(EntregaAtividadeResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EntregaAtividadeResponse buscarPorId(Long id) {
        return EntregaAtividadeResponse.fromEntity(entregaRepository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Entrega não encontrada com o ID: " + id)));
    }
}
