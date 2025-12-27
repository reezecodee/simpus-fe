<script setup lang="ts">
import { ref, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'

// --- ICONS ---
import {
    ClockIcon,
    UserGroupIcon,
    ExclamationTriangleIcon,
    HeartIcon,
    CheckBadgeIcon,
    PencilSquareIcon,
    SpeakerWaveIcon, // Icon Sirine
    BellAlertIcon,   // Icon Alarm
    BoltIcon,
    UserIcon,
    StopIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

// --- STATE ALARM CODE BLUE ---
const isCodeBlueActive = ref(false)
const selectedCodeBluePatient = ref<any>(null)

// Statistik IGD Realtime
const stats = ref([
    { title: 'Pasien Masuk (24J)', value: 45, label: 'Total Registrasi', icon: UserGroupIcon, color: 'text-blue-600', border: 'border-t-blue-500', bgIcon: 'bg-blue-50' },
    { title: 'Menunggu Triage', value: 3, label: 'Belum Diperiksa', icon: ClockIcon, color: 'text-orange-600', border: 'border-t-orange-500', bgIcon: 'bg-orange-50' },
    { title: 'Zona Merah (Kritis)', value: 2, label: 'Resusitasi', icon: ExclamationTriangleIcon, color: 'text-red-600', border: 'border-t-red-500', bgIcon: 'bg-red-50' },
    { title: 'Zona Hijau (Aman)', value: 12, label: 'Non-Urgent', icon: CheckBadgeIcon, color: 'text-green-600', border: 'border-t-green-500', bgIcon: 'bg-green-50' },
])

// Antrian Pasien IGD (Ditambah data Bed)
const patientQueue = ref([
    { id: 'IGD-001', jam: '10:05', nama: 'Tn. Kecelakaan', rm: 'RM-999', bed: 'IGD - BED 01', keluhan: 'Luka robek di kepala, pendarahan aktif', status: 'WAITING', triage_level: null },
    { id: 'IGD-002', jam: '10:10', nama: 'Ny. Sesak', rm: 'RM-888', bed: 'IGD - BED 02', keluhan: 'Sesak napas berat, riwayat asma', status: 'WAITING', triage_level: null },
    { id: 'IGD-003', jam: '09:45', nama: 'An. Demam', rm: 'RM-777', bed: 'IGD - BED 05', keluhan: 'Demam 3 hari, batuk pilek', status: 'DONE', triage_level: 'HIJAU' },
    { id: 'IGD-004', jam: '09:50', nama: 'Tn. Jantung', rm: 'RM-555', bed: 'IGD - BED 03', keluhan: 'Nyeri dada menjalar ke lengan kiri', status: 'DONE', triage_level: 'MERAH' }
])

const columns: TableColumn[] = [
    { key: 'jam', label: 'Jam Masuk', width: '100px', align: 'center' },
    { key: 'nama', label: 'Identitas Pasien' },
    { key: 'keluhan', label: 'Keluhan Utama' },
    { key: 'triage_level', label: 'Hasil Triage', align: 'center', width: '150px' },
    { key: 'actions', label: '', align: 'right' },
]

const showTriageModal = ref(false)
const selectedPatient = ref<any>(null)
const formTriage = reactive({
    td_sistol: '', td_diastol: '', nadi: '', nafas: '', suhu: '', spo2: '',
    keluhan_detail: '', riwayat_alergi: '', level: ''
})

// ==========================================
// 2. LOGIC
// ==========================================

// Fungsi Aktifkan Alarm per Pasien
const triggerCodeBlue = (row: any) => {
    if (confirm(`Panggil Tim Code Blue untuk ${row.nama} di ${row.bed}?`)) {
        selectedCodeBluePatient.value = row
        isCodeBlueActive.value = true
    }
}

const stopAlarm = () => {
    isCodeBlueActive.value = false
    selectedCodeBluePatient.value = null
}

const handleTriage = (row: any) => {
    selectedPatient.value = row
    formTriage.td_sistol = ''; formTriage.td_diastol = ''; formTriage.nadi = '';
    formTriage.nafas = ''; formTriage.suhu = ''; formTriage.spo2 = '';
    formTriage.keluhan_detail = row.keluhan; formTriage.riwayat_alergi = '-'; formTriage.level = ''
    showTriageModal.value = true
}

const selectLevel = (lvl: string) => { formTriage.level = lvl }

const saveTriage = () => {
    if (!formTriage.level) return alert('Wajib memilih Kategori Triage (Warna)!')
    const target = patientQueue.value.find(p => p.id === selectedPatient.value.id)
    if (target) { target.status = 'DONE'; target.triage_level = formTriage.level }
    showTriageModal.value = false
}

const getBadgeClass = (level: string) => {
    switch (level) {
        case 'MERAH': return 'bg-red-600 text-white animate-pulse shadow-md border-red-700'
        case 'KUNING': return 'bg-yellow-400 text-black shadow-md border-yellow-500'
        case 'HIJAU': return 'bg-green-600 text-white shadow-md border-green-700'
        case 'HITAM': return 'bg-gray-800 text-white shadow-md border-gray-900'
        default: return 'bg-gray-100 text-gray-400'
    }
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center px-1 gap-4">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Triage Gawat Darurat</h1>
                <p class="text-[12px] text-gray-500">Klasifikasi prioritas pasien & Asesmen Awal (TTV).</p>
            </div>

            <div class="flex items-center gap-3">
                <span
                    class="text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-2 shadow-sm transition-colors"
                    :class="isCodeBlueActive
                        ? 'bg-red-600 text-white border-red-700 animate-pulse'
                        : 'bg-red-50 text-red-600 border-red-200'">
                    <span class="relative flex h-3 w-3">
                        <span v-if="isCodeBlueActive"
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3"
                            :class="isCodeBlueActive ? 'bg-white' : 'bg-red-600'"></span>
                    </span>
                    CODE BLUE: {{ isCodeBlueActive ? '1 ACTIVE' : '0 Active' }}
                </span>
            </div>
        </div>

        <div v-if="isCodeBlueActive && selectedCodeBluePatient"
            class="bg-red-600 text-white p-6 rounded-lg shadow-2xl flex items-center justify-between border-4 border-red-400 animate-pulse transition-all">
            <div class="flex items-center gap-6">
                <SpeakerWaveIcon class="w-16 h-16" />
                <div>
                    <h2 class="text-3xl font-black uppercase tracking-widest">🚨 CODE BLUE ACTIVE 🚨</h2>
                    <p class="text-xl font-bold uppercase">LOKASI: {{ selectedCodeBluePatient.bed }}</p>
                    <div class="mt-2 bg-white/20 p-2 rounded text-sm">
                        <span class="font-bold">PASIEN:</span> {{ selectedCodeBluePatient.nama }} | <span
                            class="font-bold">RM:</span> {{ selectedCodeBluePatient.rm }}
                    </div>
                </div>
            </div>
            <BaseButton variant="secondary" class="!bg-white !text-red-700 font-black px-6" @click="stopAlarm">
                MATIKAN ALARM
            </BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div v-for="(stat, idx) in stats" :key="idx"
                class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px]"
                :class="stat.border">
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ stat.title }}</p>
                    <p class="text-2xl font-black mt-1" :class="stat.color">{{ stat.value }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">{{ stat.label }}</p>
                </div>
                <div class="p-2 rounded-lg" :class="stat.bgIcon">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
                </div>
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-4 px-2">
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <ClockIcon class="w-4 h-4" /> Antrian Pasien IGD
                </h3>
            </div>

            <BaseDataTable :columns="columns" :data="patientQueue">
                <template #jam="{ value }"><span class="font-mono text-[11px] font-bold text-gray-600">{{ value
                        }}</span></template>
                <template #nama="{ row }">
                    <div>
                        <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.nama }}</p>
                        <span
                            class="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-black border border-green-100 uppercase tracking-tighter">{{
                                row.bed }}</span>
                    </div>
                </template>
                <template #triage_level="{ value }">
                    <span v-if="value" class="px-3 py-1 rounded text-[10px] font-black w-24 block text-center"
                        :class="getBadgeClass(value)">{{ value }}</span>
                    <span v-else class="text-[10px] text-gray-400 italic">Belum Triage</span>
                </template>
                <template #actions="{ row }">
                    <div class="flex justify-end gap-2">
                        <button @click="triggerCodeBlue(row)"
                            class="p-2 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Aktifkan Code Blue">
                            <BellAlertIcon class="w-4 h-4" />
                        </button>

                        <BaseButton v-if="row.status === 'WAITING'" size="sm" variant="danger" :icon="HeartIcon"
                            @click="handleTriage(row)">Mulai Triage</BaseButton>
                        <BaseButton v-else size="sm" variant="secondary" :icon="PencilSquareIcon"
                            @click="handleTriage(row)">Edit</BaseButton>
                    </div>
                </template>
            </BaseDataTable>
        </div>

        <BaseModal v-model="showTriageModal" title="ASESMEN TRIAGE & TANDA VITAL" width="max-w-4xl">
            <div v-if="selectedPatient" class="space-y-6">
                <div class="bg-blue-50 border border-blue-100 p-3 rounded-lg flex justify-between text-xs">
                    <div><span class="font-bold text-gray-500">Pasien:</span> <span
                            class="font-bold text-blue-800 text-lg ml-2">{{ selectedPatient.nama }}</span></div>
                    <div><span class="font-bold text-gray-500">Bed:</span> <span
                            class="font-mono font-bold ml-2 text-blue-700">{{ selectedPatient.bed }}</span></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h4 class="text-xs font-bold text-gray-500 uppercase border-b pb-1">A. Tanda-Tanda Vital (TTV)
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2 flex gap-2 items-end">
                                <BaseInput label="Tekanan Darah" v-model="formTriage.td_sistol" placeholder="120"
                                    class="flex-1" />
                                <span class="mb-4 font-bold text-gray-400">/</span>
                                <BaseInput label="" v-model="formTriage.td_diastol" placeholder="80" class="flex-1" />
                                <span class="mb-4 text-xs text-gray-500">mmHg</span>
                            </div>
                            <BaseInput label="Nadi (x/mnt)" v-model="formTriage.nadi" placeholder="80" />
                            <BaseInput label="Pernafasan (x/mnt)" v-model="formTriage.nafas" placeholder="20" />
                            <BaseInput label="Suhu (°C)" v-model="formTriage.suhu" placeholder="36.5" />
                            <BaseInput label="SpO2 (%)" v-model="formTriage.spo2" placeholder="98" />
                        </div>
                        <h4 class="text-xs font-bold text-gray-500 uppercase border-b pb-1 mt-4">B. Anamnesa</h4>
                        <BaseTextarea v-model="formTriage.keluhan_detail" label="Keluhan Utama" rows="3" />
                    </div>

                    <div class="space-y-3">
                        <h4 class="text-xs font-bold text-gray-500 uppercase border-b pb-1 mb-3">C. Kategori Triage
                            (Keputusan)
                        </h4>
                        <div @click="selectLevel('MERAH')"
                            class="cursor-pointer relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-200 flex items-start gap-4"
                            :class="formTriage.level === 'MERAH' ? 'border-red-600 bg-red-600 text-white shadow-lg scale-[1.02]' : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'">
                            <div class="p-2 rounded-full flex-shrink-0"
                                :class="formTriage.level === 'MERAH' ? 'bg-white/20' : 'bg-red-100 text-red-600'">
                                <BoltIcon class="w-6 h-6" />
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <h5 class="font-black text-sm uppercase">MERAH - RESUSITASI</h5><span
                                        class="text-[10px] font-bold px-2 py-0.5 rounded"
                                        :class="formTriage.level === 'MERAH' ? 'bg-white text-red-600' : 'bg-red-100 text-red-600'">RESPON:
                                        SEGERA</span>
                                </div>
                                <p class="text-[11px] mt-1"
                                    :class="formTriage.level === 'MERAH' ? 'text-red-100' : 'text-gray-500'">Kondisi
                                    mengancam
                                    nyawa. Perlu tindakan resusitasi detik ini juga.</p>
                            </div>
                        </div>
                        <div @click="selectLevel('KUNING')"
                            class="cursor-pointer relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-200 flex items-start gap-4"
                            :class="formTriage.level === 'KUNING' ? 'border-yellow-400 bg-yellow-400 text-black shadow-lg scale-[1.02]' : 'border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-50'">
                            <div class="p-2 rounded-full flex-shrink-0"
                                :class="formTriage.level === 'KUNING' ? 'bg-black/10' : 'bg-yellow-100 text-yellow-700'">
                                <ExclamationTriangleIcon class="w-6 h-6" />
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <h5 class="font-black text-sm uppercase text-gray-900">KUNING - EMERGENSI</h5><span
                                        class="text-[10px] font-bold px-2 py-0.5 rounded"
                                        :class="formTriage.level === 'KUNING' ? 'bg-black text-yellow-400' : 'bg-yellow-100 text-yellow-800'">RESPON:
                                        &lt; 10 MNT</span>
                                </div>
                                <p class="text-[11px] mt-1 text-gray-700">Berpotensi mengancam nyawa jika tidak
                                    ditangani
                                    segera.</p>
                            </div>
                        </div>
                        <div @click="selectLevel('HIJAU')"
                            class="cursor-pointer relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-200 flex items-start gap-4"
                            :class="formTriage.level === 'HIJAU' ? 'border-green-600 bg-green-600 text-white shadow-lg scale-[1.02]' : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'">
                            <div class="p-2 rounded-full flex-shrink-0"
                                :class="formTriage.level === 'HIJAU' ? 'bg-white/20' : 'bg-green-100 text-green-600'">
                                <UserIcon class="w-6 h-6" />
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <h5 class="font-black text-sm uppercase">HIJAU - TIDAK GAWAT</h5><span
                                        class="text-[10px] font-bold px-2 py-0.5 rounded"
                                        :class="formTriage.level === 'HIJAU' ? 'bg-white text-green-600' : 'bg-green-100 text-green-700'">RESPON:
                                        &lt; 60 MNT</span>
                                </div>
                                <p class="text-[11px] mt-1"
                                    :class="formTriage.level === 'HIJAU' ? 'text-green-100' : 'text-gray-500'">Kondisi
                                    ringan,
                                    tanda vital stabil. Bisa rawat jalan.</p>
                            </div>
                        </div>
                        <div @click="selectLevel('HITAM')"
                            class="cursor-pointer relative overflow-hidden rounded-lg border-2 p-3 transition-all duration-200 flex items-start gap-4"
                            :class="formTriage.level === 'HITAM' ? 'border-gray-800 bg-gray-900 text-white shadow-lg' : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-100'">
                            <div class="p-2 rounded-full flex-shrink-0"
                                :class="formTriage.level === 'HITAM' ? 'bg-white/20' : 'bg-gray-200 text-gray-600'">
                                <StopIcon class="w-5 h-5" />
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-center">
                                    <h5 class="font-black text-xs uppercase"
                                        :class="formTriage.level === 'HITAM' ? 'text-gray-300' : 'text-gray-700'">HITAM
                                        -
                                        MENINGGAL</h5><span class="text-[9px] font-bold px-2 py-0.5 rounded uppercase"
                                        :class="formTriage.level === 'HITAM' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-500'">DOA
                                        (Dead on Arrival)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showTriageModal = false">Batal</BaseButton>
                    <BaseButton :icon="CheckBadgeIcon" @click="saveTriage">SIMPAN & SELESAI</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>

<style scoped>
.animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .7;
    }
}
</style>