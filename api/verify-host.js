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
    const { room_id, password } = req.body;

    if (!room_id || !password) {
      return res.status(400).json({ error: 'ID da sala e senha são obrigatórios' });
    }

    const { db } = await connectToDatabase();
    
    // Verifica se a sala existe e a senha está correta
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    // Verifica a senha do admin (password_admin)
    const adminPassword = room.password_admin || room.password; // Fallback para compatibilidade
    if (adminPassword !== password) {
      return res.status(401).json({ error: 'Senha de admin incorreta' });
    }

    return res.status(200).json({ 
      success: true,
      room_id: room.room_id,
      room_name: room.room_name,
    });
  } catch (error) {
    console.error('Erro ao verificar host:', error);
    return res.status(500).json({ error: 'Erro ao verificar host' });
  }
}

