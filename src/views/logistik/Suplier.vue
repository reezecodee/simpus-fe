<script setup lang="ts">
import { ref, reactive } from 'vue'

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
    TruckIcon,
    PhoneIcon,
    MapPinIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA & STATE
// ==========================================
interface Suplier {
    id: number
    kode: string
    nama_pt: string
    alamat: string
    kontak_person: string
    telepon: string
    tempo_hari: number // 0 = COD/Cash
}

const showModal = ref(false)
const isEdit = ref(false)
const searchQuery = ref('')

const columns: TableColumn[] = [
    { key: 'kode', label: 'Kode', width: '100px' },
    { key: 'nama_pt', label: 'Nama Perusahaan (PBF)' },
    { key: 'kontak_person', label: 'Sales / CP' },
    { key: 'telepon', label: 'Kontak', width: '150px' },
    { key: 'tempo_hari', label: 'Term (TOP)', align: 'center', width: '120px' },
    { key: 'actions', label: '', align: 'right' },
]

const suplierData = ref<Suplier[]>([
    { id: 1, kode: 'SUP-001', nama_pt: 'PT. KIMIA FARMA TRADING', alamat: 'Jl. Soekarno Hatta No. 123, Bandung', kontak_person: 'Bpk. Herman', telepon: '081234567890', tempo_hari: 30 },
    { id: 2, kode: 'SUP-002', nama_pt: 'PT. ANUGRAH ARGON MEDICA', alamat: 'Jl. Raya Cibiru No. 55', kontak_person: 'Ibu Susi', telepon: '085678901234', tempo_hari: 14 },
    { id: 3, kode: 'SUP-003', nama_pt: 'PT. SUMBER SEHAT', alamat: 'Jl. ABC Pasar Baru', kontak_person: 'Ko Aing', telepon: '08111222333', tempo_hari: 0 }, // Cash
])

const form = reactive({
    id: undefined as number | undefined,
    kode: '',
    nama_pt: '',
    alamat: '',
    kontak_person: '',
    telepon: '',
    tempo_hari: 0
})

// ==========================================
// 2. LOGIC
// ==========================================
const openAddModal = () => {
    isEdit.value = false
    form.id = undefined
    form.kode = `SUP-${String(suplierData.value.length + 1).padStart(3, '0')}` // Auto Gen Simple
    form.nama_pt = ''; form.alamat = ''; form.kontak_person = ''; form.telepon = ''
    form.tempo_hari = 0
    showModal.value = true
}

const openEditModal = (row: Suplier) => {
    isEdit.value = true
    Object.assign(form, row)
    showModal.value = true
}

const handleSave = () => {
    if (isEdit.value && form.id !== undefined) {
        const index = suplierData.value.findIndex(i => i.id === form.id)
        if (index !== -1) {
            // EDIT MODE
            suplierData.value[index] = {
                ...suplierData.value[index],
                ...form,
                id: form.id, // Pastikan id diambil sebagai number
                nama_pt: form.nama_pt.toUpperCase()
            }
        }
    } else {
        // CREATE MODE
        // Kita pakai 'as Suplier' agar TS tidak protes soal 'id' yang mungkin undefined dari 'form'
        const newItem: Suplier = {
            ...form,
            id: Date.now(), // Ini akan menimpa id 'undefined' dari form
            nama_pt: form.nama_pt.toUpperCase()
        } as Suplier

        suplierData.value.unshift(newItem)
    }
    showModal.value = false
}

