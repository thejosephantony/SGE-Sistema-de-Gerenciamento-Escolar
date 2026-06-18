# Plano de Desenvolvimento Atualizado — Sistema de Gerenciamento Escolar

## 1. Identificação do Projeto

**Nome do projeto:** Sistema de Gerenciamento Escolar
**Sigla:** SGE
**Tipo de sistema:** Aplicação web acadêmica
**Situação atual:** Em implementação
**Repositório:** SGE-Sistema-de-Gerenciamento-Escolar
**Arquitetura geral:** Frontend web + Backend REST + Banco de dados relacional
**Backend:** Spring Boot
**Frontend:** React com TypeScript
**Banco de dados:** PostgreSQL
**Versionamento de banco:** Flyway

---

## 2. Visão Geral

O **Sistema de Gerenciamento Escolar (SGE)** é uma aplicação web desenvolvida com o objetivo de apoiar a administração acadêmica de uma instituição de ensino.

O sistema busca centralizar funcionalidades essenciais como gerenciamento de usuários, autenticação, controle acadêmico, disciplinas, turmas, matrículas, ambiente virtual de aprendizagem, notas, frequência e relatórios.

O desenvolvimento está sendo realizado de forma incremental, dividido em módulos. Cada módulo representa uma parte funcional do sistema e deve evoluir passando pelas etapas de implementação do backend, teste da API, integração com o frontend, validação e documentação.

A proposta do SGE não é apenas cadastrar informações, mas organizar os processos acadêmicos de forma mais clara, segura e escalável.

---

## 3. Objetivo Geral

O objetivo geral do projeto é desenvolver um sistema web capaz de gerenciar processos acadêmicos e administrativos de uma instituição de ensino, permitindo que administradores, docentes e discentes realizem suas atividades de maneira integrada.

---

## 4. Objetivos Específicos

O sistema tem como objetivos específicos:

* permitir autenticação segura de usuários;
* controlar acesso por perfil;
* cadastrar e gerenciar usuários;
* cadastrar disciplinas;
* cadastrar turmas;
* matricular discentes em turmas;
* permitir que docentes publiquem materiais didáticos;
* permitir que docentes criem atividades;
* permitir que discentes enviem entregas de atividades;
* registrar notas;
* registrar frequência;
* gerar relatórios acadêmicos;
* apoiar a tomada de decisão por meio de indicadores;
* oferecer uma base modular para evolução futura.

---

## 5. Perfis de Usuário

O sistema trabalha inicialmente com três perfis principais.

| Perfil        | Finalidade                                                                     |
| ------------- | ------------------------------------------------------------------------------ |
| Administrador | Gerenciar usuários, disciplinas, turmas, matrículas e configurações gerais     |
| Docente       | Gerenciar turmas, materiais didáticos, atividades, notas e frequência          |
| Discente      | Consultar turmas, materiais, atividades, boletim, frequência e enviar entregas |

---

## 6. Estrutura Geral do Projeto

A estrutura principal do repositório está organizada da seguinte forma:

```text
SGE-Sistema-de-Gerenciamento-Escolar/
├── backend/
├── frontend/
├── database/
├── docs/
├── README.md
└── .gitignore
```

### 6.1 Backend

O backend concentra:

* regras de negócio;
* autenticação;
* autorização;
* API REST;
* persistência de dados;
* integração com o banco;
* migrations do Flyway.

### 6.2 Frontend

O frontend concentra:

* telas do sistema;
* rotas protegidas;
* formulários;
* consumo da API;
* armazenamento do token JWT;
* redirecionamento por perfil;
* experiência visual do usuário.

### 6.3 Banco de Dados

O banco de dados armazena:

* usuários;
* disciplinas;
* turmas;
* matrículas;
* materiais didáticos;
* atividades;
* entregas;
* futuramente notas, frequência e relatórios.

### 6.4 Documentação

A documentação deve registrar:

* visão geral do projeto;
* plano de desenvolvimento;
* status dos módulos;
* rotas da API;
* decisões técnicas;
* testes manuais;
* melhorias futuras.

---

## 7. Tecnologias Utilizadas

## 7.1 Backend

Tecnologias utilizadas ou previstas no backend:

* Java;
* Spring Boot;
* Spring Web;
* Spring Security;
* JWT;
* Spring Data JPA;
* Hibernate;
* PostgreSQL;
* Flyway;
* Maven;
* BCrypt para criptografia de senha.

## 7.2 Frontend

Tecnologias utilizadas ou previstas no frontend:

