package com.crm.platform.dto.response;

import com.crm.platform.domain.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        String title,
        String description,
        TaskStatus status,
        String statusLabel,
        LocalDate dueDate,
        boolean overdue,
        String assignedTo,
        UUID clientId,
        String clientName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
