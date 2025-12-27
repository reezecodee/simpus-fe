<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// --- COMPONENTS ---
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseModal from '@/components/common/BaseModal.vue'

// --- ICONS ---
import {
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    TrashIcon,
    BanknotesIcon,
    PlusIcon,
    MinusIcon,
    PrinterIcon,
    CheckCircleIcon,
    CreditCardIcon,
    QrCodeIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. DATA STATE
// ==========================================

// Dummy Master Obat
const products = ref([
    { id: 1, name: 'Panadol Extra (Strip)', category: 'Obat Bebas', price: 14500, stock: 50 },
    { id: 2, name: 'Vitamin C IPI (Botol)', category: 'Vitamin', price: 8000, stock: 24 },
    { id: 3, name: 'Minyak Kayu Putih 60ml', category: 'Herbal', price: 22000, stock: 15 },
    { id: 4, name: 'Betadine Cair 15ml', category: 'P3K', price: 18000, stock: 10 },
    { id: 5, name: 'Promag Tablet (Strip)', category: 'Obat Lambung', price: 9500, stock: 100 },
    { id: 6, name: 'Insto Regular (Tetes Mata)', category: 'Obat Mata', price: 16000, stock: 5 },
    { id: 7, name: 'Salonpas Koyo (Sachet)', category: 'Obat Luar', price: 5000, stock: 0 },
])

const searchQuery = ref('')
const cart = ref<any[]>([])

// --- STATE PEMBAYARAN ---
const paymentMethod = ref<'TUNAI' | 'QRIS' | 'DEBIT'>('TUNAI')
const uangDiterima = ref<number | null>(null)
const noRef = ref('') // Untuk mencatat No Ref QRIS/EDC

// Modal Struk
const showSuccessModal = ref(false)
const lastTransaction = ref<any>(null)

// ==========================================
// 2. COMPUTED & LOGIC
// ==========================================

const filteredProducts = computed(() => {
    return products.value.filter(p =>
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const subTotal = computed(() => {
    return cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0)
})

// Logic Kembalian & Validasi
const kembalian = computed(() => {
    if (paymentMethod.value !== 'TUNAI') return 0 // Non-tunai tidak ada kembalian
    if (!uangDiterima.value) return 0 - subTotal.value
    return uangDiterima.value - subTotal.value
})

const isValidCheckout = computed(() => {
    if (cart.value.length === 0) return false

    if (paymentMethod.value === 'TUNAI') {
        return (uangDiterima.value || 0) >= subTotal.value
    } else {
        // Kalau Non-Tunai, dianggap valid asal cart ada isinya
        // (Opsional: Bisa tambah validasi wajib isi No Ref)
        return true
    }
})

// WATCHER: Kalau ganti metode ke Non-Tunai, otomatis uang diterima = subtotal
watch(paymentMethod, (newVal) => {
    if (newVal !== 'TUNAI') {
        uangDiterima.value = subTotal.value
    } else {
        uangDiterima.value = null
    }
})

const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

// --- CART ACTIONS ---
const addToCart = (product: any) => {
    if (product.stock <= 0) return alert('Stok Habis!')
    const existingItem = cart.value.find(item => item.id === product.id)
    if (existingItem) {
        if (existingItem.qty < product.stock) existingItem.qty++
        else alert('Stok tidak mencukupi!')
    } else {
        cart.value.push({ ...product, qty: 1 })
    }
    // Update uang diterima real-time kalau mode non-tunai
    if (paymentMethod.value !== 'TUNAI') uangDiterima.value = subTotal.value
}

const updateQty = (item: any, delta: number) => {
    const target = cart.value.find(c => c.id === item.id)
    if (!target) return
    const newQty = target.qty + delta
    if (newQty > 0 && newQty <= item.stock) target.qty = newQty
    // Update uang diterima real-time kalau mode non-tunai
    if (paymentMethod.value !== 'TUNAI') uangDiterima.value = subTotal.value
}

const removeFromCart = (index: number) => {
    cart.value.splice(index, 1)
    // Update uang diterima real-time kalau mode non-tunai
    if (paymentMethod.value !== 'TUNAI') uangDiterima.value = subTotal.value
}

// --- CHECKOUT PROCESS ---
const processCheckout = () => {
    if (!isValidCheckout.value) return

    lastTransaction.value = {
        no_transaksi: `POS-${Date.now().toString().slice(-6)}`,
        tanggal: new Date().toLocaleString('id-ID'),
        items: [...cart.value],
        total: subTotal.value,
        bayar: uangDiterima.value,
        kembali: kembalian.value,
        metode: paymentMethod.value,
        ref: noRef.value || '-'
    }

    // Reset State
    cart.value = []
    uangDiterima.value = null
    noRef.value = ''
    searchQuery.value = ''
    paymentMethod.value = 'TUNAI' // Balikin ke Tunai default

    // Kurangi Stok Dummy
    lastTransaction.value.items.forEach((sold: any) => {
        const product = products.value.find(p => p.id === sold.id)
        if (product) product.stock -= sold.qty
    })

    showSuccessModal.value = true
}
</script>

<template>
    <div class="h-[calc(100vh-100px)] flex flex-col">

        <div class="flex justify-between items-center mb-4 px-1">
            <div>
                <h1 class="text-[20px] font-bold text-gray-900 uppercase tracking-tight">Penjualan Bebas (OTC)</h1>
                <p class="text-[12px] text-gray-500">Kasir obat tanpa resep dokter.</p>
            </div>
            <div class="flex flex-col items-end">
                <div
                    class="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-200 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Shift Pagi: Admin Farmasi
                </div>
                <p class="text-[10px] text-gray-400 mt-1">Laci Kasir #01 - Buka: 07:00</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">

            <div
                class="lg:col-span-2 flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-4 border-b border-gray-100 bg-gray-50">
                    <BaseInput v-model="searchQuery" :icon="MagnifyingGlassIcon" placeholder="Cari nama obat..."
                        class="bg-white" />
                </div>
                <div class="flex-1 overflow-y-auto p-4">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div v-for="product in filteredProducts" :key="product.id" @click="addToCart(product)"
                            class="group relative border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-blue-400 bg-white"
                            :class="{ 'opacity-60 cursor-not-allowed bg-gray-50': product.stock === 0 }">
                            <div class="flex justify-between items-start mb-2">
                                <span
                                    class="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{{
                                    product.category }}</span>
                                <span class="text-[10px] font-black"
                                    :class="product.stock > 0 ? 'text-green-600' : 'text-red-500'">Stok: {{
                                    product.stock }}</span>
                            </div>
                            <h3 class="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 leading-tight">{{
                                product.name }}</h3>
                            <div class="flex justify-between items-end mt-3">
                                <span class="font-mono text-sm font-black text-gray-900">{{ formatRp(product.price)
                                    }}</span>
                                <div class="bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    v-if="product.stock > 0">
                                    <PlusIcon class="w-4 h-4" />
                                </div>
                            </div>
                            <div v-if="product.stock === 0"
                                class="absolute inset-0 bg-white/50 flex items-center justify-center">
                                <span
                                    class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow transform -rotate-12">HABIS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden border-t-[4px] border-t-green-600">
                <div class="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 class="font-bold text-gray-700 text-sm flex items-center gap-2">
                        <ShoppingCartIcon class="w-4 h-4" /> Keranjang Belanja
                    </h3>
                    <span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{{
                        cart.length }} Item</span>
                </div>

                <div class="flex-1 overflow-y-auto p-3 space-y-3">
                    <div v-if="cart.length === 0"
                        class="h-full flex flex-col items-center justify-center text-gray-400">
                        <ShoppingCartIcon class="w-12 h-12 mb-2 opacity-10" />
                        <p class="text-xs italic">Keranjang kosong</p>
                    </div>
                    <div v-for="(item, index) in cart" :key="index"
                        class="flex justify-between items-center bg-white border border-gray-100 p-2 rounded shadow-sm">
                        <div class="flex-1">
                            <p class="text-[11px] font-bold text-gray-800 line-clamp-1">{{ item.name }}</p>
                            <p class="text-[10px] text-gray-500 font-mono">{{ formatRp(item.price) }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center border border-gray-300 rounded overflow-hidden">
                                <button @click="updateQty(item, -1)"
                                    class="px-1.5 py-1 hover:bg-gray-100 bg-gray-50 text-gray-600">
                                    <MinusIcon class="w-3 h-3" />
                                </button>
                                <input type="text" readonly :value="item.qty"
                                    class="w-8 text-center text-[10px] font-bold border-x border-gray-300 py-1" />
                                <button @click="updateQty(item, 1)"
                                    class="px-1.5 py-1 hover:bg-gray-100 bg-gray-50 text-blue-600">
                                    <PlusIcon class="w-3 h-3" />
                                </button>
                            </div>
                            <div class="w-16 text-right">
                                <p class="text-[11px] font-bold text-gray-800">{{ formatRp(item.price * item.qty) }}</p>
                            </div>
                            <button @click="removeFromCart(index)" class="text-gray-400 hover:text-red-500">
                                <TrashIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-gray-50 border-t border-gray-200 space-y-3">

                    <div class="flex justify-between items-end border-b border-gray-200 pb-2">
                        <span class="font-bold text-gray-700 text-sm">TOTAL TAGIHAN</span>
                        <span class="text-xl font-black text-gray-900">{{ formatRp(subTotal) }}</span>
                    </div>

                    <div>
                        <label class="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Metode
                            Pembayaran</label>
                        <div class="grid grid-cols-3 gap-2">
                            <button @click="paymentMethod = 'TUNAI'"
                                class="flex items-center justify-center gap-1 py-2 rounded border text-xs font-bold transition-all"
                                :class="paymentMethod === 'TUNAI' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'">
                                <BanknotesIcon class="w-4 h-4" /> Tunai
                            </button>
                            <button @click="paymentMethod = 'QRIS'"
                                class="flex items-center justify-center gap-1 py-2 rounded border text-xs font-bold transition-all"
                                :class="paymentMethod === 'QRIS' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'">
                                <QrCodeIcon class="w-4 h-4" /> QRIS
                            </button>
                            <button @click="paymentMethod = 'DEBIT'"
                                class="flex items-center justify-center gap-1 py-2 rounded border text-xs font-bold transition-all"
                                :class="paymentMethod === 'DEBIT' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'">
                                <CreditCardIcon class="w-4 h-4" /> Debit
                            </button>
                        </div>
                    </div>

                    <div v-if="paymentMethod === 'TUNAI'">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 font-bold text-xs">Rp</span>
                            </div>
                            <input type="number" v-model="uangDiterima" placeholder="Uang diterima..."
                                class="pl-8 block w-full rounded-lg border-gray-300 bg-white border focus:ring-green-500 focus:border-green-500 text-sm py-2 font-mono font-bold" />
                        </div>
                        <div class="mt-2 flex justify-between text-xs animate-in fade-in" v-if="uangDiterima">
                            <span class="font-bold" :class="kembalian >= 0 ? 'text-green-600' : 'text-red-500'">{{
                                kembalian >= 0 ? 'Kembalian' : 'Kurang' }}</span>
                            <span class="font-mono font-bold"
                                :class="kembalian >= 0 ? 'text-green-600' : 'text-red-500'">{{
                                formatRp(Math.abs(kembalian)) }}</span>
                        </div>
                    </div>

                    <div v-else
                        class="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center animate-in fade-in slide-in-from-bottom-1">
                        <p class="text-[10px] text-gray-500 uppercase font-bold mb-1">Status Pembayaran</p>
                        <p class="text-sm font-bold text-blue-700 flex items-center justify-center gap-2">
                            <CheckCircleIcon class="w-5 h-5" />
                            LUNAS OTOMATIS
                        </p>
                        <p class="text-[10px] text-gray-400 mt-1 italic">
                            Pastikan struk EDC / Bukti Transfer sudah keluar.
                        </p>
                    </div>

                    <BaseButton class="w-full justify-center py-3 text-sm" :disabled="!isValidCheckout"
                        @click="processCheckout">
                        PROSES BAYAR ({{ paymentMethod }})
                    </BaseButton>
                </div>
            </div>
        </div>

        <BaseModal v-if="lastTransaction" v-model="showSuccessModal" title="TRANSAKSI BERHASIL" width="max-w-md">
            <div class="text-center space-y-4 py-4">
                <div class="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <CheckCircleIcon class="w-12 h-12 text-green-600" />
                </div>
                <div>
                    <h3 class="font-bold text-gray-900 text-lg">Pembayaran Diterima</h3>
                    <p class="text-gray-500 text-xs">{{ lastTransaction.no_transaksi }} | {{ lastTransaction.tanggal }}
                    </p>
                </div>

                <div class="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300 text-left">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-500">Metode</span>
                        <span class="font-bold text-gray-800">{{ lastTransaction.metode }}</span>
                    </div>
                    <div v-if="lastTransaction.metode !== 'TUNAI'" class="flex justify-between text-sm mb-1">
                        <span class="text-gray-500">No. Ref</span>
                        <span class="font-mono text-xs text-gray-800">{{ lastTransaction.ref }}</span>
                    </div>
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-500">Total Tagihan</span>
                        <span class="font-bold text-gray-800">{{ formatRp(lastTransaction.total) }}</span>
                    </div>

                    <div v-if="lastTransaction.metode === 'TUNAI'" class="border-t border-gray-200 my-2 pt-2">
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-gray-500">Tunai</span>
                            <span class="font-bold text-gray-800">{{ formatRp(lastTransaction.bayar) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="font-bold text-green-600">KEMBALIAN</span>
                            <span class="font-black text-green-600">{{ formatRp(lastTransaction.kembali) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2 w-full">
                    <BaseButton variant="secondary" class="flex-1" @click="showSuccessModal = false">Tutup</BaseButton>
                    <BaseButton variant="primary" class="flex-1" :icon="PrinterIcon">
                        Cetak Struk</BaseButton>
                </div>
            </template>
        </BaseModal>

    </div>
</template>