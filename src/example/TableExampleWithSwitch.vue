<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// --- 1. IMPORT SEMUA KOMPONEN UI KITA ---
import BaseInput from '../components/common/BaseInput.vue'
import BaseSelect from '../components/common/BaseSelect.vue'
import BaseSelectSearch from '../components/common/BaseSelectSearch.vue'
import BaseSelectCreatable from '../components/common/BaseSelectCreatable.vue'
import BaseInputTopic from '../components/common/BaseInputTopic.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '../components/common/BaseDataTable.vue'
import BaseBadge from '../components/common/BaseBadge.vue'
import BaseModal from '../components/common/BaseModal.vue'
import BaseAlert from '../components/common/BaseAlert.vue'
import BaseSwitch from '../components/common/BaseSwitch.vue'
import BaseFileUpload from '../components/common/BaseFileUpload.vue'
import BaseStepper from '../components/common/BaseStepper.vue'
import BaseActionMenu from '../components/common/BaseActionMenu.vue'
import BaseSkeleton from '../components/common/BaseSkeleton.vue'

// --- 2. IMPORT ICONS ---
import { 
  UserPlusIcon, 
  ArrowDownTrayIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon, 
  PrinterIcon,
  FunnelIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// BAGIAN 1: DATA TABLE & DASHBOARD LOGIC
// ==========================================

// Definisi Kolom Tabel
const columns: TableColumn[] = [
  { key: 'no_rm', label: 'No. RM', width: '100px' },
  { key: 'nama', label: 'Nama Pasien' },
  { key: 'poli', label: 'Poli Tujuan', width: '120px' },
  { key: 'dokter', label: 'Dokter', width: '180px' },
  { key: 'status', label: 'Status', align: 'center', width: '120px' },
  { key: 'actions', label: '', align: 'right', width: '50px' },
]

// Dummy Data Pasien
const allData = ref([
  { id: 1, no_rm: '00-12-33', nama: 'Budi Santoso', poli: 'Umum', dokter: 'dr. Budi Sp.PD', status: 'Selesai' },
  { id: 2, no_rm: '00-12-34', nama: 'Siti Aminah', poli: 'Gigi', dokter: 'drg. Hendra', status: 'Menunggu' },
  { id: 3, no_rm: '00-12-35', nama: 'Rahmad Hidayat', poli: 'Umum', dokter: 'dr. Rina MARS', status: 'Diperiksa' },
  { id: 4, no_rm: '00-12-36', nama: 'Joko Widodo', poli: 'KIA', dokter: 'Bidan Siti', status: 'Selesai' },
  { id: 5, no_rm: '00-12-37', nama: 'Megawati', poli: 'Gizi', dokter: 'Ahli Gizi Putri', status: 'Batal' },
])

// State Filter
const filters = reactive({
  search: '',
  poli: '',
  autoRefresh: true
})

// Logic Filter
const filteredData = computed(() => {
  return allData.value.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(filters.search.toLowerCase()) || 
                        item.no_rm.includes(filters.search)
    const matchPoli = filters.poli === '' ? true : item.poli === filters.poli
    return matchSearch && matchPoli
  })
})

const handleTableAction = (action: string, row: any) => {
  if (action === 'delete') {
    if (confirm(`Hapus data ${row.nama}?`)) {
      allData.value = allData.value.filter(x => x.id !== row.id)
    }
  } else {
    alert(`Action: ${action} pada ${row.nama}`)
  }
}

// ==========================================
// BAGIAN 2: MODAL PENDAFTARAN (STEPPER)
// ==========================================

const showModal = ref(false)
const currentStep = ref(0)
const isSubmitting = ref(false)

const steps = [
  { title: 'Data Diri', subtitle: 'Identitas Pasien' },
  { title: 'Data Medis', subtitle: 'Poli & Keluhan' },
  { title: 'Berkas', subtitle: 'Upload Dokumen' }
]

// State Form Pendaftaran
const form = reactive({
  // Step 1
  nik: '',
  nama: '',
  gender: '',
  umur: '',
  alergi: [] as string[], // BaseInputTopic
  
  // Step 2
  poli: '',
  dokter: '',
  keluhan: '', // BaseSelectCreatable
  isBpjs: false, // BaseSwitch
  
  // Step 3
  files: [] as File[] // BaseFileUpload
})

