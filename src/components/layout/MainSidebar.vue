<script setup lang="ts">
import { computed } from 'vue' // Tambahkan computed
import { useRouter, useRoute } from 'vue-router'
import type { Component } from 'vue'

// --- MOCK AUTH (Simulasi) ---
// Nanti ini diganti dengan data dari Pinia Store / Auth Anda
// Contoh Role: 'admin', 'pendaftaran', 'dokter', 'apoteker', 'kasir'
const userRole = 'farmasi' // Coba ganti string ini untuk tes

import {
    HomeIcon,
    HeartIcon,
    BeakerIcon,
    BanknotesIcon,
    PowerIcon,
    UsersIcon,
    UserGroupIcon,
    BookOpenIcon,
    CalendarIcon,
    ClockIcon,
    ClipboardDocumentCheckIcon,
    ArrowsRightLeftIcon,
    ArrowUpTrayIcon,
    DocumentChartBarIcon,
    ReceiptPercentIcon,
    WalletIcon,
    TruckIcon,
    ArrowDownTrayIcon,
    PresentationChartLineIcon,
    ClipboardDocumentListIcon,
    ShoppingBagIcon,
    CheckBadgeIcon
} from '@heroicons/vue/24/outline'

defineProps<{ isOpen: boolean }>()
const router = useRouter()
const route = useRoute()

// 1. UPDATE TYPE DEFINITION
// Tambahkan properti 'roles' (array string) yang opsional
type MenuItem =
    | { header: string; roles?: string[]; path?: never; icon?: never; title?: never; badge?: never }
    | { path: string; icon: Component; title: string; roles?: string[]; badge?: number; header?: never }

// 2. DEFINISIKAN MENU & HAK AKSES
// Jika 'roles' tidak diisi, berarti menu itu muncul untuk SEMUA user
const menus: MenuItem[] = [
    { header: 'Menu Utama' },

    // Dashboard: Semua bisa lihat
    // { path: '/admin/dashboard', icon: HomeIcon, title: 'Dashboard' },

    // Master Data: Hanya Admin
    { path: '/admin/users', icon: UsersIcon, title: 'Manajemen User', roles: ['admin'] },

    // Pendaftaran
    { path: '/pendaftaran/dashboard', icon: HomeIcon, title: 'Dashboard', roles: ['pendaftaran'] },
    { path: '/pendaftaran/data-pasien', icon: UserGroupIcon, title: 'Data Pasien', roles: ['pendaftaran'] },
    { path: '/pendaftaran/laporan', icon: BookOpenIcon, title: 'Laporan Rekapitulasi', roles: ['pendaftaran'] },
    { path: '/pendaftaran/jadwal', icon: CalendarIcon, title: 'Jadwal Kerja', roles: ['pendaftaran'] },

    // Poli: Admin & Dokter & Perawat
    { path: '/poli/umum', icon: HeartIcon, title: 'Poliklinik', badge: 5, roles: ['admin', 'dokter', 'perawat'] },

    // Farmasi: Admin & Apoteker
    { path: '/farmasi', icon: BeakerIcon, title: 'Farmasi', roles: ['admin', 'apoteker'] },

    // Kasir
    { path: '/kasir/dashboard', icon: HomeIcon, title: 'Dashboard', roles: ['kasir'] },
    { path: '/kasir/riwayat-transaksi', icon: ClockIcon, title: 'Riwayat Transaksi', roles: ['kasir'] },
    { path: '/kasir/setoran', icon: BanknotesIcon, title: 'Setoran & Tutup Shift', roles: ['kasir'] },
    { path: '/kasir/monitoring-piutang', icon: ClipboardDocumentCheckIcon, title: 'Monitoring Piutang', roles: ['kasir'] },

    // Keuangan
    { path: '/keuangan/dashboard', icon: HomeIcon, title: 'Dashboard', roles: ['keuangan'] },
    { path: '/keuangan/manajemen-piutang', icon: ReceiptPercentIcon, title: 'Manajemen Piutang', roles: ['keuangan'] },
    { path: '/keuangan/riwayat-cicilan', icon: WalletIcon, title: 'Riwayat Cicilan', roles: ['keuangan'] },
    { path: '/keuangan/rekonsiliasi', icon: ArrowsRightLeftIcon, title: 'Verifikasi Setoran', roles: ['keuangan'] },
    { path: '/keuangan/expenditure', icon: ArrowUpTrayIcon, title: 'Pengeluaran & Biaya', roles: ['keuangan'] },
    { path: '/keuangan/laporan-akuntansi', icon: DocumentChartBarIcon, title: 'Laporan Akuntansi', roles: ['keuangan'] },

    // Logistik/Gudang
    { path: '/logistik/dashboard', icon: HomeIcon, title: 'Dashboard', roles: ['logistik'] },
    { path: '/logistik/katalog-obat', icon: BeakerIcon, title: 'Katalog Obat', roles: ['logistik'] },
    { path: '/logistik/suplier', icon: TruckIcon, title: 'Suplier', roles: ['logistik'] },
    { path: '/logistik/penerimaan-barang', icon: ArrowDownTrayIcon, title: 'Penerimaan Barang', roles: ['logistik'] },
    { path: '/logistik/monitoring-saldo', icon: PresentationChartLineIcon, title: 'Monitoring Saldo', roles: ['logistik'] },
    { path: '/logistik/mutasi', icon: ArrowsRightLeftIcon, title: 'Mutasi', roles: ['logistik'] },

    // Farmasi
    { path: '/farmasi/dashboard', icon: HomeIcon, title: 'Dashboard', roles: ['farmasi'] },
    { path: '/farmasi/antrian-resep', icon: ClipboardDocumentListIcon, title: 'Antrian Resep', roles: ['farmasi'] },
    { path: '/farmasi/penjualan-bebas', icon: ShoppingBagIcon, title: 'Penjualan Bebas (OTC)', roles: ['farmasi'] },
    { path: '/farmasi/penyerahan-obat', icon: CheckBadgeIcon, title: 'Penyerahan Obat', roles: ['farmasi'] },
    { path: '/farmasi/riwayat-farmasi', icon: ClockIcon, title: 'Riwayat Farmasi', roles: ['farmasi'] },
]

