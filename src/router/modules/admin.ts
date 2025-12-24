import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Admin',
        component: import('../../views/admin/Dashboard.vue'),
        meta: {
          title: 'Dashboard Admin',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default adminRoutes
