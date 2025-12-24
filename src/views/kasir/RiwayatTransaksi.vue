<script setup lang="ts">
import { ref } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'

// --- ICONS ---
import {
    PrinterIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    ReceiptPercentIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA & STATE
// ==========================================
const filterTanggal = ref('2025-12-24')
const filterMetode = ref('SEMUA')

const columns: TableColumn[] = [
    { key: 'no_kwitansi', label: 'No. Kwitansi', width: '150px' },
    { key: 'tgl_bayar', label: 'Waktu Transaksi' },
    { key: 'nama_pasien', label: 'Nama Pasien' },
    { key: 'metode', label: 'Metode', align: 'center' },
    { key: 'total', label: 'Total Bayar', align: 'right' },
    { key: 'kasir', label: 'Petugas' },
    { key: 'actions', label: '', align: 'right' },
]

const historyData = ref([
    {
        id: 1,
        no_kwitansi: 'KW/251224/0001',
        tgl_bayar: '24/12/2025 09:15',
        nama_pasien: 'BUDI SANTOSO',
        metode: 'TUNAI',
        total: 65000,
        kasir: 'Atyla Azfa'
    },
    {
        id: 2,
        no_kwitansi: 'KW/251224/0002',
        tgl_bayar: '24/12/2025 10:20',
        nama_pasien: 'SITI AMINAH',
        metode: 'VA',
        total: 125000,
        kasir: 'Atyla Azfa'
    },
    {
        id: 3,
        no_kwitansi: 'KW/251224/0003',
        tgl_bayar: '24/12/2025 11:05',
        nama_pasien: 'DEDI KURNIA',
        metode: 'ASURANSI',
        total: 45000,
        kasir: 'Atyla Azfa'
    },
])

const handlePrintAgain = (id: number) => {
    alert(`Mencetak ulang kwitansi ID: ${id}`)
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Riwayat Transaksi Kasir</h1>
                <p class="text-[12px] text-gray-500">Log aktivitas pembayaran untuk kebutuhan audit dan cetak ulang.</p>
            </div>
            <BaseButton variant="secondary" :icon="ArrowDownTrayIcon">Export ke Excel</BaseButton>
        </div>

        <div
            class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <BaseInput label="Pencarian" placeholder="Nama / No. Kwitansi..." :icon="MagnifyingGlassIcon" />
            <BaseInput label="Tanggal" type="date" v-model="filterTanggal" />
            <BaseSelect label="Metode Bayar" v-model="filterMetode"
                :options="['SEMUA', 'TUNAI', 'QRIS', 'VA', 'ASURANSI']" />
            <BaseButton :icon="FunnelIcon" class="w-full">Proses Filter</BaseButton>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="px-2 mb-4">
                <h3 class="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Data Kwitansi Terbit</h3>
            </div>

            <BaseDataTable :columns="columns" :data="historyData" hide-search>

                <template #no_kwitansi="{ value }">
                    <span class="font-mono text-[11px] font-bold text-blue-600">{{ value }}</span>
                </template>

                <template #metode="{ value }">
                    <span
                        :class="['text-[10px] font-bold px-2 py-0.5 rounded border uppercase',
                            value === 'TUNAI' ? 'bg-green-50 text-green-600 border-green-100' :
                                value === 'ASURANSI' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100']">
                        {{ value }}
                    </span>
                </template>

                <template #total="{ value }">
                    <span class="font-mono font-bold text-gray-900 tracking-tight">Rp {{ value.toLocaleString('id-ID')
                        }}</span>
                </template>

                <template #kasir="{ value }">
                    <span class="text-[11px] font-medium text-gray-600 uppercase">{{ value }}</span>
                </template>

                <template #actions="{ row }">
                    <div class="flex gap-2 justify-end">
                        <BaseButton size="sm" variant="secondary" :icon="EyeIcon" />
                        <BaseButton size="sm" variant="primary" :icon="PrinterIcon" @click="handlePrintAgain(row.id)" />
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <div class="bg-green-50 border border-green-100 p-4 rounded-lg flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-green-600 rounded-lg text-white">
                    <ReceiptPercentIcon class="w-5 h-5" />
                </div>
                <div>
                    <p class="text-[12px] text-green-800 font-bold uppercase tracking-tight">Total Rekapitulasi</p>
                    <p class="text-[11px] text-green-700">3 Transaksi ditemukan pada periode ini.</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-xl font-black text-green-700 font-mono">Rp 235.000</p>
            </div>
        </div>

    </div>
</template>