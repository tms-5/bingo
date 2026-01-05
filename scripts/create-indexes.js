// Script para criar índices únicos no MongoDB
// Execute: node scripts/create-indexes.js

import { connectToDatabase } from '../api/mongodb.js';
import dotenv from 'dotenv';

dotenv.config();

async function createIndexes() {
  try {
    const { db } = await connectToDatabase();
    
    // Cria índice único composto para evitar usuários duplicados na mesma sala
    await db.collection('users').createIndex(
      { room_id: 1, user_name: 1 },
      { unique: true, name: 'unique_user_per_room' }
    );
    
    console.log('✅ Índice único criado com sucesso!');
    console.log('   - room_id + user_name: único por sala');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar índices:', error);
    
    // Se o índice já existe, isso é OK
    if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
      console.log('ℹ️  Índice já existe. Se houver duplicatas, remova-as manualmente primeiro.');
    }
    
    process.exit(1);
  }
}

createIndexes();

