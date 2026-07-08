package com.crm.platform.service;

import com.crm.platform.domain.entity.Client;
import com.crm.platform.domain.entity.Task;
import com.crm.platform.domain.enums.TaskStatus;
import com.crm.platform.dto.request.TaskRequest;
import com.crm.platform.dto.response.PageResponse;
import com.crm.platform.dto.response.TaskResponse;
import com.crm.platform.exception.ResourceNotFoundException;
import com.crm.platform.mapper.TaskMapper;
import com.crm.platform.repository.ClientRepository;
import com.crm.platform.repository.TaskRepository;
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
public class TaskService {

    private final TaskRepository taskRepository;
    private final ClientRepository clientRepository;
    private final TaskMapper taskMapper;

    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> findAll(UUID clientId, TaskStatus status, Pageable pageable) {
        Page<Task> page;
        if (clientId != null) {
            page = taskRepository.findByClientId(clientId, pageable);
        } else if (status != null) {
            page = taskRepository.findByStatus(status, pageable);
        } else {
            page = taskRepository.findAll(pageable);
        }
        return PageResponse.from(page.map(taskMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(UUID id) {
        return taskRepository.findById(id)
                .map(taskMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa", id));
    }

    @Transactional
    public TaskResponse create(TaskRequest request) {
        Client client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", request.clientId()));

        Task task = taskMapper.toEntity(request);
        task.setClient(client);
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.ABERTA);
        }

        Task saved = taskRepository.save(task);
        log.info("Tarefa criada id={}, cliente={}", saved.getId(), client.getName());
        return taskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponse update(UUID id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa", id));

        // Permite trocar o cliente da tarefa se o clientId mudou
        if (!task.getClient().getId().equals(request.clientId())) {
            Client newClient = clientRepository.findById(request.clientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente", request.clientId()));
            task.setClient(newClient);
        }

        taskMapper.updateEntity(request, task);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse complete(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarefa", id));
        task.setStatus(TaskStatus.CONCLUIDA);
        log.info("Tarefa concluída id={}", id);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public void delete(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tarefa", id);
        }
        taskRepository.deleteById(id);
        log.info("Tarefa deletada id={}", id);
    }
}
