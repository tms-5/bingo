import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/IndexPage.vue';
import Host from '../views/HostPage.vue';
import CardPage from '../views/CardPage.vue';
import VirtualCard from '../views/VirtualCardPage.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/host', component: Host },
  { path: '/cards', component: CardPage },
  { path: '/virtual-card', component: VirtualCard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
