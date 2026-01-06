<template>
  <div class="index-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="hero-title">
        Bem vindo ao b<span class="c-blue-200">!</span>ng<span class="c-blue-200">0</span>
      </h1>
      <p class="hero-subtitle">
        Sistema completo de bingo online com cartelas temáticas e sorteio em tempo real
      </p>
    </div>

    <!-- Features Grid -->
    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">🎮</div>
        <h3 class="c-blue-200 fw-700">Criar Sala</h3>
        <p>
          O host cria uma sala personalizada, define o tema (Natal, Páscoa, etc.),
          o tamanho da cartela e uma senha de administrador. Cada sala recebe um ID único
          que será compartilhado com os jogadores.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">👥</div>
        <h3 class="c-blue-200 fw-700">Entrar na Sala</h3>
        <p>
          Jogadores entram na sala usando o ID e senha. Se um jogador usar um nome que já existe,
          sua cartela anterior será recuperada automaticamente. Cada jogador recebe uma cartela
          única baseada no tema escolhido.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎲</div>
        <h3 class="c-blue-200 fw-700">Sorteio de Números</h3>
        <p>
          O host sorteia números que aparecem em grande destaque na tela (ideal para projetor).
          Cada número sorteado mostra a palavra e imagem do tema correspondente. Os últimos 5
          números aparecem em cards coloridos com imagens.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <h3 class="c-blue-200 fw-700">Cartelas Temáticas</h3>
        <p>
          As cartelas são geradas automaticamente com base no tema escolhido. Cada célula mostra
          uma imagem, palavra e cor de fundo do tema. Os números são mapeados para itens temáticos
          (ex: "Árvore", "Presente", "Sinos").
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">✅</div>
        <h3 class="c-blue-200 fw-700">Validação de Bingo</h3>
        <p>
          Quando um jogador completa uma linha, coluna ou diagonal, clica em "BINGO!".
          O sistema valida automaticamente e mostra os resultados em ordem cronológica.
          Múltiplos bingos simultâneos são ordenados por quem clicou primeiro.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">👑</div>
        <h3 class="c-blue-200 fw-700">Controle do Host</h3>
        <p>
          O host pode ver todos os jogadores, expulsar jogadores indesejados, visualizar
          o histórico completo de números sorteados e encerrar o jogo quando necessário.
          Tudo com autenticação por senha de administrador.
        </p>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="how-it-works">
      <h2 class="section-title">Como Funciona?</h2>

      <div class="steps-container">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="c-blue-200 fw-700">Criação da Sala</h3>
            <p>
              O host acessa a página de criar sala, define o nome, escolhe o tema (ex: Natal),
              o tamanho da cartela (quantos itens por cartela) e opcionalmente uma senha de admin.
              O sistema gera um ID único para a sala.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="c-blue-200 fw-700">Jogadores Entram</h3>
            <p>
              Jogadores usam o ID da sala e senha para entrar. Informam seu nome de usuário e
              recebem automaticamente uma cartela temática. Se o nome já existir na sala,
              a cartela anterior é recuperada.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="c-blue-200 fw-700">Sorteio e Marcação</h3>
            <p>
              O host sorteia números do tema (não são números sequenciais, mas itens do tema
              como "Árvore", "Presente", etc.). Os jogadores veem os números sorteados abaixo
              de suas cartelas e podem marcar clicando nas células.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h3 class="c-blue-200 fw-700">Reivindicação de Bingo</h3>
            <p>
              Quando um jogador completa linha, coluna ou diagonal, clica em "BINGO!".
              O sistema valida se os números marcados correspondem aos sorteados e mostra
              o resultado. Bingos válidos são ordenados por quem clicou primeiro.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">5</div>
          <div class="step-content">
            <h3 class="c-blue-200 fw-700">Fim do Jogo</h3>
            <p>
              Quando há um vencedor, ele é anunciado e não pode mais participar. O host pode
              continuar o jogo para outros jogadores ou encerrar completamente, deletando a sala
              e todos os dados associados.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Technical Details -->
    <div class="technical-section">
      <h2 class="section-title">Detalhes Técnicos</h2>
      <div class="technical-grid">
        <div class="technical-item">
          <span class="technical-label">Persistência:</span>
          <span class="technical-value">
            Cartelas e números marcados são salvos no localStorage do navegador.
            Se você sair e voltar, seus dados estarão preservados.
          </span>
        </div>
        <div class="technical-item">
          <span class="technical-label">Tempo Real:</span>
          <span class="technical-value">
            Atualização automática a cada 2 segundos. Números sorteados e resultados
            aparecem instantaneamente para todos os jogadores.
          </span>
        </div>
        <div class="technical-item">
          <span class="technical-label">Temas:</span>
          <span class="technical-value">
            Sistema suporta múltiplos temas (Natal, Páscoa, etc.). Cada tema tem seus próprios
            itens com imagens, palavras e cores personalizadas.
          </span>
        </div>
        <div class="technical-item">
          <span class="technical-label">Segurança:</span>
          <span class="technical-value">
            Cada sala tem senha de acesso e senha de administrador separada. O host pode
            expulsar jogadores e controlar completamente a sala.
          </span>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="cta-section">
      <p class="cta-text">
        Pronto para começar? Use a navegação acima para criar uma sala, entrar em uma sala existente
        ou acessar como host.
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 20px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 0.5rem;
  opacity: 0.8;
  margin: 0 auto;
  line-height: 1.2;
}

/* Features Section */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 1rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1rem;
  margin-bottom: 15px;
}

.feature-card p,
.technical-value {
  line-height: 1.2;
  opacity: 0.9;
  font-size: 0.5rem;
}

/* How It Works Section */
.how-it-works {
  margin-bottom: 80px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
}

.steps-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.step {
  display: flex;
  width: 25%;
  flex-direction: column;
  gap: 25px;
  align-items: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border-left: 4px solid var(--bingo-blue-200);
  transition: background 0.3s;
}

.step:hover {
  background: rgba(255, 255, 255, 0.05);
}

.step-number {
  min-width: 50px;
  height: 50px;
  background: var(--bingo-blue-200);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 1rem;
  margin: 12px;
}

.step-content p {
  line-height: 1.2;
  opacity: 0.9;
  font-size: 0.5rem;
}

/* Technical Section */
.technical-section {
  margin-bottom: 60px;
}

.technical-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.technical-item {
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.technical-label {
  display: block;
  font-weight: 700;
  color: var(--bingo-blue-200);
  margin-bottom: 8px;
  font-size: 1.1rem;
}


/* CTA Section */
.cta-section {
  text-align: center;
  padding: 40px 20px;
  background: rgba(46, 153, 241, 0.1);
  border-radius: 16px;
  border: 2px solid var(--bingo-blue-200);
}

.cta-text {
  font-size: 1.2rem;
  line-height: 1.2;
  max-width: 700px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .features-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .step {
    flex-direction: column;
    text-align: center;
  }

  .step-number {
    margin: 0 auto;
  }

  .section-title {
    font-size: 2rem;
  }

  .technical-grid {
    grid-template-columns: 1fr;
  }
}
</style>
