# SGE — Sistema de Gerenciamento Escolar

Projeto de Engenharia de Software desenvolvido para gerenciamento acadêmico de uma instituição de ensino. O SGE é uma aplicação web composta por backend REST, frontend web e banco de dados relacional, com foco em autenticação, controle de acesso por perfil, gestão de usuários, disciplinas, turmas, matrículas, plano de ensino, AVA, boletins, relatórios e funcionalidades acadêmicas.

---

## Sumário

- [1. Visão Geral](#1-visão-geral)
- [2. Objetivos do Projeto](#2-objetivos-do-projeto)
- [3. Perfis de Usuário](#3-perfis-de-usuário)
- [4. Tecnologias Utilizadas](#4-tecnologias-utilizadas)
- [5. Arquitetura do Sistema](#5-arquitetura-do-sistema)
- [6. Estrutura do Repositório](#6-estrutura-do-repositório)
- [7. Funcionalidades Implementadas](#7-funcionalidades-implementadas)
- [8. Requisitos Atendidos](#8-requisitos-atendidos)
- [9. Banco de Dados e Migrations](#9-banco-de-dados-e-migrations)
- [10. Segurança e Autorização](#10-segurança-e-autorização)
- [11. Como Executar o Projeto](#11-como-executar-o-projeto)
- [12. Variáveis de Ambiente](#12-variáveis-de-ambiente)
- [13. Comandos Úteis](#13-comandos-úteis)
- [14. Rotas Principais da Aplicação](#14-rotas-principais-da-aplicação)
- [15. API REST — Visão Geral](#15-api-rest--visão-geral)
- [16. Testes Manuais Recomendados](#16-testes-manuais-recomendados)
- [17. Organização por Módulos](#17-organização-por-módulos)
- [18. Melhorias Futuras](#18-melhorias-futuras)
- [19. Equipe](#19-equipe)

---

## 1. Visão Geral

O **Sistema de Gerenciamento Escolar (SGE)** é uma aplicação web acadêmica criada para centralizar processos administrativos e pedagógicos de uma instituição de ensino.

O sistema permite que diferentes perfis de usuários acessem funcionalidades específicas:

- administradores gerenciam a estrutura acadêmica;
- docentes acompanham suas turmas e registram informações acadêmicas;
- discentes consultam suas informações, atividades, materiais e boletins.

O projeto foi desenvolvido de forma incremental, com separação entre backend, frontend, banco de dados e documentação.

---

## 2. Objetivos do Projeto

### 2.1 Objetivo Geral

Desenvolver um sistema web capaz de gerenciar processos acadêmicos e administrativos de uma instituição de ensino, permitindo que administradores, docentes e discentes realizem suas atividades de forma integrada, segura e organizada.

### 2.2 Objetivos Específicos

O SGE tem como objetivos específicos:

- permitir login de usuários autenticados;
- controlar acesso conforme o perfil do usuário;
- cadastrar, consultar, editar e desativar usuários;
- cadastrar e consultar disciplinas;
- cadastrar, consultar e editar turmas;
- vincular docentes a turmas;
- matricular discentes em turmas;
- permitir que docentes registrem notas e frequência;
- permitir que docentes cadastrem plano de ensino;
- permitir que docentes disponibilizem materiais e atividades;
- permitir que discentes consultem boletim, frequência, turmas e materiais;
- permitir que discentes enviem atividades;
- permitir geração de relatórios acadêmicos;
- manter separação entre responsabilidades administrativas, docentes e discentes.

---

## 3. Perfis de Usuário

O sistema trabalha com três perfis principais.

| Perfil | Responsabilidades |
|---|---|
| **Administrador** | Gerenciar usuários, disciplinas, turmas, matrículas, relatórios e estrutura acadêmica. |
| **Docente** | Visualizar turmas vinculadas, registrar dados acadêmicos, gerenciar plano de ensino, AVA, notas e frequência. |
| **Discente** | Consultar suas turmas, boletim, plano de ensino, materiais, atividades e informações acadêmicas. |

---

## 4. Tecnologias Utilizadas

### 4.1 Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Bean Validation
- PostgreSQL Driver
- Flyway
- Lombok
- Maven
- BCrypt para hash de senhas

### 4.2 Frontend

- React
- TypeScript
- Vite
- React Router
- Fetch API
- LocalStorage para armazenamento do token JWT
- CSS modularizado por páginas/componentes
- Ícones com Tabler Icons

### 4.3 Banco de Dados

- PostgreSQL
- Flyway para versionamento de schema

### 4.4 Infraestrutura Local

- Docker Compose para subir o PostgreSQL
- Backend executado via Maven Wrapper
- Frontend executado via Vite

---

## 5. Arquitetura do Sistema

A arquitetura do sistema segue uma estrutura em camadas.

```text
Frontend React + TypeScript
        ↓
API REST Spring Boot
        ↓
Controllers
        ↓
Services
        ↓
Repositories
        ↓
PostgreSQL
```

### 5.1 Backend

O backend concentra:

- regras de negócio;
- autenticação;
- autorização;
- validações;
- endpoints REST;
- integração com banco de dados;
- migrations do Flyway;
- tratamento de exceções;
- segurança com JWT.

Fluxo básico:

```text
Controller → Service → Repository → Banco de Dados
```

### 5.2 Frontend

O frontend concentra:

- telas do sistema;
- rotas protegidas;
- menus por perfil;
- formulários;
- consumo da API;
- armazenamento do token;
- redirecionamento conforme perfil;
- feedback visual para o usuário.

Fluxo básico:

```text
Página/Componente → Service Frontend → API REST → Backend
```

---

## 6. Estrutura do Repositório

```text
SGE-Sistema-de-Gerenciamento-Escolar/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/br/ufs/sge/
│   │   │   │   ├── auth/
│   │   │   │   ├── usuario/
│   │   │   │   ├── disciplina/
│   │   │   │   ├── turma/
│   │   │   │   ├── matricula/
│   │   │   │   ├── ava/
│   │   │   │   ├── professor/
│   │   │   │   ├── aluno/
│   │   │   │   ├── perfil/
│   │   │   │   ├── relatorio/
│   │   │   │   ├── security/
│   │   │   │   └── config/
│   │   │   └── resources/
│   │   │       ├── db/migration/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── database/
├── docs/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 7. Funcionalidades Implementadas

### 7.1 Autenticação e Sessão

- Login com e-mail e senha.
- Geração de token JWT.
- Armazenamento do token no frontend.
- Recuperação de sessão por `/auth/me`.
- Logout no frontend.
- Recuperação de senha com token.
- Redefinição de senha.

### 7.2 Controle de Acesso

- Rotas protegidas no frontend.
- Separação de rotas por perfil:
  - administrador;
  - docente;
  - discente.
- Backend protegido com autenticação JWT.
- Endpoints públicos restritos a login e recuperação de senha.
- Demais endpoints exigem autenticação.

### 7.3 Usuários

Funcionalidades administrativas relacionadas a usuários:

- cadastro de usuários;
- consulta de usuários;
- edição de usuários;
- alteração de status;
- separação por perfil;
- suporte aos perfis `ADMINISTRADOR`, `DOCENTE` e `DISCENTE`.

### 7.4 Disciplinas

Funcionalidades de gestão de disciplinas:

- cadastro de disciplinas;
- listagem de disciplinas;
- edição de disciplinas;
- controle de status;
- consulta para associação com turmas.

### 7.5 Turmas

Funcionalidades de gestão de turmas:

- cadastro de turmas;
- consulta/listagem de turmas;
- edição de turmas;
- vínculo com disciplina;
- vínculo com docente responsável;
- definição de ano/período letivo;
- definição de capacidade;
- controle de status;
- filtros e busca na tela de listagem.

### 7.6 Matrículas

Funcionalidades de matrícula:

- matrícula de discente em turma;
- vínculo entre discente e turma;
- consulta de matrículas;
- apoio ao fluxo acadêmico de boletim, turmas e acompanhamento do aluno.

### 7.7 Plano de Ensino

Funcionalidades de plano de ensino:

- docente pode cadastrar plano de ensino para suas turmas;
- docente pode consultar plano de ensino;
- docente pode atualizar plano de ensino;
- discente pode visualizar plano de ensino das turmas em que está matriculado;
- integração com frontend para professor e aluno.

### 7.8 Meu Perfil

Funcionalidade disponível para docente e discente:

- visualização dos próprios dados cadastrais;
- exibição de nome;
- exibição de e-mail;
- exibição de perfil;
- exibição de status.

Essa funcionalidade atende:

- RF32 — Visualizar perfil do docente;
- RF40 — Visualizar perfil do discente.

### 7.9 AVA — Ambiente Virtual de Aprendizagem

Funcionalidades acadêmicas relacionadas ao AVA:

- cadastro de materiais didáticos;
- listagem de materiais;
- cadastro de atividades;
- listagem de atividades;
- envio de entregas por discentes;
- organização por turma.

### 7.10 Boletim

Funcionalidades de boletim:

- consulta de boletim do discente;
- exibição de informações acadêmicas;
- base para notas, médias e frequência;
- visualização pelo discente.

### 7.11 Relatórios

Funcionalidades administrativas de relatórios:

- geração/visualização de boletins;
- geração/visualização de diário de classe;
- relatórios acadêmicos;
- listagem de turmas;
- apoio ao acompanhamento do desempenho acadêmico.

---

## 8. Requisitos Atendidos

### 8.1 Requisitos Funcionais

| Código | Requisito | Situação |
|---|---|---|
| RF01 | Realizar login | Implementado |
| RF02 | Controlar acesso por perfil | Implementado |
| RF03 | Encerrar sessão | Implementado |
| RF04 | Recuperar senha | Implementado |
| RF05 | Cadastrar docentes | Implementado |
| RF06 | Cadastrar discentes | Implementado |
| RF07 | Cadastrar administradores | Implementado |
| RF08 | Consultar docentes | Implementado |
| RF09 | Consultar discentes | Implementado |
| RF10 | Consultar administradores | Implementado |
| RF11 | Editar cadastro de usuários | Implementado |
| RF12 | Desativar cadastro de docentes | Implementado |
| RF13 | Desativar cadastro de discentes | Implementado |
| RF14 | Desativar cadastro de administradores | Implementado |
| RF15 | Cadastrar disciplinas | Implementado |
| RF16 | Consultar disciplinas | Implementado |
| RF17 | Editar disciplinas | Implementado |
| RF18 | Desativar ou remover disciplina | Implementado em versão inicial |
| RF19 | Cadastrar turmas | Implementado |
| RF20 | Consultar turmas | Implementado |
| RF21 | Vincular docente à turma | Implementado |
| RF22 | Vincular discente à turma | Implementado |
| RF23 | Consultar boletim do discente | Implementado em versão inicial |
| RF24 | Emitir boletim acadêmico | Implementado em versão inicial |
| RF25 | Registrar notas | Implementado em versão inicial |
| RF26 | Atualizar notas | Implementado em versão inicial |
| RF27 | Registrar frequência | Implementado em versão inicial |
| RF28 | Registrar plano de ensino | Implementado |
| RF29 | Disponibilizar materiais didáticos | Implementado |
| RF30 | Cadastrar atividades | Implementado |
| RF31 | Consultar informações da turma | Implementado |
| RF32 | Visualizar perfil do docente | Implementado |
| RF33 | Consultar notas | Implementado em versão inicial |
| RF34 | Consultar média | Implementado em versão inicial |
| RF35 | Consultar frequência | Implementado em versão inicial |
| RF36 | Consultar detalhes da turma | Implementado |
| RF37 | Acessar atividades | Implementado |
| RF38 | Acessar materiais de estudo | Implementado |
| RF39 | Enviar atividades | Implementado |
| RF40 | Visualizar perfil do discente | Implementado |
| RF41 | Gerar boletins | Implementado em versão inicial |
| RF42 | Gerar diários de classe | Implementado em versão inicial |
| RF43 | Gerar listas de turmas | Implementado |
| RF44 | Gerar relatórios de desempenho do discente | Implementado em versão inicial |

### 8.2 Requisitos Não Funcionais

| Código | Requisito | Atendimento |
|---|---|---|
| RNF01 | Criptografia de dados | Senhas armazenadas com hash BCrypt |
| RNF02 | Autenticação de sessão | JWT com expiração configurada |
| RNF03 | Privacidade dos dados | Controle por autenticação e perfil |
| RNF04 | Conformidade com LGPD | Dados tratados com restrição de acesso |
| RNF05 | Usabilidade | Menus separados por perfil |
| RNF06 | Responsividade | Interface web com adaptação visual em evolução |
| RNF07 | Disponibilidade | Aplicação executável em ambiente local |
| RNF08 | Desempenho | Operações principais organizadas via API REST |
| RNF09 | Camadas lógicas | Separação em controller, service e repository |
| RNF10 | Módulos de domínio | Pacotes organizados por domínio funcional |
| RNF11 | Portabilidade | Execução local com Java, Node e PostgreSQL |
| RNF12 | Escalabilidade | Arquitetura modular permite expansão |
| RNF13 | Integridade dos dados | Uso de JPA, constraints e migrations |
| RNF14 | Confiabilidade | Versionamento de schema com Flyway |
| RNF15 | Padronização visual | Layouts e componentes seguem padrão visual comum |
| RNF16 | Tratamento de exceções | Respostas amigáveis em autenticação/autorização |
| RNF17 | Compatibilidade | Frontend web para navegadores modernos |
| RNF18 | Idioma | Interface em português |
| RNF19 | Backup e restauração | Previsto como melhoria futura |
| RNF20 | Acessibilidade | Parcial, com melhorias futuras previstas |

### 8.3 Requisitos de Domínio

| Código | Requisito | Atendimento |
|---|---|---|
| RD01 | Conformidade com legislação educacional | Considerado no escopo acadêmico |
| RD02 | Notas apenas pelo docente responsável | Implementado/validado no fluxo docente |
| RD03 | Consulta acadêmica individualizada | Fluxo discente separado por autenticação |
| RD04 | Restrição de dados acadêmicos sensíveis | Proteção por autenticação, perfil e rotas |
| RD05 | Responsabilidades do administrador | Administrador gerencia estrutura acadêmica |
| RD06 | Responsabilidades do docente | Docente gerencia turmas e registros vinculados |
| RD07 | Responsabilidades do discente | Discente consulta informações e envia atividades |
| RD08 | Organização por período letivo | Turmas e registros acadêmicos vinculados a período |
| RD09 | Vínculo obrigatório entre turma, disciplina e docente | Turmas possuem disciplina e docente responsável |
| RD10 | Cálculo de frequência | Implementado em versão inicial/parcial |
| RD11 | Cálculo de média acadêmica | Implementado em versão inicial/parcial |

---

## 9. Banco de Dados e Migrations

O projeto utiliza PostgreSQL como banco de dados e Flyway para versionamento das alterações estruturais.

As migrations ficam em:

```text
backend/src/main/resources/db/migration/
```

Migrations presentes no projeto:

```text
V1__criar_tabela_usuarios.sql
V1.1__adicionar_campos_identificadores.sql
V2__criar_tabela_disciplinas.sql
V3__criar_tabela_turmas.sql
V4__criar_tabela_matriculas.sql
V5__criar_tabela_materiais_didaticos.sql
V6__criar_tabela_atividades.sql
V7__criar_tabela_entregas_atividades.sql
V8__adicionar_indices_unicos_usuarios.sql
V9__adicionar_indice_unico_matriculas.sql
V10__adicionar_indices_ava.sql
V11__criar_tabela_tokens_recuperacao_senha.sql
V12__criar_tabela_planos_ensino.sql
```

O backend está configurado com:

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

Isso significa que o Hibernate valida o schema existente, enquanto o Flyway é responsável por aplicar as migrations.

---

## 10. Segurança e Autorização

O sistema utiliza autenticação baseada em JWT.

### 10.1 Endpoints públicos

Os seguintes endpoints são públicos:

```text
POST /api/auth/login
POST /api/auth/esqueci-senha
POST /api/auth/redefinir-senha
```

### 10.2 Endpoints protegidos

Todos os demais endpoints exigem autenticação:

```text
.anyRequest().authenticated()
```

### 10.3 Fluxo de autenticação

```text
Usuário informa e-mail e senha
        ↓
Backend valida as credenciais
        ↓
Backend gera token JWT
        ↓
Frontend salva o token
        ↓
Requisições seguintes usam Authorization: Bearer <token>
        ↓
Backend valida o token e identifica o usuário autenticado
```

### 10.4 Controle por perfil

O frontend possui rotas separadas para:

- administrador;
- docente;
- discente.

O backend utiliza Spring Security, JWT e authorities baseadas no perfil do usuário.

---

## 11. Como Executar o Projeto

### 11.1 Pré-requisitos

Antes de executar o projeto, instale:

- Java 21 ou superior;
- Node.js;
- npm;
- Docker e Docker Compose;
- Git.

---

### 11.2 Clonar o repositório

```bash
git clone https://github.com/thejosephantony/SGE-Sistema-de-Gerenciamento-Escolar.git
cd SGE-Sistema-de-Gerenciamento-Escolar
```

---

### 11.3 Subir o banco de dados com Docker

Na raiz do projeto:

```bash
docker compose up -d
```

O PostgreSQL será iniciado com as seguintes configurações:

```text
Banco: sge
Usuário: postgres
Senha: senha_do_postgres_sge
Porta: 5432
```

Para verificar se o container está rodando:

```bash
docker ps
```

Para parar o banco:

```bash
docker compose down
```

---

### 11.4 Configurar variáveis de ambiente do backend

No PowerShell:

```powershell
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="senha_do_postgres_sge"
$env:JWT_SECRET="chave-de-desenvolvimento-do-sge-com-mais-de-32-caracteres"
```

No Linux/macOS:

```bash
export DB_USERNAME=postgres
export DB_PASSWORD=senha_do_postgres_sge
export JWT_SECRET=chave-de-desenvolvimento-do-sge-com-mais-de-32-caracteres
```

---

### 11.5 Executar o backend

Entre na pasta do backend:

```bash
cd backend
```

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

No Linux/macOS:

```bash
./mvnw spring-boot:run
```

O backend será executado em:

```text
http://localhost:8080
```

A API ficará disponível em:

```text
http://localhost:8080/api
```

---

### 11.6 Executar o frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o frontend:

```bash
npm run dev
```

O frontend será executado, normalmente, em:

```text
http://localhost:5173
```

---

## 12. Variáveis de Ambiente

### 12.1 Backend

| Variável | Finalidade | Exemplo |
|---|---|---|
| `DB_USERNAME` | Usuário do PostgreSQL | `postgres` |
| `DB_PASSWORD` | Senha do PostgreSQL | `senha_do_postgres_sge` |
| `JWT_SECRET` | Chave usada para assinar tokens JWT | `chave-de-desenvolvimento-do-sge-com-mais-de-32-caracteres` |

### 12.2 Frontend

| Variável | Finalidade | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:8080/api` |

Caso `VITE_API_URL` não seja definida, o frontend usa por padrão:

```text
http://localhost:8080/api
```

---

## 13. Comandos Úteis

### 13.1 Backend

Executar backend:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Compilar backend:

```bash
./mvnw clean package
```

Executar testes:

```bash
./mvnw test
```

---

### 13.2 Frontend

Executar frontend:

```bash
cd frontend
npm run dev
```

Gerar build:

```bash
npm run build
```

Executar lint:

```bash
npm run lint
```

Pré-visualizar build:

```bash
npm run preview
```

---

### 13.3 Docker

Subir banco:

```bash
docker compose up -d
```

Parar banco:

```bash
docker compose down
```

Ver logs:

```bash
docker logs sge-postgres
```

---

### 13.4 Git

Verificar branch atual:

```bash
git branch --show-current
```

Verificar alterações:

```bash
git status
```

Adicionar alterações:

```bash
git add .
```

Criar commit:

```bash
git commit -m "Mensagem do commit"
```

Enviar para o GitHub:

```bash
git push origin main
```

---

## 14. Rotas Principais da Aplicação

### 14.1 Rotas públicas

```text
/
 /login
 /recuperar-senha
 /redefinir-senha
```

### 14.2 Rotas do Administrador

```text
/admin/dashboard
/admin/usuarios
/admin/disciplinas
/admin/turmas
/admin/matriculas
/admin/relatorios
```

### 14.3 Rotas do Docente

```text
/professor/dashboard
/professor/turmas
/professor/diario-classe
/professor/ava
/professor/plano-ensino
/professor/relatorios
/professor/meu-perfil
```

### 14.4 Rotas do Discente

```text
/aluno/dashboard
/aluno/boletim
/aluno/horario
/aluno/ava
/aluno/plano-ensino
/aluno/meu-perfil
```

---

## 15. API REST — Visão Geral

A API segue o padrão REST e utiliza o prefixo:

```text
/api
```

### 15.1 Autenticação

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/esqueci-senha
POST /api/auth/redefinir-senha
```

### 15.2 Usuários

```text
GET    /api/usuarios
POST   /api/usuarios
GET    /api/usuarios/{id}
PUT    /api/usuarios/{id}
PATCH  /api/usuarios/{id}/status
```

### 15.3 Disciplinas

```text
GET    /api/disciplinas
POST   /api/disciplinas
GET    /api/disciplinas/{id}
PUT    /api/disciplinas/{id}
PATCH  /api/disciplinas/{id}/status
```

### 15.4 Turmas

```text
GET    /api/turmas
POST   /api/turmas
GET    /api/turmas/{id}
PUT    /api/turmas/{id}
PATCH  /api/turmas/{id}/status
```

### 15.5 Matrículas

```text
GET    /api/matriculas
POST   /api/matriculas
GET    /api/matriculas/{id}
```

### 15.6 AVA

```text
GET    /api/materiais
POST   /api/materiais
GET    /api/atividades
POST   /api/atividades
GET    /api/entregas
POST   /api/entregas
```

### 15.7 Plano de Ensino

```text
GET    /api/planos-ensino
POST   /api/planos-ensino
GET    /api/planos-ensino/{id}
PUT    /api/planos-ensino/{id}
```

### 15.8 Perfil

```text
GET /api/meu-perfil
```

### 15.9 Relatórios

```text
GET /api/relatorios
GET /api/relatorios/boletins
GET /api/relatorios/diarios
GET /api/relatorios/turmas
```

Observação: a nomenclatura exata de alguns endpoints pode variar conforme o controller correspondente. A lista acima representa a organização geral da API no projeto.

---

## 16. Testes Manuais Recomendados

### 16.1 Testes de autenticação

- Fazer login com credenciais válidas.
- Tentar login com senha incorreta.
- Testar recuperação de senha.
- Testar redefinição de senha.
- Fazer logout.
- Tentar acessar rotas protegidas sem estar autenticado.

### 16.2 Testes de autorização por perfil

#### Administrador

- Acessar dashboard administrativo.
- Cadastrar usuários.
- Editar usuários.
- Listar disciplinas.
- Cadastrar turmas.
- Matricular discentes.
- Acessar relatórios.

#### Docente

- Acessar dashboard docente.
- Visualizar suas turmas.
- Acessar plano de ensino.
- Cadastrar/editar plano de ensino.
- Acessar AVA docente.
- Acessar diário de classe.
- Visualizar meu perfil.
- Confirmar que não acessa telas administrativas.

#### Discente

- Acessar dashboard discente.
- Consultar boletim.
- Consultar horário.
- Acessar AVA discente.
- Visualizar plano de ensino.
- Visualizar meu perfil.
- Confirmar que não acessa telas administrativas.
- Confirmar que não acessa dados de outros discentes.

### 16.3 Testes de requisitos de domínio

- Confirmar que docente só altera dados de turma à qual está vinculado.
- Confirmar que discente visualiza apenas suas próprias informações.
- Confirmar que notas e frequência não aparecem para usuários não autorizados.
- Confirmar que administrador acessa apenas funcionalidades administrativas.
- Confirmar vínculo obrigatório entre turma, disciplina e docente.

---

## 17. Organização por Módulos

O desenvolvimento foi organizado em módulos.

| Módulo | Nome | Situação |
|---|---|---|
| Módulo 1 | Planejamento e Estrutura Inicial | Concluído |
| Módulo 2 | Configuração do Ambiente | Concluído |
| Módulo 3 | Base Visual e Navegação | Implementado em versão funcional |
| Módulo 4 | Banco de Dados e Infraestrutura | Implementado |
| Módulo 5 | Usuários e Autenticação | Implementado |
| Módulo 6 | Gestão Acadêmica Base | Implementado |
| Módulo 7 | Notas e Frequência | Implementado em versão inicial |
| Módulo 8 | Ambiente Virtual de Aprendizagem | Implementado |
| Módulo 9 | Relatórios e Indicadores | Implementado em versão inicial |
| Módulo 10 | Conformidade Final de Requisitos | Implementado/validado |

---

## 18. Melhorias Futuras

Algumas melhorias possíveis para evolução do projeto:

- criar testes automatizados unitários e de integração;
- criar testes E2E no frontend;
- melhorar responsividade em telas menores;
- criar dashboard com gráficos reais;
- aprimorar filtros de relatórios;
- exportar relatórios em PDF e Excel;
- aprimorar controle fino de autorização no backend com `@PreAuthorize`;
- criar auditoria de operações críticas;
- implementar logs estruturados;
- criar tela administrativa de backup;
- melhorar acessibilidade;
- criar documentação completa da API;
- publicar ambiente de homologação;
- configurar CI/CD;
- configurar deploy com Docker;
- criar seeds para dados de demonstração;
- melhorar tratamento global de exceções;
- ampliar cobertura de validações no frontend e backend.

---

## 19. Equipe

Projeto acadêmico desenvolvido para a disciplina de Engenharia de Software.

Repositório:

```text
https://github.com/thejosephantony/SGE-Sistema-de-Gerenciamento-Escolar
```

---

## Status Final

O SGE encontra-se em versão acadêmica funcional, com os principais módulos implementados e integrados:

- autenticação;
- autorização por perfil;
- gestão de usuários;
- gestão de disciplinas;
- gestão de turmas;
- matrículas;
- AVA;
- plano de ensino;
- meu perfil;
- boletim;
- relatórios;
- banco versionado com Flyway;
- frontend integrado ao backend.

O projeto atende aos principais requisitos funcionais, não funcionais e de domínio previstos para o escopo acadêmico, mantendo arquitetura modular e possibilidade de evolução futura.
