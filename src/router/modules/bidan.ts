import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const bidanRoutes: RouteRecordRaw[] = [
  {
    path: '/bidan',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/bidan/Dashboard.vue'),
        meta: {
          title: 'Dashboard Bidan',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default bidanRoutes
