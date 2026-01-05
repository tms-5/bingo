<template>
  <div class="page">
    <h1 class="c-blue-200 fw-700">Sorteador de Nomes</h1>

    <section class="card">
      <header>
        <h2 class="c-blue-200 fw-600">Lista de nomes</h2>
        <p>Digite um por linha ou cole varios separados por ponto e virgula.</p>
      </header>
      <div class="names-grid">
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="name-row">
          <input
            v-model="fields[index]"
            placeholder="Nome"
          />
        </div>
        <button class="ghost" @click="addField">+ Adicionar linha</button>
      </div>

      <div class="bulk-import">
        <label for="bulk">Colar nomes com ponto e virgula (;):</label>
        <textarea
          id="bulk"
          v-model="bulkInput"
          rows="3"
          placeholder="Ex.: Ana; Beto; Carla; Diego"
        />
        <div class="inline-actions">
          <button @click="importBulk">Adicionar a lista</button>
          <button class="ghost" @click="clearNames">Limpar lista</button>
        </div>
      </div>
    </section>

    <section class="card">
      <header>
        <h2 class="c-blue-200 fw-600">Tamanhos dos times</h2>
        <p>Monte combinacoes como 1 time de 5 e 3 times de 2 (total 11 nomes do exemplo).</p>
      </header>
      <div class="templates">
        <div
          class="template-row"
          v-for="(template, index) in teamTemplates"
          :key="index">
          <label>Times</label>
          <input
            type="number"
            min="1"
            v-model.number="teamTemplates[index].teams"
          />
          <label>Pessoas por time</label>
          <input
            type="number"
            min="1"
            v-model.number="teamTemplates[index].size"
          />
          <button
            class="ghost"
            @click="removeTeamTemplate(index)"
            :disabled="teamTemplates.length === 1">
            Remover
          </button>
        </div>
        <button class="ghost" @click="addTeamTemplate">+ Nova combinacao</button>
        <p class="hint">
          Vagas usadas: {{ usableSlots }} / {{ cleanNames.length }}
          <span v-if="plannedSlots !== usableSlots"> (planejadas: {{ plannedSlots }})</span>
        </p>
      </div>
    </section>

    <section class="actions card">
      <button class="primary" @click="generateTeams">Sortear times</button>
      <p class="hint">Sobram {{ remainingNames }} nomes apos preencher todos os times.</p>
    </section>

    <section v-if="generatedTeams.length" class="card results">
      <header>
        <h2 class="c-blue-200 fw-600">Times sorteados</h2>
        <p>Ordem aleatoria a cada sorteio.</p>
      </header>
      <div class="teams">
        <div v-for="(team, index) in generatedTeams" :key="index" class="team-card">
          <h3>Time {{ index + 1 }}</h3>
          <ul>
            <li v-for="(name, nameIndex) in team.members" :key="nameIndex">
              {{ name }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields: ['Thami', 'Edu', 'Josy', 'Joao', 'Berna', 'Luh', 'Henrique', 'Lara', 'Jeanine', 'Thales', 'Pedro'],
      bulkInput: '',
      teamTemplates: [
        { teams: 1, size: 5 },
        { teams: 3, size: 2 }
      ],
      generatedTeams: []
    };
  },
  computed: {
    plannedSlots() {
      return this.teamTemplates.reduce((sum, tpl) => {
        const teams = Number(tpl.teams) || 0;
        const size = Number(tpl.size) || 0;
        return sum + teams * size;
      }, 0);
    },
    usableSlots() {
      return Math.min(this.plannedSlots, this.cleanNames.length);
    },
    remainingNames() {
      return Math.max(0, this.cleanNames.length - this.usableSlots);
    },
    cleanNames() {
      return this.fields.map(name => name.trim()).filter(Boolean);
    }
  },
  methods: {
    addField() {
      this.fields.push('');
    },
    clearNames() {
      this.fields = [];
      this.bulkInput = '';
      this.generatedTeams = [];
    },
    importBulk() {
      if (!this.bulkInput.trim()) return;
      const newNames = this.bulkInput
        .split(';')
        .map(name => name.trim())
        .filter(Boolean);

      this.fields = [...this.fields, ...newNames];
      this.bulkInput = '';
    },
    addTeamTemplate() {
      this.teamTemplates.push({ teams: 1, size: 2 });
    },
    removeTeamTemplate(index) {
      if (this.teamTemplates.length === 1) return;
      this.teamTemplates.splice(index, 1);
    },
    shuffle(array) {
      return [...array].sort(() => 0.5 - Math.random());
    },
    generateTeams() {
      if (!this.cleanNames.length) {
        alert('Adicione pelo menos um nome.');
        return;
      }

      if (!this.plannedSlots) {
        alert('Informe ao menos uma combinacao de times.');
        return;
      }

      const pool = this.shuffle(this.cleanNames);
      const teams = [];
      let cursor = 0;

      this.teamTemplates.forEach(template => {
        const teamCount = Number(template.teams) || 0;
        const size = Number(template.size) || 0;

        if (teamCount <= 0 || size <= 0) return;

        for (let i = 0; i < teamCount && cursor < pool.length; i += 1) {
          const members = pool.slice(cursor, cursor + size);
          if (!members.length) break;
          teams.push({ members });
          cursor += members.length;
        }
      });

      this.generatedTeams = teams;
      this.fields = pool.slice(cursor);
    }
  }
};
</script>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

h1,
h2 {
  text-align: center;
}

.card {
  background: var(--bingo-blue-900, #0e1b2d);
  border: 1px solid var(--bingo-blue-200, #00498d);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(206, 206, 206, 0.25);
}

.names-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.name-row input {
  width: 100%;
  box-sizing: border-box;
}

.bulk-import {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}

.templates {
  display: grid;
  gap: 12px;
}

.template-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  align-items: center;
}

.actions {
  text-align: center;
}

.teams {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.team-card {
  border: 1px solid var(--bingo-blue-200, #004a90);
  border-radius: 8px;
  padding: 12px;
  background: rgba(50, 31, 80, 0.03);
}

label {
  font-size: 14px;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--bingo-blue-200, #00488b);
  background: var(--bingo-blue-200, #5db1ff);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

button.ghost {
  background: transparent;
  color: var(--bingo-blue-200, #5db1ff);
}

button.primary {
  font-size: 16px;
  padding: 12px 16px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input,
textarea {
  background-color: transparent;
  border: none;
  color: var(--text-color);
  outline: 1px solid var(--bingo-blue-200);
  border-radius: 4px;
  padding: 8px;
}

textarea {
  resize: vertical;
}

ul {
  padding: 0;
}

li {
  list-style-type: none;
  margin: 5px 0;
}

.hint {
  color: #9abed6;
  font-size: 13px;
  margin: 0;
}
</style>
