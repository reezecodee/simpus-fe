<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
    label?: string
    placeholder?: string
    suggestions?: string[] // List saran (misal master data ICD-10)
    error?: string
    disabled?: boolean
    required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    suggestions: () => [],
    disabled: false
})

// Model Value adalah Array String (List badge yang sudah dipilih)
const model = defineModel<string[]>({ default: [] })

// State internal
const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const showSuggestions = ref(false)
const activeIndex = ref(-1) // Untuk navigasi keyboard di dropdown

// Filter Suggestions berdasarkan input
const filteredSuggestions = computed(() => {
    if (!inputValue.value) return []
    const lower = inputValue.value.toLowerCase()
    // Tampilkan saran yang belum dipilih & cocok
    return props.suggestions.filter(s =>
        s.toLowerCase().includes(lower) && !model.value.includes(s)
    ).slice(0, 10) // Limit 10 saran biar gak kepanjangan
})

// --- ACTIONS ---

// 1. Tambah Badge (via Spasi/Enter)
const addBadge = () => {
    const val = inputValue.value.trim()
    if (val) {
        // Cek duplikat
        if (!model.value.includes(val)) {
            model.value.push(val)
        }
        inputValue.value = '' // Reset input
        showSuggestions.value = false
    }
}

// 2. Hapus Badge (Klik tombol X)
const removeBadge = (index: number) => {
    if (props.disabled) return
    model.value.splice(index, 1)
    inputRef.value?.focus()
}

// 3. Handle Keyboard Khusus
const handleKeydown = (e: KeyboardEvent) => {
    if (props.disabled) return

    // SPASI / ENTER: Buat Badge
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()

        // FIX ERROR: Ambil dulu nilainya ke variabel
        const selectedSuggestion = filteredSuggestions.value[activeIndex.value]

        // Cek: Jika dropdown aktif DAN ada nilai yang valid (tidak undefined)
        if (showSuggestions.value && activeIndex.value >= 0 && selectedSuggestion) {
            selectSuggestion(selectedSuggestion) // Sekarang aman, tipe pasti string
        } else {
            addBadge()
        }
    }

    // BACKSPACE: Hapus badge terakhir jika input kosong
    if (e.key === 'Backspace' && inputValue.value === '' && model.value.length > 0) {
        model.value.pop()
    }

    // ARROW DOWN: Navigasi Dropdown
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (activeIndex.value < filteredSuggestions.value.length - 1) activeIndex.value++
    }

    // ARROW UP: Navigasi Dropdown
    if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (activeIndex.value > 0) activeIndex.value--
    }
}

// 4. Pilih dari Suggestion
const selectSuggestion = (val: string) => {
    if (!model.value.includes(val)) {
        model.value.push(val)
    }
    inputValue.value = ''
    showSuggestions.value = false
    inputRef.value?.focus()
}

// Focus Wrapper
const focusInput = () => {
    inputRef.value?.focus()
}

// Watch input untuk toggle dropdown
watch(inputValue, (val) => {
    showSuggestions.value = val.length > 0
    activeIndex.value = -1 // Reset navigasi saat ketik ulang
})
</script>

<template>
    <div class="flex flex-col gap-[4px] relative">
        <label v-if="label" class="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>

        <div @click="focusInput"
            class="w-full min-h-[32px] px-[6px] py-[3px] rounded-[6px] border bg-white flex flex-wrap items-center gap-[4px] cursor-text transition-all duration-200"
            :class="[
                error ? 'border-red-500' : 'border-gray-300 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600',
                disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            ]">
            <div v-for="(badge, idx) in model" :key="idx"
                class="bg-green-100 text-green-800 px-[6px] py-[1px] rounded-[4px] flex items-center gap-[4px] border border-green-200 animate-fadeIn">
                <span class="text-[11px] font-bold font-mono tracking-tight">{{ badge }}</span>

                <button @click.stop="removeBadge(idx)" type="button"
                    class="hover:bg-green-200 rounded-full w-[12px] h-[12px] flex items-center justify-center transition-colors text-green-700">
                    <XMarkIcon class="w-[10px] h-[10px]" stroke-width="3" />
                </button>
            </div>

            <input ref="inputRef" v-model="inputValue" @keydown="handleKeydown"
                :placeholder="model.length === 0 ? placeholder : ''" :disabled="disabled"
                class="flex-1 min-w-[60px] bg-transparent text-[12px] font-medium text-gray-800 placeholder-gray-400 outline-none h-[24px]"
                autocomplete="off" />
        </div>

        <div v-if="showSuggestions && filteredSuggestions.length > 0"
            class="absolute top-full left-0 w-full mt-[4px] bg-white border border-gray-200 rounded-[6px] shadow-lg z-50 overflow-hidden">
            <ul class="max-h-[150px] overflow-y-auto">
                <li v-for="(item, idx) in filteredSuggestions" :key="idx" @click="selectSuggestion(item)"
                    class="px-[10px] py-[6px] text-[12px] text-gray-700 cursor-pointer transition-colors flex items-center justify-between"
                    :class="idx === activeIndex ? 'bg-green-50 text-green-700 font-bold' : 'hover:bg-gray-50'">
                    <span>{{ item }}</span>
                    <span v-if="idx === activeIndex" class="text-[9px] text-green-600">Enter ↵</span>
                </li>
            </ul>
        </div>

        <span v-if="error" class="text-[9px] text-red-500 font-medium mt-[1px]">
            {{ error }}
        </span>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>