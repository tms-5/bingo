import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/IndexPage.vue';
import VirtualCard from '../views/VirtualCardPage.vue';
import CreateRoom from '../views/CreateRoomPage.vue';
import JoinRoom from '../views/JoinRoomPage.vue';
import GameRoom from '../views/GameRoomPage.vue';
import HostRoom from '../views/HostRoomPage.vue';
import HostLogin from '../views/HostLoginPage.vue';
import CardPage from '../views/CardPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  { path: '/create-room', component: CreateRoom, name: 'CreateRoom' },
  { path: '/join-room', component: JoinRoom, name: 'JoinRoom' },
  { path: '/host-login', component: HostLogin, name: 'HostLogin' },
  { path: '/game/:room_id', component: GameRoom, name: 'GameRoom' },
  { path: '/host-room/:room_id', component: HostRoom, name: 'HostRoom' },
  { path: '/virtual-card', component: VirtualCard },
  { path: '/card', component: CardPage, name: 'CardPage' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
