<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'

// --- ICONS ---
import {
    PlusIcon,
    ArrowRightCircleIcon,
    ArrowsRightLeftIcon,
    TrashIcon,
    PaperAirplaneIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA MASTER & STATE
// ==========================================
const unitOptions = [
    { value: 'GUDANG_UTAMA', label: 'GUDANG FARMASI UTAMA' },
    { value: 'APOTEK_RJ', label: 'APOTEK RAWAT JALAN' },
    { value: 'APOTEK_RI', label: 'APOTEK RAWAT INAP' },
    { value: 'DEPO_IGD', label: 'DEPO IGD' },
]

// Data Stok di Gudang Utama (Source)
const stokGudang = [
    { id: 1, nama: 'AMOXICILLIN 500MG (STRIP)', stok: 150 },
    { id: 2, nama: 'PARACETAMOL SYRUP (BOTOL)', stok: 20 },
    { id: 3, nama: 'ALKOHOL 70% 1L (JERIGEN)', stok: 5 },
]

// History Mutasi
interface MutasiHeader {
    id: number
    no_mutasi: string
    tgl: string
    dari: string
    ke: string
    total_item: number
    status: 'DRAFT' | 'SELESAI' | 'VOID'
}

const historyData = ref<MutasiHeader[]>([
    { id: 1, no_mutasi: 'TF-2512-001', tgl: '25/12/2025', dari: 'GUDANG FARMASI UTAMA', ke: 'APOTEK RAWAT JALAN', total_item: 50, status: 'SELESAI' },
    { id: 2, no_mutasi: 'TF-2512-002', tgl: '25/12/2025', dari: 'GUDANG FARMASI UTAMA', ke: 'DEPO IGD', total_item: 12, status: 'SELESAI' },
])

const columns: TableColumn[] = [
    { key: 'no_mutasi', label: 'No. Dokumen', width: '150px' },
    { key: 'tgl', label: 'Tanggal', width: '120px' },
    { key: 'dari', label: 'Asal Unit' },
    { key: 'ke', label: 'Tujuan Unit' },
    { key: 'total_item', label: 'Qty Item', align: 'center', width: '100px' },
    { key: 'status', label: 'Status', align: 'center', width: '100px' },
    { key: 'actions', label: '', align: 'right' },
]

// Form State
const showModal = ref(false)
const searchQuery = ref('')
const form = reactive({
    tgl_mutasi: new Date().toISOString().split('T')[0],
    unit_asal: 'GUDANG_UTAMA',
    unit_tujuan: '',
    keterangan: '',
    items: [] as any[]
})

const showDetailModal = ref(false)
const selectedMutasi = ref<any>(null)
// Dummy data detail mutasi
const detailItems = ref([
    { nama: 'AMOXICILLIN 500MG', qty: 50, satuan: 'BOX' },
    { nama: 'ALKOHOL 70%', qty: 2, satuan: 'JERIGEN' },
])

// 3. Tambahkan Function
const handleDetail = (row: MutasiHeader) => {
    selectedMutasi.value = row
    showDetailModal.value = true
}

const handleVoid = (row: MutasiHeader) => {
    if (!confirm(`PERINGATAN!\n\nAnda akan membatalkan Mutasi ${row.no_mutasi}.\nStok di ${row.ke} akan ditarik kembali ke ${row.dari}.\n\nLanjutkan?`)) {
        return
    }

    const targetItem = historyData.value.find(h => h.id === row.id)
    if (targetItem) {
        targetItem.status = 'VOID'
        alert('Mutasi berhasil dibatalkan (VOID). Stok telah dikembalikan.')
    }
}

// ==========================================
// 2. LOGIC
// ==========================================
const addItemRow = () => {
    form.items.push({
        obat_id: undefined,
        stok_asal: 0, // Buat validasi
        qty_transfer: 1
    })
}

const removeRow = (index: number) => {
    form.items.splice(index, 1)
}

const handleObatChange = (index: number, val: any) => {
    const currentRow = form.items[index]
    if (!currentRow) return

    const obatId = Number(val)
    if (!obatId) {
        currentRow.stok_asal = 0
        return
    }

    const selected = stokGudang.find(o => o.id === obatId)
    if (selected) {
        currentRow.stok_asal = selected.stok
    }
}

const openModal = () => {
    form.unit_tujuan = ''
    form.keterangan = ''
    form.items = []
    addItemRow()
    showModal.value = true
}

const handleSave = () => {
    // Validasi Sederhana
    const invalidItem = form.items.find(i => i.qty_transfer > i.stok_asal)
    if (invalidItem) {
        alert('Gagal! Ada item yang Qty Transfer melebihi Stok Tersedia.')
        return
    }

    historyData.value.unshift({
        id: Date.now(),
        no_mutasi: `TF-${Date.now().toString().slice(-6)}`,
        tgl: new Date().toLocaleDateString('id-ID'),
        dari: unitOptions.find(u => u.value === form.unit_asal)?.label || '',
        ke: unitOptions.find(u => u.value === form.unit_tujuan)?.label || '',
        total_item: form.items.reduce((acc, curr) => acc + curr.qty_transfer, 0),
        status: 'SELESAI'
    })

    showModal.value = false
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Mutasi Antar Unit</h1>
                <p class="text-[12px] text-gray-500">Transfer Stok Gudang Utama ke Depo/Apotek.</p>
            </div>
            <BaseButton :icon="PlusIcon" @click="openModal">Buat Mutasi Baru</BaseButton>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-6 px-2">
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    Riwayat Transfer
                </h3>
                <div class="w-64">
                    <BaseInput v-model="searchQuery" :icon="MagnifyingGlassIcon" placeholder="Cari No. Dokumen..."
                        size="sm" />
                </div>
            </div>

            <BaseDataTable :columns="columns" :data="historyData" hide-search>
                <template #no_mutasi="{ value }">
                    <span class="font-mono text-[11px] font-bold text-blue-600 uppercase">{{ value }}</span>
                </template>
                <template #dari="{ value }">
                    <span class="text-[10px] font-bold text-gray-500 uppercase">{{ value }}</span>
                </template>
                <template #ke="{ value }">
                    <span
                        class="text-[10px] font-bold text-gray-800 uppercase bg-blue-50 px-2 py-0.5 rounded text-blue-700 border border-blue-100">{{
                            value }}</span>
                </template>
                <template #total_item="{ value }">
                    <span class="font-mono text-[11px] font-black text-gray-900">{{ value }}</span>
                </template>
                <template #status="{ value }">
                    <span v-if="value === 'SELESAI'"
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">SELESAI</span>
                    <span v-else-if="value === 'VOID'"
                        class="text-[9px] font-black bg-gray-200 text-gray-500 px-2 py-0.5 rounded border border-gray-300 uppercase line-through">VOID</span>
                    <span v-else
                        class="text-[9px] font-black bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 uppercase">DRAFT</span>
                </template>
                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <BaseActionMenu>
                            <button @click="handleDetail(row)"
                                class="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <DocumentTextIcon class="w-4 h-4 text-blue-500" /> Lihat Rincian
                            </button>

                            <div class="border-t border-gray-100"></div>

                            <button
                                class="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <PaperAirplaneIcon class="w-4 h-4 text-gray-500" /> Cetak SJ
                            </button>

                            <button v-if="row.status !== 'VOID'" @click="handleVoid(row)"
                                class="w-full text-left px-4 py-2 text-[11px] text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100">
                                <TrashIcon class="w-4 h-4" /> Batalkan Transfer
                            </button>
                        </BaseActionMenu>
                    </div>
                </template>
            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" title="FORM TRANSFER STOK" width="max-w-4xl">
            <div class="space-y-6">

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <BaseSelect label="Unit Asal (Sumber)" v-model="form.unit_asal" :options="unitOptions" />

                        <BaseSelect label="Unit Tujuan (Target)" v-model="form.unit_tujuan"
                            :options="unitOptions.filter(u => u.value !== form.unit_asal)"
                            placeholder="Pilih Tujuan..." />
                    </div>
                    <div class="space-y-4">
                        <BaseInput type="date" label="Tanggal Transfer" v-model="form.tgl_mutasi" />
                        <BaseInput label="Keterangan / Catatan" v-model="form.keterangan"
                            placeholder="Contoh: Permintaan Rutin / Retur Stok" />
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Daftar Barang yang
                            Dikirim
                        </h4>
                        <BaseButton size="sm" :icon="PlusIcon" variant="secondary" @click="addItemRow">Tambah Barang
                        </BaseButton>
                    </div>

                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-gray-100 text-[10px] font-black text-gray-500 uppercase">
                                <tr>
                                    <th class="p-2 w-[40%]">Nama Obat / Item</th>
                                    <th class="p-2 w-[20%] text-center">Stok Asal</th>
                                    <th class="p-2 w-[20%] text-center">Qty Kirim</th>
                                    <th class="p-2 w-[10%] text-center">Satuan</th>
                                    <th class="p-2 w-[10%]"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                <tr v-for="(item, index) in form.items" :key="index" class="group hover:bg-gray-50">
                                    <td class="p-2">
                                        <BaseSelectSearch v-model="item.obat_id"
                                            :options="stokGudang.map(s => ({ value: s.id, label: s.nama }))"
                                            placeholder="Pilih Obat..." class="text-xs"
                                            @update:model-value="(val) => handleObatChange(index, val)" />
                                    </td>
                                    <td class="p-2 text-center">
                                        <span class="font-mono text-xs font-bold text-gray-500">{{ item.stok_asal
                                        }}</span>
                                    </td>
                                    <td class="p-2 text-center">
                                        <input type="number" v-model="item.qty_transfer"
                                            class="w-20 border border-gray-300 rounded px-2 py-1 text-xs font-mono text-center font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            :class="{ 'border-red-500 text-red-600': item.qty_transfer > item.stok_asal }" />
                                        <div v-if="item.qty_transfer > item.stok_asal"
                                            class="text-[9px] text-red-500 font-bold mt-1">Over Stock!</div>
                                    </td>
                                    <td class="p-2 text-center text-xs text-gray-400">PCS</td>
                                    <td class="p-2 text-center">
                                        <button @click="removeRow(index)" class="text-red-400 hover:text-red-600">
                                            <TrashIcon class="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="form.items.length === 0">
                                    <td colspan="5" class="p-6 text-center text-xs text-gray-400 italic">Belum ada
                                        barang.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" @click="handleSave"
                        :disabled="!form.unit_tujuan || form.items.length === 0">
                        Kirim Stok
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showDetailModal" title="RINCIAN MUTASI BARANG" width="max-w-2xl">
            <div v-if="selectedMutasi" class="space-y-4">
                <div class="bg-blue-50 p-4 rounded border border-blue-100 grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-[10px] text-gray-500 uppercase font-bold">No. Dokumen</p>
                        <p class="font-bold text-blue-700">{{ selectedMutasi.no_mutasi }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-500 uppercase font-bold">Tanggal</p>
                        <p class="font-bold text-gray-800">{{ selectedMutasi.tgl }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-500 uppercase font-bold">Dari Unit</p>
                        <p class="font-bold text-gray-800">{{ selectedMutasi.dari }}</p>
                    </div>
                    <div class="flex items-center">
                        <ArrowRightCircleIcon class="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                            <p class="text-[10px] text-gray-500 uppercase font-bold">Ke Unit</p>
                            <p class="font-bold text-gray-800">{{ selectedMutasi.ke }}</p>
                        </div>
                    </div>
                </div>

                <div class="border rounded overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-100 text-[10px] uppercase font-bold text-gray-500">
                            <tr>
                                <th class="p-2">Nama Barang</th>
                                <th class="p-2 text-center">Qty</th>
                                <th class="p-2 text-center">Satuan</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(item, idx) in detailItems" :key="idx">
                                <td class="p-2 font-bold text-gray-700">{{ item.nama }}</td>
                                <td class="p-2 text-center font-mono font-bold">{{ item.qty }}</td>
                                <td class="p-2 text-center text-xs text-gray-500">{{ item.satuan }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <template #footer>
                <BaseButton variant="secondary" class="w-full" @click="showDetailModal = false">Tutup</BaseButton>
            </template>
        </BaseModal>
    </div>
</template>