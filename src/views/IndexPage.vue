<template>
  <div class="index-page">
    <h1>
      Bem vindo ao b<span class="c-blue-200">!</span>ng<span class="c-blue-200"
        >0</span
      >
    </h1>

    <div class='text-left font-medium'>
      <p>Como funciona?</p>
      <p>Possuímos 3 páginas.</p>
      <p>
        O <span class="c-blue-200 fw-700">host a game</span> funciona como um
        sorteador de “números” que no nosso caso, são chamados de
        <span class="c-blue-200 fw-700">tokens</span>. O ideal é que uma pessoa
        conecte a aplicação em algum lugar que tenha navegador
        (celular/computador/televisão) e , caso não esteja na televisão, espelhe
        a aplicação pelo HDMI ou coisa do tipo.
      </p>
      <p>
        A página do <span class="c-blue-200 fw-700">print card</span> é um
        gerador de cartelas caso as pessoas optem por jogar com a
        <span class="fw-700">marcação com objetos,</span> feito é o costume.
        Nessa página você pode escolher quantos tokens por cartelas, cada
        cartela vai ter e em seguida, quantas cartelas vão ser geradas para
        poder <span class="fw-700">imprimir</span>.
      </p>
      <p>
        A <span class="c-blue-200 fw-700">página do virtual</span> card funciona
        como uma cartela online, caso algum jogador opte por jogar marcando no
        celular/computador. A aplicação não tem conexão com a internet, então é
        importante que você avise ao host quando completar o bingo de alguma
        forma. Nesse modo, por questão de honestidade, é
        <span class="fw-700">SUGERIDO</span> que antes do jogo começar, seja
        enviado um print ao host para ele confirmar que o usuário não trocou a
        cartela no meio do jogo.
      </p>
      <p class="fw-700">
        Todos os tokens que são gerados tanto virtualmente quanto do lado do
        host, são armazenados no banco de dados do navegador da máquina do
        usuário (local storage). Caso saia da página ou atualize sem querer, os
        dados são mantidos até o usuário apagar na mão, que seria no caso do
        host limpar o histórico ou uma nova cartela virtual ser gerada.
      </p>
      <p>
        Futuramente teremos outras temáticas como páscoa, ano novo, aniversário,
        etc.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
};
</script>

<style scoped>
.index-page {
  text-align: center;
  margin-top: 50px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
