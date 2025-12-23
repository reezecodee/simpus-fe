import { HomeIcon } from '@heroicons/vue/24/outline'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/admin/Blank.vue'),
    meta: { title: 'Dashboard', layout: 'main', icon: HomeIcon },
  },
  // {
  //   path: '/pendaftaran',
  //   name: 'pendaftaran',
  //   component: () => import('../views/pendaftaran/InputPasien.vue'),
  //   meta: { title: 'Pendaftaran Pasien', layout: 'main' }
  // },
  // {
  //   path: '/poli/umum',
  //   name: 'poli-umum',
  //   component: () => import('../views/poli/PoliUmum.vue'),
  //   meta: { title: 'Poli Umum', layout: 'main' }
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('../views/auth/Login.vue'),
  //   meta: { title: 'Login', layout: 'blank' }
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
