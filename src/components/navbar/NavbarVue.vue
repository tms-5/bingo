<template>
  <nav>
    <div class="wrapper container">
      <div class="logo">
        <a href="/"
          >b<span class="c-blue-200">!</span>ng<span class="c-blue-200"
            >0</span
          ></a
        >
      </div>
      <DarkMode />
      <input type="radio" name="slider" id="menu-btn" />
      <input type="radio" name="slider" id="close-btn" />
      <ul class="nav-links">
        <label for="close-btn" class="btn close-btn">
          <svg
            class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1wmkh38"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="CloseIcon">
            <path
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </label>
        <li v-for="(link, index) in links" :key="index">
         <router-link :to="link.url">{{ link.name }}</router-link>
        </li>
      </ul>
      <label for="menu-btn" class="btn menu-btn">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </label>
    </div>
  </nav>
</template>

<script>
import DarkMode from './DarkMode.vue';
export default {
  name: 'NavbarVue',
  components: {
    DarkMode,
  },
  data() {
    return {
        links: [
            { name: 'Home', url: '/' },
            { name: 'Host a game', url: '/host' },
            { name: 'Print card', url: '/cards' },
            { name: 'Virtual card', url: '/virtual-card' },
            { name: 'Sorter', url: '/sorter' },
        ],
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

nav {
    width: 100%;
    background: var(--navbar-bg);
    position: fixed;
    z-index: 99999;
}

nav .wrapper {
    position: relative;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

@media screen and (max-width: 574px) {
    nav .wrapper {
        padding: 0 16px;
    }
    
}

.wrapper .logo a {
    color: var(--navbar-color);
    font-size: 30px;
    font-weight: 600;
    text-decoration: none;
}

.wrapper .nav-links {
    display: inline-flex;
    z-index: 99;
}

.nav-links li {
    list-style: none;
    display: flex;
    cursor: pointer;
}

.nav-links li a {
    color: var(--navbar-color);
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    padding: 0 8px;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.nav-links li a:hover {
    background: var(--hover-navbar);
}

.nav-links .mobile-item {
    display: none;
}

.drop-menu li a {
    width: 100%;
    display: block;
    padding: 0 0 0 15px;
    font-weight: 400;
    border-radius: 0px;
}

.mega-box {
    position: absolute;
    left: 0;
    width: 100%;
    padding: 0 30px;
    top: 85px;
    opacity: 0;
    visibility: hidden;
}

.mega-box .content {
    background: #242526;
    padding: 25px 20px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.mega-box .content .row {
    width: calc(25% - 30px);
    line-height: 45px;
}

.content .row img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.content .row header {
    color: #f2f2f2;
    font-size: 20px;
    font-weight: 500;
}

.content .row .mega-links {
    margin-left: -40px;
    border-left: 1px solid rgba(255, 255, 255, 0.09);
}

.row .mega-links li {
    padding: 0 20px;
}

.row .mega-links li a {
    padding: 0px;
    padding: 0 20px;
    color: #d9d9d9;
    font-size: 17px;
    display: block;
}

.row .mega-links li a:hover {
    color: #f2f2f2;
}

.wrapper .btn {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    display: none;
}

.wrapper .btn.close-btn {
    position: absolute;
    right: 30px;
    top: 10px;
    height: 30px;
    width: 30px;
    fill: white;
}

.bar {
    height: 2px;
    width: 20px;
    background: var(--text-color);
    border-radius: 16px;
    margin-bottom: 2px;
}

@media screen and (max-width: 970px) {
    .wrapper .btn {
        display: block;
    }

    .wrapper .nav-links {
        position: fixed;
        height: 100vh;
        width: 100%;
        max-width: 350px;
        top: 0;
        left: -100%;
        background: #242526;
        display: block;
        padding: 50px 10px;
        line-height: 50px;
        overflow-y: auto;
        box-shadow: 0px 15px 15px rgba(0, 0, 0, 0.18);
        transition: all 0.3s ease;
    }

    /* custom scroll bar */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #242526;
    }

    ::-webkit-scrollbar-thumb {
        background: #3A3B3C;
    }

    #menu-btn:checked~.nav-links {
        left: 0%;
    }

    #menu-btn:checked~.nav-links li a {
        color: white !important;
    }

    #menu-btn:checked~.btn.menu-btn {
        display: none;
    }

    #close-btn:checked~.btn.menu-btn {
        display: block;
    }

    .nav-links li {
        margin: 15px 10px;
    }

    .nav-links li a {
        padding: 0 20px;
        display: block;
        font-size: 20px;
    }

    .nav-links .drop-menu {
        position: static;
        opacity: 1;
        top: 65px;
        visibility: visible;
        padding-left: 20px;
        width: 100%;
        max-height: 0px;
        overflow: hidden;
        box-shadow: none;
        transition: all 0.3s ease;
    }

    #showDrop:checked~.drop-menu,
    #showMega:checked~.mega-box {
        max-height: 100%;
    }

    .nav-links .desktop-item {
        display: none;
    }

    .nav-links .mobile-item {
        display: block;
        color: #f2f2f2;
        font-size: 20px;
        font-weight: 500;
        padding-left: 20px;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .nav-links .mobile-item:hover {
        background: #3A3B3C;
    }

    .drop-menu li {
        margin: 0;
    }

    .drop-menu li a {
        border-radius: 5px;
        font-size: 18px;
    }

    .mega-box {
        position: static;
        top: 65px;
        opacity: 1;
        visibility: visible;
        padding: 0 20px;
        max-height: 0px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .mega-box .content {
        box-shadow: none;
        flex-direction: column;
        padding: 20px 20px 0 20px;
    }

    .mega-box .content .row {
        width: 100%;
        margin-bottom: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .mega-box .content .row:nth-child(1),
    .mega-box .content .row:nth-child(2) {
        border-top: 0px;
    }

    .content .row .mega-links {
        border-left: 0px;
        padding-left: 15px;
    }

    .row .mega-links li {
        margin: 0;
    }

    .content .row header {
        font-size: 19px;
    }
}

nav input {
    display: none;
}

.body-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    padding: 0 30px;
}

.body-text div {
    font-size: 45px;
    font-weight: 600;
}
</style>
