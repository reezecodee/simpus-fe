<script setup lang="ts">
import { ref, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

// --- ICONS ---
import {
    ClipboardDocumentCheckIcon,
    BeakerIcon,
    CheckBadgeIcon,
    PrinterIcon,
    ClockIcon,
    UserIcon,
    ArrowRightCircleIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

// Tab State: 'WAITING' | 'PROCESSING' | 'READY'
const activeTab = ref('WAITING')

// Data Dummy Resep Masuk (E-Prescription)
const resepData = ref([
    {
        id: 'RX-2512-101',
        waktu: '08:15',
        pasien: 'Tn. Budi Santoso',
        rm: 'RM-00123',
        dokter: 'dr. Asep Sp.PD',
        poli: 'PENYAKIT DALAM',
        status: 'WAITING',
        is_cito: false,
        items: [
            { nama: 'Amlodipine 10mg', qty: 30, satuan: 'TAB', signa: '1x1 Pagi' },
            { nama: 'Simvastatin 20mg', qty: 30, satuan: 'TAB', signa: '1x1 Malam' }
        ]
    },
    {
        id: 'RX-2512-102',
        waktu: '08:20',
        pasien: 'An. Dede',
        rm: 'RM-00145',
        dokter: 'dr. Rina Sp.A',
        poli: 'IGD',
        status: 'WAITING',
        is_cito: true, // CITO
        items: [
            { nama: 'Paracetamol Syrup', qty: 1, satuan: 'BOTOL', signa: '3x1 Cth (Demam)' },
            { nama: 'Diazepam 2mg (Racik)', qty: 10, satuan: 'BKS', signa: '2x1 Jika Kejang' }
        ]
    },
    {
        id: 'RX-2512-099',
        waktu: '08:00',
        pasien: 'Ny. Siti',
        rm: 'RM-00111',
        dokter: 'dr. Gigi Budi',
        poli: 'GIGI',
        status: 'PROCESSING',
        is_cito: false,
        items: [
            { nama: 'Asam Mefenamat 500mg', qty: 15, satuan: 'TAB', signa: '3x1 Sesudah Makan' }
        ]
    },
    {
        id: 'RX-2512-098',
        waktu: '07:50',
        pasien: 'Tn. Joko',
        rm: 'RM-00222',
        dokter: 'dr. Umum',
        poli: 'UMUM',
        status: 'READY',
        is_cito: false,
        items: []
    }
])

const columns: TableColumn[] = [
    { key: 'id', label: 'No. Resep', width: '120px' },
    { key: 'waktu', label: 'Jam', width: '80px', align: 'center' },
    { key: 'pasien', label: 'Data Pasien' },
    { key: 'dokter', label: 'Dokter / Poli' },
    { key: 'status', label: 'Status', align: 'center', width: '120px' },
    { key: 'actions', label: '', align: 'right' },
]

// Modal State
const showProcessModal = ref(false)
const selectedResep = ref<any>(null)

// ==========================================
// 2. LOGIC & COMPUTED
// ==========================================

// Filter data sesuai Tab yang aktif
const filteredData = computed(() => {
    return resepData.value.filter(r => r.status === activeTab.value)
})

// Hitung jumlah untuk Badge di Tab
const countWaiting = computed(() => resepData.value.filter(r => r.status === 'WAITING').length)
const countProcessing = computed(() => resepData.value.filter(r => r.status === 'PROCESSING').length)
const countReady = computed(() => resepData.value.filter(r => r.status === 'READY').length)

// Actions
const openProcessModal = (row: any) => {
    selectedResep.value = row
    showProcessModal.value = true
}

const updateStatus = (newStatus: string) => {
    if (!selectedResep.value) return

    // Update status di data utama
    const target = resepData.value.find(r => r.id === selectedResep.value.id)
    if (target) {
        target.status = newStatus
    }

    showProcessModal.value = false
    alert(`Status Resep ${selectedResep.value.id} berhasil diupdate!`)
}

const printEtiket = (row: any) => {
    alert(`Mencetak Etiket untuk Resep: ${row.id}\nPrinter Label Farmasi...`)
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Antrian E-Resep</h1>
                <p class="text-[12px] text-gray-500">Kelola resep masuk, peracikan, dan pelabelan.</p>
            </div>
        </div>

        <div class="flex gap-2 border-b border-gray-200 pb-1">

            <button @click="activeTab = 'WAITING'"
                class="px-4 py-2 text-sm font-bold rounded-t-lg border-b-[3px] transition-all flex items-center gap-2"
                :class="activeTab === 'WAITING'
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                <ClipboardDocumentCheckIcon class="w-4 h-4" />
                Resep Baru
                <span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white border shadow-sm"
                    :class="activeTab === 'WAITING' ? 'text-red-600 border-red-200' : 'text-gray-500 border-gray-200'">
                    {{ countWaiting }}
                </span>
            </button>

            <button @click="activeTab = 'PROCESSING'"
                class="px-4 py-2 text-sm font-bold rounded-t-lg border-b-[3px] transition-all flex items-center gap-2"
                :class="activeTab === 'PROCESSING'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                <BeakerIcon class="w-4 h-4" />
                Sedang Diracik
                <span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white border shadow-sm"
                    :class="activeTab === 'PROCESSING' ? 'text-blue-600 border-blue-200' : 'text-gray-500 border-gray-200'">
                    {{ countProcessing }}
                </span>
            </button>

            <button @click="activeTab = 'READY'"
                class="px-4 py-2 text-sm font-bold rounded-t-lg border-b-[3px] transition-all flex items-center gap-2"
                :class="activeTab === 'READY'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                <CheckBadgeIcon class="w-4 h-4" />
                Siap Diserahkan
                <span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white border shadow-sm"
                    :class="activeTab === 'READY' ? 'text-green-600 border-green-200' : 'text-gray-500 border-gray-200'">
                    {{ countReady }}
                </span>
            </button>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">

            <BaseDataTable :columns="columns" :data="filteredData">

                <template #id="{ row }">
                    <div class="flex flex-col">
                        <span class="font-mono text-[11px] font-bold text-blue-600">{{ row.id }}</span>
                        <span v-if="row.is_cito"
                            class="mt-1 text-[9px] font-black bg-red-600 text-white px-1 rounded w-fit animate-pulse">CITO
                            / URGENT</span>
                    </div>
                </template>

                <template #waktu="{ value }">
                    <div class="flex items-center gap-1 justify-center text-gray-500">
                        <ClockIcon class="w-3 h-3" />
                        <span class="font-mono text-[11px] font-bold">{{ value }}</span>
                    </div>
                </template>

                <template #pasien="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.pasien }}</p>
                        <p class="text-[10px] text-gray-500 flex items-center gap-1">
                            <UserIcon class="w-3 h-3" /> {{ row.rm }}
                        </p>
                    </div>
                </template>

                <template #dokter="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-700">{{ row.dokter }}</p>
                        <span
                            class="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500 uppercase font-bold">
                            {{ row.poli }}
                        </span>
                    </div>
                </template>

                <template #status="{ value }">
                    <span v-if="value === 'WAITING'"
                        class="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 uppercase">MENUNGGU</span>
                    <span v-else-if="value === 'PROCESSING'"
                        class="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 uppercase">DIRACIK</span>
                    <span v-else
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">SIAP
                        SERAH</span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end gap-2">
                        <button v-if="row.status !== 'WAITING'" @click="printEtiket(row)"
                            class="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded border border-transparent hover:border-purple-200 transition-colors"
                            title="Cetak Etiket / Label Obat">
                            <PrinterIcon class="w-4 h-4" />
                        </button>

                        <BaseButton v-if="row.status === 'WAITING'" size="sm" @click="openProcessModal(row)">
                            Proses Resep
                        </BaseButton>

                        <BaseButton v-else-if="row.status === 'PROCESSING'" size="sm" variant="secondary"
                            class="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                            @click="openProcessModal(row)">
                            Selesaikan
                        </BaseButton>

                        <span v-else class="text-[10px] font-bold text-gray-400 italic px-2 py-1">Menunggu Pasien</span>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showProcessModal" title="PROSES RESEP & PERACIKAN" width="max-w-3xl">
            <div v-if="selectedResep" class="space-y-6">

                <div class="bg-gray-50 p-4 rounded border border-gray-200 flex justify-between items-start">
                    <div>
                        <p class="text-[10px] text-gray-500 uppercase font-bold">Pasien</p>
                        <p class="font-bold text-lg text-gray-800">{{ selectedResep.pasien }}</p>
                        <p class="text-xs text-gray-500">{{ selectedResep.rm }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-gray-500 uppercase font-bold">Dokter Peresep</p>
                        <p class="font-bold text-gray-800">{{ selectedResep.dokter }}</p>
                        <p class="text-xs text-blue-600 font-bold uppercase">{{ selectedResep.poli }}</p>
                    </div>
                </div>

                <div>
                    <h4 class="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2">Rincian Obat & Dosis
                    </h4>
                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-gray-100 text-[10px] font-black text-gray-500 uppercase">
                                <tr>
                                    <th class="p-3">Nama Obat</th>
                                    <th class="p-3 text-center">Jml</th>
                                    <th class="p-3">Aturan Pakai (Signa)</th>
                                    <th class="p-3 text-center">Cek</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(item, idx) in selectedResep.items" :key="idx" class="hover:bg-gray-50">
                                    <td class="p-3 font-bold text-gray-700">{{ item.nama }}</td>
                                    <td class="p-3 text-center font-mono">
                                        {{ item.qty }} <span class="text-[10px] text-gray-400">{{ item.satuan }}</span>
                                    </td>
                                    <td class="p-3 italic text-blue-600 font-medium">{{ item.signa }}</td>
                                    <td class="p-3 text-center">
                                        <input type="checkbox"
                                            class="rounded text-green-600 focus:ring-green-500 w-4 h-4 cursor-pointer" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <BaseAlert v-if="selectedResep.is_cito" variant="danger" title="RESEP CITO / URGENT">
                    Harap dahulukan peracikan resep ini karena kondisi pasien darurat.
                </BaseAlert>

            </div>

            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showProcessModal = false">Tutup</BaseButton>

                    <div v-if="selectedResep">
                        <BaseButton v-if="selectedResep.status === 'WAITING'" @click="updateStatus('PROCESSING')"
                            :icon="BeakerIcon" class="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white">
                            Mulai Racik Obat
                        </BaseButton>

                        <BaseButton v-if="selectedResep.status === 'PROCESSING'" @click="updateStatus('READY')"
                            :icon="CheckBadgeIcon" variant="primary">
                            Selesai & Siap Serah
                        </BaseButton>
                    </div>
                </div>
            </template>
        </BaseModal>

    </div>
</template>