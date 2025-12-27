<script setup lang="ts">
import { ref, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue' // Pakai ini biar dropdown-nya ganteng
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'

// --- ICONS ---
import {
    MagnifyingGlassIcon,
    PrinterIcon,
    DocumentArrowDownIcon,
    ReceiptPercentIcon,
    ClipboardDocumentCheckIcon,
    EyeIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. TYPE DEFINITIONS
// ==========================================

interface TransactionItem {
    nama: string
    qty: number
    satuan: string
    harga: number
    total: number
}

interface TransactionHistory {
    id: string
    tgl: string
    jam: string
    tipe: 'RESEP' | 'OTC'
    pasien: string
    rm: string
    dokter: string
    pic: string
    total_bayar: number
    items: TransactionItem[]
}

// ==========================================
// 2. DATA STATE
// ==========================================

const filterDateStart = ref(new Date().toISOString().split('T')[0])
const filterDateEnd = ref(new Date().toISOString().split('T')[0])
const filterType = ref('ALL') // Default ALL
const searchQuery = ref('')

// Opsi Dropdown Tipe (Supaya pakai BaseSelectSearch)
const typeOptions = [
    { value: 'ALL', label: 'SEMUA TRANSAKSI' },
    { value: 'RESEP', label: 'RESEP DOKTER (RX)' },
    { value: 'OTC', label: 'JUAL BEBAS (POS)' }
]

const historyData = ref<TransactionHistory[]>([
    {
        id: 'TRX-2512-001',
        tgl: '2025-12-27',
        jam: '08:30',
        tipe: 'RESEP',
        pasien: 'Tn. Budi Santoso',
        rm: 'RM-00123',
        dokter: 'dr. Asep Sp.PD',
        pic: 'Apt. Rina',
        total_bayar: 45000,
        items: [
            { nama: 'Amlodipine 10mg', qty: 30, satuan: 'TAB', harga: 500, total: 15000 },
            { nama: 'Simvastatin 20mg', qty: 30, satuan: 'TAB', harga: 1000, total: 30000 }
        ]
    },
    {
        id: 'POS-2512-099',
        tgl: '2025-12-27',
        jam: '09:15',
        tipe: 'OTC',
        pasien: 'UMUM (NON-MEDIS)',
        rm: '-',
        dokter: '-',
        pic: 'Admin Farmasi',
        total_bayar: 22500,
        items: [
            { nama: 'Panadol Extra', qty: 1, satuan: 'STRIP', harga: 14500, total: 14500 },
            { nama: 'Vitamin C IPI', qty: 1, satuan: 'BOTOL', harga: 8000, total: 8000 }
        ]
    },
    {
        id: 'TRX-2512-003',
        tgl: '2025-12-26',
        jam: '14:00',
        tipe: 'RESEP',
        pasien: 'An. Dede',
        rm: 'RM-00145',
        dokter: 'dr. Rina Sp.A',
        pic: 'Apt. Budi',
        total_bayar: 15000,
        items: [
            { nama: 'Paracetamol Syrup', qty: 1, satuan: 'BOTOL', harga: 15000, total: 15000 }
        ]
    }
])

const columns: TableColumn[] = [
    { key: 'id', label: 'No. Transaksi', width: '140px' },
    { key: 'tgl', label: 'Waktu', width: '140px' },
    { key: 'tipe', label: 'Tipe', align: 'center', width: '100px' },
    { key: 'pasien', label: 'Pasien / Pelanggan' },
    { key: 'total_bayar', label: 'Total Omzet', align: 'right', width: '120px' },
    { key: 'pic', label: 'Kasir/Apoteker', width: '120px' },
    { key: 'actions', label: '', align: 'right' },
]

const showDetailModal = ref(false)
const selectedTrx = ref<TransactionHistory | null>(null)

// ==========================================
// 3. LOGIC
// ==========================================

const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const filteredData = computed(() => {
    let data = historyData.value
    if (filterType.value !== 'ALL') {
        data = data.filter(d => d.tipe === filterType.value)
    }
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        data = data.filter(d =>
            d.id.toLowerCase().includes(q) ||
            d.pasien.toLowerCase().includes(q) ||
            d.pic.toLowerCase().includes(q)
        )
    }
    return data
})

const handleDetail = (row: TransactionHistory) => {
    selectedTrx.value = row
    showDetailModal.value = true
}

const handleExport = () => {
    alert('Mengunduh Laporan Excel Periode ' + filterDateStart.value + ' s/d ' + filterDateEnd.value)
}

const handlePrintCopy = () => {
    alert('Mencetak Salinan Resep / Struk...')
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Riwayat Transaksi Farmasi</h1>
                <p class="text-[12px] text-gray-500">Log penjualan obat bebas (OTC) dan pelayanan resep pasien.</p>
            </div>
            <div class="flex gap-2">
                <BaseButton variant="secondary" :icon="DocumentArrowDownIcon" @click="handleExport">Export Excel
                </BaseButton>
            </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <BaseInput type="date" label="Dari Tanggal" v-model="filterDateStart" />
            <BaseInput type="date" label="Sampai Tanggal" v-model="filterDateEnd" />

            <BaseSelectSearch label="Tipe Transaksi" v-model="filterType" :options="typeOptions" />

            <BaseInput label="Cari Data" v-model="searchQuery" placeholder="Cari No Transaksi / Pasien..."
                :icon="MagnifyingGlassIcon" />
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">

            <BaseDataTable :columns="columns" :data="filteredData" hide-search>

                <template #id="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-700">{{ value }}</span>
                </template>

                <template #tgl="{ row }">
                    <div class="text-[11px] text-gray-600">
                        <p class="font-bold">{{ row.tgl }}</p>
                        <p class="text-[10px] text-gray-400">{{ row.jam }} WIB</p>
                    </div>
                </template>

                <template #tipe="{ value }">
                    <span v-if="value === 'RESEP'"
                        class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                        <ClipboardDocumentCheckIcon class="w-3 h-3" /> RESEP
                    </span>
                    <span v-else
                        class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-green-100 text-green-700 border border-green-200">
                        <ReceiptPercentIcon class="w-3 h-3" /> OTC
                    </span>
                </template>

                <template #pasien="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.pasien }}</p>
                        <p v-if="row.tipe === 'RESEP'" class="text-[9px] text-gray-500">
                            Dokter: {{ row.dokter }}
                        </p>
                    </div>
                </template>

                <template #total_bayar="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-900">{{ formatRp(value) }}</span>
                </template>

                <template #actions="{ row }">
                    <div class="text-right pr-2">
                        <button @click="handleDetail(row)"
                            class="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 ml-auto text-[10px] font-bold uppercase">
                            <EyeIcon class="w-4 h-4" /> Detail
                        </button>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showDetailModal" title="DETAIL TRANSAKSI" width="max-w-2xl">
            <div v-if="selectedTrx" class="space-y-4">

                <div class="bg-gray-50 p-4 rounded border border-gray-200 grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <p class="text-gray-500 uppercase font-bold text-[10px]">No. Transaksi</p>
                        <p class="font-mono font-bold text-sm text-gray-800">{{ selectedTrx?.id }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-500 uppercase font-bold text-[10px]">Waktu</p>
                        <p class="font-bold text-gray-800">{{ selectedTrx?.tgl }} <span class="text-gray-400">|</span>
                            {{
                            selectedTrx?.jam }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 uppercase font-bold text-[10px]">Pasien / Pelanggan</p>
                        <p class="font-bold text-gray-800 uppercase">{{ selectedTrx?.pasien }}</p>
                        <p class="text-[10px] text-gray-500">
                            {{ selectedTrx?.rm !== '-' ? selectedTrx?.rm : 'Pelanggan Umum' }}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-500 uppercase font-bold text-[10px]">Kasir / PIC</p>
                        <p class="font-bold text-gray-800">{{ selectedTrx?.pic }}</p>
                    </div>
                </div>

                <div class="border rounded overflow-hidden">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-gray-100 text-[10px] uppercase font-bold text-gray-500">
                            <tr>
                                <th class="p-2">Nama Barang / Obat</th>
                                <th class="p-2 text-center">Qty</th>
                                <th class="p-2 text-right">Harga Satuan</th>
                                <th class="p-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(item, idx) in selectedTrx?.items" :key="idx">
                                <td class="p-2 font-bold text-gray-700">{{ item.nama }}</td>
                                <td class="p-2 text-center font-mono">{{ item.qty }} {{ item.satuan }}</td>
                                <td class="p-2 text-right font-mono">{{ formatRp(item.harga) }}</td>
                                <td class="p-2 text-right font-mono font-bold">{{ formatRp(item.total) }}</td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gray-50 border-t border-gray-200">
                            <tr>
                                <td colspan="3" class="p-2 text-right font-bold text-gray-600 uppercase text-[10px]">
                                    Grand Total
                                </td>
                                <td class="p-2 text-right font-black text-sm text-gray-900">{{
                                    formatRp(selectedTrx?.total_bayar
                                    || 0) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>

            <template #footer>
                <div class="flex gap-2 w-full">
                    <BaseButton variant="secondary" class="flex-1" @click="showDetailModal = false">Tutup</BaseButton>
                    <BaseButton variant="primary" class="flex-1" :icon="PrinterIcon" @click="handlePrintCopy">
                        {{ selectedTrx?.tipe === 'RESEP' ? 'Cetak Salinan Resep' : 'Cetak Ulang Struk' }}
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>