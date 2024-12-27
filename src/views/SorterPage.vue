<template>
  <div>
    <h1 class="c-blue-200 fw-700">Sorteador de Nomes</h1>
    <label>Digite os itens a serem sorteados:</label>
    <div v-for="(field, index) in fields" :key="index">
      <input v-model="fields[index]" placeholder="Enter a name" />
    </div>
    <button @click="addField">Add Field</button>
    <label>Digite o número de nomes por sorteio:</label>
    <div>
    <input
      v-model.number="namesPerSort"
      type="number"
      placeholder="Insira um número" />
    </div>
    <button @click="sortNames">Sort Names</button>
    <div v-if="sortedNames.length">
      <h2 class="c-blue-200 fw-400">Nomes sorteados</h2>
      <ul>
        <li v-for="(name, index) in sortedNames" :key="index">{{ name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            fields: ['', '', ''],
            namesPerSort: 1,
            sortedNames: []
        };
    },
    methods: {
    addField() {
        this.fields.push('');
    },
    sortNames() {
        const nonEmptyFields = this.fields.filter(field => field.trim() !== '');

        if (nonEmptyFields.length === 0) {
            alert('No more names to sort.');
            return;
        }

        const count = Math.min(this.namesPerSort, nonEmptyFields.length);

        const shuffled = nonEmptyFields.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        this.sortedNames = [...this.sortedNames, ...selected];

        this.fields = this.fields.filter(field => !selected.includes(field));
    }
}

};
</script>

<style scoped>
h1, h2 {
    text-align: center;
}
label {
    font-size: 16px;
}
div {
    margin: 10px;
}
button {
    display: block;
    margin: 10px auto;
}
input,
select {
  background-color: transparent;
  border: none;
  color: var(--text-color);
  outline: 1px solid var(--bingo-blue-200);
  border-radius: 4px;
  padding: 8px;
}
li {
    list-style-type: none;
    margin: 5px;
}
</style>
