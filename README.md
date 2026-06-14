# SGE — Sistema de Gerenciamento Escolar

O **SGE — Sistema de Gerenciamento Escolar** é uma aplicação web desenvolvida como projeto acadêmico de Engenharia de Software. O sistema tem como objetivo apoiar processos administrativos e acadêmicos de uma instituição de ensino, incluindo autenticação de usuários, controle de acesso por perfil, gerenciamento de usuários, disciplinas, turmas, matrículas, notas, frequência, AVA e relatórios.

O desenvolvimento está sendo conduzido de forma incremental, com integração gradual entre backend, frontend e banco de dados.

---

## 1. Status Atual do Projeto

### Concluído em versão inicial

- [x] Estrutura inicial do repositório
- [x] Backend Spring Boot
- [x] Frontend React + TypeScript
- [x] Banco PostgreSQL
- [x] Flyway para versionamento do banco
- [x] Migration inicial da tabela `usuarios`
- [x] CRUD inicial de usuários no backend
- [x] Criptografia de senha com BCrypt
- [x] Autenticação com JWT
- [x] Filtro JWT para proteger rotas
- [x] Endpoint de login
- [x] Endpoint de usuário autenticado
- [x] Rotas protegidas por token no backend
- [x] Código enviado para a branch `main`

### Próximo módulo recomendado

```text
Módulo 5.3 — Integração do Login no Frontend
```

---

## 2. Tecnologias Utilizadas

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Bean Validation
- Maven
- Lombok
- Flyway
- PostgreSQL Driver

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS Modules
- Fetch API ou Axios
- Framer Motion
- Tabler Icons

### Banco de Dados

- PostgreSQL
- Migrations com Flyway

### Ferramentas de Apoio

- Git
- GitHub
- PowerShell
- Postman, Insomnia ou PowerShell para testes HTTP
- VS Code, IntelliJ ou NetBeans

---

## 3. Estrutura do Repositório

```text
SGE-Sistema-de-Gerenciamento-Escolar/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── database/
│
├── docs/
│
└── README.md
```

---

## 4. Arquitetura Geral

A solução segue uma arquitetura em camadas:

```text
Frontend Web
    ↓
Backend API REST
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Banco de Dados PostgreSQL
```

### Responsabilidades

| Camada | Responsabilidade |
|---|---|
| Frontend | Telas, rotas, formulários, navegação e consumo da API |
| Controller | Receber requisições HTTP e devolver respostas |
| Service | Aplicar regras de negócio |
| Repository | Acessar o banco de dados |
| Model/Entity | Representar entidades persistentes |
| DTO | Transportar dados entre API e cliente |
| Security | Autenticação, JWT, autorização e proteção de rotas |
| Banco | Persistência, integridade e relacionamentos |

---

## 5. Perfis do Sistema

O sistema trabalha com três perfis principais:

| Perfil | Função |
|---|---|
| `ADMINISTRADOR` | Gerencia usuários, disciplinas, turmas, matrículas e relatórios |
| `DOCENTE` | Consulta turmas, registra notas, frequência, materiais e atividades |
| `DISCENTE` | Consulta notas, frequência, materiais, atividades e desempenho acadêmico |

---

## 6. Como Executar o Projeto

### 6.1 Pré-requisitos

Antes de executar o projeto, instale:

- Java 21 ou superior
- Maven ou Maven Wrapper
- Node.js
- PostgreSQL
- Git

### 6.2 Configuração do Banco de Dados

Crie um banco PostgreSQL chamado:

```text
sge
```

Exemplo no PostgreSQL:

```sql
CREATE DATABASE sge;
```

### 6.3 Variáveis de Ambiente

O backend usa variáveis de ambiente para não expor dados sensíveis no repositório.

No PowerShell:

```powershell
$env:DB_PASSWORD="sua_senha_do_postgres"
$env:JWT_SECRET="uma-chave-local-secreta-com-mais-de-32-caracteres"
```

O arquivo `application.properties` deve usar as variáveis:

