<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'

// --- ICONS ---
import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    BanknotesIcon,
    CubeIcon,
    ExclamationCircleIcon,
    ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA MASTER
// ==========================================
interface StokItem {
    id: number
    sku: string
    nama: string
    kategori: string
    lokasi: string
    qty: number
    satuan: string
    hpp: number
    min_stok: number
}

// Dummy Data Stok
const rawData = ref<StokItem[]>([
    { id: 1, sku: 'MED-001', nama: 'AMOXICILLIN 500MG', kategori: 'OBAT KERAS', lokasi: 'A-01', qty: 150, satuan: 'STRIP', hpp: 4500, min_stok: 100 },
    { id: 2, sku: 'MED-002', nama: 'PARACETAMOL SYRUP', kategori: 'OBAT BEBAS', lokasi: 'B-05', qty: 20, satuan: 'BOTOL', hpp: 12000, min_stok: 50 }, // Warning
    { id: 3, sku: 'ALK-001', nama: 'ALKOHOL 70% 1L', kategori: 'ALKES', lokasi: 'G-01', qty: 0, satuan: 'JERIGEN', hpp: 45000, min_stok: 5 }, // Kosong
    { id: 4, sku: 'MED-003', nama: 'VITAMIN C 500MG', kategori: 'OBAT BEBAS', lokasi: 'C-02', qty: 1000, satuan: 'BOTOL', hpp: 5000, min_stok: 200 },
    { id: 5, sku: 'BHP-001', nama: 'MASKER MEDIS 3PLY', kategori: 'BHP', lokasi: 'D-01', qty: 45, satuan: 'BOX', hpp: 25000, min_stok: 50 }, // Warning
])

// Filter State
const filters = reactive({
    search: '',
    kategori: 'SEMUA',
    status: 'SEMUA'
})

// ==========================================
// 2. LOGIC & COMPUTED
// ==========================================

// Logic Penentuan Status
const getStatus = (item: StokItem) => {
    if (item.qty === 0) return 'KOSONG'
    if (item.qty <= item.min_stok) return 'MENIPIS'
    return 'AMAN'
}

// Logic Filter Data (Client Side)
const filteredData = computed(() => {
    return rawData.value.filter(item => {
        // 1. Filter Search (Nama/SKU)
        const matchSearch = item.nama.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.sku.toLowerCase().includes(filters.search.toLowerCase())

        // 2. Filter Kategori
        const matchKat = filters.kategori === 'SEMUA' || item.kategori === filters.kategori

        // 3. Filter Status Stok
        const currentStatus = getStatus(item)
        const matchStatus = filters.status === 'SEMUA' || currentStatus === filters.status

        return matchSearch && matchKat && matchStatus
    })
})

// Summary Statistik (Dari Data yang Difilter)
const summary = computed(() => {
    const data = filteredData.value
    return {
        total_aset: data.reduce((acc, curr) => acc + (curr.qty * curr.hpp), 0),
        total_qty: data.reduce((acc, curr) => acc + curr.qty, 0),
        total_alert: data.filter(i => i.qty <= i.min_stok).length
    }
})

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

// Columns Definition
const columns: TableColumn[] = [
    { key: 'sku', label: 'SKU / Lokasi', width: '120px' },
    { key: 'nama', label: 'Nama Item' },
    { key: 'kategori', label: 'Kategori', width: '120px' },
    { key: 'qty', label: 'Sisa Stok', align: 'center', width: '100px' },
    { key: 'nilai_aset', label: 'Valuasi (HPP)', align: 'right' },
    { key: 'status', label: 'Kondisi', align: 'center', width: '100px' },
    { key: 'actions', label: '', align: 'right' },
]

