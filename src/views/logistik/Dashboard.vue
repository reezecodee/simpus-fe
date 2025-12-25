<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue' // GANTI INI
import BaseInput from '@/components/common/BaseInput.vue'   // Tambahan

// --- ICONS ---
import {
    CubeIcon,
    ExclamationTriangleIcon,
    CurrencyDollarIcon,
    TruckIcon,
    ArrowRightIcon,
    ClipboardDocumentCheckIcon,
    ArrowTrendingDownIcon, // Tambahan untuk Modal
    ArrowTrendingUpIcon,   // Tambahan untuk Modal
    CheckCircleIcon        // Tambahan untuk Modal
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA SUMMARY (DUMMY)
// ==========================================
const totalAset = 245000000
const totalSku = 1450
const lowStockCount = 12
const nearEdCount = 5

// ==========================================
// 2. WIDGET DATA
// ==========================================
const columnsLowStock: TableColumn[] = [
    { key: 'nama_obat', label: 'Nama Item / Obat' },
    { key: 'stok', label: 'Sisa', align: 'center', width: '80px' },
    { key: 'min_stok', label: 'Min', align: 'center', width: '80px' },
    { key: 'suplier', label: 'Suplier Utama' },
]

const lowStockData = ref([
    { id: 1, nama_obat: 'AMOXICILLIN 500MG', stok: 50, min_stok: 100, suplier: 'PT. KIMIA FARMA' },
    { id: 2, nama_obat: 'PARACETAMOL SYRUP', stok: 12, min_stok: 50, suplier: 'PT. TEMPO SCAN' },
    { id: 3, nama_obat: 'ALKOHOL 70% 1L', stok: 5, min_stok: 20, suplier: 'PT. BRATACO' },
])

const columnsInbound: TableColumn[] = [
    { key: 'tgl', label: 'Tanggal', width: '100px' },
    { key: 'no_faktur', label: 'No. Faktur' },
    { key: 'suplier', label: 'Suplier' },
    { key: 'total', label: 'Nilai', align: 'right' },
]

const inboundData = ref([
    { id: 101, tgl: '25/12', no_faktur: 'INV-KF-2512', suplier: 'PT. KIMIA FARMA', total: 15000000 },
    { id: 102, tgl: '24/12', no_faktur: 'INV-APL-9981', suplier: 'PT. ANUGRAH PHARMINDO', total: 8250000 },
])

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

// ==========================================
// 3. LOGIC STOCK OPNAME (MODAL)
// ==========================================
const showOpnameModal = ref(false)

// Dummy Data Obat untuk Dropdown Opname
const obatOptions = [
    { value: 1, label: 'AMOXICILLIN 500MG (STRIP)', current_qty: 100 },
    { value: 2, label: 'PARACETAMOL SYRUP (BOTOL)', current_qty: 12 },
    { value: 3, label: 'ALKOHOL 70% 1L (JERIGEN)', current_qty: 5 },
    { value: 4, label: 'VITAMIN C 50MG (BOTOL)', current_qty: 500 },
]

const formOpname = reactive({
    // UBAH DARI null JADI undefined
    obat_id: undefined as number | undefined,
    stok_sistem: 0,
    stok_fisik: 0,
    keterangan: ''
})

// Auto fill stok sistem saat obat dipilih
watch(() => formOpname.obat_id, (newVal) => {
    // Pastikan newVal ada isinya
    if (newVal === undefined) {
        formOpname.stok_sistem = 0
        formOpname.stok_fisik = 0
        return
    }

    const selected = obatOptions.find(o => o.value === newVal)
    if (selected) {
        formOpname.stok_sistem = selected.current_qty
        formOpname.stok_fisik = selected.current_qty
    }
})

const selisih = computed(() => formOpname.stok_fisik - formOpname.stok_sistem)

const handleSaveOpname = () => {
    // Cek undefined
    if (formOpname.obat_id === undefined) return

    alert(`Stock Opname Disimpan.\nItem ID: ${formOpname.obat_id}\nSelisih: ${selisih.value}`)

    showOpnameModal.value = false
    formOpname.obat_id = undefined // Reset ke undefined
    formOpname.keterangan = ''
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Dashboard Logistik</h1>
                <p class="text-[12px] text-gray-500">Overview Aset & Kesehatan Stok Farmasi.</p>
            </div>
            <BaseButton :icon="ClipboardDocumentCheckIcon" @click="showOpnameModal = true">Stock Opname</BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-blue-600">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-black text-blue-400 uppercase tracking-wider">Total Nilai Aset</p>
                    <CurrencyDollarIcon class="w-5 h-5 text-blue-600" />
                </div>
                <p class="text-xl font-black text-gray-900 font-mono tracking-tighter">{{ formatCurrency(totalAset) }}
                </p>
                <p class="text-[10px] text-gray-400 mt-1">Valuasi berdasarkan Harga Beli (HPP)</p>
            </div>

            <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-gray-600">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Item (SKU)</p>
                    <CubeIcon class="w-5 h-5 text-gray-600" />
                </div>
                <p class="text-2xl font-black text-gray-900 font-mono tracking-tighter">{{ totalSku }} <span
                        class="text-sm font-bold text-gray-400">Item</span></p>
            </div>

            <div
                class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-orange-500 bg-orange-50/20">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-black text-orange-600 uppercase tracking-wider">Stok Menipis</p>
                    <ExclamationTriangleIcon class="w-5 h-5 text-orange-500" />
                </div>
                <p class="text-2xl font-black text-orange-600 font-mono tracking-tighter">{{ lowStockCount }} <span
                        class="text-sm font-bold text-orange-400">Item</span></p>
                <p class="text-[10px] text-orange-400 mt-1 font-bold uppercase">Segera lakukan order ulang</p>
            </div>

            <div
                class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-red-600 bg-red-50/20">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-black text-red-600 uppercase tracking-wider">Near Expired (3 Bln)</p>
                    <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
                </div>
                <p class="text-2xl font-black text-red-600 font-mono tracking-tighter">{{ nearEdCount }} <span
                        class="text-sm font-bold text-red-400">Batch</span></p>
                <p class="text-[10px] text-red-400 mt-1 font-bold uppercase">Prioritaskan penjualan / Retur</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
                class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-orange-500">
                <div class="flex justify-between items-center mb-4 px-1">
                    <h3 class="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                        <ExclamationTriangleIcon class="w-4 h-4 text-orange-500" /> Perlu Restock
                    </h3>
                    <button class="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        LIHAT SEMUA
                        <ArrowRightIcon class="w-3 h-3" />
                    </button>
                </div>
                <BaseDataTable :columns="columnsLowStock" :data="lowStockData" hide-search>
                    <template #nama_obat="{ value }">
                        <span class="text-[11px] font-bold text-gray-800 uppercase">{{ value }}</span>
                    </template>
                    <template #stok="{ value }">
                        <span class="text-[11px] font-black text-red-600 font-mono">{{ value }}</span>
                    </template>
                    <template #min_stok="{ value }">
                        <span class="text-[11px] font-bold text-gray-400 font-mono">{{ value }}</span>
                    </template>
                    <template #suplier="{ value }">
                        <span class="text-[10px] font-bold text-gray-500 uppercase">{{ value }}</span>
                    </template>
                </BaseDataTable>
            </div>

            <div
                class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-blue-600">
                <div class="flex justify-between items-center mb-4 px-1">
                    <h3 class="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                        <TruckIcon class="w-4 h-4 text-blue-600" /> Penerimaan Terakhir
                    </h3>
                    <button class="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        LIHAT LOG
                        <ArrowRightIcon class="w-3 h-3" />
                    </button>
                </div>
                <BaseDataTable :columns="columnsInbound" :data="inboundData" hide-search>
                    <template #tgl="{ value }">
                        <span class="text-[11px] font-bold text-gray-500 font-mono">{{ value }}</span>
                    </template>
                    <template #no_faktur="{ value }">
                        <span class="text-[11px] font-bold text-blue-600 uppercase">{{ value }}</span>
                    </template>
                    <template #suplier="{ value }">
                        <span class="text-[10px] font-bold text-gray-700 uppercase">{{ value }}</span>
                    </template>
                    <template #total="{ value }">
                        <span class="text-[11px] font-black text-gray-900 font-mono">{{ formatCurrency(value) }}</span>
                    </template>
                </BaseDataTable>
            </div>
        </div>

        <BaseModal v-model="showOpnameModal" title="INPUT STOCK OPNAME" width="max-w-lg">
            <div class="space-y-6">

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <BaseSelectSearch label="Pilih Item / Obat" v-model="formOpname.obat_id" :options="obatOptions"
                        placeholder="Ketik nama obat untuk mencari..." />
                </div>

                <div class="grid grid-cols-3 gap-4 text-center">

                    <div class="p-3 rounded border border-gray-200 bg-gray-100 opacity-70">
                        <p class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Di Sistem</p>
                        <p class="text-2xl font-black text-gray-700 font-mono">{{ formOpname.stok_sistem }}</p>
                    </div>

                    <div class="p-3 rounded border-2 border-blue-500 bg-white relative">
                        <p class="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Fisik (Nyata)</p>
                        <input type="number" v-model="formOpname.stok_fisik"
                            class="w-full text-center text-2xl font-black text-blue-700 font-mono focus:outline-none bg-transparent" />
                    </div>

                    <div :class="[
                        'p-3 rounded border-2 bg-opacity-10 transition-colors duration-300',
                        selisih < 0 ? 'border-red-500 bg-red-50' :
                            selisih > 0 ? 'border-green-500 bg-green-50' :
                                'border-gray-200 bg-gray-50'
                    ]">
                        <p :class="[
                            'text-[9px] font-black uppercase tracking-widest mb-1',
                            selisih < 0 ? 'text-red-600' : selisih > 0 ? 'text-green-600' : 'text-gray-400'
                        ]">
                            Selisih
                        </p>
                        <div class="flex items-center justify-center gap-1">
                            <ArrowTrendingDownIcon v-if="selisih < 0" class="w-4 h-4 text-red-600" />
                            <ArrowTrendingUpIcon v-if="selisih > 0" class="w-4 h-4 text-green-600" />
                            <CheckCircleIcon v-if="selisih === 0" class="w-4 h-4 text-gray-400" />
                            <p :class="[
                                'text-2xl font-black font-mono',
                                selisih < 0 ? 'text-red-600' : selisih > 0 ? 'text-green-600' : 'text-gray-400'
                            ]">
                                {{ selisih > 0 ? '+' : '' }}{{ selisih }}
                            </p>
                        </div>
                    </div>
                </div>

                <BaseInput label="Alasan / Keterangan Penyesuaian" v-model="formOpname.keterangan"
                    placeholder="Contoh: Barang rusak saat pengiriman" />

                <div
                    class="text-[10px] text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200 flex gap-2 items-start">
                    <ClipboardDocumentCheckIcon class="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <p>
                        <span class="font-bold text-yellow-700 uppercase">Perhatian:</span>
                        Stok di database akan langsung berubah sesuai 'Stok Fisik' yang diinput.
                    </p>
                </div>

            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showOpnameModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" @click="handleSaveOpname"
                        :disabled="!formOpname.obat_id || !formOpname.keterangan">
                        Simpan Penyesuaian
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>