```properties
spring.application.name=sge

server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/sge
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

spring.flyway.enabled=true

sge.jwt.secret=${JWT_SECRET:chave-de-desenvolvimento-do-sge-com-mais-de-32-caracteres}
sge.jwt.expiration-ms=86400000
```

### 6.4 Executar o Backend

Na raiz do projeto:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

O backend será executado em:

```text
http://localhost:8080
```

Observação: algumas rotas exigem token JWT. Portanto, acessar diretamente pelo navegador pode retornar acesso negado.

### 6.5 Executar o Frontend

Em outro terminal:

```powershell
cd frontend
npm install
npm.cmd run dev
```

O frontend será executado em:

```text
http://localhost:5173
```

---

# 7. Módulos do Projeto

O desenvolvimento está dividido em módulos. Cada módulo deve seguir o fluxo:

```text
Backend → Teste da API → Frontend → Integração → Teste final do módulo
```

---

## 7.1 Módulo 1 — Estrutura Inicial do Projeto

### Objetivo

Preparar a base do projeto para desenvolvimento em equipe.

### Backend

- [x] Criar projeto Spring Boot
- [x] Configurar Maven
- [x] Configurar estrutura inicial de pacotes

### Frontend

- [x] Criar projeto React com TypeScript
- [x] Configurar Vite
- [x] Criar estrutura inicial de páginas e componentes

### Repositório

- [x] Criar repositório no GitHub
- [x] Criar pastas `backend`, `frontend`, `database` e `docs`
- [x] Criar README inicial
- [x] Configurar `.gitignore`

### Integração

Ainda não havia integração funcional nesta etapa.

### Status

```text
Concluído
```

---

## 7.2 Módulo 2 — Banco de Dados e Persistência

### Objetivo

Configurar PostgreSQL e versionamento do banco com Flyway.

### Backend

- [x] Adicionar PostgreSQL Driver
- [x] Adicionar Flyway
- [x] Configurar conexão com o banco
- [x] Configurar `ddl-auto=validate`

### Banco de Dados

- [x] Criar banco `sge`
- [x] Criar pasta `db/migration`
- [x] Criar `V1__criar_tabela_usuarios.sql`
- [x] Criar tabela `usuarios`

### Teste

- [x] Rodar backend
- [x] Validar conexão com PostgreSQL
- [x] Validar execução do Flyway

### Status

```text
Concluído
```

---

## 7.3 Módulo 3 — Frontend Inicial e Telas Base

### Objetivo

Criar a base visual do sistema.

### Frontend

- [x] Criar Landing Page
- [x] Criar tela inicial de login
- [x] Criar layout do Administrador
- [x] Criar layout do Professor
- [x] Criar layout do Aluno
- [x] Criar rotas iniciais
- [x] Criar menus por perfil

### Integração

As telas ainda são protótipos navegáveis. A integração real começa no módulo 5.3.

### Status

```text
Concluído em versão inicial
```

---

## 7.4 Módulo 4 — Segurança Inicial

### Objetivo

Preparar o backend para autenticação e proteção de rotas.

### Backend

- [x] Adicionar Spring Security
- [x] Criar `SecurityConfig`
- [x] Criar `PasswordEncoder`
- [x] Usar BCrypt para senhas
- [x] Ajustar segurança para JWT

### Integração

A integração com a tela de login será feita no módulo 5.3.

### Status

```text
Concluído em versão inicial
```

---

# 8. Módulo 5 — Usuários e Autenticação

O módulo 5 é dividido em quatro partes:

```text
5.1 — Backend de Usuários
5.2 — Backend de Autenticação/Login com JWT
5.3 — Integração do Login no Frontend
5.4 — Integração da Tela de Usuários
```

---

## 8.1 Módulo 5.1 — Backend de Usuários

### Objetivo

Implementar o CRUD inicial de usuários.

### Backend

- [x] Criar `Usuario.java`
- [x] Criar `PerfilUsuario.java`
- [x] Criar `StatusUsuario.java`
- [x] Criar `UsuarioRepository.java`
- [x] Criar `UsuarioRequest.java`
- [x] Criar `UsuarioResponse.java`
- [x] Criar `UsuarioService.java`
- [x] Criar `UsuarioController.java`
- [x] Criptografar senha com BCrypt
- [x] Omitir senha nas respostas da API
- [x] Cadastrar usuário
- [x] Listar usuários
- [x] Buscar usuário por ID
- [x] Atualizar usuário
- [x] Desativar usuário
- [x] Reativar usuário