</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Monitor Stok & Aset</h1>
                <p class="text-[12px] text-gray-500">Laporan Posisi Stok Gudang Farmasi.</p>
            </div>
            <BaseButton variant="secondary" :icon="ArrowDownTrayIcon">Export
                Excel</BaseButton>
        </div>

        <div
            class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div class="col-span-2">
                <BaseInput v-model="filters.search" :icon="MagnifyingGlassIcon" placeholder="Cari Nama Barang / SKU..."
                    label="Pencarian" />
            </div>
            <div>
                <BaseSelect label="Filter Kategori" v-model="filters.kategori"
                    :options="['SEMUA', 'OBAT KERAS', 'OBAT BEBAS', 'ALKES', 'BHP']" />
            </div>
            <div>
                <BaseSelect label="Filter Kondisi" v-model="filters.status"
                    :options="['SEMUA', 'AMAN', 'MENIPIS', 'KOSONG']" />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-blue-600">
                <div>
                    <p class="text-[10px] font-black text-blue-500 uppercase tracking-wider">Total Nilai Aset</p>
                    <p class="text-xl font-black text-blue-700 font-mono tracking-tighter">{{
                        formatCurrency(summary.total_aset) }}</p>
                </div>
                <BanknotesIcon class="w-8 h-8 text-blue-100" />
            </div>

            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-gray-500">
                <div>
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Total Fisik Item</p>
                    <p class="text-xl font-black text-gray-700 font-mono">{{ summary.total_qty.toLocaleString('id-ID')
                    }} <span class="text-xs">Unit</span></p>
                </div>
                <CubeIcon class="w-8 h-8 text-gray-200" />
            </div>

            <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px]"
                :class="summary.total_alert > 0 ? 'border-t-red-500 bg-red-50' : 'border-t-green-500'">
                <div>
                    <p class="text-[10px] font-black uppercase tracking-wider"
                        :class="summary.total_alert > 0 ? 'text-red-500' : 'text-green-600'">Perlu Restock</p>
                    <p class="text-xl font-black font-mono"
                        :class="summary.total_alert > 0 ? 'text-red-600' : 'text-green-600'">{{ summary.total_alert }}
                        <span class="text-xs">SKU</span>
                    </p>
                </div>
                <ExclamationCircleIcon class="w-8 h-8"
                    :class="summary.total_alert > 0 ? 'text-red-200' : 'text-green-200'" />
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-4 px-2">
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <FunnelIcon class="w-4 h-4" /> Hasil Filter Data
                </h3>
                <span class="text-[10px] font-bold text-gray-400">Menampilkan {{ filteredData.length }} data</span>
            </div>

            <BaseDataTable :columns="columns" :data="filteredData" hide-search>

                <template #sku="{ row }">
                    <div class="flex flex-col">
                        <span class="font-mono text-[11px] font-bold text-gray-600">{{ row.sku }}</span>
                        <span class="text-[9px] font-black text-yellow-700 bg-yellow-100 px-1 rounded w-fit mt-0.5">RAK:
                            {{ row.lokasi }}</span>
                    </div>
                </template>

                <template #nama="{ value, row }">
                    <span class="text-[11px] font-bold text-gray-800 uppercase">{{ value }}</span>
                    <p class="text-[9px] text-gray-400">Min. Stok: {{ row.min_stok }} {{ row.satuan }}</p>
                </template>

                <template #kategori="{ value }">
                    <span class="text-[9px] font-bold uppercase border px-1 rounded text-gray-500 border-gray-200">{{
                        value }}</span>
                </template>

                <template #qty="{ value, row }">
                    <span :class="[
                        'font-mono text-[12px] font-black',
                        value === 0 ? 'text-red-600' :
                            value <= row.min_stok ? 'text-orange-500' : 'text-gray-900'
                    ]">
                        {{ value }}
                    </span>
                    <span class="text-[9px] text-gray-400 ml-1">{{ row.satuan }}</span>
                </template>

                <template #nilai_aset="{ row }">
                    <span class="font-mono text-[11px] font-medium text-gray-600">{{ formatCurrency(row.qty * row.hpp)
                        }}</span>
                </template>

                <template #status="{ row }">
                    <span v-if="getStatus(row) === 'AMAN'"
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">AMAN</span>
                    <span v-else-if="getStatus(row) === 'MENIPIS'"
                        class="text-[9px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200 uppercase">MENIPIS</span>
                    <span v-else
                        class="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 uppercase">KOSONG</span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <BaseActionMenu>
                            <button @click="$router.push('/admin/logistik/kartu-stok')"
                                class="w-full text-left px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 uppercase">
                                <ClipboardDocumentListIcon class="w-4 h-4 text-blue-500" /> Lihat Kartu Stok
                            </button>
                        </BaseActionMenu>
                    </div>
                </template>

            </BaseDataTable>
        </div>
    </div>
</template>