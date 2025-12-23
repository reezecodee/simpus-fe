<script setup lang="ts">
import { ref } from 'vue'

// Import Semua Komponen UI Ultra Compact
import BaseInput from '../components/common/BaseInput.vue'
import BaseSelectSearch from '../components/common/BaseSelectSearch.vue'
import BaseSelectCreatable from '../components/common/BaseSelectCreatable.vue'
import BaseInputTopic from '../components/common/BaseInputTopic.vue' // <--- Component Baru
import BaseTextarea from '../components/common/BaseTextarea.vue'
import BaseButton from '../components/common/BaseButton.vue'

// Icons
import { 
    ClipboardDocumentListIcon, 
    ArrowPathIcon,
    TrashIcon 
} from '@heroicons/vue/24/outline'

// --- MOCK DATA ---
const dokterOptions = [
    { label: 'dr. Budi Santoso, Sp.PD', value: 101 },
    { label: 'dr. Rina Wati, MARS', value: 102 }
]

// Data ICD-10 untuk Suggestion Topic
const icd10Options = [
    'A00.0 - Kolera akibat Vibrio cholerae',
    'A01.0 - Demam tifoid',
    'A09 - Diare & gastroenteritis',
    'B01 - Varisela (cacar air)',
    'J00 - Nasofaringitis akut (common cold)',
    'R50.9 - Demam, tidak spesifik',
    'K29.7 - Gastritis, tidak spesifik'
]

// Data ICD-9 CM (Tindakan)
const icd9Options = [
    '89.0 - Wawancara, konsultasi, dan evaluasi',
    '90.59 - Pemeriksaan mikroskopik darah',
    '87.44 - Rontgen dada rutin'
]

const form = ref({
    no_rm: '',
    nama_pasien: '',
    dokter: '',
    keluhan: '',
    // Array untuk Input Topic
    diagnosa_icd10: [] as string[], 
    tindakan_icd9: [] as string[],
    catatan: ''
})

const isLoading = ref(false)

const handleSimpan = () => {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        alert('Data Medis Berhasil Disimpan!')
        console.log("Payload:", form.value)
    }, 1500)
}
</script>

<template>
    <div class="p-[15px] max-w-7xl mx-auto text-[#1f2937]">
        
        <h2 class="text-[18px] font-bold mb-[15px] tracking-tight text-[#111827]">Dashboard Overview</h2>

        <div class="page-content grid grid-cols-1 lg:grid-cols-3 gap-[15px]">
            
            <div class="lg:col-span-2 bg-white border border-gray-200 rounded-md p-[20px]">
                
                <div class="flex items-center gap-2 mb-[20px] pb-[10px] border-b border-gray-100">
                    <ClipboardDocumentListIcon class="w-5 h-5 text-green-700" />
                    <h3 class="text-[14px] font-bold text-gray-800">Form Rekam Medis (SOAP)</h3>
                </div>

                <div class="grid grid-cols-12 gap-[15px]">
                    
                    <div class="col-span-12 md:col-span-4">
                        <BaseInput v-model="form.no_rm" label="No. RM" placeholder="00-00-00" mono required />
                    </div>
                    <div class="col-span-12 md:col-span-8">
                        <BaseInput v-model="form.nama_pasien" label="Nama Pasien" />
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <BaseSelectSearch 
                            v-model="form.dokter" 
                            label="Dokter Pemeriksa" 
                            :options="dokterOptions" 
                            placeholder="Cari Dokter..."
                        />
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <BaseSelectCreatable 
                            v-model="form.keluhan" 
                            label="Keluhan Utama (Anamnesa)" 
                            :options="['Demam 3 Hari', 'Batuk Pilek', 'Sakit Kepala']"
                            placeholder="Isi keluhan..."
                        />
                    </div>

                    <div class="col-span-12 bg-blue-50 p-[15px] rounded-md border border-gray-100">
                        <h4 class="text-[11px] font-bold mb-[10px] uppercase tracking-wide">
                            Assessment & Planning
                        </h4>
                        
                        <div class="grid grid-cols-1 gap-[15px]">
                            <BaseInputTopic 
                                v-model="form.diagnosa_icd10" 
                                label="Diagnosa Primer & Sekunder (ICD-10)" 
                                :suggestions="icd10Options"
                                placeholder="Ketik kode (cth: A00) lalu Spasi..."
                            />

                            <BaseInputTopic 
                                v-model="form.tindakan_icd9" 
                                label="Tindakan / Prosedur (ICD-9 CM)" 
                                :suggestions="icd9Options"
                                placeholder="Ketik kode tindakan..."
                            />
                        </div>
                    </div>

                    <div class="col-span-12">
                        <BaseTextarea 
                            v-model="form.catatan" 
                            label="Catatan & Resep (Plan)" 
                            rows="2" 
                        />
                    </div>

                </div>

                <div class="mt-[20px] pt-[15px] border-t border-gray-100 flex justify-end gap-[10px]">
                    <BaseButton variant="secondary" :icon="TrashIcon">Reset</BaseButton>
                    <BaseButton @click="handleSimpan" :loading="isLoading" :icon="ArrowPathIcon">Simpan SOAP</BaseButton>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="bg-gray-800 text-white p-[20px] rounded-md shadow-sm sticky top-[20px]">
                    <h3 class="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-[15px] border-b border-gray-700 pb-[10px]">
                        Data JSON
                    </h3>
                    
                    <div class="mb-4">
                        <div class="text-[10px] text-gray-400 mb-1">Diagnosa (ICD-10):</div>
                        <div class="flex flex-wrap gap-1">
                            <span v-for="d in form.diagnosa_icd10" :key="d" class="px-2 py-1 bg-green-900 text-green-200 rounded text-[10px] font-mono border border-green-700">
                                {{ d }}
                            </span>
                            <span v-if="form.diagnosa_icd10.length === 0" class="text-[10px] text-gray-600 italic">- Belum ada -</span>
                        </div>
                    </div>

                    <pre class="text-[10px] font-mono leading-relaxed opacity-80 whitespace-pre-wrap">{{ form }}</pre>
                </div>
            </div>

        </div>
    </div>
</template>