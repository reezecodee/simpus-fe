<script setup lang="ts">
import { ref, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'

// --- ICONS ---
import {
    MagnifyingGlassIcon,
    PrinterIcon,
    EyeIcon,
    BeakerIcon,
    FilmIcon,
    DocumentArrowDownIcon,
    PhotoIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

const filterDateStart = ref(new Date().toISOString().split('T')[0])
const filterDateEnd = ref(new Date().toISOString().split('T')[0])
const filterUnit = ref('ALL')
const searchQuery = ref('')

const unitOptions = [
    { value: 'ALL', label: 'SEMUA UNIT' },
    { value: 'LAB', label: 'LABORATORIUM' },
    { value: 'RAD', label: 'RADIOLOGI' }
]

// Dummy Data Riwayat (Gabungan Lab & Rad)
const historyData = ref([
    {
        id: 'RES-LAB-001', tgl: '2025-12-27', unit: 'LAB',
        pasien: 'Tn. Budi Santoso', rm: 'RM-12345', dokter: 'dr. Asep Sp.PD',
        items: 'Darah Lengkap, Gula Darah',
        // Data Detail Lab
        results: [
            { param: 'Hemoglobin', hasil: '14.2', satuan: 'g/dL', rujukan: '13.0 - 17.0' },
            { param: 'Leukosit', hasil: '8.400', satuan: '/uL', rujukan: '4.000 - 10.000' },
            { param: 'Trombosit', hasil: '250.000', satuan: '/uL', rujukan: '150.000 - 450.000' },
            { param: 'GDS', hasil: '110', satuan: 'mg/dL', rujukan: '< 140' },
        ]
    },
    {
        id: 'RES-RAD-005', tgl: '2025-12-27', unit: 'RAD',
        pasien: 'An. Dede', rm: 'RM-55521', dokter: 'dr. Rina Sp.A',
        items: 'X-Ray Thorax AP',
        // Data Detail Rad
        expertise: 'Cor tidak membesar. Sinus dan diafragma normal. Pulmo: Tampak bercak infiltrat di lapang paru kanan bawah. Kesan: Bronchopneumonia Dextra.',
        images: ['thorax_ap.jpg']
    },
    {
        id: 'RES-LAB-002', tgl: '2025-12-26', unit: 'LAB',
        pasien: 'Ny. Siti', rm: 'RM-99999', dokter: 'dr. Obgyn',
        items: 'Urinalisa Lengkap',
        results: [
            { param: 'Warna', hasil: 'Kuning Jernih', satuan: '', rujukan: '-' },
            { param: 'pH', hasil: '6.0', satuan: '', rujukan: '4.5 - 8.0' },
            { param: 'Protein', hasil: 'Negatif', satuan: '', rujukan: 'Negatif' },
        ]
    }
])

const columns: TableColumn[] = [
    { key: 'id', label: 'No. Hasil', width: '130px' },
    { key: 'tgl', label: 'Tanggal', width: '100px', align: 'center' },
    { key: 'unit', label: 'Unit', align: 'center', width: '100px' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'items', label: 'Pemeriksaan' },
    { key: 'dokter', label: 'Dokter Pengirim' },
    { key: 'actions', label: '', align: 'right' },
]

// Modal State
const showDetailModal = ref(false)
const selectedItem = ref<any>(null)

// ==========================================
// 2. LOGIC
// ==========================================

const filteredData = computed(() => {
    let data = historyData.value

    // Filter Unit
    if (filterUnit.value !== 'ALL') {
        data = data.filter(d => d.unit === filterUnit.value)
    }

    // Filter Search
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        data = data.filter(d =>
            d.pasien.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q)
        )
    }
    return data
})

const handleView = (row: any) => {
    selectedItem.value = row
    showDetailModal.value = true
}

const handlePrint = () => {
    alert('Mencetak Hasil Pemeriksaan PDF...')
}

