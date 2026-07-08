package com.crm.platform.mapper;

import com.crm.platform.domain.entity.Task;
import com.crm.platform.dto.request.TaskRequest;
import com.crm.platform.dto.response.TaskResponse;
import org.mapstruct.*;

import java.time.LocalDate;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        imports = {LocalDate.class})
public interface TaskMapper {

    @Mapping(target = "clientId",   expression = "java(task.getClient().getId())")
    @Mapping(target = "clientName", expression = "java(task.getClient().getName())")
    @Mapping(target = "statusLabel", expression = "java(task.getStatus().getLabel())")
    @Mapping(target = "overdue", expression = "java(task.getDueDate() != null && task.getDueDate().isBefore(LocalDate.now()) && (task.getStatus() == com.crm.platform.domain.enums.TaskStatus.ABERTA || task.getStatus() == com.crm.platform.domain.enums.TaskStatus.EM_ANDAMENTO))")
    TaskResponse toResponse(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "client", ignore = true)
    Task toEntity(TaskRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "client", ignore = true)
    void updateEntity(TaskRequest request, @MappingTarget Task task);
}