### Endpoints implementados

```text
POST   /api/usuarios
GET    /api/usuarios
GET    /api/usuarios/{id}
PUT    /api/usuarios/{id}
PATCH  /api/usuarios/{id}/desativar
PATCH  /api/usuarios/{id}/ativar
```

### Testes da API

- [x] Testar cadastro de usuário
- [x] Testar listagem de usuários
- [x] Testar retorno sem senha
- [x] Testar senha criptografada
- [x] Testar status `ATIVO`

### Frontend

Ainda não integrado. A integração será feita no módulo 5.4.

### Status

```text
Concluído em versão inicial
```

### Melhorias futuras

- [ ] Criar tratamento global de exceções
- [ ] Retornar `409 Conflict` para e-mail duplicado
- [ ] Retornar `404 Not Found` para usuário inexistente
- [ ] Criar testes automatizados
- [ ] Restringir gerenciamento de usuários ao perfil `ADMINISTRADOR`

---

## 8.2 Módulo 5.2 — Backend de Autenticação/Login com JWT

### Objetivo

Implementar login real no backend usando e-mail, senha criptografada e token JWT.

### Backend

- [x] Adicionar dependências JJWT no `pom.xml`
- [x] Criar `LoginRequest.java`
- [x] Criar `LoginResponse.java`
- [x] Criar `AuthService.java`
- [x] Criar `AuthController.java`
- [x] Criar `JwtService.java`
- [x] Criar `JwtAuthenticationFilter.java`
- [x] Ajustar `SecurityConfig.java`
- [x] Validar senha com BCrypt
- [x] Gerar token JWT
- [x] Validar token JWT
- [x] Proteger rotas com token

### Endpoints implementados

```text
POST /api/auth/login
GET  /api/auth/me
```

### Testes da API

- [x] Login com e-mail e senha corretos
- [x] Retorno de `token`
- [x] Retorno de `tipo = Bearer`
- [x] Retorno de dados do usuário autenticado
- [x] Acesso a `/api/auth/me` com token
- [x] Bloqueio de rota protegida sem token
- [x] Acesso a rota protegida com token

### Frontend

Ainda não integrado. A integração será feita no módulo 5.3.

### Status

```text
Concluído em versão inicial
```

### Melhorias futuras

- [ ] Padronizar erro de login inválido
- [ ] Retornar `401 Unauthorized` de forma padronizada
- [ ] Retornar `403 Forbidden` quando o perfil não tiver permissão
- [ ] Criar controle de acesso por perfil em endpoints específicos

---

## 8.3 Módulo 5.3 — Integração do Login no Frontend

### Objetivo

Fazer a tela de login do React consumir o endpoint real de autenticação do backend.

### Dependências

- [x] Módulo 5.1 — Usuários
- [x] Módulo 5.2 — Autenticação/Login com JWT

### Backend usado

```text
POST /api/auth/login
GET  /api/auth/me
```

### Frontend

Criar ou ajustar:

```text
frontend/src/services/api.ts
frontend/src/services/authService.ts
frontend/src/contexts/AuthContext.tsx
frontend/src/pages/auth/LoginPage.tsx
```

### Tarefas

- [ ] Criar serviço base da API
- [ ] Criar serviço de autenticação
- [ ] Fazer login enviar e-mail e senha para o backend
- [ ] Receber token JWT
- [ ] Salvar token
- [ ] Salvar dados do usuário autenticado
- [ ] Redirecionar conforme perfil
- [ ] Criar logout funcional
- [ ] Persistir login ao atualizar a página
- [ ] Usar `/api/auth/me` para validar sessão
- [ ] Proteger rotas no frontend

### Redirecionamento por perfil

```text
ADMINISTRADOR → /admin
DOCENTE       → /professor
DISCENTE      → /aluno
```

