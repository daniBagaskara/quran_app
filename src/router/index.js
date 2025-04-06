import { createRouter, createWebHistory } from 'vue-router'
import ListSurah from '../components/ListSurah.vue'
// import SurahDetail from '../components/SurahDetail.vue'
import NewSurahDetail from '../components/NewSurahDetail.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: ListSurah
    },
    {
        path: '/surah/:id',
        name: 'SurahDetail',
        component: NewSurahDetail,
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
