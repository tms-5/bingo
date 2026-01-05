<template>
  <div class="host-room-page">
    <div class="room-header">
      <h1 class="c-blue-200 fw-700">{{ room_name }}</h1>
      <p class="room-id">ID da Sala: <strong>{{ room_id }}</strong></p>
      <button @click="copyRoomId" class="btn-secondary">Copiar ID</button>
    </div>

    <!-- Número sorteado grande (para projetor) -->
    <div v-if="lastDrawnNumber && !bigNumberClosed" class="big-number-display" @click="closeBigNumber" :style="{ backgroundColor: getDrawnNumberColor(lastDrawnNumber) }">
      <div class="big-number-content">
        <h2 class="big-number-label">Número Sorteado</h2>
        <div v-if="getDrawnNumberItem(lastDrawnNumber)" class="big-number-item">
          <img 
            v-if="getDrawnNumberItem(lastDrawnNumber).image" 
            :src="getDrawnNumberItem(lastDrawnNumber).image" 
            :alt="getDrawnNumberItem(lastDrawnNumber).word"
            class="big-number-image"
          />
          <div class="big-number-word">{{ getDrawnNumberItem(lastDrawnNumber).word }}</div>
        </div>
        <div class="big-number-id">#{{ lastDrawnNumber }}</div>
        <p class="big-number-hint">Clique para fechar</p>
      </div>
    </div>

    <div class="host-container">
      <!-- Controles de sorteio -->
      <div class="draw-section">
        <h2>Sortear Números</h2>
        <button 
          @click="drawNumber" 
          :disabled="loading || gameFinished"
          class="btn-draw"
        >
          {{ loading ? 'Sortendo...' : 'Sortear Próximo Número' }}
        </button>
        <div class="stats">
          <p>Números sorteados: {{ drawnNumbers.length }} / {{ themeData ? themeData.length : 0 }}</p>
        </div>
        <div class="drawn-numbers-display">
          <div 
            v-for="num in lastFiveDrawnNumbers" 
            :key="num" 
            class="drawn-number-card"
            :style="{ backgroundColor: getDrawnNumberColor(num) }"
          >
            <template v-if="getDrawnNumberItem(num)">
              <img 
                v-if="getDrawnNumberItem(num).image" 
                :src="getDrawnNumberItem(num).image" 
                :alt="getDrawnNumberItem(num).word"
                class="drawn-number-image"
              />
              <span class="drawn-number-word">{{ getDrawnNumberItem(num).word }}</span>
            </template>
            <template v-else>
              <span class="drawn-number-word">Número {{ num }}</span>
            </template>
            <span class="drawn-number-id">#{{ num }}</span>
          </div>
        </div>
        <button 
          v-if="drawnNumbers.length > 5"
          @click="showAllNumbersModal = true"
          class="btn-view-all"
        >
          Ver Todos os Números ({{ drawnNumbers.length }})
        </button>
      </div>

      <!-- Resultados de Bingo -->
      <div class="results-section">
        <h2>Resultados de Bingo</h2>
        <div v-if="bingoClaims.length === 0" class="no-claims">
          <p>Nenhum bingo reivindicado ainda.</p>
        </div>
        <div v-else class="claims-list">
          <div 
            v-for="(claim, index) in bingoClaims" 
            :key="index"
            class="claim-item"
            :class="{ 
              valid: claim.is_valid, 
              invalid: !claim.is_valid,
            }"
          >
            <span class="claim-order">{{ index + 1 }}º</span>
            <span class="claim-time">{{ formatTime(claim.timestamp) }}</span>
            <span class="claim-name">{{ claim.user_name }}</span>
            <span class="claim-status">
              {{ claim.is_valid ? '✓ Bingo Válido!' : '✗ Bingo Inválido' }}
            </span>
          </div>
        </div>
        
        <div v-if="winner" class="winner-announcement">
          <h3>🎉 VENCEDOR! 🎉</h3>
          <p class="winner-name">{{ winner.user_name }}</p>
        </div>

        <button 
          v-if="bingoClaims.length > 0 && !gameFinished"
          @click="continueGame"
          class="btn-continue"
        >
          Continuar Jogo
        </button>
        <button 
          v-if="gameFinished"
          @click="newGame"
          class="btn-new-game"
        >
          Novo Jogo
        </button>
      </div>

      <!-- Lista de jogadores -->
      <div class="players-section">
        <h2>Jogadores ({{ users.length }})</h2>
        <div class="players-list">
          <div 
            v-for="user in users" 
            :key="user.user_id"
            class="player-item"
            :class="{ winner: user.is_winner }"
          >
            <span class="player-name">{{ user.user_name }}</span>
            <div class="player-actions">
              <span v-if="user.has_bingo" class="player-status">
                {{ user.is_winner ? '🏆 Ganhador' : 'Bingo reivindicado' }}
              </span>
              <button 
                @click="removeUser(user.user_id, user.user_name)"
                class="btn-remove-user"
                title="Expulsar jogador"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
        
        <!-- Botão de encerrar jogo -->
        <div class="end-game-section">
          <button @click="endGame" class="btn-end-game">
            Encerrar Jogo
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmação para encerrar jogo -->
    <div v-if="showEndGameModal" class="modal-overlay" @click="closeEndGameModal">
      <div class="modal-content" @click.stop>
        <h2>Encerrar Jogo</h2>
        <p>Tem certeza que deseja encerrar este jogo?</p>
        <p class="warning-text">Esta ação irá deletar a sala e todos os usuários vinculados. Esta ação não pode ser desfeita!</p>
        <div class="modal-buttons">
          <button @click="closeEndGameModal" class="btn-cancel">Cancelar</button>
          <button @click="confirmEndGame" class="btn-confirm-end">Sim, Encerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal para ver todos os números sorteados -->
    <div v-if="showAllNumbersModal" class="modal-overlay" @click="showAllNumbersModal = false">
      <div class="modal-content all-numbers-modal" @click.stop style='background: white; max-width: 100%;'>
        <div class="modal-header">
          <h2>Números Sorteados ({{ drawnNumbers.length }})</h2>
          <button @click="showAllNumbersModal = false" class="btn-close-modal">×</button>
        </div>
        <div class="all-numbers-grid">
          <div 
            v-for="num in drawnNumbers.slice().reverse()" 
            :key="num" 
            class="drawn-number-card-modal"
            :style="{ backgroundColor: getDrawnNumberColor(num) }"
          >
            <template v-if="getDrawnNumberItem(num)">
              <img 
                v-if="getDrawnNumberItem(num).image" 
                :src="getDrawnNumberItem(num).image" 
                :alt="getDrawnNumberItem(num).word"
                class="drawn-number-image"
              />
              <span class="drawn-number-word">{{ getDrawnNumberItem(num).word }}</span>
            </template>
            <template v-else>
              <span class="drawn-number-word">Número {{ num }}</span>
            </template>
            <span class="drawn-number-id">#{{ num }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HostRoomPage',
  data() {
    return {
      room_id: null,
      room_name: '',
      password: '',
      theme: null,
      card_size: 12,
      themeData: [],
      drawnNumbers: [],
      lastDrawnNumber: null,
      bigNumberClosed: false, // Flag para controlar se o número grande foi fechado
      bingoClaims: [],
      users: [],
      winner: null,
      loading: false,
      gameFinished: false,
      pollInterval: null,
      showEndGameModal: false,
      showAllNumbersModal: false,
    };
  },
  computed: {
    lastFiveDrawnNumbers() {
      // Retorna os últimos 5 números sorteados (mais recentes primeiro)
      return this.drawnNumbers.slice(-5).reverse();
    },
  },
  async mounted() {
    this.room_id = this.$route.params.room_id;
    this.password = this.$route.query.password;
    
    // Tenta recuperar do localStorage
    const savedRoom = localStorage.getItem('host_room');
    if (savedRoom) {
      try {
        const roomData = JSON.parse(savedRoom);
        if (roomData.room_id === this.room_id) {
          this.room_name = roomData.room_name;
          this.password = roomData.password;
        }
      } catch (e) {
        // Ignora erro
      }
    }
    
    await this.loadRoomData();
    this.startPolling();
  },
  beforeUnmount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
  methods: {
    async loadRoomData() {
      try {
        const response = await fetch(`/api/get-room?room_id=${this.room_id}`);
        const data = await response.json();
        
        if (data.room) {
          this.room_name = data.room.room_name || this.room_name;
          this.theme = data.room.theme || this.theme;
          this.card_size = data.room.card_size || this.card_size;
          const newDrawnNumbers = data.room.drawn_numbers || [];
          
          // Só atualiza lastDrawnNumber se for um número novo e o modal não foi fechado
          if (newDrawnNumbers.length > this.drawnNumbers.length && !this.bigNumberClosed) {
            // Novo número foi sorteado
            this.lastDrawnNumber = newDrawnNumbers[newDrawnNumbers.length - 1];
            this.bigNumberClosed = false; // Reset flag para mostrar o novo número
          }
          
          this.drawnNumbers = newDrawnNumbers;
          this.bingoClaims = data.room.bingo_claims || [];
          this.winner = data.room.winner 
            ? this.bingoClaims.find(c => c.user_id === data.room.winner && c.is_valid)
            : null;
          this.gameFinished = !!this.winner;
          
          // Carrega tema se necessário
          if (this.theme && this.themeData.length === 0) {
            await this.loadTheme();
          }
        }
        
        if (data.users) {
          this.users = data.users;
        }
      } catch (error) {
        console.error('Erro ao carregar dados da sala:', error);
      }
    },
    async loadTheme() {
      try {
        // Busca o path do tema usando a configuração
        const { getThemePath } = await import('../config/themes.js');
        const themePath = getThemePath(this.theme);
        const response = await fetch(themePath);
        this.themeData = await response.json();
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    },
    getDrawnNumberItem(number) {
      if (!this.themeData || this.themeData.length === 0) {
        return null;
      }
      
      // Converte para número para garantir comparação correta
      const num = typeof number === 'string' ? parseInt(number, 10) : number;
      
      // Busca pelo campo number do JSON
      const item = this.themeData.find(t => {
        const itemNum = typeof t.number === 'string' ? parseInt(t.number, 10) : t.number;
        return itemNum === num;
      });
      return item || null;
    },
    getDrawnNumberColor(number) {
      const item = this.getDrawnNumberItem(number);
      return item && item.color ? item.color : '#6c757d';
    },
    getDrawnNumberDisplay(number) {
      const item = this.getDrawnNumberItem(number);
      if (item) {
        return `${item.word} (${number})`;
      }
      return number;
    },
    async drawNumber() {
      if (!this.themeData || this.themeData.length === 0) {
        alert('Tema não carregado. Aguarde...');
        return;
      }
      
      this.loading = true;
      
      try {
        // Pega todos os números disponíveis do tema (usando o campo number do JSON)
        const themeNumbers = this.themeData.map(item => item.number).filter(n => n !== undefined && n !== null);
        
        if (themeNumbers.length === 0) {
          alert('Nenhum número disponível no tema!');
          this.loading = false;
          return;
        }
        
        // Sorteia um número do tema que ainda não foi sorteado
        const available = themeNumbers.filter(n => !this.drawnNumbers.includes(n));
        
        if (available.length === 0) {
          alert('Todos os números do tema já foram sorteados!');
          this.loading = false;
          return;
        }
        
        const randomIndex = Math.floor(Math.random() * available.length);
        const number = available[randomIndex];
        
        const response = await fetch('/api/draw-number', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: this.room_id,
            number,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao sortear número');
        }
        
        this.drawnNumbers = data.drawn_numbers;
        this.lastDrawnNumber = number;
        this.bigNumberClosed = false; // Mostra o número recém sorteado
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('pt-BR');
    },
    copyRoomId() {
      navigator.clipboard.writeText(this.room_id);
      alert('ID da sala copiado!');
    },
    continueGame() {
      // Permite continuar o jogo mesmo após bingo
      this.gameFinished = false;
    },
    newGame() {
      if (confirm('Deseja realmente iniciar um novo jogo? Isso resetará todos os dados.')) {
        // Aqui você pode adicionar lógica para resetar o jogo
        this.$router.push('/create-room');
      }
    },
    closeBigNumber() {
      this.bigNumberClosed = true; // Marca como fechado para não reabrir no polling
      // Não remove lastDrawnNumber, apenas marca que foi fechado
    },
    startPolling() {
      this.pollInterval = setInterval(() => {
        this.loadRoomData();
      }, 2000); // Atualiza a cada 2 segundos
    },
    endGame() {
      this.showEndGameModal = true;
    },
    closeEndGameModal() {
      this.showEndGameModal = false;
    },
    async removeUser(user_id, user_name) {
      if (!confirm(`Tem certeza que deseja expulsar ${user_name} da sala?`)) {
        return;
      }
      
      this.loading = true;
      
      try {
        const response = await fetch('/api/delete-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: this.room_id,
            user_id,
            password_admin: this.password,
          }),
        });
        
        // Verifica se a resposta é JSON antes de fazer parse
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Resposta não é JSON:', text);
          throw new Error('Erro ao remover usuário: resposta inválida do servidor');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao remover usuário');
        }
        
        // Recarrega os dados da sala para atualizar a lista
        await this.loadRoomData();
        alert(`${user_name} foi expulso da sala.`);
      } catch (error) {
        console.error('Erro ao remover usuário:', error);
        alert(error.message || 'Erro ao remover usuário. Verifique o console para mais detalhes.');
      } finally {
        this.loading = false;
      }
    },
    async confirmEndGame() {
      this.loading = true;
      
      try {
        const response = await fetch('/api/delete-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: this.room_id,
            password_admin: this.password,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao encerrar jogo');
        }
        
        // Remove do localStorage
        localStorage.removeItem('host_room');
        
        // Redireciona para a página inicial
        alert('Jogo encerrado com sucesso!');
        this.$router.push('/');
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
        this.showEndGameModal = false;
      }
    },
  },
};
</script>

