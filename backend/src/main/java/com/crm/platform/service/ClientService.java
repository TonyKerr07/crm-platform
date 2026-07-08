package com.crm.platform.service;

import com.crm.platform.domain.entity.Client;
import com.crm.platform.dto.request.ClientRequest;
import com.crm.platform.dto.response.ClientResponse;
import com.crm.platform.dto.response.PageResponse;
import com.crm.platform.exception.BusinessException;
import com.crm.platform.exception.ResourceNotFoundException;
import com.crm.platform.mapper.ClientMapper;
import com.crm.platform.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Camada de serviço para clientes.
 * Toda a lógica de negócio fica aqui — o controller só delega pra cá.
 *
 * @Transactional garante que se qualquer coisa falhar, o banco volta ao estado anterior.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Transactional(readOnly = true)
    public PageResponse<ClientResponse> findAll(String search, Pageable pageable) {
        Page<Client> page;
        if (search != null && !search.isBlank()) {
            page = clientRepository.searchByTerm(search.trim(), pageable);
        } else {
            page = clientRepository.findByActiveTrue(pageable);
        }
        return PageResponse.from(page.map(clientMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public ClientResponse findById(UUID id) {
        return clientRepository.findById(id)
                .map(clientMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
    }

    @Transactional
    public ClientResponse create(ClientRequest request) {
        // Regra de negócio: email deve ser único
        if (clientRepository.existsByEmailIgnoreCase(request.email())) {
            throw new BusinessException(
                    "Já existe um cliente com o email: " + request.email());
        }

        Client client = clientMapper.toEntity(request);
        Client saved = clientRepository.save(client);
        log.info("Cliente criado com id={}, email={}", saved.getId(), saved.getEmail());
        return clientMapper.toResponse(saved);
    }

    @Transactional
    public ClientResponse update(UUID id, ClientRequest request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));

        // Verifica se o email já pertence a outro cliente
        clientRepository.findByEmailIgnoreCase(request.email()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BusinessException(
                        "Já existe outro cliente com o email: " + request.email());
            }
        });

        clientMapper.updateEntity(request, client);
        Client updated = clientRepository.save(client);
        log.info("Cliente atualizado id={}", updated.getId());
        return clientMapper.toResponse(updated);
    }

    /**
     * Soft delete — não apaga do banco, apenas desativa.
     * Dados históricos são preservados (boas práticas de CRM).
     */
    @Transactional
    public void deactivate(UUID id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        client.setActive(false);
        clientRepository.save(client);
        log.info("Cliente desativado id={}", id);
    }
}
