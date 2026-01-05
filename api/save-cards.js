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
    const { user_id, room_id, cards } = req.body;

    if (!user_id || !room_id || !cards) {
      return res.status(400).json({ error: 'ID do usuário, ID da sala e cartelas são obrigatórios' });
    }

    const { db } = await connectToDatabase();
    
    await db.collection('users').updateOne(
      { user_id, room_id },
      { 
        $set: { 
          cards,
          last_seen: new Date(),
        } 
      }
    );

    return res.status(200).json({ 
      success: true,
    });
  } catch (error) {
    console.error('Erro ao salvar cartelas:', error);
    return res.status(500).json({ error: 'Erro ao salvar cartelas' });
  }
}

