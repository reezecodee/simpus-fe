<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'

// --- ICONS ---
import {
    MagnifyingGlassIcon,
    ScaleIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserIcon,
    ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

const searchQuery = ref('')
const filterRoom = ref('ALL')
const filterStatus = ref('ALL')

// Data Pasien Dummy
const patients = ref([
    {
        id: 'REG-001', nama: 'Tn. Budi Santoso', rm: 'RM-12345',
        kamar: '301 (Vip)', tgl_masuk: '27-12-2025',
        diagnosa_medis: 'Febris H-3, Susp. Typhoid',
        diet_saat_ini: 'Nasi Lunak',
        status_skrining: 'PENDING'
    },
    {
        id: 'REG-002', nama: 'Ny. Siti Aminah', rm: 'RM-88821',
        kamar: '302 (Kls 1)', tgl_masuk: '26-12-2025',
        diagnosa_medis: 'Diabetes Melitus Tipe 2',
        diet_saat_ini: 'Nasi Tim DM 1500',
        status_skrining: 'DONE', mst_score: 1
    },
    {
        id: 'REG-003', nama: 'An. Dede', rm: 'RM-55123',
        kamar: '305 (Anak)', tgl_masuk: '27-12-2025',
        diagnosa_medis: 'Diare Akut Dehidrasi Ringan',
        diet_saat_ini: 'Bubur Saring',
        status_skrining: 'RISK', mst_score: 4
    }
])

const columns: TableColumn[] = [
    { key: 'nama', label: 'Pasien' },
    { key: 'kamar', label: 'Ruang Rawat', width: '120px' },
    { key: 'diagnosa_medis', label: 'Diagnosa Medis' },
    { key: 'diet_saat_ini', label: 'Diet Saat Ini' },
    { key: 'status_skrining', label: 'Status Gizi', align: 'center', width: '120px' },
    { key: 'actions', label: '', align: 'right' },
]

// --- MODAL STATE & FORM ---
const showModal = ref(false)
const activeTab = ref<'SKRINING' | 'INTERVENSI'>('SKRINING')
const selectedPatient = ref<any>(null)

// Form Asuhan Gizi (Reactive)
const formGizi = reactive({
    // Antropometri
    bb: '', // Berat Badan
    tb: '', // Tinggi Badan
    lila: '', // Lingkar Lengan Atas
    imt: '0', // Auto Calc

    // MST (Malnutrition Screening Tool)
    mst_bb_turun: 0, // Skor penurunan BB
    mst_makan_kurang: 0, // Skor asupan makan
    mst_total: 0,
    mst_resiko: 'LOW', // LOW / HIGH

    // Intervensi / Diet
    bentuk_makanan: 'Nasi Biasa',
    jenis_diet: 'Tidak Ada (Diet Sehat)',
    kalori: '',
    protein: '',
    catatan_dapur: ''
})

// Opsi Dropdown
const mstBBOptions = [
    { value: 0, label: 'Tidak ada penurunan BB (0)' },
    { value: 2, label: 'BB Turun 1-5 Kg (2)' },
    { value: 3, label: 'BB Turun > 5 Kg / Baju Longgar (3)' }, // Biasanya skor 2 atau 3 tergantung RS, kita pakai standar umum
]

const mstMakanOptions = [
    { value: 0, label: 'Makan seperti biasa (0)' },
    { value: 1, label: 'Nafsu makan turun / asupan < 50% (1)' },
]

const bentukMakananOptions = [
    { value: 'Nasi Biasa', label: 'Nasi Biasa' },
    { value: 'Nasi Lunak/Tim', label: 'Nasi Lunak / Tim' },
    { value: 'Bubur Kasar', label: 'Bubur Kasar' },
    { value: 'Bubur Saring', label: 'Bubur Saring/Halus' },
    { value: 'Cair/Sonda', label: 'Makanan Cair / Sonda' },
]

const jenisDietOptions = [
    { value: 'Diet Sehat', label: 'Diet Sehat (Tanpa Pantangan)' },
    { value: 'TKTP', label: 'Tinggi Kalori Tinggi Protein (TKTP)' },
    { value: 'DM', label: 'Diabetes Melitus (DM)' },
    { value: 'Rendah Garam', label: 'Rendah Garam (Hipertensi)' },
    { value: 'Rendah Protein', label: 'Rendah Protein (Ginjal)' },
    { value: 'Rendah Lemak', label: 'Rendah Lemak / Kolesterol' },
]

// ==========================================
// 2. LOGIC
// ==========================================

const filteredPatients = computed(() => {
    let data = patients.value
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        data = data.filter(p => p.nama.toLowerCase().includes(q) || p.rm.toLowerCase().includes(q))
    }
    return data
})

