<script setup lang="ts">
import { ref, reactive } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelectSearch from '@/components/common/BaseSelectSearch.vue'

// --- ICONS ---
import {
    ArrowPathIcon,
    BeakerIcon,
    FilmIcon,
    ClockIcon,
    ClipboardDocumentListIcon,
    CheckBadgeIcon,
    PhoneIcon,
    ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

// Statistik Utama (Header Cards)
const stats = ref([
    { title: 'Order Lab Baru', value: 15, label: 'Menunggu Sampling', icon: BeakerIcon, color: 'text-green-600', border: 'border-t-green-500', bgIcon: 'bg-green-50' },
    { title: 'Order Radiologi', value: 8, label: 'Menunggu Foto', icon: FilmIcon, color: 'text-emerald-600', border: 'border-t-emerald-500', bgIcon: 'bg-emerald-50' },
    { title: 'Sedang Diproses', value: 12, label: 'Running Mesin / Bacaan', icon: ClockIcon, color: 'text-teal-600', border: 'border-t-teal-500', bgIcon: 'bg-teal-50' },
    { title: 'Selesai (Verified)', value: 45, label: 'Hasil Keluar Hari Ini', icon: CheckBadgeIcon, color: 'text-lime-600', border: 'border-t-lime-500', bgIcon: 'bg-lime-50' },
])

// Alert Nilai Kritis
const criticalResults = ref([
    { id: 'LAB-2512-99', pasien: 'Tn. Darurat', param: 'Hemoglobin', hasil: '5.2 g/dL', unit: 'ICU', reported: false },
    { id: 'LAB-2512-88', pasien: 'Ny. Gawat', param: 'Kalium', hasil: '2.1 mmol/L', unit: 'IGD', reported: false }
])

// Monitoring TAT (Turn Around Time) - SAYA KEMBALIKAN
const tatStats = ref([
    { unit: 'Lab Hematologi', avg: '45 Menit', target: '60 Menit', status: 'OK' },
    { unit: 'Lab Kimia Klinik', avg: '90 Menit', target: '120 Menit', status: 'OK' },
    { unit: 'Radiologi Thorax', avg: '30 Menit', target: '45 Menit', status: 'OK' },
    { unit: 'CT-Scan', avg: '4 Jam', target: '3 Jam', status: 'LATE' },
])

// Recent Orders
const recentOrders = ref([
    { id: 'ORD-001', waktu: '08:00', tipe: 'LAB', pasien: 'Tn. Budi', asal: 'Poli Dalam', status: 'SAMPLING' },
    { id: 'ORD-002', waktu: '08:15', tipe: 'RAD', pasien: 'An. Dede', asal: 'IGD', status: 'PENDING' },
    { id: 'ORD-003', waktu: '08:20', tipe: 'LAB', pasien: 'Ny. Siti', asal: 'Rawat Inap 301', status: 'RUNNING' },
])

const columns: TableColumn[] = [
    { key: 'id', label: 'No. Order', width: '100px' },
    { key: 'waktu', label: 'Jam', width: '80px', align: 'center' },
    { key: 'tipe', label: 'Unit', align: 'center', width: '80px' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'asal', label: 'Asal Ruangan' },
    { key: 'status', label: 'Progres', align: 'center', width: '120px' },
]

// ==========================================
// 2. LOGIC MODALS
// ==========================================

// --- A. LOGIC LAPOR DPJP ---
const showLaporModal = ref(false)
const selectedPanic = ref<any>(null)
const formLapor = reactive({
    penerima: '',
    catatan: ''
})

const openLaporModal = (item: any) => {
    selectedPanic.value = item
    formLapor.penerima = ''
    formLapor.catatan = ''
    showLaporModal.value = true
}

const submitLaporan = () => {
    if (!formLapor.penerima) return alert('Nama penerima telepon wajib diisi!')
    alert(`Laporan tersimpan!\n\nPasien: ${selectedPanic.value.pasien}\nPenerima: ${formLapor.penerima}\nWaktu: ${new Date().toLocaleTimeString()}`)
    criticalResults.value = criticalResults.value.filter(c => c.id !== selectedPanic.value.id)
    showLaporModal.value = false
}

// --- B. LOGIC QC HARIAN ---
const showQCModal = ref(false)
const formQC = reactive({
    alat: 'Hematology Analyzer Sysmex',
    level: 'Normal',
    hasil: 'PASS',
    catatan: ''
})
const qcHistory = ref([
    { alat: 'Kimia Klinik', level: 'Normal', status: 'PASS', jam: '07:00' },
    { alat: 'Kimia Klinik', level: 'High', status: 'PASS', jam: '07:15' },
])

const submitQC = () => {
    qcHistory.value.unshift({
        alat: formQC.alat,
        level: formQC.level,
        status: formQC.hasil,
        jam: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    alert('Data QC Harian Berhasil Disimpan!')
    showQCModal.value = false
}

// --- C. LOGIC STOK REAGEN ---
const showReagenModal = ref(false)
const reagenData = ref([
    { nama: 'Diluent Hematology', sisa: 15, satuan: 'Liter', status: 'OK' },
    { nama: 'Lyse Hematology', sisa: 2, satuan: 'Botol', status: 'WARNING' },
    { nama: 'Reagen Glukosa', sisa: 50, satuan: 'Test', status: 'OK' },
    { nama: 'Reagen Kolesterol', sisa: 0, satuan: 'Test', status: 'EMPTY' },
])

const requestRestock = (item: any) => {
    alert(`Permintaan amprah barang ${item.nama} telah dikirim ke Farmasi/Logistik!`)
}

</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Dashboard Penunjang</h1>
                <p class="text-[12px] text-gray-500">Monitoring Laboratorium & Radiologi (TAT & Workload).</p>
            </div>
            <div class="flex gap-2">
                <BaseButton :icon="ArrowPathIcon" variant="secondary">Refresh
                </BaseButton>
                <BaseButton :icon="ClipboardDocumentListIcon" @click="$router.push('/penunjang/antrian')">Buka Worklist
                </BaseButton>
            </div>
        </div>

        <div v-if="criticalResults.length > 0">
            <BaseAlert variant="danger" title="NILAI KRITIS (PANIC VALUE)"
                class="animate-pulse shadow-sm border-l-4 border-l-red-600">
                <div class="mt-2 space-y-2">
                    <div v-for="item in criticalResults" :key="item.id"
                        class="flex items-center justify-between bg-white p-2 rounded border border-red-100 shadow-sm">
                        <div class="flex items-center gap-3 text-xs">
                            <span class="font-bold text-gray-700 w-24">{{ item.pasien }}</span>
                            <span class="px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-bold">{{ item.unit }}</span>
                            <span class="text-gray-500">Parameter:</span>
                            <span class="font-bold text-gray-800">{{ item.param }}</span>
                            <span
                                class="font-black text-red-600 text-sm bg-red-50 px-1 rounded border border-red-200">{{
                                item.hasil }}</span>
                        </div>
                        <button @click="openLaporModal(item)"
                            class="text-[10px] font-bold bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition flex items-center gap-1">
                            <PhoneIcon class="w-3 h-3" /> LAPOR DPJP
                        </button>
                    </div>
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
                            <ClipboardDocumentListIcon class="w-4 h-4" /> Order Masuk Terkini
                        </h3>
                    </div>
                    <BaseDataTable :columns="columns" :data="recentOrders" hide-search>
                        <template #id="{ value }"><span class="font-mono text-[11px] font-bold text-gray-600">{{ value
                                }}</span></template>
                        <template #tipe="{ value }">
                            <span v-if="value === 'LAB'"
                                class="px-2 py-0.5 rounded text-[9px] font-black bg-green-100 text-green-700 border border-green-200">LAB</span>
                            <span v-else
                                class="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">RAD</span>
                        </template>
                        <template #pasien="{ value }"><span class="text-[11px] font-bold text-gray-800 uppercase">{{
                                value }}</span></template>
                        <template #waktu="{ value }"><span class="font-mono text-[11px] text-gray-500">{{ value
                                }}</span></template>
                        <template #status="{ value }">
                            <span v-if="value === 'PENDING'"
                                class="text-[9px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200">PENDING</span>
                            <span v-else-if="value === 'SAMPLING'"
                                class="text-[9px] font-black bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded border border-yellow-200">SAMPLING</span>
                            <span v-else
                                class="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded border border-blue-200 animate-pulse">RUNNING</span>
                        </template>
                    </BaseDataTable>
                </div>
            </div>

            <div class="space-y-4">

                <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 border-t-[4px] border-t-green-500">
                    <div class="flex justify-between items-center mb-4">
                        <h3
                            class="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <ClockIcon class="w-4 h-4 text-green-500" /> Rata-rata TAT (Hari Ini)
                        </h3>
                    </div>
                    <div class="space-y-4">
                        <div v-for="(stat, i) in tatStats" :key="i"
                            class="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-[11px] font-bold text-gray-700">{{ stat.unit }}</span>
                                <span class="text-[10px] font-black px-1.5 rounded"
                                    :class="stat.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{
                                    stat.status }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="text-[10px] text-gray-400">Target: {{ stat.target }}</div>
                                <div class="text-sm font-black"
                                    :class="stat.status === 'OK' ? 'text-gray-800' : 'text-red-600'">{{
                                    stat.avg }}</div>
                            </div>
                            <div class="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500"
                                    :class="stat.status === 'OK' ? 'bg-green-500' : 'bg-red-500'"
                                    :style="{ width: stat.status === 'OK' ? '60%' : '95%' }"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-green-600 rounded-lg p-4 text-white shadow-lg sticky top-4">
                    <h3 class="font-bold text-sm mb-4 border-b border-white/20 pb-2">Shortcut Petugas</h3>

                    <div class="grid grid-cols-1 gap-3">
                        <button @click="showQCModal = true"
                            class="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded text-left border border-white/20 transition group">
                            <div
                                class="bg-white/20 p-2 rounded group-hover:bg-white group-hover:text-green-600 transition-colors">
                                <CheckBadgeIcon class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-xs font-bold">Input QC Harian</p>
                                <p class="text-[10px] text-green-100">Kalibrasi Alat Lab</p>
                            </div>
                        </button>

                        <button @click="showReagenModal = true"
                            class="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded text-left border border-white/20 transition group">
                            <div
                                class="bg-white/20 p-2 rounded group-hover:bg-white group-hover:text-green-600 transition-colors">
                                <BeakerIcon class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-xs font-bold">Cek Stok Reagen</p>
                                <p class="text-[10px] text-green-100">Monitoring Logistik</p>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <BaseModal v-model="showLaporModal" title="LOG PELAPORAN NILAI KRITIS" width="max-w-md">
            <div v-if="selectedPanic" class="space-y-4">
                <div class="bg-red-50 border border-red-100 p-3 rounded text-xs text-red-800">
                    <p class="font-bold mb-1">Instruksi:</p>
                    <ol class="list-decimal list-inside space-y-1">
                        <li>Hubungi Ruangan/Poli via Telepon Ekstensi.</li>
                        <li>Minta bicara dengan DPJP atau Perawat Penanggung Jawab.</li>
                        <li>Bacakan hasil kritis dengan metode <b>TBAK</b> (Tulis, Baca, Konfirmasi).</li>
                        <li>Isi form di bawah ini sebagai bukti lapor.</li>
                    </ol>
                </div>
                <div class="border-b pb-2">
                    <p class="text-xs text-gray-500">Pasien:</p>
                    <p class="font-bold">{{ selectedPanic.pasien }} ({{ selectedPanic.unit }})</p>
                    <p class="text-xs text-gray-500 mt-1">Hasil:</p>
                    <p class="font-bold text-red-600">{{ selectedPanic.param }} = {{ selectedPanic.hasil }}</p>
                </div>
                <BaseInput v-model="formLapor.penerima" label="Nama Penerima Telepon (Perawat/Dokter)"
                    placeholder="Contoh: Br. Asep / dr. Budi" />
                <BaseInput v-model="formLapor.catatan" label="Catatan Tambahan (Opsional)"
                    placeholder="Instruksi dokter..." />
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showLaporModal = false">Batal</BaseButton>
                    <BaseButton variant="danger" @click="submitLaporan">SIMPAN LOG LAPORAN</BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showQCModal" title="INPUT QC HARIAN (CONTROL)" width="max-w-lg">
            <div class="space-y-4">
                <BaseSelectSearch label="Pilih Alat / Analyzer" v-model="formQC.alat"
                    :options="[{ value: 'Hematology Analyzer Sysmex', label: 'Hematology Sysmex' }, { value: 'Kimia Klinik Cobas', label: 'Kimia Klinik Cobas' }]" />
                <BaseSelectSearch label="Level Control" v-model="formQC.level"
                    :options="[{ value: 'Low', label: 'Low (Rendah)' }, { value: 'Normal', label: 'Normal' }, { value: 'High', label: 'High (Tinggi)' }]" />
                <div>
                    <label class="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Hasil QC</label>
                    <div class="flex gap-4">
                        <label
                            class="flex items-center gap-2 cursor-pointer border p-3 rounded-lg w-full hover:bg-green-50"
                            :class="formQC.hasil === 'PASS' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200'">
                            <input type="radio" v-model="formQC.hasil" value="PASS"
                                class="text-green-600 focus:ring-green-500">
                            <span class="text-sm font-bold text-green-700">PASS (Masuk Range)</span>
                        </label>
                        <label
                            class="flex items-center gap-2 cursor-pointer border p-3 rounded-lg w-full hover:bg-red-50"
                            :class="formQC.hasil === 'FAIL' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200'">
                            <input type="radio" v-model="formQC.hasil" value="FAIL"
                                class="text-red-600 focus:ring-red-500">
                            <span class="text-sm font-bold text-red-700">FAIL (Out of Range)</span>
                        </label>
                    </div>
                </div>
                <div class="mt-4">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Riwayat QC Hari Ini</p>
                    <div class="border rounded-lg overflow-hidden text-xs">
                        <table class="w-full text-left">
                            <thead class="bg-gray-100 font-bold text-gray-500">
                                <tr>
                                    <th class="p-2">Jam</th>
                                    <th class="p-2">Alat</th>
                                    <th class="p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(log, i) in qcHistory" :key="i" class="border-b last:border-0">
                                    <td class="p-2 font-mono text-gray-500">{{ log.jam }}</td>
                                    <td class="p-2">{{ log.alat }} ({{ log.level }})</td>
                                    <td class="p-2 font-bold"
                                        :class="log.status === 'PASS' ? 'text-green-600' : 'text-red-600'">{{ log.status
                                        }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showQCModal = false">Tutup</BaseButton>
                    <BaseButton @click="submitQC">Simpan QC</BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showReagenModal" title="MONITORING STOK REAGEN" width="max-w-2xl">
            <div class="space-y-4">
                <div class="flex justify-between items-center bg-yellow-50 p-3 rounded border border-yellow-200">
                    <div class="flex gap-2 items-center text-yellow-800 text-xs font-bold">
                        <ExclamationTriangleIcon class="w-5 h-5" />
                        <span>Perhatian: Reagen dengan status EMPTY tidak bisa digunakan running sampel.</span>
                    </div>
                </div>
                <div class="border rounded-lg overflow-hidden">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-100 text-[10px] uppercase font-bold text-gray-500">
                            <tr>
                                <th class="p-3">Nama Reagen</th>
                                <th class="p-3 text-center">Sisa Stok</th>
                                <th class="p-3 text-center">Status</th>
                                <th class="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(item, idx) in reagenData" :key="idx" class="hover:bg-gray-50">
                                <td class="p-3 font-bold text-gray-700">{{ item.nama }}</td>
                                <td class="p-3 text-center font-mono">
                                    {{ item.sisa }} <span class="text-[10px] text-gray-400">{{ item.satuan }}</span>
                                </td>
                                <td class="p-3 text-center">
                                    <span v-if="item.status === 'OK'"
                                        class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">AMAN</span>
                                    <span v-else-if="item.status === 'WARNING'"
                                        class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold">MENIPIS</span>
                                    <span v-else
                                        class="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">HABIS</span>
                                </td>
                                <td class="p-3 text-right">
                                    <button v-if="item.status !== 'OK'" @click="requestRestock(item)"
                                        class="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 font-bold">Minta
                                        Stok</button>
                                    <span v-else class="text-gray-300 text-[10px] italic">--</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <template #footer>
                <BaseButton variant="secondary" class="w-full" @click="showReagenModal = false">Tutup</BaseButton>
            </template>
        </BaseModal>

    </div>
</template>