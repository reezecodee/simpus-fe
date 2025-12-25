<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'

// --- ICONS ---
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    QrCodeIcon,
    ArchiveBoxIcon,
    TagIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA & STATE
// ==========================================
interface Obat {
    id: number
    kode_sku: string
    nama: string
    kategori: string
    satuan: string
    stok: number
    min_stok: number
    harga_beli: number
    harga_jual: number
    lokasi_rak: string
}

const showModal = ref(false)
const isEdit = ref(false)
const searchQuery = ref('')

const columns: TableColumn[] = [
    { key: 'kode_sku', label: 'SKU / Kode', width: '120px' },
    { key: 'nama', label: 'Nama Item / Obat' },
    { key: 'kategori', label: 'Kategori', width: '120px' },
    { key: 'stok', label: 'Stok Aktif', align: 'center', width: '100px' },
    { key: 'harga_beli', label: 'HPP (Beli)', align: 'right' },
    { key: 'harga_jual', label: 'Harga Jual', align: 'right' },
    { key: 'margin', label: 'Margin', align: 'center', width: '80px' },
    { key: 'lokasi_rak', label: 'Rak', align: 'center', width: '80px' },
    { key: 'actions', label: '', align: 'right' },
]

const obatData = ref<Obat[]>([
    { id: 1, kode_sku: 'MED-001', nama: 'AMOXICILLIN 500MG', kategori: 'OBAT KERAS', satuan: 'STRIP', stok: 50, min_stok: 100, harga_beli: 4500, harga_jual: 6000, lokasi_rak: 'A-01' },
    { id: 2, kode_sku: 'MED-002', nama: 'PARACETAMOL SYRUP', kategori: 'OBAT BEBAS', satuan: 'BOTOL', stok: 12, min_stok: 50, harga_beli: 12000, harga_jual: 18000, lokasi_rak: 'B-05' },
    { id: 3, kode_sku: 'ALK-001', nama: 'ALKOHOL 70% 1L', kategori: 'ALKES', satuan: 'JERIGEN', stok: 5, min_stok: 20, harga_beli: 45000, harga_jual: 65000, lokasi_rak: 'G-01' },
])

const form = reactive({
    id: undefined as number | undefined,
    kode_sku: '',
    nama: '',
    kategori: 'OBAT KERAS',
    satuan: 'PCS',
    stok: 0,
    min_stok: 10,
    harga_beli: 0,
    harga_jual: 0,
    lokasi_rak: ''
})

// ==========================================
// 2. LOGIC
// ==========================================
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const calculateMargin = (beli: number, jual: number) => {
    if (jual === 0) return 0
    return Math.round(((jual - beli) / jual) * 100)
}

const generateSku = () => {
    const random = Math.floor(1000 + Math.random() * 9000)
    const prefix = form.kategori === 'ALKES' ? 'ALK' : 'MED'
    form.kode_sku = `${prefix}-${random}`
}

const openAddModal = () => {
    isEdit.value = false
    form.id = undefined
    form.kode_sku = ''; form.nama = ''; form.harga_beli = 0; form.harga_jual = 0
    form.stok = 0
    form.lokasi_rak = ''
    showModal.value = true
}

const openEditModal = (row: Obat) => {
    isEdit.value = true
    form.id = row.id
    form.kode_sku = row.kode_sku
    form.nama = row.nama
    form.kategori = row.kategori
    form.satuan = row.satuan
    form.min_stok = row.min_stok
    form.harga_beli = row.harga_beli
    form.harga_jual = row.harga_jual
    form.lokasi_rak = row.lokasi_rak
    showModal.value = true
}

const handleSave = () => {
    if (isEdit.value && form.id !== undefined) {
        // --- MODE EDIT ---
        const index = obatData.value.findIndex(i => i.id === form.id)
        if (index !== -1) {
            obatData.value[index] = {
                ...obatData.value[index], // Ambil data lama
                ...form, // Timpa dengan data form
                id: form.id, // Pastikan ID tetap number (bukan undefined)
                nama: form.nama.toUpperCase(),
                lokasi_rak: form.lokasi_rak.toUpperCase()
            } as Obat
        }
    } else {
        // --- MODE TAMBAH BARU ---
        obatData.value.unshift({
            ...form, // Spread Form DULUAN (Penting!)
            id: Date.now(), // Baru timpa ID setelah spread
            stok: 0,
            nama: form.nama.toUpperCase(),
            lokasi_rak: form.lokasi_rak.toUpperCase()
        } as Obat)
    }
    showModal.value = false
}

