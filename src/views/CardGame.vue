<template>
  <div v-if="!gameStarted" class="player-setup">
    <h1 class="c-blue-200 fw-700">Enter Players name</h1>
    <div v-for="(player, index) in players" :key="index" class="player-input">
      <div class="color-box" :style="{ backgroundColor: player.color }"></div>
      <input v-model="player.name" type="text" placeholder="Enter name" />
      <button @click="removePlayer(index)">X</button>
    </div>
    <button @click="addPlayer">Add Player</button>
    <button @click="startGame">Game Start</button>
  </div>

  <div v-else class="game-screen">
    <h1 v-if="players.length > 0 && !gameEnded">{{ currentPlayer.name }}'s Turn!</h1>
    <!--
    <div class="card" @click="flipCard">
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="118" height="118" rx="24" fill="url(#paint0_linear_1366_4547)" fill-opacity="0.15" stroke="url(#paint1_radial_1366_4547)" stroke-width="2"></rect>
          <path d="M33.2182 61.4C33.2182 75.425 37.2682 86.75 51.5932 86.75C65.9182 86.75 69.8182 75.425 69.8182 61.4C69.8182 47.225 65.9182 35.9 51.5932 35.9C37.2682 35.9 33.2182 47.225 33.2182 61.4ZM43.7182 61.4C43.7182 53.075 45.5932 46.1 51.5932 46.1C57.5182 46.1 59.3182 53.075 59.3182 61.4C59.3182 69.65 57.5182 76.55 51.5932 76.55C45.5932 76.55 43.7182 69.65 43.7182 61.4Z" fill="#54E8A9"></path>
          <path d="M87.7143 36.35L78.0543 56H80.1243L89.7843 36.35H87.7143ZM74.6943 40.16C74.6943 42.44 76.4043 44.15 78.6843 44.15C80.9343 44.15 82.7043 42.44 82.7043 40.16C82.7043 37.91 80.9343 36.14 78.6843 36.14C76.4043 36.14 74.6943 37.91 74.6943 40.16ZM77.1243 40.16C77.1243 39.29 77.7543 38.57 78.6843 38.57C79.5543 38.57 80.2743 39.29 80.2743 40.16C80.2743 41.09 79.5543 41.72 78.6843 41.72C77.7543 41.72 77.1243 41.09 77.1243 40.16ZM85.3143 52.31C85.3143 54.59 87.0243 56.3 89.3043 56.3C91.5543 56.3 93.3243 54.59 93.3243 52.31C93.3243 50.06 91.5543 48.29 89.3043 48.29C87.0243 48.29 85.3143 50.06 85.3143 52.31ZM87.7443 52.31C87.7443 51.44 88.3743 50.72 89.3043 50.72C90.1743 50.72 90.8943 51.44 90.8943 52.31C90.8943 53.24 90.1743 53.87 89.3043 53.87C88.3743 53.87 87.7443 53.24 87.7443 52.31Z" fill="#2FCB89"></path>
          <defs>
            <linearGradient id="paint0_linear_1366_4547" x1="0.0063367" y1="0.168432" x2="120.853" y2="119.009" gradientUnits="userSpaceOnUse">
              <stop stop-color="#2FCB89" stop-opacity="0.7"></stop>
              <stop offset="0.489583" stop-color="#2FCB89" stop-opacity="0"></stop>
              <stop offset="1" stop-color="#2FCB89" stop-opacity="0.7"></stop>
            </linearGradient>
            <radialGradient id="paint1_radial_1366_4547" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(96.8574) scale(122.674 149.921)">
              <stop stop-color="#54E8A9"></stop>
              <stop offset="1" stop-color="#1A3E31" stop-opacity="0.2"></stop>
            </radialGradient>
          </defs>
        </svg>
        <div class="container-card bg-green-box">
            <div class="card__face card__face--front" :class="{ active: !cardFlipped }">Flip the card!</div>
            <div class="card__face card__face--back" :class="{ active: cardFlipped }">{{ prank }}</div>
        </div>
    </div>
    -->
    <div v-if="gameEnded" class="scoreboard-container">
  <h1>Game Over!</h1>
  <h2>Final Scoreboard</h2>
  <ul>
    <li v-for="(player, index) in players" :key="index">
        <img v-if="index === 0" src="https://cdn-icons-png.flaticon.com/128/1657/1657088.png" width="18px">        
      <span :class="player.normalizedName">{{ player.name }}</span>: {{ player.score }}
    </li>
  </ul>
  <button @click="restartGame">Restart Game</button>
</div>

