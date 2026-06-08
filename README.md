# SGE — Plano Geral de Desenvolvimento do Software

Este documento organiza as etapas de desenvolvimento do **Sistema de Gerenciamento Escolar (SGE)** para orientar o trabalho do grupo durante a implementação. O objetivo é manter o desenvolvimento alinhado à documentação de requisitos, análise, design, arquitetura e plano de projeto.

O SGE será desenvolvido como uma **aplicação web centralizada**, acessada por navegador, com separação entre **frontend**, **backend**, **banco de dados** e **documentação/testes**. A arquitetura deve preservar a organização em camadas, o controle de acesso por perfil e a rastreabilidade entre requisitos, casos de uso, modelos e implementação.

---

## 1. Objetivo do desenvolvimento

Desenvolver uma versão funcional do SGE capaz de apoiar processos acadêmicos e administrativos de uma instituição de ensino, contemplando:

- autenticação de usuários;
- controle de acesso por perfil;
- gerenciamento de usuários;
- gerenciamento de disciplinas;
- gerenciamento de turmas;
- matrícula de discentes;
- registro de notas;
- registro de frequência;
- disponibilização de materiais didáticos;
- gerenciamento de atividades;
- envio de atividades por discentes;
- consulta de desempenho acadêmico;
- geração de relatórios acadêmicos.

---

## 2. Escopo geral do sistema

O sistema deve atender três perfis principais:

### Administrador

Responsável pela organização estrutural do sistema.

Principais funções:

- gerenciar usuários;
- gerenciar disciplinas;
- gerenciar turmas;
- matricular discentes;
- consultar dados acadêmicos autorizados;
- gerar relatórios acadêmicos.

### Docente

Responsável pelo acompanhamento das turmas às quais estiver vinculado.

Principais funções:

- consultar suas turmas;
- registrar notas;
- registrar frequência;
- disponibilizar materiais didáticos;
- cadastrar atividades;
- acompanhar entregas dos discentes.

### Discente

Responsável por consultar suas informações acadêmicas e interagir com os recursos disponibilizados pelo docente.

Principais funções:

- consultar notas;
- consultar frequência;
- consultar disciplinas e turmas;
- acessar materiais didáticos;
- enviar atividades;
- consultar desempenho acadêmico.

---

## 3. Arquitetura geral da solução

A solução deve seguir uma arquitetura em camadas, organizada como uma aplicação web modular.

### Camadas principais

```text
Frontend Web
    ↓
Backend API
    ↓
Camada de Aplicação / Serviços
    ↓
Camada de Domínio
    ↓
Camada de Persistência
    ↓
Banco de Dados
```

### Separação esperada

```text
sge/
├── frontend/
├── backend/
├── database/
├── docs/
└── README.md
```

### Responsabilidade de cada parte

| Parte | Responsabilidade |
|---|---|
| Frontend | Telas, navegação, formulários, consumo da API e experiência do usuário |
| Backend | Regras de negócio, autenticação, autorização, API REST e integração com banco |
| Banco de dados | Persistência, integridade, relacionamentos e dados acadêmicos |
| Documentação | Registro de decisões, endpoints, testes, instruções de execução e evidências |
| Testes | Validação funcional, integração entre módulos e conferência dos casos de uso |

---

## 4. Tecnologias recomendadas

### Frontend

- React;
- JavaScript ou TypeScript;
- HTML;
- CSS;
- Axios ou Fetch API;
- React Router;
- biblioteca de componentes, se o grupo decidir usar.

### Backend

- Java;
- Spring Boot;
- Spring Web;
- Spring Data JPA;
- Spring Security;
- JWT;
- Bean Validation;
- Maven;
- Lombok, se o grupo decidir usar.

### Banco de dados

- PostgreSQL;
- migrations com Flyway ou Liquibase;
- dados iniciais de teste com seed.

### Ferramentas de apoio

- Git e GitHub;
- Postman ou Insomnia;
- Figma, se houver protótipo;
- Docker, se o grupo decidir padronizar ambiente;
- Trello, GitHub Projects ou outra ferramenta de organização.

---

## 5. Módulos funcionais do SGE

O desenvolvimento deve ser dividido em módulos. Cada módulo deve possuir telas, endpoints, regras de negócio, persistência e testes correspondentes.

