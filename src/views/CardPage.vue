<template>
  <div class="app">
    <h1 class="c-blue-200 fw-700">Bingo de Natal</h1>
    <div class="bingo-instructions">
      <div>
        <p>
          Para gerar cartelas de bingo de Natal, insira a quantidade de itens
          por cartela e a quantidade de cartelas desejadas.
        </p>
        <p>
          As cartelas são geradas aleatoriamente a partir de uma lista de
          palavras relacionadas ao Natal.
        </p>
      </div>
      <div class='d-flex'>
        <div class='d-grid'>
          <label for="items" class='mb-sm'>Quantidade de itens por cartela:</label>
          <label for="cards">Insira a quantidade de cartelas:</label>
        </div>
        <div class='d-grid'>
          <select v-model="items" @change="updateItems($event.target.value)" class='mb-sm'>
            <option :value="9">9</option>
            <option :value="16">16</option>
            <option :value="25">25</option>
          </select>
          <input type="number" v-model.number="cards" placeholder="Insira a quantidade de cartelas (padrão é 1)" />
        </div>
      </div>
      <div>
        <button @click="generateCards">Gerar Cartelas</button>
        <button @click="print">Imprimir Cartelas</button>
      </div>
    </div>
    <div class="bingo-cards">
      <bingo-card v-for="(card, index) in bingoCards" :key="index" :words="card" :items="items"></bingo-card>
    </div>
  </div>
</template>

<script>
import BingoCard from '../components/BingoCard.vue';

export default {
  data() {
    return {
      items: 16,
      cards: 1,
      allWords: [],
      bingoCards: [],
    };
  },
  methods: {
    async fetchWords() {
      if (!this.allWords.length) {
        const response = await fetch('/christmas-words.json');
        this.allWords = await response.json();
        document.documentElement.style.setProperty('--items-per-line', 4);
      }
    },
    updateItems(value) {
      const itemsPerLine = Math.sqrt(value);
      this.items = value;
      document.documentElement.style.setProperty('--items-per-line', itemsPerLine);
      this.generateCards();
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    async generateCards() {
      await this.fetchWords();
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
input,
select {
  background-color: transparent;
  border: none;
  color: var(--text-color);
  outline: 1px solid var(--bingo-blue-200);
  border-radius: 4px;
  padding: 0 8px;
}
</style>