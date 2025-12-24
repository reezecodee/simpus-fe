<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'

// --- ICONS ---
import {
    BanknotesIcon,
    PrinterIcon,
    MagnifyingGlassIcon,
    CreditCardIcon,
    ReceiptPercentIcon,
    ArrowPathIcon,
    QrCodeIcon,
    CheckCircleIcon,
    ShieldCheckIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. STATE & DATA ANTRIAN
// ==========================================
const showPaymentModal = ref(false)
const searchQuery = ref('')

const columns: TableColumn[] = [
    { key: 'no_reg', label: 'No. Registrasi' },
    { key: 'nama', label: 'Nama Pasien' },
    { key: 'jenis', label: 'Tipe Pasien', align: 'center' },
    { key: 'unit', label: 'Layanan Terakhir' },
    { key: 'total', label: 'Total Bill', align: 'right' },
    { key: 'actions', label: '', align: 'right' },
]

const waitingPatients = ref([
    { id: 1, no_reg: 'REG/2512/001', no_rm: '00-12-33', nama: 'BUDI SANTOSO', jenis: 'UMUM', unit: 'POLI UMUM', total: 65000 },
    { id: 2, no_reg: 'REG/2512/002', no_rm: '00-45-12', nama: 'SITI AMINAH', jenis: 'BPJS', unit: 'POLI GIGI', total: 0 },
    { id: 3, no_reg: 'REG/2512/003', no_rm: '00-88-11', nama: 'DEDI KURNIA', jenis: 'UMUM', unit: 'POLI UMUM', total: 45000 },
])

// ==========================================
// 2. FORM PEMBAYARAN & LOGIC
// ==========================================
const selectedPatient = ref<any>(null)
const paymentForm = reactive({
    metode: 'TUNAI',
    diterima: 0,
    no_kartu: '',
    nama_asuransi: 'BPJS KESEHATAN',
    status_gateway: 'IDLE' // IDLE, PENDING, SUCCESS
})

const kembalian = computed(() => {
    if (!selectedPatient.value || paymentForm.metode !== 'TUNAI') return 0
    const total = selectedPatient.value.total
    return paymentForm.diterima > total ? paymentForm.diterima - total : 0
})

// Simulasi Polling Payment Gateway
const generatePayment = () => {
    paymentForm.status_gateway = 'PENDING'
    // Simulasi sukses setelah 4 detik
    setTimeout(() => {
        paymentForm.status_gateway = 'SUCCESS'
    }, 4000)
}

watch(() => paymentForm.metode, (newVal) => {
    if (['QRIS', 'VA'].includes(newVal)) {
        generatePayment()
    } else {
        paymentForm.status_gateway = 'IDLE'
    }
})

const openPayment = (row: any) => {
    selectedPatient.value = row
    paymentForm.metode = 'TUNAI'
    paymentForm.diterima = 0
    showPaymentModal.value = true
}

const handleConfirm = () => {
    alert('Transaksi Berhasil Disimpan. Mencetak Kwitansi...')
    showPaymentModal.value = false
}
</script>

<template>
    <div class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="s in [
                { label: 'Uang Tunai (Laci)', val: 'Rp 2.450.000', icon: BanknotesIcon, col: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Non-Tunai (QRIS/VA)', val: 'Rp 1.800.000', icon: CreditCardIcon, col: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Tagihan Asuransi', val: 'Rp 5.200.000', icon: ShieldCheckIcon, col: 'text-purple-600', bg: 'bg-purple-50' }
            ]" :key="s.label" class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                <div :class="['p-3 rounded-lg', s.bg]">
                    <component :is="s.icon" :class="['w-6 h-6', s.col]" />
                </div>
                <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ s.label }}</p>
                    <p class="text-[16px] font-bold text-gray-900">{{ s.val }}</p>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex gap-4">
            <div class="flex-1">
                <BaseInput v-model="searchQuery" placeholder="Cari Antrian (Nama/No. Reg)..."
                    :icon="MagnifyingGlassIcon" />
            </div>
            <BaseButton variant="secondary" :icon="ArrowPathIcon">Refresh</BaseButton>
        </div>

        <div
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
            <div class="flex justify-between items-center mb-4 px-2">
                <h3 class="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Antrian Kasir</h3>
                <BaseBadge variant="warning">Menunggu Pembayaran</BaseBadge>
            </div>

            <BaseDataTable :columns="columns" :data="waitingPatients" hide-search>
                <template #no_reg="{ value }">
                    <span class="font-mono text-[11px] font-bold text-blue-600">{{ value }}</span>
                </template>
                <template #jenis="{ value }">
                    <span
                        :class="['text-[10px] font-bold px-2 py-0.5 rounded border uppercase',
                            value === 'BPJS' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-200']">
                        {{ value }}
                    </span>
                </template>
                <template #total="{ value }">
                    <span class="font-mono font-bold text-gray-900">Rp {{ value.toLocaleString('id-ID') }}</span>
                </template>
                <template #actions="{ row }">
                    <BaseButton size="sm" @click="openPayment(row)">Proses Bayar</BaseButton>
                </template>
            </BaseDataTable>
        </div>

        <BaseModal v-model="showPaymentModal" title="Billing & Payment Gateway" width="max-w-3xl">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase">Detail Pasien</p>
                        <p class="text-sm font-bold text-gray-800 uppercase">{{ selectedPatient?.nama }}</p>
                        <p class="text-[11px] font-mono text-gray-500 italic">{{ selectedPatient?.no_reg }}</p>
                    </div>

                    <div class="space-y-2">
                        <h4 class="text-[11px] font-bold text-gray-400 uppercase border-b pb-1">Rincian Item</h4>
                        <div class="text-[12px] space-y-2 border-b border-dashed pb-3">
                            <div class="flex justify-between text-gray-600"><span>Jasa Medis</span> <span
                                    class="font-mono">Rp
                                    25.000</span></div>
                            <div class="flex justify-between text-gray-600"><span>Obat-obatan</span> <span
                                    class="font-mono">Rp
                                    35.000</span></div>
                            <div class="flex justify-between text-gray-600"><span>Administrasi</span> <span
                                    class="font-mono">Rp
                                    5.000</span></div>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-xs font-bold text-gray-900 uppercase">Grand Total</span>
                            <span class="text-xl font-black text-green-700 font-mono">Rp {{
                                selectedPatient?.total.toLocaleString('id-ID') }}</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <BaseSelect label="Metode Pembayaran" v-model="paymentForm.metode"
                        :options="['TUNAI', 'QRIS', 'VA', 'ASURANSI']" />

                    <div v-if="paymentForm.metode === 'TUNAI'"
                        class="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <BaseInput label="Tunai Diterima" type="number" v-model="paymentForm.diterima" mono />
                        <div
                            class="flex justify-between items-center px-4 py-3 bg-green-100 rounded-lg border border-green-200">
                            <span class="text-[10px] font-bold text-green-700 uppercase">Kembalian</span>
                            <span class="text-xl font-black text-green-700 font-mono">Rp {{
                                kembalian.toLocaleString('id-ID')
                            }}</span>
                        </div>
                    </div>

                    <div v-if="['QRIS', 'VA'].includes(paymentForm.metode)"
                        class="p-6 bg-white border-2 border-dashed rounded-xl text-center space-y-4">
                        <div v-if="paymentForm.status_gateway === 'PENDING'">
                            <div v-if="paymentForm.metode === 'QRIS'"
                                class="w-32 h-32 bg-gray-100 mx-auto rounded flex items-center justify-center border">
                                <QrCodeIcon class="w-20 h-20 text-gray-400" />
                            </div>
                            <div v-else class="py-4">
                                <p class="text-[10px] font-bold text-gray-400 uppercase">Nomor Virtual Account</p>
                                <p class="text-xl font-mono font-black text-blue-700 tracking-wider">8802 0812 3456 7890
                                </p>
                            </div>
                            <div class="flex items-center justify-center gap-2 text-orange-500">
                                <div class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></div>
                                <span class="text-[10px] font-black uppercase italic">Menunggu Pembayaran...</span>
                            </div>
                        </div>
                        <div v-if="paymentForm.status_gateway === 'SUCCESS'" class="text-green-600 animate-bounce">
                            <CheckCircleIcon class="w-12 h-12 mx-auto mb-1" />
                            <p class="text-[11px] font-black uppercase">Pembayaran Sukses!</p>
                        </div>
                    </div>

                    <div v-if="paymentForm.metode === 'ASURANSI'"
                        class="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="flex items-center gap-2 mb-2">
                            <ShieldCheckIcon class="w-5 h-5 text-green-600" />
                            <span class="text-[11px] font-black text-green-700 uppercase">Penjaminan BPJS
                                Kesehatan</span>
                        </div>

                        <BaseInput label="Nomor Kartu BPJS (13 Digit)" v-model="paymentForm.no_kartu"
                            placeholder="Contoh: 0001234567890" mono />

                        <div class="p-3 bg-white rounded-lg border border-green-100">
                            <ul class="text-[10px] text-green-700 space-y-1">
                                <li class="flex gap-2"><span>•</span> <span>Pastikan nomor sesuai dengan kartu fisik/KIS
                                        Digital.</span></li>
                                <li class="flex gap-2"><span>•</span> <span>Tagihan otomatis Rp 0 (Sistem
                                        Kapitasi/Non-Kapitasi).</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showPaymentModal = false">Batal</BaseButton>
                    <BaseButton @click="handleConfirm"
                        :disabled="paymentForm.metode === 'TUNAI' && paymentForm.diterima < (selectedPatient?.total || 0)"
                        :icon="PrinterIcon">
                        Validasi & Cetak
                    </BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>