* React;
* TypeScript;
* Vite;
* React Router;
* CSS Modules;
* consumo de API REST via `fetch`;
* armazenamento local com `localStorage`.

## 7.3 Banco de Dados

Banco utilizado:

* PostgreSQL.

Controle de versão do banco:

* Flyway.

---

## 8. Estratégia de Desenvolvimento

O desenvolvimento do SGE segue uma estratégia modular e incremental.

Cada módulo deve seguir, preferencialmente, o seguinte fluxo:

```text
Planejamento → Backend → Migration → Teste da API → Frontend → Integração → Validação → Documentação
```

Essa estratégia facilita:

* organização do desenvolvimento;
* identificação de erros;
* validação gradual;
* separação de responsabilidades;
* evolução controlada do sistema;
* documentação do progresso real.

---

## 9. Arquitetura Geral

A arquitetura do sistema é baseada em camadas.

```text
Frontend React
      ↓
API REST Spring Boot
      ↓
Services
      ↓
Repositories
      ↓
PostgreSQL
```

No backend, o fluxo básico é:

```text
Controller → Service → Repository → Banco de Dados
```

No frontend, o fluxo básico é:

```text
Página/Componente → Service frontend → API REST → Backend
```

---

## 10. Organização Recomendada dos Módulos

A organização funcional do projeto pode ser representada assim:

```text
Módulo 1 — Planejamento e Estrutura Inicial
Módulo 2 — Configuração do Ambiente
Módulo 3 — Base Visual e Navegação
Módulo 4 — Banco de Dados e Infraestrutura
Módulo 5 — Usuários e Autenticação
Módulo 6 — Gestão Acadêmica Base
Módulo 7 — Notas e Frequência
Módulo 8 — Ambiente Virtual de Aprendizagem
Módulo 9 — Relatórios e Indicadores
```

---

# 11. Status Consolidado dos Módulos

| Módulo   | Nome                             | Situação Atual              |
| -------- | -------------------------------- | --------------------------- |
| Módulo 1 | Planejamento e Estrutura Inicial | Concluído em versão inicial |
| Módulo 2 | Configuração do Ambiente         | Concluído em versão inicial |
| Módulo 3 | Base Visual e Navegação          | Parcialmente implementado   |
| Módulo 4 | Banco de Dados e Infraestrutura  | Em evolução                 |
| Módulo 5 | Usuários e Autenticação          | Funcional em versão inicial |
| Módulo 6 | Gestão Acadêmica Base            | Backend funcional           |
| Módulo 7 | Notas e Frequência               | Pendente                    |
| Módulo 8 | Ambiente Virtual de Aprendizagem | Backend funcional           |
| Módulo 9 | Relatórios e Indicadores         | Pendente/parcial            |

---

# 12. Módulo 1 — Planejamento e Estrutura Inicial

## 12.1 Status

**Status:** concluído em versão inicial.

## 12.2 Finalidade

O Módulo 1 teve como finalidade estruturar a ideia inicial do sistema, definir o escopo, organizar o repositório e estabelecer a visão geral do projeto.

## 12.3 Entregas realizadas

* definição do tema do projeto;
* definição do nome SGE;
* definição dos perfis principais;
* criação da estrutura inicial do repositório;
* separação entre backend, frontend, banco e documentação;
* criação de README inicial;
* definição do desenvolvimento modular.

## 12.4 Melhorias futuras

* melhorar documentação de requisitos;
* criar documento de visão;
* criar glossário do domínio;
* criar documentação de regras de negócio;
* registrar decisões arquiteturais;
* criar checklist de entrega por módulo.

---

# 13. Módulo 2 — Configuração do Ambiente

## 13.1 Status

**Status:** concluído em versão inicial.

## 13.2 Finalidade

Configurar o ambiente necessário para desenvolvimento local do sistema.

## 13.3 Entregas realizadas

* configuração do backend Spring Boot;
* configuração do frontend React com Vite;
* configuração do PostgreSQL;
* configuração do Maven;
* configuração de execução local;
* configuração inicial do Flyway;
* configuração de variáveis de ambiente.

## 13.4 Pontos importantes

O backend utiliza variáveis de ambiente para dados sensíveis, como senha do banco e chave JWT.

Exemplo:

```properties
spring.datasource.password=${DB_PASSWORD}
sge.jwt.secret=${JWT_SECRET:chave-de-desenvolvimento-do-sge-com-mais-de-32-caracteres}
```

## 13.5 Melhorias futuras