const handleDelete = (id: number) => {
    if (confirm('Hapus data suplier ini?')) {
        suplierData.value = suplierData.value.filter(i => i.id !== id)
    }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Master Suplier (Vendor)</h1>
                <p class="text-[12px] text-gray-500">Database Distributor Farmasi (PBF).</p>
            </div>
            <BaseButton :icon="PlusIcon" @click="openAddModal">Suplier Baru</BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-blue-600">
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase">Total Vendor Aktif</p>
                    <p class="text-xl font-black text-gray-900 font-mono">{{ suplierData.length }} <span
                            class="text-sm text-gray-400 font-bold">PT/CV</span></p>
                </div>
                <TruckIcon class="w-8 h-8 text-blue-100" />
            </div>
            <div
                class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px] border-t-orange-500">
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase">Vendor Kredit (Tempo)</p>
                    <p class="text-xl font-black text-orange-600 font-mono">{{suplierData.filter(s => s.tempo_hari >
                        0).length}}</p>
                </div>
                <ChatBubbleLeftRightIcon class="w-8 h-8 text-orange-100" />
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-6 px-2">
                <h3 class="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                    Daftar Rekanan PBF
                </h3>
                <div class="w-64">
                    <BaseInput v-model="searchQuery" :icon="MagnifyingGlassIcon" placeholder="Cari Nama PT / Sales..."
                        size="sm" />
                </div>
            </div>

            <BaseDataTable :columns="columns" :data="suplierData" hide-search>

                <template #kode="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{{
                        value }}</span>
                </template>

                <template #nama_pt="{ value, row }">
                    <div class="flex flex-col">
                        <span class="text-[11px] font-bold text-gray-800 uppercase tracking-tight">{{ value }}</span>
                        <span class="text-[9px] text-gray-400 flex items-center gap-1">
                            <MapPinIcon class="w-3 h-3" /> {{ row.alamat }}
                        </span>
                    </div>
                </template>

                <template #kontak_person="{ value }">
                    <span class="text-[11px] font-bold text-gray-600 uppercase">{{ value }}</span>
                </template>

                <template #telepon="{ value }">
                    <a :href="'https://wa.me/62' + value.replace(/^0/, '')" target="_blank"
                        class="flex items-center gap-1 text-[11px] font-mono font-bold text-green-600 hover:underline">
                        <PhoneIcon class="w-3 h-3" /> {{ value }}
                    </a>
                </template>

                <template #tempo_hari="{ value }">
                    <span v-if="value > 0"
                        class="font-mono text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
                        {{ value }} HARI
                    </span>
                    <span v-else
                        class="font-mono text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">
                        CASH / COD
                    </span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end px-2">
                        <BaseActionMenu>
                            <button @click="openEditModal(row)"
                                class="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <PencilSquareIcon class="w-4 h-4 text-blue-500" /> Edit Profil
                            </button>
                            <div class="border-t border-gray-100"></div>
                            <button @click="handleDelete(row.id)"
                                class="w-full text-left px-4 py-2 text-[11px] text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <TrashIcon class="w-4 h-4" /> Hapus
                            </button>
                        </BaseActionMenu>
                    </div>
                </template>
            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" :title="isEdit ? 'EDIT SUPLIER' : 'TAMBAH SUPLIER BARU'" width="max-w-lg">
            <div class="space-y-4">

                <BaseInput label="Kode Vendor" v-model="form.kode" disabled class="bg-gray-50" />

                <BaseInput label="Nama Perusahaan (PT/CV/PBF)" v-model="form.nama_pt"
                    placeholder="Contoh: PT. KIMIA FARMA" />

                <BaseInput label="Alamat Lengkap" v-model="form.alamat" placeholder="Alamat gudang/kantor suplier" />

                <div class="grid grid-cols-2 gap-4">
                    <BaseInput label="Nama Sales / CP" v-model="form.kontak_person" placeholder="Nama sales lapangan" />
                    <BaseInput label="No. Telepon / WA" v-model="form.telepon" type="number" placeholder="08..." />
                </div>

                <div class="bg-gray-50 p-4 rounded border border-gray-200">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Ketentuan Pembayaran
                        (TOP)</p>
                    <div class="flex gap-4 items-center">
                        <div class="flex items-center gap-2">
                            <input type="radio" :value="0" v-model="form.tempo_hari" name="top" id="top_cash"
                                class="text-green-600 focus:ring-green-500">
                            <label for="top_cash" class="text-[11px] font-bold uppercase cursor-pointer">Cash /
                                COD</label>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="radio" :value="30" v-model="form.tempo_hari" name="top" id="top_30"
                                class="text-green-600 focus:ring-green-500">
                            <label for="top_30" class="text-[11px] font-bold uppercase cursor-pointer">30 Hari</label>
                        </div>
                        <div class="flex items-center gap-2 flex-1">
                            <BaseInput type="number" v-model="form.tempo_hari" placeholder="Manual" size="sm"
                                class="w-full" />
                            <span class="text-[10px] font-bold text-gray-400">Hari</span>
                        </div>
                    </div>
                </div>

            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" @click="handleSave" :disabled="!form.nama_pt">Simpan Vendor
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>