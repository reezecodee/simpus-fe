<script setup lang="ts">
import { ref, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'

// --- ICONS ---
import {
    ClipboardDocumentCheckIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    CheckBadgeIcon,
    ExclamationCircleIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA & STATE
// ==========================================
const filterStatus = ref('SEMUA')

const columns: TableColumn[] = [
    { key: 'no_sep', label: 'No. SEP / Referensi', width: '180px' },
    { key: 'tgl_layanan', label: 'Tgl Layanan' },
    { key: 'nama_pasien', label: 'Nama Pasien' },
    { key: 'diagnosa', label: 'Diagnosa Utama' },
    { key: 'nominal', label: 'Tagihan Klaim', align: 'right' },
    { key: 'status', label: 'Status Klaim', align: 'center' },
    { key: 'actions', label: '', align: 'right' },
]

const piutangData = ref([
    {
        id: 1,
        no_sep: '0001R0011225V001',
        tgl_layanan: '24/12/2025',
        nama_pasien: 'BUDI SANTOSO',
        diagnosa: 'Common Cold (J00)',
        nominal: 125000,
        status: 'TERKIRIM'
    },
    {
        id: 2,
        no_sep: '0001R0011225V002',
        tgl_layanan: '24/12/2025',
        nama_pasien: 'SITI AMINAH',
        diagnosa: 'Pulpitis (K04.0)',
        nominal: 210000,
        status: 'LUNAS'
    },
    {
        id: 3,
        no_sep: '0001R0011225V003',
        tgl_layanan: '23/12/2025',
        nama_pasien: 'DEDI KURNIA',
        diagnosa: 'Hypertension (I10)',
        nominal: 85000,
        status: 'PENDING'
    },
])

// ==========================================
// 2. SUMMARY CALCULATION
// ==========================================
const totalPiutangBelumCair = computed(() => {
  return piutangData.value
    .filter(item => item.status !== 'LUNAS')
    .reduce((acc, curr) => acc + curr.nominal, 0)
})

const totalPiutangLunas = computed(() => {
  return piutangData.value
    .filter(item => item.status === 'LUNAS')
    .reduce((acc, curr) => acc + curr.nominal, 0)
})

const handleVerify = (id: number) => {
    alert(`Memverifikasi status klaim ID: ${id} ke portal BPJS...`)
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-start">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Monitoring Piutang BPJS</h1>
                <p class="text-[12px] text-gray-500">Lacak status klaim dan penagihan piutang ke BPJS Kesehatan.</p>
            </div>
            <div class="flex gap-2">
                <BaseButton variant="secondary" :icon="ArrowPathIcon">Sinkron VClaim</BaseButton>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div
                class="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between shadow-sm border-t-[4px] border-t-orange-500">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-orange-50 rounded-lg">
                        <ExclamationCircleIcon class="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-600 uppercase tracking-wider">Piutang Belum Cair</p>
                        <p class="text-2xl font-black text-gray-900 font-mono">Rp {{
                            totalPiutangBelumCair.toLocaleString('id-ID') }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <BaseBadge variant="warning">Pending/Terkirim</BaseBadge>
                </div>
            </div>

            <div
                class="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between shadow-sm border-t-[4px] border-t-green-600">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-green-50 rounded-lg">
                        <CheckBadgeIcon class="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-600 uppercase tracking-wider">Piutang Sudah Cair</p>
                        <p class="text-2xl font-black text-green-700 font-mono">Rp {{
                            totalPiutangLunas.toLocaleString('id-ID') }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <BaseBadge variant="success">Lunas</BaseBadge>
                </div>
            </div>

        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-1 w-full">
                <BaseInput label="Cari Pasien / No. SEP" placeholder="Masukkan kata kunci..."
                    :icon="MagnifyingGlassIcon" />
            </div>
            <div class="w-full md:w-48">
                <BaseSelect label="Status Klaim" v-model="filterStatus"
                    :options="['SEMUA', 'PENDING', 'TERKIRIM', 'LUNAS', 'DITOLAK']" />
            </div>
            <BaseButton class="w-full md:w-auto">Filter</BaseButton>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <BaseDataTable :columns="columns" :data="piutangData" hide-search>

                <template #no_sep="{ value }">
                    <span class="font-mono text-[11px] font-bold text-blue-600">{{ value }}</span>
                </template>

                <template #nominal="{ value }">
                    <span class="font-mono font-bold text-gray-900">Rp {{ value.toLocaleString('id-ID') }}</span>
                </template>

                <template #status="{ value }">
                    <span
                        :class="['text-[10px] font-bold px-2 py-0.5 rounded border uppercase',
                            value === 'LUNAS' ? 'bg-green-50 text-green-600 border-green-100' :
                                value === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    value === 'DITOLAK' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100']">
                        {{ value }}
                    </span>
                </template>

                <template #actions="{ row }">
                    <div class="flex gap-2 justify-end">
                        <BaseButton size="sm" variant="secondary" :icon="ArrowTopRightOnSquareIcon"
                            title="Buka VClaim" />
                        <BaseButton v-if="row.status !== 'LUNAS'" size="sm" :icon="CheckBadgeIcon"
                            @click="handleVerify(row.id)">Cairkan</BaseButton>
                    </div>
                </template>

            </BaseDataTable>
        </div>

    </div>
</template>