---

## 5.1 Módulo de Acesso e Segurança

### Objetivo

Permitir que usuários acessem o sistema conforme seu perfil.

### Casos de uso relacionados

- UC01 — Realizar Login.

### Funcionalidades

- login;
- logout;
- identificação do usuário autenticado;
- controle de acesso por perfil;
- recuperação de senha, se houver tempo;
- proteção de rotas no frontend;
- proteção de endpoints no backend.

### Regras principais

- Usuário precisa estar cadastrado para acessar o sistema.
- O sistema deve validar as credenciais.
- O sistema deve identificar o perfil do usuário.
- Cada perfil deve acessar apenas suas funcionalidades permitidas.
- Senhas não devem ser armazenadas em texto puro.

### Entregas esperadas

```text
[x] Tela de login
[x] Serviço de autenticação no backend
[x] Token ou sessão configurada
[x] Rotas protegidas no frontend
[x] Endpoints protegidos no backend
[x] Usuário administrador inicial para teste
```

---

## 5.2 Módulo de Usuários

### Objetivo

Permitir ao administrador gerenciar os usuários do sistema.

### Casos de uso relacionados

- UC02 — Gerenciar Usuários.

### Funcionalidades

- cadastrar usuário;
- consultar usuários;
- editar usuário;
- desativar usuário;
- reativar usuário, se necessário;
- filtrar usuários por perfil;
- visualizar detalhes de usuário.

### Perfis envolvidos

| Perfil | Permissão |
|---|---|
| Administrador | Gerencia usuários |
| Docente | Não gerencia usuários |
| Discente | Não gerencia usuários |

### Entidades principais

```text
Usuario
Perfil
Administrador
Docente
Discente
```

### Entregas esperadas

```text
[ ] CRUD de usuários no backend
[ ] Telas de cadastro/listagem/edição no frontend
[ ] Validação de campos obrigatórios
[ ] Controle de perfil
[ ] Desativação lógica de usuário
```

---

## 5.3 Módulo de Disciplinas

### Objetivo

Permitir o gerenciamento das disciplinas da instituição.

### Casos de uso relacionados

- UC03 — Gerenciar Disciplinas.

### Funcionalidades

- cadastrar disciplina;
- consultar disciplinas;
- editar disciplina;
- desativar disciplina;
- visualizar detalhes da disciplina.

### Entidade principal

```text
Disciplina
```

### Campos sugeridos

```text
id
nome
codigo
cargaHoraria
ementa
ativa
```

### Entregas esperadas

```text
[ ] CRUD de disciplinas no backend
[ ] Telas de disciplinas no frontend
[ ] Validação de código/nome
[ ] Listagem para uso em turmas
```

---

## 5.4 Módulo de Turmas

### Objetivo

Permitir a criação e acompanhamento das turmas vinculadas a disciplinas e docentes.

### Casos de uso relacionados

- UC04 — Gerenciar Turmas.

### Funcionalidades

- cadastrar turma;
- consultar turmas;
- editar turma;
- desativar turma;
- vincular disciplina;
- vincular docente;
- permitir que docente consulte suas turmas.

### Entidades principais

```text
Turma
Disciplina
Docente
PeriodoLetivo
```

### Regras principais

- Toda turma deve estar vinculada a uma disciplina.
- Toda turma deve possuir pelo menos um docente responsável.
- Turmas devem estar associadas a um período letivo.

### Entregas esperadas

```text
[ ] CRUD de turmas no backend
[ ] Telas de turmas no frontend
[ ] Vínculo com disciplina
[ ] Vínculo com docente
[ ] Consulta de turmas do docente
```

---

## 5.5 Módulo de Matrículas

### Objetivo

Permitir que o administrador matricule discentes em turmas.

### Casos de uso relacionados

- UC05 — Matricular Discente em Turma.

### Funcionalidades

- matricular discente;
- consultar matrículas;
- cancelar matrícula;
- listar discentes por turma;
- listar turmas de um discente.

### Entidades principais

```text
Matricula
Discente
Turma
PeriodoLetivo
```

### Regras principais

