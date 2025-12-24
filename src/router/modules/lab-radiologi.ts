import MainLayout from '@/layouts/MainLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const labRadiologiRoutes: RouteRecordRaw[] = [
  {
    path: '/lab-radiologi',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: import('../../views/lab-radiologi/Dashboard.vue'),
        meta: {
          title: 'Dashboard Laboratorium & Radiologi',
          icon: HomeIcon
        }
      }
    ]
  },
]

export default labRadiologiRoutes
