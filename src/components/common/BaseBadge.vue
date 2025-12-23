<script setup lang="ts">
interface Props {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray'
    dot?: boolean // Opsi ada titik kecil (dot) di kiri
}

withDefaults(defineProps<Props>(), {
    variant: 'gray',
    dot: false
})

const variants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200'
}

const dots = {
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    gray: 'bg-gray-500'
}
</script>

<template>
    <span
        class="inline-flex items-center gap-[4px] px-[6px] py-[1px] rounded-[4px] border text-[10px] font-bold uppercase tracking-wide whitespace-nowrap select-none"
        :class="variants[variant]">
        <span v-if="dot" class="w-[6px] h-[6px] rounded-full" :class="dots[variant]"></span>

        <slot />
    </span>
</template>