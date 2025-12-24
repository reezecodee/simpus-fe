<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseStepper from '@/components/common/BaseStepper.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

// --- ICONS ---
import {
    UserPlusIcon,
    MagnifyingGlassIcon,
    PrinterIcon,
    PencilSquareIcon,
    TrashIcon,
    TicketIcon,
    UsersIcon,
    ClockIcon,
    CheckCircleIcon,
    IdentificationIcon,
    ArrowPathIcon,
    PlayIcon,
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA & STATE DASHBOARD
// ==========================================

// --- STATE ---
const filters = reactive({
    search: '',
    klaster: ''
})

// --- OPTIONS UNTUK ILP ---
const klasterOptions = [
    { label: 'Semua Unit', value: '' },
    { label: 'Klaster 2 (Ibu & Anak)', value: 'Klaster 2' },
    { label: 'Klaster 3 (Dewasa & Lansia)', value: 'Klaster 3' },
    { label: 'Klaster 4 (P2 Menular)', value: 'Klaster 4' },
    { label: 'Poli Gigi & Mulut', value: 'Poli Gigi' }, // Gigi biasanya tetap spesifik
    { label: 'Gawat Darurat (UGD)', value: 'UGD' }
]

// --- DUMMY DATA ---
const stats = [
    { label: 'Total Pasien', value: 45, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Menunggu', value: 12, icon: ClockIcon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Selesai', value: 33, icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
]

// Data Antrian Hari Ini
const visitData = ref([
    { id: 1, no_antrian: 'A-01', no_rm: '00-12-33', nama: 'Budi Santoso', klaster: 'Klaster 3', bayar: 'BPJS', status: 'Selesai', jam: '07:45' },
    { id: 2, no_antrian: 'B-01', no_rm: '00-45-12', nama: 'Siti Aminah', klaster: 'Poli Gigi', bayar: 'Umum', status: 'Diperiksa', jam: '08:00' },
    { id: 3, no_antrian: 'A-02', no_rm: '00-11-22', nama: 'Anak Rina', klaster: 'Klaster 2', bayar: 'BPJS', status: 'Menunggu', jam: '08:15' },
    { id: 4, no_antrian: 'C-01', no_rm: '00-99-88', nama: 'Megawati', klaster: 'Klaster 2', bayar: 'Umum', status: 'Menunggu', jam: '08:20' },
])

// --- TABLE CONFIG ---
const columns: TableColumn[] = [
    { key: 'no_antrian', label: 'No. Antrian', width: '100px', align: 'center' },
    { key: 'nama', label: 'Identitas Pasien' },
    { key: 'klaster', label: 'Unit Layanan', width: '150px' }, // Label kolom diganti
    { key: 'bayar', label: 'Penjamin', width: '100px' },
    { key: 'jam', label: 'Jam', width: '80px', align: 'center' },
    { key: 'status', label: 'Status', width: '110px', align: 'center' },
    { key: 'actions', label: '', width: '60px', align: 'right' },
]

// --- LOGIC FILTER ---
const filteredVisits = computed(() => {
    const q = filters.search.toLowerCase()
    return visitData.value.filter(item => {
        const matchSearch = item.nama.toLowerCase().includes(q) ||
            item.no_rm.includes(q) ||
            item.no_antrian.toLowerCase().includes(q)
        // Update logic filter pakai klaster
        const matchKlaster = filters.klaster ? item.klaster === filters.klaster : true
        return matchSearch && matchKlaster
    })
})

const printKarcis = (row: any) => alert(`Cetak karcis antrian: ${row.no_antrian}`)

// ==========================================
// 2. LOGIC "SMART STEPPER" PENDAFTARAN
// ==========================================
const showModal = ref(false)
const currentStep = ref(0)
const isLoading = ref(false)
const isPasienLama = ref(false) // Flag penting!

// Definisi Langkah
const steps = [
    { title: 'Cek Data', subtitle: 'Verifikasi Pasien' },      // Step 0
    { title: 'Biodata', subtitle: 'Identitas Diri' },          // Step 1 (mst_pasien)
    { title: 'Keluarga', subtitle: 'Penanggung Jawab' },       // Step 2 (mst_pasien_keluarga)
    { title: 'Kunjungan', subtitle: 'Poli & Dokter' }          // Step 3 (trx_registrasi)
]

// State Form Pendaftaran (Mencakup semua tabel)
const form = reactive({
    // Filter Awal
    checkQuery: '',

    // mst_pasien & mst_pasien_identitas
    nik: '',
    no_kk: '',
    nama: '',
    tgl_lahir: '',
    alamat: '',

    // mst_pasien_keluarga
    pj_nama: '',
    pj_hubungan: '',
    pj_phone: '',

    // trx_registrasi & trx_registrasi_penjab
    klaster_tujuan: '',
    cara_bayar: 'Umum', // Umum/BPJS
    dokter: ''
})

// --- FUNCTION: Buka Modal ---
const openRegistration = () => {
    // Reset Form
    currentStep.value = 0
    isPasienLama.value = false
    form.checkQuery = ''
    form.nama = ''; form.nik = ''; form.klaster_tujuan = ''
    showModal.value = true
}

// --- FUNCTION: Cek Data (Step 0) ---
const handleCheckPasien = () => {
    if (!form.checkQuery) return alert('Masukkan NIK atau No. RM!')

    isLoading.value = true

    // SIMULASI API CHECK
    setTimeout(() => {
        isLoading.value = false

        // Skenario 1: Pasien Ditemukan (PASIEN LAMA)
        // Misalnya kita cari "001" atau "Budi"
        if (form.checkQuery === '001' || form.checkQuery.toLowerCase() === 'budi') {
            isPasienLama.value = true

            // Auto Fill Data dari DB
            form.nama = 'Budi Santoso'
            form.nik = '320112345678'
            form.alamat = 'Jl. Siliwangi No. 10'
            form.pj_nama = 'Susi (Istri)'

            // LOGIC LOMPAT: Langsung ke Step Terakhir (Kunjungan)
            currentStep.value = 3

        } else {
            // Skenario 2: Tidak Ditemukan (PASIEN BARU)
            isPasienLama.value = false

            // Auto fill NIK jika yang diketik tadi angka
            if (!isNaN(Number(form.checkQuery)) && form.checkQuery.length > 10) {
                form.nik = form.checkQuery
            }

            // Lanjut normal ke Step 1
            currentStep.value = 1
        }
    }, 800)
}

// --- FUNCTION: Navigasi Back ---
const handleBack = () => {
    if (currentStep.value === 3 && isPasienLama.value) {
        // Kalau Pasien Lama, dari step akhir balik langsung ke Step 0 (Cek)
        // Jangan mampir ke step 2 atau 1
        currentStep.value = 0
        form.checkQuery = '' // Reset pencarian
    } else {
        currentStep.value--
    }
}

// --- FUNCTION: Submit Akhir ---
const handleSubmit = () => {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        showModal.value = false
        alert(`Sukses Mendaftarkan ${form.nama} ke ${form.klaster_tujuan}`)

        // Tambah ke tabel antrian (visual only)
        visitData.value.unshift({
            id: Date.now(),
            no_antrian: 'C-05',
            no_rm: isPasienLama.value ? '00-12-33' : 'NEW-01',
            nama: form.nama,
            klaster: form.klaster_tujuan,
            bayar: form.cara_bayar,
            status: 'Menunggu',
            jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        })
    }, 1000)
}

