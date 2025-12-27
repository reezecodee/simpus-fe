<script setup lang="ts">
import { ref } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseAlert from '@/components/common/BaseAlert.vue' // <--- Import BaseAlert

// --- ICONS ---
import {
    ArrowPathIcon,
    ClipboardDocumentListIcon,
    BeakerIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    UserGroupIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

// Statistik Utama
const stats = ref([
    { title: 'Antrian Resep Baru', value: 12, label: 'Menunggu Konfirmasi', icon: ClipboardDocumentListIcon, color: 'text-red-600', border: 'border-t-red-500', bgIcon: 'bg-red-50' },
    { title: 'Sedang Diracik', value: 5, label: 'Proses Penyiapan', icon: BeakerIcon, color: 'text-blue-600', border: 'border-t-blue-500', bgIcon: 'bg-blue-50' },
    { title: 'Siap Diserahkan', value: 8, label: 'Menunggu Pasien', icon: CheckBadgeIcon, color: 'text-green-600', border: 'border-t-green-500', bgIcon: 'bg-green-50' },
    { title: 'Total Selesai', value: 145, label: 'Resep Hari Ini', icon: ClockIcon, color: 'text-gray-600', border: 'border-t-gray-500', bgIcon: 'bg-gray-50' },
])

// Alert CITO (Darurat)
const citoCount = ref(2)

// Stok Menipis di Depo
const lowStockItems = ref([
    { id: 1, nama: 'PARACETAMOL 500MG', sisa: 5, satuan: 'STRIP' },
    { id: 2, nama: 'AMOXICILLIN SYRUP', sisa: 2, satuan: 'BOTOL' },
    { id: 3, nama: 'VITAMIN C 500MG', sisa: 15, satuan: 'STRIP' },
])

// Antrian Terakhir
const recentQueue = ref([
    { id: 'RX-001', pasien: 'Tn. Budi Santoso', poli: 'PENYAKIT DALAM', status: 'MENUNGGU', waktu: '08:30' },
    { id: 'RX-002', pasien: 'Ny. Siti Aminah', poli: 'IGD (CITO)', status: 'DIRACIK', waktu: '08:35' },
    { id: 'RX-003', pasien: 'An. Dede', poli: 'ANAK', status: 'SIAP', waktu: '08:15' },
    { id: 'RX-004', pasien: 'Tn. Joko', poli: 'GIGI', status: 'MENUNGGU', waktu: '08:45' },
    { id: 'RX-005', pasien: 'Ny. Rina', poli: 'UMUM', status: 'SELESAI', waktu: '08:00' },
])

const columns: TableColumn[] = [
    { key: 'id', label: 'No. Resep', width: '100px' },
    { key: 'pasien', label: 'Nama Pasien' },
    { key: 'poli', label: 'Asal Poli' },
    { key: 'waktu', label: 'Jam Masuk', align: 'center', width: '100px' },
    { key: 'status', label: 'Status', align: 'center', width: '120px' },
]

const handleRefresh = () => {
    alert('Refresh Data...')
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Dashboard Farmasi</h1>
                <p class="text-[12px] text-gray-500 flex items-center gap-2">
                    Pantau antrian resep dan ketersediaan obat depo.
                </p>
            </div>
            <div class="flex gap-2">
                <BaseButton :icon="ArrowPathIcon" variant="secondary" @click="handleRefresh">Refresh</BaseButton>
                <BaseButton :icon="ClipboardDocumentListIcon" @click="$router.push('/farmasi/antrian-resep')">Buka
                    Antrian</BaseButton>
            </div>
        </div>

        <BaseAlert v-if="citoCount > 0" variant="danger" title="PERHATIAN: ADA RESEP CITO!" class="animate-pulse">
            Mohon segera diproses demi keselamatan pasien.

            <template #action>
                <BaseButton size="sm" class="bg-red-600 text-white hover:bg-red-700 border-none">
                    Proses Sekarang
                </BaseButton>
            </template>
        </BaseAlert>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div v-for="(stat, idx) in stats" :key="idx"
                class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px]"
                :class="stat.border">
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ stat.title }}</p>
                    <p class="text-2xl font-black mt-1" :class="stat.color">{{ stat.value }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">{{ stat.label }}</p>
                </div>
                <div class="p-2 rounded-lg" :class="stat.bgIcon">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-2 space-y-4">
                <div
                    class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
                    <div class="flex justify-between items-center mb-4 px-2">
                        <h3
                            class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <UserGroupIcon class="w-4 h-4" /> Live Feed Antrian
                        </h3>
                        <span class="text-[10px] font-bold text-gray-400">5 Teratas</span>
                    </div>

                    <BaseDataTable :columns="columns" :data="recentQueue" hide-search>
                        <template #id="{ value }">
                            <span class="font-mono text-[11px] font-bold text-blue-600">{{ value }}</span>
                        </template>
                        <template #pasien="{ value }">
                            <span class="text-[11px] font-bold text-gray-800 uppercase">{{ value }}</span>
                        </template>
                        <template #poli="{ value }">
                            <div class="flex items-center gap-1">
                                <span class="text-[10px] text-gray-500 uppercase">{{ value }}</span>
                                <span v-if="value.includes('CITO')"
                                    class="px-1 py-0.5 bg-red-600 text-white text-[8px] rounded font-bold">!</span>
                            </div>
                        </template>
                        <template #waktu="{ value }">
                            <span class="font-mono text-[11px] text-gray-500">{{ value }}</span>
                        </template>
                        <template #status="{ value }">
                            <span v-if="value === 'MENUNGGU'"
                                class="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 uppercase">WAITING</span>
                            <span v-else-if="value === 'DIRACIK'"
                                class="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 uppercase">PROCESS</span>
                            <span v-else-if="value === 'SIAP'"
                                class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">READY</span>
                            <span v-else
                                class="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 uppercase">DONE</span>
                        </template>
                    </BaseDataTable>
                </div>
            </div>

            <div class="space-y-4">
                <div
                    class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-t-[4px] border-t-orange-500">
                    <div class="flex justify-between items-center mb-4">
                        <h3
                            class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <ExclamationTriangleIcon class="w-4 h-4 text-orange-500" /> Stok Menipis (Depo)
                        </h3>
                    </div>

                    <div class="space-y-3">
                        <div v-for="item in lowStockItems" :key="item.id"
                            class="bg-orange-50 p-3 rounded border border-orange-100 flex justify-between items-center">
                            <div>
                                <p class="text-[11px] font-bold text-gray-700">{{ item.nama }}</p>
                                <p class="text-[9px] text-gray-500">Satuan: {{ item.satuan }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-[12px] font-black text-red-600">{{ item.sisa }}</p>
                                <p class="text-[8px] text-red-400 font-bold uppercase">Sisa</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <BaseButton variant="secondary" size="sm" class="w-full text-xs"
                            @click="$router.push('/farmasi/permintaan-stok')">
                            Buat Permintaan ke Gudang
                        </BaseButton>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>