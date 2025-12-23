<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Import Components
import BaseFileUpload from '../components/common/BaseFileUpload.vue'
import BaseStepper from '../components/common/BaseStepper.vue'
import BaseSkeleton from '../components/common/BaseSkeleton.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseAlert from '../components/common/BaseAlert.vue'

// Data Dummy Steps
const steps = [
  { title: 'Pendaftaran', subtitle: 'Isi Data Diri' },
  { title: 'Upload Berkas', subtitle: 'KTP & BPJS' },
  { title: 'Verifikasi', subtitle: 'Cek Admin' },
  { title: 'Selesai', subtitle: 'Siap Berobat' }
]

const currentStep = ref(1) // Sedang di tahap "Upload Berkas"
const isLoadingData = ref(true)
const uploadedFiles = ref<File[]>([])

// Simulasi Loading Data Pasien
onMounted(() => {
  setTimeout(() => {
    isLoadingData.value = false
  }, 2000)
})

const handleNext = () => {
  if (uploadedFiles.value.length === 0) return alert('Upload dulu dong!')
  currentStep.value++
}
</script>

<template>
  <div class="p-[20px] max-w-3xl mx-auto bg-gray-50 min-h-screen">
    
    <div class="bg-white p-[30px] rounded-[10px] shadow-sm border border-gray-200">
      
      <div class="mb-[40px]">
        <BaseStepper :steps="steps" :current-step="currentStep" />
      </div>

      <div v-if="isLoadingData" class="space-y-[15px]">
        <BaseSkeleton height="20px" width="40%" />
        <BaseSkeleton height="100px" width="100%" />
        <div class="flex gap-2">
           <BaseSkeleton height="32px" width="100px" />
           <BaseSkeleton height="32px" width="100px" />
        </div>
      </div>

      <div v-else class="space-y-[20px]">
        
        <div class="text-center mb-[20px]">
          <h2 class="text-[18px] font-bold text-gray-800">Upload Dokumen Pendukung</h2>
          <p class="text-[12px] text-gray-500">Mohon lampirkan scan KTP dan Kartu BPJS pasien.</p>
        </div>

        <BaseAlert variant="info" dismissible>
           Format yang didukung: JPG, PNG, PDF. Maksimal 2MB per file.
        </BaseAlert>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
           <BaseFileUpload 
              v-model="uploadedFiles"
              label="Scan KTP / Kartu Identitas" 
              accept="image/*,.pdf"
              :max-size-mb="2"
           />
           
           <BaseFileUpload 
              label="Dokumen Rujukan (Opsional)" 
              accept=".pdf"
              multiple
              :max-size-mb="5"
           />
        </div>

        <div class="mt-[30px] flex justify-between pt-[20px] border-t border-gray-100">
          <BaseButton variant="secondary" @click="currentStep--">Kembali</BaseButton>
          <BaseButton @click="handleNext">Lanjut Verifikasi</BaseButton>
        </div>

      </div>

    </div>
  </div>
</template>