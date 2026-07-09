package com.crm.platform.service;

import com.crm.platform.domain.entity.Lead;
import com.crm.platform.domain.enums.LeadStatus;
import com.crm.platform.dto.request.LeadRequest;
import com.crm.platform.dto.response.LeadResponse;
import com.crm.platform.dto.response.PageResponse;
import com.crm.platform.exception.ResourceNotFoundException;
import com.crm.platform.mapper.LeadMapper;
import com.crm.platform.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadMapper leadMapper;

    @Transactional(readOnly = true)
    public PageResponse<LeadResponse> findAll(String search, LeadStatus status, Pageable pageable) {
        Page<Lead> page;
        if (search != null && !search.isBlank()) {
            page = leadRepository.searchByTerm(search.trim(), pageable);
        } else if (status != null) {
            page = leadRepository.findByStatus(status, pageable);
        } else {
            page = leadRepository.findAll(pageable);
        }
        return PageResponse.from(page.map(leadMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public LeadResponse findById(UUID id) {
        return leadRepository.findById(id)
                .map(leadMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
    }

    @Transactional
    public LeadResponse create(LeadRequest request) {
        Lead lead = leadMapper.toEntity(request);
        // Se status não veio no request, começa como NOVO
        if (lead.getStatus() == null) {
            lead.setStatus(LeadStatus.NOVO);
        }
        Lead saved = leadRepository.save(lead);
        log.info("Lead criado id={}, nome={}", saved.getId(), saved.getName());
        return leadMapper.toResponse(saved);
    }

    @Transactional
    public LeadResponse update(UUID id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
        leadMapper.updateEntity(request, lead);
        return leadMapper.toResponse(leadRepository.save(lead));
    }

    @Transactional
    public LeadResponse updateStatus(UUID id, LeadStatus newStatus) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
        log.info("Lead id={} mudando status de {} para {}", id, lead.getStatus(), newStatus);
        lead.setStatus(newStatus);
        return leadMapper.toResponse(leadRepository.save(lead));
    }

    @Transactional
    public void delete(UUID id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead", id);
        }
        leadRepository.deleteById(id);
        log.info("Lead deletado id={}", id);
    }
}
