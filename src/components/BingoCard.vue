<template>
  <div class="bingo-card">
    <h1>BINGO</h1>
    <div class="bingo-grid">
      <div v-for="(word, index) in words" :key="index" class="bingo-cell" :style="{ backgroundColor: word.color }">
        <img :src="word.image" :alt="word.word" class="bingo-card-image" />
        <p class="bingo-card-text">{{ word.word }}</p>
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
  },
};
</script>

<style scoped>
h1 {
  color: black;
}

.bingo-card-image {
  max-height: 66px;
  max-width: 100px;
}

.bingo-card-text {
  font-size: 16px;
  color: #000;
  margin: 5px 0 0 0;
  font-weight: 700;
}
</style>
