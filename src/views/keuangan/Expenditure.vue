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
    ArrowUpTrayIcon,
    PlusIcon,
    DocumentTextIcon,
    TrashIcon,
    PencilSquareIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. TYPE DEFINITION (Biar TS gak rewel)
// ==========================================
interface Expenditure {
    id: number
    tgl: string
    kategori: string
    deskripsi: string
    nominal: number
    pembayaran: string
}

// ==========================================
// 2. DATA & STATE
// ==========================================
const showModal = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)

const columns: TableColumn[] = [
    { key: 'tgl', label: 'Tanggal', width: '120px' },
    { key: 'kategori', label: 'Kategori' },
    { key: 'deskripsi', label: 'Keterangan' },
    { key: 'nominal', label: 'Nominal', align: 'right' },
    { key: 'pembayaran', label: 'Via', align: 'center' },
    { key: 'actions', label: '', align: 'right' },
]

// Kasih Type Expenditure[] ke ref-nya
const expenditureData = ref<Expenditure[]>([
    { id: 1, tgl: '24/12/2025', kategori: 'UTILITAS', deskripsi: 'Bayar Listrik PLN Des 2025', nominal: 750000, pembayaran: 'TRANSFER' },
    { id: 2, tgl: '24/12/2025', kategori: 'ATK', deskripsi: 'Kertas A4 (5 Rim) & Tinta Printer', nominal: 325000, pembayaran: 'TUNAI' },
    { id: 3, tgl: '23/12/2025', kategori: 'PEMELIHARAAN', deskripsi: 'Servis AC Ruang Poli Umum', nominal: 150000, pembayaran: 'TUNAI' },
])

const form = reactive({
    kategori: 'ATK',
    deskripsi: '',
    nominal: 0,
    pembayaran: 'TUNAI'
})

const totalPengeluaran = computed(() => {
    return expenditureData.value.reduce((acc, curr) => acc + curr.nominal, 0)
})

// ==========================================
// 3. METHODS
// ==========================================

const openAddModal = () => {
    isEdit.value = false
    editingId.value = null
    form.kategori = 'ATK'; form.deskripsi = ''; form.nominal = 0; form.pembayaran = 'TUNAI'
    showModal.value = true
}

const openEditModal = (row: Expenditure) => {
    isEdit.value = true
    editingId.value = row.id
    form.kategori = row.kategori
    form.deskripsi = row.deskripsi
    form.nominal = row.nominal
    form.pembayaran = row.pembayaran
    showModal.value = true
}

const handleSave = () => {
    // 1. Ambil data form ke variabel lokal biar bersih
    const formData = {
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        nominal: Number(form.nominal),
        pembayaran: form.pembayaran
    }

    if (isEdit.value && editingId.value !== null) {
        // Logika Update yang bikin TS seneng
        expenditureData.value = expenditureData.value.map(item => {
            if (item.id === editingId.value) {
                // Balikin objek baru yang udah digabung sama form
                return { ...item, ...formData }
            }
            return item
        })
    } else {
        // Logika Tambah Baru
        const newItem: Expenditure = {
            id: Date.now(),
            tgl: new Date().toLocaleDateString('id-ID'),
            ...formData
        }
        expenditureData.value.unshift(newItem)
    }

    showModal.value = false
    form.deskripsi = ''
    form.nominal = 0
}

const handleDelete = (id: number) => {
    if (confirm('Hapus data pengeluaran ini?')) {
        expenditureData.value = expenditureData.value.filter(item => item.id !== id)
    }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Biaya Operasional (Expenditure)
                </h1>
                <p class="text-[12px] text-gray-500">Catat semua pengeluaran kas untuk kebutuhan operasional.</p>
            </div>
            <BaseButton :icon="PlusIcon" @click="openAddModal">Tambah Pengeluaran</BaseButton>
        </div>

        <div
            class="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between shadow-sm border-t-[4px] border-t-red-600">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-red-50 rounded-lg">
                    <ArrowUpTrayIcon class="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <p class="text-[10px] font-black text-gray-600 uppercase tracking-wider">Total Pengeluaran Bulan
                        Ini</p>
                    <p class="text-2xl font-black text-gray-900 font-mono">Rp {{
                        totalPengeluaran.toLocaleString('id-ID') }}</p>
                </div>
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <BaseDataTable :columns="columns" :data="expenditureData" hide-search>
                <template #kategori="{ value }">
                    <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                        {{ value }}
                    </span>
                </template>

                <template #nominal="{ value }">
                    <span class="font-mono font-bold text-red-600">- Rp {{ value.toLocaleString() }}</span>
                </template>

                <template #pembayaran="{ value }">
                    <span :class="['text-[10px] font-bold', value === 'TUNAI' ? 'text-orange-600' : 'text-blue-600']">
                        {{ value }}
                    </span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <BaseActionMenu>
                            <button
                                class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-green-600 transition text-left">
                                <DocumentTextIcon class="w-4 h-4 text-gray-400" />
                                Lihat Struk
                            </button>
                            <button @click="openEditModal(row)"
                                class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-green-600 transition text-left">
                                <PencilSquareIcon class="w-4 h-4 text-gray-400" />
                                Edit Data
                            </button>
                            <div class="border-t border-gray-100"></div>
                            <button @click="handleDelete(row.id)"
                                class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 transition text-left font-medium">
                                <TrashIcon class="w-4 h-4" />
                                Hapus
                            </button>
                        </BaseActionMenu>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" :title="isEdit ? 'Edit Pengeluaran Kas' : 'Tambah Pengeluaran Kas'"
            width="max-w-md">
            <div class="space-y-4">
                <BaseSelect label="Kategori Biaya" v-model="form.kategori"
                    :options="['ATK', 'UTILITAS', 'PEMELIHARAAN', 'OBAT-OBATAN', 'LAIN-LAIN']" />
                <BaseInput label="Keterangan / Deskripsi" v-model="form.deskripsi" />
                <BaseInput label="Nominal (Rp)" type="number" v-model="form.nominal" />
                <BaseSelect label="Metode Pembayaran" v-model="form.pembayaran" :options="['TUNAI', 'TRANSFER']" />
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" @click="handleSave" :disabled="!form.deskripsi || form.nominal <= 0">
                        {{ isEdit ? 'Simpan Perubahan' : 'Simpan' }}</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>