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

    if (!room_id) {
      return res.status(400).json({ error: 'ID da sala é obrigatório' });
    }

    const { db } = await connectToDatabase();
    
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    // Verifica senha de admin se a sala tiver senha
    if (room.password && room.password !== password_admin) {
      return res.status(401).json({ error: 'Senha de administrador incorreta' });
    }

    // Reseta a sala (limpa números sorteados, claims e vencedor)
    await db.collection('rooms').updateOne(
      { room_id },
      { 
        $set: { 
          drawn_numbers: [],
          bingo_claims: [],
          winner: null,
          status: 'playing'
        } 
      }
    );

    // Reseta os usuários da sala (remove status de vencedor e claims)
    await db.collection('users').updateMany(
      { room_id },
      { 
        $set: { 
          has_bingo: false,
          is_winner: false,
          bingo_claimed_at: null,
          invalid_bingo_count: 0,
          cards: [] // Limpa as cartelas para forçar todos a gerarem novas
        } 
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao reiniciar jogo:', error);
    return res.status(500).json({ error: 'Erro ao reiniciar jogo' });
  }
}