* criar arquivo `.env.example`;
* documentar configuração completa do ambiente;
* criar ambiente com Docker;
* criar `docker-compose.yml` para backend, frontend e banco;
* padronizar versões de Java, Node e PostgreSQL;
* criar guia de instalação do projeto.

---

# 14. Módulo 3 — Base Visual e Navegação

## 14.1 Status

**Status:** parcialmente implementado.

## 14.2 Finalidade

Criar a base visual do frontend, incluindo tela inicial, layouts por perfil, navegação e organização visual.

## 14.3 Entregas realizadas

* criação da landing page;
* criação da tela de login;
* criação de layouts por perfil;
* criação de estrutura visual para administrador;
* criação de estrutura visual para docente;
* criação de estrutura visual para discente;
* configuração de rotas principais;
* redirecionamento inicial por perfil após login.

## 14.4 Pendências

* validar todas as rotas protegidas;
* revisar navegação dos menus;
* padronizar componentes visuais;
* melhorar responsividade;
* revisar estados de carregamento;
* revisar mensagens de erro;
* criar fallback para rotas inexistentes;
* melhorar experiência visual geral.

## 14.5 Melhorias futuras

* dashboard visual por perfil;
* tema claro e escuro;
* componentes reutilizáveis;
* design system do projeto;
* breadcrumbs;
* filtros globais;
* notificações visuais;
* melhoria de acessibilidade.

---

# 15. Módulo 4 — Banco de Dados e Infraestrutura

## 15.1 Status

**Status:** em evolução.

## 15.2 Finalidade

Fornecer a base de persistência de dados do sistema.

## 15.3 Entregas realizadas

* configuração do PostgreSQL;
* configuração do Flyway;
* criação de migrations iniciais;
* criação de tabelas para usuários;
* criação de tabelas acadêmicas;
* criação de tabelas do AVA.

## 15.4 Migrations existentes ou esperadas

```text
V1  — Usuários
V2  — Disciplinas
V3  — Turmas
V4  — Matrículas
V5  — Materiais Didáticos
V6  — Atividades
V7  — Entregas de Atividades
```

## 15.5 Pendências

* criar migrations para notas;
* criar migrations para frequência;
* criar migrations para relatórios, caso necessário;
* revisar constraints;
* revisar índices;
* revisar chaves estrangeiras;
* revisar regras de unicidade.

## 15.6 Melhorias futuras

* criar seeds de usuários de teste;
* criar dados iniciais de disciplinas;
* criar dados iniciais de turmas;
* criar banco de teste separado;
* criar ambiente de homologação;
* criar backup automático;
* melhorar performance com índices.

---

# 16. Módulo 5 — Usuários e Autenticação

## 16.1 Status

**Status:** funcional em versão inicial.

O Módulo 5 está implementado com backend de usuários, autenticação JWT e login integrado ao frontend.

## 16.2 Finalidade

Gerenciar usuários e controlar o acesso ao sistema.

## 16.3 Funcionalidades implementadas

* cadastro de usuários;
* listagem de usuários;
* busca de usuário por ID;
* atualização de usuário;
* ativação de usuário;
* desativação de usuário;
* criptografia de senha com BCrypt;
* autenticação por e-mail e senha;
* geração de token JWT;
* validação de token JWT;
* endpoint de usuário autenticado;
* login integrado ao frontend;
* armazenamento do token no frontend;
* redirecionamento por perfil.

## 16.4 Endpoints principais

```text
POST   /api/usuarios
GET    /api/usuarios
GET    /api/usuarios/{id}
PUT    /api/usuarios/{id}
PATCH  /api/usuarios/{id}/ativar
PATCH  /api/usuarios/{id}/desativar

POST   /api/auth/login
GET    /api/auth/me
```

## 16.5 Testes realizados

```text
[x] Cadastro de administrador
[x] Cadastro de docente
[x] Cadastro de discente
[x] Login com e-mail e senha
[x] Geração de token JWT
[x] Acesso ao /api/auth/me com Bearer Token
[x] Login pela tela frontend
[x] API respondendo ao frontend com JWT
```

## 16.6 Situação detalhada

| Submódulo                               | Situação                       |
| --------------------------------------- | ------------------------------ |
| 5.1 — Backend de Usuários               | Implementado                   |
| 5.2 — Autenticação com JWT              | Implementado                   |
| 5.3 — Login no Frontend                 | Implementado e testado         |
| 5.4 — Tela de Gerenciamento de Usuários | Pendente de validação completa |

