# Quran Digital App

Aplikasi Al-Quran digital berbasis web yang dibangun menggunakan Vue.js, Tailwind CSS, dan API equran.id v2. Aplikasi ini menyediakan pengalaman membaca Al-Quran yang responsif dan mudah digunakan.

![Banner Quran Digital App](public/images/screenshot.png)

## Fitur

- ✨ Tampilan daftar semua surah Al-Quran
- 📖 Tampilan detail surah dengan ayat-ayat lengkap
- 🔍 Pencarian surah berdasarkan nama
- 🌙 Tampilan teks Arab dan terjemahan
- 📱 Desain responsif untuk semua ukuran perangkat
- 🔄 Terkoneksi dengan API equran.id v2

## Tech Stack

- **Frontend**: Vue.js 3 dengan Composition API
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **API**: equran.id v2

## Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:

- Node.js (versi 14.0.0 atau lebih tinggi)
- NPM atau Yarn

## Instalasi

1. Clone repository ini
   ```bash
   git clone https://github.com/daniBagaskara/quran_app.git
   cd quran_app
   ```

2. Instal dependencies
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Jalankan aplikasi dalam mode development
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. Buka `http://localhost:5173` pada browser Anda

## Struktur Proyek

```
quran-digital-app/
│
├── public/              # Aset statis
├── src/
│   ├── assets/          # Aset aplikasi (gambar, font, dll)
│   ├── components/      # Komponen Vue yang dapat digunakan kembali
│   ├── router/          # Konfigurasi Vue Router
│   ├── App.vue          # Komponen root
│   ├── main.js          # Entry point aplikasi
│   └── style.css        # Stylesheet global
│
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tailwind.config.js   # Konfigurasi Tailwind CSS
└── vite.config.js       # Konfigurasi Vite
```

## Penggunaan API

Aplikasi ini menggunakan API equran.id v2 untuk mendapatkan data Al-Quran. Berikut adalah endpoint yang digunakan:

- Daftar Surah: `https://equran.id/api/v2/surat`
- Detail Surah: `https://equran.id/api/v2/surat/{nomor}`

## Kontribusi

Kontribusi selalu diterima dengan senang hati. Untuk berkontribusi:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buka Pull Request

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak

Jika Anda memiliki pertanyaan atau masukan, silakan hubungi:
- Email: bagaskaradani724@gmail.com
- GitHub: [daniBagaskara](https://github.com/daniBagaskara)

## Credit

- Data Al-Quran disediakan oleh [equran.id](https://equran.id/)
- Font Arab dari [Google Fonts](https://fonts.google.com/)
