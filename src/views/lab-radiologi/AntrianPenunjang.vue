<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue' // Pastikan component ini ada

// --- ICONS ---
import {
    BeakerIcon,
    FilmIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    PlayCircleIcon,
    DocumentTextIcon,
    PrinterIcon,
    CloudArrowUpIcon,
    ExclamationCircleIcon,
    XMarkIcon,
    PhotoIcon,
    DocumentIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE & TYPES
// ==========================================

// State Utama
const activeUnit = ref<'LAB' | 'RAD'>('LAB')
const searchQuery = ref('')
const filterStatus = ref('ALL')

// Data Dummy Antrian
const worklistData = ref([
    {
        id: 'ORD-LAB-001', waktu: '08:00', unit: 'LAB', is_cito: true, status: 'WAITING',
        pasien: 'Tn. Darurat', rm: 'RM-999', asal: 'IGD', dokter: 'dr. Jaga',
        items: ['Darah Lengkap', 'Gula Darah Sewaktu', 'Elektrolit']
    },
    {
        id: 'ORD-LAB-002', waktu: '08:15', unit: 'LAB', is_cito: false, status: 'PROCESSING',
        pasien: 'Ny. Siti', rm: 'RM-123', asal: 'Poli Dalam', dokter: 'dr. Asep Sp.PD',
        items: ['Kolesterol Total', 'Asam Urat', 'Trigliserida']
    },
    {
        id: 'ORD-LAB-003', waktu: '08:30', unit: 'LAB', is_cito: false, status: 'DONE',
        pasien: 'An. Dede', rm: 'RM-456', asal: 'Rawat Inap', dokter: 'dr. Rina Sp.A',
        items: ['Widal', 'Dengue Blot']
    },
    {
        id: 'ORD-RAD-001', waktu: '08:10', unit: 'RAD', is_cito: true, status: 'WAITING',
        pasien: 'Tn. Kecelakaan', rm: 'RM-888', asal: 'IGD', dokter: 'dr. Bedah',
        items: ['X-Ray Thorax AP', 'X-Ray Cruris Dextra']
    },
    {
        id: 'ORD-RAD-002', waktu: '09:00', unit: 'RAD', is_cito: false, status: 'PROCESSING',
        pasien: 'Nn. Gigi', rm: 'RM-777', asal: 'Poli Gigi', dokter: 'drg. Budi',
        items: ['Panoramic Gigi']
    },
])

const columns: TableColumn[] = [
    { key: 'id', label: 'No. Order', width: '130px' },
    { key: 'waktu', label: 'Jam', width: '80px', align: 'center' },
    { key: 'pasien', label: 'Identitas Pasien' },
    { key: 'asal', label: 'Asal / Dokter' },
    { key: 'items', label: 'Permintaan Pemeriksaan' },
    { key: 'status', label: 'Status', align: 'center', width: '120px' },
    { key: 'actions', label: '', align: 'right' },
]

// --- MODAL STATES ---
const showLabModal = ref(false)
const showRadModal = ref(false)
const showConfirmModal = ref(false)
const selectedOrder = ref<any>(null)

// Form Input Lab
const labForm = ref([
    { param: 'Hemoglobin', hasil: '', satuan: 'g/dL', rujukan: '12.0 - 16.0' },
    { param: 'Leukosit', hasil: '', satuan: '/uL', rujukan: '4.000 - 10.000' },
    { param: 'Trombosit', hasil: '', satuan: '/uL', rujukan: '150.000 - 450.000' },
])

// Form Input Rad (Updated dengan Previews)
interface PreviewFile {
    file: File;
    url: string;
    isImage: boolean;
}

const radForm = reactive({
    expertise: '',
    files: [] as File[],
    previews: [] as PreviewFile[]
})

// ==========================================
// 2. LOGIC
// ==========================================

const filteredData = computed(() => {
    let data = worklistData.value.filter(d => d.unit === activeUnit.value)

    if (filterStatus.value !== 'ALL') {
        data = data.filter(d => d.status === filterStatus.value)
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        data = data.filter(d =>
            d.pasien.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q)
        )
    }
    return data
})

