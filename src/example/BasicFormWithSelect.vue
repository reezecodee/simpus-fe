<script setup lang="ts">
import { ref } from 'vue'

// Import Semua Komponen UI
import BaseInput from '../components/common/BaseInput.vue'
import BaseSelect from '../components/common/BaseSelect.vue'
import BaseSelectSearch from '../components/common/BaseSelectSearch.vue'
import BaseSelectCreatable from '../components/common/BaseSelectCreatable.vue'
import BaseTextarea from '../components/common/BaseTextarea.vue'
import BaseButton from '../components/common/BaseButton.vue'

// Import Icons
import { 
    ClipboardDocumentCheckIcon, 
    TrashIcon, 
    ArrowPathIcon 
} from '@heroicons/vue/24/outline'

// --- MOCK DATA ---
const poliOptions = [
    { label: 'Poli Umum', value: 'umum' },
    { label: 'Poli Gigi', value: 'gigi' },
    { label: 'Poli KIA', value: 'kia' },
    { label: 'Poli Gizi', value: 'gizi' }
]

const dokterOptions = [
    { label: 'dr. Budi Santoso, Sp.PD', value: 101 },
    { label: 'dr. Rina Wati, MARS', value: 102 },
    { label: 'drg. Hendra Gunawan', value: 103 },
    { label: 'Bidan Siti Aminah', value: 104 }
]

const keluhanSaran = [
    'Demam tinggi 3 hari', 'Batuk berdahak', 'Pusing mual', 
    'Sakit gigi geraham', 'Luka lecet kecelakaan', 'Kontrol kehamilan'
]

// --- STATE FORM ---
const form = ref({
    no_rm: '',
    nama_pasien: '',
    poli_tujuan: '',
    dokter_pj: '',
    keluhan_utama: '', // Creatable (Bisa ketik sendiri/pilih)
    tensi_sistole: '',
    tensi_diastole: '',
    suhu_tubuh: '',
    berat_badan: '',
    catatan_tambahan: ''
})

const isLoading = ref(false)

// Action Demo
const handleSimpan = () => {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        alert('Data Pemeriksaan Berhasil Disimpan!')
        console.log(form.value)
    }, 1500)
}
</script>

<template>
    <div class="p-[15px] max-w-7xl mx-auto text-[#1f2937]">
        
        <h2 class="text-[18px] font-bold mb-[15px] tracking-tight text-[#111827]">Dashboard Overview</h2>

        <div class="page-content grid grid-cols-1 lg:grid-cols-3 gap-[15px]">
            
            <div class="lg:col-span-2 border border-gray-200 rounded-md p-[20px]">
                <div class="flex items-center gap-2 mb-[15px] pb-[10px] border-b border-gray-100">
                    <ClipboardDocumentCheckIcon class="w-5 h-5 text-green-700" />
                    <h3 class="text-[14px] font-bold text-gray-800">Form Triage / Pemeriksaan Awal</h3>
                </div>

                <div class="grid grid-cols-12 gap-[15px]">
                    
                    <div class="col-span-12 md:col-span-3">
                        <BaseInput 
                            v-model="form.no_rm" 
                            label="No. RM" 
                            placeholder="00-00-00" 
                            mono 
                            required 
                        />
                    </div>
                    <div class="col-span-12 md:col-span-5">
                        <BaseInput 
                            v-model="form.nama_pasien" 
                            label="Nama Pasien" 
                            placeholder="Cari Pasien..." 
                        />
                    </div>
                    <div class="col-span-12 md:col-span-4">
                        <BaseSelect 
                            v-model="form.poli_tujuan" 
                            label="Poli Tujuan" 
                            :options="poliOptions" 
                            placeholder="Pilih Poli" 
                        />
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <BaseSelectSearch 
                            v-model="form.dokter_pj" 
                            label="Dokter Pemeriksa" 
                            :options="dokterOptions" 
                            placeholder="Ketik nama dokter..."
                        />
                    </div>
                    <div class="col-span-12 md:col-span-6">
                        <BaseSelectCreatable 
                            v-model="form.keluhan_utama" 
                            label="Keluhan Utama" 
                            :options="keluhanSaran"
                            placeholder="Ketik keluhan atau pilih saran..." 
                        />
                    </div>

                    <div class="col-span-12">
                        <label class="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-[4px] block">Tanda Vital</label>
                        <div class="grid grid-cols-4 gap-[10px] bg-gray-50 p-[10px] rounded-md border border-gray-200">
                            <BaseInput v-model="form.tensi_sistole" placeholder="120" label="Sistole" class="bg-white" />
                            <BaseInput v-model="form.tensi_diastole" placeholder="80" label="Diastole" class="bg-white" />
                            <BaseInput v-model="form.suhu_tubuh" placeholder="36.5" label="Suhu (°C)" class="bg-white" />
                            <BaseInput v-model="form.berat_badan" placeholder="kg" label="Berat (Kg)" class="bg-white" />
                        </div>
                    </div>

                    <div class="col-span-12">
                        <BaseTextarea 
                            v-model="form.catatan_tambahan" 
                            label="Catatan Keperawatan" 
                            rows="2" 
                            placeholder="Alergi obat, riwayat penyakit, dll..."
                        />
                    </div>

                </div>

                <div class="mt-[20px] pt-[15px] border-t border-gray-100 flex justify-end gap-[10px]">
                    <BaseButton variant="secondary" :icon="TrashIcon">Reset</BaseButton>
                    <BaseButton @click="handleSimpan" :loading="isLoading" :icon="ArrowPathIcon">Simpan Pemeriksaan</BaseButton>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="bg-gray-800 text-white p-[20px] rounded-[10px] shadow-sm sticky top-[20px]">
                    <h3 class="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-[15px] border-b border-gray-700 pb-[10px]">
                        Live Data Output
                    </h3>
                    <pre class="text-[10px] font-mono leading-relaxed opacity-80 whitespace-pre-wrap">{{ form }}</pre>
                    
                    <div class="mt-[20px] p-[10px] bg-yellow-500/10 border border-yellow-500/30 rounded-[6px]">
                        <p class="text-[10px] text-yellow-200">
                            <strong>Info Component:</strong><br>
                            - No. RM pakai <code>mono</code> font.<br>
                            - Dokter pakai <code>BaseSelectSearch</code>.<br>
                            - Keluhan pakai <code>BaseSelectCreatable</code>.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>