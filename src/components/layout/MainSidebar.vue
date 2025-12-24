<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import type { Component } from 'vue'

import {
    HomeIcon,
    PencilSquareIcon,
    HeartIcon,
    BeakerIcon,
    BanknotesIcon,
    PowerIcon
} from '@heroicons/vue/24/outline'

defineProps<{ isOpen: boolean }>()
const router = useRouter()
const route = useRoute()

type MenuItem =
    | { header: string; path?: never; icon?: never; title?: never; badge?: never }
    | { path: string; icon: Component; title: string; badge?: number; header?: never }

const menus: MenuItem[] = [
    { header: 'Menu Utama' },
    { path: '/admin/dashboard', icon: HomeIcon, title: 'Dashboard' },
    { path: '/pendaftaran', icon: PencilSquareIcon, title: 'Pendaftaran' },
    { path: '/poli/umum', icon: HeartIcon, title: 'Poliklinik', badge: 5 },
    { header: 'Layanan' },
    { path: '/farmasi', icon: BeakerIcon, title: 'Farmasi' },
    { path: '/kasir', icon: BanknotesIcon, title: 'Kasir' },
]

function navigate(path: string | undefined) {
    if (path) router.push(path);
}
</script>

<template>
    <aside
        class="bg-gradient-to-b from-[#14532d] to-[#064e3b] text-white h-screen flex flex-col transition-all duration-300 ease-in-out shadow-2xl z-40 border-r border-white/5"
        :class="isOpen ? 'w-[200px] py-[12px] px-[10px] opacity-100' : 'w-0 p-0 opacity-0 overflow-hidden'">
        <div class="mb-[12px] border-b border-white/10 pb-[12px] px-[5px] flex items-center gap-[10px]">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6vw8bWS5cJl1KEb3NSK1H74jOxve_rBSfpJZU2jpmKZ6SXEjIF0a5WvLy3ZolO-e3kVzK_9Pl9dCzRFka0pjiWz8WHfi9lMVddUc-m3QDxeNP7IDpXw2joyjt4XJMgyIdtYTwFHTpSfo8tie-MH3TA5HM1zHQthgiEc9VZ-lZQ5Q0b9RwLAR-VQ/s320/GKL27_logo-kota-tasikmalaya%20-%20Koleksilogo.com.png"
                alt="Logo Tasikmalaya" class="w-[32px] h-auto drop-shadow-md" />

            <div>
                <h1 class="font-bold text-[10px] leading-tight text-white tracking-wide">
                    UPTD PUSKESMAS URUG
                </h1>
                <div class="flex items-center gap-1 opacity-80">
                    <span class="text-[9px] font-medium uppercase tracking-[1px] text-green-50">
                        KOTA TASIKMALAYA
                    </span>
                </div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar pr-[2px]">
            <template v-for="(item, idx) in menus" :key="idx">

                <div v-if="item.header"
                    class="text-[9px] uppercase font-bold text-white/30 mt-[10px] mb-[4px] ml-[8px] tracking-[1px]">
                    {{ item.header }}
                </div>

                <div v-else @click="navigate(item.path)"
                    class="flex items-center px-[10px] py-[8px] mb-[4px] rounded-[8px] cursor-pointer transition-all duration-200 text-[12px] font-medium group relative overflow-hidden"
                    :class="route.path === item.path
                        ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-md font-semibold'
                        : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-[2px]'">
                    <component :is="item.icon" class="mr-[8px] w-[16px] h-[16px]" stroke-width="2" />

                    <span class="truncate">{{ item.title }}</span>

                    <span v-if="item.badge"
                        class="ml-auto bg-[#ef4444] text-white text-[9px] px-[5px] py-[1px] rounded-[6px] font-bold">
                        {{ item.badge }}
                    </span>
                </div>

            </template>
        </div>

        <div class="mt-auto pt-[10px] border-t border-white/10">
            <button
                class="w-full flex items-center gap-[8px] p-[8px] rounded-[8px] bg-black/20 hover:bg-red-600/80 cursor-pointer transition-all duration-200 group text-left">
                <div
                    class="w-[28px] h-[28px] rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:bg-white/20 group-hover:border-transparent transition">
                    <PowerIcon class="w-[14px] h-[14px]" />
                </div>

                <div class="overflow-hidden">
                    <div class="text-[11px] font-semibold leading-tight text-white group-hover:text-white">
                        Logout
                    </div>
                    <div class="text-[9px] opacity-60 leading-tight mt-[1px] text-white group-hover:opacity-90">
                        Keluar Sistem
                    </div>
                </div>
            </button>
        </div>
    </aside>
</template>