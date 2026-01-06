// Utilitário para gerenciar sessões de usuário e host

export const SessionManager = {
  // Sessão de jogador
  saveUserSession(sessionData) {
    localStorage.setItem('user_session', JSON.stringify({
      ...sessionData,
      savedAt: new Date().toISOString(),
    }));
  },

  getUserSession() {
    const session = localStorage.getItem('user_session');
    if (!session) return null;
    
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  },

  clearUserSession() {
    localStorage.removeItem('user_session');
    // Limpa também dados relacionados
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('card_') || key.startsWith('marked_')) {
        localStorage.removeItem(key);
      }
    });
  },

  // Sessão de host
  saveHostSession(sessionData) {
    localStorage.setItem('host_room', JSON.stringify({
      ...sessionData,
      savedAt: new Date().toISOString(),
    }));
  },

  getHostSession() {
    const session = localStorage.getItem('host_room');
    if (!session) return null;
    
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  },

  clearHostSession() {
    localStorage.removeItem('host_room');
  },

  // Verifica se a sessão ainda é válida (sala/usuário ainda existe)
  async verifyUserSession() {
    const session = this.getUserSession();
    if (!session || !session.room_id || !session.user_id) {
      return { valid: false, reason: 'Sessão não encontrada' };
    }

    try {
      const response = await fetch(`/api/get-room?room_id=${session.room_id}`);
      if (!response.ok) {
        return { valid: false, reason: 'Sala não encontrada' };
      }

      const data = await response.json();
      const user = data.users?.find(u => u.user_id === session.user_id);
      
      if (!user) {
        return { valid: false, reason: 'Usuário não encontrado na sala' };
      }

      return { valid: true, session, room: data.room, user };
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return { valid: false, reason: 'Erro ao verificar sessão' };
    }
  },

  async verifyHostSession() {
    const session = this.getHostSession();
    if (!session || !session.room_id) {
      return { valid: false, reason: 'Sessão não encontrada' };
    }

    try {
      const response = await fetch(`/api/get-room?room_id=${session.room_id}`);
      if (!response.ok) {
        return { valid: false, reason: 'Sala não encontrada' };
      }

      const data = await response.json();
      
      // Verifica senha de admin
      const verifyResponse = await fetch('/api/verify-host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: session.room_id,
          password: session.password,
        }),
      });

      if (!verifyResponse.ok) {
        return { valid: false, reason: 'Senha inválida' };
      }

      return { valid: true, session, room: data.room };
    } catch (error) {
      console.error('Erro ao verificar sessão de host:', error);
      return { valid: false, reason: 'Erro ao verificar sessão' };
    }
  },

  // Limpa todas as sessões
  clearAllSessions() {
    this.clearUserSession();
    this.clearHostSession();
  },
};