// --- ACTIONS ---

const handleAction = (row: any) => {
    selectedOrder.value = row

    if (row.status === 'WAITING') {
        showConfirmModal.value = true
    }
    else if (row.status === 'PROCESSING') {
        if (activeUnit.value === 'LAB') {
            labForm.value.forEach(f => f.hasil = '')
            showLabModal.value = true
        } else {
            radForm.expertise = ''
            radForm.files = []
            radForm.previews = [] // Reset preview
            showRadModal.value = true
        }
    }
    else {
        alert('Hasil sudah diverifikasi. Silakan cetak di menu Riwayat.')
    }
}

const confirmStart = () => {
    const target = worklistData.value.find(d => d.id === selectedOrder.value.id)
    if (target) target.status = 'PROCESSING'
    showConfirmModal.value = false
}

const saveLabResult = () => {
    // Validasi Safe Navigation (?.)
    if (!labForm.value[0]?.hasil) return alert('Mohon isi hasil pemeriksaan!')
    if (!selectedOrder.value) return

    const target = worklistData.value.find(d => d.id === selectedOrder.value?.id)
    if (target) target.status = 'DONE'

    alert('Hasil Lab Berhasil Disimpan & Terkirim ke Dokter!')
    showLabModal.value = false
}

const saveRadResult = () => {
    if (!radForm.expertise) return alert('Mohon isi bacaan/expertise dokter!')

    const target = worklistData.value.find(d => d.id === selectedOrder.value.id)
    if (target) target.status = 'DONE'

    alert('Expertise Radiologi & Gambar Berhasil Disimpan!')
    showRadModal.value = false
}

// --- LOGIC UPLOAD & PREVIEW ---
const handleFileUpload = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (!input.files) return

    const newFiles = Array.from(input.files)

    newFiles.forEach(file => {
        radForm.files.push(file)
        // Generate Preview URL
        radForm.previews.push({
            file: file,
            url: URL.createObjectURL(file),
            isImage: file.type.startsWith('image/')
        })
    })
}

