package com.crm.platform.domain.enums;

/**
 * Status do funil de vendas para um lead.
 * NOVO → CONTATO → QUALIFICADO → PROPOSTA → NEGOCIACAO → GANHO | PERDIDO
 */
public enum LeadStatus {
    NOVO("Novo"),
    CONTATO("Em Contato"),
    QUALIFICADO("Qualificado"),
    PROPOSTA("Proposta Enviada"),
    NEGOCIACAO("Em Negociação"),
    GANHO("Ganho"),
    PERDIDO("Perdido");

    private final String label;

    LeadStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
