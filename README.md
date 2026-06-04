
# SGE — Plano de Desenvolvimento do Software

Este documento organiza as etapas de desenvolvimento do **Sistema de Gerenciamento Escolar (SGE)** para orientar o grupo durante a implementação. O objetivo é manter o desenvolvimento coerente com a documentação de requisitos, análise, arquitetura e plano de projeto.

---

## 1. Objetivo do desenvolvimento

Desenvolver uma aplicação web centralizada para gestão acadêmica, contemplando autenticação, controle de acesso por perfil, gerenciamento de usuários, disciplinas, turmas, matrículas, notas, frequência, materiais didáticos, atividades, entregas e relatórios acadêmicos.

O desenvolvimento deve respeitar os seguintes pontos definidos na documentação:

- aplicação web centralizada;
- separação entre frontend, backend e banco de dados;
- backend organizado em camadas;
- monólito modular;
- controle de acesso por perfil;
- persistência em banco relacional;
- rastreabilidade entre requisitos, casos de uso, classes, módulos e implementação;
- foco inicial no backend.

---

## 2. Escopo funcional do SGE

O sistema será desenvolvido com base nos seguintes módulos principais:

| Módulo | Responsabilidade |
|---|---|
| Acesso e Segurança | Login, autenticação, autorização, JWT e controle por perfil |
| Usuários | Cadastro, consulta, edição e desativação de administradores, docentes e discentes |
| Gestão Acadêmica | Disciplinas, turmas, períodos letivos e vínculos com docentes |
| Matrículas | Matrícula de discentes em turmas e controle de duplicidade |
| Notas | Registro, atualização e consulta de notas |
| Frequência | Registro, atualização, consulta e cálculo de frequência |
| AVA | Materiais didáticos, atividades e entregas dos discentes |
| Relatórios | Boletins, diários de classe e relatórios acadêmicos |
| Persistência | Repositories, entidades, migrations e integridade dos dados |
| Implantação | Configuração de ambiente, banco, deploy e documentação final |

---

## 3. Stack tecnológica recomendada

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Bean Validation
- Lombok
- PostgreSQL Driver
- Flyway Migration
- Maven

### Banco de dados

- PostgreSQL
- Migrations com Flyway
- Dados iniciais com seed para testes

### Frontend, para etapa posterior

- React
- TypeScript
- React Router
- Axios
- Context API ou solução equivalente para autenticação

### Ferramentas de apoio

- Git e GitHub
- Postman ou Insomnia
- Draw.io, Figma ou ferramenta equivalente para apoio visual
- README técnico no repositório
- Issues ou Project Board para controle de tarefas

---

## 4. Arquitetura geral

O SGE deve ser implementado como **monólito modular**, ou seja, uma aplicação backend única, mas organizada internamente por módulos.

A arquitetura deve seguir a separação:

```text
Controller → Service → Repository → Banco de Dados
```

Responsabilidades:

| Camada | Responsabilidade |
|---|---|
| Controller | Receber requisições HTTP e devolver respostas |
| Service | Concentrar regras de negócio |
| Repository | Acessar o banco de dados |
| Model/Entity | Representar entidades persistentes |
| DTO | Transportar dados entre API e cliente |
| Security | Autenticação, autorização e filtros |
| Exception | Tratamento padronizado de erros |

Regra importante: **Controller não deve conter regra de negócio**. Toda regra deve ficar no Service.

---

## 5. Estrutura inicial do repositório

```text
sge/
├── backend/
│   ├── src/main/java/br/ufs/sge/
│   │   ├── SgeApplication.java
│   │   ├── auth/
│   │   ├── usuario/
│   │   ├── academico/
│   │   ├── ava/
│   │   ├── relatorio/
│   │   ├── shared/
│   │   └── config/
│   │
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/
│   │
│   └── pom.xml
│
├── frontend/
│   └── README.md
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── api/
│   ├── testes/
│   ├── prints/
│   └── apresentacao/
│
└── README.md
```

---

## 6. Estrutura recomendada do backend

