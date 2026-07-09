-- V2__create_leads.sql
-- Cria a tabela de leads com suporte ao funil de vendas

CREATE TABLE leads (
    id              UUID         NOT NULL DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(200),
    phone           VARCHAR(30),
    company_name    VARCHAR(200),
    source          VARCHAR(100),
    status          VARCHAR(20)  NOT NULL DEFAULT 'NOVO',
    estimated_value NUMERIC(15,2),
    notes           TEXT,
    responsible     VARCHAR(150),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(255),
    updated_by      VARCHAR(255),

    CONSTRAINT pk_leads PRIMARY KEY (id),
    CONSTRAINT chk_leads_status CHECK (
        status IN ('NOVO','CONTATO','QUALIFICADO','PROPOSTA','NEGOCIACAO','GANHO','PERDIDO')
    )
);

CREATE INDEX idx_leads_status     ON leads (status);
CREATE INDEX idx_leads_email      ON leads (email);
CREATE INDEX idx_leads_created_at ON leads (created_at);

COMMENT ON TABLE  leads                  IS 'Leads — potenciais clientes em negociação';
COMMENT ON COLUMN leads.source           IS 'Origem do lead: LinkedIn, Indicação, Site, etc.';
COMMENT ON COLUMN leads.estimated_value  IS 'Valor estimado do negócio em BRL';
COMMENT ON COLUMN leads.responsible      IS 'Nome do vendedor responsável pelo lead';
