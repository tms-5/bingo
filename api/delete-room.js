import { connectToDatabase } from './mongodb.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { room_id, password_admin } = req.body;

    if (!room_id || !password_admin) {
      return res.status(400).json({ error: 'ID da sala e senha de admin são obrigatórios' });
    }

    const { db } = await connectToDatabase();
    
    // Verifica se a sala existe e a senha está correta
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    // Verifica a senha do admin
    const adminPassword = room.password_admin || room.password;
    if (adminPassword !== password_admin) {
      return res.status(401).json({ error: 'Senha de admin incorreta' });
    }

    // Deleta todos os usuários da sala
    await db.collection('users').deleteMany({ room_id });
    
    // Deleta a sala
    await db.collection('rooms').deleteOne({ room_id });

    return res.status(200).json({ 
      success: true,
      message: 'Sala e todos os usuários foram deletados com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar sala:', error);
    return res.status(500).json({ error: 'Erro ao deletar sala' });
  }
}

