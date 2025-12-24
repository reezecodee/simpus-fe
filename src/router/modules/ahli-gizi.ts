import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const ahliGiziRoutes: RouteRecordRaw[] = [
  {
    path: '/ahli-gizi',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/ahli-gizi/Dashboard.vue'),
        meta: {
          title: 'Dashboard Ahli Gizi',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default ahliGiziRoutes
