import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const perawatRoutes: RouteRecordRaw[] = [
  {
    path: '/perawat',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/perawat/Dashboard.vue'),
        meta: {
          title: 'Dashboard Perawat',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default perawatRoutes
