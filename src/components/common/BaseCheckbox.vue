<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

interface Props {
  label?: string
  value?: string | number | boolean // Nilai jika dipakai dalam Array
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

// Model bisa berupa Boolean (single) atau Array (multiple)
const model = defineModel<boolean | any[]>()

// Cek apakah checkbox ini sedang "checked"
const isChecked = computed(() => {
  if (Array.isArray(model.value)) {
    return model.value.includes(props.value)
  }
  return model.value === true
})

// Handle klik
const toggle = () => {
  if (props.disabled) return

  if (Array.isArray(model.value)) {
    const newValue = [...model.value]
    if (isChecked.value) {
      // Remove
      const index = newValue.indexOf(props.value)
      if (index > -1) newValue.splice(index, 1)
    } else {
      // Add
      newValue.push(props.value)
    }
    model.value = newValue
  } else {
    // Toggle Boolean
    model.value = !model.value
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div 
      @click="toggle"
      class="flex items-center gap-[8px] cursor-pointer group select-none"
      :class="disabled ? 'opacity-50 cursor-not-allowed' : ''"
    >
      <div 
        class="w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center transition-all duration-200 shadow-sm"
        :class="[
          isChecked 
            ? 'bg-[#16a34a] border-[#16a34a]' 
            : 'bg-white border-gray-300 group-hover:border-[#16a34a]',
          error ? 'border-red-500' : ''
        ]"
      >
        <CheckIcon 
          v-if="isChecked" 
          class="w-[12px] h-[12px] text-white stroke-[3.5]" 
        />
      </div>

      <span v-if="label" class="text-[12px] font-medium text-gray-700 pt-[1px]">
        {{ label }}
      </span>
    </div>

    <span v-if="error" class="text-[9px] text-red-500 font-medium ml-[24px] mt-[1px]">
      {{ error }}
    </span>
  </div>
</template>