- Um discente não pode ser matriculado duas vezes na mesma turma.
- A matrícula deve estar vinculada a uma turma válida.
- A matrícula deve estar vinculada a um discente ativo.
- O cancelamento não deve apagar o histórico acadêmico.

### Entregas esperadas

```text
[ ] Endpoint de matrícula
[ ] Tela para matricular discente
[ ] Validação de matrícula duplicada
[ ] Consulta de matriculados por turma
[ ] Consulta de turmas por discente
```

---

## 5.6 Módulo de Notas

### Objetivo

Permitir que docentes registrem e atualizem notas dos discentes nas turmas sob sua responsabilidade.

### Casos de uso relacionados

- UC06 — Registrar Notas;
- UC10 — Consultar Desempenho Acadêmico.

### Funcionalidades

- cadastrar avaliação;
- registrar nota;
- atualizar nota;
- consultar notas por turma;
- consultar notas por discente;
- calcular média, se definido pelo grupo.

### Entidades principais

```text
Avaliacao
Nota
Matricula
Turma
Docente
Discente
```

### Regras principais

- Somente o docente responsável pela turma pode lançar ou alterar notas.
- O discente só pode consultar suas próprias notas.
- O administrador pode consultar dados para fins de relatório.
- Notas devem estar associadas a uma matrícula e a uma avaliação.

### Entregas esperadas

```text
[ ] Cadastro de avaliações
[ ] Registro de notas
[ ] Tela docente para lançamento de notas
[ ] Tela discente para consulta de notas
[ ] Validação de vínculo entre docente e turma
```

---

## 5.7 Módulo de Frequência

### Objetivo

Permitir que docentes registrem frequência dos discentes e que discentes consultem sua situação.

### Casos de uso relacionados

- UC07 — Registrar Frequência;
- UC10 — Consultar Desempenho Acadêmico.

### Funcionalidades

- registrar presença/falta;
- atualizar frequência;
- consultar frequência por turma;
- consultar frequência por discente;
- calcular percentual de frequência.

### Entidades principais

```text
Frequencia
Matricula
Turma
Discente
Docente
```

### Regras principais

- Somente o docente responsável pela turma pode registrar frequência.
- O discente só pode consultar sua própria frequência.
- O percentual de frequência deve considerar presenças e carga horária total.
- Caso o percentual seja inferior ao mínimo definido, o sistema pode indicar reprovação por falta.

### Entregas esperadas

```text
[ ] Registro de frequência no backend
[ ] Tela docente para frequência
[ ] Tela discente para consulta
[ ] Cálculo percentual de frequência
[ ] Validação de vínculo entre docente e turma
```

---

## 5.8 Módulo de Materiais Didáticos

### Objetivo

Permitir que docentes disponibilizem materiais didáticos para suas turmas.

### Casos de uso relacionados

- UC08 — Gerenciar Materiais Didáticos.

### Funcionalidades

- cadastrar material;
- listar materiais por turma;
- editar material;
- remover ou desativar material;
- permitir acesso do discente aos materiais de suas turmas.

### Entidades principais

```text
MaterialDidatico
Turma
Docente
```

### Regras principais

- Docente só pode cadastrar material em turma vinculada a ele.
- Discente só pode acessar materiais das turmas em que está matriculado.
- O material pode ser inicialmente um link ou referência a arquivo.

### Entregas esperadas

```text
[ ] CRUD de materiais no backend
[ ] Tela docente para cadastrar material
[ ] Tela discente para acessar material
[ ] Validação de vínculo com turma
```

---

## 5.9 Módulo de Atividades

### Objetivo

Permitir que docentes cadastrem atividades e acompanhem entregas dos discentes.

### Casos de uso relacionados

- UC09 — Gerenciar Atividades;
- UC11 — Enviar Atividade.

### Funcionalidades

- cadastrar atividade;
- editar atividade;
- listar atividades por turma;
- definir prazo de entrega;
- permitir envio de atividade pelo discente;
- listar entregas por atividade;
- consultar entregas do discente.

### Entidades principais

```text
Atividade
EntregaAtividade
Turma
Docente
Discente
```

### Regras principais

- Docente só pode cadastrar atividade em turma vinculada a ele.
- Discente só pode enviar atividade de turma em que está matriculado.
- O sistema deve registrar data e hora da entrega.
- O sistema deve tratar entrega fora do prazo, se essa regra for implementada.

