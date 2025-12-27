import MainLayout from '@/layouts/MainLayout.vue'
import { type RouteRecordRaw } from 'vue-router'

import { UserGroupIcon, ClipboardDocumentCheckIcon, HomeIcon } from '@heroicons/vue/24/outline'

const giziRoutes: RouteRecordRaw[] = [
  {
    path: '/gizi',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Gizi',
        component: () => import('../../views/ahli-gizi/Dashboard.vue'),
        meta: {
          title: 'Dashboard Nutrisionis',
          icon: HomeIcon,
        },
      },
      {
        path: 'asuhan-gizi',
        name: 'Asuhan Gizi',
        component: () => import('../../views/ahli-gizi/AsuhanGiziPasien.vue'),
        meta: {
          title: 'Daftar Pasien & Skrining',
          icon: UserGroupIcon,
        },
      },
      {
        path: 'order-makanan',
        name: 'Order Makanan',
        component: () => import('../../views/ahli-gizi/OrderMakanan.vue'),
        meta: {
          title: 'Rekap & Label Makanan',
          icon: ClipboardDocumentCheckIcon,
        },
      },
    ],
  },
]

export default giziRoutes
