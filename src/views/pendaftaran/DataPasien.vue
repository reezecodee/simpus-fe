<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'
import BaseStepper from '@/components/common/BaseStepper.vue' // <--- Pakai Stepper
import BaseAlert from '@/components/common/BaseAlert.vue'
import { InformationCircleIcon, UserGroupIcon } from '@heroicons/vue/24/outline';

// --- ICONS ---
import {
    UserPlusIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    UsersIcon,
    MapPinIcon
} from '@heroicons/vue/24/outline'
import router from '@/router'

// ==========================================
// 1. DATA MASTER PASIEN
// ==========================================
const searchQuery = ref('')
const patients = ref([
    { id: 1, no_rm: '00-12-33', nik: '3201123456780001', nama: 'Budi Santoso', tgl_lahir: '1985-05-20', gender: 'L', alamat: 'Jl. Merdeka No 1', phone: '08123456789', pj_nama: 'Susi', pj_hubungan: 'Istri' },
    { id: 2, no_rm: '00-45-12', nik: '3205566778890002', nama: 'Siti Aminah', tgl_lahir: '1990-10-12', gender: 'P', alamat: 'Jl. Sudirman No 5', phone: '08567891234', pj_nama: 'Ahmad', pj_hubungan: 'Suami' },
])

const filteredPatients = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return patients.value.filter(p =>
        p.nama.toLowerCase().includes(q) ||
        p.no_rm.includes(q) ||
        p.nik.includes(q)
    )
})

const columns: TableColumn[] = [
    { key: 'no_rm', label: 'No. RM', width: '100px', align: 'center' },
    { key: 'nama', label: 'Identitas Pasien' },
    { key: 'gender', label: 'L/P', width: '60px', align: 'center' },
    { key: 'alamat', label: 'Alamat Domisili' },
    { key: 'phone', label: 'Kontak', width: '120px' },
    { key: 'actions', label: '', width: '80px', align: 'right' },
]

const goToDetail = (row: any) => {
    router.push(`/pendaftaran/detail-biodata/${row.id}`)
}

// ==========================================
// 2. LOGIC STEPPER (ADD / EDIT)
// ==========================================
const showModal = ref(false)
const isEditMode = ref(false)
const currentStep = ref(0)
const isLoading = ref(false)

// Definisi Langkah Stepper
const steps = [
    { title: 'Identitas', subtitle: 'Data Diri Utama' },
    { title: 'Domisili', subtitle: 'Alamat & Kontak' },
    { title: 'Keluarga', subtitle: 'Penanggung Jawab' }
]

const form = reactive({
    id: 0,
    no_rm: '',
    nik: '',
    nama: '',
    gender: 'L',
    tgl_lahir: '',
    tempat_lahir: 'Tasikmalaya',
    alamat: '',
    rt_rw: '',
    kelurahan: '',
    phone: '',
    pj_nama: '',
    pj_hubungan: '',
    pj_phone: ''
})

const openForm = (data?: any) => {
    currentStep.value = 0 // Reset ke step 1
    if (data) {
        isEditMode.value = true
        Object.assign(form, data)
    } else {
        isEditMode.value = false
        // Reset Form
        Object.assign(form, {
            id: 0, no_rm: 'AUTO-GEN', nik: '', nama: '', gender: 'L',
            tgl_lahir: '', tempat_lahir: 'Tasikmalaya', alamat: '', rt_rw: '',
            kelurahan: '', phone: '', pj_nama: '', pj_hubungan: '', pj_phone: ''
        })
    }
    showModal.value = true
}

