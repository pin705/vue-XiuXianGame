import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import boss from '../views/bossPage.vue';
import cultivate from '../views/cultivatePage.vue';
import endlesstower from '../views/endlessPage.vue';
import explore from '../views/explorePage.vue';
import game from '../views/game/game.vue';
import home from '../views/homePage.vue';
import index from '../views/indexPage.vue';
import map from '../views/map.vue';
import mapExploration from '../views/mapExploration.vue';
import auth from '../views/authPage.vue';

const routes = [
    {
        path: '/auth',
        name: 'auth',
        meta: {
            keepAlive: false,
            requiresGuest: true
        },
        component: auth
    },
    {
        path: '/',
        name: 'index',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: index
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: home
    },
    {
        path: '/cultivate',
        name: 'cultivate',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: cultivate
    },
    {
        path: '/map',
        name: 'map',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: mapExploration
    },
    {
        path: '/explore',
        name: 'explore',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: explore
    },
    {
        path: '/boss',
        name: 'boss',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: boss
    },
    {
        path: '/endlesstower',
        name: 'endlesstower',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: endlesstower
    },
    {
        path: '/game',
        name: 'game',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: game
    },
    {
        path: '/xia-map',
        name: 'xia-map',
        meta: {
            keepAlive: false,
            requiresAuth: true
        },
        component: map
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'auth' });
        return;
    }
    
    // Check if route requires guest (not authenticated)
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next({ name: 'index' });
        return;
    }
    
    next();
});

export default router;
