const mysql = require('mysql2/promise');

async function getConnection() {
  return await mysql.createConnection({
    host: 'db4free.net',
    user: 'bancotestepro12',
    password: '3RFVW3zL*$MT2f4',
    database: 'bancotestepro12',
  });
}

export default async function handler(req, res) {
  // ✅ Cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://padraoversel-2jpi.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Responde a pré-requisições CORS (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const conn = await getConnection();

  try {
    if (req.method === 'GET') {
      const [rows] = await conn.query('SELECT * FROM transacoes');
      await conn.end();
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { descricao, valor, tipo, data } = req.body;
      await conn.execute(
        'INSERT INTO transacoes (descricao, valor, tipo, data) VALUES (?, ?, ?, ?)',
        [descricao, valor, tipo, data]
      );
      await conn.end();
      return res.status(201).json({ message: 'Transação criada!' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await conn.execute('DELETE FROM transacoes WHERE id = ?', [id]);
      await conn.end();
      return res.status(200).json({ message: 'Transação removida!' });
    }

    await conn.end();
    return res.status(405).json({ error: 'Método não permitido' });

  } catch (err) {
    await conn.end();
    return res.status(500).json({ error: 'Erro no servidor', detalhes: err.message });
  }
}
