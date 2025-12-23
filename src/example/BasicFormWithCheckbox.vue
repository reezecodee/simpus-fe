<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../components/common/BaseInput.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseCheckbox from '../components/common/BaseCheckbox.vue' // Import Baru
import BaseRadio from '../components/common/BaseRadio.vue'       // Import Baru

// State Form
const form = ref({
    nama: 'Budi Santoso',
    cara_bayar: 'umum', // Radio Value
    riwayat_penyakit: [] as string[], // Checkbox Array
    alergi_obat: false, // Checkbox Boolean
    persetujuan: false // Checkbox Boolean
})

// Data Opsi
const penyakitOptions = ['Hipertensi', 'Diabetes', 'Asma', 'Jantung']

const handleSubmit = () => {
    alert(JSON.stringify(form.value, null, 2))
}
</script>

<template>
    <div class="p-[15px] max-w-7xl mx-auto font-sans text-[#1f2937]">
        <h2 class="text-[18px] font-bold mb-[15px] tracking-tight text-[#111827]">Dashboard Overview</h2>

        <div class="page-content">

            <div class="border border-gray-200 rounded-md p-[20px]">
                <div class="space-y-[20px]">

                    <div>
                        <label class="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-[8px] block">
                            Metode Pembayaran
                        </label>
                        <div class="flex flex-wrap gap-[20px]">
                            <BaseRadio v-model="form.cara_bayar" value="umum" label="Tunai / Umum" />
                            <BaseRadio v-model="form.cara_bayar" value="bpjs" label="BPJS Kesehatan" />
                            <BaseRadio v-model="form.cara_bayar" value="asuransi" label="Asuransi Lain" />
                        </div>
                        <div class="mt-1 text-[10px] text-green-600">
                            Dipilih: {{ form.cara_bayar }}
                        </div>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-[8px] block">
                            Riwayat Penyakit Keluarga
                        </label>
                        <div class="grid grid-cols-2 gap-[10px]">
                            <BaseCheckbox v-for="penyakit in penyakitOptions" :key="penyakit"
                                v-model="form.riwayat_penyakit" :value="penyakit" :label="penyakit" />
                        </div>
                        <div class="mt-1 text-[10px] text-green-600">
                            Dipilih: {{ form.riwayat_penyakit }}
                        </div>
                    </div>

                    <div class="p-[10px] bg-red-50 rounded-md border border-red-100">
                        <BaseCheckbox v-model="form.alergi_obat" label="Pasien memiliki alergi obat?"
                            class="text-red-700" />

                        <div v-if="form.alergi_obat" class="mt-[10px] pl-[24px]">
                            <BaseInput placeholder="Sebutkan nama obat..." class="bg-white" />
                        </div>
                    </div>

                    <hr class="border-gray-100">

                    <BaseCheckbox v-model="form.persetujuan" label="Saya menyatakan data di atas adalah benar." />

                    <div class="flex justify-end">
                        <BaseButton :disabled="!form.persetujuan" @click="handleSubmit">
                            Simpan Data
                        </BaseButton>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>