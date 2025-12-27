<script setup lang="ts">
import { ref, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'

// --- ICONS ---
import { 
  PlusIcon, 
  PaperAirplaneIcon, 
  ClockIcon, 
  TrashIcon,
  CheckCircleIcon,
  EyeIcon,
  XCircleIcon,
  NoSymbolIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. TYPE DEFINITIONS (Hanya untuk Table History)
// ==========================================
interface RequestHeader {
    id: number
    no_req: string
    tgl: string | undefined
    total_item: number
    status: 'PENDING' | 'APPROVED' | 'VOID'
    ket: string
}

// ==========================================
// 2. DATA STATE
// ==========================================

const obatOptions = [
    { value: 1, label: 'AMOXICILLIN 500MG (STRIP)' },
    { value: 2, label: 'PARACETAMOL SYRUP (BOTOL)' },
    { value: 3, label: 'VITAMIN C 500MG (STRIP)' },
    { value: 4, label: 'ALKOHOL 70% (JERIGEN)' },
]

const historyData = ref<RequestHeader[]>([
    { id: 1, no_req: 'REQ-2512-001', tgl: '2025-12-27', total_item: 5, status: 'PENDING', ket: 'Stok harian' },
    { id: 2, no_req: 'REQ-2512-002', tgl: '2025-12-26', total_item: 2, status: 'APPROVED', ket: 'Cito kekosongan' },
    { id: 3, no_req: 'REQ-2512-003', tgl: '2025-12-25', total_item: 10, status: 'VOID', ket: 'Salah input' },
])

const columns: TableColumn[] = [
  { key: 'no_req', label: 'No. Request', width: '150px' },
  { key: 'tgl', label: 'Tanggal', width: '120px' },
  { key: 'total_item', label: 'Jml Item', align: 'center', width: '100px' },
  { key: 'ket', label: 'Keterangan' },
  { key: 'status', label: 'Status Gudang', align: 'center', width: '140px' },
  { key: 'actions', label: '', align: 'right' },
]

// --- FORM STATE (TANPA INTERFACE RIBET) ---
// Kita biarkan TS menebak tipenya sendiri dari nilai awal
const showModal = ref(false)
const form = reactive({
    tgl_req: new Date().toISOString().split('T')[0], // Ini otomatis jadi string
    keterangan: '',
    items: [] as any[]
})

// Detail State
const showDetailModal = ref(false)
const selectedReq = ref<any>(null)
const detailItems = ref([
    { nama: 'AMOXICILLIN 500MG', qty: 10, satuan: 'BOX' },
    { nama: 'PARACETAMOL SYRUP', qty: 5, satuan: 'BOTOL' },
])

// ==========================================
// 3. LOGIC
// ==========================================

const addItemRow = () => {
    form.items.push({ obat_id: null, qty_minta: 1 })
}

const removeRow = (index: number) => {
    form.items.splice(index, 1)
}

const openModal = () => {
    form.items = []
    form.keterangan = ''
    form.tgl_req = new Date().toISOString().split('T')[0]
    addItemRow()
    showModal.value = true
}

const handleSave = () => {
    // FIX FINAL: Kita pakai "|| ''" biar TS gak bacot soal undefined
    const tanggalFix = form.tgl_req || new Date().toISOString().split('T')[0]

    historyData.value.unshift({
        id: Date.now(),
        no_req: `REQ-${Date.now().toString().slice(-6)}`,
        tgl: tanggalFix, 
        total_item: form.items.length,
        status: 'PENDING',
        ket: form.keterangan || '-'
    })
    
    showModal.value = false
}

const handleDetail = (row: any) => {
    selectedReq.value = row
    showDetailModal.value = true
}

const handleVoid = (row: any) => {
    if (!confirm(`Apakah Anda yakin ingin MEMBATALKAN permintaan ${row.no_req}?`)) {
        return
    }
    const target = historyData.value.find(h => h.id === row.id)
    if (target) {
        target.status = 'VOID'
    }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Permintaan Stok (LPLPO)</h1>
                <p class="text-[12px] text-gray-500">Buat permintaan barang ke Gudang Farmasi Utama.</p>
            </div>
            <BaseButton :icon="PlusIcon" @click="openModal">Buat Permintaan Baru</BaseButton>
        </div>

        <BaseAlert title="INFORMASI" variant="info" :dismissible="true">
            Permintaan yang statusnya <b>PENDING</b> bisa dibatalkan jika ada kesalahan. <br>
            Jika sudah <b>APPROVED</b>, barang akan segera dikirim oleh Logistik.
        </BaseAlert>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <BaseDataTable :columns="columns" :data="historyData">

                <template #no_req="{ value }">
                    <span class="font-mono text-[11px] font-bold text-blue-600">{{ value }}</span>
                </template>

                <template #status="{ value }">
                    <span v-if="value === 'PENDING'"
                        class="text-[9px] font-black bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 uppercase flex items-center gap-1 w-fit mx-auto">
                        <ClockIcon class="w-3 h-3" /> Menunggu
                    </span>
                    <span v-else-if="value === 'APPROVED'"
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase flex items-center gap-1 w-fit mx-auto">
                        <CheckCircleIcon class="w-3 h-3" /> Disetujui
                    </span>
                    <span v-else
                        class="text-[9px] font-black bg-gray-200 text-gray-500 px-2 py-0.5 rounded border border-gray-300 uppercase flex items-center gap-1 w-fit mx-auto line-through">
                        <NoSymbolIcon class="w-3 h-3" /> Dibatalkan
                    </span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <BaseActionMenu>
                            <button @click="handleDetail(row)"
                                class="w-full text-left px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 uppercase">
                                <EyeIcon class="w-4 h-4 text-blue-500" /> Lihat Rincian
                            </button>

                            <div class="border-t border-gray-100"></div>

                            <button v-if="row.status === 'PENDING'" @click="handleVoid(row)"
                                class="w-full text-left px-4 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 uppercase">
                                <XCircleIcon class="w-4 h-4" /> Batalkan Request
                            </button>
                        </BaseActionMenu>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" title="FORM PERMINTAAN BARANG" width="max-w-3xl">
            <div class="space-y-6">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                    <BaseInput type="date" label="Tanggal Permintaan" v-model="form.tgl_req" />
                    <BaseInput label="Keterangan / Catatan" v-model="form.keterangan"
                        placeholder="Contoh: Stok Mingguan" />
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="text-[10px] font-black text-gray-500 uppercase">Item yang Diminta</h4>
                        <BaseButton size="sm" variant="secondary" :icon="PlusIcon" @click="addItemRow">Tambah Item
                        </BaseButton>
                    </div>

                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                        <table class="w-full text-left">
                            <thead class="bg-gray-100 text-[10px] font-black text-gray-500 uppercase">
                                <tr>
                                    <th class="p-2">Nama Obat</th>
                                    <th class="p-2 text-center w-24">Qty Minta</th>
                                    <th class="p-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(item, index) in form.items" :key="index">
                                    <td class="p-2">
                                        <BaseSelectSearch v-model="item.obat_id" :options="obatOptions"
                                            placeholder="Pilih Obat..." />
                                    </td>
                                    <td class="p-2">
                                        <input type="number" v-model="item.qty_minta"
                                            class="w-full border border-gray-300 rounded px-2 py-1 text-center font-bold text-sm focus:outline-none focus:border-blue-500" />
                                    </td>
                                    <td class="p-2 text-center">
                                        <button @click="removeRow(index)" class="text-red-400 hover:text-red-600">
                                            <TrashIcon class="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" @click="handleSave">Kirim Permintaan
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showDetailModal" title="RINCIAN PERMINTAAN" width="max-w-2xl">
            <div v-if="selectedReq" class="space-y-4">
                <div class="bg-blue-50 p-4 rounded border border-blue-100 grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-[10px] text-gray-500 uppercase font-bold">No. Request</p>
                        <p class="font-bold text-blue-700">{{ selectedReq.no_req }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-500 uppercase font-bold">Tanggal</p>
                        <p class="font-bold text-gray-800">{{ selectedReq.tgl }}</p>
                    </div>
                    <div class="col-span-2">
                        <p class="text-[10px] text-gray-500 uppercase font-bold">Keterangan</p>
                        <p class="font-bold text-gray-800">{{ selectedReq.ket }}</p>
                    </div>
                </div>

                <div class="border rounded overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-100 text-[10px] uppercase font-bold text-gray-500">
                            <tr>
                                <th class="p-2">Nama Barang</th>
                                <th class="p-2 text-center">Qty Minta</th>
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