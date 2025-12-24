import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const logistikRoutes: RouteRecordRaw[] = [
  {
    path: '/logistik',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/logistik/Dashboard.vue'),
        meta: {
          title: 'Dashboard Logistik',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default logistikRoutes
