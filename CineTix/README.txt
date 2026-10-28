CINETIX — WEB TICKETING BIOSKOP

ISI FOLDER
- index.html         Halaman web
- style.css          Tampilan web
- script.js          Data film, Bubble Sort, Linear Search, log, simulasi booking
- struktur_data.cpp  Program C++ untuk demonstrasi Array, Pointer, Struct, Sorting, Searching

CARA MENJALANKAN WEB
1. Ekstrak folder CineTix.
2. Buka folder tersebut di Visual Studio Code.
3. Buka index.html menggunakan browser (klik dua kali file), atau gunakan ekstensi Live Server.
4. Coba ketik judul pada kolom pencarian.
5. Pilih "Harga: termurah" atau "Harga: termahal".
6. Perhatikan panel Activity log di sebelah kanan.
7. Klik "Lihat jadwal" pada kartu film untuk mencoba pemesanan simulasi.

CARA MENJALANKAN PROGRAM C++
1. Buka struktur_data.cpp di Visual Studio Code.
2. Pastikan compiler C++ tersedia (misalnya g++).
3. Buka terminal di folder project.
4. Jalankan:
   g++ struktur_data.cpp -o struktur_data
5. Jalankan hasil kompilasi:
   Windows: .\struktur_data.exe
   Linux/macOS: ./struktur_data
6. Masukkan kata kunci film ketika diminta untuk melihat log Linear Search.

CATATAN TUGAS
- Array, Pointer, dan Struct dibuktikan di struktur_data.cpp menggunakan C++.
- Bubble Sort harga di web menghasilkan log perbandingan dan pertukaran.
- Linear Search judul film di web menghasilkan log pemeriksaan data.
- Pemesanan pada web masih simulasi, bukan transaksi atau tiket asli.
- Web dan program C++ merupakan dua bagian terpisah; C++ tidak menjadi backend web pada versi awal.
- Poster digambarkan menggunakan desain grafis CSS sehingga tidak memerlukan API atau gambar eksternal.

Poster film berupa ilustrasi SVG lokal di folder images, sehingga tidak memerlukan koneksi internet untuk menampilkannya.
