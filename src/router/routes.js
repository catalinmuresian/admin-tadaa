const routes = [
  { path: '/', name: 'login', component: () => import('pages/Login.vue') },
  {
    path: '/',
    name: 'mainLayout',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/dashboard', name: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: '/reports', name: 'reports', component: () => import('pages/Reports.vue') }
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
