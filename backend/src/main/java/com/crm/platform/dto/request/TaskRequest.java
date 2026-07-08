package com.crm.platform.dto.request;

import com.crm.platform.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record TaskRequest(

        @NotBlank(message = "Título é obrigatório")
        @Size(max = 255)
        String title,

        String description,

        TaskStatus status,

        LocalDate dueDate,

        @Size(max = 150)
        String assignedTo,

        @NotNull(message = "ID do cliente é obrigatório")
        UUID clientId
) {}
