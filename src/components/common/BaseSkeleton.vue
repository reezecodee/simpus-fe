<script setup lang="ts">
interface Props {
    width?: string
    height?: string
    circle?: boolean
    className?: string
}

withDefaults(defineProps<Props>(), {
    width: '100%',
    height: '20px',
    circle: false,
    className: ''
})
</script>

<template>
    <div class="animate-pulse bg-gray-200" :class="[
        circle ? 'rounded-full' : 'rounded-[4px]',
        className
    ]" :style="{ width, height }"></div>
</template>