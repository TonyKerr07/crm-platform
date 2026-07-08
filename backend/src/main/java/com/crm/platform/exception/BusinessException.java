package com.crm.platform.exception;

/**
 * Lançada quando uma regra de negócio é violada.
 * Ex.: tentar cadastrar um email que já existe.
 * Resulta em HTTP 409 Conflict pelo GlobalExceptionHandler.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