### Integração

- [ ] Frontend envia `POST /api/auth/login`
- [ ] Backend retorna token e usuário
- [ ] Frontend salva token
- [ ] Frontend envia token em requisições futuras
- [ ] Frontend identifica perfil
- [ ] Frontend redireciona para layout correto

### Testes

- [ ] Login como Administrador
- [ ] Login com senha errada
- [ ] Redirecionamento para `/admin`
- [ ] Persistência após atualizar página
- [ ] Logout
- [ ] Acesso sem token
- [ ] Acesso com token inválido ou expirado

### Status

```text
Próximo módulo recomendado
```

---

## 8.4 Módulo 5.4 — Integração da Tela de Usuários

### Objetivo

Conectar a tela de usuários do frontend com o CRUD de usuários do backend.

### Dependências

- [x] Módulo 5.1 — Backend de Usuários
- [x] Módulo 5.2 — Autenticação com JWT
- [ ] Módulo 5.3 — Login integrado no frontend

### Backend usado

```text
GET    /api/usuarios
GET    /api/usuarios/{id}
POST   /api/usuarios
PUT    /api/usuarios/{id}
PATCH  /api/usuarios/{id}/desativar
PATCH  /api/usuarios/{id}/ativar
```

### Frontend

Criar ou ajustar:

```text
frontend/src/services/usuarioService.ts
frontend/src/pages/admin/usuarios/ListaUsuarios.tsx
frontend/src/pages/admin/usuarios/FormularioUsuario.tsx
```

### Funcionalidades

- [ ] Listar usuários
- [ ] Cadastrar usuário
- [ ] Editar usuário
- [ ] Desativar usuário
- [ ] Reativar usuário
- [ ] Exibir mensagens de erro
- [ ] Exibir mensagens de sucesso
- [ ] Atualizar tabela após ações

### Campos do formulário

- [ ] Nome
- [ ] E-mail
- [ ] Senha
- [ ] Perfil

### Integração

- [ ] Usar token JWT no header `Authorization`
- [ ] Consumir `GET /api/usuarios`
- [ ] Consumir `POST /api/usuarios`
- [ ] Consumir `PUT /api/usuarios/{id}`
- [ ] Consumir `PATCH /api/usuarios/{id}/desativar`
- [ ] Consumir `PATCH /api/usuarios/{id}/ativar`

### Regras de acesso

Inicialmente:

- [ ] Usuário autenticado acessa

Depois:

- [ ] Apenas `ADMINISTRADOR` gerencia usuários

### Testes

- [ ] Login como administrador
- [ ] Acessar tela de usuários
- [ ] Listar usuários
- [ ] Cadastrar usuário
- [ ] Editar usuário
- [ ] Desativar usuário
- [ ] Reativar usuário
- [ ] Testar erro de e-mail duplicado

### Status

```text
Ainda não iniciado
```

---

# 9. Módulo 6 — Gestão Acadêmica Base

O módulo 6 contém as funcionalidades acadêmicas principais.

---

## 9.1 Módulo 6.1 — Disciplinas

### Objetivo

Permitir cadastro, consulta e manutenção de disciplinas.

### Backend

Criar:

```text
Disciplina.java
DisciplinaRepository.java
DisciplinaRequest.java
DisciplinaResponse.java
DisciplinaService.java
DisciplinaController.java
```

Campos previstos:

```text
id
nome
codigo
cargaHoraria
ementa
status
```

### Banco

Criar migration:

```text
V2__criar_tabela_disciplinas.sql
```

### Endpoints previstos

```text
POST   /api/disciplinas
GET    /api/disciplinas
GET    /api/disciplinas/{id}
PUT    /api/disciplinas/{id}
PATCH  /api/disciplinas/{id}/desativar
PATCH  /api/disciplinas/{id}/ativar
```

### Testes da API

- [ ] Cadastrar disciplina
- [ ] Listar disciplinas
- [ ] Buscar disciplina por ID
- [ ] Atualizar disciplina
- [ ] Desativar disciplina
- [ ] Reativar disciplina
- [ ] Testar código duplicado

