<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

interface Step {
    title: string
    subtitle?: string
}

interface Props {
    steps: Step[]
    currentStep: number // Index mulai dari 0
}

defineProps<Props>()
</script>

<template>
    <div class="w-full">
        <div class="flex items-center justify-between relative">
            <div class="absolute left-0 top-[12px] w-full h-[2px] bg-gray-200 -z-0"></div>

            <div v-for="(step, idx) in steps" :key="idx"
                class="relative z-10 flex flex-col items-center group cursor-default">
                <div class="w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300"
                    :class="[
                        idx < currentStep
                            ? 'bg-green-600 border-green-600 text-white' // Selesai
                            : idx === currentStep
                                ? 'bg-white border-green-600 text-green-600 shadow-md ring-2 ring-green-100' // Sedang Aktif
                                : 'bg-white border-gray-300 text-gray-400' // Belum
                    ]">
                    <CheckIcon v-if="idx < currentStep" class="w-[14px] h-[14px] stroke-[3]" />
                    <span v-else>{{ idx + 1 }}</span>
                </div>

                <div class="mt-[6px] text-center">
                    <p class="text-[10px] font-bold uppercase tracking-wide transition-colors"
                        :class="idx <= currentStep ? 'text-gray-800' : 'text-gray-400'">
                        {{ step.title }}
                    </p>
                    <p v-if="step.subtitle" class="text-[9px] text-gray-400 hidden sm:block">
                        {{ step.subtitle }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>