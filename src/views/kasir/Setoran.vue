<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

// --- ICONS ---
import {
    BanknotesIcon,
    LockClosedIcon,
    CalculatorIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA SISTEM (Data dari Database)
// ==========================================
const systemData = reactive({
    tunai: 2450000,
    qris: 1200000,
    va: 850000,
    total_transaksi: 12
})

// ==========================================
// 2. INPUT KASIR (Uang Fisik di Laci)
// ==========================================
// 1. Definisikan tipe datanya dulu biar kaku dan aman
interface Denominasi {
    [key: string]: number; // Ini adalah "Index Signature" yang bikin TypeScript bolehin akses pakai string
    seratus_ribu: number;
    lima_puluh_ribu: number;
    dua_puluh_ribu: number;
    sepuluh_ribu: number;
    lima_ribu: number;
    dua_ribu: number;
    seribu_koin: number;
    lainnya: number;
}

// 2. Gunakan interface tersebut pada reactive
const fisik = reactive<Denominasi>({
    seratus_ribu: 0,
    lima_puluh_ribu: 0,
    dua_puluh_ribu: 0,
    sepuluh_ribu: 0,
    lima_ribu: 0,
    dua_ribu: 0,
    seribu_koin: 0,
    lainnya: 0
})

const totalFisik = computed(() => {
    return (fisik.seratus_ribu * 100000) +
        (fisik.lima_puluh_ribu * 50000) +
        (fisik.dua_puluh_ribu * 20000) +
        (fisik.sepuluh_ribu * 10000) +
        (fisik.lima_ribu * 5000) +
        (fisik.dua_ribu * 2000) +
        (fisik.seribu_koin * 1000) +
        fisik.lainnya
})

const selisih = computed(() => totalFisik.value - systemData.tunai)

const handleTutupShift = () => {
    if (confirm('Apakah Anda yakin ingin menutup shift? Data tidak dapat diubah setelah shift ditutup.')) {
        alert('Shift Berhasil Ditutup. Mencetak Laporan Setoran...')
    }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-end border-b border-gray-200 pb-4">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase">Setoran & Tutup Shift</h1>
                <p class="text-[12px] text-gray-500">Hitung uang fisik di laci dan bandingkan dengan saldo
                    sistem.</p>
            </div>
            <div class="text-right">
                <BaseBadge variant="success">Status: Shift Aktif</BaseBadge>
                <p class="text-[10px] text-gray-400 mt-1 uppercase font-bold">Petugas: Atyla Azfa</p>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-6">

            <div class="col-span-12 lg:col-span-7 space-y-4">
                <div
                    class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden border-t-[4px] border-t-green-600">
                    <div class="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                        <CalculatorIcon class="w-5 h-5 text-gray-400" />
                        <h3 class="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Penghitungan Uang
                            Fisik (Denominasi)</h3>
                    </div>

                    <div class="p-4 grid grid-cols-2 gap-x-8 gap-y-3">
                        <div v-for="(val, key) in { 100000: 'seratus_ribu', 50000: 'lima_puluh_ribu', 20000: 'dua_puluh_ribu', 10000: 'sepuluh_ribu', 5000: 'lima_ribu', 2000: 'dua_ribu', 1000: 'seribu_koin' }"
                            :key="key" class="flex items-center justify-between gap-4 border-b border-gray-50 pb-2">
                            <span class="text-[11px] font-bold text-gray-500 font-mono">Rp {{
                                parseInt(key).toLocaleString() }}</span>
                            <div class="w-24">
                                <BaseInput type="number" v-model="fisik[val]" placeholder="0" size="sm"
                                    class="text-center" />
                            </div>
                        </div>
                        <div class="col-span-2 pt-2">
                            <BaseInput label="Lainnya / Receh (Input Nominal)" type="number" v-model="fisik.lainnya"
                                mono />
                        </div>
                    </div>

                    <div class="bg-green-50 p-4 flex justify-between items-center border-t border-green-100">
                        <span class="text-[12px] font-bold text-green-700 uppercase">Total Fisik di Laci</span>
                        <span class="text-xl font-black text-green-700 font-mono">Rp {{
                            totalFisik.toLocaleString('id-ID') }}</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-5 space-y-4">

                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <h3 class="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Ringkasan Saldo Sistem</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Pendapatan Tunai</span>
                            <span class="font-bold font-mono text-gray-800">Rp {{ systemData.tunai.toLocaleString()
                                }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Pendapatan QRIS/VA</span>
                            <span class="font-bold font-mono text-blue-600">Rp {{ (systemData.qris +
                                systemData.va).toLocaleString() }}</span>
                        </div>
                        <div class="pt-2 border-t border-dashed flex justify-between items-center">
                            <span class="text-[10px] font-bold text-gray-400 uppercase">Selisih (Fisik - Sistem)</span>
                            <span
                                :class="['text-sm font-black font-mono', selisih < 0 ? 'text-red-600' : 'text-green-600']">
                                {{ selisih >= 0 ? '+' : '' }}{{ selisih.toLocaleString() }}
                            </span>
                        </div>
                    </div>

                    <div v-if="selisih !== 0" class="p-3 bg-red-50 border border-red-100 rounded flex gap-3">
                        <ExclamationTriangleIcon class="w-5 h-5 text-red-500 shrink-0" />
                        <p class="text-[10px] text-red-700 leading-tight font-medium">
                            Terdapat selisih antara uang fisik dan sistem. Harap hitung ulang atau berikan keterangan
                            pada catatan sebelum tutup shift.
                        </p>
                    </div>
                    <div v-else class="p-3 bg-green-50 border border-green-100 rounded flex gap-3">
                        <CheckCircleIcon class="w-5 h-5 text-green-500 shrink-0" />
                        <p class="text-[10px] text-green-700 leading-tight font-medium">
                            Saldo Match! Uang fisik sesuai dengan data sistem. Anda dapat menutup shift dengan aman.
                        </p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <BaseInput label="Catatan Petugas (Opsional)" placeholder="Misal: Uang Rp 100 sobek, dll..." />
                    <BaseButton class="w-full h-12" variant="primary" :icon="LockClosedIcon" @click="handleTutupShift"
                        :disabled="totalFisik === 0">
                        TUTUP SHIFT & CETAK LAPORAN
                    </BaseButton>
                    <p class="text-[10px] text-gray-400 text-center italic">
                        * Menutup shift akan mengunci semua transaksi Anda hari ini.
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>