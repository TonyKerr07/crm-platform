package com.crm.platform.dto.request;

import com.crm.platform.domain.enums.LeadStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record LeadRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 150)
        String name,

        @Email(message = "Email inválido")
        @Size(max = 200)
        String email,

        @Size(max = 30)
        String phone,

        @Size(max = 200)
        String companyName,

        @Size(max = 100)
        String source,

        LeadStatus status,

        BigDecimal estimatedValue,

        String notes,

        @Size(max = 150)
        String responsible
) {}
