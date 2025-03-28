<template>
  <label for="theme" class="theme">
    <span>Light</span>
    <span class="theme__toggle-wrap">
      <input
        id="theme"
        class="theme__toggle"
        type="checkbox"
        role="switch"
        name="theme"
        value="dark"
        :checked="darkMode"
        @change="toggleDarkMode" />
      <span class="theme__icon">
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
        <span class="theme__icon-part"></span>
      </span>
    </span>
    <span>Dark</span>
  </label>
</template>

<script>
export default {
  data() {
  return {
    darkMode: false,
  };
},
mounted() {
  this.darkMode = localStorage.getItem('dark-mode') === 'true';
  document.body.classList.toggle('dark-mode', this.darkMode);
},
methods: {
    toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
    localStorage.setItem('dark-mode', this.darkMode);
  },
},
};
</script>

<style>

:root {
	--hue: 223;
	--bg: hsl(var(--hue),10%,100%);
	--fg: hsl(var(--hue),10%,0%);
	--primary: hsl(var(--hue),90%,55%);
	--primaryT: hsla(var(--hue),90%,55%,0);
	--transDur: 0.3s;
	font-size: calc(16px + (32 - 16) * (100vw - 320px) / (1280 - 320));
}


/* Default */
.theme {
	display: flex;
	align-items: center;
	-webkit-tap-highlight-color: transparent;
     font-size: 16px;
}

.theme span {
    color: var(--text-color);
}

.theme__icon {
	transition: transform var(--transDur) ease-in-out;
}
.theme__icon,
.theme__toggle {
	z-index: 1;
}
.theme__icon,
.theme__icon-part {
	position: absolute;
}
.theme__icon {
    display: block;
    top: 23px;
    margin-left: 24px;
    left: auto;
}
.theme__icon-part {
	border-radius: 50%;
	box-shadow: 0.4em -0.4em 0 0.5em hsl(0,0%,100%) inset;
	top: calc(50% - 0.5em);
	left: calc(50% - 0.5em);
	width: 1em;
	height: 1em;
	transition:
		box-shadow var(--transDur) ease-in-out,
		opacity var(--transDur) ease-in-out,
		transform var(--transDur) ease-in-out;
	transform: scale(0.5);
}
.theme__icon-part ~ .theme__icon-part {
	background-color: hsl(0,0%,100%);
	border-radius: 0.05em;
	box-shadow: none;
	top: 50%;
	left: calc(50% - 0.05em);
	transform: rotate(0deg) translateY(0.5em);
	transform-origin: 50% 0;
	width: 0.1em;
	height: 0.2em;
}
.theme__icon-part:nth-child(3) {
	transform: rotate(45deg) translateY(0.5em);
}
.theme__icon-part:nth-child(4) {
	transform: rotate(90deg) translateY(0.5em);
}
.theme__icon-part:nth-child(5) {
	transform: rotate(135deg) translateY(0.5em);
}
.theme__icon-part:nth-child(6) {
	transform: rotate(180deg) translateY(0.5em);
}
.theme__icon-part:nth-child(7) {
	transform: rotate(225deg) translateY(0.5em);
}
.theme__icon-part:nth-child(8) {
	transform: rotate(270deg) translateY(0.5em);
}
.theme__icon-part:nth-child(9) {
	transform: rotate(315deg) translateY(0.5em);
}
.theme__label,
.theme__toggle,
.theme__toggle-wrap {
	position: relative;
}
.theme__toggle,
.theme__toggle:before {
	display: block;
}
.theme__toggle {
	background-color: hsl(48,90%,85%);
	border-radius: 25% / 50%;
	box-shadow: 0 0 0 0.125em var(--primaryT);
	padding: 0.25em;
	width: 6em;
	height: 3em;
	-webkit-appearance: none;
	appearance: none;
    cursor: pointer;
	transition:
		background-color var(--transDur) ease-in-out,
		box-shadow 0.15s ease-in-out,
		transform var(--transDur) ease-in-out;
}
.theme__toggle:before {
	background-color: hsl(48,90%,55%);
	border-radius: 50%;
	content: "";
	width: 2.5em;
	height: 2.5em;
	transition:
		background-color var(--transDur) ease-in-out,
		transform var(--transDur) ease-in-out;
}
.theme__toggle:focus {
	box-shadow: 0 0 0 0.125em var(--primary);
	outline: transparent;
}

/* Checked */
.theme__toggle:checked {
	background-color: hsl(198,90%,15%);
}

.theme__toggle:checked ~ .theme__icon {
    margin-left: 17px;
}
.theme__toggle:checked:before,
.theme__toggle:checked ~ .theme__icon {
	transform: translateX(3em);
}
.theme__toggle:checked:before {
	background-color: hsl(198,90%,55%);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(1) {
	box-shadow: 0.2em -0.2em 0 0.2em hsl(0,0%,100%) inset;
	transform: scale(1);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part ~ .theme__icon-part {
	opacity: 0;
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(2) {
	transform: rotate(45deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(3) {
	transform: rotate(90deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(4) {
	transform: rotate(135deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(5) {
	transform: rotate(180deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(6) {
	transform: rotate(225deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(7) {
	transform: rotate(270deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(8) {
	transform: rotate(315deg) translateY(0.8em);
}
.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(9) {
	transform: rotate(360deg) translateY(0.8em);
}
.theme__toggle-wrap {
    zoom: 0.5;
	margin: 0 0.75em;
}

@supports selector(:focus-visible) {
	.theme__toggle:focus {
		box-shadow: 0 0 0 0.125em var(--primaryT);
	}
	.theme__toggle:focus-visible {
		box-shadow: 0 0 0 0.125em var(--primary);
	}
}
</style>
