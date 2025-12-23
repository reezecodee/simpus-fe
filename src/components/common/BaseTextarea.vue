<script setup lang="ts">
interface Props {
    label?: string
    placeholder?: string
    rows?: number | string
    error?: string
    required?: boolean
    mono?: boolean
}

const model = defineModel<string>()

withDefaults(defineProps<Props>(), {
    rows: 3,
    required: false,
    mono: false
})
</script>

<template>
    <div class="flex flex-col gap-[4px]">
        <label v-if="label" class="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>

        <textarea v-model="model" :rows="rows" :placeholder="placeholder" class="w-full px-[10px] py-[8px] rounded-[6px] border border-gray-300 bg-white text-[12px] font-medium text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none
      focus:border-green-600 focus:ring-1 focus:ring-green-600 resize-none"
            :class="[error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300', mono ? 'font-mono tracking-tighter' : '']"></textarea>

        <span v-if="error" class="text-[9px] text-red-500 font-medium mt-[1px]">
            {{ error }}
        </span>
    </div>
</template>