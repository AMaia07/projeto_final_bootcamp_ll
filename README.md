# Catálogo Colaborativo de Jogos

## Integrantes e responsabilidades

| Nome | Matrícula | Usuário GitHub | Funcionalidade (código) | Link da principal PR |
|---|---|---|---|---|
| Artur Maia de Morais | 22610962 | AMaia07 | _preencher_ | _preencher_ |
| _preencher_ | _preencher_ | _preencher_ | _preencher_ | _preencher_ |

Papéis acumulativos (testes, CI, Docker, README): _preencher_.

## Descrição
Aplicação web colaborativa em que o grupo monta um catálogo de jogos, dá notas com comentários e marca favoritos.

- **API consumida:** FreeToGame — https://www.freetogame.com/api/games (sem chave; a lista é carregada uma vez e filtrada no navegador)
- **Banco de dados:** Supabase (PostgreSQL). Tabelas `jogos`, `avaliacoes` e `favoritos` (script em `banco/schema.sql`)
- **Limitação conhecida:** políticas de acesso (RLS) abertas para o papel `anon`; não há login, os usuários são identificados por apelido

## Links
- **Repositório:** _preencher_
- **Docker Hub:** _preencher_
- **Aplicação no ar (se houver):** _preencher_

## Como executar localmente
1. Clone o repositório
2. Abra `index.html` no navegador (ou use o Live Server do VS Code)

## Como executar com Docker
```
docker run -d -p 8080:80 USUARIO-DOCKERHUB/NOME-DA-IMAGEM:latest
```
Depois acesse http://localhost:8080. _(Se a aplicação precisar de variáveis de ambiente, listá-las aqui.)_

## Como rodar os testes
```
npm install
npm test
```
Os testes (Jest) cobrem as funções de `utils.js`: `calcularMedia`, `validarNota`, `normalizarBusca` e `filtrarPorTitulo`.

## Fluxo de trabalho do time
- A `main` é protegida: só recebe código por Pull Request, com 1 aprovação e o check `testes` verde.
- Cada funcionalidade nasce em uma branch `feature/nome-da-funcionalidade`.

## Evidências
- **PR bloqueada pelo CI (teste quebrado de propósito):** _inserir print_
- **Conflito de merge resolvido:** _relatar como aconteceu e como foi resolvido (ou indicar que não houve)_
