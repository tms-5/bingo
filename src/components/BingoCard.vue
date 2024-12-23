<template>
  <div class="bingo-card">
    <h1>BINGO</h1>
    <div class="bingo-grid">
      <div
        v-for="(word, index) in words"
        :key="index"
        class="bingo-cell"
        :style="{ backgroundColor: word.color }">
        <img :src="word.image" :alt="word.word" class="word-image" />
        <p class="word-text">{{ word.word }}</p>
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
</style>
