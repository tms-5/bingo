<template>
  <NavbarVue />
  <div id="app" class="container">
    <router-view />
  </div>
</template>

<script>
import './assets/style.css';
import NavbarVue from './components/navbar/NavbarVue.vue';

export default {
  name: 'App', 
  components: {
    NavbarVue,
  },
};
</script>

<style>
:root {
  --background-color: #ffffff;
  --text-color: #000000;
  --bingo-blue-200: #2E99F1;
  --navbar-bg: #f5f5f5;
  --navbar-color: #000000;
  --hover-navbar: #cccccc;
}

body.dark-mode {
  --background-color: #121212;
  --text-color: #ffffff;
  --navbar-bg: #242526;
  --navbar-color: #f2f2f2;
  --hover-navbar: #5c5c5c;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
</style>