## 16.7 Pendências

* validar tela de usuários pela interface;
* testar cadastro pela interface;
* testar edição pela interface;
* testar ativação e desativação pela interface;
* melhorar mensagens de erro;
* melhorar tratamento de exceções;
* retornar `409 Conflict` para e-mail duplicado;
* retornar `404 Not Found` para usuário inexistente;
* revisar permissões por perfil.

## 16.8 Melhorias futuras

* recuperação de senha;
* alteração de senha;
* bloqueio após tentativas inválidas;
* refresh token;
* autenticação em dois fatores;
* histórico de login;
* auditoria de ações;
* permissões customizáveis;
* controle de sessão;
* logout global.

---

# 17. Módulo 6 — Gestão Acadêmica Base

## 17.1 Status

**Status:** backend funcional em fluxo básico.

## 17.2 Finalidade

Gerenciar a base acadêmica do sistema.

Esse módulo permite cadastrar disciplinas, criar turmas e matricular discentes.

## 17.3 Funcionalidades implementadas

* cadastro de disciplinas;
* listagem de disciplinas;
* criação de turmas;
* associação de turma com disciplina;
* associação de turma com docente;
* matrícula de discente em turma;
* listagem de turmas;
* listagem de matrículas;
* controle inicial de status.

## 17.4 Endpoints principais

```text
POST   /api/disciplinas
GET    /api/disciplinas
GET    /api/disciplinas/{id}

POST   /api/turmas
GET    /api/turmas
GET    /api/turmas/{id}

POST   /api/matriculas
GET    /api/matriculas
```

## 17.5 Fluxo testado

```text
[x] Criar docente
[x] Criar discente
[x] Criar disciplina
[x] Criar turma
[x] Matricular discente em turma
```

## 17.6 Situação detalhada

| Parte                   | Situação              |
| ----------------------- | --------------------- |
| Disciplinas             | Backend funcional     |
| Turmas                  | Backend funcional     |
| Matrículas              | Backend funcional     |
| Frontend de disciplinas | Pendente de validação |
| Frontend de turmas      | Pendente de validação |
| Frontend de matrículas  | Pendente de validação |

## 17.7 Pendências

* validar frontend de disciplinas;
* validar frontend de turmas;
* validar frontend de matrículas;
* corrigir erro de build em `servicoMatricula.ts`;
* validar matrícula duplicada;
* validar capacidade da turma;
* validar status da turma antes da matrícula;
* validar discente ativo;
* validar docente ativo.

## 17.8 Melhorias futuras

* gerenciamento de períodos letivos;
* controle de horários;
* controle de salas;
* pré-requisitos de disciplinas;
* fila de espera;
* cancelamento de matrícula;
* histórico acadêmico;
* importação de alunos;
* exportação de listas;
* controle de vagas por turma.

---

# 18. Módulo 7 — Notas e Frequência

## 18.1 Status

**Status:** pendente de implementação.

## 18.2 Finalidade

Registrar, acompanhar e consultar o desempenho acadêmico dos discentes por meio de notas e frequência.

Esse módulo é essencial para fechar o ciclo acadêmico principal do sistema.

## 18.3 Funcionalidades previstas

* cadastro de avaliações;
* registro de notas;
* edição de notas;
* cálculo de média;
* consulta de boletim;
* registro de aulas;
* registro de frequência;
* consulta de frequência por turma;
* consulta de frequência por discente;
* controle de faltas justificadas;
* alertas de risco acadêmico.

## 18.4 Entidades previstas

```text
Avaliacao
Nota
Aula
Frequencia
RegistroFrequencia
```

## 18.5 Possíveis endpoints

```text
POST   /api/avaliacoes
GET    /api/avaliacoes/turma/{turmaId}
PUT    /api/avaliacoes/{id}
DELETE /api/avaliacoes/{id}

POST   /api/notas
GET    /api/notas/discente/{discenteId}
GET    /api/notas/turma/{turmaId}
PUT    /api/notas/{id}

POST   /api/frequencias
GET    /api/frequencias/discente/{discenteId}
GET    /api/frequencias/turma/{turmaId}
PUT    /api/frequencias/{id}
```

## 18.6 Situação detalhada

| Parte      | Situação         |
| ---------- | ---------------- |
| Avaliações | Não implementado |
| Notas      | Não implementado |
| Frequência | Não implementado |
| Backend    | Pendente         |
| Frontend   | Pendente         |
| Migrations | Pendente         |

## 18.7 Pendências

