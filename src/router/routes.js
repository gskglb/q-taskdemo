
const routes = [
  {
    path: '/login',
    component: () => import('layouts/NoLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      { path: 'new', component: () => import('pages/NewTask.vue') },
      { path: 'list', component: () => import('pages/List.vue') },
      { path: 'done', component: () => import('pages/Done.vue') }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }

]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
