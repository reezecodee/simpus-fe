<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'

// --- ICONS ---
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  UserGroupIcon,
  ClockIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const searchQuery = ref('')

// Statistik Bangsal (Konsisten dengan gaya Triage)
const stats = ref([
  { title: 'Total Pasien', value: 24, label: 'Kapasitas Terisi', icon: UserGroupIcon, color: 'text-blue-600', border: 'border-t-blue-500', bgIcon: 'bg-blue-50' },
  { title: 'Pasien Kritis', value: 2, label: 'Perlu Atensi', icon: ExclamationTriangleIcon, color: 'text-red-600', border: 'border-t-red-500', bgIcon: 'bg-red-50' },
  { title: 'Observasi', value: 5, label: 'Stabil Bersyarat', icon: ClockIcon, color: 'text-orange-600', border: 'border-t-orange-500', bgIcon: 'bg-orange-50' },
  { title: 'Rencana Pulang', value: 3, label: 'Discharge', icon: CheckBadgeIcon, color: 'text-green-600', border: 'border-t-green-500', bgIcon: 'bg-green-50' },
])

const patients = ref([
  { id: '1', bed: '301-A', nama: 'Tn. Budi Santoso', rm: 'RM-12345', diagnosa: 'DHF Grade II', status: 'Kritis' },
  { id: '2', bed: '302-B', nama: 'Ny. Siti Aminah', rm: 'RM-88821', diagnosa: 'Diabetes Melitus', status: 'Stabil' },
  { id: '3', bed: 'VIP-01', nama: 'An. Dede', rm: 'RM-55123', diagnosa: 'Diare Akut', status: 'Stabil' },
])

const columns: TableColumn[] = [
  { key: 'bed', label: 'BED', width: '100px', align: 'center' },
  { key: 'nama', label: 'IDENTITAS PASIEN' },
  { key: 'diagnosa', label: 'DIAGNOSA UTAMA' },
  { key: 'status', label: 'STATUS', align: 'center', width: '150px' },
  { key: 'actions', label: '', align: 'right' },
]

const filteredPatients = computed(() =>
  patients.value.filter(p => p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

const goToDetail = (id: string) => {
  router.push(`/perawat/asuhan/${id}`)
}
</script>

<template>
  <div class="space-y-6">

    <div class="flex justify-between items-center px-1">
      <div>
        <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Daftar Pasien Bangsal</h1>
        <p class="text-[12px] text-gray-500 font-medium">Monitoring status dan pengelolaan asuhan harian pasien.</p>
      </div>
      <div class="w-72">
        <BaseInput v-model="searchQuery" placeholder="Cari Nama/RM..." :icon="MagnifyingGlassIcon" class="!mb-0" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="(stat, idx) in stats" :key="idx"
        class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px]"
        :class="stat.border">
        <div>
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ stat.title }}</p>
          <p class="text-2xl font-black mt-1" :class="stat.color">{{ stat.value }}</p>
          <p class="text-[10px] text-gray-400 mt-0.5 font-bold">{{ stat.label }}</p>
        </div>
        <div class="p-2 rounded-lg" :class="stat.bgIcon">
          <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
      <div class="mb-4 px-2">
        <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <UserGroupIcon class="w-4 h-4" /> Pasien Terdaftar
        </h3>
      </div>

      <BaseDataTable :columns="columns" :data="filteredPatients" hide-search>
        <template #bed="{ value }">
          <span
            class="font-mono text-[11px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 italic">
            {{ value }}
          </span>
        </template>

        <template #nama="{ row }">
          <div class="flex items-center gap-3">
            <div class="p-1.5 bg-gray-50 rounded border border-gray-100 text-gray-400">
              <UserCircleIcon class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[11px] font-bold text-gray-800 uppercase leading-none">{{ row.nama }}</p>
              <p class="text-[10px] text-gray-400 font-bold mt-1 tracking-tight">{{ row.rm }}</p>
            </div>
          </div>
        </template>

        <template #diagnosa="{ value }">
          <span class="text-[11px] text-gray-600 font-medium italic">{{ value }}</span>
        </template>

        <template #status="{ value }">
          <span class="px-3 py-1 rounded text-[10px] font-black w-24 block text-center uppercase shadow-sm"
            :class="{
              'bg-red-600 text-white animate-pulse border-red-700': value === 'Kritis',
              'bg-green-600 text-white border-green-700': value === 'Stabil',
              'bg-blue-600 text-white border-blue-700': value === 'Observasi',
            }">
            {{ value }}
          </span>
        </template>

        <template #actions="{ row }">
          <BaseButton variant="primary" size="sm" @click="goToDetail(row.id)" class="!text-[10px] font-bold uppercase">
            Kelola Asuhan
          </BaseButton>
        </template>
      </BaseDataTable>
    </div>
  </div>
</template>