* criar migrations;
* criar entidades;
* criar DTOs;
* criar repositories;
* criar services;
* criar controllers;
* proteger endpoints com JWT;
* validar permissões;
* integrar com frontend;
* testar professor lançando nota;
* testar professor registrando frequência;
* testar aluno consultando boletim;
* testar aluno consultando frequência.

## 18.8 Melhorias futuras

* cálculo automático de média;
* pesos por avaliação;
* recuperação ou prova final;
* boletim em PDF;
* alerta de reprovação por média;
* alerta de reprovação por falta;
* gráficos de desempenho;
* histórico escolar;
* exportação para planilha;
* assinatura digital de registros acadêmicos.

---

# 19. Módulo 8 — Ambiente Virtual de Aprendizagem

## 19.1 Status

**Status:** backend funcional e integrado à `main`.

O Módulo 8 foi implementado no backend e validado em fluxo básico.

## 19.2 Finalidade

Permitir interação acadêmica entre docentes e discentes por meio de materiais didáticos, atividades e entregas.

## 19.3 Funcionalidades implementadas

* criação de materiais didáticos;
* listagem de materiais por turma;
* criação de atividades;
* listagem de atividades por turma;
* busca de atividade por ID;
* encerramento de atividade;
* cancelamento de atividade;
* envio de entrega;
* listagem de entregas por atividade;
* listagem de entregas do discente;
* busca de entrega por ID;
* associação com turma, docente e discente.

## 19.4 Endpoints principais

```text
POST   /api/materiais
GET    /api/materiais/turma/{turmaId}

POST   /api/atividades
GET    /api/atividades/turma/{turmaId}
GET    /api/atividades/{id}
PATCH  /api/atividades/{id}/encerrar
PATCH  /api/atividades/{id}/cancelar

POST   /api/entregas
GET    /api/entregas/atividade/{atividadeId}
GET    /api/entregas/minhas
GET    /api/entregas/{id}
```

## 19.5 Fluxo testado

```text
[x] Login com JWT
[x] Acesso a rotas protegidas
[x] Consulta de materiais por turma
[x] Consulta de atividades por turma
[x] Criação de docente
[x] Criação de discente
[x] Criação de disciplina
[x] Criação de turma
[x] Matrícula de discente
[x] Criação de material didático
[x] Criação de atividade
[x] Envio de entrega de atividade
[x] API respondendo ao frontend com token JWT
```

## 19.6 Situação detalhada

| Parte                          | Situação          |
| ------------------------------ | ----------------- |
| Materiais Didáticos            | Backend funcional |
| Atividades                     | Backend funcional |
| Entregas de Atividades         | Backend funcional |
| Frontend do AVA                | Pendente          |
| Integração visual              | Pendente          |
| Validação final pela interface | Pendente          |

## 19.7 Pendências

* criar frontend do AVA;
* criar tela de materiais;
* criar tela de atividades;
* criar tela de entregas;
* criar service frontend para materiais;
* criar service frontend para atividades;
* criar service frontend para entregas;
* permitir docente publicar material pela interface;
* permitir docente criar atividade pela interface;
* permitir discente visualizar atividades;
* permitir discente enviar entrega;
* permitir docente visualizar entregas;
* adicionar feedback do docente;
* integrar atividades com notas no Módulo 7;
* substituir `docenteId` e `discenteId` manuais por usuário autenticado via JWT.

## 19.8 Melhorias futuras

* upload real de arquivos;
* anexos múltiplos;
* pré-visualização de PDF;
* controle automático de prazo;
* bloqueio de entregas após prazo;
* reabertura de atividade;
* feedback textual;
* comentários;
* notificações;
* calendário de atividades;
* painel de atividades pendentes;
* painel de entregas aguardando correção;
* integração com notas;
* integração com relatórios.

---

# 20. Módulo 9 — Relatórios e Indicadores Acadêmicos

## 20.1 Status

**Status:** pendente/parcial.

O Módulo 9 ainda não deve ser considerado completo. Ele depende diretamente da consolidação dos módulos anteriores, principalmente do Módulo 7, que ainda está pendente.

Mesmo que já existam telas ou estruturas iniciais de relatórios no frontend, os relatórios acadêmicos completos ainda não podem ser finalizados sem notas e frequência.

## 20.2 Finalidade

Transformar os dados do sistema em informações úteis para acompanhamento acadêmico, administrativo e pedagógico.

O módulo de relatórios deve apoiar:

