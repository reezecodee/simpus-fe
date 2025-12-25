import MainLayout from '@/layouts/MainLayout.vue'
import { type RouteRecordRaw } from 'vue-router'

import {
  BeakerIcon, 
  TruckIcon, 
  ArrowDownTrayIcon, 
  PresentationChartLineIcon, 
  ClipboardDocumentListIcon, 
  ArrowsRightLeftIcon,
  HomeIcon, 
} from '@heroicons/vue/24/outline'

const logistikRoutes: RouteRecordRaw[] = [
  {
    path: '/logistik',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Logistik/Gudang',
        component: () => import('../../views/logistik/Dashboard.vue'),
        meta: {
          title: 'Dashboard Logistik',
          icon: HomeIcon,
        },
      },
      {
        path: 'katalog-obat',
        name: 'Katalog Obat',
        component: () => import('../../views/logistik/KatalogObat.vue'),
        meta: {
          title: 'Katalog Obat',
          icon: BeakerIcon,
        },
      },
      {
        path: 'suplier',
        name: 'Suplier',
        component: () => import('../../views/logistik/Suplier.vue'),
        meta: {
          title: 'Master Suplier',
          icon: TruckIcon,
        },
      },
      {
        path: 'penerimaan-barang',
        name: 'Penerimaan Barang',
        component: () => import('../../views/logistik/PenerimaanBarang.vue'),
        meta: {
          title: 'Penerimaan (Inbound)',
          icon: ArrowDownTrayIcon,
        },
      },
      {
        path: 'monitoring-saldo',
        name: 'Monitoring Saldo',
        component: () => import('../../views/logistik/MonitoringSaldo.vue'),
        meta: {
          title: 'Monitor Stok & Aset',
          icon: PresentationChartLineIcon,
        },
      },
      {
        path: 'kartu-stok',
        name: 'Kartu Stok',
        component: () => import('../../views/logistik/KartuStok.vue'),
        meta: {
          title: 'Kartu Stok (Log)',
          icon: ClipboardDocumentListIcon,
        },
      },
      {
        path: 'mutasi',
        name: 'Mutasi',
        component: () => import('../../views/logistik/Mutasi.vue'),
        meta: {
          title: 'Mutasi / Transfer',
          icon: ArrowsRightLeftIcon,
        },
      },
    ],
  },
]

export default logistikRoutes
