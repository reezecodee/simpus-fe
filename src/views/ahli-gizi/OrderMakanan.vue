<script setup lang="ts">
import { ref, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'

// --- ICONS ---
import {
    PrinterIcon,
    TagIcon,
    FunnelIcon,
    CheckBadgeIcon,
    ExclamationCircleIcon,
    ClipboardDocumentListIcon,
    FireIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

const selectedWaktu = ref('SIANG')
const selectedDietFilter = ref('ALL')

const waktuOptions = [
    { value: 'PAGI', label: 'Makan Pagi (Breakfast) - 06:00' },
    { value: 'SIANG', label: 'Makan Siang (Lunch) - 12:00' },
    { value: 'SORE', label: 'Makan Sore (Dinner) - 17:00' },
]

// Data Order Makan (Dummy)
const orders = ref([
    {
        id: 'ORD-001', pasien: 'Tn. Budi Santoso', kamar: '301 (Vip)',
        jenis: 'Nasi Lunak', diet: 'Diet DM 1700 Kkal',
        extra: '-', status: 'PRINTED'
    },
    {
        id: 'ORD-002', pasien: 'Ny. Siti Aminah', kamar: '302 (Kls 1)',
        jenis: 'Nasi Tim', diet: 'Diet Rendah Garam',
        extra: 'Alergi Telur', status: 'WAITING'
    },
    {
        id: 'ORD-003', pasien: 'An. Dede', kamar: '305 (Anak)',
        jenis: 'Bubur Saring', diet: 'TKTP (Tinggi Kalori)',
        extra: '-', status: 'WAITING'
    },
    {
        id: 'ORD-004', pasien: 'Tn. Joko', kamar: 'IGD-01',
        jenis: 'Nasi Biasa', diet: 'Diet Sehat',
        extra: 'Pedas dikurangi', status: 'WAITING'
    },
    {
        id: 'ORD-005', pasien: 'Nn. Rina', kamar: 'Kls 3.1',
        jenis: 'Nasi Biasa', diet: 'Diet Sehat',
        extra: '-', status: 'PRINTED'
    },
    {
        id: 'ORD-006', pasien: 'Tn. Ginjal', kamar: 'Kls 2.5',
        jenis: 'Nasi Lunak', diet: 'Rendah Protein',
        extra: '-', status: 'WAITING'
    }
])

const columns: TableColumn[] = [
    { key: 'pasien', label: 'Pasien & Kamar' },
    { key: 'jenis', label: 'Bentuk Makanan', width: '150px' },
    { key: 'diet', label: 'Jenis Diet' },
    { key: 'extra', label: 'Catatan / Alergi' },
    { key: 'status', label: 'Status Label', align: 'center', width: '120px' },
    { key: 'actions', label: '', align: 'right' },
]

// ==========================================
// 2. LOGIC
// ==========================================

// Filter Data Tabel
const filteredOrders = computed(() => {
    let data = orders.value
    if (selectedDietFilter.value !== 'ALL') {
        data = data.filter(o => o.jenis === selectedDietFilter.value)
    }
    return data
})

// Hitung Rekap Dapur (Grouping)
const kitchenSummary = computed(() => {
    const summary: Record<string, number> = {}

    orders.value.forEach(order => {
        const key = order.jenis
        // FIX: Pakai logika (Nilai Lama ATAU 0) + 1
        // Ini dijamin aman dari error "possibly undefined"
        summary[key] = (summary[key] || 0) + 1
    })

    return Object.entries(summary).map(([key, value]) => ({
        jenis: key,
        jumlah: value
    }))
})

// Actions
const handlePrintAll = () => {
    alert(`Mencetak SEMUA label untuk waktu makan: ${selectedWaktu.value}`)
    // Simulasi update status jadi PRINTED semua
    orders.value.forEach(o => o.status = 'PRINTED')
}

const handlePrintRekap = () => {
    alert('Mencetak Lembar Rekapitulasi Produksi untuk Koki...')
}

const handlePrintSingle = (row: any) => {
    alert(`Reprint Label untuk pasien: ${row.pasien}`)
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Order & Label Makanan</h1>
                <p class="text-[12px] text-gray-500">Rekapitulasi produksi dapur dan cetak etiket diet pasien.</p>
            </div>

            <div class="w-full md:w-64">
                <BaseSelectSearch v-model="selectedWaktu" :options="waktuOptions" class="!mb-0" />
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-2 space-y-4">

                <div class="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
                    <FunnelIcon class="w-4 h-4 text-gray-500 ml-2" />
                    <span class="text-xs font-bold text-gray-600 mr-2">Filter Bentuk:</span>
                    <button v-for="type in ['ALL', 'Nasi Biasa', 'Nasi Lunak', 'Bubur Saring']" :key="type"
                        @click="selectedDietFilter = type"
                        class="px-3 py-1 text-[10px] font-bold rounded-full transition-all border"
                        :class="selectedDietFilter === type ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'">
                        {{ type === 'ALL' ? 'Semua' : type }}
                    </button>
                </div>

                <div
                    class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
                    <BaseDataTable :columns="columns" :data="filteredOrders" hide-search>

                        <template #pasien="{ row }">
                            <div>
                                <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.pasien }}</p>
                                <span
                                    class="text-[10px] font-mono text-gray-500 bg-gray-100 px-1 rounded border border-gray-200">{{
                                        row.kamar }}</span>
                            </div>
                        </template>

                        <template #jenis="{ value }">
                            <span class="font-bold text-[11px] text-green-700">{{ value }}</span>
                        </template>

                        <template #diet="{ value }">
                            <span class="text-[11px] text-gray-600">{{ value }}</span>
                        </template>

                        <template #extra="{ value }">
                            <span v-if="value !== '-'"
                                class="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1 w-fit">
                                <ExclamationCircleIcon class="w-3 h-3" /> {{ value }}
                            </span>
                            <span v-else class="text-gray-300">-</span>
                        </template>

                        <template #status="{ value }">
                            <span v-if="value === 'PRINTED'"
                                class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-green-100 text-green-700 border border-green-200">
                                <CheckBadgeIcon class="w-3 h-3" /> SUDAH CETAK
                            </span>
                            <span v-else
                                class="flex items-center gap-1 justify-center px-2 py-0.5 rounded text-[9px] font-black bg-yellow-100 text-yellow-700 border border-yellow-200 animate-pulse">
                                <PrinterIcon class="w-3 h-3" /> BELUM
                            </span>
                        </template>

                        <template #actions="{ row }">
                            <div class="text-right">
                                <button @click="handlePrintSingle(row)"
                                    class="text-gray-400 hover:text-green-600 transition" title="Cetak Ulang">
                                    <PrinterIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </template>

                    </BaseDataTable>
                </div>
            </div>

            <div class="space-y-4">

                <div
                    class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-t-[4px] border-t-emerald-500">
                    <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h3
                            class="text-[12px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                            <FireIcon class="w-4 h-4 text-orange-500" /> Total Produksi
                        </h3>
                        <span class="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">{{ selectedWaktu
                        }}</span>
                    </div>

                    <div class="space-y-2">
                        <div v-for="(item, i) in kitchenSummary" :key="i"
                            class="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                            <span class="text-xs font-bold text-gray-700">{{ item.jenis }}</span>
                            <span
                                class="text-sm font-mono font-bold text-emerald-600 bg-white px-2 rounded border border-gray-200 shadow-sm">{{
                                    item.jumlah }}</span>
                        </div>
                    </div>

                    <div
                        class="mt-4 bg-emerald-50 p-3 rounded border border-emerald-100 flex justify-between items-center">
                        <span class="text-xs font-bold text-emerald-800 uppercase">Total Porsi</span>
                        <span class="text-xl font-black text-emerald-700">{{ orders.length }}</span>
                    </div>
                </div>

                <div class="bg-green-600 rounded-lg p-4 shadow-lg text-white">
                    <h3 class="font-bold text-sm mb-3 flex items-center gap-2 border-b border-white/20 pb-2">
                        <PrinterIcon class="w-4 h-4" /> Pusat Cetak
                    </h3>

                    <div class="space-y-3">
                        <button @click="handlePrintAll"
                            class="w-full bg-white text-green-700 font-bold text-xs py-3 rounded shadow hover:bg-gray-100 transition flex items-center justify-center gap-2">
                            <TagIcon class="w-4 h-4" />
                            CETAK SEMUA LABEL
                        </button>

                        <button @click="handlePrintRekap"
                            class="w-full bg-green-700 text-white border border-white/30 font-bold text-xs py-3 rounded shadow hover:bg-green-800 transition flex items-center justify-center gap-2">
                            <ClipboardDocumentListIcon class="w-4 h-4" />
                            CETAK REKAP KOKI
                        </button>
                    </div>

                    <p class="text-[9px] text-center mt-3 text-green-100 opacity-80">
                        *Pastikan printer label thermal sudah terkoneksi.
                    </p>
                </div>

            </div>

        </div>
    </div>
</template>