<script setup lang="ts">
import { ref } from 'vue' // Import ref
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info'
  title?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: false
})

const emit = defineEmits(['close'])

// 1. STATE INTERNAL: Kontrol visibilitas sendiri
const isVisible = ref(true)

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const icons = {
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: XCircleIcon,
  info: InformationCircleIcon
}

// 2. ACTION CLOSE: Sembunyikan alert & kabari parent
const handleClose = () => {
  isVisible.value = false
  emit('close')
}
</script>

<template>
  <div 
    v-if="isVisible"
    class="flex items-start gap-[10px] p-[10px] rounded-[6px] border text-[12px] transition-all duration-300"
    :class="styles[variant]"
  >
    <component :is="icons[variant]" class="w-[16px] h-[16px] flex-shrink-0 mt-[1px]" stroke-width="2" />

    <div class="flex-1">
      <h4 v-if="title" class="font-bold mb-[2px]">{{ title }}</h4>
      <div class="opacity-90 leading-relaxed">
        <slot />
      </div>
    </div>

    <button 
      v-if="dismissible" 
      @click="handleClose"
      type="button"
      class="hover:bg-black/5 rounded p-[2px] transition cursor-pointer"
    >
      <XMarkIcon class="w-[14px] h-[14px]" />
    </button>
  </div>
</template>