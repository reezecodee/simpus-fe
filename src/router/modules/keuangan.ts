import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const keuanganRoutes: RouteRecordRaw[] = [
  {
    path: '/keuangan',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/keuangan/Dashboard.vue'),
        meta: {
          title: 'Dashboard Keuangan',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default keuanganRoutes
