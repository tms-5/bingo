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
    const { room_id, user_id } = req.query;

    if (!room_id) {
      return res.status(400).json({ error: 'ID da sala é obrigatório' });
    }

    const { db } = await connectToDatabase();
    
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    // Se user_id for fornecido, é a visão do JOGADOR (dados filtrados e verificação de expulsão)
    if (user_id) {
      const user = await db.collection('users').findOne({ room_id, user_id });
      
      if (!user) {
        // Usuário não encontrado na sala (foi expulso ou nunca entrou)
        return res.status(404).json({ error: 'Usuário não encontrado na sala', user_kicked: true });
      }

      return res.status(200).json({ 
        room: {
          room_id: room.room_id,
          room_name: room.room_name,
          theme: room.theme || 'christmas',
          card_size: room.card_size || 25,
          status: room.status,
          // Envia apenas os últimos 5 números para economizar dados e limpar a visão do jogador
          drawn_numbers: (room.drawn_numbers || []).slice(-5),
          bingo_claims: room.bingo_claims || [],
          winner: room.winner,
        },
        users: [user], // Retorna APENAS o usuário que solicitou (privacidade e economia)
      });
    }

    // Se não tem user_id, é a visão do HOST (retorna tudo)
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
        avatar: u.avatar || 1, // Avatar padrão é 1 se não existir
        has_bingo: u.has_bingo,
        is_winner: u.is_winner,
        cards: u.cards || [], // Inclui cartelas para recuperação
        invalid_bingo_count: u.invalid_bingo_count || 0,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    return res.status(500).json({ error: 'Erro ao buscar sala' });
  }
}
