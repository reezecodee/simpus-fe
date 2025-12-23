<script setup lang="ts">
import { ref } from 'vue'
import { CloudArrowUpIcon, XMarkIcon, DocumentIcon } from '@heroicons/vue/24/outline'

interface Props {
    label?: string
    accept?: string // misal: "image/*,.pdf"
    multiple?: boolean
    maxSizeMb?: number // Validasi ukuran
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    accept: '*/*',
    multiple: false,
    maxSizeMb: 5
})

const model = defineModel<File[]>({ default: [] }) // Output berupa Array File

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Helpers
const triggerSelect = () => fileInput.value?.click()

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    const droppedFiles = e.dataTransfer?.files
    if (droppedFiles) processFiles(droppedFiles)
}

const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files) processFiles(target.files)
}

const processFiles = (fileList: FileList) => {
    const newFiles: File[] = []

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        if (!file) continue // Cek 1: Pastikan file ada saat looping

        // Validasi Size
        if (file.size > props.maxSizeMb * 1024 * 1024) {
            alert(`File ${file.name} terlalu besar (Max ${props.maxSizeMb}MB)`)
            continue
        }
        newFiles.push(file)
    }

    // --- PERBAIKAN DI SINI ---
    // Kita cek dulu apakah ada file baru yang lolos validasi?
    if (newFiles.length > 0) {
        if (props.multiple) {
            model.value = [...model.value, ...newFiles]
        } else {
            // Ambil file pertama dengan aman
            const firstFile = newFiles[0]
            // Pastikan firstFile tidak undefined sebelum dimasukkan
            if (firstFile) {
                model.value = [firstFile]
            }
        }
    }
}

const removeFile = (idx: number) => {
    model.value.splice(idx, 1)
}
</script>

<template>
    <div class="flex flex-col gap-[6px]">
        <label v-if="label" class="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
            {{ label }}
        </label>

        <div @click="triggerSelect" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            class="border-2 border-dashed rounded-[8px] p-[15px] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 bg-gray-50 hover:bg-green-50"
            :class="[
                isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300',
                error ? 'border-red-500' : ''
            ]">
            <input ref="fileInput" type="file" class="hidden" :accept="accept" :multiple="multiple"
                @change="handleInput" />

            <CloudArrowUpIcon class="w-[24px] h-[24px] text-gray-400 mb-[5px]"
                :class="isDragging ? 'text-green-600' : ''" />

            <p class="text-[11px] text-gray-600 font-medium text-center">
                <span class="text-green-600 font-bold hover:underline">Klik upload</span> atau drag file kesini
            </p>
            <p class="text-[9px] text-gray-400 mt-[2px]">
                Max {{ maxSizeMb }}MB. {{ accept === '*/*' ? 'Semua file' : accept }}
            </p>
        </div>

        <div v-if="model.length > 0" class="flex flex-col gap-[4px] mt-[2px]">
            <div v-for="(file, idx) in model" :key="idx"
                class="flex items-center justify-between bg-white border border-gray-200 rounded-[6px] p-[6px] shadow-sm">
                <div class="flex items-center gap-[8px] overflow-hidden">
                    <div
                        class="w-[24px] h-[24px] bg-green-100 rounded flex items-center justify-center text-green-700 flex-shrink-0">
                        <DocumentIcon class="w-[14px] h-[14px]" />
                    </div>
                    <div class="flex flex-col min-w-0">
                        <span class="text-[11px] font-bold text-gray-700 truncate block">{{ file.name }}</span>
                        <span class="text-[9px] text-gray-400">{{ (file.size / 1024).toFixed(1) }} KB</span>
                    </div>
                </div>

                <button @click="removeFile(idx)" class="text-gray-400 hover:text-red-500 p-1">
                    <XMarkIcon class="w-[14px] h-[14px]" />
                </button>
            </div>
        </div>

        <span v-if="error" class="text-[9px] text-red-500 font-medium mt-[1px]">
            {{ error }}
        </span>
    </div>
</template>