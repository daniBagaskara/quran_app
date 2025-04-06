<template>
  <div class="p-6 bg-gradient-to-br from-emerald-50 to-teal-100 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
          Al-Quran Digital
        </h1>
        <p class="text-emerald-600">Baca dan pelajari Al-Quran dengan mudah</p>
      </header>

      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative max-w-md mx-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari surah..."
            class="w-full px-4 py-3 rounded-full border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <span class="absolute right-3 top-3 text-emerald-500">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"
        ></div>
        <span class="ml-3 text-emerald-700 font-medium">Memuat surah...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-triangle text-red-500"></i>
          </div>
          <div class="ml-3">
            <p class="text-red-700">Gagal memuat data: {{ error }}</p>
            <button
              @click="fetchSurahs"
              class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>

      <!-- Surahs Grid -->
      <div v-else>
        <h2 class="text-2xl font-bold mb-4 text-emerald-800 flex items-center">
          <span class="mr-2">
            <i class="fas fa-quran text-xl mr-2"></i>
          </span>
          Daftar Surah
          <span class="ml-2 text-base font-normal text-emerald-600"
            >({{ filteredSurahs.length }} surah)</span
          >
        </h2>

        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="surah in filteredSurahs"
            :key="surah.nomor"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border-l-4 border-emerald-500"
          >
            <div
              class="bg-emerald-500 text-white p-3 flex justify-between items-center"
            >
              <div class="flex items-center">
                <div
                  class="bg-white text-emerald-600 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm"
                >
                  {{ surah.nomor }}
                </div>
                <div class="ml-2 font-medium">{{ surah.nama_latin }}</div>
              </div>
              <div class="text-xl font-arab">
                {{ surah.nama_arab || surah.asma }}
              </div>
              <span class="text-sm text-emerald-200">{{ surah.nama }}</span>
            </div>
            <div class="p-4">
              <p class="font-medium text-emerald-800">{{ surah.arti }}</p>
              <div
                class="flex justify-between items-center mt-2 text-sm text-emerald-600"
              >
                <span>{{
                  surah.tempat_turun === 'mekah' ? 'Makkiyah' : 'Madaniyyah'
                }}</span>
                <span>{{ surah.jumlah_ayat }} Ayat</span>
              </div>
              <div class="flex gap-2 mt-3">
                <button
                  @click="showDescription(surah)"
                  class="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium py-2 px-3 rounded-md transition duration-200 flex items-center justify-center cursor-pointer"
                >
                  <i class="fas fa-info-circle mr-1"></i>
                  Deskripsi
                </button>
                <button
                  @click="goToSurah(surah.nomor)"
                  class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-3 rounded-md transition duration-200 flex items-center justify-center cursor-pointer"
                >
                  <i class="fas fa-book-open mr-1"></i>
                  Baca Surah
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal for Surah Description -->
      <BaseModal v-model="showModal">
        <h2
          v-if="selectedSurah"
          class="text-xl font-bold text-emerald-700 mb-4"
        >
          {{ selectedSurah.nama_latin }}
        </h2>

        <div
          v-if="selectedSurah?.deskripsi"
          class="text-gray-700"
          v-html="selectedSurah.deskripsi"
        ></div>
        <div v-else class="text-gray-400 italic">Deskripsi tidak tersedia.</div>

        <button
          @click="showModal = false"
          class="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Tutup
        </button>
      </BaseModal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from './BaseModal.vue'

const surahs = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const router = useRouter()
const selectedSurah = ref(null)
const showModal = ref(false)

const filteredSurahs = computed(() => {
  if (!searchQuery.value) return surahs.value

  const query = searchQuery.value.toLowerCase()
  return surahs.value.filter(
    (surah) =>
      surah.nama.toLowerCase().includes(query) ||
      surah.arti.toLowerCase().includes(query) ||
      surah.nomor.toString().includes(query)
  )
})

const fetchSurahs = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await fetch('https://equran.id/api/surat')
    const data = await res.json()
    console.log(data)
    surahs.value = data
  } catch (err) {
    console.error('Gagal mengambil data:', err)
    error.value = err.message || 'Terjadi kesalahan saat mengambil data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSurahs()
})

const goToSurah = (id) => {
  router.push(`/surah/${id}`)
}

function showDescription(surah) {
  selectedSurah.value = surah
  showModal.value = true
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');

.font-arab {
  font-family: 'Scheherazade New', serif;
}
</style>
