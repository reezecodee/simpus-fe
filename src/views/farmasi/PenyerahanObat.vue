<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

// --- ICONS ---
import {
    MagnifyingGlassIcon,
    CheckBadgeIcon,
    UserGroupIcon,
    ClockIcon,
    ShoppingBagIcon,
    InformationCircleIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

const activeTab = ref<'SIAP' | 'SELESAI'>('SIAP')
const searchQuery = ref('')

// Data Dummy (Resep yang statusnya sudah 'READY' dari halaman Antrian)
const penyerahanData = ref([
    {
        id: 'RX-2512-098',
        waktu_siap: '09:15',
        pasien: 'Tn. Joko Susilo',
        rm: 'RM-00222',
        tgl_lahir: '12-05-1980', // Penting untuk verifikasi
        dokter: 'dr. Umum',
        poli: 'UMUM',
        status: 'READY',
        items: [
            { nama: 'Amoxicillin 500mg', jumlah: '10 Tab', aturan: '3x1 Habiskan' },
            { nama: 'Paracetamol 500mg', jumlah: '10 Tab', aturan: '3x1 Jika Demam' }
        ]
    },
    {
        id: 'RX-2512-102',
        waktu_siap: '09:30',
        pasien: 'An. Dede',
        rm: 'RM-00145',
        tgl_lahir: '20-10-2018',
        dokter: 'dr. Rina Sp.A',
        poli: 'IGD',
        status: 'READY',
        items: [
            { nama: 'Puyer Batuk Pilek', jumlah: '10 Bks', aturan: '3x1 Bungkus' },
            { nama: 'Vitamin C Syrup', jumlah: '1 Botol', aturan: '1x1 Sendok Teh' }
        ]
    },
    // Data Riwayat (Sudah diambil)
    {
        id: 'RX-2512-001',
        waktu_siap: '08:00',
        pasien: 'Ny. Ani',
        rm: 'RM-00999',
        tgl_lahir: '01-01-1990',
        dokter: 'dr. Gigi',
        poli: 'GIGI',
        status: 'DONE',
        items: []
    }
])

const columns: TableColumn[] = [
    { key: 'id', label: 'No. Resep', width: '120px' },
    { key: 'pasien', label: 'Identitas Pasien' },
    { key: 'poli', label: 'Asal Poli' },
    { key: 'waktu_siap', label: 'Jam Siap', align: 'center', width: '100px' },
    { key: 'status', label: 'Status', align: 'center', width: '120px' },
    { key: 'actions', label: '', align: 'right' },
]

// Modal State
const showModal = ref(false)
const selectedItem = ref<any>(null)

// Checklist PIO (Pelayanan Informasi Obat)
const pioChecklist = reactive({
    identitas: false, // Cek Nama & Tgl Lahir
    obat: false,      // Cek Fisik Obat
    dosis: false,     // Jelaskan Aturan Pakai
    efek_samping: false // Jelaskan Efek Samping (ngantuk dll)
})

// ==========================================
// 2. LOGIC
// ==========================================

const filteredData = computed(() => {
    let data = penyerahanData.value

    // Filter Tab
    if (activeTab.value === 'SIAP') {
        data = data.filter(d => d.status === 'READY')
    } else {
        data = data.filter(d => d.status === 'DONE')
    }

    // Filter Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        data = data.filter(d =>
            d.pasien.toLowerCase().includes(query) ||
            d.id.toLowerCase().includes(query)
        )
    }

    return data
})

const handleSerahkan = (row: any) => {
    selectedItem.value = row
    // Reset Checklist
    pioChecklist.identitas = false
    pioChecklist.obat = false
    pioChecklist.dosis = false
    pioChecklist.efek_samping = false

    showModal.value = true
}

const confirmSerahkan = () => {
    // Validasi PIO (Minimal Identitas & Dosis wajib dicek)
    if (!pioChecklist.identitas || !pioChecklist.dosis) {
        alert('Mohon lakukan Verifikasi Identitas dan Penjelasan Dosis terlebih dahulu!')
        return
    }

    // Update Status
    const target = penyerahanData.value.find(d => d.id === selectedItem.value.id)
    if (target) {
        target.status = 'DONE'
    }

    showModal.value = false
    // Bisa tambahkan toast notifikasi sukses disini
}

