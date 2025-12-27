<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'

// --- ICONS ---
import {
    ArrowPathIcon,
    UserGroupIcon,
    ScaleIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    ChartPieIcon,
    FireIcon,
    PrinterIcon,
    TagIcon,
    CakeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// ==========================================
// 1. DATA STATE
// ==========================================

// Statistik Utama
const stats = ref([
    { title: 'Total Pasien Ranap', value: 45, label: 'Terisi Saat Ini', icon: UserGroupIcon, color: 'text-green-600', border: 'border-t-green-500', bgIcon: 'bg-green-50' },
    { title: 'Belum Skrining Gizi', value: 5, label: 'Pasien Baru (< 24 Jam)', icon: ClipboardDocumentCheckIcon, color: 'text-red-600', border: 'border-t-red-500', bgIcon: 'bg-red-50' },
    { title: 'Risiko Malnutrisi', value: 3, label: 'Skor MST >= 2', icon: ScaleIcon, color: 'text-yellow-600', border: 'border-t-yellow-500', bgIcon: 'bg-yellow-50' },
    { title: 'Diet Khusus', value: 12, label: 'DM, Rendah Garam', icon: FireIcon, color: 'text-emerald-600', border: 'border-t-emerald-500', bgIcon: 'bg-emerald-50' },
])

const overduePatients = ref([{ nama: 'Tn. Baru Masuk', kamar: '301', jam_masuk: 'Kemarin, 08:00 (> 24 Jam)' }])

const dietSummary = ref([
    { jenis: 'Nasi Biasa', jumlah: 20, color: 'bg-green-100 text-green-800 border-green-200' },
    { jenis: 'Nasi Lunak / Tim', jumlah: 10, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { jenis: 'Bubur Halus', jumlah: 5, color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { jenis: 'Diet DM', jumlah: 6, color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    { jenis: 'Diet RG', jumlah: 2, color: 'bg-lime-100 text-lime-800 border-lime-200' },
    { jenis: 'Sonda / Cair', jumlah: 2, color: 'bg-gray-100 text-gray-800 border-gray-200' },
])

const pendingList = ref([
    { id: 'REG-001', nama: 'Ny. Ani', rm: 'RM-111', kamar: 'Vip A', tgl_masuk: '27-12-2025 08:00', status: 'BELUM_SKRINING' },
    { id: 'REG-002', nama: 'Tn. Budi', rm: 'RM-222', kamar: 'Kls 3 - Bed 1', tgl_masuk: '27-12-2025 09:30', status: 'BELUM_SKRINING' },
    { id: 'REG-003', nama: 'An. Caca', rm: 'RM-333', kamar: 'Kls 1 - Bed 2', tgl_masuk: '27-12-2025 10:00', status: 'BELUM_SKRINING' },
])

const columns: TableColumn[] = [
    { key: 'nama', label: 'Nama Pasien' },
    { key: 'kamar', label: 'Ruang Rawat' },
    { key: 'tgl_masuk', label: 'Waktu Masuk', width: '150px' },
    { key: 'status', label: 'Status Gizi', align: 'center', width: '150px' },
    { key: 'actions', label: '', align: 'right' },
]

// --- MODAL STATE ---
const showLabelModal = ref(false)
const showSnackModal = ref(false)
const waktuMakan = ref('SIANG') // Default Siang

// Dummy Data Label
const labelPreview = ref([
    { nama: 'Ny. Ani', kamar: 'Vip A', diet: 'Nasi Tim - DM 1700 Kkal', extra: 'No Seafood' },
    { nama: 'Tn. Budi', kamar: 'Kls 3.1', diet: 'Bubur Saring', extra: '-' },
    { nama: 'An. Caca', kamar: 'Kls 1.2', diet: 'Nasi Biasa - TKTP', extra: 'Alergi Telur' },
])

// Dummy Data Snack
const snackRekap = ref([
    { menu: 'Puding Coklat', target: 'Diet Biasa / Anak', jumlah: 25 },
    { menu: 'Kue Hunkwe (Low Protein)', target: 'Diet Ginjal', jumlah: 4 },
    { menu: 'Buah Potong (Melon)', target: 'Diet DM', jumlah: 10 },
    { menu: 'Bubur Kacang Hijau', target: 'VIP / Kls 1', jumlah: 6 },
])

// ==========================================
// 2. LOGIC
// ==========================================

const handleSkrining = (row: any) => {
    alert(`Buka Form Skrining untuk pasien ${row.nama}`)
    router.push('/gizi/pasien')
}

const printLabel = () => {
    alert(`Mencetak ${labelPreview.value.length} Stiker Label untuk Makan ${waktuMakan.value}...`)
    showLabelModal.value = false
}

const printSnack = () => {
    alert('Mencetak Rekapitulasi Pesanan Snack ke Dapur...')
    showSnackModal.value = false
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Dashboard Gizi</h1>
                <p class="text-[12px] text-gray-500">Monitoring Asuhan Gizi, Diet Pasien, dan Kepatuhan Skrining.</p>
            </div>
            <div class="flex gap-2">
                <BaseButton :icon="ArrowPathIcon" variant="secondary">Refresh Data
                </BaseButton>
                <BaseButton :icon="ClipboardDocumentCheckIcon" variant="primary" @click="router.push('/gizi/pasien')">
                    Mulai Skrining
                </BaseButton>
            </div>
        </div>

        <div v-if="overduePatients.length > 0">
            <BaseAlert variant="danger" title="PERINGATAN KEPATUHAN (1x24 JAM)"
                class="animate-pulse shadow-sm border-l-4 border-l-red-600">
                <div class="mt-1 text-xs">
                    <p class="mb-2">Terdapat <b>{{ overduePatients.length }} Pasien</b> yang belum diskrining gizi lebih
                        dari 24 jam.</p>
                    <ul class="list-disc list-inside bg-white p-2 rounded border border-red-100">
                        <li v-for="(p, idx) in overduePatients" :key="idx" class="font-bold text-red-700">{{ p.nama }}
                            ({{ p.kamar }})</li>
                    </ul>
                </div>
            </BaseAlert>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div v-for="(stat, idx) in stats" :key="idx"
                class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between border-t-[4px]"
                :class="stat.border">
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">{{ stat.title }}</p>
                    <p class="text-2xl font-black mt-1" :class="stat.color">{{ stat.value }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5">{{ stat.label }}</p>
                </div>
                <div class="p-2 rounded-lg" :class="stat.bgIcon">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-2 space-y-4">
                <div
                    class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 border-t-[4px] border-t-green-600">
                    <div class="flex justify-between items-center mb-4 px-2">
                        <h3
                            class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <UserGroupIcon class="w-4 h-4" /> Pasien Baru (Perlu Skrining)
                        </h3>
                        <span
                            class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">Prioritas
                            Tinggi</span>
                    </div>
                    <BaseDataTable :columns="columns" :data="pendingList" hide-search>
                        <template #nama="{ row }">
                            <div>
                                <p class="text-[11px] font-bold text-gray-800 uppercase">{{ row.nama }}</p>
                                <p class="text-[10px] text-gray-500">{{ row.rm }}</p>
                            </div>
                        </template>
                        <template #kamar="{ value }"><span
                                class="font-bold text-[11px] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{{ value
                                }}</span></template>
                        <template #tgl_masuk="{ value }"><span class="font-mono text-[10px] text-gray-500">{{ value
                                }}</span></template>
                        <template #status="{ value }">
                            <span
                                class="text-[9px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 uppercase flex items-center gap-1 justify-center">
                                <ExclamationTriangleIcon class="w-3 h-3" /> BELUM CEK
                            </span>
                        </template>
                        <template #actions="{ row }">
                            <div class="text-right">
                                <BaseButton size="sm" variant="primary" :icon="ScaleIcon" @click="handleSkrining(row)">
                                    Skrining</BaseButton>
                            </div>
                        </template>
                    </BaseDataTable>
                </div>
            </div>

            <div class="space-y-4">
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-t-[4px] border-t-green-500">
                    <div class="flex justify-between items-center mb-4">
                        <h3
                            class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <ChartPieIcon class="w-4 h-4 text-green-500" /> Distribusi Diet (Hari Ini)
                        </h3>
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                        <div v-for="(item, i) in dietSummary" :key="i"
                            class="flex justify-between items-center p-2 rounded text-xs font-bold border hover:border-green-300 transition"
                            :class="item.color">
                            <span :class="item.color.split(' ')[1]">{{ item.jenis }}</span>
                            <span
                                class="bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100 text-gray-800 font-mono">{{
                                item.jumlah }}</span>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <div class="text-[10px] text-gray-400 mb-2 font-bold uppercase">Aksi Cepat Dapur:</div>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="showLabelModal = true"
                                class="flex flex-col items-center justify-center bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200 text-gray-600 p-3 rounded text-[10px] font-bold transition gap-1">
                                <TagIcon class="w-5 h-5" />
                                Cetak Label
                            </button>
                            <button @click="showSnackModal = true"
                                class="flex flex-col items-center justify-center bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200 text-gray-600 p-3 rounded text-[10px] font-bold transition gap-1">
                                <CakeIcon class="w-5 h-5" />
                                Rekap Snack
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <BaseModal v-model="showLabelModal" title="CETAK LABEL MAKANAN (ETIKET)" width="max-w-xl">
            <div class="space-y-4">
                <BaseSelectSearch label="Pilih Waktu Makan" v-model="waktuMakan"
                    :options="[{ value: 'PAGI', label: 'Makan Pagi (06:00)' }, { value: 'SIANG', label: 'Makan Siang (12:00)' }, { value: 'SORE', label: 'Makan Sore (17:00)' }]" />

                <div class="border rounded-lg overflow-hidden">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-gray-100 font-bold text-gray-500 uppercase">
                            <tr>
                                <th class="p-2">Pasien</th>
                                <th class="p-2">Diet</th>
                                <th class="p-2">Ket.</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(l, i) in labelPreview" :key="i">
                                <td class="p-2 font-bold">{{ l.nama }} <span class="text-gray-400">({{ l.kamar
                                        }})</span></td>
                                <td class="p-2 text-green-700 font-bold">{{ l.diet }}</td>
                                <td class="p-2 text-red-600 font-bold text-[10px]">{{ l.extra }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="text-[10px] text-gray-500 italic text-center">
                    *Preview menampilkan 3 dari 45 pasien yang terjadwal.
                </div>
            </div>
            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showLabelModal = false">Batal</BaseButton>
                    <BaseButton :icon="PrinterIcon" @click="printLabel">CETAK SEMUA LABEL</BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showSnackModal" title="REKAPITULASI SNACK (EXTRA FOODING)" width="max-w-lg">
            <div class="space-y-4">
                <div
                    class="bg-blue-50 border border-blue-100 p-3 rounded text-xs text-blue-800 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon class="w-5 h-5" />
                    <span>Pesanan ini akan dikirim ke Bagian Produksi Makanan (Dapur).</span>
                </div>

                <div class="border rounded-lg overflow-hidden">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-100 font-bold text-gray-500 uppercase text-[10px]">
                            <tr>
                                <th class="p-3">Menu Snack</th>
                                <th class="p-3">Peruntukan</th>
                                <th class="p-3 text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(s, i) in snackRekap" :key="i">
                                <td class="p-3 font-bold text-gray-800">{{ s.menu }}</td>
                                <td class="p-3 text-xs text-gray-500">{{ s.target }}</td>
                                <td class="p-3 text-right font-mono font-bold">{{ s.jumlah }}</td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gray-50 font-bold border-t">
                            <tr>
                                <td colspan="2" class="p-3 text-right uppercase text-[10px]">Total Porsi</td>
                                <td class="p-3 text-right text-lg">45</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-between w-full">
                    <BaseButton variant="secondary" @click="showSnackModal = false">Tutup</BaseButton>
                    <BaseButton :icon="PrinterIcon" @click="printSnack">Print Rekap Dapur</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>