* secretaria acadêmica;
* coordenação;
* docentes;
* discentes;
* tomada de decisão;
* acompanhamento de desempenho;
* identificação de problemas acadêmicos.

## 20.3 Relatórios previstos

### Relatórios administrativos

* total de usuários;
* total de administradores;
* total de docentes;
* total de discentes;
* total de disciplinas;
* total de turmas;
* total de matrículas;
* turmas por período letivo;
* alunos por turma;
* docentes por turma;
* disciplinas ativas.

### Relatórios acadêmicos

* boletim do discente;
* média por turma;
* média por disciplina;
* desempenho por avaliação;
* alunos abaixo da média;
* alunos aprovados;
* alunos reprovados;
* histórico acadêmico.

### Relatórios de frequência

* frequência por discente;
* frequência por turma;
* percentual de presença;
* percentual de faltas;
* alunos com excesso de faltas;
* alertas de risco por frequência.

### Relatórios do AVA

* materiais publicados por turma;
* atividades publicadas;
* atividades pendentes;
* entregas realizadas;
* entregas atrasadas;
* alunos que não entregaram;
* participação por discente;
* entregas por atividade.

## 20.4 Possíveis endpoints

```text
GET /api/relatorios/usuarios/resumo
GET /api/relatorios/disciplinas/resumo
GET /api/relatorios/turmas/resumo
GET /api/relatorios/matriculas/turma/{turmaId}

GET /api/relatorios/notas/discente/{discenteId}
GET /api/relatorios/notas/turma/{turmaId}
GET /api/relatorios/frequencia/discente/{discenteId}
GET /api/relatorios/frequencia/turma/{turmaId}

GET /api/relatorios/ava/turma/{turmaId}
GET /api/relatorios/ava/atividades-pendentes
GET /api/relatorios/ava/entregas-atrasadas
```

## 20.5 Permissões previstas

| Relatório    | Administrador | Docente            | Discente           |
| ------------ | ------------- | ------------------ | ------------------ |
| Resumo geral | Sim           | Não                | Não                |
| Usuários     | Sim           | Não                | Não                |
| Disciplinas  | Sim           | Parcial            | Não                |
| Turmas       | Sim           | Apenas suas turmas | Não                |
| Matrículas   | Sim           | Apenas suas turmas | Não                |
| Boletim      | Sim           | Parcial            | Apenas o próprio   |
| Frequência   | Sim           | Apenas suas turmas | Apenas a própria   |
| Atividades   | Sim           | Apenas suas turmas | Apenas as próprias |
| Entregas     | Sim           | Apenas suas turmas | Apenas as próprias |

## 20.6 Dependência dos módulos anteriores

| Módulo   | Dados utilizados nos relatórios  |
| -------- | -------------------------------- |
| Módulo 5 | Usuários e perfis                |
| Módulo 6 | Disciplinas, turmas e matrículas |
| Módulo 7 | Notas e frequência               |
| Módulo 8 | Materiais, atividades e entregas |

## 20.7 Situação detalhada

| Parte                              | Situação                                 |
| ---------------------------------- | ---------------------------------------- |
| Relatórios administrativos básicos | Pendente/parcial                         |
| Relatórios acadêmicos              | Dependem do Módulo 7                     |
| Relatórios de frequência           | Dependem do Módulo 7                     |
| Relatórios do AVA                  | Dependem da integração final do Módulo 8 |
| Frontend de relatórios             | Pendente de validação completa           |
| Dashboards                         | Pendente                                 |

## 20.8 Melhorias futuras

* dashboards gráficos;
* exportação para PDF;
* exportação para Excel;
* filtros por período;
* filtros por turma;
* filtros por disciplina;
* filtros por docente;
* indicadores de evasão;
* indicadores de reprovação;
* ranking de desempenho;
* alertas automáticos;
* boletim em PDF;
* diário de classe;
* painel analítico da coordenação.

---

# 21. Pendência Técnica Imediata

Existe uma pendência de build no frontend.

Arquivo:

```text
frontend/src/features/matriculas/servicos/servicoMatricula.ts
```

Erro:

```text
'discenteNome' is declared but its value is never read.
'discenteMatricula' is declared but its value is never read.
```

## 21.1 Correções possíveis

### Opção 1 — Renomear parâmetros

```text
discenteNome       → _discenteNome
discenteMatricula  → _discenteMatricula
```

### Opção 2 — Remover parâmetros

Remover os parâmetros se eles realmente não forem necessários.

### Opção 3 — Utilizar os parâmetros

