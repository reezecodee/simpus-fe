import MainLayout from '@/layouts/MainLayout.vue'
import { BookOpenIcon, CalendarIcon, HomeIcon, PencilIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import { type RouteRecordRaw } from 'vue-router'

const pendaftaranRoutes: RouteRecordRaw[] = [
  {
    path: '/pendaftaran',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard Pendaftaran',
        component: import('../../views/pendaftaran/Dashboard.vue'),
        meta: {
          title: 'Dashboard Pendaftaran',
          icon: HomeIcon,
        },
      },
      {
        path: 'data-pasien',
        name: 'Data Pasien',
        component: import('../../views/pendaftaran/DataPasien.vue'),
        meta: {
          title: 'Data Pasien',
          icon: UserGroupIcon,
        },
      },
      {
        path: 'detail-biodata/:id',
        name: 'Detail Biodata',
        component: import('../../views/pendaftaran/DetailBiodata.vue'),
        meta: {
          title: 'Detail Biodata Pasien',
          icon: PencilIcon
        }
      },
      {
        path: 'laporan',
        name: 'Laporan Rekapitulasi',
        component: import('../../views/pendaftaran/Laporan.vue'),
        meta: {
          title: 'Laporan Rekapitulasi',
          icon: BookOpenIcon,
        },
      },
      {
        path: 'jadwal',
        name: 'Jadwal Kerja',
        component: import('../../views/pendaftaran/Jadwal.vue'),
        meta: {
          title: 'Jadwal Kerja',
          icon: CalendarIcon,
        },
      },
    ],
  },
]

export default pendaftaranRoutes
