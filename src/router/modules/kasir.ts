import MainLayout from '@/layouts/MainLayout.vue'
import {
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  HomeIcon,
} from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const kasirRoutes: RouteRecordRaw[] = [
  {
    path: '/kasir',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Kasir',
        component: import('../../views/kasir/Dashboard.vue'),
        meta: {
          title: 'Dashboard Kasir',
          icon: HomeIcon,
        },
      },
      {
        path: 'riwayat-transaksi',
        name: 'Riwayat Transaksi',
        component: import('../../views/kasir/RiwayatTransaksi.vue'),
        meta: {
          title: 'Riwayat Transaksi',
          icon: ClockIcon,
        },
      },
      {
        path: 'setoran',
        name: 'Setoran & Tutup Shift',
        component: import('../../views/kasir/Setoran.vue'),
        meta: {
          title: 'Setoran & Tutup Shift',
          icon: BanknotesIcon,
        },
      },
      {
        path: 'monitoring-piutang',
        name: 'Monitoring Piutang',
        component: import('../../views/kasir/MonitoringPiutang.vue'),
        meta: {
          title: 'Monitoring Piutang',
          icon: ClipboardDocumentCheckIcon,
        },
      },
    ],
  },
]

export default kasirRoutes
