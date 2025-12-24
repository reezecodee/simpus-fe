import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import adminRoutes from './modules/admin'
import ahliGiziRoutes from './modules/ahli-gizi'
import bidanRoutes from './modules/bidan'
import dokterGigiRoutes from './modules/dokter-gigi'
import dokterRoutes from './modules/dokter'
import farmasiRoutes from './modules/farmasi'
import kasirRoutes from './modules/kasir'
import keuanganRoutes from './modules/keuangan'
import labRadiologiRoutes from './modules/lab-radiologi'
import logistikRoutes from './modules/logistik'
import pendaftaranRoutes from './modules/pendaftaran'
import perawatRoutes from './modules/perawat'

const routes: RouteRecordRaw[] = [
  ...adminRoutes,
  ...ahliGiziRoutes,
  ...bidanRoutes,
  ...dokterGigiRoutes,
  ...dokterRoutes,
  ...farmasiRoutes,
  ...kasirRoutes,
  ...keuanganRoutes,
  ...labRadiologiRoutes,
  ...logistikRoutes,
  ...pendaftaranRoutes,
  ...perawatRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