// 3. LOGIC FILTER MENU
const filteredMenus = computed(() => {
    return menus.filter(item => {
        // Jika item tidak punya properti roles, tampilkan ke semua orang
        if (!item.roles) return true

        // Jika punya roles, cek apakah role user sekarang ada di daftar yang diizinkan
        return item.roles.includes(userRole)
    })
})

function navigate(path: string | undefined) {
    if (path) router.push(path);
}
</script>

<template>
    <aside
        class="bg-gradient-to-b from-[#14532d] to-[#064e3b] text-white h-screen flex flex-col transition-all duration-300 ease-in-out shadow-2xl z-40 border-r border-white/5"
        :class="isOpen ? 'w-[200px] py-[12px] px-[10px] opacity-100' : 'w-0 p-0 opacity-0 overflow-hidden'">

        <div class="mb-[12px] border-b border-white/10 pb-[12px] px-[5px] flex items-center gap-[10px]">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6vw8bWS5cJl1KEb3NSK1H74jOxve_rBSfpJZU2jpmKZ6SXEjIF0a5WvLy3ZolO-e3kVzK_9Pl9dCzRFka0pjiWz8WHfi9lMVddUc-m3QDxeNP7IDpXw2joyjt4XJMgyIdtYTwFHTpSfo8tie-MH3TA5HM1zHQthgiEc9VZ-lZQ5Q0b9RwLAR-VQ/s320/GKL27_logo-kota-tasikmalaya%20-%20Koleksilogo.com.png"
                alt="Logo Tasikmalaya" class="w-[32px] h-auto drop-shadow-md" />

            <div v-show="isOpen">
                <h1 class="font-bold text-[10px] leading-tight text-white tracking-wide">
                    UPTD PUSKESMAS URUG
                </h1>
                <div class="flex items-center gap-1 opacity-80">
                    <span class="text-[9px] font-medium uppercase tracking-[1px] text-green-50">
                        {{ userRole }} </span>
                </div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar pr-[2px]">
            <template v-for="(item, idx) in filteredMenus" :key="idx">

                <div v-if="item.header"
                    class="text-[9px] uppercase font-bold text-white/30 mt-[10px] mb-[4px] ml-[8px] tracking-[1px]">
                    {{ item.header }}
                </div>

                <div v-else @click="navigate(item.path)"
                    class="flex items-center px-[10px] py-[8px] mb-[4px] rounded-[8px] cursor-pointer transition-all duration-200 text-[12px] font-medium group relative overflow-hidden"
                    :class="route.path.startsWith(item.path || '')
                        ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-md font-semibold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-[2px]'">

                    <component :is="item.icon" class="mr-[8px] w-[16px] h-[16px]" stroke-width="2" />

                    <span class="truncate">{{ item.title }}</span>

                    <span v-if="item.badge"
                        class="ml-auto bg-[#ef4444] text-white text-[9px] px-[5px] py-[1px] rounded-[6px] font-bold">
                        {{ item.badge }}
                    </span>
                </div>

            </template>
        </div>

        <div class="mt-auto pt-[10px] border-t border-white/10">
            <button
                class="w-full flex items-center gap-[8px] p-[8px] rounded-[8px] bg-black/20 hover:bg-red-600/80 cursor-pointer transition-all duration-200 group text-left">
                <div
                    class="w-[28px] h-[28px] rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:bg-white/20 group-hover:border-transparent transition">
                    <PowerIcon class="w-[14px] h-[14px]" />
                </div>

                <div class="overflow-hidden" v-show="isOpen">
                    <div class="text-[11px] font-semibold leading-tight text-white group-hover:text-white">
                        Logout
                    </div>
                    <div class="text-[9px] opacity-60 leading-tight mt-[1px] text-white group-hover:opacity-90">
                        Keluar Sistem
                    </div>
                </div>
            </button>
        </div>
    </aside>
</template>