const handleOpenAsuhan = (row: any) => {
    selectedPatient.value = row
    activeTab.value = 'SKRINING' // Reset ke tab 1

    // Reset Form (Idealnya fetch data dari API jika sudah ada)
    formGizi.bb = ''
    formGizi.tb = ''
    formGizi.mst_bb_turun = 0
    formGizi.mst_makan_kurang = 0
    formGizi.catatan_dapur = ''

    showModal.value = true
}

// --- AUTO CALCULATIONS ---

// 1. Hitung IMT (BMI)
watch([() => formGizi.bb, () => formGizi.tb], () => {
    const berat = parseFloat(formGizi.bb)
    const tinggi = parseFloat(formGizi.tb) / 100 // cm to m

    if (berat > 0 && tinggi > 0) {
        const bmi = berat / (tinggi * tinggi)
        formGizi.imt = bmi.toFixed(2)
    } else {
        formGizi.imt = '0'
    }
})

// 2. Hitung Skor MST
watch([() => formGizi.mst_bb_turun, () => formGizi.mst_makan_kurang], () => {
    const total = formGizi.mst_bb_turun + formGizi.mst_makan_kurang
    formGizi.mst_total = total
    formGizi.mst_resiko = total >= 2 ? 'HIGH' : 'LOW'
})

