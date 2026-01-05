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
    const { room_name, password, password_admin, theme, card_size } = req.body;

    if (!room_name || !password || !theme || !card_size) {
      return res.status(400).json({ error: 'Nome da sala, senha, tema e quantidade de números são obrigatórios' });
    }

    const { db } = await connectToDatabase();
    
    // Verifica se já existe uma sala com o mesmo nome
    const existingRoom = await db.collection('rooms').findOne({ room_name });
    if (existingRoom) {
      return res.status(400).json({ error: 'Já existe uma sala com este nome. Escolha outro nome.' });
    }
    
    // Gera um ID único para a sala
    const room_id = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Cria a sala
    const room = {
      room_id,
      room_name,
      password, // Senha para jogadores
      password_admin: password_admin || password, // Senha para admin/host (usa password se não fornecido)
      theme,
      card_size,
      created_at: new Date(),
      status: 'waiting', // waiting, playing, finished
      drawn_numbers: [],
      bingo_claims: [], // Array de claims de bingo com timestamp
      winner: null,
    };

    await db.collection('rooms').insertOne(room);

    return res.status(200).json({ 
      success: true, 
      room_id,
      room_name 
    });
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    return res.status(500).json({ error: 'Erro ao criar sala' });
  }
}

