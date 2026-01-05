<template>
  <div class="create-room-page">
    <h1 class="c-blue-200 fw-700">Criar Sala</h1>
    
    <div class="form-container">
      <div class="form-group">
        <label for="room_name">Nome da Sala</label>
        <input 
          id="room_name"
          v-model="room_name" 
          type="text" 
          placeholder="Digite o nome da sala"
          class="input-field"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Senha para Jogadores</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          placeholder="Digite uma senha para os jogadores"
          class="input-field"
        />
      </div>
      
      <div class="form-group">
        <label for="password_admin">Senha para Admin/Host</label>
        <input 
          id="password_admin"
          v-model="password_admin" 
          type="password" 
          placeholder="Digite uma senha para o host (opcional)"
          class="input-field"
        />
        <small class="form-hint">Se não preencher, usará a mesma senha dos jogadores</small>
      </div>
      
      <div class="form-group">
        <label for="theme">Tema</label>
        <select 
          id="theme"
          v-model="theme" 
          class="input-field"
        >
          <option 
            v-for="themeOption in themes" 
            :key="themeOption.id" 
            :value="themeOption.id"
          >
            {{ themeOption.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="card_size">Quantidade de números na cartela</label>
        <input 
          id="card_size"
          v-model.number="card_size" 
          type="number" 
          min="12" 
          max="16" 
          placeholder="Ex: 16, 20, 25"
          class="input-field"
        />
        <small class="form-hint">Digite a quantidade de números (ex: 16 para 4x4, 25 para 5x5)</small>
      </div>
      
      <button @click="createRoom" :disabled="loading || !room_name || !password || !theme || !card_size" class="btn-primary">
        {{ loading ? 'Criando...' : 'Criar Sala' }}
      </button>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      
      <div v-if="roomCreated" class="success-container">
        <h2>Sala criada com sucesso!</h2>
        <div class="room-info">
          <p><strong>ID da Sala:</strong> <span class="room-id">{{ room_id }}</span></p>
          <p><strong>Nome:</strong> {{ room_name }}</p>
        </div>
        <button @click="goToHost" class="btn-primary">Ir para a Sala (Host)</button>
        <button @click="copyRoomId" class="btn-secondary">Copiar ID da Sala</button>
      </div>
    </div>
  </div>
</template>

<script>
import { themes } from '../config/themes.js';

export default {
  name: 'CreateRoomPage',
  data() {
    return {
      themes, // Array de temas disponíveis
      room_name: '',
      password: '',
      password_admin: '',
      theme: themes[0].id, // Usa o primeiro tema como padrão
      card_size: 16,
      loading: false,
      error: null,
      roomCreated: false,
      room_id: null,
    };
  },
  methods: {
    async createRoom() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('/api/create-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_name: this.room_name,
            password: this.password,
            password_admin: this.password_admin || this.password,
            theme: this.theme,
            card_size: this.card_size,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar sala');
        }
        
        this.room_id = data.room_id;
        this.roomCreated = true;
        
        // Salva no localStorage para reconexão
        localStorage.setItem('host_room', JSON.stringify({
          room_id: data.room_id,
          room_name: data.room_name,
          password: this.password,
          theme: this.theme,
          card_size: this.card_size,
        }));
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    goToHost() {
      this.$router.push({
        name: 'HostRoom',
        params: { room_id: this.room_id },
        query: { password: this.password },
      });
    },
    copyRoomId() {
      navigator.clipboard.writeText(this.room_id);
      alert('ID da sala copiado!');
    },
  },
};
</script>

<style scoped>
.create-room-page {
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

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.error-message {
  margin-top: 15px;
  padding: 12px;
  background-color: #fee;
  color: #c33;
  border-radius: 8px;
  text-align: center;
}

.success-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #efe;
  border-radius: 8px;
  text-align: center;
}

.room-info {
  margin: 20px 0;
  text-align: left;
  background-color: var(--background-color);
  padding: 15px;
  border-radius: 8px;
}

.room-info p {
  margin: 10px 0;
}

.room-id {
  font-family: monospace;
  font-size: 20px;
  font-weight: 700;
  color: var(--bingo-blue-200);
  background-color: rgba(46, 153, 241, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
}

.form-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
  opacity: 0.8;
}
</style>

