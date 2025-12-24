import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const dokterGigiRoutes: RouteRecordRaw[] = [
  {
    path: '/dokter-gigi',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/dokter-gigi/Dashboard.vue'),
        meta: {
          title: 'Dashboard Dokter Gigi',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default dokterGigiRoutes
