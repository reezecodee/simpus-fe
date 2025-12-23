<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
    variant?: 'primary' | 'secondary' | 'danger'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    icon?: Component
    block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    type: 'button',
    loading: false,
    block: false
})

const variants = {
    primary: 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-sm border border-transparent',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent'
}
</script>

<template>
    <button :type="type" :disabled="loading"
        class="inline-flex items-center justify-center gap-[6px] h-[32px] px-[12px] rounded-[6px] text-[12px] font-bold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
        :class="[variants[variant], block ? 'w-full' : '']">
        <svg v-if="loading" class="animate-spin h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
        </svg>

        <component v-if="icon && !loading" :is="icon" class="w-[14px] h-[14px]" stroke-width="2.5" />

        <span>
            <slot />
        </span>
    </button>
</template>