<script setup lang="ts">
import { ref } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseInput from '@/components/common/BaseInput.vue'

// --- ICONS ---
import { 
  ArrowsRightLeftIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA & STATE
// ==========================================
const columns: TableColumn[] = [
  { key: 'tgl_shift', label: 'Tgl & Jam Tutup', width: '180px' },
  { key: 'nama_kasir', label: 'Nama Kasir' },
  { key: 'total_sistem', label: 'Saldo Sistem', align: 'right' },
  { key: 'total_fisik', label: 'Uang Fisik', align: 'right' },
  { key: 'selisih', label: 'Selisih', align: 'right' },
  { key: 'status', label: 'Status Verifikasi', align: 'center' },
  { key: 'actions', label: '', align: 'right' },
]

const setoranData = ref([
  { 
    id: 1, 
    tgl_shift: '24/12/2025 14:00', 
    nama_kasir: 'Samsul Arifin', 
    total_sistem: 1250000, 
    total_fisik: 1250000, 
    selisih: 0, 
    status: 'PENDING' 
  },
  { 
    id: 2, 
    tgl_shift: '24/12/2025 14:05', 
    nama_kasir: 'Atyla Azfa', 
    total_sistem: 2450000, 
    total_fisik: 2445000, 
    selisih: -5000, 
    status: 'PENDING',
    catatan: 'Salah kembalian pasien ke-12'
  },
  { 
    id: 3, 
    tgl_shift: '23/12/2025 21:00', 
    nama_kasir: 'Rina Rahayu', 
    total_sistem: 3100000, 
    total_fisik: 3100000, 
    selisih: 0, 
    status: 'VERIFIED' 
  },
])

const handleVerify = (id: number) => {
  const item = setoranData.value.find(d => d.id === id)
  if (item?.selisih !== 0) {
    if (!confirm(`Ada selisih sebesar Rp ${item?.selisih.toLocaleString()}. Tetap verifikasi?`)) return
  }
  alert(`Setoran ID: ${id} Berhasil Diverifikasi & Masuk Brankas Pusat.`)
}
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Verifikasi Setoran Kasir</h1>
        <p class="text-[12px] text-gray-500">Rekonsiliasi harian untuk validasi uang fisik dari Kasir.</p>
      </div>
      <div class="flex gap-3 items-center">
        <div class="text-right">
          <p class="text-[10px] font-black text-gray-400 uppercase">Belum Diverifikasi</p>
          <p class="text-sm font-bold text-red-600">Rp 3.695.000</p>
        </div>
        <div class="h-8 w-[1px] bg-gray-200"></div>
        <ArrowsRightLeftIcon class="w-8 h-8 text-gray-300" />
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex gap-4 items-end">
      <div class="flex-1">
        <BaseInput label="Cari Kasir" placeholder="Nama petugas..." :icon="MagnifyingGlassIcon" />
      </div>
      <div class="w-48">
        <BaseInput label="Tanggal" type="date" />
      </div>
      <BaseButton variant="secondary">Tampilkan</BaseButton>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
      <BaseDataTable :columns="columns" :data="setoranData" hide-search>
        
        <template #total_sistem="{ value }">
          <span class="font-mono text-[12px] text-gray-600">Rp {{ value.toLocaleString() }}</span>
        </template>

        <template #total_fisik="{ value }">
          <span class="font-mono text-[12px] font-bold text-gray-900">Rp {{ value.toLocaleString() }}</span>
        </template>

        <template #selisih="{ value, row }">
          <div class="flex flex-col items-end">
            <span :class="['font-mono text-[12px] font-black', value < 0 ? 'text-red-600' : value > 0 ? 'text-blue-600' : 'text-green-600']">
              {{ value > 0 ? '+' : '' }}{{ value.toLocaleString() }}
            </span>
            <span v-if="row.catatan" class="text-[9px] text-gray-400 italic">{{ row.catatan }}</span>
          </div>
        </template>

        <template #status="{ value }">
          <BaseBadge :variant="value === 'VERIFIED' ? 'success' : 'warning'">
            {{ value === 'VERIFIED' ? 'DITERIMA' : 'PENDING' }}
          </BaseBadge>
        </template>

        <template #actions="{ row }">
          <div class="flex gap-2 justify-end">
            <BaseButton size="sm" variant="secondary" :icon="DocumentMagnifyingGlassIcon" title="Lihat Pecahan Uang" />
            
            <BaseButton 
              v-if="row.status === 'PENDING'"
              size="sm" 
              variant="primary" 
              class="bg-green-600 hover:bg-green-700"
              @click="handleVerify(row.id)"
            >
              Terima Uang
            </BaseButton>
          </div>
        </template>

      </BaseDataTable>
    </div>

    <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
      <ExclamationTriangleIcon class="w-5 h-5 text-blue-500 shrink-0" />
      <div class="text-[11px] text-blue-800">
        <p class="font-bold uppercase">Panduan Rekonsiliasi:</p>
        <p>Klik <strong>"Terima Uang"</strong> jika Anda sudah menerima fisik uang secara tunai dari kasir tersebut. Jika ada selisih, pastikan kasir sudah memberikan keterangan yang jelas di kolom catatan.</p>
      </div>
    </div>

  </div>
</template>