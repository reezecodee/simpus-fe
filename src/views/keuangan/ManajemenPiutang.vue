<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseActionMenu from '@/components/common/BaseActionMenu.vue'

// --- ICONS ---
import { 
  CreditCardIcon, MagnifyingGlassIcon, HandThumbUpIcon, 
  UserGroupIcon, ClockIcon, BanknotesIcon, DocumentMagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA & STATE
// ==========================================
interface Piutang {
    id: number
    tgl: string
    pasien: string
    penjamin: string
    total_bill: number
    sisa_piutang: number
    status: 'BELUM LUNAS' | 'DICICIL'
}

const showPayModal = ref(false)
const showDetailModal = ref(false)
const selectedPiutang = ref<Piutang | null>(null)

const columns: TableColumn[] = [
  { key: 'tgl', label: 'Tanggal', width: '120px' },
  { key: 'pasien', label: 'Nama Pasien' },
  { key: 'penjamin', label: 'Penjamin' },
  { key: 'total_bill', label: 'Total Tagihan', align: 'right' },
  { key: 'sisa_piutang', label: 'Sisa Piutang', align: 'right' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions', label: '', align: 'right' },
]

const piutangData = ref<Piutang[]>([
  { id: 101, tgl: '20/12/2025', pasien: 'BUDI RAHARJO', penjamin: 'UMUM', total_bill: 500000, sisa_piutang: 200000, status: 'DICICIL' },
  { id: 102, tgl: '21/12/2025', pasien: 'SITI AMINAH', penjamin: 'BPJS (KLAIM)', total_bill: 1250000, sisa_piutang: 1250000, status: 'BELUM LUNAS' },
])

const payForm = reactive({
    nominal: 0,
    metode: 'TUNAI',
    keterangan: ''
})

// ==========================================
// 2. LOGIC
// ==========================================
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

const openPayModal = (row: Piutang) => {
    selectedPiutang.value = row
    payForm.nominal = row.sisa_piutang
    showPayModal.value = true
}

const openDetailModal = (row: Piutang) => {
    selectedPiutang.value = row
    showDetailModal.value = true
}

const handlePayment = () => {
    if (!selectedPiutang.value) return
    alert(`Pembayaran Piutang ${selectedPiutang.value.pasien} sebesar ${formatCurrency(payForm.nominal)} Berhasil Dicatat.`)
    showPayModal.value = false
}
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex justify-between items-end px-1">
      <div>
        <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Manajemen Piutang</h1>
        <p class="text-[12px] text-gray-500 font-medium uppercase">Monitoring Tagihan & Penagihan Pasien.</p>
      </div>
      <div class="bg-red-50 border border-red-100 px-4 py-2 rounded-lg text-right">
        <p class="text-[9px] font-black text-red-400 uppercase">Total Piutang Outstanding</p>
        <p class="text-xl font-black text-red-600 font-mono tracking-tighter">{{ formatCurrency(1450000) }}</p>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
      <div class="flex justify-between items-center mb-6 px-2">
        <h3 class="text-[11px] font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <ClockIcon class="w-4 h-4 text-green-600" /> Daftar Tunggu Pelunasan
        </h3>
        <div class="w-64">
          <BaseInput :icon="MagnifyingGlassIcon" placeholder="Cari nama pasien..." size="sm" />
        </div>
      </div>

      <BaseDataTable :columns="columns" :data="piutangData" hide-search>
        <template #tgl="{ value }">
          <span class="font-mono text-[11px] font-bold text-gray-600 uppercase">{{ value }}</span>
        </template>

        <template #pasien="{ value }">
          <span class="text-[12px] font-bold text-gray-800 uppercase tracking-tight">{{ value }}</span>
        </template>

        <template #total_bill="{ value }">
          <span class="font-mono text-[12px] text-gray-500">{{ formatCurrency(value) }}</span>
        </template>

        <template #sisa_piutang="{ value }">
          <span class="font-mono text-[13px] font-black text-red-600">{{ formatCurrency(value) }}</span>
        </template>

        <template #status="{ value }">
          <BaseBadge :variant="value === 'DICICIL' ? 'warning' : 'danger'">{{ value }}</BaseBadge>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end px-2">
            <BaseActionMenu>
                <button @click="openPayModal(row)" class="flex items-center gap-2 w-full px-4 py-2 text-[11px] font-bold text-green-700 hover:bg-green-50 transition text-left uppercase">
                    <BanknotesIcon class="w-4 h-4 text-green-600" /> Bayar Piutang
                </button>
                <button @click="openDetailModal(row)" class="flex items-center gap-2 w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition text-left uppercase tracking-tight">
                    <DocumentMagnifyingGlassIcon class="w-4 h-4 text-gray-400" /> Rincian Tagihan
                </button>
            </BaseActionMenu>
          </div>
        </template>
      </BaseDataTable>
    </div>

    <BaseModal v-model="showPayModal" :title="'BAYAR PIUTANG: ' + selectedPiutang?.pasien" width="max-w-md">
        <div class="space-y-4 py-2 text-gray-900">
            <div class="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between">
                <span class="text-[10px] font-bold uppercase text-gray-500">Sisa Hutang Saat Ini</span>
                <span class="text-sm font-black text-red-600 font-mono">{{ formatCurrency(selectedPiutang?.sisa_piutang || 0) }}</span>
            </div>
            <BaseInput label="Nominal Pembayaran" type="number" v-model="payForm.nominal" />
            <BaseSelect label="Metode Pembayaran" v-model="payForm.metode" :options="['TUNAI', 'TRANSFER', 'DEBIT']" />
            <BaseInput label="Keterangan / Catatan" v-model="payForm.keterangan" placeholder="Contoh: Cicilan ke-2" />
        </div>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <BaseButton variant="secondary" @click="showPayModal = false">Batal</BaseButton>
                <BaseButton variant="primary" @click="handlePayment">Simpan Pembayaran</BaseButton>
            </div>
        </template>
    </BaseModal>

    <BaseModal v-model="showDetailModal" :title="'RINCIAN TAGIHAN: ' + selectedPiutang?.pasien" width="max-w-xl">
        <div class="space-y-4">
            <table class="w-full text-[11px]">
                <thead class="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                    <tr>
                        <th class="text-left py-2 px-2">Layanan/Produk</th>
                        <th class="text-right py-2 px-2">Subtotal</th>
                    </tr>
                </thead>
                <tbody class="text-gray-700 font-bold uppercase">
                    <tr class="border-b border-gray-50">
                        <td class="py-2 px-2 italic">POLI UMUM (PEMERIKSAAN)</td>
                        <td class="text-right py-2 px-2 font-mono tracking-tight">Rp 50.000</td>
                    </tr>
                    <tr class="border-b border-gray-50">
                        <td class="py-2 px-2 italic">PARACETAMOL 500MG (10 TABLET)</td>
                        <td class="text-right py-2 px-2 font-mono tracking-tight">Rp 150.000</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="bg-green-50/50 text-green-800 font-black">
                        <td class="py-2 px-2 uppercase tracking-widest">Total Bill</td>
                        <td class="text-right py-2 px-2 font-mono">{{ formatCurrency(selectedPiutang?.total_bill || 0) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <template #footer>
            <BaseButton variant="secondary" class="w-full" @click="showDetailModal = false">Tutup Rincian</BaseButton>
        </template>
    </BaseModal>

  </div>
</template>