// Master Data
const poliOptions = [
    { label: 'Semua Poli', value: '' }, 
    { label: 'Poli Umum', value: 'Umum' },
    { label: 'Poli Gigi', value: 'Gigi' },
    { label: 'Poli KIA', value: 'KIA' }
]

const dokterOptions = [
    { label: 'dr. Budi Santoso, Sp.PD', value: 'dr. Budi Sp.PD' },
    { label: 'drg. Hendra Gunawan', value: 'drg. Hendra' },
    { label: 'dr. Rina Wati', value: 'dr. Rina MARS' }
]

const openModal = () => {
  // Reset Form
  currentStep.value = 0
  form.nama = ''; form.nik = ''; form.alergi = []; form.files = []
  showModal.value = true
}

const handleNextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    // Submit Final
    isSubmitting.value = true
    setTimeout(() => {
      isSubmitting.value = false
      showModal.value = false
      
      // Tambah ke tabel (Simulasi)
      allData.value.unshift({
        id: Date.now(),
        no_rm: 'NEW-' + Math.floor(Math.random() * 100),
        nama: form.nama,
        poli: form.poli || 'Umum',
        dokter: form.dokter || 'Dokter Jaga',
        status: 'Menunggu'
      })
      
      alert('Pendaftaran Berhasil!')
    }, 1500)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 p-[20px] font-sans text-gray-800 pb-20">
    <div class="max-w-7xl mx-auto space-y-[20px]">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-[24px] font-bold text-gray-900 tracking-tight">Dashboard Pelayanan</h1>
          <p class="text-[13px] text-gray-500 mt-1">Sistem Informasi Manajemen Puskesmas (SIMPUS)</p>
        </div>
        <div class="flex items-center gap-2">
           <BaseButton variant="secondary" :icon="ArrowDownTrayIcon">Export Data</BaseButton>
           <BaseButton :icon="UserPlusIcon" @click="openModal">Pendaftaran Baru</BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-[15px]">
         <div class="bg-white p-[15px] rounded-[8px] border border-gray-200 shadow-sm flex items-center gap-4">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <UserGroupIcon class="w-6 h-6" />
            </div>
            <div>
              <p class="text-[11px] text-gray-500 font-bold uppercase">Total Pasien</p>
              <p class="text-[20px] font-bold text-gray-800">{{ allData.length }}</p>
            </div>
         </div>
         <div class="bg-white p-[15px] rounded-[8px] border border-gray-200 shadow-sm flex items-center gap-4">
            <div class="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
              <ClockIcon class="w-6 h-6" />
            </div>
            <div>
              <p class="text-[11px] text-gray-500 font-bold uppercase">Menunggu</p>
              <p class="text-[20px] font-bold text-gray-800">
                {{ allData.filter(x => x.status === 'Menunggu').length }}
              </p>
            </div>
         </div>
         <div class="bg-white p-[15px] rounded-[8px] border border-gray-200 shadow-sm flex items-center gap-4">
            <div class="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircleIcon class="w-6 h-6" />
            </div>
            <div>
              <p class="text-[11px] text-gray-500 font-bold uppercase">Selesai</p>
              <p class="text-[20px] font-bold text-gray-800">
                {{ allData.filter(x => x.status === 'Selesai').length }}
              </p>
            </div>
         </div>
      </div>

      <BaseAlert variant="info" title="Informasi Sistem" dismissible>
        Fitur antrian online sedang dalam perbaikan (Maintenance). Mohon lakukan pendaftaran manual.
      </BaseAlert>

      <div class="bg-white rounded-[8px] shadow-sm border border-gray-200 border-t-[4px] border-t-green-600">
        
        <div class="bg-gray-50 px-[20px] py-[15px] border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="bg-green-100 p-1.5 rounded text-green-700">
              <FunnelIcon class="w-4 h-4" />
            </div>
            <h3 class="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Data Kunjungan</h3>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
             <div class="w-full md:w-[200px]">
                <BaseSelect v-model="filters.poli" :options="poliOptions" placeholder="Filter Poli..." />
             </div>
             <div class="border-l border-gray-300 pl-3 h-6 flex items-center">
                <BaseSwitch v-model="filters.autoRefresh" label="Auto" />
             </div>
          </div>
        </div>

        <div class="p-[20px]">
          <BaseDataTable 
            :columns="columns" 
            :data="filteredData" 
            :total-items="filteredData.length"
            @update:search="(val: string) => filters.search = val"
          >
            <template #no_rm="{ value }">
                <span class="font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-[11px] border border-gray-200">{{ value }}</span>
            </template>
            
            <template #status="{ value }">
                <BaseBadge :variant="value === 'Selesai' ? 'success' : value === 'Batal' ? 'danger' : value === 'Menunggu' ? 'warning' : 'info'" dot>
                  {{ value }}
                </BaseBadge>
            </template>

            <template #actions="{ row }">
              <BaseActionMenu>
                <button @click="handleTableAction('detail', row)" class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-green-600 text-left transition">
                  <EyeIcon class="w-4 h-4" /> Detail
                </button>
                <button @click="handleTableAction('edit', row)" class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 text-left transition">
                  <PencilSquareIcon class="w-4 h-4" /> Edit
                </button>
                <button @click="handleTableAction('print', row)" class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition">
                  <PrinterIcon class="w-4 h-4" /> Cetak
                </button>
                <div class="border-t border-gray-100 my-1"></div>
                <button @click="handleTableAction('delete', row)" class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 text-left transition">
                  <TrashIcon class="w-4 h-4" /> Hapus
                </button>
              </BaseActionMenu>
            </template>
          </BaseDataTable>
        </div>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Pendaftaran Pasien Baru" width="max-w-lg">
      
      <div class="mb-[25px] px-[10px]">
        <BaseStepper :steps="steps" :current-step="currentStep" />
      </div>

      <div class="min-h-[300px]">
        
        <div v-if="currentStep === 0" class="space-y-[15px] animate-fadeIn">
           <BaseInput v-model="form.nik" label="NIK / KTP" mono placeholder="320..." required />
           <BaseInput v-model="form.nama" label="Nama Lengkap" placeholder="Sesuai KTP" required />
           
           <div class="grid grid-cols-2 gap-4">
             <BaseSelect v-model="form.gender" label="Jenis Kelamin" :options="['Laki-laki', 'Perempuan']" />
             <BaseInput v-model="form.umur" label="Umur (Thn)" type="number" />
           </div>

           <BaseInputTopic 
              v-model="form.alergi" 
              label="Riwayat Alergi (Opsional)" 
              placeholder="Ketik alergi lalu spasi..." 
              :suggestions="['Seafood', 'Antibiotik', 'Debu', 'Telur']"
           />
        </div>

        <div v-if="currentStep === 1" class="space-y-[15px] animate-fadeIn">
           <div class="bg-blue-50 p-3 rounded-md border border-blue-100 flex justify-between items-center">
              <span class="text-[12px] font-bold text-blue-800">Pasien BPJS Kesehatan?</span>
              <BaseSwitch v-model="form.isBpjs" />
           </div>

           <BaseSelect v-model="form.poli" label="Poli Tujuan" :options="poliOptions" required />
           
           <BaseSelectSearch 
              v-model="form.dokter" 
              label="Dokter Pemeriksa" 
              :options="dokterOptions" 
              placeholder="Cari Dokter..."
           />

           <BaseSelectCreatable 
              v-model="form.keluhan" 
              label="Keluhan Utama" 
              :options="['Demam', 'Batuk', 'Pusing', 'Sakit Gigi']"
              placeholder="Ketik keluhan..."
           />
        </div>

        <div v-if="currentStep === 2" class="space-y-[15px] animate-fadeIn">
           <div class="text-center mb-4">
             <h4 class="text-sm font-bold text-gray-800">Dokumen Pendukung</h4>
             <p class="text-xs text-gray-500">Wajib upload Scan KTP/BPJS untuk verifikasi.</p>
           </div>
           
           <BaseFileUpload 
              v-model="form.files"
              label="Upload KTP / BPJS" 
              accept="image/*" 
              multiple 
           />

           <div class="mt-4 pt-4 border-t border-gray-100">
              <p class="text-[10px] font-bold text-gray-400 mb-2 uppercase">Verifikasi Sistem:</p>
              <div class="flex gap-2">
                 <BaseSkeleton height="20px" width="100%" />
                 <BaseSkeleton height="20px" width="20%" />
              </div>
           </div>
        </div>

      </div>

      <template #footer>
        <BaseButton 
          v-if="currentStep > 0" 
          variant="secondary" 
          @click="currentStep--"
        >
          Kembali
        </BaseButton>
        
        <BaseButton 
          @click="handleNextStep" 
          :loading="isSubmitting"
        >
          {{ currentStep === steps.length - 1 ? 'Simpan Pendaftaran' : 'Lanjut' }}
        </BaseButton>
      </template>

    </BaseModal>

  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>