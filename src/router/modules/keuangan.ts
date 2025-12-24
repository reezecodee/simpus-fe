import MainLayout from '@/layouts/MainLayout.vue'
import { ArrowsRightLeftIcon, ArrowUpTrayIcon, DocumentChartBarIcon, HomeIcon, ReceiptPercentIcon, WalletIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const keuanganRoutes: RouteRecordRaw[] = [
  {
    path: '/keuangan',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Keuangan',
        component: import('../../views/keuangan/Dashboard.vue'),
        meta: {
          title: 'Dashboard Keuangan',
          icon: HomeIcon,
        },
      },
      {
        path: 'manajemen-piutang',
        name: 'Manajemen Piutang',
        component: import('../../views/keuangan/ManajemenPiutang.vue'),
        meta: {
          title: 'Manajemen Piutang',
          icon: ReceiptPercentIcon,
        },
      },
      {
        path: 'riwayat-cicilan',
        name: 'Riwayat Cicilan',
        component: import('../../views/keuangan/RiwayatCicilan.vue'),
        meta: {
          title: 'Riwayat Cicilan',
          icon: WalletIcon,
        },
      },
      {
        path: 'rekonsiliasi',
        name: 'Verifikasi Setoran',
        component: import('../../views/keuangan/Rekonsiliasi.vue'),
        meta: {
          title: 'Verifikasi Setoran',
          icon: ArrowsRightLeftIcon,
        },
      },
      {
        path: 'expenditure',
        name: 'Pengeluaran & Biaya',
        component: import('../../views/keuangan/Expenditure.vue'),
        meta: {
          title: 'Pengeluaran & Biaya',
          icon: ArrowUpTrayIcon,
        },
      },
      {
        path: 'laporan-akuntansi',
        name: 'Laporan Akuntansi',
        component: import('../../views/keuangan/LaporanAkuntansi.vue'),
        meta: {
          title: 'Laporan Akuntansi',
          icon: DocumentChartBarIcon,
        },
      },
    ],
  },
]

export default keuanganRoutes