// ==========================================
// 3. LOGIC ANTRIAN LOKET
// ==========================================
const isSpeaking = ref(false)

const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
        // Hentikan suara sebelumnya jika ada
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'id-ID' // Bahasa Indonesia
        utterance.rate = 0.9     // Kecepatan bicara (agak lambat biar jelas)
        utterance.pitch = 1      // Nada normal

        // Event ketika mulai dan selesai bicara
        utterance.onstart = () => { isSpeaking.value = true }
        utterance.onend = () => { isSpeaking.value = false }

        window.speechSynthesis.speak(utterance)
    } else {
        alert("Browser tidak support suara. Gunakan Chrome/Edge.")
    }
}

const currentQueue = ref<any>(null) // Menyimpan siapa yang sedang dipanggil sekarang

const currentQueueId = ref<number | null>(null) // Menyimpan ID pasien yang sedang aktif dipanggil

// Computed: Ambil semua yang statusnya MENUNGGU
const listMenunggu = computed(() => {
    return visitData.value.filter(p => p.status === 'Menunggu')
})

// Computed: Cari object pasien yang sedang aktif berdasarkan ID
const activeQueue = computed(() => {
    return listMenunggu.value.find(p => p.id === currentQueueId.value) || null
})

// 1. Tombol NEXT (Sistem Looping / Putar Terus)
const panggilSelanjutnya = () => {
    const list = listMenunggu.value

    // Kalau list kosong, baru alert
    if (list.length === 0) {
        alert("Tidak ada antrian menunggu.")
        return
    }

    // Cari posisi index pasien yang sedang aktif
    const currentIndex = list.findIndex(p => p.id === currentQueueId.value)

    // Hitung index selanjutnya
    let nextIndex = currentIndex + 1

    // --- LOGIC LOOPING ---
    // Jika nextIndex sudah melebihi jumlah data (mentok bawah),
    // kita paksa balik lagi ke index 0 (atas).
    if (nextIndex >= list.length) {
        nextIndex = 0
    }

    // Ambil data pasien
    const nextPasien = list[nextIndex]

    // Eksekusi Panggil
    if (nextPasien) {
        currentQueueId.value = nextPasien.id
        bunyikanSuara(nextPasien)
    }
}

