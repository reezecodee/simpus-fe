<script setup lang="ts">
import { ref } from 'vue'

// --- COMPONENTS ---
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

// --- ICONS ---
import {
    MagnifyingGlassIcon,
    PrinterIcon,
    ArrowPathIcon,
    BanknotesIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA TRANSAKSI CICILAN
// ==========================================
interface Cicilan {
    id: number
    tgl_bayar: string
    pasien: string
    nominal_bayar: number
    metode: string
    sisa_setelah_bayar: number
    penerima: string // Nama Admin/Kasir yang terima uang
}

const columns: TableColumn[] = [
    { key: 'tgl_bayar', label: 'Waktu Bayar', width: '150px' },
    { key: 'pasien', label: 'Nama Pasien' },
    { key: 'nominal_bayar', label: 'Nominal Masuk', align: 'right' },
    { key: 'metode', label: 'Via', align: 'center' },
    { key: 'sisa_setelah_bayar', label: 'Sisa Piutang', align: 'right' },
    { key: 'penerima', label: 'Penerima' },
    { key: 'actions', label: '', align: 'right' },
]

const historyData = ref<Cicilan[]>([
    { id: 501, tgl_bayar: '24/12/2025 14:20', pasien: 'BUDI RAHARJO', nominal_bayar: 150000, metode: 'TUNAI', sisa_setelah_bayar: 50000, penerima: 'ADMIN_01' },
    { id: 502, tgl_bayar: '24/12/2025 09:15', pasien: 'SITI AMINAH', nominal_bayar: 500000, metode: 'TRANSFER', sisa_setelah_bayar: 750000, penerima: 'ADMIN_02' },
])

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Riwayat Cicilan Piutang</h1>
                <p class="text-[12px] text-gray-500">Log Pembayaran Cicilan & Pelunasan Piutang
                    Pasien.</p>
            </div>
            <BaseButton :icon="ArrowPathIcon" variant="secondary">Refresh Data</BaseButton>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-6 px-2">
                <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-green-50 rounded text-green-600">
                        <BanknotesIcon class="w-5 h-5" />
                    </div>
                    <h3 class="text-[11px] font-black text-gray-600 uppercase tracking-wider">Transaksi Cicilan Masuk
                    </h3>
                </div>
                <div class="w-72">
                    <BaseInput :icon="MagnifyingGlassIcon" placeholder="Cari Pasien / Penerima..." size="sm" />
                </div>
            </div>

            <BaseDataTable :columns="columns" :data="historyData" hide-search>
                <template #tgl_bayar="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-600">{{ value }}</span>
                </template>

                <template #pasien="{ value }">
                    <span class="text-[12px] font-bold text-gray-800 uppercase tracking-tight">{{ value }}</span>
                </template>

                <template #nominal_bayar="{ value }">
                    <span class="font-mono text-[13px] text-green-700 font-black">+ {{ formatCurrency(value) }}</span>
                </template>

                <template #metode="{ value }">
                    <span
                        class="text-[10px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                        {{ value }}
                    </span>
                </template>

                <template #sisa_setelah_bayar="{ value }">
                    <span class="font-mono text-[12px] text-red-500 font-bold">{{ formatCurrency(value) }}</span>
                </template>

                <template #penerima="{ value }">
                    <span class="text-[11px] font-bold text-gray-500">{{ value }}</span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <button
                            class="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-green-600 transition shadow-sm border border-gray-100">
                            <PrinterIcon class="w-4 h-4" />
                        </button>
                    </div>
                </template>
            </BaseDataTable>
        </div>

        <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
            <div class="flex items-center gap-3">
                <div class="bg-white p-2 rounded shadow-sm border border-gray-200">
                    <p class="text-[9px] font-black text-gray-400 uppercase">Total Cicilan (Hari Ini)</p>
                    <p class="text-sm font-black text-green-700 font-mono tracking-tighter">{{ formatCurrency(650000) }}
                    </p>
                </div>
                <div class="bg-white p-2 rounded shadow-sm border border-gray-200">
                    <p class="text-[9px] font-black text-gray-400 uppercase">Frequensi Pembayaran</p>
                    <p class="text-sm font-black text-gray-900 font-mono tracking-tighter">2 Transaksi</p>
                </div>
            </div>
            <div class="flex items-center justify-end">
                <p class="text-[10px] text-gray-400 text-right uppercase leading-tight font-medium">
                    Setiap transaksi pelunasan piutang <br />otomatis memperbarui saldo piutang di buku besar.
                </p>
            </div>
        </div>

    </div>
</template>