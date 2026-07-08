-- V1__create_clients.sql
-- Cria a tabela de clientes com todos os campos de auditoria

CREATE TABLE clients (
    id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(200) NOT NULL,
    phone       VARCHAR(30),
    company_name VARCHAR(200),
    document    VARCHAR(30),
    notes       TEXT,
    active      BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255),

    CONSTRAINT pk_clients PRIMARY KEY (id),
    CONSTRAINT uq_clients_email UNIQUE (email)
);

CREATE INDEX idx_clients_email       ON clients (email);
CREATE INDEX idx_clients_company     ON clients (company_name);
CREATE INDEX idx_clients_active      ON clients (active);
CREATE INDEX idx_clients_created_at  ON clients (created_at);

COMMENT ON TABLE  clients              IS 'Clientes ativos e inativos do CRM';
COMMENT ON COLUMN clients.active       IS 'FALSE = soft delete (não aparece nas listagens)';
COMMENT ON COLUMN clients.document     IS 'CPF (11 dígitos) ou CNPJ (14 dígitos)';
