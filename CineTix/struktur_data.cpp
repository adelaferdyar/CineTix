#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

// STRUCT: menggabungkan beberapa atribut menjadi satu tipe data Film.
struct Film {
    string id;
    string judul;
    int harga;
    double rating;
};

void tampilkanFilm(Film daftarFilm[], int jumlah) {
    cout << "\nDAFTAR FILM\n";
    cout << left << setw(6) << "ID" << setw(27) << "Judul"
         << setw(13) << "Harga" << "Rating\n";
    cout << string(58, '-') << "\n";
    for (int i = 0; i < jumlah; i++) {
        cout << left << setw(6) << daftarFilm[i].id
             << setw(27) << daftarFilm[i].judul
             << "Rp" << setw(11) << daftarFilm[i].harga
             << daftarFilm[i].rating << "\n";
    }
}

// BUBBLE SORT: mengurutkan harga termurah ke termahal dan mencatat log.
void bubbleSort(Film daftarFilm[], int jumlah) {
    int perbandingan = 0;
    int pertukaran = 0;

    cout << "\n=== LOG SORTING: BUBBLE SORT ===\n";
    for (int i = 0; i < jumlah - 1; i++) {
        bool adaPertukaran = false;
        for (int j = 0; j < jumlah - 1 - i; j++) {
            perbandingan++;
            cout << "Bandingkan " << daftarFilm[j].judul << " (Rp"
                 << daftarFilm[j].harga << ") dengan "
                 << daftarFilm[j + 1].judul << " (Rp"
                 << daftarFilm[j + 1].harga << "). ";

            if (daftarFilm[j].harga > daftarFilm[j + 1].harga) {
                // POINTER: pointer menunjuk elemen yang sedang ditukar.
                Film* kiri = &daftarFilm[j];
                Film* kanan = &daftarFilm[j + 1];

                Film sementara = *kiri;
                *kiri = *kanan;
                *kanan = sementara;

                pertukaran++;
                adaPertukaran = true;
                cout << "Ditukar.\n";
            } else {
                cout << "Tidak ditukar.\n";
            }
        }
        if (!adaPertukaran) {
            cout << "Putaran " << i + 1
                 << ": tidak ada pertukaran, proses dihentikan lebih awal.\n";
            break;
        }
    }
    cout << "Sorting selesai. Total perbandingan: " << perbandingan
         << ", total pertukaran: " << pertukaran << ".\n";
}

// LINEAR SEARCH: memeriksa judul satu per satu dan mencatat log.
void linearSearch(Film daftarFilm[], int jumlah, const string& kataKunci) {
    cout << "\n=== LOG SEARCHING: LINEAR SEARCH ===\n";
    bool ditemukan = false;
    int diperiksa = 0;

    for (int i = 0; i < jumlah; i++) {
        diperiksa++;

        // POINTER: menunjuk film yang sedang diperiksa.
        Film* filmSaatIni = &daftarFilm[i];

        cout << "Langkah " << diperiksa << ": memeriksa \""
             << filmSaatIni->judul << "\" -> ";

        if (filmSaatIni->judul.find(kataKunci) != string::npos) {
            cout << "DITEMUKAN pada posisi " << i + 1 << ".\n";
            cout << "ID: " << filmSaatIni->id << ", harga: Rp"
                 << filmSaatIni->harga << ", rating: "
                 << filmSaatIni->rating << "\n";
            ditemukan = true;
            break;
        } else {
            cout << "tidak cocok.\n";
        }
    }

    if (!ditemukan) {
        cout << "Film dengan kata kunci \"" << kataKunci
             << "\" tidak ditemukan.\n";
    }
    cout << "Jumlah data yang diperiksa: " << diperiksa << ".\n";
}

int main() {
    // ARRAY: lima elemen Film disimpan dalam satu kumpulan data.
    Film daftarFilm[5] = {
        {"F01", "Petualangan Senja", 35000, 8.2},
        {"F02", "Langit Terakhir", 40000, 8.7},
        {"F03", "Misi Tengah Malam", 30000, 7.9},
        {"F04", "Rumah di Ujung Jalan", 45000, 8.5},
        {"F05", "Galaksi Baru", 35000, 8.9}
    };
    const int jumlahFilm = 5;

    cout << "====================================\n";
    cout << "       CINETIX - DEMO STRUKTUR DATA\n";
    cout << "====================================\n";

    // Contoh penggunaan pointer untuk mengakses elemen array pertama.
    Film* pointerFilm = &daftarFilm[0];
    cout << "\n=== DEMO ARRAY, STRUCT, DAN POINTER ===\n";
    cout << "Array berisi " << jumlahFilm << " data film.\n";
    cout << "Pointer menunjuk film pertama: " << pointerFilm->judul
         << " (Rp" << pointerFilm->harga << ").\n";

    tampilkanFilm(daftarFilm, jumlahFilm);
    bubbleSort(daftarFilm, jumlahFilm);
    cout << "\nDAFTAR SETELAH SORTING HARGA:\n";
    tampilkanFilm(daftarFilm, jumlahFilm);

    string kataKunci;
    cout << "\nMasukkan judul atau potongan judul yang ingin dicari: ";
    getline(cin, kataKunci);
    if (kataKunci.empty()) {
        kataKunci = "Misi";
        cout << "Input kosong; contoh kata kunci digunakan: Misi\n";
    }

    linearSearch(daftarFilm, jumlahFilm, kataKunci);

    cout << "\nProgram selesai.\n";
    return 0;
}
