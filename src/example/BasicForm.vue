<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../components/common/BaseInput.vue'
import BaseTextarea from '../components/common/BaseTextarea.vue'
import BaseButton from '../components/common/BaseButton.vue'

import {
    PaperAirplaneIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const form = ref({
    nik: '',
    no_kk: '',
    nama: '',
    no_hp: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: ''
})

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const handleSubmit = () => {
    // Reset Error
    errors.value = {}

    // Validasi Sederhana
    if (!form.value.nama) errors.value.nama = 'Nama wajib diisi'
    if (!form.value.nik) errors.value.nik = 'NIK wajib diisi'

    if (Object.keys(errors.value).length > 0) return

    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        alert('Data Berhasil Disimpan!')
    }, 1500)
}

const handleReset = () => {
    form.value = {
        nik: '', no_kk: '', nama: '', no_hp: '',
        tempat_lahir: '', tanggal_lahir: '', alamat: ''
    }
    errors.value = {}
}
</script>

<template>
    <div class="p-[15px] max-w-7xl mx-auto text-[#1f2937]">

        <h2 class="text-[18px] font-bold mb-[15px] tracking-tight text-[#111827]">Dashboard Overview</h2>

        <div class="page-content">
            <div class="p-5 border border-gray-200 rounded-md">
                <div class="mb-[20px]">
                    <h3 class="text-[12px] font-bold uppercase mb-[10px] pb-[5px]">
                        Identitas Pasien
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                        <div class="flex items-end gap-[5px]">
                            <div class="flex-1">
                                <BaseInput v-model="form.nik" label="NIK (KTP)" placeholder="16 Digit Angka"
                                    :error="errors.nik" required mono />
                            </div>
                            <BaseButton :icon="MagnifyingGlassIcon" variant="secondary" />
                        </div>

                        <BaseInput v-model="form.no_kk" label="No. Kartu Keluarga" placeholder="Opsional"
                            type="number" />

                        <BaseInput v-model="form.nama" label="Nama Lengkap" placeholder="Sesuai Identitas"
                            :error="errors.nama" required />
                    </div>
                </div>

                <div class="mb-[20px]">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
                        <BaseInput v-model="form.tempat_lahir" label="Tempat Lahir" />

                        <BaseInput v-model="form.tanggal_lahir" label="Tanggal Lahir" type="date" />

                        <BaseInput v-model="form.no_hp" label="Nomor WhatsApp" placeholder="08xx-xxxx-xxxx"
                            type="tel" />
                    </div>
                </div>

                <div class="mb-[20px]">
                    <BaseTextarea v-model="form.alamat" label="Alamat Domisili"
                        placeholder="Nama Jalan, RT/RW, Desa/Kelurahan, Kecamatan" rows="2" mono />
                </div>

                <div class="flex items-center justify-end gap-[10px] pt-[15px]">
                    <BaseButton variant="secondary" :icon="ArrowPathIcon" @click="handleReset">
                        Reset Form
                    </BaseButton>

                    <BaseButton variant="primary" :icon="PaperAirplaneIcon" :loading="isLoading" @click="handleSubmit">
                        Simpan Data
                    </BaseButton>
                </div>

            </div>
        </div>
    </div>
</template>