const handleSave = () => {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        showModal.value = false
        alert(isEditMode.value ? 'Data berhasil diperbarui!' : 'Pasien baru berhasil ditambahkan!')
    }, 800)
}
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6 pb-20">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 tracking-tight uppercase">Data Pasien</h1>
                <p class="text-[12px] text-gray-500 mt-1">Kelola data induk kependudukan pasien.</p>
            </div>

            <BaseButton :icon="UserPlusIcon" @click="openForm()">
                Tambah Pasien Baru
            </BaseButton>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input v-model="searchQuery" type="text"
                    class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                    placeholder="Cari Database (Nama / NIK / No. RM)..." />
            </div>
            <div class="hidden md:flex items-center gap-3 px-4 border-l">
                <div class="text-right">
                    <p class="text-[10px] text-gray-500 uppercase font-bold">Total Pasien</p>
                    <p class="text-lg font-bold text-green-700 leading-none">{{ patients.length }}</p>
                </div>
                <UsersIcon class="w-8 h-8 text-green-100 bg-green-600 rounded-lg p-1" />
            </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm border-t-[4px] border-t-green-600">
            <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 class="font-bold text-gray-700 flex items-center gap-2 text-sm">
                    <UserGroupIcon class="w-5 h-5 text-green-600" />
                    Daftar Pasien
                </h3>
            </div>

            <div class="p-4">
                <BaseDataTable :columns="columns" :data="filteredPatients" hide-search>

                    <template #no_rm="{ value }">
                        <div class="py-1 flex justify-center">
                            <span
                                class="font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded text-[11px] border border-gray-200 tracking-wider">
                                {{ value }}
                            </span>
                        </div>
                    </template>

                    <template #nama="{ row }">
                        <div class="py-2 px-2">
                            <div
                                class="font-bold text-gray-900 text-[13px] uppercase tracking-tight leading-none mb-1.5">
                                {{ row.nama }}
                            </div>
                            <div class="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                <span class="bg-gray-100 px-1 rounded text-[9px]">NIK</span>
                                <span class="font-mono tracking-tight">{{ row.nik }}</span>
                            </div>
                        </div>
                    </template>

                    <template #gender="{ value }">
                        <div class="text-center py-2">
                            <span
                                class="text-[10px] font-bold text-gray-500 px-2 py-0.5 bg-white border border-gray-200 rounded-md">
                                {{ value }}
                            </span>
                        </div>
                    </template>

                    <template #alamat="{ row }">
                        <div class="max-w-[300px] px-2 py-2 text-[12px] text-gray-600 leading-relaxed italic">
                            {{ row.alamat }}
                        </div>
                    </template>

                    <template #phone="{ value }">
                        <div class="px-2 py-2 font-mono text-[11px] text-gray-700">
                            {{ value }}
                        </div>
                    </template>

                    <template #actions="{ row }">
                        <div class="py-2 pr-2 text-right">
                            <BaseActionMenu>
                                <button @click="goToDetail(row)"
                                    class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-green-600 transition text-left">
                                    <InformationCircleIcon class="w-4 h-4 text-gray-400" />
                                    Detail Pasien
                                </button>
                                <button @click="openForm(row)"
                                    class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-50 hover:text-green-600 transition text-left">
                                    <PencilSquareIcon class="w-4 h-4 text-gray-400" /> Edit Biodata
                                </button>
                                <div class="border-t border-gray-100 my-1"></div>
                                <button
                                    class="flex items-center gap-2 w-full px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 transition text-left font-medium">
                                    <TrashIcon class="w-4 h-4" /> Hapus Pasien
                                </button>
                            </BaseActionMenu>
                        </div>
                    </template>

                </BaseDataTable>
            </div>
        </div>

        <BaseModal v-model="showModal" :title="isEditMode ? 'Edit Data Pasien' : 'Registrasi Pasien Baru'"
            width="max-w-3xl">

            <div class="px-4 mb-6">
                <BaseStepper :steps="steps" :current-step="currentStep" />
            </div>

            <div v-if="currentStep === 0" class="space-y-4 animate-fade-in">
                <BaseAlert v-if="isEditMode" variant="warning" title="Mode Edit">
                    Anda sedang mengubah data sensitif pasien. Pastikan data valid.
                </BaseAlert>

                <div class="grid grid-cols-2 gap-4">
                    <BaseInput v-model="form.nik" label="NIK (KTP)" mono required placeholder="16 digit angka..." />
                    <BaseInput v-model="form.no_rm" label="No. Rekam Medis" disabled bg="bg-gray-100" />

                    <BaseInput v-model="form.nama" label="Nama Lengkap Sesuai KTP" class="col-span-2" required />

                    <div class="grid grid-cols-2 gap-2">
                        <BaseInput v-model="form.tempat_lahir" label="Tempat Lahir" />
                        <BaseInput v-model="form.tgl_lahir" type="date" label="Tanggal Lahir" />
                    </div>

                    <BaseSelect v-model="form.gender" label="Jenis Kelamin"
                        :options="[{ label: 'Laki-laki', value: 'L' }, { label: 'Perempuan', value: 'P' }]" />
                </div>
            </div>

            <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-start gap-3">
                    <MapPinIcon class="w-6 h-6 text-gray-400 mt-1" />
                    <div>
                        <h4 class="font-bold text-sm text-gray-700">Info Domisili</h4>
                        <p class="text-xs text-gray-500">Pastikan alamat sesuai dengan tempat tinggal saat ini.</p>
                    </div>
                </div>

                <BaseInput v-model="form.alamat" label="Alamat Lengkap (Jalan / Gang)"
                    placeholder="Contoh: Jl. Merdeka No. 10..." />

                <div class="grid grid-cols-2 gap-4">
                    <BaseInput v-model="form.rt_rw" label="RT / RW" placeholder="001/002" />
                    <BaseInput v-model="form.kelurahan" label="Desa / Kelurahan" />
                </div>

                <div class="border-t pt-4 mt-2">
                    <BaseInput v-model="form.phone" label="Nomor HP / WhatsApp (Aktif)" mono />
                </div>
            </div>

            <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
                <h4 class="font-bold text-gray-700 border-b pb-2">Data Penanggung Jawab (Keluarga)</h4>

                <div class="grid grid-cols-2 gap-4">
                    <BaseInput v-model="form.pj_nama" label="Nama Keluarga" />
                    <BaseSelect v-model="form.pj_hubungan" label="Hubungan"
                        :options="['Suami', 'Istri', 'Orang Tua', 'Anak', 'Kerabat']" />
                    <BaseInput v-model="form.pj_phone" label="No. HP Keluarga" mono />
                </div>

                <div class="mt-6 bg-green-50 p-4 rounded border border-green-100">
                    <p class="text-xs font-bold text-green-700 uppercase mb-2">Konfirmasi Data:</p>
                    <ul class="text-sm text-green-800 list-disc list-inside space-y-1">
                        <li>Nama: <strong>{{ form.nama }}</strong></li>
                        <li>NIK: {{ form.nik }}</li>
                        <li>Alamat: {{ form.alamat }}</li>
                    </ul>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton v-if="currentStep > 0" variant="secondary" @click="currentStep--">Kembali</BaseButton>
                    <div v-else></div>
                    <BaseButton :loading="isLoading" @click="currentStep === 2 ? handleSave() : currentStep++">
                        {{ currentStep === 2 ? 'Simpan Data' : 'Lanjut' }}
                    </BaseButton>
                </div>
            </template>

        </BaseModal>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>