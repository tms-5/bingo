<template>
  <div class="bingo-card">
    <h1>BINGO</h1>
    <div class="bingo-grid">
      <div v-for="(word, index) in words" :key="index" class="bingo-cell" :style="{ backgroundColor: word.color }">
        <img 
          v-if="!isNumberTheme && word.image" 
          :src="word.image" 
          :alt="word.word" 
          class="bingo-card-image"
        />
        <p 
          class="bingo-card-text"
          :class="{ 'number-large': isNumberTheme }"
        >
          {{ word.word }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    words: {
      type: Array,
      required: true,
    },
    items: {
      type: Number,
      required: true,
    },
    theme: {
      type: String,
      default: '',
    },
  },
  computed: {
    isNumberTheme() {
      return this.theme === 'numbers';
    },
  },
};
</script>

<style scoped>
.bingo-card {
  background: white;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  page-break-inside: avoid;
}

h1 {
  color: black;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.bingo-grid {
  display: grid;
  grid-template-columns: repeat(var(--items-per-line, 4), 1fr);
  gap: 8px;
}

.bingo-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  background: white;
  page-break-inside: avoid;
}

.bingo-card-image {
  max-height: 60px;
  max-width: 80px;
  object-fit: contain;
  margin-bottom: 5px;
}

.bingo-card-image.number-only {
  display: none;
}

.bingo-card-text {
  font-size: 14px;
  color: #000;
  margin: 0;
  font-weight: 700;
  text-align: center;
  word-break: break-word;
}

.bingo-card-text.number-large {
  font-size: 48px;
  font-weight: 900;
  margin: 0;
  line-height: 1;
}

/* Estilos de impressão */
@media print {
  .bingo-card {
    background: white !important;
    border: 2px solid #000 !important;
    box-shadow: none !important;
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 25px;
  }

  .bingo-cell {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    border: 1px solid #000 !important;
  }
  .bingo-card-image {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
