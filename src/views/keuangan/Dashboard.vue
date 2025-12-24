<script setup lang="ts">
import { ref } from 'vue'

// --- COMPONENTS (Asumsi sudah ada komponen Chart atau kita pakai Placeholder) ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

// --- ICONS ---
import {
    Squares2X2Icon,
    BanknotesIcon,
    ArrowUpTrayIcon,
    ClipboardDocumentCheckIcon,
    ArrowTrendingUpIcon,
    ArrowPathIcon,
    BuildingLibraryIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA DUMMY (Untuk Visualisasi)
// ==========================================
const summary = [
    { label: 'Omzet Hari Ini', val: 'Rp 4.250.000', change: '+12%', icon: BanknotesIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Piutang BPJS', val: 'Rp 12.800.000', change: '5 Klaim', icon: ClipboardDocumentCheckIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Biaya Operasional', val: 'Rp 1.150.000', change: '-5%', icon: ArrowUpTrayIcon, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Kas Bersih', val: 'Rp 3.100.000', change: 'Nett', icon: BuildingLibraryIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
]

const recentTransactions = [
    { id: 1, pasien: 'Budi Santoso', unit: 'Poli Umum', total: 125000, metode: 'QRIS', waktu: '10:15' },
    { id: 2, pasien: 'Siti Aminah', unit: 'Poli Gigi', total: 450000, metode: 'TUNAI', waktu: '10:30' },
    { id: 3, pasien: 'Dedi Kurnia', unit: 'Laboratorium', total: 85000, metode: 'VA', waktu: '11:05' },
]


// ==========================================
// 2. Laporan Bulanan (Closing bulanan, evaluasi performa poli, laporan realisasi anggaran)
// ==========================================
const handleMonthlyReport = () => {
  // Logika: Membuka modal pilihan bulan atau langsung generate PDF
  const confirmReport = confirm('Generate Laporan Keuangan periode Desember 2025?')
  if (confirmReport) {
    alert('Sedang menyusun laporan... File PDF akan otomatis terunduh.')
  }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Dashboard Keuangan</h1>
                <p class="text-[12px] text-gray-500">Ringkasan performa finansial periode berjalan.</p>
            </div>
            <div class="flex gap-2">
                <BaseButton variant="secondary" :icon="ArrowPathIcon">Update Data</BaseButton>
                <BaseButton variant="primary" @click="handleMonthlyReport">Laporan Bulanan</BaseButton>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="item in summary" :key="item.label"
                class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm border-b-[4px]" :class="[
                    item.label === 'Omzet Hari Ini' ? 'border-b-green-600' : '',
                    item.label === 'Piutang BPJS' ? 'border-b-orange-500' : '',
                    item.label === 'Biaya Operasional' ? 'border-b-red-600' : '',
                    item.label === 'Kas Bersih' ? 'border-b-blue-600' : ''
                ]">

                <div class="flex justify-between items-start mb-4">
                    <div :class="['p-2 rounded-lg', item.bg]">
                        <component :is="item.icon" :class="['w-6 h-6', item.color]" />
                    </div>

                    <span v-if="item.change.includes('%') || item.change.includes('Klaim')" :class="['text-[10px] font-bold px-2 py-0.5 rounded-full',
                        item.change.includes('+') ? 'bg-green-50 text-green-600' :
                            item.change.includes('-') ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600']">
                        {{ item.change }}
                    </span>
                </div>

                <p class="text-[10px] font-black text-gray-600 uppercase tracking-wider">{{ item.label }}</p>
                <p class="text-[20px] font-bold text-gray-900 font-mono tracking-tighter">{{ item.val }}</p>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-6">

            <div class="col-span-12 lg:col-span-8 space-y-4">
                <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-green-600">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-[12px] font-bold text-gray-800 uppercase flex items-center gap-2">
                            <ArrowTrendingUpIcon class="w-4 h-4 text-green-600" />
                            Tren Pendapatan 7 Hari Terakhir
                        </h3>
                        <select class="text-[10px] font-bold border-gray-300 rounded uppercase">
                            <option>Desember 2025</option>
                        </select>
                    </div>

                    <div
                        class="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                        <div class="absolute inset-0 opacity-10 flex items-end justify-between px-10 pb-4">
                            <div v-for="h in 7" :key="h" class="w-8 bg-green-600" :style="{ height: (h * 15) + '%' }">
                            </div>
                        </div>
                        <p
                            class="text-gray-400 text-[11px] font-bold uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-sm z-10">
                            [ Area Chart Pendapatan ]
                        </p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-[11px] font-black text-gray-400 uppercase">Aktivitas Transaksi Terbaru</h3>
                        <BaseButton size="sm" variant="secondary" link>Lihat Semua</BaseButton>
                    </div>
                    <div class="space-y-3">
                        <div v-for="t in recentTransactions" :key="t.id"
                            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 text-[10px] font-bold text-blue-600 font-mono">
                                    {{ t.waktu }}
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-gray-800">{{ t.pasien }}</p>
                                    <p class="text-[10px] text-gray-500">{{ t.unit }} • <span class="font-bold">{{
                                        t.metode }}</span></p>
                                </div>
                            </div>
                            <p class="text-sm font-black text-gray-900 font-mono">Rp {{ t.total.toLocaleString() }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 space-y-6">
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-blue-600">
                    <h3 class="text-[12px] font-bold text-gray-800 uppercase mb-4">Pendapatan Per Poli</h3>
                    <div class="space-y-4">
                        <div v-for="p in [
                            { label: 'Poli Umum', percent: 65, color: 'bg-green-500' },
                            { label: 'Poli Gigi', percent: 20, color: 'bg-blue-500' },
                            { label: 'Laboratorium', percent: 10, color: 'bg-purple-500' },
                            { label: 'Lainnya', percent: 5, color: 'bg-gray-400' }
                        ]" :key="p.label">
                            <div class="flex justify-between text-[11px] font-bold mb-1 uppercase">
                                <span class="text-gray-600">{{ p.label }}</span>
                                <span class="text-gray-900">{{ p.percent }}%</span>
                            </div>
                            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div :class="['h-full rounded-full', p.color]" :style="{ width: p.percent + '%' }">
                                </div>
                            </div>
                        </div>
                    </div>
                    <BaseButton variant="secondary" class="w-full mt-6" :icon="ChevronRightIcon">Analisis Detail
                    </BaseButton>
                </div>

                <div class="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                    <h4 class="text-[11px] font-black text-yellow-700 uppercase mb-2 flex items-center gap-2">
                        <Squares2X2Icon class="w-4 h-4" /> Notifikasi Keuangan
                    </h4>
                    <p class="text-[10px] text-yellow-800 leading-relaxed">
                        Terdapat <span class="font-bold text-red-600">2 Kasir</span> yang belum melakukan tutup shift
                        hari ini. Harap verifikasi setoran fisik sebelum pukul 21:00.
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>