### Entregas esperadas

```text
[ ] Cadastro de atividades
[ ] Tela docente de atividades
[ ] Tela discente de atividades
[ ] Envio de atividade
[ ] Consulta de entregas
```

---

## 5.10 Módulo de Desempenho Acadêmico

### Objetivo

Permitir que o discente consulte sua situação acadêmica de forma centralizada.

### Casos de uso relacionados

- UC10 — Consultar Desempenho Acadêmico.

### Funcionalidades

- consultar disciplinas/turmas matriculadas;
- consultar notas;
- consultar frequência;
- consultar média;
- consultar situação final, se disponível.

### Regras principais

- Discente só pode visualizar seus próprios dados.
- Dados de notas e frequência são sensíveis e devem respeitar controle de acesso.

### Entregas esperadas

```text
[ ] Endpoint de desempenho acadêmico
[ ] Tela de desempenho do discente
[ ] Integração com notas
[ ] Integração com frequência
[ ] Validação de privacidade
```

---

## 5.11 Módulo de Relatórios

### Objetivo

Permitir a emissão de relatórios acadêmicos para acompanhamento administrativo.

### Casos de uso relacionados

- UC12 — Gerar Relatórios Acadêmicos.

### Funcionalidades

- gerar boletim;
- gerar diário de classe;
- gerar relatório de turma;
- gerar relatório de frequência;
- gerar relatório de notas.

### Perfis envolvidos

| Perfil | Permissão |
|---|---|
| Administrador | Pode gerar relatórios acadêmicos |
| Docente | Pode consultar relatórios das próprias turmas, se definido pelo grupo |
| Discente | Pode consultar apenas seu próprio desempenho |

### Entregas esperadas

```text
[ ] Relatório de turma
[ ] Relatório de notas
[ ] Relatório de frequência
[ ] Boletim do discente
[ ] Tela de relatórios
```

Observação: a primeira versão pode gerar relatórios em tela. Exportação em PDF pode ser tratada como melhoria se houver tempo.

---

## 6. Estrutura sugerida do repositório

```text
sge/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── database/
│   ├── migrations/
│   ├── seed.sql
│   └── README.md
│
├── docs/
│   ├── requisitos/
│   ├── arquitetura/
│   ├── api/
│   ├── testes/
│   ├── prints/
│   └── apresentacao/
│
└── README.md
```

---

## 7. Estrutura sugerida do backend

```text
backend/src/main/java/br/ufs/sge/
├── auth/
├── usuario/
├── academico/
│   ├── disciplina/
│   ├── turma/
│   ├── matricula/
│   ├── nota/
│   └── frequencia/
├── ava/
│   ├── material/
│   ├── atividade/
│   └── entrega/
├── relatorio/
├── shared/
│   ├── exception/
│   ├── dto/
│   └── validation/
└── config/
```

Cada módulo deve seguir o padrão:

```text
Controller → Service → Repository → Banco de Dados
```

### Responsabilidades

| Camada | Responsabilidade |
|---|---|
| Controller | Receber requisições e devolver respostas |
| Service | Aplicar regras de negócio |
| Repository | Acessar o banco de dados |
| Model/Entity | Representar entidades persistentes |
| DTO | Transportar dados entre API e cliente |
| Exception | Tratar erros de forma padronizada |

---

## 8. Estrutura sugerida do frontend

```text
frontend/src/
├── components/
├── pages/
│   ├── auth/
│   ├── usuarios/
│   ├── disciplinas/
│   ├── turmas/
│   ├── matriculas/
│   ├── notas/
│   ├── frequencias/
│   ├── materiais/
│   ├── atividades/
│   ├── desempenho/
│   └── relatorios/
├── services/
├── routes/
├── contexts/
├── hooks/
├── styles/
└── utils/
```

### Responsabilidades

| Pasta | Responsabilidade |
|---|---|
| components | Componentes reutilizáveis |
| pages | Telas principais do sistema |
| services | Comunicação com a API |
| routes | Rotas públicas e privadas |
| contexts | Estado global, autenticação e usuário logado |
| hooks | Lógicas reutilizáveis |
| styles | Estilos globais e específicos |
| utils | Funções auxiliares |

