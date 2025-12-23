<script setup lang="ts">
import { ref, computed } from 'vue'

// Components
import BaseDataTable, { type TableColumn } from '../components/common/BaseDataTable.vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseSelect from '../components/common/BaseSelect.vue'

// Icons
import { 
  UserPlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

// --- DEFINISI KOLOM ---
const columns: TableColumn[] = [
  { key: 'no_rm', label: 'No. RM', width: '100px' },
  { key: 'nama', label: 'Nama Pasien' },
  { key: 'poli', label: 'Poli Tujuan', width: '120px' },
  { key: 'status', label: 'Status', align: 'center', width: '110px' },
  { key: 'tagihan', label: 'Total Tagihan', align: 'right', width: '130px' },
  { key: 'actions', label: '', align: 'right', width: '80px' }, // Label kosong biar bersih
]

// --- DUMMY DATA ---
const allData = [
  { id: 1, no_rm: '00-12-33', nama: 'Budi Santoso', poli: 'Umum', status: 'Selesai', tagihan: 50000 },
  { id: 2, no_rm: '00-12-34', nama: 'Siti Aminah', poli: 'Gigi', status: 'Menunggu', tagihan: 0 },
  { id: 3, no_rm: '00-12-35', nama: 'Rahmad Hidayat', poli: 'Umum', status: 'Diperiksa', tagihan: 0 },
  { id: 4, no_rm: '00-12-36', nama: 'Joko Widodo', poli: 'KIA', status: 'Selesai', tagihan: 150000 },
  { id: 5, no_rm: '00-12-37', nama: 'Megawati', poli: 'Gizi', status: 'Batal', tagihan: 0 },
  { id: 6, no_rm: '00-12-38', nama: 'Susilo Bambang', poli: 'Umum', status: 'Menunggu', tagihan: 0 },
]

// --- STATE ---
const filterPoli = ref('') 
const poliOptions = [
    { label: 'Semua Poli', value: '' }, 
    { label: 'Poli Umum', value: 'Umum' },
    { label: 'Poli Gigi', value: 'Gigi' },
    { label: 'Poli KIA', value: 'KIA' },
    { label: 'Poli Gizi', value: 'Gizi' }
]

const searchQuery = ref('')
const currentPage = ref(1)

// --- LOGIC ---
const filteredData = computed(() => {
  return allData.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        item.no_rm.includes(searchQuery.value)
    const matchPoli = filterPoli.value === '' ? true : item.poli === filterPoli.value
    return matchSearch && matchPoli
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 p-[20px] font-sans text-gray-800">
    
    <div class="max-w-7xl mx-auto space-y-[20px]">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-bold text-gray-900 tracking-tight">Data Kunjungan Pasien</h1>
          <p class="text-[13px] text-gray-500 mt-1">Kelola data pendaftaran dan rekam medis pasien hari ini.</p>
        </div>
        
        <div class="flex items-center gap-2">
           <BaseButton variant="secondary" :icon="ArrowDownTrayIcon">Export Excel</BaseButton>
           <BaseButton :icon="UserPlusIcon">Pendaftaran Baru</BaseButton>
        </div>
      </div>

      <div class="bg-white rounded-[8px] shadow-sm border border-gray-200 border-t-[4px] border-t-green-600 overflow-hidden">
        
        <div class="bg-gray-50 px-[20px] py-[15px] border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div class="flex items-center gap-2">
            <div class="bg-green-100 p-1.5 rounded text-green-700">
              <FunnelIcon class="w-4 h-4" />
            </div>
            <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Filter & Pencarian</h3>
          </div>

          <div class="w-full md:w-[200px]">
              <BaseSelect 
                v-model="filterPoli" 
                :options="poliOptions" 
                placeholder="Filter Poli..."
              />
           </div>
        </div>

        <div class="p-[20px]">
          <BaseDataTable 
            :columns="columns" 
            :data="filteredData" 
            :total-items="filteredData.length"
            @update:search="(val) => searchQuery = val"
          >
            <template #no_rm="{ value }">
                <span class="font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-[11px] border border-gray-200">{{ value }}</span>
            </template>
            
            <template #poli="{ value }">
                <span class="font-medium text-gray-600">{{ value }}</span>
            </template>

            <template #status="{ value }">
                <BaseBadge 
                  :variant="value === 'Selesai' ? 'success' : value === 'Batal' ? 'danger' : 'warning'" 
                  dot
                >
                  {{ value }}
                </BaseBadge>
            </template>
            
            <template #tagihan="{ value }">
                <div class="font-mono text-[11px] font-bold" :class="value > 0 ? 'text-gray-900' : 'text-gray-400'">
                  Rp {{ value.toLocaleString('id-ID') }}
                </div>
            </template>
            
            <template #actions>
                <div class="flex justify-end gap-[8px]">
                  <button class="text-gray-400 hover:text-blue-600 transition-colors" title="Edit Data">
                    <PencilSquareIcon class="w-[16px] h-[16px]" />
                  </button>
                  <button class="text-gray-400 hover:text-red-600 transition-colors" title="Hapus Data">
                    <TrashIcon class="w-[16px] h-[16px]" />
                  </button>
                </div>
            </template>

          </BaseDataTable>
        </div>

        <div class="bg-gray-50 px-[20px] py-[10px] border-t border-gray-200 text-[11px] text-gray-500 flex justify-between">
           <span>Terakhir diperbarui: 24 Des 2025, 10:00 WIB</span>
           <span>Menampilkan {{ filteredData.length }} baris data</span>
        </div>

      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
         <div class="bg-white p-[15px] rounded-[8px] border border-gray-200 shadow-sm border-l-[4px] border-l-blue-500">
            <p class="text-[11px] text-gray-500 uppercase font-bold">Total Pasien</p>
            <p class="text-[20px] font-bold text-gray-800">124 <span class="text-[12px] font-normal text-green-600">▲ 12%</span></p>
         </div>
         <div class="bg-white p-[15px] rounded-[8px] border border-gray-200 shadow-sm border-l-[4px] border-l-green-500">
            <p class="text-[11px] text-gray-500 uppercase font-bold">Pasien Selesai</p>
            <p class="text-[20px] font-bold text-gray-800">89</p>
         </div>
         <div class="bg-white p-[15px] rounded-[8px] border border-gray-200 shadow-sm border-l-[4px] border-l-orange-500">
            <p class="text-[11px] text-gray-500 uppercase font-bold">Menunggu Dokter</p>
            <p class="text-[20px] font-bold text-gray-800">35</p>
         </div>
      </div>

    </div>
  </div>
</template>