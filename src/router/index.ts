/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

// Adiciona uma rota 404
routes.push({
  path: '/:catchAll(.*)',
  component: () => import('@/pages/NotFound.vue')
})
// Adiciona uma rota padrão que redireciona para a home
routes.push({
  path: '/',
  redirect: '/home'
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userToken = localStorage.getItem("userToken");

  if (!userToken) {
    if (to.path !== "/home") {
      next({ path: "/home" });
    } else {
      next();
    }
  } else {
    if (to.path === "/home") {
      next({ path: "/tarefas" });
    } else {
      next();
    }
  }
});


router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