<style scoped>
.host-room-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.room-header {
  text-align: center;
  margin-bottom: 30px;
}

.room-id {
  font-size: 18px;
  margin: 10px 0;
}

.btn-secondary {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.host-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.draw-section {
  grid-column: 1 / -1;
  background: #ffffff1f;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.drawn-numbers-display {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
  min-height: 100px;
}

.big-number-display {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.big-number-content {
  text-align: center;
  color: white;
}

.big-number-label {
  font-size: 48px;
  margin-bottom: 30px;
  text-shadow: 4px 4px 20px rgba(0, 0, 0, 0.8);
  opacity: 0.8;
}

.big-number-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin: 40px 0;
}

.big-number-image {
  max-width: 25vh;
  max-height: 25vh;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
}

.big-number-word {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 4px 4px 20px rgba(0,0,0,0.8);
  color: white;
  text-align: center;
}

.big-number-id {
  font-size: 60px;
  opacity: 0.6;
  margin-top: 20px;
}

.big-number-hint {
  font-size: 24px;
  opacity: 0.5;
  margin-top: 30px;
}

.drawn-numbers-display {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
  min-height: 120px;
}

.drawn-number-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  min-width: 100px;
  min-height: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  color: white;
  text-align: center;
}

.drawn-number-card:hover {
  transform: scale(1.05);
}

