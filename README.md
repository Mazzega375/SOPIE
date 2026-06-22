# SOPIE — Backend Node.js + MySQL

Este projeto agora tem um backend simples em **Node.js (Express)** conectado ao **MySQL**.
O front-end (HTML/CSS/JS) continua o mesmo — só a parte de **Projetos** deixou de usar
`localStorage` e passou a usar o banco de dados de verdade. O **login continua igual**
(sem validação real, só redireciona conforme o perfil escolhido).

## 1. Pré-requisitos

- Node.js instalado (https://nodejs.org)
- MySQL rodando localmente (XAMPP, MySQL Workbench, etc.)

## 2. Criar o banco de dados

Abra o **MySQL Workbench** (ou o phpMyAdmin do XAMPP) e execute o arquivo `sopie.sql`
que está nesta mesma pasta. Ele cria o schema `SOPIE` com as tabelas `Usuario` e `Projeto`
(a tabela `Projeto` ganhou uma coluna `professor`, que faltava para o formulário funcionar).

## 3. Configurar a conexão

Edite o arquivo `.env` na raiz do projeto com os dados do seu MySQL local:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=SOPIE
PORT=3000
```

Se seu MySQL (XAMPP) usa root sem senha, pode deixar `DB_PASSWORD=` vazio, como já está.

## 4. Instalar as dependências

No terminal, dentro da pasta do projeto:

```bash
npm install
```

Isso vai instalar `express`, `mysql2`, `cors` e `dotenv`.

## 5. Rodar o servidor

```bash
npm start
```

Você verá a mensagem:

```
Servidor SOPIE rodando em http://localhost:3000
```

## 6. Usar o sistema

Abra o navegador em:

```
http://localhost:3000/login/index.html
```

Daí em diante, navegue normalmente como já fazia. Ao criar/editar/excluir projetos,
os dados agora vão para o MySQL em vez do localStorage do navegador.

## O que mudou no código

- **`server.js`** (novo): servidor Express que serve o site e expõe a API `/api/projetos`
  com rotas `GET`, `POST`, `PUT`, `DELETE`.
- **`db.js`** (novo): faz a conexão (pool) com o MySQL usando os dados do `.env`.
- **`script.js`**: as funções `criarprojeto`, `listarProjetos`, `salvareditar`,
  `excluirprojeto`, `carregarEdicao` e `carregarProjetosProfessor` agora usam `fetch`
  para falar com a API em vez de `localStorage`. Os nomes das funções e os IDs dos
  campos HTML continuam exatamente os mesmos, então nenhum arquivo `.html` precisou
  ser alterado.
- **`sopie.sql`**: adicionada a coluna `professor` (VARCHAR) e `data_criacao` na tabela
  `Projeto`, necessárias para guardar o que o formulário já enviava.

## Observação sobre login e professores

A lista de professores por curso e o login continuam fixos no `script.js`
(não vêm do banco), exatamente como já eram no projeto original — isso ficou de fora
de propósito, conforme combinado, para manter a tarefa simples e focada em Projetos.
Se quiser, dá pra evoluir isso depois sem dor, já que a estrutura de API já existe.
