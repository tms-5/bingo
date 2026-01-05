import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carrega variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Importa as APIs
import createRoom from './api/create-room.js';
import joinRoom from './api/join-room.js';
import getRoom from './api/get-room.js';
import drawNumber from './api/draw-number.js';
import claimBingo from './api/claim-bingo.js';
import saveCards from './api/save-cards.js';
import verifyHost from './api/verify-host.js';
import deleteRoom from './api/delete-room.js';
import deleteUser from './api/delete-user.js';

// Wrapper para converter handlers do Vercel para Express
function vercelHandler(handler) {
  return async (req, res) => {
    try {
      // Adiciona método OPTIONS para CORS
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
      }
      
      // Cria um objeto req/res compatível com Vercel
      const vercelReq = {
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers,
      };
      
      const vercelRes = {
        statusCode: 200,
        headers: {},
        status: function(code) {
          this.statusCode = code;
          res.status(code);
          return this;
        },
        json: function(data) {
          Object.keys(this.headers).forEach(key => {
            res.setHeader(key, this.headers[key]);
          });
          res.status(this.statusCode).json(data);
          return this;
        },
        setHeader: function(name, value) {
          this.headers[name] = value;
          res.setHeader(name, value);
          return this;
        },
        end: function() {
          Object.keys(this.headers).forEach(key => {
            res.setHeader(key, this.headers[key]);
          });
          res.status(this.statusCode).end();
          return this;
        },
      };
      
      // handler já é a função exportada como default
      await handler(vercelReq, vercelRes);
    } catch (error) {
      console.error('Erro no handler:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
      }
    }
  };
}

// Rotas da API (suporta OPTIONS para CORS)
app.all('/api/create-room', vercelHandler(createRoom));
app.all('/api/join-room', vercelHandler(joinRoom));
app.all('/api/get-room', vercelHandler(getRoom));
app.all('/api/draw-number', vercelHandler(drawNumber));
app.all('/api/claim-bingo', vercelHandler(claimBingo));
app.all('/api/save-cards', vercelHandler(saveCards));
app.all('/api/verify-host', vercelHandler(verifyHost));
app.all('/api/delete-room', vercelHandler(deleteRoom));
app.all('/api/delete-user', vercelHandler(deleteUser));

app.listen(PORT, () => {
  console.log(`🚀 Servidor API rodando em http://localhost:${PORT}`);
  console.log(`📝 MONGODB_URI: ${process.env.MONGODB_URI ? 'Configurada ✓' : 'NÃO CONFIGURADA ✗'}`);
});

