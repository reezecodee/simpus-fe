import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const dokterRoutes: RouteRecordRaw[] = [
  {
    path: '/dokter',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/dokter/Dashboard.vue'),
        meta: {
          title: 'Dashboard Dokter',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default dokterRoutes
