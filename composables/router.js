import { createRouter, createWebHashHistory } from 'vue-router';
import boss from '../views/bossPage.vue';
import cultivate from '../views/cultivatePage.vue';
import endlesstower from '../views/endlessPage.vue';
import explore from '../views/explorePage.vue';
import game from '../views/game/game.vue';
import home from '../views/homePage.vue';
import index from '../views/indexPage.vue';
import map from '../views/map.vue';
import mapExploration from '../views/mapExploration.vue';

const routes = [
    {
        path: '/',
        name: 'index',
        meta: {
            keepAlive: false
        },
        component: index
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            keepAlive: false
        },
        component: home
    },
    {
        path: '/cultivate',
        name: 'cultivate',
        meta: {
            keepAlive: false
        },
        component: cultivate
    },
    {
        path: '/map',
        name: 'map',
        meta: {
            keepAlive: false
        },
        component: mapExploration
    },
    {
        path: '/explore',
        name: 'explore',
        meta: {
            keepAlive: false
        },
        component: explore
    },
    {
        path: '/boss',
        name: 'boss',
        meta: {
            keepAlive: false
        },
        component: boss
    },
    {
        path: '/endlesstower',
        name: 'endlesstower',
        meta: {
            keepAlive: false
        },
        component: endlesstower
    },
    {
        path: '/game',
        name: 'game',
        meta: {
            keepAlive: false
        },
        component: game
    },
    {
        path: '/xia-map',
        name: 'xia-map',
        meta: {
            keepAlive: false
        },
        component: map
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
