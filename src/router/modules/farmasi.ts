import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const farmasiRoutes: RouteRecordRaw[] = [
  {
    path: '/farmasi',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/farmasi/Dashboard.vue'),
        meta: {
          title: 'Dashboard Farmasi',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default farmasiRoutes
