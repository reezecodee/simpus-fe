<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  label?: string
  options: string[] // Asumsikan string array untuk creatable biar mudah
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = defineProps<Props>()
const model = defineModel<string>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// Filter opsi berdasarkan apa yang diketik user (model)
const filteredOptions = computed(() => {
  if (!model.value) return props.options
  const lower = model.value.toLowerCase()
  // Tampilkan opsi yang belum dipilih dan cocok
  return props.options.filter(opt => opt.toLowerCase().includes(lower) && opt !== model.value)
})

const onFocus = () => {
  if (!props.disabled) isOpen.value = true
}

const selectOption = (opt: string) => {
  model.value = opt
  isOpen.value = false
}

// Click Outside
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

    <div class="relative group">
      <input
        v-model="model"
        @focus="onFocus"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full h-[32px] pl-[10px] pr-[30px] rounded-[6px] border bg-white text-[12px] font-medium text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none
        focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:bg-gray-100 disabled:text-gray-500"
        :class="error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
      />
      
      <div 
        @click="isOpen = !isOpen"
        class="absolute right-0 top-0 h-full w-[30px] flex items-center justify-center cursor-pointer text-gray-400 hover:text-green-600"
      >
        <ChevronDownIcon class="w-[12px] h-[12px] transition-transform" :class="isOpen ? 'rotate-180' : ''" stroke-width="2.5" />
      </div>
    </div>

    <div v-if="isOpen && filteredOptions.length > 0" class="absolute top-full left-0 w-full mt-[4px] bg-white border border-gray-200 rounded-[6px] shadow-lg z-50 overflow-hidden">
      <ul class="max-h-[150px] overflow-y-auto">
        <li 
          v-for="(opt, idx) in filteredOptions" 
          :key="idx"
          @click="selectOption(opt)"
          class="px-[10px] py-[6px] text-[12px] text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-colors"
        >
          {{ opt }}
        </li>
      </ul>
    </div>

    <span v-if="error" class="text-[9px] text-red-500 font-medium mt-[1px]">
      {{ error }}
    </span>
  </div>
</template>