---

## 9. Banco de dados — entidades mínimas

As entidades mínimas previstas para a primeira versão funcional são:

```text
Usuario
Perfil
Disciplina
Turma
PeriodoLetivo
Matricula
Avaliacao
Nota
Frequencia
MaterialDidatico
Atividade
EntregaAtividade
```

### Relacionamentos principais

```text
Usuario possui um Perfil.
Docente é um usuário com perfil DOCENTE.
Discente é um usuário com perfil DISCENTE.
Administrador é um usuário com perfil ADMINISTRADOR.
Disciplina possui várias Turmas.
Turma pertence a uma Disciplina.
Turma possui um ou mais Docentes responsáveis.
Discente realiza Matrícula em Turma.
Matrícula liga Discente e Turma.
Nota pertence a uma Matrícula e a uma Avaliação.
Frequência pertence a uma Matrícula.
Material Didático pertence a uma Turma.
Atividade pertence a uma Turma.
Entrega de Atividade pertence a uma Atividade e a um Discente.
```

---

## 10. Ordem geral de desenvolvimento

A ordem abaixo evita retrabalho e respeita as dependências entre módulos.

### Etapa 1 — Preparação do projeto

```text
[ ] Criar repositório GitHub
[ ] Criar estrutura de pastas
[ ] Criar projeto backend
[ ] Criar projeto frontend
[ ] Configurar banco de dados
[ ] Definir padrão de commits
[ ] Definir branches
[ ] Criar README inicial
[ ] Criar quadro de tarefas
```

### Etapa 2 — Base visual e base técnica

```text
[ ] Layout inicial do frontend
[ ] Menu lateral ou superior
[ ] Página inicial por perfil
[ ] Configuração da API no frontend
[ ] Configuração de CORS no backend
[ ] Tratamento global de erros
[ ] Padronização de respostas da API
```

### Etapa 3 — Acesso e segurança

```text
[ ] Login
[ ] Logout
[ ] Usuário logado
[ ] Controle de perfil
[ ] Rotas privadas no frontend
[ ] Endpoints protegidos no backend
[ ] Seed com usuários de teste
```

### Etapa 4 — Usuários

```text
[ ] Cadastro de usuário
[ ] Listagem de usuários
[ ] Edição de usuário
[ ] Desativação de usuário
[ ] Filtro por perfil
[ ] Validação de permissões
```

### Etapa 5 — Disciplinas

```text
[ ] Cadastro de disciplina
[ ] Listagem de disciplinas
[ ] Edição de disciplina
[ ] Desativação de disciplina
[ ] Validações básicas
```

### Etapa 6 — Turmas

```text
[ ] Cadastro de turma
[ ] Listagem de turmas
[ ] Edição de turma
[ ] Vínculo com disciplina
[ ] Vínculo com docente
[ ] Consulta de turmas do docente
```

### Etapa 7 — Matrículas

```text
[ ] Matricular discente em turma
[ ] Impedir matrícula duplicada
[ ] Listar matriculados por turma
[ ] Listar turmas do discente
[ ] Cancelar matrícula
```

### Etapa 8 — Notas

```text
[ ] Criar avaliação
[ ] Lançar nota
[ ] Editar nota
[ ] Consultar notas por turma
[ ] Consultar notas do discente
[ ] Calcular média, se definido
```

### Etapa 9 — Frequência

```text
[ ] Registrar presença/falta
[ ] Editar frequência
[ ] Consultar frequência por turma
[ ] Consultar frequência do discente
[ ] Calcular percentual de frequência
```

### Etapa 10 — Materiais didáticos

```text
[ ] Cadastrar material
[ ] Listar materiais por turma
[ ] Editar material
[ ] Remover/desativar material
[ ] Discente acessar materiais das próprias turmas
```

### Etapa 11 — Atividades e entregas

```text
[ ] Cadastrar atividade
[ ] Listar atividades por turma
[ ] Editar atividade
[ ] Enviar atividade
[ ] Consultar entregas
[ ] Registrar data/hora de entrega
```

### Etapa 12 — Desempenho acadêmico