### Frontend

Criar:

```text
frontend/src/services/disciplinaService.ts
frontend/src/pages/admin/disciplinas/ListaDisciplinas.tsx
frontend/src/pages/admin/disciplinas/FormularioDisciplina.tsx
```

### Integração

- [ ] Login como administrador
- [ ] Acessar menu Disciplinas
- [ ] Listar disciplinas vindas do backend
- [ ] Cadastrar disciplina pelo frontend
- [ ] Editar disciplina pelo frontend
- [ ] Desativar e reativar disciplina pelo frontend
- [ ] Exibir mensagens de sucesso e erro

### Regras de acesso

- [ ] Administrador gerencia disciplinas
- [ ] Docente pode consultar disciplinas relacionadas
- [ ] Discente pode consultar disciplinas relacionadas às suas turmas

### Status

```text
Ainda não iniciado
```

---

## 9.2 Módulo 6.2 — Turmas

### Objetivo

Gerenciar turmas vinculadas a disciplinas e docentes.

### Backend

Criar:

```text
Turma.java
TurmaRepository.java
TurmaRequest.java
TurmaResponse.java
TurmaService.java
TurmaController.java
```

Campos previstos:

```text
id
disciplina
docente
ano
semestre
codigo
status
```

### Banco

Criar migration:

```text
V3__criar_tabela_turmas.sql
```

Relacionamentos:

```text
turmas.disciplina_id → disciplinas.id
turmas.docente_id    → usuarios.id
```

### Endpoints previstos

```text
POST   /api/turmas
GET    /api/turmas
GET    /api/turmas/{id}
GET    /api/turmas/docente/{docenteId}
GET    /api/turmas/disciplina/{disciplinaId}
PUT    /api/turmas/{id}
PATCH  /api/turmas/{id}/desativar
PATCH  /api/turmas/{id}/ativar
```

### Testes da API

- [ ] Criar turma com disciplina
- [ ] Criar turma com docente
- [ ] Listar turmas
- [ ] Buscar turmas por docente
- [ ] Buscar turmas por disciplina
- [ ] Atualizar turma
- [ ] Desativar turma

### Frontend

Criar:

```text
frontend/src/services/turmaService.ts
frontend/src/pages/admin/turmas/ListaTurmas.tsx
frontend/src/pages/admin/turmas/FormularioTurma.tsx
```

### Integração

- [ ] Carregar disciplinas no formulário
- [ ] Carregar docentes no formulário
- [ ] Selecionar disciplina
- [ ] Selecionar docente
- [ ] Cadastrar turma pelo frontend
- [ ] Exibir turma na tabela
- [ ] Permitir docente visualizar suas turmas

### Regras de acesso

- [ ] Administrador gerencia turmas
- [ ] Docente visualiza suas turmas
- [ ] Discente visualiza turmas em que está matriculado

### Status

```text
Ainda não iniciado
```

---

## 9.3 Módulo 6.3 — Matrículas

### Objetivo

Permitir a matrícula de discentes em turmas.

### Backend

Criar:

```text
Matricula.java
MatriculaRepository.java
MatriculaRequest.java
MatriculaResponse.java
MatriculaService.java
MatriculaController.java
```

Campos previstos:

```text
id
discente
turma
dataMatricula
status
```

### Banco

Criar migration:

```text
V4__criar_tabela_matriculas.sql
```

Relacionamentos:

```text
matriculas.discente_id → usuarios.id
matriculas.turma_id    → turmas.id
```

### Endpoints previstos

```text
POST   /api/matriculas
GET    /api/matriculas
GET    /api/matriculas/{id}
GET    /api/matriculas/turma/{turmaId}
GET    /api/matriculas/discente/{discenteId}
PATCH  /api/matriculas/{id}/cancelar
```

### Testes da API

- [ ] Matricular discente em turma
- [ ] Impedir matrícula duplicada
- [ ] Listar discentes de uma turma
- [ ] Listar turmas de um discente
- [ ] Cancelar matrícula

### Frontend

Criar:

