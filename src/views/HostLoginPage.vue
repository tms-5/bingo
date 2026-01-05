<template>
  <div class="host-login-page">
    <h1 class="c-blue-200 fw-700">Entrar como Host</h1>
    
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
        <label for="password">Senha de Admin/Host</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          placeholder="Digite a senha de admin"
          class="input-field"
        />
      </div>
      
      <button @click="loginAsHost" :disabled="loading || !room_id || !password" class="btn-primary">
        {{ loading ? 'Entrando...' : 'Entrar como Host' }}
      </button>
      
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HostLoginPage',
  data() {
    return {
      room_id: '',
      password: '',
      loading: false,
      error: null,
    };
  },
  methods: {
    async loginAsHost() {
      this.loading = true;
      this.error = null;
      
      try {
        // Verifica a senha de admin primeiro
        const verifyResponse = await fetch('/api/verify-host', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: this.room_id.toUpperCase(),
            password: this.password,
          }),
        });
        
        // Verifica se a resposta é JSON
        const contentType = verifyResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await verifyResponse.text();
          throw new Error('Erro ao conectar com o servidor. Verifique se a API está rodando.');
        }
        
        const verifyData = await verifyResponse.json();
        
        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || 'Senha incorreta');
        }
        
        // Busca dados completos da sala
        const response = await fetch(`/api/get-room?room_id=${this.room_id.toUpperCase()}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro ao buscar sala' }));
          throw new Error(errorData.error || 'Erro ao buscar sala');
        }
        
        const data = await response.json();
        
        // Salva no localStorage para reconexão
        localStorage.setItem('host_room', JSON.stringify({
          room_id: data.room.room_id,
          room_name: data.room.room_name,
          password: this.password,
          theme: data.room.theme,
          card_size: data.room.card_size,
        }));
        
        // Redireciona para a tela do host
        this.$router.push({
          name: 'HostRoom',
          params: { room_id: data.room.room_id },
          query: { password: this.password },
        });
      } catch (error) {
        console.error('Erro no login:', error);
        this.error = error.message || 'Erro ao entrar como host. Verifique o ID da sala e a senha.';
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // Tenta recuperar sessão anterior
    const savedRoom = localStorage.getItem('host_room');
    if (savedRoom) {
      try {
        const roomData = JSON.parse(savedRoom);
        this.room_id = roomData.room_id;
      } catch (e) {
        // Ignora erro
      }
    }
  },
};
</script>

<style scoped>
.host-login-page {
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
</style>

