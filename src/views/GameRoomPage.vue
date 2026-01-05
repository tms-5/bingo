<template>
  <div class="game-room-page">
    <div class="room-header">
      <h1 class="c-blue-200 fw-700">{{ room_name }}</h1>
      <p class="room-id">Sala: {{ room_id }}</p>
      <p class="user-name">Jogador: {{ user_name }}</p>
    </div>

    <div v-if="loadingTheme" class="setup-container">
      <h2>Carregando tema...</h2>
    </div>

    <div v-else-if="!cardsGenerated" class="setup-container">
      <h2>Gerando sua cartela...</h2>
    </div>

    <div v-else class="game-container">
      <!-- Cartela -->
      <div class="cards-container">
        <div class="bingo-card-wrapper">
          <h3>Minha Cartela</h3>
          <div class="bingo-grid">
            <div
              v-for="(row, rowIndex) in card"
              :key="rowIndex"
              class="bingo-row"
            >
              <div
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                class="bingo-cell"
                :class="{ 
                  marked: isMarked(cell.number, 0)
                }"
                :style="{ backgroundColor: (cell && cell.color) ? cell.color : '#f0f0f0' }"
                @click="toggleMark(cell.number, 0)"
              >
                <div class="cell-content">
                  <img v-if="cell && cell.image" :src="cell.image" :alt="cell.word || 'Item'" class="cell-image" />
                  <span v-if="cell && cell.word" class="cell-word">{{ cell.word }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Números sorteados embaixo do card -->
      <div class="drawn-numbers-container">
        <h3>2 Últimos Números Sorteados</h3>
        <div class="drawn-numbers">
          <span 
            v-for="num in drawnNumbers" 
            :key="num" 
            class="drawn-number"
          >
            {{ getDrawnNumberDisplay(num) }}
          </span>
        </div>
      </div>

      <!-- Botão Bingo -->
      <div class="bingo-button-container">
        <button 
          @click="claimBingo" 
          :disabled="bingoClaimed || isWinner"
          class="btn-bingo"
        >
          {{ bingoClaimed ? 'Bingo Já Reivindicado' : isWinner ? 'Você Ganhou!' : 'BINGO!' }}
        </button>
      </div>

      <!-- Resultados -->
      <div v-if="bingoClaims.length > 0" class="results-container">
        <h3>Resultados</h3>
        <div class="claims-list">
          <div 
            v-for="(claim, index) in bingoClaims" 
            :key="index"
            class="claim-item"
            :class="{ 
              valid: claim.is_valid, 
              invalid: !claim.is_valid,
              winner: claim.is_valid && claim.user_id === user_id
            }"
          >
            <span class="claim-order">{{ index + 1 }}º</span>
            <span class="claim-name">{{ claim.user_name }}</span>
            <span class="claim-status">
              {{ claim.is_valid ? '✓ Bingo Válido!' : '✗ Bingo Inválido' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Modal de resultado -->
      <div v-if="showResultModal" class="modal-overlay" @click="closeResultModal">
        <div class="modal-content" @click.stop>
          <h2>{{ bingoResult.is_valid ? '🎉 BINGO VÁLIDO! 🎉' : '❌ Bingo Inválido' }}</h2>
          <p v-if="bingoResult.is_valid">
            Parabéns! Seu bingo foi validado!
          </p>
          <p v-else>
            Infelizmente seu bingo não foi válido. Continue jogando!
          </p>
          <button @click="closeResultModal" class="btn-primary">OK</button>
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
  name: 'GameRoomPage',
  data() {
    return {
      room_id: null,
      room_name: '',
      user_id: null,
      user_name: '',
      theme: null,
      card_size: 16,
      themeData: [], // Dados do tema (JSON)
      card: [], // Uma única cartela
      cardsGenerated: false,
      loadingTheme: false,
      drawnNumbers: [],
      markedNumbers: { 0: [] }, // Apenas uma cartela (índice 0)
      bingoClaimed: false,
      isWinner: false,
      bingoClaims: [],
      showResultModal: false,
      bingoResult: null,
      loading: false,
      pollInterval: null,
    };
  },
  async mounted() {
    // Recupera sessão do localStorage
    const session = localStorage.getItem('user_session');
    if (!session) {
      this.$router.push('/join-room');
      return;
    }

    const sessionData = JSON.parse(session);
    this.room_id = this.$route.params.room_id || sessionData.room_id;
    this.user_id = sessionData.user_id;
    this.user_name = sessionData.user_name;
    this.room_name = sessionData.room_name;

    // Aguarda carregar dados da sala primeiro para ter theme e card_size
    await this.loadRoomData();
    
    // Garante que temos theme e card_size (usa valores padrão se necessário)
    if (!this.theme) {
      const { themes } = await import('../config/themes.js');
      console.warn('Theme não disponível, usando padrão:', themes[0].id);
      this.theme = themes[0].id;
    }
    if (!this.card_size) {
      console.warn('card_size não disponível, usando padrão: 16');
      this.card_size = 16;
    }
    
    // Verifica se o usuário já tem cartela no banco
    const user = await this.getUserFromServer();
    if (user && user.cards && user.cards.length > 0 && user.cards[0] && user.cards[0].length > 0) {
      // Usuário já tem cartela no servidor, carrega ela
      // Verifica se a cartela tem image e color, se não, precisa recarregar do tema
      const needsReload = user.cards[0].some(row => 
        row.some(cell => !cell.image || !cell.color)
      );
      
      if (needsReload) {
        console.log('Cartela do servidor sem image/color, recarregando do tema...');
        await this.loadTheme();
        // Recarrega os dados do tema para cada célula
        this.card = user.cards[0].map(row => 
          row.map(cell => {
            if (cell && cell.number && this.themeData) {
              // Busca pelo campo number do JSON
              const themeItem = this.themeData.find(t => t.number === cell.number);
              if (themeItem) {
                return {
                  number: cell.number,
                  word: themeItem.word || cell.word,
                  color: themeItem.color || cell.color || '#f0f0f0',
                  image: themeItem.image || cell.image || '',
                };
              }
            }
            return cell;
          })
        );
        // Salva a cartela atualizada
        this.saveCard();
      } else {
        this.card = user.cards[0];
        // Verifica se realmente tem todos os dados
        const hasAllData = this.card.every(row => 
          row.every(cell => cell && cell.image && cell.color && cell.word)
        );
        if (!hasAllData) {
          console.log('Cartela do servidor não tem todos os dados, recarregando do tema...');
          await this.loadTheme();
          this.card = this.card.map(row => 
            row.map(cell => {
              if (cell && cell.number && this.themeData) {
                // Busca pelo campo number do JSON
                const themeItem = this.themeData.find(t => t.number === cell.number);
                if (themeItem) {
                  return {
                    number: cell.number,
                    word: themeItem.word || cell.word,
                    color: themeItem.color || cell.color || '#f0f0f0',
                    image: themeItem.image || cell.image || '',
                  };
                }
              }
              return cell;
            })
          );
          this.saveCard();
        }
      }
      
      // Garante que o tema está carregado para exibir números sorteados
      if (!this.themeData || this.themeData.length === 0) {
        await this.loadTheme();
      }
      
      this.cardsGenerated = true;
      this.loadingTheme = false;
      // Tenta recuperar números marcados do localStorage (usando room_id)
      const savedMarked = localStorage.getItem(`marked_${this.room_id}_${this.user_name}`);
      if (savedMarked) {
        try {
          this.markedNumbers = JSON.parse(savedMarked);
        } catch (e) {
          this.markedNumbers = { 0: [] };
        }
      } else {
        this.markedNumbers = { 0: [] };
      }
      } else {
        // Tenta recuperar cartela salva do localStorage usando room_id como identificador
        const savedCard = localStorage.getItem(`card_${this.room_id}_${this.user_name}`);
      if (savedCard) {
        try {
          const cardData = JSON.parse(savedCard);
          if (cardData.card && Array.isArray(cardData.card) && cardData.card.length > 0) {
            // Verifica se precisa recarregar dados do tema
            const needsReload = cardData.card.some(row => 
              row.some(cell => !cell.image || !cell.color)
            );
            
            if (needsReload) {
              console.log('Cartela do localStorage sem image/color, recarregando do tema...');
              await this.loadTheme();
              // Recarrega os dados do tema para cada célula
              this.card = cardData.card.map(row => 
                row.map(cell => {
                  if (cell.number && this.themeData) {
                    // Busca pelo campo number do JSON
                    const themeItem = this.themeData.find(t => t.number === cell.number);
                    if (themeItem) {
                      return {
                        ...cell,
                        image: themeItem.image,
                        color: themeItem.color,
                        word: themeItem.word,
                      };
                    }
                  }
                  return cell;
                })
              );
            } else {
              this.card = cardData.card;
            }
            
            // Garante que o tema está carregado para exibir números sorteados
            if (!this.themeData || this.themeData.length === 0) {
              await this.loadTheme();
            }
            
            this.markedNumbers = cardData.markedNumbers || { 0: [] };
            this.cardsGenerated = true;
            this.loadingTheme = false;
          } else {
            throw new Error('Cartela inválida');
          }
        } catch (e) {
          console.error('Erro ao carregar cartela salva:', e);
          // Se houver erro, gera nova cartela
          await this.generateNewCard();
        }
      } else {
        // Gera cartela automaticamente se não existir
        await this.generateNewCard();
      }
    }

    // Inicia polling para atualizar números sorteados e resultados
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
        if (!this.room_id) {
          console.error('room_id não disponível');
          return;
        }
        
        const response = await fetch(`/api/get-room?room_id=${this.room_id}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar sala: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.room) {
          throw new Error('Sala não encontrada na resposta');
        }
        
        this.drawnNumbers = data.room.drawn_numbers.slice(data.room.drawn_numbers.length - 2).reverse();
        this.bingoClaims = data.room.bingo_claims || [];
        
        // Atualiza theme e card_size (usa valores padrão se não existirem)
        if (!this.theme && !data.room.theme) {
          const { themes } = await import('../config/themes.js');
          this.theme = themes[0].id;
        } else {
          this.theme = data.room.theme || this.theme;
        }
        this.card_size = data.room.card_size || this.card_size || 16;
        
        // Atualiza room_name se estiver na resposta
        if (data.room.room_name) {
          this.room_name = data.room.room_name;
        }
        
        // Verifica se o usuário já ganhou
        if (data.users) {
          const user = data.users.find(u => u.user_id === this.user_id);
          if (user) {
            this.isWinner = user.is_winner;
            this.bingoClaimed = user.has_bingo;
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados da sala:', error);
        throw error; // Propaga o erro para o chamador
      }
    },
    async getUserFromServer() {
      try {
        const response = await fetch(`/api/get-room?room_id=${this.room_id}`);
        const data = await response.json();
        if (data.users) {
          return data.users.find(u => u.user_id === this.user_id);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
      return null;
    },
    async loadTheme() {
      // Se já está carregando ou já tem dados, não faz nada
      if (this.loadingTheme) {
        // Aguarda o carregamento atual terminar
        while (this.loadingTheme) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
      }
      
      if (this.themeData.length > 0) {
        return; // Já tem dados carregados
      }
      
      this.loadingTheme = true;
      try {
        // Carrega o JSON do tema
        // Busca o path do tema usando a configuração
        const { getThemePath } = await import('../config/themes.js');
        const themePath = getThemePath(this.theme);
        console.log('Carregando tema:', themePath);
        
        const response = await fetch(themePath);
        if (!response.ok) {
          throw new Error(`Erro ao carregar tema: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Tema carregado:', data?.length, 'itens');
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Tema vazio ou formato inválido');
        }
        
        this.themeData = data;
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
        this.themeData = []; // Limpa dados inválidos
        this.loadingTheme = false;
        throw error; // Propaga o erro
      } finally {
        this.loadingTheme = false;
      }
    },
    async generateNewCard() {
      try {
        if (!this.theme || !this.card_size) {
          console.error('Theme ou card_size não disponíveis:', {
            theme: this.theme,
            card_size: this.card_size,
            room_id: this.room_id
          });
          
          // Tenta carregar novamente os dados da sala
          await this.loadRoomData();
          
          if (!this.theme || !this.card_size) {
            throw new Error('Theme ou card_size não disponíveis após recarregar dados da sala');
          }
        }
        
        // Carrega o tema
        await this.loadTheme();
        
        // Verifica se o tema foi carregado corretamente
        if (!this.themeData || this.themeData.length === 0) {
          throw new Error('Tema não carregado ou vazio após tentativa de carregamento');
        }
        
        // Gera a cartela
        this.generateCard();
      } catch (error) {
        console.error('Erro ao gerar nova cartela:', error);
        this.loadingTheme = false;
        this.cardsGenerated = false;
        alert(`Erro ao gerar cartela: ${error.message}. Tente recarregar a página.`);
      }
    },
    generateCard() {
      if (!this.themeData || this.themeData.length === 0) {
        console.error('Tema não carregado');
        this.loadingTheme = false;
        return;
      }
      
      try {
        // Calcula dimensões da cartela (ex: 25 = 5x5, 16 = 4x4)
        const size = Math.sqrt(this.card_size);
        const rows = Math.floor(size);
        const cols = Math.ceil(this.card_size / rows);
        
        // Embaralha os dados do tema
        const shuffled = [...this.themeData].sort(() => Math.random() - 0.5);
        
        // Gera a cartela
        this.card = [];
        let itemIndex = 0;
        
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols && itemIndex < this.card_size; j++) {
            const item = shuffled[itemIndex % shuffled.length];
            if (!item || !item.word || !item.color || !item.image) {
              console.error('Item do tema inválido:', item, 'no índice', itemIndex);
            }
            const cellData = {
              number: item.number || itemIndex + 1, // Usa o number do JSON, fallback para índice + 1
              word: item.word || `Item ${itemIndex + 1}`,
              color: item.color || '#f0f0f0',
              image: item.image || '',
            };
            
            // Valida que tem todos os dados
            if (!cellData.image || !cellData.color || !cellData.word) {
              console.warn('Célula gerada sem dados completos:', cellData, 'Item original:', item);
            }
            
            row.push(cellData);
            itemIndex++;
          }
          this.card.push(row);
        }
        
        console.log('Cartela gerada - primeira célula:', this.card[0]?.[0]); // Log para debug
        console.log('Tema carregado com', this.themeData.length, 'itens');
        console.log('Primeiro item do tema:', this.themeData[0]);
        
        // Verifica se todas as células têm image e color
        const allCellsHaveData = this.card.every(row => 
          row.every(cell => cell && cell.image && cell.color && cell.word)
        );
        console.log('Todas as células têm dados completos?', allCellsHaveData);
        
        // Define CSS variable para grid
        this.$nextTick(() => {
          const root = document.documentElement;
          root.style.setProperty('--cols', cols);
        });
        
        this.cardsGenerated = true;
        this.markedNumbers = { 0: [] };
        this.loadingTheme = false;
        
        // Salva cartela
        this.saveCard();
      } catch (error) {
        console.error('Erro ao gerar cartela:', error);
        this.loadingTheme = false;
        alert('Erro ao gerar cartela. Tente recarregar a página.');
      }
    },
    isMarked(number, cardIndex) {
      if (!number) return false;
      const marked = this.markedNumbers[cardIndex] || [];
      return marked.includes(number);
    },
    toggleMark(number, cardIndex) {
      if (!number || this.bingoClaimed || this.isWinner) return;
      
      if (!this.markedNumbers[cardIndex]) {
        this.markedNumbers[cardIndex] = [];
      }
      
      const index = this.markedNumbers[cardIndex].indexOf(number);
      if (index > -1) {
        this.markedNumbers[cardIndex].splice(index, 1);
      } else {
        this.markedNumbers[cardIndex].push(number);
      }
      
      this.saveCard();
    },
    getCellColor(cell) {
      return cell.color || '#f0f0f0';
    },
    getDrawnNumberDisplay(number) {
      // Converte para número para garantir comparação correta
      const num = typeof number === 'string' ? parseInt(number, 10) : number;
      
      // Busca no tema pelo campo number
      if (this.themeData && this.themeData.length > 0) {
        const item = this.themeData.find(t => {
          const itemNum = typeof t.number === 'string' ? parseInt(t.number, 10) : t.number;
          return itemNum === num;
        });
        if (item && item.word) {
          return item.word; // Mostra apenas o nome do item
        }
      }
      
      // Fallback: busca na cartela
      if (this.card && this.card.length > 0) {
        for (const row of this.card) {
          for (const cell of row) {
            if (cell && cell.number) {
              const cellNum = typeof cell.number === 'string' ? parseInt(cell.number, 10) : cell.number;
              if (cellNum === num && cell.word) {
                return cell.word; // Mostra apenas o nome do item
              }
            }
          }
        }
      }
      
      // Último fallback: mostra apenas o número se não encontrar
      console.warn(`getDrawnNumberDisplay: Não encontrou item para número ${num}. ThemeData length: ${this.themeData?.length || 0}, Card: ${this.card ? 'existe' : 'não existe'}`);
      return `Número ${num}`;
    },
    async claimBingo() {
      if (this.bingoClaimed || this.isWinner) return;
      
      this.loading = true;
      
      try {
        const response = await fetch('/api/claim-bingo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          room_id: this.room_id,
          user_id: this.user_id,
          cards: Array.isArray(this.card) && Array.isArray(this.card[0]) ? [this.card] : [this.card], // Garante formato correto: [[cartela]]
          markedNumbers: this.markedNumbers,
        }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao validar bingo');
        }
        
        this.bingoClaimed = true;
        this.bingoResult = data.claim;
        this.showResultModal = true;
        
        if (data.claim.is_valid) {
          this.isWinner = true;
        }
        
        // Atualiza lista de claims
        await this.loadRoomData();
      } catch (error) {
        alert(error.message);
      } finally {
        this.loading = false;
      }
    },
    closeResultModal() {
      this.showResultModal = false;
    },
    saveCard() {
      // Salva usando nome da sala e nome do usuário como identificador
      localStorage.setItem(`card_${this.room_id}_${this.user_name}`, JSON.stringify({
        card: this.card,
        markedNumbers: this.markedNumbers,
      }));
      
      // Salva números marcados separadamente
      localStorage.setItem(`marked_${this.room_id}_${this.user_name}`, JSON.stringify(this.markedNumbers));
      
      // Salva no servidor também
      // this.card é um array de linhas: [[cell1, cell2], [cell3, cell4], ...]
      // cards deve ser um array de cartelas: [[[linha1], [linha2], ...]]
      // Então [this.card] cria o formato correto
      if (this.user_id && this.room_id && this.card && Array.isArray(this.card) && this.card.length > 0) {
        // Garante que não está salvando estrutura aninhada incorretamente
        const cardsToSave = Array.isArray(this.card[0]) ? [this.card] : [[this.card]];
        
        fetch('/api/save-cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.user_id,
            room_id: this.room_id,
            cards: cardsToSave,
          }),
        }).catch(err => console.error('Erro ao salvar cartela:', err));
      }
    },
    startPolling() {
      this.pollInterval = setInterval(() => {
        this.loadRoomData();
      }, 2000); // Atualiza a cada 2 segundos
    },
  },
};
</script>