<div v-else>
  <!-- Existing game screen content -->
  <div class="card">
    <div class="container-card" :class="currentPlayer.bgClass">
      <div
        class="card__face card__face--front"
        :class="{ active: cardFlipped }"
        @click="flipCard">
        <p>Flip the card!</p>
      </div>
      <div class="card__face" :class="{ active: !cardFlipped }">
        <p>{{ prank.action }}</p>
        <p class="conectivo">OU</p>
        <p class="legend">{{ prank.legend }} {{ prank.shots }} shots!</p>
        <div class="actions">
          <button @click="handleXClick"><img src="https://cdn-icons-png.flaticon.com/128/16206/16206622.png" width="45px"></button>
          <button @click="handleVClick"><img src="https://cdn-icons-png.flaticon.com/128/190/190411.png" width="45px"></button>
          <button @click="handleShotsClick"><img src="https://cdn-icons-png.flaticon.com/128/1930/1930685.png" width="45px"></button>
        </div>
      </div>
    </div>
  </div>
</div>
    <!-- Score -->
    <div class="scoreboard" v-if="!gameEnded">
      <h5>Scoreboard</h5>
      <ul>
        <li v-for="(player, index) in players" :key="index">
            <img v-if="index === 0" src="https://cdn-icons-png.flaticon.com/128/1657/1657088.png" width="18px">
          <span :class="player.normalizedName">{{ player.name }}</span>: {{ player.score }}
        </li>
      </ul>
    </div>


    <!-- Modal -->
    <div v-if="showModal">
      <div class="overlay"></div>
      <div class="modal">
        <template v-if="modalAction === 'X'">
          <h2>
            Are you sure you want to lose {{ prank.shots }} points,
            <span
              :class="currentPlayer.normalizedName"
              >{{ currentPlayer.name }}</span
            >?
          </h2>
        </template>
        <template v-else-if="modalAction === 'V'">
          <h2>
            Are you sure you did this, 
            <span
              :class="currentPlayer.normalizedName"
              >{{ currentPlayer.name }}</span
            >?
          </h2>
        </template>
        <template v-else-if="modalAction === 'shot'">
          <h2>
            Select the number of shots you want to add,
            <span
              :class="currentPlayer.normalizedName"
              >{{ currentPlayer.name }}</span
            >:
          </h2>
          <div class="shots-menu">
            <label v-for="n in parseInt(prank.shots)" :key="n">
              <input type="radio" :value="n" v-model="selectedShotValue" />
              <img :src="selectedShotValue === n ? 'https://cdn-icons-png.flaticon.com/128/1930/1930685.png' : 'https://cdn-icons-png.flaticon.com/512/1930/1930733.png'" width="25px"> - 
              {{ n }}
            </label>
          </div>
        </template>
        <button @click="cancelAction">
            <span v-if="modalAction === 'X'" >No, Im better then that</span>
            <span v-else >No, I lied and now on I`ll do better.</span>
        </button>
        <button
          v-if="modalAction === 'shot'"
          @click="confirmShots"
          :disabled="!selectedShotValue">
          OOOH YEAAAAH
        </button>
        <button v-if="modalAction !== 'shot'" @click="confirmAction">
          <span v-if="modalAction === 'X'" >Yes, IM A FUCKING COWARD</span>
            <span v-else >Yes, Im a fucking badass</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: [
        { name: "Carla", color: this.generateLightColor(), score: 0 },
        { name: "Rodolfo", color: this.generateLightColor(), score: 0 },
        { name: "Thami", color: this.generateLightColor(), score: 0 },
        { name: "Alice", color: this.generateLightColor(), score: 0 },
        { name: "Luísa", color: this.generateLightColor(), score: 0 },
        { name: "Renata", color: this.generateLightColor(), score: 0 },
      ],
      scores: [],
      gameStarted: false,
      gameEnded: false,
      currentPlayerIndex: 0,
      currentPlayer: {},
      cardFlipped: false,
      actions: [],
      usedActions: [],
      prank: { action: "", legend: "", shots: "" },
      showModal: false,
      modalAction: null,
      selectedShotValue: null,
    };
  },
  methods: {
    generateLightColor() {
      const r = Math.floor(Math.random() * 156) + 100;
      const g = Math.floor(Math.random() * 156) + 100;
      const b = Math.floor(Math.random() * 156) + 100;
      return `rgb(${r}, ${g}, ${b})`;
    },
    appendDynamicCSS(player, color) {
    const normalizedName = player.name.toLowerCase().replace(/\s+/g, "-");
      const className = `bg-${normalizedName}-box`;
      const gradient = `linear-gradient(71deg, ${color}, ${this.darkenColor(color, 0.8)}, ${color})`;

      const style = document.createElement("style");
      style.innerHTML = `
        .${className}::after {
          background: ${gradient};
        }
        .${normalizedName} {
        color: ${color};
        }
      `;
      document.head.appendChild(style);
      return {className, normalizedName};
    },
    darkenColor(color, factor) {
      const rgb = color
        .match(/\d+/g)
        .map((c) => Math.floor(c * (1 - factor)));
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    },
    initializePlayers() {
      this.players.forEach((player) => {
        const color = player.color;
        const dynamicCss = this.appendDynamicCSS(player, color);
        player.bgClass = dynamicCss.className;
        player.normalizedName = dynamicCss.normalizedName;
      });
    },
    removePlayer(index) {
      this.players.splice(index, 1);
    },
    addPlayer() {
      this.players.push({ name: "", color: this.generateLightColor(), score: 0 });
    },
    startGame() {
      if (this.players.length === 0) {
        alert("Please add at least one player to start the game.");
        return;
      }
      this.initializePlayers();
      this.currentPlayer = this.players[this.currentPlayerIndex];
      this.gameStarted = true;
      this.prank = this.getRandomAction();
    },
    flipCard() {
      this.cardFlipped = true;
    },
    nextTurn() {
      if (this.players.length === 0) {
        alert("No players available.");
        return;
      }
      this.cardFlipped = false;

      if (this.gameEnded) {
        return; // Do nothing if the game has ended
      }
      
      setTimeout(() => {
        this.currentPlayerIndex =
          (this.currentPlayerIndex + 1) % this.players.length;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.prank = this.getRandomAction();
      }, 300);
    },
    getRandomAction() {
      const availableActions = this.actions.filter(
        (action) => !this.usedActions.includes(action)
      );

      if (availableActions.length === 0) {
        this.gameEnded = true;
        return null;
      }

      const randomIndex = Math.floor(Math.random() * availableActions.length);
      const selectedAction = availableActions[randomIndex];
      this.usedActions.push(selectedAction);

      return selectedAction;
    },
    handleXClick() {
      this.modalAction = "X";
      this.showModal = true;
    },
    handleVClick() {
      this.modalAction = "V";
      this.showModal = true;
    },
    handleShotsClick() {
      this.showModal = true;
      this.modalAction = "shot";
    },
    confirmShots() {
    if (this.selectedShotValue) {
        this.updateScore(this.currentPlayer, parseInt(this.selectedShotValue));
      this.showModal = false;
      this.selectedShotValue = null;
    }
    this.nextTurn();
  },
  confirmAction() {
    if (this.modalAction === "X") {
        this.updateScore(this.currentPlayer, -parseInt(this.prank.shots));
    } else if (this.modalAction === "V") {
        this.updateScore(this.currentPlayer, parseInt(this.prank.shots));
    }
    this.showModal = false;
    this.nextTurn();
  },
    cancelAction() {
      this.showModal = false;
      this.selectedShotValue = null;
    },
    updateScore(player, value) {
        const playerIndex = this.players.findIndex((p) => p.name === player.name);
        if (playerIndex !== -1) {
                this.players[playerIndex].score += value;
        } else {
                this.players.push({ name: player.name, score: value });
        }
        this.players.sort((a, b) => b.score - a.score);
    },
    restartGame() {
          this.gameEnded = false;
          this.usedActions = [];
          this.players.forEach((player) => (player.score = 0)); // Reset scores
          this.startGame(); // Restart the game
    },
  },
  async mounted() {
    const response = await fetch("/card-game.json");
    this.actions = await response.json();
  },
};
</script>

<style scoped>
#app {
    height: calc(100vh - 50px);
    align-content: center;
}
.player-setup {
  max-width: 400px;
  margin: 0 auto;
}

.player-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

input {
  flex: 1;
  padding: 5px;
  margin-right: 10px;
}

button {
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

.game-screen {
  max-width: 40vw;
  margin: 0 auto;
}

.card__face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: 1s ease-in-out;
  align-content: center;
    &.active {
    transform: rotateY(0.5turn);
    }
    &.:not(.active) {
        opacity: 0;
    transform: rotateY(0);
    }
    p {
        max-width: 80%;
        justify-self: center;
        &.conectivo {
            color: #6d6d6d;
            font-size: 12px;
        }
        &.legend {
            color: #9db6ca;
            font-size: 16px;
        }
    }
}

.card__face--front {
  cursor: pointer;
}

.container-card {
  position: relative;
  border: 2px solid transparent;
  background: linear-gradient(71deg, #080509, #1a171c, #080509);
  background-clip: padding-box;
  border-radius: 45px;
  padding: 40px;
  min-height: 40vh;
}

.container-card::after {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: -1px;
  right: -1px;
  content: "";
  z-index: -1;
  border-radius: 45px;
}

.card-title {
  font-weight: 600;
  color: white;
  letter-spacing: -0.02em;
  line-height: 40px;
  font-style: normal;
  font-size: 28px;
  padding-bottom: 8px;
}

.card-description {
  font-weight: 600;
  line-height: 32px;
  color: hsla(0, 0%, 100%, 0.5);
  font-size: 16px;
  max-width: 470px;
}

.actions button {
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background: transparent !important;
}

.shots-menu {
  margin-top: 10px;
}

.shots-menu label {
  margin-right: 10px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  z-index: 999; /* Ensure it appears behind the modal */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Ensure it appears above the overlay */
  color: black;
  width: 30vw;
  min-width: 500px;
}

.modal button {
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
.shots-menu {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 25px 0;
}

.shots-menu label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  cursor: pointer;
}

.shots-menu input[type="radio"] {
  cursor: pointer;
}

ul {
    text-align: left;
    
    li {
    list-style: none;
    font-size: 16px;
    text-align: left;
}
}

.scoreboard-container ul li {
    font-size: 25px;
}

</style>
