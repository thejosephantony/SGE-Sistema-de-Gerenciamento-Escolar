-- Cria um administrador inicial somente quando o e-mail ainda não existir.
-- A senha é armazenada exclusivamente como hash BCrypt.
INSERT INTO usuarios (nome, email, senha_hash, perfil, status)
VALUES (
    'Administrador',
    'admin@sge.local',
    '$2y$12$Wj6XKCtvRBAmg1/SBdqMZ.bMAeceNH0K2NSC1yBiKI.kW7JS8kCaW',
    'ADMINISTRADOR',
    'ATIVO'
)
ON CONFLICT (email) DO NOTHING;
