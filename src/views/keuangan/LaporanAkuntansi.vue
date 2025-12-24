<script setup lang="ts">
import { ref, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseInput from '@/components/common/BaseInput.vue'

// --- ICONS ---
import { 
  ArrowDownTrayIcon,
  PrinterIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA REKAP
// ==========================================
const columns: TableColumn[] = [
  { key: 'bulan', label: 'Periode Bulan', width: '150px' },
  { key: 'pendapatan', label: 'Total Pendapatan', align: 'right' },
  { key: 'pengeluaran', label: 'Total Pengeluaran', align: 'right' },
  { key: 'laba_bersih', label: 'Laba/Rugi Bersih', align: 'right' },
  { key: 'margin', label: 'Margin %', align: 'center' },
]

const laporanData = ref([
  { id: 1, bulan: 'Desember 2025', pendapatan: 45000000, pengeluaran: 12500000 },
  { id: 2, bulan: 'November 2025', pendapatan: 38000000, pengeluaran: 10200000 },
  { id: 3, bulan: 'Oktober 2025', pendapatan: 42000000, pengeluaran: 15600000 },
])

// ==========================================
// 2. LOGIC
// ==========================================
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const calculateProfit = (income: number, expense: number) => income - expense
const calculateMargin = (income: number, expense: number) => {
  return ((income - expense) / income * 100).toFixed(1) + '%'
}
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex justify-between items-center px-1">
      <div>
        <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Laporan Keuangan Bulanan</h1>
        <p class="text-[12px] text-gray-500">Rekapitulasi Laba Rugi Puskesmas.</p>
      </div>
      <div class="flex gap-2 text-white">
        <BaseButton variant="secondary" :icon="PrinterIcon">Cetak PDF</BaseButton>
        <BaseButton variant="primary" :icon="ArrowDownTrayIcon">Export Excel</BaseButton>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-green-600">
        <div class="flex justify-between items-start mb-2">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pendapatan</p>
          <ArrowTrendingUpIcon class="w-5 h-5 text-green-600" />
        </div>
        <p class="text-2xl font-black text-gray-900 font-mono tracking-tighter">{{ formatCurrency(125000000) }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-green-600">
        <div class="flex justify-between items-start mb-2">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pengeluaran</p>
          <ArrowTrendingDownIcon class="w-5 h-5 text-red-500" />
        </div>
        <p class="text-2xl font-black text-gray-900 font-mono tracking-tighter">{{ formatCurrency(38300000) }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-green-600 bg-green-50/20">
        <div class="flex justify-between items-start mb-2">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimasi Laba Bersih</p>
          <BanknotesIcon class="w-5 h-5 text-green-600" />
        </div>
        <p class="text-2xl font-black text-green-700 font-mono tracking-tighter">{{ formatCurrency(86700000) }}</p>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
      <div class="flex justify-between items-center mb-6 px-2">
        <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <CalendarDaysIcon class="w-4 h-4 text-green-600" /> Riwayat Keuangan
        </h3>
        <div class="w-48">
          <BaseInput type="number" placeholder="Tahun 2025" size="sm" />
        </div>
      </div>

      <BaseDataTable :columns="columns" :data="laporanData" hide-search>
        <template #bulan="{ value }">
          <span class="text-[12px] font-bold text-gray-800 uppercase tracking-tight">{{ value }}</span>
        </template>

        <template #pendapatan="{ value }">
          <span class="font-mono text-[13px] text-gray-900 font-bold">{{ formatCurrency(value) }}</span>
        </template>

        <template #pengeluaran="{ value }">
          <span class="font-mono text-[13px] text-red-600 font-bold">- {{ formatCurrency(value) }}</span>
        </template>

        <template #laba_bersih="{ row }">
          <span class="font-mono text-[14px] font-black text-green-700">
            {{ formatCurrency(calculateProfit(row.pendapatan, row.pengeluaran)) }}
          </span>
        </template>

        <template #margin="{ row }">
          <div class="bg-gray-100 rounded px-2 py-0.5 inline-block border border-gray-200">
            <span class="text-[10px] font-black text-gray-700 uppercase">
              {{ calculateMargin(row.pendapatan, row.pengeluaran) }}
            </span>
          </div>
        </template>
      </BaseDataTable>
    </div>

    <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
      <p class="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
        Laporan ini di-generate secara real-time berdasarkan data verifikasi setoran dan pengeluaran operasional.
      </p>
    </div>

  </div>
</template>