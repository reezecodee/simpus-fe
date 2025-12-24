<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

// --- COMPONENTS ---
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'

// --- ICONS ---
import { 
  ArrowLeftIcon, 
  UserIcon, 
  IdentificationIcon, 
  UsersIcon, 
  ClockIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()

// ==========================================
// 1. STATE & TABS
// ==========================================
const activeTab = ref('biodata')
const tabs = [
  { id: 'biodata', name: 'Biodata Dasar', icon: UserIcon },
  { id: 'identitas', name: 'Identitas Pasien', icon: IdentificationIcon },
  { id: 'keluarga', name: 'Keluarga Pasien', icon: UsersIcon },
  { id: 'riwayat', name: 'Riwayat Kunjungan', icon: ClockIcon },
]

// ==========================================
// 2. CONFIG COLUMNS (Sesuai Standar BaseDataTable)
// ==========================================
const colIdentitas: TableColumn[] = [
  { key: 'jenis', label: 'Jenis Dokumen' },
  { key: 'nomor', label: 'Nomor Identitas' },
  { key: 'masa', label: 'Masa Berlaku' },
  { key: 'status', label: 'Status', align: 'center' },
]

const colKeluarga: TableColumn[] = [
  { key: 'nama', label: 'Nama Anggota' },
  { key: 'hubungan', label: 'Hubungan' },
  { key: 'hp', label: 'No. Telepon' },
  { key: 'keterangan', label: 'Keterangan' },
]

const colRiwayat: TableColumn[] = [
  { key: 'tgl', label: 'Tgl Periksa' },
  { key: 'unit', label: 'Unit Pelayanan' },
  { key: 'diagnosa', label: 'Diagnosa Utama' },
  { key: 'dokter', label: 'Dokter Pemeriksa' },
]

// ==========================================
// 3. DATA PASIEN
// ==========================================
const pasien = reactive({
  no_rm: '00-12-33',
  nama: 'BUDI SANTOSO',
  nik: '3201123456780001',
  gender: 'L',
  tgl_lahir: '20-05-1985',
  tempat_lahir: 'Tasikmalaya',
  alamat: 'Jl. Merdeka No. 10, RT 01 RW 05, Kel. Urug, Kec. Kawalu',
  hp: '08123456789'
})

const avatarUrl = computed(() => {
  return pasien.gender === 'L' 
    ? 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg' 
    : 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611702.jpg'
})

const identitasList = [
  { jenis: 'KTP', nomor: '3201123456780001', masa: 'SEUMUR HIDUP', status: 'AKTIF' },
  { jenis: 'BPJS', nomor: '0001234567890', masa: 'AKTIF', status: 'AKTIF' }
]

const keluargaList = [
  { nama: 'SUSI WULANDARI', hubungan: 'ISTRI', hp: '081122334455', keterangan: 'PENANGGUNG JAWAB' },
  { nama: 'AHMAD SUBAGJO', hubungan: 'AYAH', hp: '085566778899', keterangan: 'KERABAT' }
]

const riwayatList = [
  { tgl: '24-12-2025', unit: 'POLI UMUM', diagnosa: 'HIPERTENSI (I10)', dokter: 'DR. ANDI' },
  { tgl: '10-10-2025', unit: 'POLI GIGI', diagnosa: 'PULPITIS (K04)', dokter: 'DRG. MAYA' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-20">
    
    <div class="flex items-center gap-4">
      <button @click="router.back()" class="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
        <ArrowLeftIcon class="w-5 h-5 text-gray-600" />
      </button>
      <div>
        <h1 class="text-[20px] font-bold text-gray-900 tracking-tight uppercase">Detail Rekam Medis</h1>
        <p class="text-[12px] text-gray-500">Arsip data induk kependudukan dan riwayat pasien.</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      
      <div class="col-span-12 md:col-span-3 space-y-4">
        <div class="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm border-t-[4px] border-t-green-600">
           <img :src="avatarUrl" class="w-32 h-32 mx-auto mb-4 bg-gray-50 rounded-lg border border-gray-100 object-cover" />
           <div class="mt-2 font-mono text-[12px] text-green-700 bg-green-50 py-1 rounded border border-green-100 font-bold uppercase">
            RM: {{ pasien.no_rm }}
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button 
              v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-medium transition-all border-b border-gray-100 cursor-pointer"
              :class="activeTab === tab.id ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-50'"
            >
              <component :is="tab.icon" class="w-4 h-4" />
              <span class="tracking-wide">{{ tab.name }}</span>
            </button>
        </div>
      </div>

      <div class="col-span-12 md:col-span-9">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[480px]">
          
          <div v-if="activeTab === 'biodata'" class="p-8 space-y-6">
            <h3 class="text-[13px] font-bold uppercase border-b pb-3">Informasi Biodata</h3>
            <div class="grid grid-cols-2 gap-y-6 gap-x-12">
               <div v-for="(val, label) in { 
                 'Nama Lengkap': pasien.nama, 
                 'NIK': pasien.nik, 
                 'Tempat / Tgl Lahir': `${pasien.tempat_lahir}, ${pasien.tgl_lahir}`,
                 'Jenis Kelamin': pasien.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN',
                 'No. Handphone': pasien.hp 
               }" :key="label">
                  <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">{{ label }}</p>
                  <p class="text-[13px] font-bold text-gray-800 uppercase">{{ val }}</p>
               </div>
               <div class="col-span-2 pt-6 border-t">
                  <p class="text-[10px] text-gray-400 font-bold uppercase mb-2">Alamat Domisili</p>
                  <div class="flex items-start gap-2">
                     <MapPinIcon class="w-4 h-4 text-gray-400 mt-0.5" />
                     <p class="text-[13px] font-medium text-gray-700 leading-relaxed uppercase italic">{{ pasien.alamat }}</p>
                  </div>
               </div>
            </div>
          </div>

          <div v-if="activeTab === 'identitas'" class="p-8 space-y-6">
            <h3 class="text-[13px] font-bold uppercase border-b mb-4 pb-3">Identitas Pasien</h3>
            <BaseDataTable :columns="colIdentitas" :data="identitasList" hide-search>
                <template #status="{ value }">
                    <BaseBadge variant="success">{{ value }}</BaseBadge>
                </template>
            </BaseDataTable>
          </div>

          <div v-if="activeTab === 'keluarga'" class="p-8 space-y-6">
            <h3 class="text-[13px] font-bold uppercase border-b mb-4 pb-3">Keluarga Pasien</h3>
            <BaseDataTable :columns="colKeluarga" :data="keluargaList" hide-search>
                <template #nama="{ value }">
                    <span class="text-gray-800">{{ value }}</span>
                </template>
                <template #hubungan="{ value }">
                    <span>{{ value }}</span>
                </template>
            </BaseDataTable>
          </div>

          <div v-if="activeTab === 'riwayat'" class="p-8 space-y-6">
            <h3 class="text-[13px] font-bold uppercase border-b mb-4 pb-3">Riwayat Kunjungan Pasien</h3>
            <BaseDataTable :columns="colRiwayat" :data="riwayatList" hide-search>
                <template #tgl="{ value }">
                    <span class="font-mono text-gray-600">{{ value }}</span>
                </template>
                <template #unit="{ value }">
                    <span>{{ value }}</span>
                </template>
            </BaseDataTable>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>