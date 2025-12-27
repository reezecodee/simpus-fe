import MainLayout from '@/layouts/MainLayout.vue'
import { type RouteRecordRaw } from 'vue-router'
import { ClipboardDocumentListIcon, ArchiveBoxIcon, HomeIcon } from '@heroicons/vue/24/outline'

const penunjangRoutes: RouteRecordRaw[] = [
  {
    path: '/penunjang',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Penunjang',
        component: () => import('../../views/lab-radiologi/Dashboard.vue'),
        meta: {
          title: 'Dashboard Lab & Rad',
          icon: HomeIcon,
        },
      },
      {
        path: 'antrian',
        name: 'Worklist Penunjang',
        component: () => import('../../views/lab-radiologi/AntrianPenunjang.vue'),
        meta: {
          title: 'Antrian Pemeriksaan',
          icon: ClipboardDocumentListIcon,
        },
      },
      {
        path: 'riwayat',
        name: 'Riwayat Penunjang',
        component: () => import('../../views/lab-radiologi/RiwayatPenunjang.vue'),
        meta: {
          title: 'Bank Data Hasil',
          icon: ArchiveBoxIcon,
        },
      },
    ],
  },
]

export default penunjangRoutes
