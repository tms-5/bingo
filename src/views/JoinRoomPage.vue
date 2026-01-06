<template>
  <div class="join-room-page">
    <h1 class="c-blue-200 fw-700">Entrar na Sala</h1>
    
    <div class="form-container">
      <div class="form-group">
        <label for="room_id">ID da Sala</label>
        <input 
          id="room_id"
          v-model="room_id" 
          type="text" 
          placeholder="Digite o ID da sala"
          class="input-field"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Senha</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          placeholder="Digite a senha"
          class="input-field"
        />
      </div>
      
      <div class="form-group">
        <label for="user_name">Seu Nome</label>
        <input 
          id="user_name"
          v-model="user_name" 
          type="text" 
          placeholder="Digite seu nome"
          class="input-field"
        />
      </div>
      
      <div class="form-group">
        <label>Seu Avatar</label>
        <div class="avatar-preview-container" @click="showAvatarSelector = true">
          <img 
            :src="getAvatarPath(selectedAvatar)" 
            :alt="`Avatar ${selectedAvatar}`"
            class="avatar-preview-img"
          />
          <span class="avatar-change-text">Clique para alterar</span>
        </div>
      </div>
      
      <button @click="joinRoom" :disabled="loading || !room_id || !password || !user_name" class="btn-primary">
        {{ loading ? 'Entrando...' : 'Entrar na Sala' }}
      </button>
      
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
    
    <!-- Modal de seleção de avatar -->
    <div v-if="showAvatarSelector" class="modal-overlay" @click="showAvatarSelector = false">
      <div class="modal-content" @click.stop>
        <AvatarSelector
          :current-avatar="selectedAvatar"
          @select="handleAvatarSelect"
          @close="showAvatarSelector = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AvatarSelector from '../components/AvatarSelector.vue';

export default {
  name: 'JoinRoomPage',
  components: {
    AvatarSelector,
  },
  data() {
    return {
      room_id: '',
      password: '',
      user_name: '',
      selectedAvatar: 1,
      showAvatarSelector: false,
      loading: false,
      error: null,
    };
  },
  methods: {
    getAvatarPath(avatarNum) {
      return `/avatar/avatar-${avatarNum}.png`;
    },
    handleAvatarSelect(avatarNum) {
      this.selectedAvatar = avatarNum;
      this.showAvatarSelector = false;
    },
    async joinRoom() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('/api/join-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: this.room_id.toUpperCase(),
            password: this.password,
            user_name: this.user_name,
            avatar: this.selectedAvatar,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao entrar na sala');
        }
        
        // Salva no localStorage para reconexão
        localStorage.setItem('user_session', JSON.stringify({
          user_id: data.user_id,
          room_id: data.room_id,
          user_name: data.user_name,
          room_name: data.room_name,
          avatar: data.avatar || this.selectedAvatar,
        }));
        
        // Redireciona para a tela do jogo
        this.$router.push({
          name: 'GameRoom',
          params: { room_id: data.room_id },
        });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // Tenta recuperar sessão anterior
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        this.room_id = session.room_id;
        this.user_name = session.user_name;
        if (session.avatar) {
          this.selectedAvatar = session.avatar;
        }
      } catch (e) {
        // Ignora erro
      }
    }
  },
};
</script>

<style scoped>
.join-room-page {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
}

.form-container {
  margin-top: 30px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: var(--background-color);
  color: var(--text-color);
}

.input-field:focus {
  outline: none;
  border-color: var(--bingo-blue-200);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(180deg, #7fc5ff 0%, #2e99f1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  padding: 12px;
  background-color: #fee;
  color: #c33;
  border-radius: 8px;
  text-align: center;
}

.avatar-preview-container {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  background-color: var(--background-color);
}

.avatar-preview-container:hover {
  border-color: var(--bingo-blue-200);
}

.avatar-preview-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bingo-blue-200);
}

.avatar-change-text {
  color: var(--text-color);
  font-size: 14px;
  opacity: 0.7;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--background-color);
  border-radius: 12px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
</style>

