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
    const { room_id, password, user_name } = req.body;

    if (!room_id || !password || !user_name) {
      return res.status(400).json({ error: 'ID da sala, senha e nome do usuário são obrigatórios' });
    }

    const { db } = await connectToDatabase();
    
    // Verifica se a sala existe e a senha está correta
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    if (room.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Verifica se já existe um usuário com esse nome nessa sala
    // Usa índice único para garantir que não haja duplicatas
    let existingUser = await db.collection('users').findOne({ 
      room_id, 
      user_name 
    });

    let user_id;
    let cards = [];

    if (existingUser) {
      // Usuário já existe, usa o user_id existente e recupera cartelas
      user_id = existingUser.user_id;
      cards = existingUser.cards || [];
      
      // Atualiza last_seen
      await db.collection('users').updateOne(
        { user_id, room_id },
        { $set: { last_seen: new Date() } }
      );
    } else {
      // Verifica novamente antes de criar (para evitar race conditions)
      const duplicateCheck = await db.collection('users').findOne({ 
        room_id, 
        user_name 
      });
      
      if (duplicateCheck) {
        // Se foi criado entre a primeira verificação e agora, usa o existente
        user_id = duplicateCheck.user_id;
        cards = duplicateCheck.cards || [];
        
        await db.collection('users').updateOne(
          { user_id, room_id },
          { $set: { last_seen: new Date() } }
        );
      } else {
        // Cria novo usuário
        user_id = Math.random().toString(36).substring(2, 12);
        
        const user = {
          user_id,
          room_id,
          user_name,
          cards: [], // Array de cartelas do usuário
          has_bingo: false,
          bingo_claimed_at: null,
          is_winner: false,
          created_at: new Date(),
          last_seen: new Date(),
        };

        try {
          await db.collection('users').insertOne(user);
        } catch (insertError) {
          // Se der erro de duplicata (E11000), busca o usuário existente
          if (insertError.code === 11000) {
            const existing = await db.collection('users').findOne({ 
              room_id, 
              user_name 
            });
            if (existing) {
              user_id = existing.user_id;
              cards = existing.cards || [];
              await db.collection('users').updateOne(
                { user_id, room_id },
                { $set: { last_seen: new Date() } }
              );
            } else {
              throw insertError;
            }
          } else {
            throw insertError;
          }
        }
      }
    }

    return res.status(200).json({ 
      success: true, 
      user_id,
      room_id,
      user_name,
      room_name: room.room_name,
    });
  } catch (error) {
    console.error('Erro ao entrar na sala:', error);
    return res.status(500).json({ error: 'Erro ao entrar na sala' });
  }
}

