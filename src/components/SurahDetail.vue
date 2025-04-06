<template>
  <div class="p-6 bg-gradient-to-br from-emerald-50 to-teal-100 min-h-screen">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
        <span class="ml-3 text-emerald-700 font-medium">Memuat ayat...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-triangle text-red-500"></i>
          </div>
          <div class="ml-3">
            <p class="text-red-700">{{ error }}</p>
            <button 
              @click="fetchSurahDetail" 
              class="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>

      <!-- Surah Content -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <button 
              @click="goBack" 
              class="mb-4 flex items-center text-emerald-600 hover:text-emerald-700 transition"
            >
              <i class="fas fa-arrow-left mr-1"></i>
              Kembali
            </button>
            
            <div class="flex space-x-2">
              <button 
                @click="toggleAudioPlayer" 
                class="flex items-center justify-center p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition"
              >
                <i class="fas fa-broadcast-tower"></i>
              </button>
              
              <button 
                @click="toggleBookmark" 
                class="flex items-center justify-center p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition"
              >
                <i class="fas fa-bookmark"></i>
              </button>
            </div>
          </div>

          <div class="text-center mb-6">
            <h1 class="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">{{ detail.nama_latin }}</h1>
            <h2 class="text-2xl md:text-3xl font-arab text-emerald-700 mb-2">{{ detail.nama }}</h2>
            <p class="text-emerald-600">{{ detail.arti }}</p>
            
            <div class="flex justify-center items-center space-x-4 mt-3 text-sm">
              <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                {{ detail.tempat_turun === 'mekah' ? 'Makkiyah' : 'Madaniyyah' }}
              </span>
              <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                {{ detail.jumlah_ayat }} Ayat
              </span>
            </div>
          </div>

          <!-- Basmalah -->
          <div v-if="detail.nomor !== 1 && detail.nomor !== 9" class="text-center my-8">
            <p class="text-3xl font-arab text-emerald-800">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
          
          <!-- Deskripsi -->
          <div class="bg-white p-4 rounded-lg shadow-md mb-8 border-l-4 border-emerald-500">
            <div class="text-gray-700 italic" v-html="detail.deskripsi"></div>
          </div>
        </div>

        <!-- Audio Player (kondisional) -->
        <div v-if="showAudioPlayer" class="bg-emerald-50 p-4 rounded-lg shadow mb-6">
          <div class="flex items-center">
            <button 
              @click="togglePlayPause" 
              class="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full mr-4"
            >
              <i v-if="isPlaying" class="fas fa-pause"></i>
              <i v-else class="fas fa-play"></i>
            </button>
            <div class="flex-1">
              <div class="text-sm text-emerald-700 font-medium mb-1">Murottal Surah {{ detail.nama_latin }}</div>
              <div class="flex items-center">
                <span class="text-xs text-emerald-600 mr-2">{{ formatTime(currentTime) }}</span>
                <div class="h-2 bg-emerald-200 rounded-full flex-1 relative">
                  <div 
                    class="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                    :style="{ width: `${(currentTime / audioDuration) * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs text-emerald-600 ml-2">{{ formatTime(audioDuration) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ayat List -->
        <div>
          <div 
            v-for="ayat in detail.ayat" 
            :key="ayat.nomor" 
            class="mb-6 bg-white shadow-md rounded-lg overflow-hidden"
          >
            <!-- Ayat Header -->
            <div class="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
              <div class="flex items-center">
                <div class="bg-emerald-500 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm mr-2">
                  {{ ayat.nomor }}
                </div>
                <audio :src="ayat.audio" ref="audioRefs"></audio>
                <button 
                  @click="playAyatAudio(ayat)"
                  class="text-emerald-600 hover:text-emerald-700"
                >
                  <i class="fas fa-play-circle h-5 w-5"></i>
                </button>
              </div>
              <div class="flex space-x-2">
                <button class="text-emerald-600 hover:text-emerald-700">
                  <i class="fas fa-download h-5 w-5"></i>
                </button>
                <button class="text-emerald-600 hover:text-emerald-700">
                  <i class="fas fa-sync-alt h-5 w-5"></i>
                </button>
              </div>
            </div>
            
            <!-- Ayat Content -->
            <div class="p-4">
              <div dir="rtl" class="text-right text-2xl md:text-3xl font-arab leading-loose mb-4 text-emerald-900">
                {{ ayat.ar }}
              </div>
              <div class="text-gray-600 text-sm mt-4 italic">
                {{ ayat.tr }}
              </div>
              <div class="mt-3 text-gray-700 border-t border-gray-100 pt-3">
                {{ ayat.idn }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 mb-12">
          <button 
            v-if="detail.surat_sebelumnya"
            @click="navigateToSurah(detail.surat_sebelumnya.id)" 
            class="flex items-center text-emerald-600 hover:text-emerald-700 transition"
          >
            <i class="fas fa-chevron-left mr-1"></i>
            {{ detail.surat_sebelumnya.nama_latin }}
          </button>
          <div></div>
          <button 
            v-if="detail.surat_selanjutnya"
            @click="navigateToSurah(detail.surat_selanjutnya.id)" 
            class="flex items-center text-emerald-600 hover:text-emerald-700 transition"
          >
            {{ detail.surat_selanjutnya.nama_latin }}
            <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// State untuk surah
const detail = ref({});
const loading = ref(true);
const error = ref(null);

// State untuk audio player
const showAudioPlayer = ref(false);
const isPlaying = ref(false);
const currentTime = ref(0);
const audioDuration = ref(0);
const audioElement = ref(null);
const audioInterval = ref(null);
const audioRefs = ref([]);

// Fetch data surah
const fetchSurahDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const surahId = route.params.id;
    const response = await fetch(`https://equran.id/api/surat/${surahId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    detail.value = data;
    console.log(detail)
    
    // Inisialisasi audio jika ada
    if (data.audio) {
      audioElement.value = new Audio(data.audio);
      audioElement.value.addEventListener('loadedmetadata', () => {
        audioDuration.value = audioElement.value.duration;
      });
      
      audioElement.value.addEventListener('timeupdate', () => {
        currentTime.value = audioElement.value.currentTime;
      });
      
      audioElement.value.addEventListener('ended', () => {
        isPlaying.value = false;
        currentTime.value = 0;
      });
    }
  } catch (err) {
    console.error('Gagal mengambil data surah:', err);
    error.value = 'Gagal memuat data surah. Silakan coba lagi.';
  } finally {
    loading.value = false;
  }
};

// Audio player functions
const toggleAudioPlayer = () => {
  showAudioPlayer.value = !showAudioPlayer.value;
};

const togglePlayPause = () => {
  if (!audioElement.value) return;
  
  if (isPlaying.value) {
    audioElement.value.pause();
  } else {
    audioElement.value.play();
  }
  
  isPlaying.value = !isPlaying.value;
};

const playAyatAudio = (ayat) => {
  // Implementasi logika untuk memutar audio per ayat
  console.log(`Memutar audio ayat ${ayat.nomor}`);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Navigation functions
const goBack = () => {
  router.back();
};

const navigateToSurah = (surahId) => {
  router.push(`/surah/${surahId}`);
};

const toggleBookmark = () => {
  // Implementasi fitur bookmark
  console.log('Toggle bookmark');
};

// Lifecycle hooks
onMounted(() => {
  fetchSurahDetail();
});

onUnmounted(() => {
  // Cleanup resources
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value.src = '';
  }
  
  if (audioInterval.value) {
    clearInterval(audioInterval.value);
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap');

.font-arab {
  font-family: 'Scheherazade New', serif;
}
</style>