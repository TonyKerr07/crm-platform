-- V3__create_tasks.sql
-- Cria a tabela de tarefas associadas a clientes

CREATE TABLE tasks (
    id          UUID         NOT NULL DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'ABERTA',
    due_date    DATE,
    assigned_to VARCHAR(150),
    client_id   UUID         NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(255),
    updated_by  VARCHAR(255),

    CONSTRAINT pk_tasks      PRIMARY KEY (id),
    CONSTRAINT fk_tasks_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT chk_tasks_status CHECK (
        status IN ('ABERTA','EM_ANDAMENTO','CONCLUIDA','CANCELADA')
    )
);

CREATE INDEX idx_tasks_client_id  ON tasks (client_id);
CREATE INDEX idx_tasks_status     ON tasks (status);
CREATE INDEX idx_tasks_due_date   ON tasks (due_date);

COMMENT ON TABLE  tasks             IS 'Tarefas e follow-ups associados a clientes';
COMMENT ON COLUMN tasks.due_date    IS 'Prazo de conclusão da tarefa';
COMMENT ON COLUMN tasks.assigned_to IS 'Nome da pessoa responsável pela tarefa';
