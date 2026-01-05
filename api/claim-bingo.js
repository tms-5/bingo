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
    const { room_id, user_id, cards, markedNumbers } = req.body;

    if (!room_id || !user_id || !cards) {
      return res.status(400).json({ error: 'ID da sala, ID do usuário e cartelas são obrigatórios' });
    }

    const { db } = await connectToDatabase();
    
    const room = await db.collection('rooms').findOne({ room_id });
    
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada' });
    }

    const user = await db.collection('users').findOne({ user_id, room_id });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.has_bingo && user.is_winner) {
      return res.status(400).json({ error: 'Usuário já ganhou e não pode mais jogar' });
    }

    const drawn_numbers = room.drawn_numbers || [];
    const timestamp = new Date();

    // Valida se tem bingo
    // markedNumbers é um objeto: { 0: [1, 2, 3] } onde a chave é o índice da cartela
    // cards agora contém objetos com { number, word, color, image }
    let hasBingo = false;
    
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex];
      const marked = markedNumbers && markedNumbers[cardIndex] ? markedNumbers[cardIndex] : [];
      
      const rows = card.length;
      const cols = card[0] ? card[0].length : 0;
      
      // Verifica linhas
      for (let i = 0; i < rows; i++) {
        const row = card[i];
        const rowMarked = row.every(cell => {
          const num = typeof cell === 'object' ? cell.number : cell;
          return marked.includes(num) && drawn_numbers.includes(num);
        });
        if (rowMarked) {
          hasBingo = true;
          break;
        }
      }
      
      // Verifica colunas
      if (!hasBingo) {
        for (let j = 0; j < cols; j++) {
          const col = card.map(row => {
            const cell = row[j];
            return typeof cell === 'object' ? cell.number : cell;
          });
          const colMarked = col.every(num => {
            return marked.includes(num) && drawn_numbers.includes(num);
          });
          if (colMarked) {
            hasBingo = true;
            break;
          }
        }
      }
      
      // Verifica diagonais (apenas se for matriz quadrada)
      if (!hasBingo && rows === cols && rows > 2) {
        const diag1 = [];
        const diag2 = [];
        for (let i = 0; i < rows; i++) {
          const cell1 = card[i][i];
          const cell2 = card[i][cols - 1 - i];
          diag1.push(typeof cell1 === 'object' ? cell1.number : cell1);
          diag2.push(typeof cell2 === 'object' ? cell2.number : cell2);
        }
        
        const diag1Marked = diag1.every(num => {
          return marked.includes(num) && drawn_numbers.includes(num);
        });
        const diag2Marked = diag2.every(num => {
          return marked.includes(num) && drawn_numbers.includes(num);
        });
        
        if (diag1Marked || diag2Marked) {
          hasBingo = true;
        }
      }
      
      if (hasBingo) break;
    }

    // Adiciona o claim de bingo na sala
    const bingo_claims = room.bingo_claims || [];
    const claim = {
      user_id,
      user_name: user.user_name,
      timestamp,
      is_valid: hasBingo,
    };
    bingo_claims.push(claim);

    // Atualiza a sala
    await db.collection('rooms').updateOne(
      { room_id },
      { 
        $set: { 
          bingo_claims,
          ...(hasBingo && !room.winner ? { winner: user_id } : {}),
        } 
      }
    );

    // Atualiza o usuário
    await db.collection('users').updateOne(
      { user_id, room_id },
      { 
        $set: { 
          has_bingo: hasBingo,
          is_winner: hasBingo,
          bingo_claimed_at: timestamp,
          cards, // Salva as cartelas
        } 
      }
    );

    return res.status(200).json({ 
      success: true,
      has_bingo: hasBingo,
      claim,
      bingo_claims,
    });
  } catch (error) {
    console.error('Erro ao validar bingo:', error);
    return res.status(500).json({ error: 'Erro ao validar bingo' });
  }
}