const handleExport = () => {
    alert('Export Data ke Excel...')
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Bank Data Hasil</h1>
                <p class="text-[12px] text-gray-500">Arsip riwayat pemeriksaan Laboratorium & Radiologi.</p>
            </div>
            <BaseButton variant="secondary" :icon="DocumentArrowDownIcon" @click="handleExport">Export Laporan
            </BaseButton>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            <BaseInput type="date" label="Dari Tanggal" v-model="filterDateStart" />
            <BaseInput type="date" label="Sampai Tanggal" v-model="filterDateEnd" />

            <BaseSelectSearch label="Filter Unit" v-model="filterUnit" :options="unitOptions" />

            <BaseInput label="Cari Pasien / No Hasil" v-model="searchQuery" placeholder="Cari data..."
                :icon="MagnifyingGlassIcon" />
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">

            <BaseDataTable :columns="columns" :data="filteredData" hide-search>

                <template #id="{ value }">
                    <span class="font-mono text-[11px] font-bold text-gray-700">{{ value }}</span>
                </template>

                <template #tgl="{ value }">
                    <span class="font-mono text-[11px] text-gray-600">{{ value }}</span>
                </template>

                <template #unit="{ value }">
                    <span v-if="value === 'LAB'"
                        class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-green-100 text-green-700 border border-green-200">
                        <BeakerIcon class="w-3 h-3" /> LAB
                    </span>
                    <span v-else
                        class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <FilmIcon class="w-3 h-3" /> RAD
                    </span>
                </template>

                <template #pasien="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.pasien }}</p>
                        <p class="text-[10px] text-gray-500">{{ row.rm }}</p>
                    </div>
                </template>

                <template #items="{ value }">
                    <span class="text-[11px] text-gray-600 font-medium">{{ value }}</span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end gap-2">
                        <button @click="handleView(row)"
                            class="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[10px] font-bold uppercase transition-colors">
                            <EyeIcon class="w-4 h-4" /> Lihat
                        </button>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showDetailModal" title="DETAIL HASIL PEMERIKSAAN" width="max-w-3xl">
            <div v-if="selectedItem" class="space-y-6">

                <div class="bg-gray-50 p-4 rounded border border-gray-200 grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <p class="text-gray-500 uppercase font-bold text-[10px]">No. Hasil</p>
                        <p class="font-mono font-bold text-sm text-gray-800">{{ selectedItem.id }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-500 uppercase font-bold text-[10px]">Tanggal Periksa</p>
                        <p class="font-bold text-gray-800">{{ selectedItem.tgl }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 uppercase font-bold text-[10px]">Pasien</p>
                        <p class="font-bold text-gray-800 uppercase">{{ selectedItem.pasien }}</p>
                        <p class="text-[10px] text-gray-500">{{ selectedItem.rm }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-500 uppercase font-bold text-[10px]">Dokter Pengirim</p>
                        <p class="font-bold text-blue-600">{{ selectedItem.dokter }}</p>
                    </div>
                </div>

                <div v-if="selectedItem.unit === 'LAB'">
                    <h4 class="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                        <BeakerIcon class="w-4 h-4" /> Hasil Laboratorium
                    </h4>
                    <div class="border rounded-lg overflow-hidden">
                        <table class="w-full text-sm text-left">
                            <thead
                                class="bg-green-50 text-xs font-bold text-green-800 uppercase border-b border-green-100">
                                <tr>
                                    <th class="p-3">Parameter</th>
                                    <th class="p-3 text-center">Hasil</th>
                                    <th class="p-3">Satuan</th>
                                    <th class="p-3 text-right">Nilai Rujukan</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(res, idx) in selectedItem.results" :key="idx" class="hover:bg-gray-50">
                                    <td class="p-3 font-bold text-gray-700">{{ res.param }}</td>
                                    <td class="p-3 text-center font-mono font-bold text-gray-900">{{ res.hasil }}</td>
                                    <td class="p-3 text-gray-500 text-xs">{{ res.satuan }}</td>
                                    <td class="p-3 text-right text-gray-400 text-xs italic">{{ res.rujukan }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="selectedItem.unit === 'RAD'" class="space-y-4">

                    <div>
                        <h4 class="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <DocumentArrowDownIcon class="w-4 h-4" /> Expertise Dokter
                        </h4>
                        <div
                            class="bg-white border border-gray-200 p-4 rounded-lg text-sm text-gray-800 leading-relaxed font-serif">
                            {{ selectedItem.expertise }}
                        </div>
                    </div>

                    <div>
                        <h4 class="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                            <PhotoIcon class="w-4 h-4" /> Lampiran Citra
                        </h4>
                        <div class="flex gap-4">
                            <div
                                class="w-32 h-32 bg-gray-900 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-gray-700 cursor-pointer hover:opacity-80 transition">
                                <FilmIcon class="w-8 h-8 mb-2" />
                                <span class="text-[10px]">Lihat Gambar</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 p-2 rounded text-[10px] text-gray-400 text-center italic">
                    Dokumen ini telah diverifikasi secara elektronik. Tanda tangan basah tidak diperlukan.
                </div>

            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showDetailModal = false">Tutup</BaseButton>
                    <BaseButton :icon="PrinterIcon" @click="handlePrint">Cetak Hasil Resmi</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>