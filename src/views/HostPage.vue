<template>
  <div class="host">
    <h1 class="c-blue-200 fw-400">Host</h1>
    <div class="controls">
      <button @click="drawItem">Anunciar Item</button>
    </div>
    <div class="current-item" v-if="currentItem">
      <div
        class="item-display"
        :style="{ backgroundColor: currentItem.color }"
        v-if="displayItem">
        <p>{{ currentItem.word }}</p>
        <img :src="currentItem.image" alt="Imagem do Item" />
      </div>
    </div>
    <div class="history">
      <h1 class="c-blue-200 fw-400">Histórico</h1>
      <div class="grid-history">
        <li
          v-for="(item, index) in history"
          :key="index"
          class="item-display item-history"
          :style="{ backgroundColor: item.color }">
          <p>{{ item.word }}</p>
          <img :src="item.image" alt="Imagem do Item" />
        </li>
      </div>
    </div>
    <div class="controls">
      <button @click="clearHistory">Limpar Histórico</button>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            allItems: [],
            currentItem: null,
            history: [],
            displayItem: true,
        };
    },
    async mounted() {
        await this.loadItems();
        this.loadHistory();
    },
    methods: {
        async loadItems() {
            if (!this.allItems.length) {
                const response = await fetch('/christmas-words-2.json');
                this.allItems = await response.json();
            }
        },
        drawItem() {
            this.displayItem = false;
            const remainingItems = this.allItems.filter(
                (item) => !this.history.find((h) => h.word === item.word)
            );
            if (remainingItems.length === 0) {
                alert('Todos os itens já foram anunciados!');
                return;
            }
            const randomItem =
                remainingItems[Math.floor(Math.random() * remainingItems.length)];
                this.classAnimation = "animation";
            this.currentItem = randomItem;
            setTimeout(() => {
                this.displayItem = true;
            }, 500);
            setTimeout(() => {
                this.history.unshift(randomItem);
                this.saveHistory();
            }, 1300);
        },
        saveHistory() {
            const historyToSave = this.history.map(item => ({
                word: item.word,
                image: item.image,
                color: item.color
            }));
            localStorage.setItem('bingo-history', JSON.stringify(historyToSave));
        },
        loadHistory() {
            const savedHistory = JSON.parse(localStorage.getItem('bingo-history'));
            if (savedHistory) {
                this.history = savedHistory;
                this.currentItem = savedHistory[0] || null;
            }
        },
        clearHistory() {
            if (confirm('Deseja realmente limpar o histórico?')) {
                localStorage.removeItem('bingo-history');
                this.history = [];
                this.currentItem = null;
            }
        },
    },
};
</script>

<style>
.host {
    text-align: center;
    padding: 20px;
}

.controls {
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    margin: 10px;
    background-color: #ff4500;
    color: #fff;
    border: none;
    cursor: pointer;
}

.animation {
    animation: zoomIn 0.5s ease-out;
}

.current-item {
    margin: 20px 0;
    min-height: 45vh;
}

.item-display {
    font-size: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30vw;
    height: 30vw;
    margin: auto;
    padding: 16px;
    animation: zoomIn 0.5s ease-out;
    border-radius: 20px;
    backdrop-filter: blur(25px);
    color: black;
    overflow: hidden;
}

.item-display img {
    height: 25vw;
    object-fit: contain;
}


.grid-history {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.item-history {
    zoom: 0.3;
}

@media screen and (max-width: 1200px) {
    .item-history {
        zoom: 0.5;
    }
}

@media screen and (max-width: 800px) {
    .item-history {
        zoom: 0.8;
    }
}

.item-display p,
.item-history p {
    margin: 8px;
}

.history {
    margin-top: 20px;
}

.history ul {
    list-style: none;
    padding: 0;
}

.history li {
    font-size: 1.2rem;
    margin: 5px 0;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
