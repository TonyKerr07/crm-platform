package com.crm.platform.controller;

import com.crm.platform.domain.enums.TaskStatus;
import com.crm.platform.dto.request.TaskRequest;
import com.crm.platform.dto.response.PageResponse;
import com.crm.platform.dto.response.TaskResponse;
import com.crm.platform.service.TaskService;
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
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tarefas", description = "Gerenciamento de tarefas por cliente")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('EMPRESA')")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Listar tarefas (filtro por cliente ou status)")
    public ResponseEntity<PageResponse<TaskResponse>> findAll(
            @RequestParam(required = false) UUID clientId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return ResponseEntity.ok(taskService.findAll(clientId, status, PageRequest.of(page, size, sort)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tarefa por ID")
    public ResponseEntity<TaskResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Criar nova tarefa")
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar tarefa")
    public ResponseEntity<TaskResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.update(id, request));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Marcar tarefa como concluída")
    public ResponseEntity<TaskResponse> complete(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.complete(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar tarefa")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
