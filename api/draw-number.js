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
    const { room_id, number } = req.body;

    if (!room_id || number === undefined) {
      return res.status(400).json({ error: 'ID da sala e número são obrigatórios' });
    }

    const { db } = await connectToDatabase();
    
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    const drawn_numbers = room.drawn_numbers || [];
    
    if (drawn_numbers.includes(number)) {
      return res.status(400).json({ error: 'Número já foi sorteado' });
    }

    drawn_numbers.push(number);

    await db.collection('rooms').updateOne(
      { room_id },
      { 
        $set: { 
          drawn_numbers,
          status: 'playing',
        } 
      }
    );

    return res.status(200).json({ 
      success: true,
      drawn_numbers,
      number,
    });
  } catch (error) {
    console.error('Erro ao sortear número:', error);
    return res.status(500).json({ error: 'Erro ao sortear número' });
  }
}

