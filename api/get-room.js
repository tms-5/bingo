import { connectToDatabase } from './mongodb.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { room_id } = req.query;

    if (!room_id) {
      return res.status(400).json({ error: 'ID da sala é obrigatório' });
    }

    const { db } = await connectToDatabase();
    
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    // Busca usuários da sala
    const users = await db.collection('users')
      .find({ room_id })
      .toArray();

    return res.status(200).json({ 
      room: {
        room_id: room.room_id,
        room_name: room.room_name,
        theme: room.theme || 'christmas', // Valor padrão se não existir
        card_size: room.card_size || 25, // Valor padrão se não existir
        status: room.status,
        drawn_numbers: room.drawn_numbers || [],
        bingo_claims: room.bingo_claims || [],
        winner: room.winner,
      },
      users: users.map(u => ({
        user_id: u.user_id,
        user_name: u.user_name,
        has_bingo: u.has_bingo,
        is_winner: u.is_winner,
        cards: u.cards || [], // Inclui cartelas para recuperação
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    return res.status(500).json({ error: 'Erro ao buscar sala' });
  }
}