const saveAsuhan = () => {
    // Validasi
    if (!formGizi.bb || !formGizi.tb) return alert('Data Antropometri (BB & TB) wajib diisi!')

    // Update data dummy tabel
    const target = patients.value.find(p => p.id === selectedPatient.value.id)
    if (target) {
        target.status_skrining = formGizi.mst_resiko === 'HIGH' ? 'RISK' : 'DONE'
        target.diet_saat_ini = `${formGizi.bentuk_makanan} - ${formGizi.jenis_diet}`
    }

    alert('Asuhan Gizi Berhasil Disimpan!')
    showModal.value = false
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col md:flex-row justify-between items-end gap-4 px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Daftar Pasien & Skrining</h1>
                <p class="text-[12px] text-gray-500">Manajemen asuhan gizi, skrining malnutrisi, dan preskripsi diet.
                </p>
            </div>

            <div class="flex gap-2 w-full md:w-auto">
                <BaseInput v-model="searchQuery" placeholder="Cari Nama / No RM..." :icon="MagnifyingGlassIcon"
                    class="w-full md:w-64 !mb-0" />
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <BaseDataTable :columns="columns" :data="filteredPatients" hide-search>

                <template #nama="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.nama }}</p>
                        <p class="text-[10px] text-gray-500">{{ row.rm }}</p>
                    </div>
                </template>

                <template #kamar="{ value }">
                    <span
                        class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200">{{
                        value }}</span>
                </template>

                <template #diagnosa_medis="{ value }">
                    <p class="text-[11px] text-gray-600 italic truncate max-w-[200px]">{{ value }}</p>
                </template>

                <template #status_skrining="{ value, row }">
                    <span v-if="value === 'PENDING'"
                        class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-gray-100 text-gray-500 border border-gray-200">
                        <UserIcon class="w-3 h-3" /> BELUM
                    </span>
                    <span v-else-if="value === 'RISK'"
                        class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-red-100 text-red-600 border border-red-200 animate-pulse">
                        <ExclamationCircleIcon class="w-3 h-3" /> RESIKO ({{ row.mst_score }})
                    </span>
                    <span v-else
                        class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-green-100 text-green-700 border border-green-200">
                        <CheckCircleIcon class="w-3 h-3" /> AMAN
                    </span>
                </template>

                <template #actions="{ row }">
                    <div class="text-right">
                        <BaseButton size="sm" variant="primary" :icon="PencilSquareIcon" @click="handleOpenAsuhan(row)">
                            Asuhan Gizi
                        </BaseButton>
                    </div>
                </template>

            </BaseDataTable>
        </div>

        <BaseModal v-model="showModal" title="FORMULIR ASUHAN GIZI (NCP)" width="max-w-4xl">
            <div v-if="selectedPatient" class="space-y-6">

                <div
                    class="bg-green-50 border border-green-100 p-3 rounded-lg flex flex-col md:flex-row justify-between text-xs gap-2">
                    <div>
                        <span class="font-bold text-gray-500 block">PASIEN:</span>
                        <span class="font-bold text-lg text-green-800">{{ selectedPatient.nama }}</span>
                        <span class="text-gray-500 ml-2">({{ selectedPatient.rm }})</span>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-gray-500 block">DIAGNOSA MEDIS:</span>
                        <span class="font-bold text-gray-700 italic">{{ selectedPatient.diagnosa_medis }}</span>
                    </div>
                </div>

                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex gap-4" aria-label="Tabs">
                        <button @click="activeTab = 'SKRINING'" :class="[
                            activeTab === 'SKRINING'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm flex items-center gap-2'
                        ]">
                            <ScaleIcon class="w-5 h-5" /> 1. Skrining & Antropometri
                        </button>
                        <button @click="activeTab = 'INTERVENSI'" :class="[
                            activeTab === 'INTERVENSI'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm flex items-center gap-2'
                        ]">
                            <ClipboardDocumentListIcon class="w-5 h-5" /> 2. Diagnosis & Intervensi Diet
                        </button>
                    </nav>
                </div>

                <div v-show="activeTab === 'SKRINING'" class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

                    <div class="space-y-4">
                        <h4 class="text-xs font-bold text-gray-500 uppercase border-b pb-1">A. Antropometri</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <BaseInput label="Berat Badan (Kg)" v-model="formGizi.bb" type="number" placeholder="0" />
                            <BaseInput label="Tinggi Badan (cm)" v-model="formGizi.tb" type="number" placeholder="0" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <BaseInput label="LiLA (cm)" v-model="formGizi.lila" type="number" placeholder="Opsional" />

                            <div class="bg-gray-100 rounded p-2 border border-gray-200 text-center">
                                <label class="text-[10px] font-bold text-gray-500 block">IMT (kg/m²)</label>
                                <span class="text-xl font-black text-gray-800">{{ formGizi.imt }}</span>
                                <span class="block text-[10px]"
                                    :class="parseFloat(formGizi.imt) > 25 ? 'text-red-500' : 'text-green-600'">
                                    {{ parseFloat(formGizi.imt) > 25 ? 'Overweight' : (parseFloat(formGizi.imt) < 18.5
                                        ? 'Underweight' : 'Normal' ) }} </span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h4 class="text-xs font-bold text-gray-500 uppercase border-b pb-1">B. Skrining MST</h4>

                        <BaseSelectSearch label="1. Apakah ada penurunan BB yang tidak direncanakan?"
                            v-model="formGizi.mst_bb_turun" :options="mstBBOptions" />

                        <BaseSelectSearch label="2. Apakah asupan makan berkurang karena sakit?"
                            v-model="formGizi.mst_makan_kurang" :options="mstMakanOptions" />

                        <div class="mt-4 p-3 rounded-lg border-2 flex items-center justify-between"
                            :class="formGizi.mst_resiko === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'">
                            <div>
                                <p class="text-xs font-bold text-gray-500 uppercase">Total Skor MST</p>
                                <p class="text-2xl font-black"
                                    :class="formGizi.mst_resiko === 'HIGH' ? 'text-red-600' : 'text-green-600'">
                                    {{ formGizi.mst_total }}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs font-bold uppercase mb-1">Kesimpulan</p>
                                <span v-if="formGizi.mst_resiko === 'HIGH'"
                                    class="bg-red-600 text-white px-3 py-1 rounded font-bold text-xs">
                                    BERISIKO MALNUTRISI
                                </span>
                                <span v-else class="bg-green-600 text-white px-3 py-1 rounded font-bold text-xs">
                                    TIDAK BERISIKO
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-show="activeTab === 'INTERVENSI'" class="pt-2 space-y-6">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-gray-500 uppercase border-b pb-1">C. Preskripsi Diet</h4>

                            <BaseSelectSearch label="Bentuk Makanan (Konsistensi)" v-model="formGizi.bentuk_makanan"
                                :options="bentukMakananOptions" />

                            <BaseSelectSearch label="Jenis Diet" v-model="formGizi.jenis_diet"
                                :options="jenisDietOptions" />

                            <div class="grid grid-cols-2 gap-4">
                                <BaseInput label="Target Energi (Kkal)" v-model="formGizi.kalori"
                                    placeholder="Cth: 1700" />
                                <BaseInput label="Target Protein (gram)" v-model="formGizi.protein"
                                    placeholder="Cth: 60" />
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-gray-500 uppercase border-b pb-1">D. Catatan Produksi
                                (Dapur)</h4>

                            <BaseTextarea v-model="formGizi.catatan_dapur"
                                placeholder="Tulis instruksi khusus untuk juru masak. Contoh: 'Tanpa garam sama sekali', 'Alergi Seafood', 'Potongan lauk kecil-kecil'."
                                rows="6" />
                        </div>
                    </div>

                    <BaseAlert v-if="formGizi.mst_resiko === 'HIGH'" variant="warning" title="Rekomendasi Klinis">
                        Pasien Berisiko Malnutrisi (Skor {{ formGizi.mst_total }}). Disarankan memberikan <b>Extra
                            Fooding
                            (Snack Tinggi Protein)</b> atau suplemen oral.
                    </BaseAlert>

                </div>

            </div>

            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showModal = false">Batal</BaseButton>
                    <BaseButton v-if="activeTab === 'SKRINING'" @click="activeTab = 'INTERVENSI'">Lanjut ke Diet &rarr;
                    </BaseButton>
                    <BaseButton v-else :icon="CheckCircleIcon" @click="saveAsuhan">Simpan Asuhan Gizi</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>