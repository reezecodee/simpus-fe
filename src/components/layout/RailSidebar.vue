<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

type AdminMenuItem = 
  | { divider: true; path?: never; icon?: never; title?: never }
  | { path: string; icon: string; title: string; divider?: never }

const adminItems: AdminMenuItem[] = [
    { path: '/admin/master', icon: '🗂️', title: 'Master' },
    { path: '/admin/users', icon: '👥', title: 'Users' },
    { path: '/admin/role', icon: '🛡️', title: 'Roles' },
    { divider: true },
    { path: '/admin/config', icon: '⚙️', title: 'Config' },
    { path: '/admin/logs', icon: '📜', title: 'Logs' },
]
</script>

<template>
    <aside class="w-[55px] bg-[#0f172a] flex flex-col items-center py-[12px] z-50 shadow-xl h-screen flex-shrink-0">

        <template v-for="(item, index) in adminItems" :key="index">
            <div v-if="item.divider" class="w-[20px] h-[1px] bg-white/10 my-[6px]"></div>

            <div v-else @click="router.push(item.path!)"
                class="w-[35px] h-[35px] mb-[8px] rounded-[8px] flex items-center justify-center text-[16px] cursor-pointer transition-all duration-200 relative group"
                :class="route.path === item.path
                    ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                    : 'text-white/40 hover:bg-white/10 hover:text-white hover:scale-110'">
                
                {{ item.icon }}

                <div class="absolute left-[45px] bg-[#1e293b] text-white text-[10px] font-semibold px-[8px] py-[4px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg group-hover:left-[42px] duration-200 border border-white/10">
                    {{ item.title }}
                </div>
            </div>
        </template>
    </aside>
</template>