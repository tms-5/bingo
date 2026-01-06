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
    const { room_id, user_id, avatar } = req.body;

    if (!room_id || !user_id || !avatar) {
      return res.status(400).json({ error: 'ID da sala, ID do usuário e avatar são obrigatórios' });
    }

    // Valida que o avatar está no range válido (1-33)
    if (avatar < 1 || avatar > 33) {
      return res.status(400).json({ error: 'Avatar inválido. Deve estar entre 1 e 33' });
    }

    const { db } = await connectToDatabase();
    
    // Verifica se o usuário existe
    const user = await db.collection('users').findOne({ user_id, room_id });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualiza o avatar
    await db.collection('users').updateOne(
      { user_id, room_id },
      { $set: { avatar, last_seen: new Date() } }
    );

    return res.status(200).json({ 
      success: true,
      avatar,
    });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    return res.status(500).json({ error: 'Erro ao atualizar avatar' });
  }
}