Utilizar os dados na montagem do objeto de matrícula.

## 21.2 Prioridade

Essa correção deve ser feita com prioridade, porque a `main` idealmente deve compilar com:

```powershell
npm.cmd run build
```

---

# 22. Melhorias Técnicas Recomendadas

## 22.1 Tratamento de erros

Melhorar respostas do backend.

Atualmente alguns erros retornam mensagens genéricas:

```json
{
  "mensagem": "Ocorreu um erro interno no servidor.",
  "status": 500
}
```

Melhorias recomendadas:

* usar exceções customizadas;
* retornar `400` para validação;
* retornar `401` para autenticação;
* retornar `403` para falta de permissão;
* retornar `404` para recurso inexistente;
* retornar `409` para conflitos;
* evitar mensagens genéricas em desenvolvimento;
* evitar stacktrace em produção.

## 22.2 Segurança

Algumas rotas ainda usam IDs manuais:

```text
POST /api/atividades?docenteId=3
POST /api/entregas?discenteId=4
```

Melhoria recomendada:

```text
Identificar o usuário automaticamente pelo token JWT.
```

Exemplo futuro:

```text
POST /api/atividades
```

O backend identifica o docente pelo token.

```text
POST /api/entregas
```

O backend identifica o discente pelo token.

## 22.3 Permissões por perfil

Regras recomendadas:

| Ação                      | Administrador | Docente | Discente |
| ------------------------- | ------------- | ------- | -------- |
| Gerenciar usuários        | Sim           | Não     | Não      |
| Criar disciplinas         | Sim           | Não     | Não      |
| Criar turmas              | Sim           | Não     | Não      |
| Matricular aluno          | Sim           | Não     | Não      |
| Publicar material         | Opcional      | Sim     | Não      |
| Criar atividade           | Opcional      | Sim     | Não      |
| Enviar entrega            | Não           | Não     | Sim      |
| Registrar nota            | Não           | Sim     | Não      |
| Registrar frequência      | Não           | Sim     | Não      |
| Consultar boletim próprio | Não           | Não     | Sim      |
| Gerar relatórios          | Sim           | Parcial | Não      |

## 22.4 Organização do frontend

Estrutura futura recomendada:

```text
frontend/src/features/
├── autenticacao/
├── usuarios/
├── disciplinas/
├── turmas/
├── matriculas/
├── notas/
├── frequencias/
├── ava/
│   ├── materiais/
│   ├── atividades/
│   └── entregas/
└── relatorios/
```

Services recomendados:

```text
frontend/src/services/
├── api.ts
├── authService.ts
├── usuarioService.ts
├── disciplinaService.ts
├── turmaService.ts
├── matriculaService.ts
├── materialService.ts
├── atividadeService.ts
├── entregaService.ts
├── notaService.ts
├── frequenciaService.ts
└── relatorioService.ts
```

## 22.5 Testes

Testes recomendados para o backend:

* testes de service;
* testes de repository;
* testes de controller;
* testes de autenticação;
* testes de autorização;
* testes de regras de negócio.

Testes recomendados para o frontend:

* testes de componentes;
* testes de formulário;
* testes de services;
* testes de rotas protegidas;
* testes de integração com API.

Fluxos recomendados para teste manual:

```text
[x] Login
[x] Criar usuário
[x] Criar disciplina
[x] Criar turma
[x] Matricular discente
[x] Criar material
[x] Criar atividade
[x] Enviar entrega
[ ] Lançar nota
[ ] Registrar frequência
[ ] Gerar relatório
```

---

# 23. Roadmap Futuro

## 23.1 Curto prazo

Prioridades imediatas:

```text
1. Corrigir build do frontend.
2. Validar tela de usuários.
3. Validar frontend de disciplinas.
4. Validar frontend de turmas.
5. Validar frontend de matrículas.
6. Implementar Módulo 7 — Notas e Frequência.
```

## 23.2 Médio prazo

Evoluções intermediárias:

```text
1. Criar frontend do AVA.
2. Melhorar permissões por perfil.
3. Melhorar tratamento de erros.
4. Integrar AVA com notas.
5. Criar relatórios acadêmicos.
6. Criar dashboards por perfil.
```

## 23.3 Longo prazo

Possíveis evoluções futuras:

```text
1. Plataforma acadêmica completa.
2. Calendário acadêmico.
3. Notificações.
4. Boletim em PDF.
5. Histórico escolar.
6. Relatórios exportáveis.
7. Painel analítico.
8. Upload real de arquivos.
9. Integração com serviços externos.
10. Aplicativo mobile.
```