```text
backend/src/main/java/br/ufs/sge/
├── auth/
│   ├── controller/
│   ├── dto/
│   ├── service/
│   └── security/
│
├── usuario/
│   ├── controller/
│   ├── dto/
│   ├── model/
│   ├── repository/
│   └── service/
│
├── academico/
│   ├── disciplina/
│   ├── turma/
│   ├── matricula/
│   ├── nota/
│   └── frequencia/
│
├── ava/
│   ├── material/
│   ├── atividade/
│   └── entrega/
│
├── relatorio/
│   ├── controller/
│   ├── dto/
│   └── service/
│
├── shared/
│   ├── exception/
│   ├── dto/
│   └── validation/
│
└── config/
```

---

## 7. Ordem geral de desenvolvimento

A implementação deve seguir esta ordem:

```text
1. Setup do projeto
2. Backend base
3. Autenticação e segurança
4. Usuários
5. Disciplinas
6. Turmas
7. Matrículas
8. Notas
9. Frequência
10. AVA: materiais, atividades e entregas
11. Relatórios
12. Integração com frontend
13. Testes
14. Deploy
15. Documentação final e apresentação
```

Como decisão do grupo, iniciaremos pelo **backend**.

---

# 8. Etapas detalhadas do backend

## Etapa 0 — Preparação do ambiente

Objetivo: deixar o ambiente pronto para desenvolvimento.

### Tarefas

- [ ] Criar repositório no GitHub.
- [ ] Criar branch principal `main`.
- [ ] Criar branch de desenvolvimento `develop`.
- [ ] Definir padrão de branches.
- [ ] Criar projeto Spring Boot.
- [ ] Configurar Java 21.
- [ ] Configurar Maven.
- [ ] Configurar PostgreSQL.
- [ ] Criar banco `sge_db`.
- [ ] Configurar `application.yml`.
- [ ] Testar conexão com banco.
- [ ] Criar estrutura de pacotes.
- [ ] Criar README inicial do backend.

### Entrega esperada

Backend subindo localmente, conectado ao PostgreSQL e com estrutura inicial pronta.

---

## Etapa 1 — Base comum do backend

Objetivo: criar elementos usados por todos os módulos.

### Tarefas

- [ ] Criar classe principal `SgeApplication`.
- [ ] Criar pacote `shared.exception`.
- [ ] Criar tratamento global de exceções com `@RestControllerAdvice`.
- [ ] Criar DTO padrão para respostas de erro.
- [ ] Criar DTO padrão para mensagens simples.
- [ ] Configurar validação com Bean Validation.
- [ ] Configurar CORS.
- [ ] Criar primeira migration do banco.

### Entrega esperada

API com tratamento de erros padronizado e pronta para receber os módulos funcionais.

---

## Etapa 2 — Usuário, perfil e segurança base

Objetivo: criar a base de usuários do sistema.

### Entidades iniciais

```text
Usuario
Perfil
```

### Perfis

```text
ADMINISTRADOR
DOCENTE
DISCENTE
```

### Campos mínimos de Usuario

```text
id
nome
email
senha
perfil
ativo
createdAt
updatedAt
```

### Tarefas

- [ ] Criar enum `Perfil`.
- [ ] Criar entidade `Usuario`.
- [ ] Criar tabela `usuarios`.
- [ ] Criar `UsuarioRepository`.
- [ ] Criar migration para usuários.
- [ ] Criar seed com usuário administrador inicial.
- [ ] Configurar hash de senha com BCrypt.

### Entrega esperada

Usuários persistidos no banco e administrador inicial criado para login.

---

## Etapa 3 — Autenticação e autorização

Objetivo: permitir login e controle de acesso por perfil.

### Pacote

```text
auth/
├── controller/
├── dto/
├── service/
└── security/
```

### Classes sugeridas

```text
AuthController
AuthService
LoginRequest
LoginResponse
UsuarioLogadoResponse
JwtService
JwtAuthenticationFilter
SecurityConfig
```

