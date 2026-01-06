<template>
  <div class="avatar-selector">
    <div class="avatar-selector-header">
      <h3>Selecione seu Avatar</h3>
      <button v-if="showClose" @click="$emit('close')" class="close-btn">×</button>
    </div>
    
    <div class="current-avatar" v-if="selectedAvatar">
      <p>Avatar Selecionado:</p>
      <div class="avatar-preview">
        <img :src="getAvatarPath(selectedAvatar)" :alt="`Avatar ${selectedAvatar}`" />
      </div>
    </div>
    
    <div class="avatars-grid">
      <div
        v-for="avatarNum in totalAvatars"
        :key="avatarNum"
        class="avatar-item"
        :class="{ selected: selectedAvatar === avatarNum }"
        @click="selectAvatar(avatarNum)"
      >
        <img 
          :src="getAvatarPath(avatarNum)" 
          :alt="`Avatar ${avatarNum}`"
          @error="handleImageError"
        />
      </div>
    </div>
    
    <div class="avatar-selector-actions">
      <button @click="confirmSelection" class="btn-confirm" :disabled="!selectedAvatar">
        Confirmar
      </button>
      <button v-if="showCancel" @click="$emit('cancel')" class="btn-cancel">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvatarSelector',
  props: {
    currentAvatar: {
      type: Number,
      default: null,
    },
    totalAvatars: {
      type: Number,
      default: 33, // Total de avatares disponíveis
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedAvatar: this.currentAvatar || 1,
    };
  },
  methods: {
    getAvatarPath(avatarNum) {
      return `/avatar/avatar-${avatarNum}.png`;
    },
    selectAvatar(avatarNum) {
      this.selectedAvatar = avatarNum;
    },
    confirmSelection() {
      this.$emit('select', this.selectedAvatar);
    },
    handleImageError(event) {
      // Se a imagem não carregar, tenta usar um avatar padrão
      event.target.src = '/avatar/avatar-1.png';
    },
  },
  watch: {
    currentAvatar(newVal) {
      if (newVal) {
        this.selectedAvatar = newVal;
      }
    },
  },
};
</script>

<style scoped>
.avatar-selector {
  background: var(--background-color);
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-selector-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-color);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.current-avatar {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(127, 197, 255, 0.1);
  border-radius: 8px;
}

.current-avatar p {
  margin: 0 0 10px 0;
  font-weight: 600;
  color: var(--text-color);
}

.avatar-preview {
  display: inline-block;
}

.avatar-preview img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--bingo-blue-200);
  object-fit: cover;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 20px;
}

.avatar-item {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
}

.avatar-item:hover {
  transform: scale(1.1);
  border-color: var(--bingo-blue-200);
}

.avatar-item.selected {
  border-color: var(--bingo-blue-200);
  box-shadow: 0 0 0 3px rgba(46, 153, 241, 0.3);
}

.avatar-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-selector-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-confirm,
.btn-cancel {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.btn-confirm {
  background: linear-gradient(180deg, #7fc5ff 0%, #2e99f1 100%);
  color: white;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-confirm:not(:disabled):hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* Scrollbar styling */
.avatars-grid::-webkit-scrollbar {
  width: 8px;
}

.avatars-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.avatars-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.avatars-grid::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

