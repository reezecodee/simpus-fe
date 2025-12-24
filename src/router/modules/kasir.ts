import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const kasirRoutes: RouteRecordRaw[] = [
  {
    path: '/kasir',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/kasir/Dashboard.vue'),
        meta: {
          title: 'Dashboard Kasir',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default kasirRoutes
