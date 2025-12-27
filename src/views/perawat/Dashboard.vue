<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

// --- ICONS ---
import {
    ArrowPathIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    CheckCircleIcon,
    HeartIcon,
    UserMinusIcon,
    InformationCircleIcon,
    MegaphoneIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// ==========================================
// 1. DATA STATE
// ==========================================

// Statistik Shift
const stats = ref([
    { title: 'Total Pasien', value: 18, label: 'Kapasitas 20 Bed', icon: UserGroupIcon, color: 'text-green-600', border: 'border-t-green-500', bgIcon: 'bg-green-50' },
    { title: 'Pasien Baru', value: 2, label: 'Masuk Shift Ini', icon: ArrowPathIcon, color: 'text-emerald-600', border: 'border-t-emerald-500', bgIcon: 'bg-emerald-50' },
    { title: 'Rencana Pulang', value: 3, label: 'Menunggu Obat/Admin', icon: UserMinusIcon, color: 'text-teal-600', border: 'border-t-teal-500', bgIcon: 'bg-teal-50' },
    { title: 'Pasien Gawat', value: 1, label: 'Observasi Ketat', icon: HeartIcon, color: 'text-red-600', border: 'border-t-red-500', bgIcon: 'bg-red-50' },
])

// Filter Bangsal
const selectedRoom = ref('ALL')
const rooms = ['ALL', 'Mawar (Kls 1)', 'Melati (Kls 2)', 'Anggrek (VIP)']

// Data Bed (Visualisasi Denah) - Tambah property 'room' untuk filter
const beds = ref([
    { id: '301-A', no: '301-A', room: 'Mawar (Kls 1)', status: 'ISI', pasien: 'Tn. Budi Santoso', rm: '12345', dpjp: 'dr. Asep', alert: 'OBAT', gender: 'L' },
    { id: '301-B', no: '301-B', room: 'Mawar (Kls 1)', status: 'ISI', pasien: 'Tn. Joko', rm: '12346', dpjp: 'dr. Bedah', alert: 'NONE', gender: 'L' },
    { id: '302-A', no: '302-A', room: 'Melati (Kls 2)', status: 'KOSONG', pasien: '-', rm: '-', dpjp: '-', alert: 'NONE', gender: '-' },
    { id: '302-B', no: '302-B', room: 'Melati (Kls 2)', status: 'ISI', pasien: 'Ny. Siti', rm: '88812', dpjp: 'dr. Kandungan', alert: 'TTV', gender: 'P' },
    { id: 'VIP-01', no: 'VIP-01', room: 'Anggrek (VIP)', status: 'ISI', pasien: 'An. Dede', rm: '55512', dpjp: 'dr. Anak', alert: 'INFUS', gender: 'L' },
    { id: 'VIP-02', no: 'VIP-02', room: 'Anggrek (VIP)', status: 'PULANG', pasien: 'Ny. Rina', rm: '99911', dpjp: 'dr. Dalam', alert: 'NONE', gender: 'P' },
])

// Task List (Jadwal Kegiatan)
const tasks = ref([
    { jam: '14:00', task: 'Inj. Ceftriaxone', pasien: 'Tn. Budi (301-A)', status: 'PENDING' },
    { jam: '14:00', task: 'Cek Gula Darah', pasien: 'Ny. Siti (302-B)', status: 'PENDING' },
    { jam: '14:30', task: 'Ganti Cairan Infus', pasien: 'An. Dede (VIP-01)', status: 'DONE' },
    { jam: '15:00', task: 'TTV Shift Sore', pasien: 'Semua Pasien', status: 'PENDING' },
])

// Modal Detail Bed
const showBedModal = ref(false)
const selectedBed = ref<any>(null)

// ==========================================
// 2. LOGIC
// ==========================================

// LOGIC FILTER RUANGAN
const filteredBeds = computed(() => {
    if (selectedRoom.value === 'ALL') {
        return beds.value
    }
    return beds.value.filter(bed => bed.room === selectedRoom.value)
})

const handleBedClick = (bed: any) => {
    if (bed.status === 'KOSONG') return
    selectedBed.value = bed
    showBedModal.value = true
}

// LOGIC TOGGLE TASK (Bisa undo)
const toggleTask = (index: number) => {
    const task = tasks.value[index]

    if (task) {
        if (task.status === 'DONE') {
            task.status = 'PENDING'
        } else {
            task.status = 'DONE'
        }
    }
}

const goToAsuhan = () => {
    router.push('/perawat/asuhan')
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Nurse Station (Bangsal Mawar)
                </h1>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span
                        class="bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold border border-green-200">SHIFT
                        PAGI</span>
                    <span>Ka. Tim: Ns. Atyla, S.Kep</span>
                    <span>•</span>
                    <span>{{ new Date().toLocaleDateString('id-ID', {
                        weekday: 'long', year: 'numeric', month: 'long',
                        day: 'numeric'
                    }) }}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <BaseButton :icon="ArrowPathIcon" variant="secondary">Refresh
                </BaseButton>
                <BaseButton :icon="ClipboardDocumentCheckIcon" variant="primary" @click="goToAsuhan">Buka Asuhan
                </BaseButton>
            </div>
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

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-2 space-y-4">

                <div
                    class="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                    <div class="flex gap-2">
                        <button v-for="room in rooms" :key="room"
                            class="px-3 py-1 text-[10px] font-bold rounded-full border transition-colors whitespace-nowrap"
                            :class="selectedRoom === room ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'"
                            @click="selectedRoom = room">
                            {{ room }}
                        </button>
                    </div>
                    <div class="flex items-center gap-3 text-[10px] font-bold text-gray-500 whitespace-nowrap pl-2">
                        <span class="flex items-center gap-1">
                            <div class="w-3 h-3 bg-green-500 rounded-sm"></div> Terisi
                        </span>
                        <span class="flex items-center gap-1">
                            <div class="w-3 h-3 bg-gray-200 rounded-sm"></div> Kosong
                        </span>
                        <span class="flex items-center gap-1">
                            <div class="w-3 h-3 bg-yellow-400 rounded-sm"></div> Rencana Plg
                        </span>
                    </div>
                </div>

                <div v-if="filteredBeds.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="bed in filteredBeds" :key="bed.id" @click="handleBedClick(bed)"
                        class="relative rounded-lg border p-3 transition-all cursor-pointer group h-32 flex flex-col justify-between"
                        :class="[
                            bed.status === 'KOSONG' ? 'bg-gray-50 border-gray-200 border-dashed hover:bg-gray-100' :
                                bed.status === 'PULANG' ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100' :
                                    'bg-white border-gray-200 hover:bg-green-50' // FIX: Hover cuma ganti background, border tetep halus
                        ]">
                        <div class="flex justify-between items-start">
                            <span class="text-xs font-black bg-gray-200 px-2 py-0.5 rounded text-gray-700 shadow-sm">{{
                                bed.no }}</span>

                            <div v-if="bed.status === 'ISI'" class="flex gap-1">
                                <span v-if="bed.alert === 'OBAT'"
                                    class="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse shadow-sm">OBAT</span>
                                <span v-if="bed.alert === 'TTV'"
                                    class="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">TTV</span>
                                <span v-if="bed.alert === 'INFUS'"
                                    class="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">INFUS</span>
                            </div>
                        </div>

                        <div v-if="bed.status !== 'KOSONG'" class="mt-2">
                            <p class="font-bold text-sm text-gray-800 truncate">{{ bed.pasien }}</p>
                            <p class="text-[10px] text-gray-500 flex items-center gap-1">
                                <span :class="bed.gender === 'L' ? 'text-blue-600' : 'text-pink-600'">
                                    {{ bed.gender === 'L' ? 'Lk' : 'Pr' }}
                                </span> • {{ bed.rm }}
                            </p>
                            <p class="text-[10px] text-green-700 font-medium mt-0.5">{{ bed.dpjp }}</p>
                        </div>
                        <div v-else class="flex-1 flex items-center justify-center">
                            <span class="text-xs font-bold text-gray-400 uppercase">Bed Kosong</span>
                        </div>

                        <div v-if="bed.status !== 'KOSONG'"
                            class="absolute inset-0 bg-white/80 hidden group-hover:flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                            <span
                                class="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transform hover:scale-105 transition-transform">Lihat
                                Detail</span>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p class="text-gray-400 text-sm">Tidak ada data bed di ruangan ini.</p>
                </div>
            </div>

            <div class="space-y-4">

                <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200 relative overflow-hidden shadow-sm">
                    <MegaphoneIcon
                        class="absolute -right-4 -top-4 w-20 h-20 text-yellow-100 opacity-50 transform rotate-12" />

                    <h3
                        class="text-[12px] font-black text-yellow-700 uppercase mb-2 flex items-center gap-2 relative z-10">
                        <MegaphoneIcon class="w-4 h-4" /> Pesan Operan (Penting!)
                    </h3>
                    <p
                        class="text-[11px] text-yellow-900 leading-relaxed italic relative z-10 font-medium bg-yellow-100/50 p-2 rounded">
                        "Infus pump Bed 301-B agak macet, tolong dipantau. Stok Cairan RL menipis, sudah amprah ke
                        Farmasi tapi belum datang."
                    </p>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-t-[4px] border-t-green-600">
                    <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3
                            class="text-[12px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                            <ClockIcon class="w-4 h-4 text-green-600" /> Jadwal Tindakan
                        </h3>
                        <span class="text-[10px] font-bold text-red-600 animate-pulse">{{tasks.filter(t => t.status ===
                            'PENDING').length}} Pending</span>
                    </div>

                    <div class="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        <div v-for="(task, i) in tasks" :key="i"
                            class="flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group hover:shadow-sm"
                            :class="task.status === 'DONE' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-green-200'"
                            @click="toggleTask(i)">
                            <div class="flex flex-col items-center gap-1 min-w-[40px]">
                                <span class="font-mono text-xs font-bold text-gray-500">{{ task.jam }}</span>
                                <div v-if="task.status === 'DONE'"
                                    class="text-green-500 transition-transform transform scale-110">
                                    <CheckCircleIcon class="w-5 h-5" />
                                </div>
                                <div v-else class="text-gray-300 group-hover:text-green-500 transition-colors">
                                    <div
                                        class="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-green-500">
                                    </div>
                                </div>
                            </div>
                            <div class="select-none">
                                <p class="text-xs font-bold text-gray-800 transition-all"
                                    :class="{ 'line-through text-gray-400': task.status === 'DONE' }">{{ task.task }}
                                </p>
                                <p class="text-[10px] text-gray-500">{{ task.pasien }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <BaseModal v-model="showBedModal" title="DETAIL PASIEN (QUICK VIEW)" width="max-w-md">
            <div v-if="selectedBed" class="space-y-4">
                <div class="flex items-center gap-3 border-b pb-3">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <UserGroupIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <h4 class="font-bold text-lg text-gray-800">{{ selectedBed.pasien }}</h4>
                        <p class="text-xs text-gray-500">{{ selectedBed.rm }} • {{ selectedBed.gender === 'L' ?
                            'Laki-laki' : 'Perempuan' }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span class="text-gray-400 font-bold uppercase">DPJP Utama</span>
                        <p class="font-bold text-gray-700">{{ selectedBed.dpjp }}</p>
                    </div>
                    <div>
                        <span class="text-gray-400 font-bold uppercase">Kamar / Bed</span>
                        <p class="font-bold text-gray-700">{{ selectedBed.no }}</p>
                    </div>
                    <div>
                        <span class="text-gray-400 font-bold uppercase">Diagnosa Awal</span>
                        <p class="font-bold text-gray-700">Febris H-3</p>
                    </div>
                    <div>
                        <span class="text-gray-400 font-bold uppercase">Diet</span>
                        <p class="font-bold text-gray-700">Bubur Halus</p>
                    </div>
                </div>

                <BaseAlert v-if="selectedBed.alert === 'OBAT'" variant="danger" title="Jadwal Obat!">
                    Pasien ini memiliki jadwal obat injeksi/oral yang belum diberikan. Segera cek menu Asuhan.
                </BaseAlert>
                <BaseAlert v-if="selectedBed.alert === 'INFUS'" variant="info" title="Cek Infus">
                    Cairan infus hampir habis atau macet.
                </BaseAlert>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showBedModal = false">Tutup</BaseButton>
                    <BaseButton @click="goToAsuhan">Buka Asuhan</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>