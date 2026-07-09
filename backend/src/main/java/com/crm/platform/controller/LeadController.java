package com.crm.platform.controller;

import com.crm.platform.domain.enums.LeadStatus;
import com.crm.platform.dto.request.LeadRequest;
import com.crm.platform.dto.response.LeadResponse;
import com.crm.platform.dto.response.PageResponse;
import com.crm.platform.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/leads")
@RequiredArgsConstructor
@Tag(name = "Leads", description = "Gerenciamento de leads e funil de vendas")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('EMPRESA')")
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    @Operation(summary = "Listar leads com filtros opcionais")
    public ResponseEntity<PageResponse<LeadResponse>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return ResponseEntity.ok(leadService.findAll(search, status, PageRequest.of(page, size, sort)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar lead por ID")
    public ResponseEntity<LeadResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(leadService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar novo lead")
    public ResponseEntity<LeadResponse> create(@Valid @RequestBody LeadRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leadService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar lead")
    public ResponseEntity<LeadResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(leadService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status do lead (mover no funil)")
    public ResponseEntity<LeadResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam LeadStatus status) {
        return ResponseEntity.ok(leadService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar lead")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
