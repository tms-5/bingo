<template>
  <div class="virtual-card">
    <h1 class="c-blue-200 fw-700">Cartela Virtual</h1>
    <div class="controls">
      <button @click="resetCard">Resetar Cartela</button>
    </div>
    <div class="bingo-grid">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        class="bingo-cell"
        :class="{ marked: cell.marked }"
        :style="{ backgroundColor: cell.color }"
        @click="toggleCell(index)">
        <img :src="cell.image" :alt="cell.word" class="word-image" />
        <p class="word-text">{{ cell.word }}</p>
      </div>
    </div>
    <div v-if="bingo" class="bingo-overlay">
      <h1>BINGO!</h1>
      <button @click="close">Fechar</button>
    </div>
    <div class="controls">
      <button @click="genereteNewCard">Gerar nova cartela</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cells: [],
      bingo: false,
    };
  },
  async mounted() {
    await this.loadCard();
  },
  methods: {
    async loadCard() {
      const savedCard = JSON.parse(localStorage.getItem('virtual-card'));
      if (savedCard) {
        this.cells = savedCard;
      } else {
        const response = await fetch('/christmas-words-2.json');
        const words = await response.json();
        this.cells = this.shuffle(words).slice(0, 16).map((word) => ({
          word: word.word,
          image: word.image,
          color: word.color,
          marked: false,
        }));
        this.saveCard();
      }
    },
    toggleCell(index) {
      this.cells[index].marked = !this.cells[index].marked;
      this.saveCard();
      this.checkBingo();
    },
    saveCard() {
      localStorage.setItem('virtual-card', JSON.stringify(this.cells));
    },
    resetCard() {
      if (confirm('Deseja realmente resetar a cartela?')) {
        localStorage.removeItem('virtual-card');
        this.cells.forEach((cell) => (cell.marked = false));
        this.bingo = false;
        this.saveCard();
      }
    },
    checkBingo() {
      this.bingo = this.cells.every((cell) => cell.marked);
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    close() {
      this.bingo = false;
    },
    genereteNewCard() {
      if (confirm('Deseja realmente gerar uma nova cartela?')) {
      localStorage.removeItem('virtual-card');
      this.cells.forEach((cell) => (cell.marked = false));
      this.bingo = false;
      this.loadCard();
      }
    },
      back() {
          this.$router.push('/');
      },
  },
};
</script>

<style scoped>
  .virtual-card {
    text-align: center;
    padding: 20px;
  }

  .bingo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  @media screen and (max-width: 800px) {
    .bingo-grid {
      grid-template-columns: repeat(3, 1fr);
    }    
  }

  @media screen and (max-width: 600px) {
    .bingo-grid {
      grid-template-columns: repeat(2, 1fr);
    }    
    
  }

  .bingo-cell {
    font-size: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(100% - 32px);
    height: calc(100% - 32px);
    margin: auto;
    padding: 16px;
    animation: zoomIn 0.5s ease-out;
    border-radius: 20px;
    backdrop-filter: blur(25px);
    color: black;
    cursor: pointer;
  }

  .bingo-cell:hover {
    transform: scale(1.1);
  }

  .bingo-cell.marked img {
    opacity: 0.5;
  }

.bingo-cell.marked {
    background-color: rgba(0, 0, 0, 0.6) !important;
    color: #8e8e8e;
  }


  .bingo-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    z-index: 9999;
  }

  .controls {
    margin-top: 20px;
  }

  button {
    padding: 10px 20px;
    margin: 10px;
    background-color: #ff4500;
    color: #fff;
    border: none;
    cursor: pointer;
  }
</style>
