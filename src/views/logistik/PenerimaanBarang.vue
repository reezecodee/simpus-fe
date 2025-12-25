<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue' // PENTING: Pakai Search
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'

// --- ICONS ---
import {
    PlusIcon,
    MagnifyingGlassIcon,
    DocumentCheckIcon,
    TrashIcon,
    TruckIcon,
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA MASTER (SIMULASI)
// ==========================================
// Biasanya ini ambil dari API mst_suplier & mst_obat
const suplierOptions = [
    { value: 1, label: 'PT. KIMIA FARMA TRADING' },
    { value: 2, label: 'PT. ANUGRAH ARGON MEDICA' },
    { value: 3, label: 'PT. SUMBER SEHAT' },
]

const obatOptions = [
    { value: 1, label: 'AMOXICILLIN 500MG (STRIP)', harga_beli: 4500 },
    { value: 2, label: 'PARACETAMOL SYRUP (BOTOL)', harga_beli: 12000 },
    { value: 3, label: 'ALKOHOL 70% 1L (JERIGEN)', harga_beli: 45000 },
]

// ==========================================
// 2. STATE TRANSAKSI
// ==========================================
interface ReceivingDetail {
    obat_id: number | undefined
    batch_no: string
    expired_date: string
    qty: number
    harga_satuan: number
}

interface ReceivingHeader {
    id: number
    tgl_terima: string
    no_faktur: string
    suplier_nama: string
    total_item: number
    total_nilai: number
    status: 'SELESAI' | 'DRAFT' | 'VOID'
}

const showModal = ref(false)
const searchQuery = ref('')

// History Data (Tabel Depan)
const columns: TableColumn[] = [
    { key: 'tgl_terima', label: 'Tgl Terima', width: '120px' },
    { key: 'no_faktur', label: 'No. Faktur', width: '150px' },
    { key: 'suplier_nama', label: 'Suplier' },
    { key: 'total_item', label: 'Jml Item', align: 'center', width: '100px' },
    { key: 'total_nilai', label: 'Total Nilai', align: 'right' },
    { key: 'status', label: 'Status', align: 'center', width: '100px' },
    { key: 'actions', label: '', align: 'right' },
]

const historyData = ref<ReceivingHeader[]>([
    { id: 101, tgl_terima: '25/12/2025', no_faktur: 'INV/KF/2512001', suplier_nama: 'PT. KIMIA FARMA TRADING', total_item: 150, total_nilai: 4500000, status: 'SELESAI' },
    { id: 102, tgl_terima: '24/12/2025', no_faktur: 'INV/AAM/2412999', suplier_nama: 'PT. ANUGRAH ARGON MEDICA', total_item: 50, total_nilai: 1250000, status: 'SELESAI' },
])

// Form Input (Header & Detail)
const form = reactive({
    suplier_id: undefined as number | undefined,
    no_faktur: '',
    tgl_faktur: new Date().toISOString().split('T')[0],
    items: [] as ReceivingDetail[]
})

// ==========================================
// 3. LOGIC
// ==========================================
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

// Logic Item Detail
const addItemRow = () => {
    form.items.push({
        obat_id: undefined,
        batch_no: '',
        expired_date: '',
        qty: 1,
        harga_satuan: 0
    })
}

const removeItemRow = (index: number) => {
    form.items.splice(index, 1)
}

// Auto fill harga beli saat obat dipilih
// Ubah tipe obatId jadi: number | undefined | null
// Gunakan 'any' untuk parameter kedua biar aman dari error tipe
const handleObatChange = (index: number, val: any) => {
    const obatId = Number(val)

    // Cek 1: Pastikan baris itemnya BENAR-BENAR ADA dulu
    if (!form.items[index]) return

    // Cek 2: Jika user menghapus pilihan (val kosong), reset harga jadi 0
    if (!obatId) {
        form.items[index].harga_satuan = 0
        return
    }

    // Cek 3: Cari data obat di master
    const selected = obatOptions.find(o => o.value === obatId)

    // Cek 4: Jika obat ketemu, baru update harga
    if (selected) {
        form.items[index].harga_satuan = selected.harga_beli
    }
}

// Hitung Grand Total Otomatis
const grandTotal = computed(() => {
    return form.items.reduce((acc, item) => acc + (item.qty * item.harga_satuan), 0)
})

const openAddModal = () => {
    form.suplier_id = undefined
    form.no_faktur = ''
    form.items = []
    addItemRow() // Tambah 1 baris kosong di awal
    showModal.value = true
}

const handleSave = () => {
    if (!form.suplier_id || form.items.length === 0) return

    const suplier = suplierOptions.find(s => s.value === form.suplier_id)

    // Simpan ke History
    historyData.value.unshift({
        id: Date.now(),
        tgl_terima: new Date().toLocaleDateString('id-ID'),
        no_faktur: form.no_faktur.toUpperCase(),
        suplier_nama: suplier?.label || 'UNKNOWN',
        total_item: form.items.reduce((acc, curr) => acc + curr.qty, 0),
        total_nilai: grandTotal.value,
        status: 'SELESAI'
    })

    showModal.value = false
}

// --- 1. State untuk Modal Detail ---
const showDetailModal = ref(false)
const selectedFaktur = ref<any>(null) // Menyimpan data baris yang diklik

// --- 2. Dummy Data Detail (Ceritanya ini ambil dari API backend saat klik) ---
const dummyDetailItems = ref([
    { nama: 'AMOXICILLIN 500MG', batch: 'BATCH-001', exp: '2026-12-01', qty: 100, harga: 4500 },
    { nama: 'PARACETAMOL SYRUP', batch: 'BATCH-99X', exp: '2027-01-15', qty: 50, harga: 12000 },
])

// --- 3. Function Buka Modal ---
const openDetail = (row: any) => {
    selectedFaktur.value = row
    // Di real app, di sini kita panggil API: await fetchDetail(row.id)
    showDetailModal.value = true
}

// Tambahkan fungsi ini
const handleVoid = (row: ReceivingHeader) => {
    // 1. Konfirmasi Keras
    if (!confirm(`PERINGATAN KERAS!\n\nMembatalkan Faktur ${row.no_faktur} akan menarik kembali seluruh stok barang yang telah masuk.\n\nPastikan fisik barang belum dijual/dipakai. Lanjutkan?`)) {
        return
    }

    // 2. Cari Objeknya langsung (Bukan Index-nya)
    // TypeScript suka cara ini karena kita simpan di variabel 'targetItem'
    const targetItem = historyData.value.find(h => h.id === row.id)
    
    // 3. Cek Keberadaan & Update
    if (targetItem) {
        targetItem.status = 'VOID' // Aman, TS tahu 'targetItem' itu ada
        alert('Faktur berhasil dibatalkan. Stok telah ditarik kembali.')
    }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Penerimaan Barang</h1>
                <p class="text-[12px] text-gray-500">Input Faktur Pembelian & Inbound Stok.</p>
            </div>
            <BaseButton :icon="PlusIcon" @click="openAddModal">Input Faktur Baru</BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-green-600">
                <div>
                    <p class="text-[10px] font-black text-gray-600 uppercase">Pembelian Hari Ini</p>
                    <p class="text-xl font-black text-gray-900 font-mono tracking-tighter">{{ formatCurrency(5750000) }}
                    </p>
                </div>
                <DocumentCheckIcon class="w-8 h-8 text-green-100" />
            </div>
            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-blue-600">
                <div>
                    <p class="text-[10px] font-black text-gray-600 uppercase">Faktur Masuk (Bulan Ini)</p>
                    <p class="text-xl font-black text-blue-600 font-mono tracking-tighter">12 <span
                            class="text-sm text-gray-400">Dokumen</span></p>
                </div>
                <TruckIcon class="w-8 h-8 text-blue-100" />
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-6 px-2">
                <h3 class="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                    Riwayat Penerimaan (Logbook)
                </h3>
                <div class="w-64">
                    <BaseInput v-model="searchQuery" :icon="MagnifyingGlassIcon"
                        placeholder="Cari No. Faktur / Suplier..." size="sm" />
                </div>
            </div>

            <BaseDataTable :columns="columns" :data="historyData" hide-search>
                <template #tgl_terima="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-500">{{ value }}</span>
                </template>
                <template #no_faktur="{ value }">
                    <span class="font-mono text-[11px] font-bold text-blue-600 uppercase">{{ value }}</span>
                </template>
                <template #suplier_nama="{ value }">
                    <span class="text-[11px] font-bold text-gray-800 uppercase tracking-tight">{{ value }}</span>
                </template>
                <template #total_item="{ value }">
                    <span class="font-mono text-[11px] font-black text-gray-900">{{ value }}</span>
                </template>
                <template #total_nilai="{ value }">
                    <span class="font-mono text-[11px] font-bold text-green-700">{{ formatCurrency(value) }}</span>
                </template>
                <template #status="{ value }">
                    <span
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">{{
                            value }}</span>
                </template>
                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <BaseActionMenu>
                            <button @click="openDetail(row)"
                                class="w-full text-left px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 uppercase">
                                <DocumentCheckIcon class="w-4 h-4 text-blue-500" /> Lihat Rincian
                            </button>

                            <div class="border-t border-gray-100"></div>

                            <button v-if="row.status !== 'VOID'" @click="handleVoid(row)"
                                class="w-full text-left px-4 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 uppercase">
                                <TrashIcon class="w-4 h-4" /> Batalkan Faktur
                            </button>
                        </BaseActionMenu>
                    </div>
                </template>
            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" title="INPUT FAKTUR PEMBELIAN (INBOUND)" width="max-w-4xl">
            <div class="space-y-6">

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-3 gap-4">
                    <div class="col-span-1">
                        <BaseSelect label="Pilih Suplier" v-model="form.suplier_id" :options="suplierOptions"
                            placeholder="-- Cari Vendor --" />
                    </div>
                    <div class="col-span-1">
                        <BaseInput label="Nomor Faktur" v-model="form.no_faktur" placeholder="Nomor Invoice Fisik" />
                    </div>
                    <div class="col-span-1">
                        <BaseInput label="Tanggal Faktur" type="date" v-model="form.tgl_faktur" />
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Rincian Obat / Barang
                        </h4>
                        <BaseButton size="sm" :icon="PlusIcon" variant="secondary" @click="addItemRow">Tambah Baris
                        </BaseButton>
                    </div>

                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-gray-100 text-[10px] font-black text-gray-500 uppercase">
                                <tr>
                                    <th class="p-2 w-[30%]">Nama Obat / SKU</th>
                                    <th class="p-2 w-[15%]">Batch No</th>
                                    <th class="p-2 w-[15%]">Expired</th>
                                    <th class="p-2 w-[10%] text-center">Qty</th>
                                    <th class="p-2 w-[15%] text-right">Harga Beli</th>
                                    <th class="p-2 w-[15%] text-right">Subtotal</th>
                                    <th class="p-2 w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                <tr v-for="(item, index) in form.items" :key="index" class="group hover:bg-gray-50">
                                    <td class="p-2 align-top">
                                        <BaseSelectSearch v-model="item.obat_id" :options="obatOptions"
                                            placeholder="Cari..." class="text-xs"
                                            @update:model-value="(val: any) => handleObatChange(index, val)" />
                                    </td>
                                    <td class="p-2 align-top">
                                        <input type="text" v-model="item.batch_no" placeholder="Batch..."
                                            class="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500 uppercase" />
                                    </td>
                                    <td class="p-2 align-top">
                                        <input type="date" v-model="item.expired_date"
                                            class="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-blue-500" />
                                    </td>
                                    <td class="p-2 align-top">
                                        <input type="number" v-model="item.qty"
                                            class="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono text-center font-bold focus:outline-none focus:border-blue-500" />
                                    </td>
                                    <td class="p-2 align-top">
                                        <input type="number" v-model="item.harga_satuan"
                                            class="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono text-right focus:outline-none focus:border-blue-500" />
                                    </td>
                                    <td class="p-2 align-top text-right">
                                        <span class="text-xs font-black font-mono text-gray-700">{{
                                            formatCurrency(item.qty *
                                                item.harga_satuan) }}</span>
                                    </td>
                                    <td class="p-2 align-top text-center">
                                        <button @click="removeItemRow(index)"
                                            class="text-red-400 hover:text-red-600 p-1">
                                            <TrashIcon class="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="form.items.length === 0">
                                    <td colspan="7"
                                        class="p-8 text-center text-xs text-gray-400 italic bg-gray-50 border-dashed border-2 border-gray-100">
                                        Belum ada item ditambahkan. Klik tombol "Tambah Baris".
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="bg-gray-50 border-t border-gray-200">
                                <tr>
                                    <td colspan="5"
                                        class="p-3 text-right text-[11px] font-black text-gray-500 uppercase tracking-widest">
                                        Grand Total Faktur</td>
                                    <td
                                        class="p-3 text-right text-base font-black text-blue-700 font-mono tracking-tighter">
                                        {{
                                            formatCurrency(grandTotal) }}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full items-center">
                    <div class="mr-auto text-[10px] text-gray-400 font-bold uppercase">
                        * Pastikan No. Batch & Expired Date sesuai fisik barang
                    </div>
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" @click="handleSave"
                        :disabled="form.items.length === 0 || !form.no_faktur">
                        Simpan Faktur
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showDetailModal" title="RINCIAN FAKTUR MASUK" width="max-w-3xl">
            <div v-if="selectedFaktur" class="space-y-6">

                <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">No. Faktur</p>
                        <p class="text-sm font-bold text-gray-800 uppercase">{{ selectedFaktur.no_faktur }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Suplier</p>
                        <p class="text-sm font-bold text-gray-800 uppercase">{{ selectedFaktur.suplier_nama }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tanggal Terima</p>
                        <p class="text-sm font-bold text-gray-800 uppercase">{{ selectedFaktur.tgl_terima }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Nilai</p>
                        <p class="text-sm font-bold text-blue-600 font-mono">{{
                            formatCurrency(selectedFaktur.total_nilai) }}
                        </p>
                    </div>
                </div>

                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-100 text-[10px] font-black text-gray-500 uppercase">
                            <tr>
                                <th class="p-2">Nama Barang</th>
                                <th class="p-2">No. Batch</th>
                                <th class="p-2">Expired</th>
                                <th class="p-2 text-center">Qty</th>
                                <th class="p-2 text-right">Harga</th>
                                <th class="p-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 text-xs">
                            <tr v-for="(item, idx) in dummyDetailItems" :key="idx">
                                <td class="p-2 font-bold text-gray-700">{{ item.nama }}</td>
                                <td class="p-2 font-mono text-gray-500">{{ item.batch }}</td>
                                <td class="p-2 font-mono text-gray-500">{{ item.exp }}</td>
                                <td class="p-2 text-center font-bold">{{ item.qty }}</td>
                                <td class="p-2 text-right font-mono">{{ formatCurrency(item.harga) }}</td>
                                <td class="p-2 text-right font-mono font-bold text-gray-800">{{ formatCurrency(item.qty
                                    *
                                    item.harga) }}</td>
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