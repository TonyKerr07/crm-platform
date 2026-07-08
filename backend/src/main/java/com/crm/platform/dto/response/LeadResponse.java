package com.crm.platform.dto.response;

import com.crm.platform.domain.enums.LeadStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record LeadResponse(
        UUID id,
        String name,
        String email,
        String phone,
        String companyName,
        String source,
        LeadStatus status,
        String statusLabel,
        BigDecimal estimatedValue,
        String notes,
        String responsible,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