const handleDelete = (id: number) => {
    if (confirm('Arsipkan data obat ini?')) {
        obatData.value = obatData.value.filter(i => i.id !== id)
    }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Katalog Obat & Alkes</h1>
                <p class="text-[12px] text-gray-500">Master Data Item Farmasi.</p>
            </div>
            <BaseButton :icon="PlusIcon" @click="openAddModal">Item Baru</BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-green-600">
                <div>
                    <p class="text-[10px] font-black text-gray-500 uppercase">Total SKU Aktif</p>
                    <p class="text-xl font-black text-gray-900 font-mono">{{ obatData.length }}</p>
                </div>
                <ArchiveBoxIcon class="w-8 h-8 text-green-100" />
            </div>
            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-blue-600">
                <div>
                    <p class="text-[10px] font-black text-gray-500 uppercase">Total Valuasi (HPP)</p>
                    <p class="text-xl font-black text-blue-600 font-mono tracking-tighter">{{
                        formatCurrency(obatData.reduce((acc, curr) => acc + (curr.stok * curr.harga_beli), 0)) }}</p>
                </div>
                <TagIcon class="w-8 h-8 text-blue-100" />
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-6 px-2">
                <h3 class="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                    Database Item
                </h3>
                <div class="w-64">
                    <BaseInput v-model="searchQuery" :icon="MagnifyingGlassIcon" placeholder="Cari Nama / SKU..."
                        size="sm" />
                </div>
            </div>

            <BaseDataTable :columns="columns" :data="obatData" hide-search>
                <template #kode_sku="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{{
                        value }}</span>
                </template>

                <template #nama="{ value, row }">
                    <div class="flex flex-col">
                        <span class="text-[11px] font-bold text-gray-800 uppercase">{{ value }}</span>
                        <span class="text-[9px] text-gray-400 uppercase">{{ row.satuan }}</span>
                    </div>
                </template>

                <template #kategori="{ value }">
                    <span class="text-[9px] font-bold uppercase border px-1 rounded text-gray-600 border-gray-300">{{
                        value }}</span>
                </template>

                <template #stok="{ value, row }">
                    <span
                        :class="['font-mono text-[12px] font-black', value <= row.min_stok ? 'text-red-600' : 'text-gray-900']">
                        {{ value }}
                    </span>
                </template>

                <template #harga_beli="{ value }">
                    <span class="font-mono text-[11px] font-medium text-gray-500">{{ formatCurrency(value) }}</span>
                </template>

                <template #harga_jual="{ value }">
                    <span class="font-mono text-[11px] font-bold text-green-700">{{ formatCurrency(value) }}</span>
                </template>

                <template #margin="{ row }">
                    <span class="font-mono text-[10px] font-bold bg-blue-50 text-blue-700 px-1 py-0.5 rounded">
                        {{ calculateMargin(row.harga_beli, row.harga_jual) }}%
                    </span>
                </template>

                <template #lokasi_rak="{ value }">
                    <span
                        class="font-mono text-[11px] font-bold text-gray-900 bg-yellow-100 px-2 py-0.5 rounded border border-yellow-200">{{
                        value }}</span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <BaseActionMenu>
                            <button @click="openEditModal(row)"
                                class="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <PencilSquareIcon class="w-4 h-4 text-blue-500" /> Edit Data
                            </button>
                            <button
                                class="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <QrCodeIcon class="w-4 h-4 text-gray-500" /> Cetak Label
                            </button>
                            <div class="border-t border-gray-100"></div>
                            <button @click="handleDelete(row.id)"
                                class="w-full text-left px-4 py-2 text-[11px] text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <TrashIcon class="w-4 h-4" /> Arsipkan
                            </button>
                        </BaseActionMenu>
                    </div>
                </template>
            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" :title="isEdit ? 'EDIT DATA OBAT' : 'TAMBAH OBAT BARU'" width="max-w-2xl">
            <div class="grid grid-cols-2 gap-6">

                <div class="space-y-4">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-wider border-b pb-1">Identitas
                        Barang
                    </h4>
                    <div class="flex gap-2 items-end">
                        <BaseInput label="Kode SKU" v-model="form.kode_sku" placeholder="Auto / Manual"
                            class="flex-1" />
                        <BaseButton @click="generateSku" size="sm" variant="secondary" class="mb-[2px]">Auto
                        </BaseButton>
                    </div>
                    <BaseInput label="Nama Obat / Item" v-model="form.nama" placeholder="Contoh: AMOXICILLIN 500MG" />
                    <div class="grid grid-cols-2 gap-4">
                        <BaseSelect label="Kategori" v-model="form.kategori"
                            :options="['OBAT KERAS', 'OBAT BEBAS', 'ALKES', 'BHP']" />
                        <BaseSelect label="Satuan" v-model="form.satuan"
                            :options="['PCS', 'STRIP', 'BOTOL', 'BOX', 'AMPUL']" />
                    </div>
                </div>

                <div class="space-y-4">
                    <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-wider border-b pb-1">Harga &
                        Inventory
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                        <BaseInput label="Harga Beli (HPP)" type="number" v-model="form.harga_beli" />
                        <BaseInput label="Harga Jual" type="number" v-model="form.harga_jual" />
                    </div>

                    <div class="bg-gray-50 p-2 rounded border border-gray-200 flex justify-between items-center">
                        <span class="text-[10px] uppercase font-bold text-gray-500">Estimasi Margin</span>
                        <span
                            :class="['text-sm font-black font-mono', calculateMargin(Number(form.harga_beli), Number(form.harga_jual)) < 0 ? 'text-red-600' : 'text-green-600']">
                            {{ calculateMargin(Number(form.harga_beli), Number(form.harga_jual)) }}%
                        </span>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <BaseInput label="Min. Stok (Warning)" type="number" v-model="form.min_stok" />
                        <BaseInput label="Lokasi Rak" v-model="form.lokasi_rak" placeholder="Cth: A-01" />
                    </div>
                </div>

            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" @click="handleSave" :disabled="!form.nama || !form.kode_sku">Simpan
                        Data</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>