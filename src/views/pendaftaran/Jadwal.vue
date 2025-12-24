<script setup lang="ts">
import { ref, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'

// --- ICONS ---
import {
    CalendarDaysIcon,
    ListBulletIcon,
    ClockIcon,
    UserGroupIcon,
    ArrowPathIcon,
    CheckIcon
} from '@heroicons/vue/24/outline'
import BaseModal from '@/components/common/BaseModal.vue'

// 1. STATE MANAGEMENT
const viewMode = ref('table') // 'table' atau 'calendar'
const selectedUnit = ref('SEMUA UNIT')

// 2. SUMMARY DATA (SHIFT SAAT INI)
const currentDuty = [
    { shift: 'PAGI', time: '07:30 - 14:00', petugas: '4 Orang', color: 'text-orange-600', bg: 'bg-orange-50' },
    { shift: 'SIANG', time: '14:00 - 21:00', petugas: '3 Orang', color: 'text-blue-600', bg: 'bg-blue-50' },
    { shift: 'MALAM', time: '21:00 - 07:30', petugas: '2 Orang', color: 'text-purple-600', bg: 'bg-purple-50' },
]

// 3. TABLE CONFIG
const columns: TableColumn[] = [
    { key: 'nama', label: 'Nama Petugas / Staf' },
    { key: 'unit', label: 'Unit Kerja' },
    { key: 'shift', label: 'Shift', align: 'center' },
    { key: 'jam', label: 'Jam Kerja', align: 'center' },
    { key: 'status', label: 'Status', align: 'center' },
]

const jadwalData = [
    { nama: 'ATYLA AZFA', unit: 'PENDAFTARAN', shift: 'PAGI', jam: '07:30 - 14:00', status: 'BERTUGAS' },
    { nama: 'BUDI SANTOSO', unit: 'POLI UMUM', shift: 'PAGI', jam: '07:30 - 14:00', status: 'BERTUGAS' },
    { nama: 'SITI AMINAH', unit: 'APOTEK', shift: 'SIANG', jam: '14:00 - 21:00', status: 'BELUM MULAI' },
    { nama: 'DEDI KURNIA', unit: 'LABORATORIUM', shift: 'OFF', jam: '-', status: 'LIBUR' },
]

const handleRefresh = () => {
    alert('Memperbarui data jadwal...')
}

// 4. MODAL ATUR JADWAL
const showModalJadwal = ref(false)

const formJadwal = reactive({
    range_tanggal: '', // Kita pakai BaseInput type="date" untuk start & end
    staf_id: '',
    unit_id: '',
    shift: 'PAGI',
    keterangan: '',
    tgl_mulai: '',
    tgl_selesai: ''
})

const handleSimpanJadwal = () => {
    // Logic simpan ke database disini
    alert(`Jadwal untuk ${formJadwal.shift} berhasil dibuat!`)
    showModalJadwal.value = false
}

// 5. CALENDAR
// Data Simulasi Jadwal Bulanan
const calendarDays = ref([
    { date: 22, month: 'Des', shifts: [{ name: 'Atyla', type: 'PAGI' }, { name: 'Budi', type: 'SIANG' }] },
    { date: 23, month: 'Des', shifts: [{ name: 'Budi', type: 'PAGI' }, { name: 'Siti', type: 'SIANG' }] },
    { date: 24, month: 'Des', shifts: [{ name: 'Atyla', type: 'PAGI' }, { name: 'Siti', type: 'SIANG' }] },
    { date: 25, month: 'Des', shifts: [{ name: 'Siti', type: 'PAGI' }, { name: 'Budi', type: 'SIANG' }] },
    { date: 26, month: 'Des', shifts: [{ name: 'Dedi', type: 'MALAM' }] },
    { date: 27, month: 'Des', shifts: [], isOff: true }, // Hari Libur
    { date: 28, month: 'Des', shifts: [], isOff: true },
])

// Helper warna shift
const getShiftClass = (type: string) => {
    switch (type) {
        case 'PAGI': return 'bg-orange-100 text-orange-700 border-orange-200'
        case 'SIANG': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'MALAM': return 'bg-purple-100 text-purple-700 border-purple-200'
        default: return 'bg-gray-100 text-gray-700'
    }
}
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6 pb-20">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 tracking-tight uppercase">Manajemen Jadwal & Shift</h1>
                <p class="text-[12px] text-gray-500 font-medium italic">Puskesmas Urug - Rabu, 24 Desember 2025</p>
            </div>
            <div class="flex gap-2">
                <BaseButton variant="secondary" :icon="ArrowPathIcon" @click="handleRefresh">Refresh</BaseButton>
                <BaseButton :icon="CalendarDaysIcon" @click="showModalJadwal = true">Atur Jadwal Baru</BaseButton>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="s in currentDuty" :key="s.shift"
                class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div :class="['p-2.5 rounded-md', s.bg]">
                        <ClockIcon :class="['w-5 h-5', s.color]" />
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shift {{ s.shift }}</p>
                        <p class="text-[13px] font-bold text-gray-800">{{ s.time }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-[14px] font-bold text-gray-900">{{ s.petugas }}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase">On Duty</p>
                </div>
            </div>
        </div>

        <div
            class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex bg-gray-100 p-1 rounded-md w-fit">
                <button @click="viewMode = 'table'" :class="['flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold uppercase rounded transition-all',
                    viewMode === 'table' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                    <ListBulletIcon class="w-4 h-4" /> Daftar Tabel
                </button>
                <button @click="viewMode = 'calendar'"
                    :class="['flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold uppercase rounded transition-all',
                        viewMode === 'calendar' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                    <CalendarDaysIcon class="w-4 h-4" /> Kalender Bulanan
                </button>
            </div>

            <div class="flex items-center gap-4">
                <div class="w-48">
                    <BaseSelect v-model="selectedUnit"
                        :options="['SEMUA UNIT', 'PENDAFTARAN', 'POLI UMUM', 'APOTEK']" />
                </div>
            </div>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden border-t-[4px] border-t-green-600">

            <div v-if="viewMode === 'table'" class="p-4">
                <div class="flex items-center gap-2 px-4 py-3 mb-2 bg-gray-50 border border-gray-100 rounded-md">
                    <UserGroupIcon class="w-4 h-4 text-gray-400" />
                    <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Petugas Aktif Hari
                        Ini</span>
                </div>

                <BaseDataTable :columns="columns" :data="jadwalData" hide-search>
                    <template #nama="{ value }">
                        <span class="font-bold text-gray-800">{{ value }}</span>
                    </template>

                    <template #unit="{ value }">
                        <span
                            class="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase">
                            {{ value }}
                        </span>
                    </template>

                    <template #status="{ value }">
                        <BaseBadge
                            :variant="value === 'BERTUGAS' ? 'success' : (value === 'LIBUR' ? 'danger' : 'warning')">
                            {{ value }}
                        </BaseBadge>
                    </template>
                </BaseDataTable>
            </div>

            <div v-else class="p-4 bg-gray-50/50 min-h-[600px]">

                <div class="grid grid-cols-7 gap-px mb-px border-b border-gray-200 bg-white">
                    <div v-for="day in ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']" :key="day"
                        class="py-3 text-center text-[13px] font-bold uppercase">
                        {{ day }}
                    </div>
                </div>

                <div class="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 shadow-inner">
                    <div v-for="d in 31" :key="d"
                        class="min-h-[120px] bg-white p-2 hover:bg-gray-50 transition-colors group relative">

                        <div class="flex justify-between items-start mb-2">
                            <span
                                :class="['text-[12px] font-bold', d === 24 ? 'text-green-600 bg-green-50 px-1.5 rounded' : 'text-gray-400']">
                                {{ d }}
                            </span>
                            <PlusIcon v-if="d >= 24"
                                class="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 cursor-pointer transition"
                                @click="showModalJadwal = true" />
                        </div>

                        <div class="space-y-1">
                            <template v-if="calendarDays[d - 22]">
                                <div v-for="s in calendarDays[d - 22]?.shifts" :key="s.name"
                                    :class="['text-[9px] font-bold px-1.5 py-0.5 rounded border truncate flex justify-between', getShiftClass(s.type)]">
                                    <span>{{ s.name }}</span>
                                    <span class="opacity-50 uppercase">{{ s.type[0] }}</span>
                                </div>

                                <div v-if="calendarDays[d - 22]?.isOff"
                                    class="text-[9px] text-gray-300 text-center py-4 font-bold uppercase tracking-tighter">
                                    Libur / Off
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <BaseModal v-model="showModalJadwal" title="Atur Penugasan Staf / Shift" width="max-w-xl">
            <div class="space-y-5 p-1">

                <div class="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3">
                    <ClockIcon class="w-5 h-5 text-blue-500 shrink-0" />
                    <p class="text-[11px] text-blue-700 leading-relaxed">
                        <strong>Tips:</strong> Pilih rentang tanggal untuk memberikan penugasan shift yang sama dalam
                        beberapa
                        hari sekaligus (Bulk Input).
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <BaseInput type="date" label="Mulai Tanggal" v-model="formJadwal.tgl_mulai" />
                    <BaseInput type="date" label="Sampai Tanggal" v-model="formJadwal.tgl_selesai" />

                    <BaseSelect label="Unit Kerja" v-model="formJadwal.unit_id"
                        :options="['Pendaftaran', 'Poli Umum', 'Poli Gigi', 'Apotek', 'Laboratorium']" />
                    <BaseSelect label="Nama Staf" v-model="formJadwal.staf_id"
                        :options="['Atyla Azfa', 'Budi Santoso', 'Siti Aminah', 'Dedi Kurnia']" />

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-widest">Pilih
                            Shift
                            Kerja</label>
                        <div class="grid grid-cols-3 gap-2">
                            <button v-for="s in ['PAGI', 'SIANG', 'MALAM', 'OFF']" :key="s"
                                @click="formJadwal.shift = s" type="button" :class="[
                                    'py-2.5 text-[11px] font-bold rounded-md border transition-all',
                                    formJadwal.shift === s
                                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                                ]">
                                {{ s }}
                            </button>
                        </div>
                    </div>

                    <div class="col-span-2">
                        <BaseInput label="Keterangan (Opsional)" placeholder="Misal: Tukar shift dengan si A..."
                            v-model="formJadwal.keterangan" />
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModalJadwal = false">Batal</BaseButton>
                    <BaseButton @click="handleSimpanJadwal" :icon="CheckIcon">Simpan Penugasan</BaseButton>
                </div>
            </template>
        </BaseModal>
    </div>
</template>