import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const pendaftaranRoutes: RouteRecordRaw[] = [
  {
    path: '/pendaftaran',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/pendaftaran/Dashboard.vue'),
        meta: {
          title: 'Dashboard Pendaftaran',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default pendaftaranRoutes