<style scoped>
.game-room-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.room-header {
  text-align: center;
  margin-bottom: 30px;
}

.room-id {
  font-size: 18px;
  color: var(--text-color);
  opacity: 0.7;
}

.user-name {
  font-size: 16px;
  color: var(--text-color);
  opacity: 0.8;
}

.setup-container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(180deg, #7fc5ff 0%, #2e99f1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.bingo-card-wrapper {
  background: rgba(255, 255, 255, 0.215);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.bingo-card-wrapper h3 {
  text-align: center;
  margin-bottom: 15px;
  color: var(--text-color);
}

.bingo-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bingo-row {
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  gap: 4px;
}

.bingo-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  height: unset;
}

.bingo-cell:hover {
  transform: scale(1.05);
  border-color: var(--bingo-blue-200);
}

.bingo-cell.marked {
  opacity: 0.5;
  background-color: rgba(0, 0, 0, 0.3) !important;
  text-decoration: line-through;
}

.bingo-cell.center {
  background-color: #f0f0f0 !important;
  font-weight: 700;
  color: #666;
}

.cell-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 8px;
}

.cell-image {
  width: 100%;
  max-width: 120px;
  max-height: 120px;
  min-height: 60px;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
}

.cell-word {
  font-size: 16px;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
}

.drawn-numbers-container {
  margin: 30px 0;
  text-align: center;
}

.drawn-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.drawn-number {
  padding: 10px 15px;
  background: var(--bingo-blue-200);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
}

.bingo-button-container {
  text-align: center;
  margin: 30px 0;
}

.btn-bingo {
  padding: 20px 60px;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(180deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  transition: all 0.3s;
}

.btn-bingo:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.btn-bingo:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-container {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
}

.claims-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.claim-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
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

.claim-item.winner {
  border-left-color: #ffd700;
  background: #fff9c4;
  font-weight: 700;
}

.claim-order {
  font-weight: 700;
  font-size: 18px;
  min-width: 40px;
}

.claim-name {
  flex: 1;
  font-weight: 600;
}

.claim-status {
  font-weight: 600;
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
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 28px;
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
</style>