```text
[ ] Tela de desempenho do discente
[ ] Consulta de notas
[ ] Consulta de frequência
[ ] Consulta de turmas/disciplinas
[ ] Situação acadêmica resumida
```

### Etapa 13 — Relatórios

```text
[ ] Boletim
[ ] Diário de classe
[ ] Relatório de turma
[ ] Relatório de notas
[ ] Relatório de frequência
```

### Etapa 14 — Integração geral

```text
[ ] Integrar todas as telas com a API
[ ] Verificar permissões por perfil
[ ] Corrigir erros de navegação
[ ] Corrigir erros de validação
[ ] Revisar dados exibidos
```

### Etapa 15 — Testes

```text
[ ] Testar login
[ ] Testar permissões
[ ] Testar CRUDs
[ ] Testar matrícula duplicada
[ ] Testar lançamento de notas
[ ] Testar registro de frequência
[ ] Testar envio de atividade
[ ] Testar relatórios
[ ] Registrar evidências com prints
```

### Etapa 16 — Deploy e apresentação

```text
[ ] Preparar ambiente final
[ ] Configurar variáveis de ambiente
[ ] Criar dados de demonstração
[ ] Atualizar README
[ ] Registrar instruções de execução
[ ] Preparar roteiro de apresentação
[ ] Realizar ensaio da apresentação
```

---

## 11. Divisão sugerida do grupo

A equipe pode ser organizada por responsabilidade, sem impedir colaboração entre membros.

| Papel | Responsabilidades |
|---|---|
| Coordenação/Integração | Organizar tarefas, revisar entregas, manter alinhamento com documentação |
| Backend | API, regras de negócio, segurança, persistência e integração com banco |
| Frontend | Telas, rotas, componentes, consumo da API e usabilidade |
| Banco de Dados | Modelo físico, migrations, seeds, integridade e consultas |
| QA/Testes | Testes funcionais, testes de integração, bugs e evidências |
| Documentação/Apresentação | README, instruções de execução, prints, roteiro e material final |

Observação: mesmo que cada pessoa tenha uma responsabilidade principal, todos devem revisar código e entender o fluxo geral do sistema para evitar dependência de uma única pessoa.

---

## 12. Fluxo de trabalho com Git

### Branches sugeridas

```text
main
└── develop
    ├── feature/auth
    ├── feature/usuarios
    ├── feature/disciplinas
    ├── feature/turmas
    ├── feature/matriculas
    ├── feature/notas
    ├── feature/frequencia
    ├── feature/ava
    └── feature/relatorios
```

### Regras de uso

```text
[ ] Nunca desenvolver direto na main
[ ] Criar branch para cada módulo ou tarefa
[ ] Fazer commits pequenos e claros
[ ] Abrir pull request antes de juntar na develop
[ ] Revisar código antes de aceitar pull request
[ ] Testar antes de fazer merge
```

### Padrão de commits sugerido

```text
feat: adiciona cadastro de usuários
fix: corrige validação de login
docs: atualiza README
refactor: reorganiza service de matrícula
test: adiciona testes de frequência
style: ajusta layout da tela de turmas
```

---

## 13. Critérios de pronto por funcionalidade

Uma funcionalidade só deve ser considerada pronta quando cumprir todos os itens abaixo.

```text
[ ] Tela implementada, quando aplicável
[ ] Endpoint implementado, quando aplicável
[ ] Regra de negócio implementada no service
[ ] Persistência funcionando
[ ] Validações obrigatórias implementadas
[ ] Controle de acesso por perfil aplicado
[ ] Erros tratados de forma compreensível
[ ] Teste manual realizado
[ ] Evidência registrada com print ou descrição
[ ] Código revisado por outro membro
[ ] README ou documentação atualizada, se necessário
```

---

## 14. Critérios de qualidade

Durante o desenvolvimento, o grupo deve observar:

### Segurança

- senha com hash;
- controle por perfil;
- rotas protegidas;
- endpoints protegidos;
- discente não acessa dados de outro discente;
- docente não altera dados de turma que não é sua.

### Integridade

- evitar matrícula duplicada;
- validar vínculos entre turma, disciplina e docente;
- validar vínculos entre matrícula, nota e frequência;
- não apagar histórico acadêmico indevidamente.

