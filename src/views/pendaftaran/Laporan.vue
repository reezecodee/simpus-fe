<script setup lang="ts">
import { ref, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseInput from '@/components/common/BaseInput.vue'

// --- ICONS ---
import {
    PrinterIcon,
    ArrowDownTrayIcon,
    UsersIcon,
    BanknotesIcon,
    MapIcon,
    DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

// 1. STATE TAB
const activeReport = ref('kunjungan')
const reportTabs = [
    { id: 'kunjungan', name: 'Kunjungan', icon: UsersIcon },
    { id: 'pendapatan', name: 'Pendapatan Karcis', icon: BanknotesIcon },
    { id: 'wilayah', name: 'Distribusi Wilayah', icon: MapIcon },
    { id: 'logistik', name: 'Log No. RM', icon: DocumentDuplicateIcon },
]

// 2. FILTER STATE (Konsisten pakai BaseInput & BaseSelect)
const filters = reactive({
    startDate: '2025-12-01',
    endDate: '2025-12-24',
})

// 3. COLUMN DEFINITIONS
const columnsKunjungan: TableColumn[] = [
    { key: 'tgl', label: 'Tgl Daftar' },
    { key: 'no_rm', label: 'No. RM', align: 'center' },
    { key: 'nama', label: 'Nama Pasien' },
    { key: 'unit', label: 'Unit Tujuan' },
    { key: 'jenis', label: 'Jenis', align: 'center' },
]

// Tambahkan di bagian Column Definitions
const colWilayah: TableColumn[] = [
    { key: 'kelurahan', label: 'Kelurahan / Desa' },
    { key: 'jumlah_pasien', label: 'Jumlah Pasien', align: 'center' },
    { key: 'persentase', label: 'Persentase', align: 'center' },
]

const colLogRM: TableColumn[] = [
    { key: 'waktu', label: 'Waktu Dikeluarkan' },
    { key: 'no_rm', label: 'Nomor RM Baru', align: 'center' },
    { key: 'nama_pasien', label: 'Nama Pasien' },
    { key: 'petugas', label: 'Petugas Pendaftaran' },
]

// Tambahkan Mock Data-nya
const dataWilayah = [
    { kelurahan: 'KEL. URUG', jumlah_pasien: 450, persentase: '35%' },
    { kelurahan: 'KEL. KAWALU', jumlah_pasien: 320, persentase: '25%' },
    { kelurahan: 'LUAR WILAYAH', jumlah_pasien: 120, persentase: '10%' },
]

const dataLogRM = [
    { waktu: '24-12-2025 08:00', no_rm: '00-12-34', nama_pasien: 'ANTON JAYA', petugas: 'ADMIN_01' },
    { waktu: '24-12-2025 08:15', no_rm: '00-12-35', nama_pasien: 'BUDI SUDARSONO', petugas: 'ADMIN_01' },
]

const columnsPendapatan: TableColumn[] = [
    { key: 'tgl', label: 'Waktu' },
    { key: 'nama', label: 'Nama Pasien' },
    { key: 'jenis', label: 'Kategori' },
    { key: 'nominal', label: 'Biaya Karcis', align: 'right' },
]

// 4. MOCK DATA
const dataKunjungan = [
    { tgl: '24-12-2025', no_rm: '00-12-33', nama: 'BUDI SANTOSO', unit: 'POLI UMUM', jenis: 'BPJS' },
]

const dataPendapatan = [
    { tgl: '24-12-2025 08:30', nama: 'SITI AMINAH', jenis: 'UMUM', nominal: 'Rp 10.000' },
    { tgl: '24-12-2025 09:15', nama: 'DEDI KURNIA', jenis: 'UMUM', nominal: 'Rp 10.000' },
]

</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6 pb-20">

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase">Pusat Laporan Pendaftaran</h1>
                <p class="text-[12px] text-gray-500 font-medium">Periode: {{ filters.startDate }} s/d {{ filters.endDate
                    }}</p>
            </div>
            <div class="flex gap-2">
                <BaseButton variant="secondary" :icon="PrinterIcon">Cetak</BaseButton>
                <BaseButton :icon="ArrowDownTrayIcon">Export Excel</BaseButton>
            </div>
        </div>

        <div class="flex bg-white border border-gray-200 p-1 rounded-lg shadow-sm w-fit">
            <button v-for="tab in reportTabs" :key="tab.id" @click="activeReport = tab.id" :class="[
                'flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase transition-all rounded-md',
                activeReport === tab.id ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            ]">
                <component :is="tab.icon" class="w-4 h-4" />
                {{ tab.name }}
            </button>
        </div>

        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm grid grid-cols-4 gap-4">
            <BaseInput v-model="filters.startDate" type="date" label="Dari Tanggal" />
            <BaseInput v-model="filters.endDate" type="date" label="Sampai Tanggal" />
            <BaseSelect label="Shift Kerja" :options="['Semua Shift', 'Pagi', 'Siang', 'Malam']" />
            <div class="flex items-end pb-1">
                <BaseButton class="w-full">Proses Data</BaseButton>
            </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-t-[4px] border-t-green-600">

            <BaseDataTable v-if="activeReport === 'kunjungan'" :columns="columnsKunjungan" :data="dataKunjungan"
                hide-search />

            <BaseDataTable v-if="activeReport === 'pendapatan'" :columns="columnsPendapatan" :data="dataPendapatan"
                hide-search>
                <template #nominal="{ value }">
                    <span class="font-mono font-bold text-green-700">{{ value }}</span>
                </template>
            </BaseDataTable>

            <BaseDataTable v-if="activeReport === 'wilayah'" :columns="colWilayah" :data="dataWilayah" hide-search />

            <BaseDataTable v-if="activeReport === 'logistik'" :columns="colLogRM" :data="dataLogRM" hide-search />

        </div>
    </div>
</template>