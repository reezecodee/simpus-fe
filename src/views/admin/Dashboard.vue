<template>
    <div class="p-[15px] max-w-7xl mx-auto font-sans text-[#1f2937]">

        <h2 class="text-[18px] font-bold mb-[15px] tracking-tight text-[#111827]">Dashboard Overview</h2>

        <div class="page-content">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[15px] mb-[20px]">

                <div
                    class="bg-white p-[15px] rounded-[10px] border border-[#e5e7eb] shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all duration-200">
                    <div
                        class="w-[38px] h-[38px] rounded-[8px] bg-green-50 text-green-600 flex items-center justify-center text-[18px] mb-[10px]">
                        👥
                    </div>
                    <div class="text-[24px] font-bold text-[#111827] leading-tight">124</div>
                    <div class="text-[11px] font-medium text-[#6b7280]">Total Pasien Hari Ini</div>
                </div>

                <div
                    class="bg-white p-[15px] rounded-[10px] border border-[#e5e7eb] shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all duration-200">
                    <div
                        class="w-[38px] h-[38px] rounded-[8px] bg-orange-50 text-orange-600 flex items-center justify-center text-[18px] mb-[10px]">
                        ⚠️
                    </div>
                    <div class="text-[24px] font-bold text-[#111827] leading-tight">12</div>
                    <div class="text-[11px] font-medium text-[#6b7280]">Antrian Belum Dipanggil</div>
                </div>

                <div
                    class="bg-white p-[15px] rounded-[10px] border border-[#e5e7eb] shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all duration-200">
                    <div
                        class="w-[38px] h-[38px] rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center text-[18px] mb-[10px]">
                        💰
                    </div>
                    <div class="text-[24px] font-bold text-[#111827] leading-tight">Rp 4.5jt</div>
                    <div class="text-[11px] font-medium text-[#6b7280]">Estimasi Pendapatan</div>
                </div>

                <div
                    class="bg-white p-[15px] rounded-[10px] border border-[#e5e7eb] shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all duration-200">
                    <div
                        class="w-[38px] h-[38px] rounded-[8px] bg-pink-50 text-pink-600 flex items-center justify-center text-[18px] mb-[10px]">
                        🛏️
                    </div>
                    <div class="text-[24px] font-bold text-[#111827] leading-tight">85%</div>
                    <div class="text-[11px] font-medium text-[#6b7280]">Okupansi Rawat Inap</div>
                </div>
            </div>

            <div class="bg-white border border-[#e5e7eb] rounded-[10px] shadow-sm overflow-hidden">
                <div class="px-[15px] py-[12px] border-b border-gray-100 bg-[#f9fafb]">
                    <h3 class="font-bold text-[#374151] text-[14px]">Jadwal Dokter Praktek Saat Ini</h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-[#f9fafb] text-[#6b7280] font-semibold uppercase text-[10px]">
                            <tr>
                                <th class="px-[15px] py-[8px]">Nama Dokter</th>
                                <th class="px-[15px] py-[8px]">Poliklinik</th>
                                <th class="px-[15px] py-[8px]">Jam</th>
                                <th class="px-[15px] py-[8px]">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 text-[11px]">
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-[15px] py-[8px] font-medium text-gray-900">dr. Budi Santoso</td>
                                <td class="px-[15px] py-[8px]">Penyakit Dalam</td>
                                <td class="px-[15px] py-[8px]">08:00 - 14:00</td>
                                <td class="px-[15px] py-[8px]">
                                    <span
                                        class="bg-[#dcfce7] text-[#166534] px-[8px] py-[2px] rounded-[8px] text-[10px] font-bold">Praktek</span>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-[15px] py-[8px] font-medium text-gray-900">drg. Siti Aminah</td>
                                <td class="px-[15px] py-[8px]">Gigi</td>
                                <td class="px-[15px] py-[8px]">09:00 - 15:00</td>
                                <td class="px-[15px] py-[8px]">
                                    <span
                                        class="bg-[#dcfce7] text-[#166534] px-[8px] py-[2px] rounded-[8px] text-[10px] font-bold">Praktek</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>