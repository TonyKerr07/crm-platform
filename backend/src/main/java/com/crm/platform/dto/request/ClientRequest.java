package com.crm.platform.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para criar ou atualizar um cliente.
 * Usa Java Record (imutável por natureza — sem setter, sem boilerplate).
 */
public record ClientRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
        String name,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        @Size(max = 200, message = "Email deve ter no máximo 200 caracteres")
        String email,

        @Size(max = 30, message = "Telefone deve ter no máximo 30 caracteres")
        String phone,

        @Size(max = 200, message = "Nome da empresa deve ter no máximo 200 caracteres")
        String companyName,

        @Size(max = 30, message = "Documento deve ter no máximo 30 caracteres")
        String document,

        String notes
) {}
