<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Option {
  label: string
  value: string | number
}

interface Props {
  label?: string
  options: Option[]
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = defineProps<Props>()
const model = defineModel<string | number>()

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref<HTMLElement | null>(null)

// Computed: Filter opsi berdasarkan search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const lower = searchQuery.value.toLowerCase()
  return props.options.filter(opt => opt.label.toLowerCase().includes(lower))
})

// Computed: Cari label dari value yang terpilih
const selectedLabel = computed(() => {
  return props.options.find(opt => opt.value === model.value)?.label || ''
})

// Actions
const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) searchQuery.value = '' // Reset search saat buka
}

const selectOption = (opt: Option) => {
  model.value = opt.value
  isOpen.value = false
}

const clearSelection = () => {
  model.value = ''
  // isOpen.value = false
}

// Click Outside Logic (Tanpa library tambahan)
const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="containerRef" class="flex flex-col gap-[4px] relative">
    <label v-if="label" class="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <div 
      @click="toggle"
      class="w-full h-[32px] px-[10px] rounded-[6px] border bg-white flex items-center justify-between cursor-pointer transition-all duration-200"
      :class="[
        error ? 'border-red-500' : isOpen ? 'border-green-600 ring-1 ring-green-600' : 'border-gray-300',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'
      ]"
    >
      <span v-if="selectedLabel" class="text-[12px] font-medium text-gray-800 truncate select-none">{{ selectedLabel }}</span>
      <span v-else class="text-[12px] text-gray-400 truncate select-none">{{ placeholder || 'Pilih...' }}</span>

      <div class="flex items-center gap-1">
         <div v-if="model && !disabled" @click.stop="clearSelection" class="hover:bg-gray-200 rounded-full p-[1px] text-gray-400 hover:text-red-500 transition">
            <XMarkIcon class="w-[12px] h-[12px]" />
         </div>
         <ChevronDownIcon class="w-[12px] h-[12px] text-gray-400 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" stroke-width="2.5" />
      </div>
    </div>

    <div v-if="isOpen" class="absolute top-full left-0 w-full mt-[4px] bg-white border border-gray-200 rounded-[6px] shadow-lg z-50 overflow-hidden flex flex-col">
      
      <div class="p-[6px] border-b border-gray-100 bg-gray-50">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-2 top-1/2 -translate-y-1/2 w-[12px] h-[12px] text-gray-400" />
          <input 
            v-model="searchQuery"
            ref="searchInput"
            placeholder="Cari..." 
            class="w-full h-[26px] pl-[24px] pr-[8px] text-[11px] rounded-[4px] border border-gray-200 focus:border-green-500 focus:outline-none"
            autofocus
          />
        </div>
      </div>

      <ul class="max-h-[180px] overflow-y-auto">
        <li 
          v-for="opt in filteredOptions" 
          :key="opt.value"
          @click="selectOption(opt)"
          class="px-[10px] py-[6px] text-[12px] text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-colors"
          :class="model === opt.value ? 'bg-green-50 text-green-700 font-bold' : ''"
        >
          {{ opt.label }}
        </li>
        <li v-if="filteredOptions.length === 0" class="px-[10px] py-[8px] text-[11px] text-gray-400 text-center italic">
          Tidak ditemukan.
        </li>
      </ul>
    </div>

    <span v-if="error" class="text-[9px] text-red-500 font-medium mt-[1px]">
      {{ error }}
    </span>
  </div>
</template>