// 2. Tombol REPEAT (Ulangi Panggilan)
const panggilUlang = () => {
    if (activeQueue.value) {
        // Tambahkan kata "Panggilan Ulang" biar lebih natural
        bunyikanSuara(activeQueue.value, true)
    } else {
        // Kalau belum ada yang dipilih, panggil yang pertama aja
        panggilSelanjutnya()
    }
}

// Helper Suara
const bunyikanSuara = (pasien: any, isRepeat = false) => {
    const prefix = isRepeat ? 'Panggilan ulang, ' : 'Panggilan antrian, '
    const kalimat = `${prefix} nomor antrian, ${ejaNomor(pasien.no_antrian)}, silakan ke loket pendaftaran`
    playVoice(kalimat)
}

// Helper Eja (Sama kayak tadi)
const ejaNomor = (text: string) => text.replace('-', ' ').split('').join(' ')
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6 pb-32">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 tracking-tight uppercase">Dashboard Pendaftaran</h1>
                <p class="text-[12px] text-gray-500 mt-1">Pantau antrian poli dan registrasi pasien hari ini.</p>
            </div>

            <div class="flex items-center gap-2">
                <BaseButton :icon="UserPlusIcon" @click="openRegistration">
                    Pendaftaran Pasien
                </BaseButton>
            </div>
        </div>

        <div class="page-content space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="(stat, idx) in stats" :key="idx"
                    class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{{ stat.label }}</p>
                        <p class="text-[24px] font-bold text-gray-800 mt-1">{{ stat.value }}</p>
                    </div>
                    <div :class="`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`">
                        <component :is="stat.icon" class="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div class="flex-1 relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input v-model="filters.search" type="text"
                        class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                        placeholder="Cari Pasien (Nama / No. RM / No. Antrian)..." autofocus />
                </div>

                <div class="w-full md:w-[250px]">
                    <BaseSelect v-model="filters.klaster" :options="klasterOptions"
                        placeholder="Filter Klaster / Unit" />
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 border-t-[4px] border-t-green-600 overflow-hidden">
                <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 class="font-bold text-gray-700 flex items-center gap-2 text-sm">
                        <TicketIcon class="w-5 h-5 text-green-600" />
                        List Antrian Hari Ini
                    </h3>
                    <span class="text-[11px] font-mono font-medium text-gray-500">
                        Menampilkan {{ filteredVisits.length }} data
                    </span>
                </div>

                <div class="p-4">
                    <BaseDataTable :columns="columns" :data="filteredVisits" :total-items="filteredVisits.length"
                        hide-search>
                        <template #no_antrian="{ value }">
                            <span
                                class="text-[16px] font-bold font-mono text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                                {{ value }}
                            </span>
                        </template>

                        <template #nama="{ row }">
                            <div class="flex flex-col">
                                <span class="font-bold text-gray-800 text-[13px]">{{ row.nama }}</span>
                                <span class="text-[11px] text-gray-500 font-mono tracking-tight">RM: {{ row.no_rm
                                    }}</span>
                            </div>
                        </template>

                        <template #status="{ value }">
                            <BaseBadge :variant="value === 'Menunggu' ? 'warning' :
                                value === 'Selesai' ? 'success' :
                                    value === 'Dipanggil' ? 'info' : 'gray'" dot>
                                {{ value }}
                            </BaseBadge>
                        </template>

                        <template #actions="{ row }">
                            <BaseActionMenu>
                                <button @click="printKarcis(row)"
                                    class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-green-600 transition text-left">
                                    <PrinterIcon class="w-4 h-4" /> Cetak Karcis
                                </button>
                                <button
                                    class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition text-left">
                                    <PencilSquareIcon class="w-4 h-4" /> Edit Poli
                                </button>
                                <div class="border-t my-1"></div>
                                <button
                                    class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 transition text-left">
                                    <TrashIcon class="w-4 h-4" /> Batalkan
                                </button>
                            </BaseActionMenu>
                        </template>
                    </BaseDataTable>
                </div>
            </div>

            <BaseModal v-model="showModal" title="Form Registrasi Layanan" width="max-w-3xl">

                <div class="mb-6 px-4">
                    <BaseStepper :steps="steps" :current-step="currentStep" />
                </div>

                <div v-if="currentStep === 0" class="py-10 text-center space-y-4">
                    <div
                        class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IdentificationIcon class="w-8 h-8" />
                    </div>
                    <h3 class="text-lg font-bold text-gray-800">Verifikasi Data Pasien</h3>
                    <p class="text-sm text-gray-500 max-w-md mx-auto">
                        Masukkan NIK, Nomor BPJS, atau Nomor Rekam Medis (RM) untuk pengecekan database.
                    </p>

                    <div class="max-w-md mx-auto flex gap-2">
                        <BaseInput v-model="form.checkQuery" placeholder="Contoh: 32011... atau 00-12-XX" class="flex-1"
                            @keyup.enter="handleCheckPasien" />
                        <BaseButton :loading="isLoading" @click="handleCheckPasien">
                            Cek Data
                        </BaseButton>
                    </div>

                    <div class="text-xs text-gray-400 pt-4">
                        Tips: Ketik "001" atau "Budi" untuk simulasi Pasien Lama.
                    </div>
                </div>

                <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
                    <BaseAlert variant="info" title="Pasien Baru Terdeteksi">
                        Data tidak ditemukan. Silakan lengkapi biodata pasien berikut.
                    </BaseAlert>

                    <div class="grid grid-cols-2 gap-4">
                        <BaseInput v-model="form.nik" label="NIK (KTP)" mono required />
                        <BaseInput v-model="form.no_kk" label="No. Kartu Keluarga" mono />
                        <BaseInput v-model="form.nama" label="Nama Lengkap" class="col-span-2" required />
                        <BaseInput v-model="form.tgl_lahir" type="date" label="Tanggal Lahir" />
                        <BaseSelect v-model="form.alamat" label="Kecamatan" :options="['Tawang', 'Cihideung']" />
                    </div>
                </div>

                <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
                    <h4 class="font-bold text-gray-700 border-b pb-2">Penanggung Jawab Pasien</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <BaseInput v-model="form.pj_nama" label="Nama Penanggung Jawab" />
                        <BaseSelect v-model="form.pj_hubungan" label="Hubungan"
                            :options="['Suami', 'Istri', 'Orang Tua', 'Anak']" />
                        <BaseInput v-model="form.pj_phone" label="No. Telepon / HP" mono />
                    </div>
                </div>

                <div v-if="currentStep === 3" class="space-y-4 animate-fade-in">

                    <div v-if="isPasienLama"
                        class="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3 mb-4">
                        <CheckCircleIcon class="w-6 h-6 text-green-600 mt-0.5" />
                        <div>
                            <h4 class="font-bold text-green-800">Data Pasien Ditemukan!</h4>
                            <p class="text-sm text-green-700">{{ form.nama }} (NIK: {{ form.nik }})</p>
                            <p class="text-xs text-green-600 mt-1">Alamat: {{ form.alamat }}</p>
                        </div>
                    </div>

                    <h4 class="font-bold text-gray-700">Detail Kunjungan Hari Ini</h4>

                    <div class="grid grid-cols-2 gap-4">
                        <BaseSelect v-model="form.klaster_tujuan" label="Unit / Klaster Tujuan"
                            :options="['Klaster 2 (Ibu Anak)', 'Klaster 3 (Dewasa)', 'Poli Gigi', 'UGD']" required />

                        <BaseSelect v-model="form.dokter" label="Dokter Pemeriksa"
                            :options="['dr. Budi', 'dr. Siti', 'drg. Hendra']" />

                        <BaseSelect v-model="form.cara_bayar" label="Metode Pembayaran"
                            :options="['Umum / Tunai', 'BPJS Kesehatan', 'Jampersal']" />
                    </div>
                </div>

                <template #footer>
                    <div class="flex justify-between w-full">
                        <BaseButton v-if="currentStep > 0" variant="secondary" @click="handleBack">
                            Kembali
                        </BaseButton>
                        <div v-else></div>
                        <BaseButton v-if="currentStep > 0" :loading="isLoading"
                            @click="currentStep === 3 ? handleSubmit() : currentStep++">
                            {{ currentStep === 3 ? 'Simpan Pendaftaran' : 'Lanjut' }}
                        </BaseButton>
                    </div>
                </template>

            </BaseModal>

            <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 animate-slide-up">

                <div v-if="activeQueue"
                    class="bg-gray-900/90 backdrop-blur text-white p-4 rounded-xl shadow-2xl mb-2 border border-gray-700 min-w-[240px]">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Sedang
                                Memanggil</p>
                            <div class="text-4xl font-mono font-bold text-green-400 tracking-tighter">
                                {{ activeQueue.no_antrian }}
                            </div>
                        </div>
                        <span class="w-2 h-2 rounded-full bg-red-500 animate-ping mt-2"></span>
                    </div>
                    <p class="text-sm font-medium text-gray-200 mt-2 truncate">
                        {{ activeQueue.nama }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">
                        {{ activeQueue.klaster }}
                    </p>
                </div>

                <div
                    class="bg-white p-2 rounded-full shadow-2xl border border-gray-200 flex items-center gap-2 pl-2 pr-2">

                    <div class="pl-3 pr-3 flex flex-col items-center justify-center border-r border-gray-200 mr-1">
                        <span class="text-[10px] text-gray-400 font-bold uppercase">Sisa</span>
                        <span class="text-lg font-bold text-gray-800 leading-none">{{ listMenunggu.length }}</span>
                    </div>

                    <button @click="panggilUlang" :disabled="!activeQueue || isSpeaking"
                        class="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 flex flex-col items-center justify-center transition disabled:opacity-50 border border-yellow-200"
                        title="Panggil Ulang (Repeat)">
                        <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': isSpeaking && activeQueue }" />
                    </button>

                    <button @click="panggilSelanjutnya" :disabled="isSpeaking || listMenunggu.length === 0"
                        class="bg-green-600 hover:bg-green-700 text-white pl-5 pr-6 py-3 rounded-full flex items-center gap-3 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group">
                        <span class="font-bold text-sm">Panggil Berikutnya</span>
                        <PlayIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>