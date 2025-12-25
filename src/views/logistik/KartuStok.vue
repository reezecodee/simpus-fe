<script setup lang="ts">
import { ref, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'

// --- ICONS ---
import {
    PrinterIcon,
    ArrowPathIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    DocumentMagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA DUMMY
// ==========================================
// Pilihan Obat untuk Filter
const obatOptions = [
    { value: 1, label: 'AMOXICILLIN 500MG (STRIP)' },
    { value: 2, label: 'PARACETAMOL SYRUP (BOTOL)' },
]

// Data Mutasi (Log)
interface StockLog {
    id: number
    tanggal: string
    tipe: 'MASUK' | 'KELUAR' | 'ADJUSTMENT'
    ref_doc: string // No Faktur / No Resep
    keterangan: string
    qty_masuk: number
    qty_keluar: number
    saldo_akhir: number
    user: string
}

const columns: TableColumn[] = [
    { key: 'tanggal', label: 'Waktu', width: '120px' },
    { key: 'tipe', label: 'Tipe Transaksi', width: '120px' },
    { key: 'ref_doc', label: 'No. Dokumen / Ref' },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'mutasi', label: 'Mutasi', align: 'center', width: '100px' },
    { key: 'saldo_akhir', label: 'Saldo', align: 'center', width: '80px' },
    { key: 'user', label: 'Oleh', width: '100px' },
]

const logs = ref<StockLog[]>([
    { id: 1, tanggal: '2025-12-01 08:00', tipe: 'MASUK', ref_doc: 'INV/KF/2512001', keterangan: 'Pembelian dari Suplier', qty_masuk: 100, qty_keluar: 0, saldo_akhir: 100, user: 'Admin' },
    { id: 2, tanggal: '2025-12-02 10:30', tipe: 'KELUAR', ref_doc: 'RX-2025-001', keterangan: 'Resep Pasien Umum', qty_masuk: 0, qty_keluar: 10, saldo_akhir: 90, user: 'Kasir' },
    { id: 3, tanggal: '2025-12-05 09:00', tipe: 'ADJUSTMENT', ref_doc: 'OPNAME-12', keterangan: 'Barang rusak (pecah)', qty_masuk: 0, qty_keluar: 2, saldo_akhir: 88, user: 'Gudang' },
    { id: 4, tanggal: '2025-12-10 14:00', tipe: 'MASUK', ref_doc: 'RETUR-005', keterangan: 'Retur dari Pasien', qty_masuk: 5, qty_keluar: 0, saldo_akhir: 93, user: 'Kasir' },
])

const filters = reactive({
    obat_id: 1, // Default pilih satu obat
    date_start: '2025-12-01',
    date_end: '2025-12-31'
})

// ==========================================
// 2. LOGIC
// ==========================================
const handleRefresh = () => {
    alert(`Mengambil data kartu stok ID: ${filters.obat_id} periode ${filters.date_start} s/d ${filters.date_end}`)
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Kartu Stok (Log Mutasi)</h1>
                <p class="text-[12px] text-gray-500">Rekam jejak pergerakan barang per item.</p>
            </div>
            <BaseButton variant="secondary" :icon="PrinterIcon">Cetak Kartu</BaseButton>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div class="flex items-end gap-4">
                <div class="flex-1">
                    <BaseSelectSearch label="Pilih Item / Obat" v-model="filters.obat_id" :options="obatOptions"
                        placeholder="Cari nama obat..." />
                </div>
                <div class="w-40">
                    <BaseInput type="date" label="Dari Tanggal" v-model="filters.date_start" />
                </div>
                <div class="w-40">
                    <BaseInput type="date" label="Sampai Tanggal" v-model="filters.date_end" />
                </div>
                <BaseButton :icon="ArrowPathIcon" @click="handleRefresh" class="mb-[2px]">Tampilkan</BaseButton>
            </div>

            <div v-if="filters.obat_id" class="flex gap-6 pt-2 border-t border-gray-100">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <DocumentMagnifyingGlassIcon class="w-5 h-5 text-blue-500" />
                    <span class="font-bold">Saldo Awal: 0</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <ArrowTrendingUpIcon class="w-5 h-5 text-green-500" />
                    <span class="font-bold">Total Masuk: 105</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <ArrowTrendingDownIcon class="w-5 h-5 text-red-500" />
                    <span class="font-bold">Total Keluar: 12</span>
                </div>
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <BaseDataTable :columns="columns" :data="logs" hide-search>

                <template #tanggal="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-500">{{ value }}</span>
                </template>

                <template #tipe="{ value }">
                    <span v-if="value === 'MASUK'"
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">INBOUND</span>
                    <span v-else-if="value === 'KELUAR'"
                        class="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 uppercase">OUTBOUND</span>
                    <span v-else
                        class="text-[9px] font-black bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 uppercase">ADJUST</span>
                </template>

                <template #ref_doc="{ value }">
                    <span
                        class="font-mono text-[11px] font-bold text-blue-600 uppercase cursor-pointer hover:underline">{{
                        value }}</span>
                </template>

                <template #keterangan="{ value }">
                    <span class="text-[11px] text-gray-600">{{ value }}</span>
                </template>

                <template #mutasi="{ row }">
                    <div class="flex items-center justify-center font-mono text-[11px] font-black">
                        <span v-if="row.qty_masuk > 0" class="text-green-600">+{{ row.qty_masuk }}</span>
                        <span v-else-if="row.qty_keluar > 0" class="text-red-600">-{{ row.qty_keluar }}</span>
                        <span v-else class="text-gray-400">-</span>
                    </div>
                </template>

                <template #saldo_akhir="{ value }">
                    <span
                        class="font-mono text-[11px] font-black text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{{
                        value }}</span>
                </template>

                <template #user="{ value }">
                    <span class="text-[10px] text-gray-400 italic">{{ value }}</span>
                </template>

            </BaseDataTable>
        </div>

    </div>
</template>