const removeFile = (index: number) => {
    radForm.files.splice(index, 1)
    radForm.previews.splice(index, 1)
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col md:flex-row justify-between items-end gap-4 px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Worklist Pemeriksaan</h1>
                <p class="text-[12px] text-gray-500">Antrian order, penerimaan sampel, dan input hasil.</p>
            </div>

            <div class="flex bg-gray-100 p-1 rounded-lg">
                <button @click="activeUnit = 'LAB'"
                    class="px-6 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2"
                    :class="activeUnit === 'LAB' ? 'bg-white text-green-700 shadow-sm ring-1 ring-green-200' : 'text-gray-500 hover:text-gray-700'">
                    <BeakerIcon class="w-5 h-5" /> LABORATORIUM
                </button>
                <button @click="activeUnit = 'RAD'"
                    class="px-6 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2"
                    :class="activeUnit === 'RAD' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200' : 'text-gray-500 hover:text-gray-700'">
                    <FilmIcon class="w-5 h-5" /> RADIOLOGI
                </button>
            </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseInput v-model="searchQuery" label="Cari Pasien / No Order" placeholder="Ketik nama pasien..."
                :icon="MagnifyingGlassIcon" />

            <BaseSelectSearch label="Filter Status" v-model="filterStatus" :options="[
                { value: 'ALL', label: 'Semua Status' },
                { value: 'WAITING', label: 'Menunggu (Pending)' },
                { value: 'PROCESSING', label: 'Sedang Diproses' },
                { value: 'DONE', label: 'Selesai (Verified)' }
            ]" />

            <div class="flex items-end pb-2">
                <div
                    class="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded border border-red-200 text-xs font-bold w-full">
                    <ExclamationCircleIcon class="w-5 h-5 animate-pulse" />
                    <span>Prioritaskan Pasien dengan Label CITO!</span>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px]"
            :class="activeUnit === 'LAB' ? 'border-t-green-600' : 'border-t-emerald-600'">

            <BaseDataTable :columns="columns" :data="filteredData" hide-search>

                <template #id="{ row }">
                    <div class="flex flex-col">
                        <span class="font-mono text-[11px] font-bold text-gray-700">{{ row.id }}</span>
                        <span v-if="row.is_cito"
                            class="mt-1 w-fit bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">
                            CITO / URGENT
                        </span>
                    </div>
                </template>

                <template #waktu="{ value }">
                    <div class="flex items-center gap-1 justify-center text-gray-500">
                        <span class="font-mono text-[11px] font-bold">{{ value }}</span>
                    </div>
                </template>

                <template #pasien="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.pasien }}</p>
                        <p class="text-[10px] text-gray-500">{{ row.rm }}</p>
                    </div>
                </template>

                <template #asal="{ row }">
                    <div>
                        <span class="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold">{{ row.asal
                        }}</span>
                        <p class="text-[10px] text-gray-500 mt-0.5">{{ row.dokter }}</p>
                    </div>
                </template>

                <template #items="{ row }">
                    <div class="flex flex-wrap gap-1">
                        <span v-for="(item, i) in row.items" :key="i"
                            class="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded">
                            {{ item }}
                        </span>
                    </div>
                </template>

                <template #status="{ value }">
                    <span v-if="value === 'WAITING'"
                        class="text-[9px] font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 uppercase">MENUNGGU</span>
                    <span v-else-if="value === 'PROCESSING'"
                        class="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 uppercase animate-pulse">DIPROSES</span>
                    <span v-else
                        class="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase">SELESAI</span>
                </template>

                <template #actions="{ row }">
                    <div class="flex justify-end">
                        <BaseButton v-if="row.status === 'WAITING'" size="sm"
                            :icon="activeUnit === 'LAB' ? BeakerIcon : PlayCircleIcon" @click="handleAction(row)">
                            {{ activeUnit === 'LAB' ? 'Terima Sampel' : 'Mulai Foto' }}
                        </BaseButton>

                        <BaseButton v-else-if="row.status === 'PROCESSING'" size="sm" variant="secondary"
                            class="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100" :icon="DocumentTextIcon"
                            @click="handleAction(row)">
                            Input Hasil
                        </BaseButton>

                        <BaseButton v-else size="sm" variant="secondary" :icon="PrinterIcon" @click="handleAction(row)">
                            Cetak
                        </BaseButton>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showConfirmModal" title="KONFIRMASI TINDAKAN" width="max-w-md">
            <div class="text-center py-4" v-if="selectedOrder">
                <div class="bg-yellow-50 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <component :is="activeUnit === 'LAB' ? BeakerIcon : FilmIcon" class="w-8 h-8 text-yellow-600" />
                </div>
                <h3 class="font-bold text-gray-800 text-lg">
                    {{ activeUnit === 'LAB' ? 'Terima Sampel Laboratorium?' : 'Mulai Pemeriksaan Radiologi?' }}
                </h3>
                <p class="text-sm text-gray-500 mt-2">
                    Pastikan identitas pasien <b>{{ selectedOrder.pasien }}</b> sudah sesuai dengan label {{ activeUnit
                        ===
                        'LAB' ? 'sampel darah' : 'permintaan foto' }}.
                </p>
            </div>
            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showConfirmModal = false">Batal</BaseButton>
                    <BaseButton @click="confirmStart">Konfirmasi & Mulai</BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showLabModal" title="INPUT HASIL LABORATORIUM" width="max-w-3xl">
            <div v-if="selectedOrder" class="space-y-6">

                <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Identitas Pasien</p>
                        <p class="text-lg font-bold text-gray-800">{{ selectedOrder.pasien }}</p>
                        <p class="text-xs text-gray-500">{{ selectedOrder.rm }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dokter Pengirim</p>
                        <p class="text-sm font-bold text-blue-600">{{ selectedOrder.dokter }}</p>
                        <p class="text-xs text-gray-500">{{ selectedOrder.asal }}</p>
                    </div>
                </div>

                <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-wider">
                                    Parameter</th>
                                <th
                                    class="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right w-48">
                                    Hasil</th>
                                <th class="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-wider">Satuan
                                </th>
                                <th
                                    class="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">
                                    Nilai
                                    Rujukan</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 bg-white">
                            <tr v-for="(item, idx) in labForm" :key="idx"
                                class="group hover:bg-gray-50 transition-colors">
                                <td class="py-3 px-4 font-bold text-gray-700 align-middle">
                                    {{ item.param }}
                                </td>

                                <td class="py-2 px-4 align-middle">
                                    <BaseInput v-model="item.hasil" placeholder="0" inputmode="decimal"
                                        class="font-mono font-bold text-right !mb-0" />
                                </td>

                                <td class="py-3 px-4 text-gray-500 text-xs font-medium align-middle">
                                    {{ item.satuan }}
                                </td>

                                <td
                                    class="py-3 px-4 text-gray-400 text-xs italic text-right align-middle group-hover:text-gray-600">
                                    {{ item.rujukan }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex gap-3 bg-yellow-50 border border-yellow-200 p-3 rounded-lg items-start">
                    <ExclamationCircleIcon class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h5 class="text-xs font-bold text-yellow-800 uppercase">Perhatian</h5>
                        <p class="text-xs text-yellow-700 mt-1">
                            Sistem otomatis mendeteksi Nilai Kritis. Jika muncul peringatan, wajib konfirmasi Lapor DPJP
                            setelah
                            menyimpan data.
                        </p>
                    </div>
                </div>

            </div>
            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showLabModal = false">Batal</BaseButton>
                    <BaseButton :icon="CheckCircleIcon" @click="saveLabResult">Simpan & Verifikasi</BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showRadModal" title="HASIL EXPERTISE RADIOLOGI" width="max-w-4xl">
            <div v-if="selectedOrder" class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div class="space-y-3">
                    <h4 class="text-xs font-bold text-gray-500 uppercase">1. Upload Citra (DICOM/JPG)</h4>

                    <div
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                        <input type="file" multiple class="absolute inset-0 opacity-0 cursor-pointer"
                            @change="handleFileUpload" accept="image/*,.dcm" />
                        <CloudArrowUpIcon class="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p class="text-xs text-gray-500 font-bold">Klik atau Tarik file ke sini</p>
                        <p class="text-[10px] text-gray-400">Maksimal 50MB per file</p>
                    </div>

                    <div v-if="radForm.previews.length > 0"
                        class="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto p-1">
                        <div v-for="(prev, i) in radForm.previews" :key="i"
                            class="relative group border rounded-lg overflow-hidden bg-gray-100">
                            <img v-if="prev.isImage" :src="prev.url" class="w-full h-24 object-cover" />
                            <div v-else class="w-full h-24 flex flex-col items-center justify-center text-gray-400">
                                <DocumentIcon class="w-8 h-8" />
                                <span class="text-[9px] mt-1">{{ prev.file.name.slice(-10) }}</span>
                            </div>

                            <div
                                class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition">
                                <button @click="removeFile(i)"
                                    class="bg-red-600 text-white p-1 rounded-full hover:bg-red-700">
                                    <XMarkIcon class="w-5 h-5" />
                                </button>
                            </div>
                            <div v-if="prev.isImage"
                                class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-2 py-1 truncate">
                                {{ prev.file.name }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-3 flex flex-col">
                    <h4 class="text-xs font-bold text-gray-500 uppercase">2. Bacaan Dokter (Expertise)</h4>

                    <BaseTextarea v-model="radForm.expertise"
                        placeholder="Ketik hasil pembacaan foto rontgen di sini..." rows="8" class="flex-1" />

                    <div class="text-right text-[10px] text-gray-400 mt-2">
                        Dokter Pemeriksa: {{ selectedOrder.dokter }}
                    </div>
                </div>

            </div>
            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showRadModal = false">Batal</BaseButton>
                    <BaseButton :icon="CheckCircleIcon" class="bg-emerald-600 border-emerald-600 hover:bg-emerald-700"
                        @click="saveRadResult">Simpan Expertise</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>