---

# 24. Finalidades Futuras do Sistema

O SGE pode evoluir para uma plataforma acadêmica completa.

## 24.1 Secretaria acadêmica

Possibilidades:

* controle de discentes;
* controle de docentes;
* controle de matrículas;
* emissão de documentos;
* histórico escolar;
* relatórios institucionais.

## 24.2 Apoio ao docente

Possibilidades:

* controle de turmas;
* postagem de materiais;
* criação de atividades;
* correção de entregas;
* lançamento de notas;
* registro de frequência;
* acompanhamento de desempenho.

## 24.3 Apoio ao discente

Possibilidades:

* consulta de disciplinas;
* consulta de turmas;
* acesso a materiais;
* envio de atividades;
* consulta de notas;
* consulta de frequência;
* acompanhamento de pendências.

## 24.4 Apoio à gestão

Possibilidades:

* dashboards;
* indicadores acadêmicos;
* relatórios de evasão;
* relatórios de reprovação;
* desempenho por turma;
* desempenho por disciplina;
* alertas de risco acadêmico.

---

# 25. Riscos Atuais

## 25.1 Build do frontend

A `main` deve ser mantida compilável. O erro atual em `servicoMatricula.ts` deve ser corrigido.

## 25.2 Módulo 7 pendente

Notas e frequência são essenciais para o sistema acadêmico. Sem esse módulo, o ciclo acadêmico ainda está incompleto.

## 25.3 Frontend parcialmente integrado

Algumas funcionalidades existem no backend, mas ainda precisam ser validadas ou criadas no frontend.

## 25.4 Segurança a refinar

O uso manual de `docenteId` e `discenteId` deve ser substituído por identificação via JWT.

## 25.5 Tratamento de erro genérico

Mensagens genéricas dificultam testes e manutenção.

---

# 26. Checklist Geral Atual

## 26.1 Já realizado

```text
[x] Estrutura inicial do projeto
[x] Backend Spring Boot
[x] Frontend React com TypeScript
[x] Banco PostgreSQL
[x] Flyway configurado
[x] Cadastro de usuários
[x] Login com JWT
[x] Integração do login no frontend
[x] Proteção de rotas no backend
[x] Criação de disciplinas
[x] Criação de turmas
[x] Matrículas
[x] Backend do AVA
[x] Materiais didáticos
[x] Atividades
[x] Entregas de atividades
[x] Testes básicos via API
[x] Teste de API pelo frontend usando token
[x] Branch do AVA integrada à main
```

## 26.2 Ainda pendente

```text
[ ] Corrigir build do frontend
[ ] Validar tela de usuários
[ ] Validar frontend de disciplinas
[ ] Validar frontend de turmas
[ ] Validar frontend de matrículas
[ ] Implementar avaliações
[ ] Implementar notas
[ ] Implementar frequência
[ ] Criar frontend do AVA
[ ] Implementar relatórios completos
[ ] Melhorar permissões por perfil
[ ] Melhorar tratamento de erros
[ ] Criar testes automatizados
[ ] Atualizar documentação técnica continuamente
```

---

# 27. Ordem Recomendada das Próximas Entregas

A ordem recomendada para continuar o desenvolvimento é:

```text
1. Corrigir o build do frontend.
2. Validar tela de usuários.
3. Validar telas de disciplinas, turmas e matrículas.
4. Implementar Módulo 7 — Notas e Frequência.
5. Criar frontend do Módulo 8 — AVA.
6. Implementar Módulo 9 — Relatórios.
7. Melhorar segurança com usuário autenticado via JWT.
8. Criar testes automatizados.
9. Refinar documentação.
```

---

# 28. Conclusão

O SGE avançou significativamente.

A autenticação com JWT está funcionando, o backend de usuários está implementado, a base acadêmica já permite criar disciplinas, turmas e matrículas, e o backend do AVA foi implementado, testado e integrado à `main`.

Entretanto, o projeto ainda está em desenvolvimento. O Módulo 7, responsável por notas e frequência, ainda precisa ser implementado. O Módulo 8 ainda precisa de frontend específico. O Módulo 9 depende da consolidação dos módulos anteriores para ser concluído corretamente.

O status geral do projeto pode ser definido como:

```text
SGE em implementação, com backend principal avançado e frontend em integração gradual.
```

A próxima ação técnica recomendada é corrigir o build do frontend e, em seguida, validar os módulos já existentes pela interface.
