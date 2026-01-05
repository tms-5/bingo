# Configuração do Sistema de Bingo Online

## Estrutura do Projeto

O projeto agora inclui um sistema completo de bingo online com as seguintes funcionalidades:

### Telas Criadas

1. **CreateRoomPage** (`/create-room`) - Tela para criar uma nova sala
   - Permite definir nome da sala e senha
   - Gera um ID único para a sala
   - Salva informações no localStorage para reconexão

2. **JoinRoomPage** (`/join-room`) - Tela para entrar em uma sala existente
   - Requer ID da sala, senha e nome do usuário
   - Salva sessão no localStorage para reconexão

3. **GameRoomPage** (`/game/:room_id`) - Tela do jogo para jogadores
   - Gera cartelas de bingo (1-5 cartelas)
   - Permite marcar números conforme são sorteados
   - Botão "BINGO!" para validar bingo
   - Mostra resultados em tempo real
   - Atualização automática a cada 2 segundos

4. **HostRoomPage** (`/host-room/:room_id`) - Tela do host
   - Sorteia números de 1 a 75
   - Visualiza números sorteados com cores por faixa (B, I, N, G, O)
   - Mostra resultados de bingo em ordem cronológica
   - Lista de jogadores conectados
   - Anuncia vencedor

### APIs Criadas

Todas as APIs estão em `/api/` e funcionam como serverless functions do Vercel:

1. **`/api/create-room`** - Cria uma nova sala
2. **`/api/join-room`** - Entra em uma sala existente
3. **`/api/get-room`** - Busca dados da sala (números sorteados, claims, usuários)
4. **`/api/draw-number`** - Sorteia um novo número
5. **`/api/claim-bingo`** - Valida um bingo reivindicado
6. **`/api/save-cards`** - Salva cartelas do usuário

### Collections do MongoDB

O sistema usa duas collections:

1. **`rooms`** - Armazena informações das salas
   - `room_id` (string) - ID único da sala
   - `room_name` (string) - Nome da sala
   - `password` (string) - Senha da sala
   - `status` (string) - Status: 'waiting', 'playing', 'finished'
   - `drawn_numbers` (array) - Números sorteados
   - `bingo_claims` (array) - Claims de bingo com timestamp
   - `winner` (string) - user_id do vencedor
   - `created_at` (date)

2. **`users`** - Armazena informações dos jogadores
   - `user_id` (string) - ID único do usuário
   - `room_id` (string) - ID da sala
   - `user_name` (string) - Nome do usuário
   - `cards` (array) - Cartelas do usuário
   - `has_bingo` (boolean) - Se reivindicou bingo
   - `is_winner` (boolean) - Se ganhou
   - `bingo_claimed_at` (date) - Quando reivindicou bingo
   - `created_at` (date)
   - `last_seen` (date)

## Configuração no Vercel

### 1. Adicionar Variável de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

- **Nome**: `MONGODB_URI`
- **Valor**: `mongodb+srv://Vercel-Admin-bingo-free:F7eQa988wNMOHiv3@bingo-free.i6nmpby.mongodb.net/?retryWrites=true&w=majority`

⚠️ **IMPORTANTE**: Não commite essa URI no GitHub! Use apenas como secret no Vercel.

### 2. Deploy

O Vercel detectará automaticamente as serverless functions na pasta `/api/` e as disponibilizará nas rotas correspondentes.

## Funcionalidades Implementadas

✅ Criação de salas com nome e senha
✅ Geração de ID único para cada sala
✅ Entrada na sala com ID, senha e nome do usuário
✅ Geração de cartelas de bingo (1-5 cartelas)
✅ Sorteio de números (1-75) pelo host
✅ Marcação de números nas cartelas
✅ Validação de bingo (linha, coluna ou diagonal)
✅ Sistema de claims com timestamp
✅ Ordenação de resultados por ordem de claim
✅ Diferenciação entre bingos válidos e inválidos
✅ Bloqueio de jogadores que ganharam
✅ Persistência de dados no localStorage
✅ Atualização em tempo real (polling a cada 2s)
✅ Interface responsiva estilo Gartic

## Como Usar

1. **Host cria uma sala**:
   - Acessa `/create-room`
   - Define nome e senha
   - Copia o ID da sala
   - Vai para a tela do host

2. **Jogadores entram**:
   - Acessam `/join-room`
   - Informam ID da sala, senha e nome
   - São redirecionados para o jogo

3. **Durante o jogo**:
   - Host sorteia números
   - Jogadores marcam números nas cartelas
   - Quando completam linha/coluna/diagonal, clicam em "BINGO!"
   - Sistema valida e mostra resultados em ordem

4. **Após bingo válido**:
   - Vencedor é anunciado
   - Jogador que ganhou não pode mais jogar
   - Host pode continuar o jogo ou iniciar novo

## Notas Técnicas

- As cartelas são salvas no localStorage para persistência
- O sistema usa polling (a cada 2s) para atualização em tempo real
- A validação de bingo verifica se os números marcados estão nos números sorteados
- O centro da cartela (FREE) é sempre considerado marcado
- Múltiplos bingos simultâneos são ordenados por timestamp

