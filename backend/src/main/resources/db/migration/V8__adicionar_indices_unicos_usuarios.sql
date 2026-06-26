CREATE UNIQUE INDEX IF NOT EXISTS uk_usuarios_matricula
ON usuarios (matricula)
WHERE matricula IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_usuarios_registro_docente
ON usuarios (registro_docente)
WHERE registro_docente IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_usuarios_matricula_administrativa
ON usuarios (matricula_administrativa)
WHERE matricula_administrativa IS NOT NULL;