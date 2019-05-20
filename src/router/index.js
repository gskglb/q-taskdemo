import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { AUTH } from '../plugins/firebase'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  // check for auth
  Router.beforeEach((to, from, next) => {
    const currentUser = AUTH.currentUser
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !currentUser) {
      next('/login')
    } else if (!requiresAuth && currentUser) {
      next('/list')
    } else {
      next()
    }
  })

  return Router
}
