-- V4__seed_data.sql
-- Dados iniciais para testar o sistema (ambiente de desenvolvimento)
-- O Flyway só roda cada migration UMA VEZ — dados inseridos aqui nunca se duplicam.

-- Clientes de exemplo
INSERT INTO clients (id, name, email, phone, company_name, document, notes, active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Ana Costa',       'ana.costa@empresa.com',    '(11) 99001-1111', 'Tech Inovação Ltda',  '12.345.678/0001-99', 'Cliente VIP desde 2022', true, NOW() - INTERVAL '60 days', NOW()),
  (gen_random_uuid(), 'Bruno Mendes',    'bruno.mendes@startup.io',  '(21) 98002-2222', 'Startup Verde S/A',   '98.765.432/0001-11', NULL,                     true, NOW() - INTERVAL '45 days', NOW()),
  (gen_random_uuid(), 'Carla Dias',      'carla@freelancer.me',      '(31) 97003-3333', NULL,                  '345.678.901-23',     'Freelancer — PF',        true, NOW() - INTERVAL '30 days', NOW()),
  (gen_random_uuid(), 'Daniel Souza',    'daniel.souza@corp.com.br', '(41) 96004-4444', 'Corporação DS',       '11.222.333/0001-44', 'Contrato anual',         true, NOW() - INTERVAL '20 days', NOW()),
  (gen_random_uuid(), 'Eva Lima',        'eva.lima@agencia.com',     '(51) 95005-5555', 'Agência Criativa',    '55.666.777/0001-88', 'Indicação do Bruno',     true, NOW() - INTERVAL '10 days', NOW()),
  (gen_random_uuid(), 'Fernando Alves',  'fernando@oldclient.com',   '(61) 94006-6666', 'Old Biz ME',          '77.888.999/0001-00', 'Contrato encerrado',     false, NOW() - INTERVAL '90 days', NOW());

-- Leads de exemplo (um em cada status do funil)
INSERT INTO leads (id, name, email, phone, company_name, source, status, estimated_value, responsible, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Gabriel Rocha',   'gabriel@prospect.com', '(11) 93007-7777', 'Prospect A',     'LinkedIn',   'NOVO',        5000.00,  'Maria Vendas', NOW() - INTERVAL '5 days',  NOW()),
  (gen_random_uuid(), 'Helena Ferreira', 'helena@lead.com.br',   '(21) 92008-8888', 'Lead B',         'Site',       'CONTATO',     12000.00, 'João Vendas',  NOW() - INTERVAL '8 days',  NOW()),
  (gen_random_uuid(), 'Igor Barbosa',    'igor@qualif.io',       '(31) 91009-9999', 'Qualificado C',  'Indicação',  'QUALIFICADO', 25000.00, 'Maria Vendas', NOW() - INTERVAL '12 days', NOW()),
  (gen_random_uuid(), 'Juliana Castro',  'juliana@proposta.com', '(41) 90010-0000', 'Proposta D',     'Google Ads', 'PROPOSTA',    8000.00,  'Pedro Sales',  NOW() - INTERVAL '15 days', NOW()),
  (gen_random_uuid(), 'Klaus Mueller',   'klaus@negoc.de',       '(51) 89011-1111', 'Negociação E',   'LinkedIn',   'NEGOCIACAO',  50000.00, 'João Vendas',  NOW() - INTERVAL '20 days', NOW()),
  (gen_random_uuid(), 'Lara Nascimento', 'lara@ganho.com',       '(61) 88012-2222', 'Ganho F Ltda',   'Referral',   'GANHO',       30000.00, 'Maria Vendas', NOW() - INTERVAL '25 days', NOW()),
  (gen_random_uuid(), 'Marcos Oliveira', 'marcos@perdido.net',   '(71) 87013-3333', 'Perdido G',      'Cold Call',  'PERDIDO',     3000.00,  'Pedro Sales',  NOW() - INTERVAL '30 days', NOW()),
  (gen_random_uuid(), 'Nina Santos',     'nina@novo2.com',       '(81) 86014-4444', 'Novo H Inc',     'Site',       'NOVO',        7500.00,  'João Vendas',  NOW() - INTERVAL '2 days',  NOW()),
  (gen_random_uuid(), 'Otto Pereira',    'otto@negoc2.com',      '(91) 85015-5555', 'Negociação I',   'LinkedIn',   'NEGOCIACAO',  45000.00, 'Maria Vendas', NOW() - INTERVAL '18 days', NOW());

-- Tarefas vinculadas ao primeiro cliente ativo
-- (usamos subquery para pegar o ID sem hardcode)
INSERT INTO tasks (id, title, description, status, due_date, assigned_to, client_id, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Ligar para renovar contrato',
  'Cliente precisa de proposta atualizada para 2025.',
  'ABERTA',
  NOW()::DATE + INTERVAL '3 days',
  'Maria Vendas',
  c.id,
  NOW() - INTERVAL '2 days',
  NOW()
FROM clients c WHERE c.email = 'ana.costa@empresa.com' LIMIT 1;

INSERT INTO tasks (id, title, description, status, due_date, assigned_to, client_id, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Enviar relatório mensal',
  'Enviar relatório de uso da plataforma referente ao último mês.',
  'EM_ANDAMENTO',
  NOW()::DATE + INTERVAL '1 day',
  'João Ops',
  c.id,
  NOW() - INTERVAL '5 days',
  NOW()
FROM clients c WHERE c.email = 'bruno.mendes@startup.io' LIMIT 1;

INSERT INTO tasks (id, title, description, status, due_date, assigned_to, client_id, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Reunião de onboarding atrasada',
  'Reagendar reunião que não ocorreu na semana passada.',
  'ABERTA',
  NOW()::DATE - INTERVAL '2 days',  -- propositalmente atrasada para testar o alerta
  'Carlos CS',
  c.id,
  NOW() - INTERVAL '10 days',
  NOW()
FROM clients c WHERE c.email = 'carla@freelancer.me' LIMIT 1;

INSERT INTO tasks (id, title, description, status, due_date, assigned_to, client_id, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Follow-up pós-demo',
  'Verificar se cliente ficou satisfeito com a demonstração.',
  'CONCLUIDA',
  NOW()::DATE - INTERVAL '5 days',
  'Maria Vendas',
  c.id,
  NOW() - INTERVAL '7 days',
  NOW()
FROM clients c WHERE c.email = 'daniel.souza@corp.com.br' LIMIT 1;