.drawn-number-image {
  max-width: 60px;
  max-height: 60px;
  width: auto;
  height: auto;
  object-fit: contain;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.drawn-number-word {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  word-break: break-word;
  line-height: 1.2;
}

.drawn-number-id {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 500;
}

.btn-view-all {
  padding: 10px 20px;
  background: var(--bingo-blue-200);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
  transition: background 0.2s;
}

.btn-view-all:hover {
  background: var(--bingo-blue-300);
}

.all-numbers-modal {
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.modal-header h2 {
  margin: 0;
  color: white;
}

.btn-close-modal {
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.1);
}

.all-numbers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

.drawn-number-card-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 12px;
  min-height: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: white;
  text-align: center;
}

.drawn-number-card-modal .drawn-number-image {
  max-width: 70px;
  max-height: 70px;
  width: auto;
  height: auto;
  object-fit: contain;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.drawn-number-card-modal .drawn-number-word {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  word-break: break-word;
  line-height: 1.2;
}

.drawn-number-card-modal .drawn-number-id {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

.btn-draw {
  padding: 20px 40px;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(180deg, #7fc5ff 0%, #2e99f1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(46, 153, 241, 0.4);
  transition: all 0.3s;
}

.btn-draw:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(46, 153, 241, 0.6);
}

.btn-draw:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats {
  margin-top: 20px;
  font-size: 18px;
  color: var(--text-color);
}

.results-section {
  background: #ffffff1f;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.players-section {
  background: #ffffff1f;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.no-claims {
  text-align: center;
  padding: 40px;
  color: #999;
}

.claims-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.claim-item {
  display: grid;
  grid-template-columns: 50px 100px 1fr auto;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #ddd;
}

.claim-item.valid {
  border-left-color: #4caf50;
  background: #e8f5e9;
}

.claim-item.invalid {
  border-left-color: #f44336;
  background: #ffebee;
}

.claim-order {
  font-weight: 700;
  font-size: 18px;
}

.claim-time {
  font-size: 12px;
  color: #666;
}

.claim-name {
  font-weight: 600;
}

.claim-status {
  font-weight: 600;
}

.winner-announcement {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 12px;
  margin: 20px 0;
}

.winner-announcement h3 {
  font-size: 32px;
  margin-bottom: 10px;
}

.winner-name {
  font-size: 24px;
  font-weight: 700;
}

.btn-continue,
.btn-new-game {
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-continue {
  background: #4caf50;
  color: white;
}

.btn-new-game {
  background: var(--bingo-blue-200);
  color: white;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--hover-navbar);
  border-radius: 8px;
}

.player-item.winner {
  background: #fff9c4;
  border: 2px solid #ffd700;
}

.player-name {
  font-weight: 600;
}

.player-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-status {
  font-size: 14px;
  color: #666;
}

.btn-remove-user {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 6px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-user:hover {
  background: rgba(220, 53, 69, 0.2);
}

.end-game-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ddd;
}

.btn-end-game {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: 600;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-end-game:hover {
  background: #d32f2f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff1f;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.modal-content h2 {
  margin-bottom: 15px;
  color: #f44336;
}

.warning-text {
  color: #f44336;
  font-weight: 600;
  margin: 15px 0;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
}

.btn-cancel {
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm-end {
  padding: 12px 24px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm-end:hover {
  background: #d32f2f;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--bingo-blue-200);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .host-container {
    grid-template-columns: 1fr;
  }
  
  .claim-item {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}
</style>