```text
frontend/src/services/matriculaService.ts
frontend/src/pages/admin/matriculas/ListaMatriculas.tsx
frontend/src/pages/admin/matriculas/FormularioMatricula.tsx
```

### Integração

- [ ] Carregar discentes
- [ ] Carregar turmas
- [ ] Matricular discente pelo frontend
- [ ] Atualizar lista de matrículas
- [ ] Visualizar discentes de uma turma
- [ ] Visualizar turmas de um discente

### Regras de acesso

- [ ] Administrador gerencia matrículas
- [ ] Docente visualiza discentes de suas turmas
- [ ] Discente visualiza suas próprias matrículas

### Status

```text
Ainda não iniciado
```

---

# 10. Módulo 7 — Notas e Frequência

Este módulo depende de usuários, disciplinas, turmas e matrículas.

---

## 10.1 Módulo 7.1 — Notas

### Objetivo

Permitir que docentes lancem notas e discentes consultem seu desempenho.

### Backend

Criar:

```text
Avaliacao.java
Nota.java
AvaliacaoRepository.java
NotaRepository.java
AvaliacaoRequest.java
AvaliacaoResponse.java
NotaRequest.java
NotaResponse.java
AvaliacaoController.java
NotaController.java
```

### Banco

Criar migrations:

```text
V5__criar_tabela_avaliacoes.sql
V6__criar_tabela_notas.sql
```

### Endpoints previstos

```text
POST /api/avaliacoes
GET  /api/avaliacoes/turma/{turmaId}
POST /api/notas
PUT  /api/notas/{id}
GET  /api/notas/matricula/{matriculaId}
GET  /api/notas/turma/{turmaId}
GET  /api/notas/minhas
```

### Frontend

Criar services e telas para:

- Avaliações
- Lançamento de notas pelo docente
- Consulta de notas pelo discente

### Integração

- [ ] Docente acessa suas turmas
- [ ] Docente cria avaliação
- [ ] Sistema lista alunos matriculados
- [ ] Docente lança notas
- [ ] Discente visualiza suas notas

### Regras de acesso

- [ ] Docente lança notas apenas em suas turmas
- [ ] Discente consulta apenas suas próprias notas
- [ ] Administrador consulta dados acadêmicos autorizados

### Status

```text
Ainda não iniciado
```

---

## 10.2 Módulo 7.2 — Frequência

### Objetivo

Permitir registro e consulta de frequência.

### Backend

Criar:

```text
Frequencia.java
FrequenciaRepository.java
FrequenciaRequest.java
FrequenciaResponse.java
FrequenciaService.java
FrequenciaController.java
```

### Banco

Criar migration:

```text
V7__criar_tabela_frequencias.sql
```

### Endpoints previstos

```text
POST /api/frequencias
PUT  /api/frequencias/{id}
GET  /api/frequencias/matricula/{matriculaId}
GET  /api/frequencias/turma/{turmaId}
GET  /api/frequencias/minhas
```

### Frontend

Criar tela para:

- Professor registrar presença/falta
- Aluno consultar frequência

### Integração

- [ ] Professor seleciona turma
- [ ] Sistema lista discentes matriculados
- [ ] Professor registra presença/falta
- [ ] Discente consulta frequência

### Regras de acesso

- [ ] Docente registra frequência apenas de suas turmas
- [ ] Discente consulta apenas sua frequência
- [ ] Administrador consulta relatórios

### Status

```text
Ainda não iniciado
```

---

# 11. Módulo 8 — AVA: Materiais, Atividades e Entregas

---

## 11.1 Módulo 8.1 — Materiais Didáticos

### Backend

Criar:

```text
MaterialDidatico.java
MaterialDidaticoRepository.java
MaterialDidaticoRequest.java
MaterialDidaticoResponse.java
MaterialDidaticoService.java
MaterialDidaticoController.java
```

### Banco

Criar migration:

```text
V8__criar_tabela_materiais_didaticos.sql
```

### Endpoints previstos

```text
POST   /api/materiais
GET    /api/materiais/turma/{turmaId}
PUT    /api/materiais/{id}
DELETE /api/materiais/{id}
```

### Frontend

