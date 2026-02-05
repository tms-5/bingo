<template>
  <div class="host-landing">
    <h1 class="page-title">Host</h1>
    <p class="page-subtitle">Escolha uma opção</p>
    <div class="host-options">
      <router-link to="/create-room" class="host-option card-create">
        <span class="option-icon">➕</span>
        <span class="option-label">Criar nova sala</span>
      </router-link>
      <router-link
        v-if="hasHostSession"
        :to="`/host-room/${hostSession.room_id}`"
        class="host-option card-return"
      >
        <span class="option-icon">🎮</span>
        <span class="option-label">Voltar à minha sala</span>
        <span class="option-hint">Sala {{ hostSession.room_id }}</span>
      </router-link>
      <router-link
        v-else
        to="/host-login"
        class="host-option card-return"
      >
        <span class="option-icon">🔑</span>
        <span class="option-label">Entrar em sala existente</span>
        <span class="option-hint">ID e senha do host</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { SessionManager } from '../utils/session.js';

export default {
  name: 'HostLandingPage',
  data() {
    return {
      hostSession: null,
    };
  },
  computed: {
    hasHostSession() {
      return !!(this.hostSession && this.hostSession.room_id);
    },
  },
  mounted() {
    this.hostSession = SessionManager.getHostSession();
  },
};
</script>

<style scoped>
.host-landing {
  padding: 40px 20px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  color: var(--text-color);
  font-size: 28px;
  margin-bottom: 8px;
}

.page-subtitle {
  color: var(--text-secondary, #666);
  margin-bottom: 32px;
}

.host-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.host-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  background: var(--background-color);
  border: 2px solid var(--bingo-blue-200);
  transition: background 0.2s, transform 0.2s;
}

.host-option:hover {
  background: rgba(46, 153, 241, 0.1);
  transform: translateY(-2px);
}

.option-icon {
  font-size: 32px;
}

.option-label {
  font-weight: 600;
  font-size: 18px;
}

.option-hint {
  font-size: 14px;
  opacity: 0.8;
}
</style>
