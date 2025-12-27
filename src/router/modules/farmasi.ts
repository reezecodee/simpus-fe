import MainLayout from '@/layouts/MainLayout.vue'
import { type RouteRecordRaw } from 'vue-router'

import {
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  ClockIcon,
  HomeIcon,
  DocumentPlusIcon,
} from '@heroicons/vue/24/outline'

const farmasiRoutes: RouteRecordRaw[] = [
  {
    path: '/farmasi',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Farmasi',
        component: () => import('../../views/farmasi/Dashboard.vue'),
        meta: {
          title: 'Dashboard Farmasi',
          icon: HomeIcon,
        },
      },
      {
        path: 'permintaan-stok',
        name: 'Permintaan Stok',
        component: () => import('../../views/farmasi/PermintaanStok.vue'),
        meta: {
          title: 'Permintaan Stok (LPLPO)',
          icon: DocumentPlusIcon,
        },
      },
      {
        path: 'antrian-resep',
        name: 'Antrian Resep',
        component: () => import('../../views/farmasi/AntrianResep.vue'),
        meta: {
          title: 'E-Prescription (Resep)',
          icon: ClipboardDocumentListIcon,
        },
      },
      {
        path: 'penjualan-bebas',
        name: 'Penjualan Bebas',
        component: () => import('../../views/farmasi/PenjualanBebas.vue'),
        meta: {
          title: 'Penjualan Bebas (OTC)',
          icon: ShoppingBagIcon,
        },
      },
      {
        path: 'penyerahan-obat',
        name: 'Penyerahan Obat',
        component: () => import('../../views/farmasi/PenyerahanObat.vue'),
        meta: {
          title: 'Penyerahan & PIO',
          icon: CheckBadgeIcon,
        },
      },
      {
        path: 'riwayat-farmasi',
        name: 'Riwayat Farmasi',
        component: () => import('../../views/farmasi/RiwayatFarmasi.vue'),
        meta: {
          title: 'Riwayat Farmasi',
          icon: ClockIcon,
        },
      },
    ],
  },
]

export default farmasiRoutes
