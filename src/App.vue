<template>
  <NavbarVue class="no-print" />
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
  --text-secondary: #666666;
  --bingo-blue-200: #2E99F1;
  --navbar-bg: #f5f5f5;
  --navbar-color: #000000;
  --hover-navbar: #cccccc;
  --background-danger: #ffebee;
  --text-danger: #b00020;
  --background-success: #e8f5e9;
  --text-success: #1b5e20;
  --background-warning: #fff3cd;
  --text-warning: #856404;
}

body.dark-mode {
  --background-color: #121212;
  --text-color: #ffffff;
  --text-secondary: #767676;
  --navbar-bg: #242526;
  --navbar-color: #f2f2f2;
  --hover-navbar: #5c5c5c;
  --background-danger: #4a1417;
  --text-danger: #ffcdd2;
  --background-success: #1b5e20;
  --text-success: #e8f5e9;
  --background-warning: #b17c00;
  --text-warning: #fff0a3;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

html {
  height: 100%;
}

/* Estilos globais de impressão */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  body {
    background: white !important;
    color: black !important;
  }

  .container {
    background: white !important;
  }

  .no-print {
    display: none !important;
  }
}
</style>