const formatTgl = (tgl: string) => tgl // Placeholder format
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Penyerahan Obat</h1>
                <p class="text-[12px] text-gray-500">Validasi akhir, edukasi pasien (PIO), dan serah terima.</p>
            </div>
        </div>

        <div
            class="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-gray-200 pb-4">

            <div class="flex bg-gray-100 p-1 rounded-lg">
                <button @click="activeTab = 'SIAP'"
                    class="px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 cursor-pointer"
                    :class="activeTab === 'SIAP' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                    <ShoppingBagIcon class="w-4 h-4" />
                    Siap Diambil ({{penyerahanData.filter(d => d.status === 'READY').length}})
                </button>
                <button @click="activeTab = 'SELESAI'"
                    class="px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 cursor-pointer"
                    :class="activeTab === 'SELESAI' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                    <CheckBadgeIcon class="w-4 h-4" />
                    Riwayat Selesai
                </button>
            </div>

            <div class="w-full md:w-64">
                <BaseInput v-model="searchQuery" :icon="MagnifyingGlassIcon" placeholder="Cari Pasien / No Resep..." />
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 border-t-green-600 shadow-sm overflow-hidden p-4 border-t-[4px]">

            <BaseDataTable :columns="columns" :data="filteredData">

                <template #id="{ value }">
                    <span class="font-mono text-[11px] font-bold text-blue-600">{{ value }}</span>
                </template>

                <template #pasien="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.pasien }}</p>
                        <p class="text-[10px] text-gray-500">RM: {{ row.rm }} | Lahir: {{ row.tgl_lahir }}</p>
                    </div>
                </template>

                <template #poli="{ row }">
                    <div>
                        <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{{ row.poli
                        }}</span>
                        <p class="text-[9px] text-gray-400 mt-0.5">{{ row.dokter }}</p>
                    </div>
                </template>

                <template #waktu_siap="{ value }">
                    <div class="flex items-center justify-center gap-1 text-gray-500">
                        <ClockIcon class="w-3 h-3" />
                        <span class="font-mono text-[11px] font-bold">{{ value }}</span>
                    </div>
                </template>

                <template #status="{ value }">
                    <span v-if="value === 'READY'"
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase animate-pulse">SIAP
                        DIAMBIL</span>
                    <span v-else
                        class="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 uppercase">SUDAH
                        DIAMBIL</span>
                </template>

                <template #actions="{ row }">
                    <div class="text-right">
                        <BaseButton v-if="row.status === 'READY'" size="sm" :icon="CheckBadgeIcon"
                            @click="handleSerahkan(row)">
                            Serahkan
                        </BaseButton>
                        <span v-else class="text-[10px] text-gray-400 font-bold italic pr-2">Selesai</span>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" title="VERIFIKASI & PENYERAHAN OBAT" width="max-w-2xl">
            <div v-if="selectedItem" class="space-y-6">

                <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-4 items-center">
                    <div class="bg-blue-200 p-3 rounded-full text-blue-700">
                        <UserGroupIcon class="w-8 h-8" />
                    </div>
                    <div class="flex-1">
                        <p class="text-[10px] text-gray-500 uppercase font-bold">Data Pasien (Cocokkan dengan KTP/Kartu
                            Berobat)
                        </p>
                        <h3 class="text-xl font-bold text-gray-900">{{ selectedItem.pasien }}</h3>
                        <div class="flex gap-4 mt-1 text-sm text-gray-700">
                            <span><span class="font-bold">RM:</span> {{ selectedItem.rm }}</span>
                            <span><span class="font-bold">Tgl Lahir:</span> {{ selectedItem.tgl_lahir }}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 class="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">Item Obat yang
                        Diserahkan
                    </h4>
                    <ul class="border border-gray-200 rounded-lg divide-y divide-gray-100">
                        <li v-for="(item, idx) in selectedItem.items" :key="idx"
                            class="p-3 flex justify-between items-center bg-white">
                            <div>
                                <p class="font-bold text-sm text-gray-800">{{ item.nama }}</p>
                                <p class="text-xs text-gray-500">Jml: {{ item.jumlah }}</p>
                            </div>
                            <div class="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-700">
                                {{ item.aturan }}
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4
                        class="text-[11px] font-black text-yellow-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ClipboardDocumentCheckIcon class="w-4 h-4" /> Checklist Edukasi (PIO)
                    </h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label
                            class="flex items-center gap-3 p-3 bg-white border border-yellow-100 rounded cursor-pointer hover:bg-yellow-50 transition-colors">
                            <input type="checkbox" v-model="pioChecklist.identitas"
                                class="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                            <span class="text-xs font-bold text-gray-700">1. Identitas Pasien Cocok</span>
                        </label>

                        <label
                            class="flex items-center gap-3 p-3 bg-white border border-yellow-100 rounded cursor-pointer hover:bg-yellow-50 transition-colors">
                            <input type="checkbox" v-model="pioChecklist.obat"
                                class="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                            <span class="text-xs font-bold text-gray-700">2. Fisik Obat Sesuai Resep</span>
                        </label>

                        <label
                            class="flex items-center gap-3 p-3 bg-white border border-yellow-100 rounded cursor-pointer hover:bg-yellow-50 transition-colors">
                            <input type="checkbox" v-model="pioChecklist.dosis"
                                class="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                            <span class="text-xs font-bold text-gray-700">3. Aturan Pakai Dijelaskan</span>
                        </label>

                        <label
                            class="flex items-center gap-3 p-3 bg-white border border-yellow-100 rounded cursor-pointer hover:bg-yellow-50 transition-colors">
                            <input type="checkbox" v-model="pioChecklist.efek_samping"
                                class="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                            <span class="text-xs font-bold text-gray-700">4. Efek Samping Dijelaskan</span>
                        </label>
                    </div>
                </div>

            </div>

            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton variant="primary" :icon="CheckBadgeIcon" @click="confirmSerahkan"
                        :disabled="!pioChecklist.identitas || !pioChecklist.dosis">
                        Konfirmasi Penyerahan
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>