- Tela do professor para cadastrar materiais
- Tela do aluno para consultar materiais

### Integração

- [ ] Professor cadastra material em uma turma
- [ ] Backend vincula material à turma
- [ ] Aluno visualiza materiais das turmas em que está matriculado

### Status

```text
Ainda não iniciado
```

---

## 11.2 Módulo 8.2 — Atividades

### Backend

Criar:

```text
Atividade.java
AtividadeRepository.java
AtividadeRequest.java
AtividadeResponse.java
AtividadeService.java
AtividadeController.java
```

### Banco

Criar migration:

```text
V9__criar_tabela_atividades.sql
```

### Endpoints previstos

```text
POST   /api/atividades
GET    /api/atividades/turma/{turmaId}
GET    /api/atividades/minhas
PUT    /api/atividades/{id}
PATCH  /api/atividades/{id}/encerrar
DELETE /api/atividades/{id}
```

### Frontend

- Tela do professor para criar atividades
- Tela do aluno para visualizar atividades

### Integração

- [ ] Professor cria atividade
- [ ] Backend vincula atividade à turma
- [ ] Aluno visualiza atividades disponíveis
- [ ] Sistema mostra prazo da atividade

### Status

```text
Ainda não iniciado
```

---

## 11.3 Módulo 8.3 — Entregas de Atividades

### Backend

Criar:

```text
EntregaAtividade.java
EntregaAtividadeRepository.java
EntregaAtividadeRequest.java
EntregaAtividadeResponse.java
EntregaAtividadeService.java
EntregaAtividadeController.java
```

### Banco

Criar migration:

```text
V10__criar_tabela_entregas_atividades.sql
```

### Endpoints previstos

```text
POST /api/entregas
GET  /api/entregas/atividade/{atividadeId}
GET  /api/entregas/minhas
GET  /api/entregas/{id}
```

### Frontend

- Tela do aluno para enviar atividade
- Tela do professor para visualizar entregas

### Integração

- [ ] Aluno envia entrega
- [ ] Backend registra data e hora
- [ ] Professor visualiza entregas recebidas

### Status

```text
Ainda não iniciado
```

---

# 12. Módulo 9 — Relatórios Acadêmicos

### Objetivo

Gerar relatórios acadêmicos com base nos dados do sistema.

### Dependências

- Usuários
- Disciplinas
- Turmas
- Matrículas
- Notas
- Frequência

### Backend

Criar:

```text
RelatorioService.java
RelatorioController.java
DTOs de relatório
```

### Endpoints previstos

```text
GET /api/relatorios/boletim/{discenteId}
GET /api/relatorios/turma/{turmaId}
GET /api/relatorios/diario-classe/{turmaId}
GET /api/relatorios/frequencia/{turmaId}
```

### Frontend

- Tela de boletim do aluno
- Tela de relatório de turma
- Tela de diário de classe
- Tela administrativa de relatórios

### Integração

- [ ] Administrador consulta relatórios gerais
- [ ] Docente consulta relatórios de suas turmas
- [ ] Discente consulta seu boletim
- [ ] Frontend exibe dados formatados

### Status

```text
Ainda não iniciado
```

---

# 13. Módulo 10 — Revisão Geral da Integração

Este módulo não significa que a integração começa apenas no final. A integração acontece em cada módulo.

O módulo 10 serve para revisar, padronizar e corrigir todas as integrações já feitas.

### Revisão técnica

- [ ] Revisar `api.ts`
- [ ] Revisar services do frontend
- [ ] Revisar envio do token JWT
- [ ] Revisar rotas protegidas
- [ ] Revisar permissões por perfil
- [ ] Revisar mensagens de erro
- [ ] Revisar mensagens de sucesso
- [ ] Revisar carregamentos

### Revisão por módulo

- [ ] Login integrado
- [ ] Usuários integrados
- [ ] Disciplinas integradas
- [ ] Turmas integradas
- [ ] Matrículas integradas
- [ ] Notas integradas
- [ ] Frequência integrada
- [ ] Materiais integrados
- [ ] Atividades integradas
- [ ] Entregas integradas
- [ ] Relatórios integrados

