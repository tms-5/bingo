import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/IndexPage.vue';
import Host from '../views/HostPage.vue';
import CardPage from '../views/CardPage.vue';
import VirtualCard from '../views/VirtualCardPage.vue';
import SorterPage from '../views/SorterPage.vue';
import CardGame from '../views/CardGame.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  { path: '/card-game', component: CardGame },
  { path: '/host', component: Host },
  { path: '/cards', component: CardPage },
  { path: '/virtual-card', component: VirtualCard },
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/sorter', component: SorterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
