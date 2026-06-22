// server.js
// Servidor simples Express:
// - Serve os arquivos estáticos do front-end (HTML, CSS, JS)
// - Expõe uma API REST para a tabela Projeto no MySQL

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve o front-end estático (a própria pasta do projeto)
app.use(express.static(path.join(__dirname)));

// ---------------------------------------------------------
// API de Projetos
// ---------------------------------------------------------

// Listar todos os projetos (ou filtrar por professor: /api/projetos?professor=Ebert)
app.get('/api/projetos', async (req, res) => {
  try {
    const { professor } = req.query;
    let rows;

    if (professor) {
      [rows] = await pool.query(
        'SELECT * FROM Projeto WHERE professor = ? ORDER BY idProjeto DESC',
        [professor]
      );
    } else {
      [rows] = await pool.query('SELECT * FROM Projeto ORDER BY idProjeto DESC');
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar projetos.' });
  }
});

// Buscar um projeto específico pelo id
app.get('/api/projetos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Projeto WHERE idProjeto = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar projeto.' });
  }
});

// Criar um novo projeto
app.post('/api/projetos', async (req, res) => {
  try {
    const { nome, lider, grupo, orientador, descricao, professor } = req.body;

    if (!nome || !lider || !grupo || !descricao || !professor) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Projeto (nome, alunolider, grupo, orientador, descricao, professor)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, lider, grupo, orientador || null, descricao, professor]
    );

    res.status(201).json({ idProjeto: resultado.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar projeto.' });
  }
});

// Atualizar um projeto existente
app.put('/api/projetos/:id', async (req, res) => {
  try {
    const { nome, lider, grupo, orientador, descricao, professor } = req.body;

    if (!nome || !lider || !grupo || !descricao || !professor) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const [resultado] = await pool.query(
      `UPDATE Projeto
       SET nome = ?, alunolider = ?, grupo = ?, orientador = ?, descricao = ?, professor = ?
       WHERE idProjeto = ?`,
      [nome, lider, grupo, orientador || null, descricao, professor, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar projeto.' });
  }
});

// Excluir um projeto
app.delete('/api/projetos/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      'DELETE FROM Projeto WHERE idProjeto = ?',
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto não encontrado.' });
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir projeto.' });
  }
});

// ---------------------------------------------------------
// API de Usuários (Professores) — uso exclusivo do coordenador
// ---------------------------------------------------------

// Listar todos os professores
app.get('/api/professores', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT idUsuario, registroprofessor, nome, email, tipo FROM Usuario WHERE tipo = 'professor' ORDER BY nome ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar professores.' });
  }
});

// Cadastrar um novo professor
app.post('/api/professores', async (req, res) => {
  try {
    const { registroprofessor, nome, email, senha } = req.body;

    if (!registroprofessor || !nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Usuario (registroprofessor, nome, email, tipo, senhahash)
       VALUES (?, ?, ?, 'professor', ?)`,
      [registroprofessor, nome, email, senha]
    );

    res.status(201).json({ idUsuario: resultado.insertId });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar professor.' });
  }
});

// Excluir um professor
app.delete('/api/professores/:id', async (req, res) => {
  try {
    const [resultado] = await pool.query(
      "DELETE FROM Usuario WHERE idUsuario = ? AND tipo = 'professor'",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir professor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor SOPIE rodando em http://localhost:${PORT}`);
});
