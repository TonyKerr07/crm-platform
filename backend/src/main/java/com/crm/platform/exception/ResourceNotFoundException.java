package com.crm.platform.exception;

import java.util.UUID;

/**
 * Lançada quando um recurso não é encontrado pelo ID.
 * Resulta automaticamente em HTTP 404 pelo GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, UUID id) {
        super(String.format("%s não encontrado com id: %s", resource, id));
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
