<template>
  <div class="card-page">
    <div class="card-controls no-print">
      <h1 class="c-blue-200 fw-700">Gerador de Cartelas para Impressão</h1>
      <div class="bingo-instructions">
        <div>
          <p>
            Para gerar cartelas de bingo, escolha o tema, a quantidade de itens
            por cartela e a quantidade de cartelas desejadas.
          </p>
          <p>
            As cartelas são geradas aleatoriamente a partir da lista de itens do tema escolhido.
          </p>
        </div>
        <div class='d-flex'>
          <div class='d-grid'>
            <label for="theme" class='mb-sm'>Tema:</label>
            <label for="items" class='mb-sm'>Quantidade de itens por cartela:</label>
            <label for="cards">Quantidade de cartelas:</label>
          </div>
          <div class='d-grid'>
            <select v-model="selectedTheme" @change="onThemeChange" class='mb-sm'>
              <option 
                v-for="themeOption in themes" 
                :key="themeOption.id" 
                :value="themeOption.id"
              >
                {{ themeOption.name }}
              </option>
            </select>
            <select v-model="items" @change="updateItems($event.target.value)" class='mb-sm'>
              <option :value="9">9 (3x3)</option>
              <option :value="12">12 (3x4)</option>
              <option :value="16">16 (4x4)</option>
              <option :value="20">20 (4x5)</option>
              <option :value="25">25 (5x5)</option>
            </select>
            <input 
              type="number" 
              v-model.number="cards" 
              min="1"
              placeholder="Quantidade de cartelas (padrão é 1)" 
            />
          </div>
        </div>
        <div class="button-group">
          <button @click="generateCards" class="btn-primary">Gerar Cartelas</button>
          <button @click="print" class="btn-secondary">Imprimir Cartelas</button>
        </div>
      </div>
    </div>
    <div class="bingo-cards">
      <bingo-card 
        v-for="(card, index) in bingoCards" 
        :key="index" 
        :words="card" 
        :items="items"
        :theme="selectedTheme"
      ></bingo-card>
    </div>
  </div>
</template>

<script>
import BingoCard from '../components/BingoCard.vue';
import { themes, getThemePath } from '../config/themes.js';

export default {
  name: 'CardPage',
  data() {
    return {
      themes,
      selectedTheme: themes[0].id,
      items: 16,
      cards: 1,
      allWords: [],
      bingoCards: [],
      loading: false,
    };
  },
  async mounted() {
    await this.loadTheme();
  },
  methods: {
    async onThemeChange() {
      await this.loadTheme();
      if (this.bingoCards.length > 0) {
        this.generateCards();
      }
    },
    async loadTheme() {
      this.loading = true;
      try {
        const themePath = getThemePath(this.selectedTheme);
        const response = await fetch(themePath);
        if (!response.ok) {
          throw new Error(`Erro ao carregar tema: ${response.status}`);
        }
        this.allWords = await response.json();
        const itemsPerLine = Math.round(Math.sqrt(this.items));
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
        alert('Erro ao carregar tema. Tente novamente.');
      } finally {
        this.loading = false;
      }
    },
    updateItems(value) {
      const itemsPerLine = Math.round(Math.sqrt(value));
      this.items = parseInt(value);
      if (this.bingoCards.length > 0) {
        this.generateCards();
      }
    },
    shuffle(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
    async generateCards() {
      if (this.allWords.length === 0) {
        await this.loadTheme();
      }
      
      if (this.allWords.length === 0) {
        alert('Erro ao carregar palavras do tema. Tente novamente.');
        return;
      }
      
      this.bingoCards = [];
      for (let i = 0; i < this.cards; i++) {
        const shuffled = this.shuffle([...this.allWords]).slice(0, this.items);
        this.bingoCards.push(shuffled);
      }
    },
    print() {
      window.print();
    },
  },
  components: {
    BingoCard,
  },
};
</script>

<style scoped>
.card-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-controls {
  margin-bottom: 30px;
}

.bingo-instructions {
  margin-top: 20px;
}

.bingo-instructions p {
  margin-bottom: 10px;
  line-height: 1.6;
}

.d-flex {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.d-grid {
  display: grid;
  gap: 10px;
}

.mb-sm {
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

input,
select {
  background-color: var(--background-color);
  border: 1px solid var(--bingo-blue-200);
  color: var(--text-color);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
}

input:focus,
select:focus {
  outline: 2px solid var(--bingo-blue-200);
  outline-offset: 2px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

button:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(180deg, #7fc5ff 0%, #2e99f1 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.bingo-cards {
  display: grid;
  gap: 30px;
  margin-top: 30px;
}

/* Estilos de impressão */
@media print {
  @page {
    margin: 20px;
    size: A4 landscape;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  body {
    background: white !important;
  }

  .no-print {
    display: none !important;
  }

  .card-page {
    padding: 0;
    margin: 0;
    max-width: 100%;
    background: white !important;
  }

  .bingo-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    page-break-inside: avoid;
    margin: 0;
    padding: 10px;
    background: white !important;
  }

  .bingo-card {
    page-break-inside: avoid;
    break-inside: avoid;
    width: 100%;
    height: auto;
    margin: 10px;
    padding: 15px;
    box-shadow: none;
    border: 2px solid #000;
    background: white !important;
  }

  /* Preserva as cores originais das células */
  .bingo-cell {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
  }

  .button-group {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
