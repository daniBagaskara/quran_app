<script setup>
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const detail = ref({})
const loading = ref(false)
const error = ref(null)
const showArabic = ref(true)
const showTranslation = ref(true)

const fetchData = async () => {
    loading.value = true
    error.value = null
    const nomor = route.params.id
    try {
        const response = await axios.get('https://equran.id/api/v2/surat/' + nomor)
        detail.value = response.data
        console.log(detail.value)
    } catch (err) {
        console.error('Error fetching data:', err)
        error.value = 'Failed to fetch data'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>

<template>
    <div class="p-6 bg-gradient-to-br from-emerald-100 to-teal-300 min-h-screen">
        <div class="max-w-3xl mx-auto">
            <div v-if="loading" class="flex items-center justify-center h-screen">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
                <span class="ml-3 text-emerald-700 font-medium">Memuat ayat...</span>
            </div>
            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow"> 
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-red-700">{{ error }}</p>
                        <button @click="fetchData"
                            class="mt-2 text-sm font-medium text-red-600 hover:text-red-500">
                            Coba lagi
                        </button>
                    </div>
                </div>
            </div>
            <div v-else-if="detail.data">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex items-center justify-between">
                        <button @click="router.back()"
                            class="mb-4 flex items-center text-emerald-600 hover:text-emerald-700 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                            </svg>
                            Kembali
                        </button>
                    </div>
                    
                    <!-- Surah Info Card -->
                    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <div>
                                <h1 class="text-2xl font-bold text-emerald-800">
                                    {{ detail.data.namaLatin }} ({{ detail.data.nama }})
                                </h1>
                                <p class="text-gray-600">{{ detail.data.arti }}</p>
                            </div>
                            <div class="text-right">
                                <span class="bg-emerald-100 text-emerald-800 text-sm font-medium mr-2 px-3 py-1 rounded">
                                    {{ detail.data.tempatTurun }}
                                </span>
                                <span class="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded">
                                    {{ detail.data.jumlahAyat }} Ayat
                                </span>
                            </div>
                        </div>
                        
                        <div v-if="detail.data.nomor !== 1 && detail.data.nomor !== 9"
                            class="border-t border-gray-200 pt-4">
                            <div class="text-center">
                                <h2 class="text-xl font-semibold mb-3 text-emerald-700">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
                                <p class="text-gray-600 italic">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Options -->
                    <div class="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
                        <div class="flex space-x-4">
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="showArabic" class="form-checkbox h-5 w-5 text-emerald-600">
                                <span class="ml-2 text-gray-700">Teks Arab</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="showTranslation" class="form-checkbox h-5 w-5 text-emerald-600">
                                <span class="ml-2 text-gray-700">Terjemahan</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Ayat List -->
                    <div class="space-y-6">
                        <div v-for="ayat in detail.data.ayat" :key="ayat.nomorAyat" 
                            class="bg-white rounded-lg shadow p-6 transition duration-300 hover:shadow-lg">
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex items-center justify-center bg-emerald-100 rounded-full w-10 h-10 text-emerald-800 font-bold">
                                    {{ ayat.nomorAyat }}
                                </div>
                                <button class="text-gray-400 hover:text-emerald-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div v-if="showArabic" class="mb-4 text-right">
                                <p class="text-2xl leading-loose font-arabic" style="font-family: 'Traditional Arabic', serif;">
                                    {{ ayat.teksArab }}
                                </p>
                            </div>
                            
                            <div v-if="showTranslation" class="text-gray-700">
                                <p>{{ ayat.teksIndonesia }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex items-center justify-center h-screen">
                <div class="text-center p-8 bg-white rounded-lg shadow">
                    <p class="text-gray-700">Data surah tidak ditemukan</p>
                    <button @click="router.push('/')" 
                        class="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition">
                        Kembali ke Daftar Surah
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>