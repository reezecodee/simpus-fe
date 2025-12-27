<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseDataTable, { type TableColumn } from '@/components/common/BaseDataTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'

// --- ICONS ---
import {
    ArrowLeftIcon,
    ChartBarIcon,
    PencilSquareIcon,
    BeakerIcon,
    PlusIcon,
    CheckCircleIcon,
    HeartIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const activeTab = ref('TTV')

// --- DATA STATE ---
const patient = {
    nama: 'Tn. Budi Santoso',
    rm: 'RM-12345',
    kamar: 'Mawar - 301A',
    diagnosa: 'DHF Grade II (Demam Berdarah)'
}

const ttvLogs = ref([
    { waktu: '27-12-2025 12:00', suhu: 39.2, nadi: 98, td: '110/70', nafas: 22, petugas: 'Ns. Atyla' },
    { waktu: '27-12-2025 08:00', suhu: 38.5, nadi: 88, td: '120/80', nafas: 20, petugas: 'Ns. Atyla' },
])

const soapLogs = ref([
    { waktu: '27-12-2025 08:30', s: 'Pasien mengeluh pusing dan mual sejak pagi.', o: 'Kesadaran CM, Suhu 38.5, bintik merah (+)', a: 'Hipertermia belum teratasi', p: 'Berikan kompres hangat, pantau cairan infus.', petugas: 'Ns. Atyla' }
])

const medications = ref([
    { id: 1, nama: 'Paracetamol 500mg', dosis: '3 x 1 Tablet', rute: 'Oral', jam: '14:00', status: 'Given', petugas: 'Ns. Atyla' },
    { id: 2, nama: 'Ceftriaxone 1gr', dosis: '2 x 1 Vial', rute: 'IV', jam: '18:00', status: 'Pending', petugas: '-' }
])

// --- MODAL & FORM STATE ---
const showModalTTV = ref(false)
const showModalSOAP = ref(false)

const formTTV = reactive({ suhu: '', nadi: '', td_s: '', td_d: '', nafas: '' })
const formSOAP = reactive({ s: '', o: '', a: '', p: '' })

// ==========================================
// LOGIC FUNCTIONS
// ==========================================

const handleSaveTTV = () => {
    ttvLogs.value.unshift({
        waktu: new Date().toLocaleString('id-ID').replace(/\//g, '-'),
        suhu: Number(formTTV.suhu),
        nadi: Number(formTTV.nadi),
        td: `${formTTV.td_s}/${formTTV.td_d}`,
        nafas: Number(formTTV.nafas) || 20,
        petugas: 'Ns. Atyla'
    })
    Object.assign(formTTV, { suhu: '', nadi: '', td_s: '', td_d: '', nafas: '' })
    showModalTTV.value = false
}

const handleSaveSOAP = () => {
    soapLogs.value.unshift({
        waktu: new Date().toLocaleString('id-ID').replace(/\//g, '-'),
        ...formSOAP,
        petugas: 'Ns. Atyla'
    })
    Object.assign(formSOAP, { s: '', o: '', a: '', p: '' })
    showModalSOAP.value = false
}

const verifyMedication = (id: number) => {
    const med = medications.value.find(m => m.id === id)
    if (med) {
        med.status = 'Given'
        med.petugas = 'Ns. Atyla'
    }
}
</script>

<template>
    <div class="space-y-6">

        <div class="flex justify-between items-center px-1">
            <div class="flex items-center gap-4">
                <button @click="router.back()"
                    class="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 text-slate-900 shadow-sm transition-all">
                    <ArrowLeftIcon class="w-5 h-5" />
                </button>
                <div>
                    <h1 class="text-xl font-bold text-slate-900">Asuhan Keperawatan</h1>
                    <p class="text-sm text-slate-600 font-medium">{{ patient.nama }} <span
                            class="text-slate-300 mx-1">|</span> {{ patient.rm }}</p>
                </div>
            </div>
            <span
                class="text-xs font-bold text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200 flex items-center gap-2">
                <ExclamationTriangleIcon class="w-4 h-4" /> Diagnosa: {{ patient.diagnosa }}
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
                class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-red-600 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-slate-500 mb-1">Suhu Terakhir</p>
                    <p class="text-2xl font-bold text-red-700">{{ ttvLogs[0]?.suhu }}°C</p>
                </div>
                <HeartIcon class="w-8 h-8 text-red-100" />
            </div>
            <div
                class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-blue-600 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-slate-500 mb-1">Nadi Terakhir</p>
                    <p class="text-2xl font-bold text-blue-700">{{ ttvLogs[0]?.nadi }}</p>
                </div>
                <ChartBarIcon class="w-8 h-8 text-blue-100" />
            </div>
            <div
                class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-orange-600 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-slate-500 mb-1">Obat Pending</p>
                    <p class="text-2xl font-bold text-orange-700">{{medications.filter(m => m.status ===
                        'Pending').length }}</p>
                </div>
                <BeakerIcon class="w-8 h-8 text-orange-100" />
            </div>
            <div
                class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-emerald-600 flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-slate-500 mb-1">Lokasi Kamar</p>
                    <p class="text-2xl font-bold text-emerald-700">{{ patient.kamar }}</p>
                </div>
                <ClockIcon class="w-8 h-8 text-emerald-100" />
            </div>
        </div>

        <div
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden border-t-4 border-t-emerald-600 min-h-[500px]">
            <div class="flex border-b border-gray-100 bg-gray-50/50">
                <button v-for="t in [
                    { id: 'TTV', label: 'Tanda Vital & Grafik', icon: ChartBarIcon },
                    { id: 'SOAP', label: 'Catatan SOAP (CPPT)', icon: PencilSquareIcon },
                    { id: 'OBAT', label: 'Pemberian Obat (e-MAR)', icon: BeakerIcon }
                ]" :key="t.id" @click="activeTab = t.id"
                    class="flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-r border-gray-100 last:border-0"
                    :class="activeTab === t.id ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-emerald-700 hover:bg-gray-100'">
                    <component :is="t.icon" class="w-4 h-4" /> {{ t.label }}
                </button>
            </div>

            <div class="p-8">
                <div v-if="activeTab === 'TTV'" class="space-y-8 animate-fadeIn">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2">
                            <ChartBarIcon class="w-5 h-5 text-emerald-600" /> Grafik Observasi Harian
                        </h3>
                        <BaseButton :icon="PlusIcon" size="sm" @click="showModalTTV = true">Input TTV Baru</BaseButton>
                    </div>

                    <div
                        class="h-44 bg-gray-50 rounded-xl border border-gray-100 p-8 flex items-end justify-around relative">
                        <div v-for="log in ttvLogs" :key="log.waktu" class="flex flex-col items-center">
                            <div class="w-10 bg-emerald-500 rounded-t-lg shadow-sm"
                                :style="{ height: (log.suhu - 30) * 12 + 'px' }"></div>
                            <span class="text-xs font-bold text-emerald-700 mt-2">{{ log.suhu }}°C</span>
                        </div>
                    </div>

                    <BaseDataTable :columns="[
                        { key: 'waktu', label: 'Waktu Pemeriksaan' },
                        { key: 'suhu', label: 'Suhu', align: 'center' },
                        { key: 'nadi', label: 'Nadi', align: 'center' },
                        { key: 'td', label: 'Tensi', align: 'center' },
                        { key: 'petugas', label: 'Petugas', align: 'right' }
                    ]" :data="ttvLogs" hide-search />
                </div>

                <div v-if="activeTab === 'SOAP'" class="space-y-6 animate-fadeIn">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2">
                            <PencilSquareIcon class="w-5 h-5 text-emerald-600" /> Catatan Perkembangan Pasien
                        </h3>
                        <BaseButton :icon="PlusIcon" size="sm" variant="secondary" @click="showModalSOAP = true">Tambah
                            Catatan</BaseButton>
                    </div>
                    <div v-for="(soap, i) in soapLogs" :key="i"
                        class="border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
                        <div
                            class="bg-blue-50 px-5 py-3 border-b border-blue-100 flex justify-between items-center text-xs font-bold text-blue-700">
                            <span>{{ soap.waktu }}</span>
                            <span>{{ soap.petugas }}</span>
                        </div>
                        <div class="p-6 text-sm text-slate-800 space-y-3 leading-relaxed">
                            <p><span class="font-bold text-blue-700 w-10 inline-block">S :</span> {{ soap.s }}</p>
                            <p><span class="font-bold text-blue-700 w-10 inline-block">O :</span> {{ soap.o }}</p>
                            <p><span class="font-bold text-red-700 w-10 inline-block">A :</span> {{ soap.a }}</p>
                            <p><span class="font-bold text-emerald-700 w-10 inline-block">P :</span> {{ soap.p }}</p>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'OBAT'" class="space-y-6 animate-fadeIn">
                    <div class="border rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm border-gray-200">
                        <div v-for="m in medications" :key="m.id"
                            class="p-5 flex justify-between items-center hover:bg-gray-50 transition-all">
                            <div>
                                <p class="font-bold text-slate-900">{{ m.nama }}</p>
                                <p class="text-xs text-slate-500 font-medium mt-1">{{ m.rute }} • Jadwal: {{ m.jam }} •
                                    {{ m.dosis }}</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <span v-if="m.status === 'Given'"
                                    class="text-emerald-700 font-bold text-xs flex items-center gap-1 italic">
                                    <CheckCircleIcon class="w-5 h-5" /> Sudah diberikan oleh {{ m.petugas }}
                                </span>
                                <BaseButton v-else size="sm" @click="verifyMedication(m.id)">Verifikasi</BaseButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <BaseModal v-model="showModalTTV" title="Input Observasi Vital Baru" width="max-w-md">
            <div class="space-y-4 pt-2">
                <div class="grid grid-cols-2 gap-4">
                    <BaseInput label="Suhu (°C)" v-model="formTTV.suhu" type="number" placeholder="36.5" />
                    <BaseInput label="Nadi (x/mnt)" v-model="formTTV.nadi" type="number" placeholder="80" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <BaseInput label="Tensi Sistol" v-model="formTTV.td_s" placeholder="120" />
                    <BaseInput label="Tensi Diastol" v-model="formTTV.td_d" placeholder="80" />
                </div>
                <BaseInput label="Pernafasan" v-model="formTTV.nafas" type="number" placeholder="20" />
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModalTTV = false">Batal</BaseButton>
                    <BaseButton @click="handleSaveTTV">Simpan Observasi</BaseButton>
                </div>
            </template>
        </BaseModal>

        <BaseModal v-model="showModalSOAP" title="Tambah Catatan SOAP Baru" width="max-w-2xl">
            <div class="space-y-4 pt-2">
                <BaseTextarea label="Subjektif (S)" v-model="formSOAP.s" rows="2"
                    placeholder="Keluhan subjektif pasien..." />
                <BaseTextarea label="Objektif (O)" v-model="formSOAP.o" rows="2"
                    placeholder="Hasil pemeriksaan fisik/vital..." />
                <BaseTextarea label="Asesmen (A)" v-model="formSOAP.a" rows="2"
                    placeholder="Analisa masalah keperawatan..." />
                <BaseTextarea label="Planning (P)" v-model="formSOAP.p" rows="2"
                    placeholder="Rencana tindakan lanjutan..." />
            </div>
            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <BaseButton variant="secondary" @click="showModalSOAP = false">Batal</BaseButton>
                    <BaseButton @click="handleSaveSOAP">Simpan Catatan</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>