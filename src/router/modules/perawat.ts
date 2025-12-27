import MainLayout from '@/layouts/MainLayout.vue'
import { type RouteRecordRaw } from 'vue-router'

import { TruckIcon, ClipboardDocumentListIcon, HomeIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const perawatRoutes: RouteRecordRaw[] = [
  {
    path: '/perawat',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Perawat',
        component: () => import('../../views/perawat/Dashboard.vue'),
        meta: {
          title: 'Dashboard Perawat',
          icon: HomeIcon,
        },
      },
      {
        path: 'triage',
        name: 'Triage IGD',
        component: () => import('../../views/perawat/TriageIGD.vue'),
        meta: {
          title: 'Triage Gawat Darurat',
          icon: TruckIcon,
        },
      },
      {
        path: 'asuhan',
        name: 'Daftar Pasien Asuhan',
        component: () => import('../../views/perawat/DaftarPasienAsuhan.vue'),
        meta: {
          title: 'Daftar Pasien Asuhan',
          icon: UserGroupIcon,
        },
      },
      {
        path: 'asuhan/:id',
        name: 'Asuhan Keperawatan',
        component: () => import('../../views/perawat/AsuhanPerawat.vue'),
        meta: {
          title: 'Asuhan & Grafik Harian',
          icon: ClipboardDocumentListIcon,
        },
      },
    ],
  },
]

export default perawatRoutes