### Endpoints

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/auth/login` | Realizar login | Público |
| GET | `/api/auth/me` | Retornar usuário logado | Autenticado |
| POST | `/api/auth/logout` | Encerrar sessão | Autenticado |

### Regras

- [ ] O login deve validar e-mail e senha.
- [ ] A senha deve ser comparada com BCrypt.
- [ ] O token JWT deve conter id, e-mail e perfil do usuário.
- [ ] Usuários inativos não podem acessar o sistema.
- [ ] Rotas internas devem exigir autenticação.
- [ ] Rotas administrativas devem exigir perfil `ADMINISTRADOR`.

### Entrega esperada

Login funcionando no Postman/Insomnia e retornando JWT válido.

---

## Etapa 4 — Gestão de usuários

Objetivo: permitir que o administrador gerencie usuários.

### Pacote

```text
usuario/
├── controller/
├── dto/
├── model/
├── repository/
└── service/
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/usuarios` | Cadastrar usuário | Administrador |
| GET | `/api/usuarios` | Listar usuários | Administrador |
| GET | `/api/usuarios/{id}` | Buscar usuário por ID | Administrador |
| PUT | `/api/usuarios/{id}` | Atualizar usuário | Administrador |
| PATCH | `/api/usuarios/{id}/desativar` | Desativar usuário | Administrador |
| PATCH | `/api/usuarios/{id}/ativar` | Ativar usuário | Administrador |

### Regras

- [ ] E-mail deve ser único.
- [ ] Senha deve ser criptografada.
- [ ] Perfil deve ser obrigatório.
- [ ] Usuário não deve ser excluído fisicamente; usar desativação lógica.
- [ ] Apenas administrador pode gerenciar usuários.

### Entrega esperada

CRUD de usuários funcional e protegido por perfil.

---

## Etapa 5 — Gestão de disciplinas

Objetivo: permitir cadastro e manutenção de disciplinas.

### Pacote

```text
academico/disciplina/
```

### Entidade Disciplina

Campos mínimos:

```text
id
nome
codigo
cargaHoraria
ementa
ativa
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/disciplinas` | Cadastrar disciplina | Administrador |
| GET | `/api/disciplinas` | Listar disciplinas | Administrador/Docente |
| GET | `/api/disciplinas/{id}` | Buscar disciplina | Administrador/Docente |
| PUT | `/api/disciplinas/{id}` | Atualizar disciplina | Administrador |
| PATCH | `/api/disciplinas/{id}/desativar` | Desativar disciplina | Administrador |

### Regras

- [ ] Código da disciplina deve ser único.
- [ ] Carga horária deve ser positiva.
- [ ] Disciplina inativa não deve ser usada em novas turmas.

### Entrega esperada

CRUD de disciplinas funcional.

---

## Etapa 6 — Gestão de turmas

Objetivo: permitir criação de turmas vinculadas a disciplina, período letivo e docente.

### Pacote

```text
academico/turma/
```

### Entidade Turma

Campos mínimos:

```text
id
codigo
disciplina
docenteResponsavel
ano
semestre
ativa
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/turmas` | Cadastrar turma | Administrador |
| GET | `/api/turmas` | Listar turmas | Administrador |
| GET | `/api/turmas/{id}` | Buscar turma | Administrador/Docente |
| PUT | `/api/turmas/{id}` | Atualizar turma | Administrador |
| PATCH | `/api/turmas/{id}/desativar` | Desativar turma | Administrador |
| GET | `/api/turmas/minhas` | Listar turmas do docente logado | Docente |

### Regras

- [ ] Toda turma deve estar vinculada a uma disciplina.
- [ ] Toda turma deve possuir docente responsável.
- [ ] Docente só pode consultar turmas às quais está vinculado.
- [ ] Disciplina inativa não pode receber nova turma.

### Entrega esperada

Turmas cadastradas e vinculadas corretamente a docentes e disciplinas.

---

## Etapa 7 — Matrículas

Objetivo: permitir matrícula de discentes em turmas.

### Pacote

```text
academico/matricula/
```

### Entidade Matricula

Campos mínimos:

```text
id
discente
turma
status
dataMatricula
```

### Status sugeridos

```text
ATIVA
CANCELADA
CONCLUIDA
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/matriculas` | Matricular discente | Administrador |
| GET | `/api/matriculas` | Listar matrículas | Administrador |
| GET | `/api/matriculas/turma/{turmaId}` | Listar matrículas da turma | Administrador/Docente |
| GET | `/api/matriculas/discente/{discenteId}` | Listar matrículas do discente | Administrador/Discente |
| PATCH | `/api/matriculas/{id}/cancelar` | Cancelar matrícula | Administrador |

### Regras

- [ ] Um discente não pode ser matriculado duas vezes na mesma turma.
- [ ] Apenas usuário com perfil `DISCENTE` pode ser matriculado.
- [ ] Turma inativa não pode receber matrícula.
- [ ] Docente só pode consultar matrículas das próprias turmas.
- [ ] Discente só pode consultar suas próprias matrículas.

### Entrega esperada

Matrícula funcional com validação de duplicidade e controle de acesso.

---

## Etapa 8 — Notas

Objetivo: permitir que docentes registrem e atualizem notas.

### Pacote

```text
academico/nota/
```

### Entidades

```text
Avaliacao
Nota
```

### Avaliacao — campos mínimos

```text
id
turma
nome
data
peso
```

### Nota — campos mínimos

```text
id
matricula
avaliacao
valor
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/avaliacoes` | Criar avaliação | Docente |
| GET | `/api/avaliacoes/turma/{turmaId}` | Listar avaliações da turma | Docente |
| POST | `/api/notas` | Registrar nota | Docente |
| PUT | `/api/notas/{id}` | Atualizar nota | Docente |
| GET | `/api/notas/matricula/{matriculaId}` | Consultar notas por matrícula | Administrador/Docente/Discente |
| GET | `/api/notas/minhas` | Consultar minhas notas | Discente |

### Regras

- [ ] Somente docente vinculado à turma pode lançar ou alterar notas.
- [ ] Nota deve estar associada a uma matrícula válida.
- [ ] Nota deve estar associada a uma avaliação válida.
- [ ] Valor da nota deve respeitar faixa definida pelo sistema.
- [ ] Discente só pode consultar as próprias notas.

### Entrega esperada

Registro de notas funcional com proteção por vínculo docente-turma.

---

## Etapa 9 — Frequência

Objetivo: permitir registro e consulta de frequência.

### Pacote

```text
academico/frequencia/
```

### Entidade Frequencia

Campos mínimos:

```text
id
matricula
dataAula
presente
quantidadeAulas
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/frequencias` | Registrar frequência | Docente |
| PUT | `/api/frequencias/{id}` | Atualizar frequência | Docente |
| GET | `/api/frequencias/matricula/{matriculaId}` | Consultar frequência da matrícula | Administrador/Docente/Discente |
| GET | `/api/frequencias/minhas` | Consultar minha frequência | Discente |

### Regras

- [ ] Somente docente vinculado à turma pode registrar frequência.
- [ ] Frequência deve estar associada a matrícula ativa.
- [ ] Discente só pode consultar a própria frequência.
- [ ] Percentual de frequência deve ser calculado com base nas presenças e carga horária.
- [ ] Frequência inferior a 75% indica reprovação por falta.

### Entrega esperada

Registro e cálculo básico de frequência funcionando.

---

## Etapa 10 — AVA: materiais didáticos

Objetivo: permitir que docentes disponibilizem materiais para suas turmas.

### Pacote

```text
ava/material/
```

### Entidade MaterialDidatico

Campos mínimos:

```text
id
turma
titulo
descricao
urlArquivoOuLink
dataPublicacao
ativo
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/materiais` | Cadastrar material | Docente |
| GET | `/api/materiais/turma/{turmaId}` | Listar materiais da turma | Docente/Discente |
| PUT | `/api/materiais/{id}` | Atualizar material | Docente |
| PATCH | `/api/materiais/{id}/desativar` | Desativar material | Docente |

### Regras

- [ ] Docente só pode cadastrar material em turma vinculada a ele.
- [ ] Discente só pode visualizar materiais das turmas em que está matriculado.
- [ ] O primeiro MVP pode usar links de arquivos em vez de upload real.

### Entrega esperada

Materiais didáticos disponíveis por turma.

---

## Etapa 11 — AVA: atividades e entregas

Objetivo: permitir cadastro de atividades e envio de entregas pelos discentes.

### Pacotes

```text
ava/atividade/
ava/entrega/
```

### Entidade Atividade

Campos mínimos:

```text
id
turma
titulo
descricao
dataAbertura
dataLimite
ativa
```

### Entidade EntregaAtividade

Campos mínimos:

```text
id
atividade
discente
textoResposta
urlArquivoOuLink
dataEntrega
status
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/api/atividades` | Cadastrar atividade | Docente |
| GET | `/api/atividades/turma/{turmaId}` | Listar atividades da turma | Docente/Discente |
| PUT | `/api/atividades/{id}` | Atualizar atividade | Docente |
| POST | `/api/entregas` | Enviar atividade | Discente |
| GET | `/api/entregas/atividade/{atividadeId}` | Listar entregas da atividade | Docente |
| GET | `/api/entregas/minhas` | Listar minhas entregas | Discente |

### Regras

- [ ] Docente só pode criar atividade em turma vinculada a ele.
- [ ] Discente só pode enviar atividade de turma em que está matriculado.
- [ ] Sistema deve registrar data e hora da entrega.
- [ ] Entrega após prazo deve ser marcada como atrasada ou recusada, conforme regra definida pelo grupo.

### Entrega esperada

Atividades e entregas funcionando no backend.

---

## Etapa 12 — Relatórios acadêmicos

Objetivo: consolidar dados acadêmicos para consulta administrativa.

### Pacote

```text
relatorio/
```

### DTOs sugeridos

```text
BoletimDTO
DiarioClasseDTO
RelatorioTurmaDTO
RelatorioFrequenciaDTO
RelatorioNotasDTO
```

### Endpoints

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| GET | `/api/relatorios/boletim/{discenteId}` | Gerar boletim do discente | Administrador |
| GET | `/api/relatorios/turma/{turmaId}` | Gerar relatório da turma | Administrador |
| GET | `/api/relatorios/diario-classe/{turmaId}` | Gerar diário de classe | Administrador/Docente |
| GET | `/api/relatorios/frequencia/{turmaId}` | Gerar relatório de frequência | Administrador |
| GET | `/api/relatorios/notas/{turmaId}` | Gerar relatório de notas | Administrador |

### Regras

- [ ] Relatórios devem consultar dados já existentes.
- [ ] Não começar relatórios antes de matrícula, nota e frequência estarem funcionando.
- [ ] Primeiro gerar resposta JSON.
- [ ] Exportação PDF pode ser incremento posterior.

### Entrega esperada

Relatórios principais disponíveis em JSON para integração com frontend.

---

# 9. Etapas do frontend

O frontend deve começar após o backend ter, no mínimo, login, usuários, disciplinas, turmas e matrículas em funcionamento.

## Etapa Frontend 1 — Setup

- [ ] Criar projeto React.
- [ ] Configurar TypeScript.
- [ ] Configurar rotas.
- [ ] Configurar Axios.
- [ ] Criar layout base.
- [ ] Criar menu por perfil.

## Etapa Frontend 2 — Autenticação

- [ ] Tela de login.
- [ ] Armazenamento do token.
- [ ] Rota protegida.
- [ ] Logout.
- [ ] Redirecionamento por perfil.

## Etapa Frontend 3 — Telas administrativas

- [ ] Painel do administrador.
- [ ] Gerenciamento de usuários.
- [ ] Gerenciamento de disciplinas.
- [ ] Gerenciamento de turmas.
- [ ] Matrícula de discentes.
- [ ] Relatórios.

## Etapa Frontend 4 — Telas do docente

- [ ] Painel do docente.
- [ ] Minhas turmas.
- [ ] Registro de notas.
- [ ] Registro de frequência.
- [ ] Materiais didáticos.
- [ ] Atividades.
- [ ] Entregas recebidas.

## Etapa Frontend 5 — Telas do discente

- [ ] Painel do discente.
- [ ] Minhas turmas.
- [ ] Minhas notas.
- [ ] Minha frequência.
- [ ] Materiais disponíveis.
- [ ] Atividades disponíveis.
- [ ] Envio de atividade.

---

# 10. Critérios de pronto por funcionalidade

Uma funcionalidade só deve ser considerada pronta quando cumprir todos os itens abaixo:

```text
[ ] Endpoint implementado
[ ] Service implementado
[ ] Repository implementado
[ ] DTOs criados
[ ] Validações implementadas
[ ] Controle de acesso aplicado
[ ] Tratamento de erro implementado
[ ] Testado no Postman/Insomnia
[ ] Registrado no README da API
[ ] Revisado por outro membro
[ ] Merge realizado na branch develop
```

Para telas frontend, usar:

```text
[ ] Tela criada
[ ] Integração com API realizada
[ ] Validação de formulário implementada
[ ] Tratamento de erro exibido ao usuário
[ ] Teste manual realizado
[ ] Print salvo em docs/prints
[ ] Revisão feita por outro membro
```

---

# 11. Padrão de branches

Sugestão:

```text
main        → versão estável
 develop    → versão em desenvolvimento
 feature/*  → novas funcionalidades
 fix/*      → correções
 docs/*     → documentação
```

Exemplos:

```text
feature/auth-login
feature/crud-usuarios
feature/crud-disciplinas
feature/matriculas
feature/notas
feature/frequencia
feature/ava-atividades
fix/validacao-matricula-duplicada
docs/api-endpoints
```

---

# 12. Padrão de commits

Sugestão:

```text
feat: adiciona login com JWT
feat: cria CRUD de usuários
feat: implementa matrícula de discente
fix: corrige validação de e-mail único
docs: atualiza endpoints de autenticação
test: adiciona testes manuais de login
refactor: organiza services do módulo acadêmico
```

---

# 13. Divisão sugerida da equipe

| Membro | Responsabilidade principal |
|---|---|
| Pessoa 1 | Tech Lead, arquitetura, revisão geral, integração backend/banco |
| Pessoa 2 | Auth, segurança e usuários |
| Pessoa 3 | Disciplinas, turmas e matrículas |
| Pessoa 4 | Notas, frequência e regras acadêmicas |
| Pessoa 5 | AVA, atividades, entregas e relatórios |
| Pessoa 6 | Testes, documentação, frontend inicial e apoio na integração |

Observação: mesmo com divisão de tarefas, todos devem participar de revisão cruzada de código para evitar concentração de conhecimento.

---

# 14. Ordem de entrega recomendada

## Entrega 1 — Backend mínimo funcional

- [ ] Projeto Spring Boot criado.
- [ ] PostgreSQL conectado.
- [ ] Usuário administrador inicial criado.
- [ ] Login funcionando.
- [ ] JWT funcionando.
- [ ] `/api/auth/me` funcionando.

## Entrega 2 — Administração básica

- [ ] CRUD de usuários.
- [ ] CRUD de disciplinas.
- [ ] CRUD de turmas.
- [ ] Controle por perfil aplicado.

## Entrega 3 — Núcleo acadêmico

- [ ] Matrícula de discente em turma.
- [ ] Validação de matrícula duplicada.
- [ ] Docente visualiza suas turmas.
- [ ] Discente visualiza suas matrículas.

## Entrega 4 — Notas e frequência

- [ ] Docente registra notas.
- [ ] Docente registra frequência.
- [ ] Discente consulta notas.
- [ ] Discente consulta frequência.
- [ ] Cálculo de frequência implementado.

## Entrega 5 — AVA

- [ ] Docente cadastra material.
- [ ] Discente consulta material.
- [ ] Docente cadastra atividade.
- [ ] Discente envia atividade.
- [ ] Docente consulta entregas.

## Entrega 6 — Relatórios

- [ ] Boletim.
- [ ] Diário de classe.
- [ ] Relatório por turma.
- [ ] Relatório de frequência.
- [ ] Relatório de notas.

## Entrega 7 — Integração e apresentação

- [ ] Frontend integrado.
- [ ] Testes manuais concluídos.
- [ ] Prints salvos.
- [ ] README atualizado.
- [ ] Dados de demonstração cadastrados.
- [ ] Roteiro de apresentação definido.

---

# 15. Roteiro de demonstração final

A demonstração final deve seguir um fluxo que mostre os principais casos de uso:

```text
1. Login como Administrador
2. Cadastrar Docente
3. Cadastrar Discente
4. Cadastrar Disciplina
5. Cadastrar Turma
6. Matricular Discente em Turma
7. Login como Docente
8. Consultar Minhas Turmas
9. Registrar Nota
10. Registrar Frequência
11. Cadastrar Material Didático
12. Cadastrar Atividade
13. Login como Discente
14. Consultar Notas
15. Consultar Frequência
16. Acessar Material
17. Enviar Atividade
18. Login como Administrador
19. Gerar Relatório Acadêmico
```

---

# 16. O que não deve ser priorizado agora

Para evitar desvio de escopo, não priorizar no MVP:

- aplicativo mobile;
- chat interno;
- fórum;
- dashboard avançado;
- microsserviços;
- upload pesado de vídeo;
- sistema financeiro;
- notificações complexas;
- integração real com e-mail antes do core funcionar;
- exportação PDF antes dos relatórios JSON estarem prontos.

Esses itens podem ficar como melhorias futuras.

---

# 17. Checklist geral do projeto

## Backend

- [ ] Projeto Spring Boot criado.
- [ ] PostgreSQL configurado.
- [ ] Flyway configurado.
- [ ] Auth implementado.
- [ ] JWT implementado.
- [ ] Usuários implementados.
- [ ] Disciplinas implementadas.
- [ ] Turmas implementadas.
- [ ] Matrículas implementadas.
- [ ] Notas implementadas.
- [ ] Frequência implementada.
- [ ] Materiais implementados.
- [ ] Atividades implementadas.
- [ ] Entregas implementadas.
- [ ] Relatórios implementados.
- [ ] Documentação dos endpoints criada.

## Frontend

- [ ] Projeto React criado.
- [ ] Rotas configuradas.
- [ ] Login integrado.
- [ ] Menu por perfil.
- [ ] Telas do administrador.
- [ ] Telas do docente.
- [ ] Telas do discente.
- [ ] Tratamento de erros.
- [ ] Layout básico padronizado.

## Testes e documentação

- [ ] Testes manuais no Postman/Insomnia.
- [ ] Testes de fluxo por perfil.
- [ ] Testes de autorização.
- [ ] Testes de matrícula duplicada.
- [ ] Testes de nota por docente responsável.
- [ ] Testes de consulta individual do discente.
- [ ] Prints das telas.
- [ ] README atualizado.
- [ ] Roteiro de apresentação.

---

# 18. Prioridade imediata do grupo

A prioridade agora é concluir a primeira entrega do backend:

```text
Backend subindo + PostgreSQL conectado + usuário administrador inicial + login com JWT.
```

Enquanto isso não estiver pronto, os demais módulos devem aguardar para evitar retrabalho.

---

# 19. Resumo executivo

O desenvolvimento do SGE deve começar pelo backend, seguindo arquitetura em camadas e organização modular. A primeira entrega deve garantir autenticação, autorização e base de usuários. Em seguida, o grupo deve implementar disciplinas, turmas, matrículas, notas, frequência, AVA e relatórios. Cada funcionalidade deve possuir endpoint, service, repository, validação, controle de acesso, teste manual e documentação no repositório.

