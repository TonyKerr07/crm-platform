package com.crm.platform.domain.enums;

/**
 * Status de uma tarefa associada a um cliente ou lead.
 */
public enum TaskStatus {
    ABERTA("Aberta"),
    EM_ANDAMENTO("Em Andamento"),
    CONCLUIDA("Concluída"),
    CANCELADA("Cancelada");

    private final String label;

    TaskStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