### Manutenibilidade

- separar controller, service, repository e entity;
- evitar regra de negócio no frontend;
- evitar regra de negócio no controller;
- manter nomes consistentes com a documentação;
- padronizar DTOs e respostas.

### Usabilidade

- telas simples;
- mensagens claras;
- formulários objetivos;
- navegação por perfil;
- feedback visual para erros e sucessos.

### Testabilidade

- casos de uso testáveis;
- dados de teste padronizados;
- endpoints documentados;
- prints de evidência;
- roteiro de demonstração.

---

## 15. Roteiro recomendado de demonstração

Para apresentar o sistema de forma coerente, o grupo pode seguir este roteiro:

```text
1. Login como Administrador
2. Cadastrar Docente
3. Cadastrar Discente
4. Cadastrar Disciplina
5. Cadastrar Turma
6. Vincular Docente à Turma
7. Matricular Discente na Turma
8. Login como Docente
9. Consultar Minhas Turmas
10. Registrar Nota
11. Registrar Frequência
12. Cadastrar Material Didático
13. Cadastrar Atividade
14. Login como Discente
15. Consultar Notas
16. Consultar Frequência
17. Acessar Material
18. Enviar Atividade
19. Login como Administrador
20. Gerar Relatório Acadêmico
```

Esse fluxo demonstra os principais casos de uso e evidencia a integração entre frontend, backend, banco de dados e regras de acesso.

---

## 16. Priorização para entrega mínima funcional

Caso o prazo fique apertado, priorizar o seguinte MVP:

```text
[ ] Login com perfis
[ ] CRUD de usuários
[ ] CRUD de disciplinas
[ ] CRUD de turmas
[ ] Matrícula de discente
[ ] Registro de notas
[ ] Registro de frequência
[ ] Consulta de desempenho pelo discente
[ ] Relatório simples de turma ou boletim
```

Funcionalidades que podem ficar como melhoria, se necessário:

```text
[ ] Recuperação de senha
[ ] Exportação de relatório em PDF
[ ] Upload real de arquivos
[ ] Notificações
[ ] Dashboard avançado
[ ] Filtros complexos
[ ] Histórico detalhado de alterações
```

---

## 17. O que evitar durante o desenvolvimento

Para manter o projeto dentro do escopo, evitar:

- criar funcionalidades não documentadas antes do core funcionar;
- desenvolver microsserviços;
- criar app mobile;
- criar chat interno;
- criar fórum complexo;
- criar financeiro completo;
- iniciar relatórios avançados antes de notas, frequência e matrícula;
- misturar regra de negócio no frontend;
- deixar endpoints sem controle de perfil;
- usar dados reais na fase de teste.

---

## 18. Checklist final da entrega

```text
[ ] Sistema executa localmente
[ ] Frontend executa sem erro
[ ] Backend executa sem erro
[ ] Banco conecta corretamente
[ ] Usuários de teste disponíveis
[ ] Login funcionando
[ ] Perfis funcionando
[ ] Casos de uso principais funcionando
[ ] README atualizado
[ ] Endpoints documentados
[ ] Prints das telas principais salvos
[ ] Testes manuais documentados
[ ] Roteiro de apresentação pronto
[ ] Grupo realizou ensaio da demonstração
```

---

## 19. Resumo das etapas

```text
1. Preparar ambiente e repositório
2. Implementar base técnica do frontend, backend e banco
3. Implementar autenticação e perfis
4. Implementar usuários
5. Implementar disciplinas
6. Implementar turmas
7. Implementar matrículas
8. Implementar notas
9. Implementar frequência
10. Implementar materiais didáticos
11. Implementar atividades e entregas
12. Implementar desempenho acadêmico
13. Implementar relatórios
14. Integrar frontend, backend e banco
15. Testar casos de uso
16. Corrigir bugs
17. Documentar execução e evidências
18. Preparar deploy e apresentação
```

---

## 20. Observação final

O grupo deve manter o desenvolvimento fiel à documentação. O objetivo não é criar o maior sistema possível, mas entregar um SGE coerente, funcional, rastreável e alinhado aos requisitos, casos de uso, arquitetura em camadas, controle de acesso por perfil e regras acadêmicas documentadas.
