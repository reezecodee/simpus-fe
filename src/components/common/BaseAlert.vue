<script setup lang="ts">
import { ref } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  MegaphoneIcon, // Ikon spesial untuk Danger/Cito
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
const isVisible = ref(true)

// Style Configurations
const containerStyles = {
  success: 'bg-green-50 border-green-200',
  warning: 'bg-orange-50 border-orange-200',
  danger: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200'
}

const iconBgStyles = {
  success: 'bg-green-100 text-green-600',
  warning: 'bg-orange-100 text-orange-600',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600'
}

const textStyles = {
  success: 'text-green-800',
  warning: 'text-orange-800',
  danger: 'text-red-800',
  info: 'text-blue-800'
}

const subTextStyles = {
  success: 'text-green-600',
  warning: 'text-orange-600',
  danger: 'text-red-600',
  info: 'text-blue-600'
}

const icons = {
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: MegaphoneIcon, // Pakai Megaphone biar beda (CITO style)
  info: InformationCircleIcon
}

const handleClose = () => {
  isVisible.value = false
  emit('close')
}
</script>

<template>
  <div v-if="isVisible" class="rounded-lg border p-4 flex items-center gap-4 shadow-sm transition-all duration-300"
    :class="containerStyles[variant]">

    <div class="p-2 rounded-full flex-shrink-0" :class="iconBgStyles[variant]">
      <component :is="icons[variant]" class="w-6 h-6" stroke-width="2" />
    </div>

    <div class="flex-1">
      <h3 v-if="title" class="text-sm font-bold uppercase tracking-wide" :class="textStyles[variant]">
        {{ title }}
      </h3>
      <div class="text-xs mt-0.5 leading-relaxed" :class="subTextStyles[variant]">
        <slot />
      </div>
    </div>

    <div class="flex-shrink-0 flex items-center gap-2">
      <slot name="action" />

      <button v-if="dismissible" @click="handleClose" class="p-1 rounded hover:bg-black/5 transition-colors"
        :class="subTextStyles[variant]">
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

  </div>
</template>