### Status

```text
Ainda não iniciado
```

---

# 14. Módulo 11 — Testes, Documentação e Entrega

### Testes funcionais

- [ ] Testar login como administrador
- [ ] Testar login como docente
- [ ] Testar login como discente
- [ ] Testar usuários
- [ ] Testar disciplinas
- [ ] Testar turmas
- [ ] Testar matrículas
- [ ] Testar notas
- [ ] Testar frequência
- [ ] Testar materiais
- [ ] Testar atividades
- [ ] Testar entregas
- [ ] Testar relatórios

### Testes de segurança

- [ ] Testar rota protegida sem token
- [ ] Testar rota protegida com token inválido
- [ ] Testar acesso de discente a rota de administrador
- [ ] Testar acesso de docente a recurso de outro docente
- [ ] Testar logout

### Documentação

- [ ] Atualizar README
- [ ] Documentar execução do backend
- [ ] Documentar execução do frontend
- [ ] Documentar banco
- [ ] Documentar endpoints principais
- [ ] Documentar usuários de teste
- [ ] Registrar prints
- [ ] Preparar roteiro de apresentação

### Status

```text
Ainda não iniciado
```

---

# 15. Resumo Geral dos Módulos

| Módulo | Nome | Backend | Frontend | Integração | Status |
|---|---|---|---|---|---|
| 1 | Estrutura inicial | Concluído | Concluído | Não aplicável | Concluído |
| 2 | Banco e persistência | Concluído | Não aplicável | Backend + banco | Concluído |
| 3 | Frontend base | Não aplicável | Concluído | Ainda não integrado | Concluído inicial |
| 4 | Segurança inicial | Concluído | Não aplicável | Parcial | Concluído inicial |
| 5.1 | Usuários backend | Concluído | Não iniciado | Não integrado ao frontend | Concluído inicial |
| 5.2 | Login/JWT backend | Concluído | Não iniciado | Não integrado ao frontend | Concluído inicial |
| 5.3 | Login frontend | Backend pronto | Não iniciado | Não iniciado | Próximo módulo |
| 5.4 | Usuários frontend | Backend pronto | Não iniciado | Não iniciado | Ainda não iniciado |
| 6.1 | Disciplinas | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 6.2 | Turmas | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 6.3 | Matrículas | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 7.1 | Notas | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 7.2 | Frequência | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 8.1 | Materiais | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 8.2 | Atividades | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 8.3 | Entregas | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 9 | Relatórios | Não iniciado | Não iniciado | Não iniciado | Ainda não iniciado |
| 10 | Revisão geral da integração | Parcial | Parcial | Não iniciado | Ainda não iniciado |
| 11 | Testes e entrega | Parcial | Parcial | Parcial | Ainda não iniciado |

---

# 16. Ordem Recomendada a Partir de Agora

```text
1. Integrar login no frontend
2. Integrar tela de usuários
3. Melhorar tratamento de erros
4. Implementar disciplinas com backend + frontend + integração
5. Implementar turmas com backend + frontend + integração
6. Implementar matrículas com backend + frontend + integração
7. Implementar notas com backend + frontend + integração
8. Implementar frequência com backend + frontend + integração
9. Implementar materiais com backend + frontend + integração
10. Implementar atividades com backend + frontend + integração
11. Implementar entregas com backend + frontend + integração
12. Implementar relatórios
13. Revisar integração geral
14. Testar, documentar e preparar apresentação
```

---

# 17. Comandos Git para Atualizar o README

Após substituir o conteúdo do `README.md`, execute:

```powershell
git status
git add README.md
git commit -m "docs: atualiza plano detalhado do projeto"
git push origin main
```

---

# 18. Observações Importantes

- Não coloque senha real do banco no repositório.
- Use variáveis de ambiente para dados sensíveis.
- A integração deve acontecer módulo por módulo.
- A branch `main` deve conter apenas versões testadas.
- O frontend deve consumir a API com token JWT nas rotas protegidas.
- O projeto deve continuar alinhado à documentação de requisitos, análise, design, arquitetura e plano de projeto.
