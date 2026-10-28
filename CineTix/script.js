const movies = [
  { id: "F01", title: "Petualangan Senja", genre: "Petualangan · Drama", rating: 8.2, price: 35000, poster: "images/petualangan-senja.svg", symbol: "☼", kicker: "A JOURNEY BEGINS", colors: "linear-gradient(145deg,#e79b68,#7e4c74 55%,#202b51)", schedules: ["13:15", "16:20", "19:30"] },
  { id: "F02", title: "Langit Terakhir", genre: "Drama · Fiksi Ilmiah", rating: 8.7, price: 40000, poster: "images/langit-terakhir.svg", symbol: "☾", kicker: "BEYOND THE SKY", colors: "linear-gradient(145deg,#5f98bd,#394579 55%,#1c183d)", schedules: ["12:45", "15:50", "20:00"] },
  { id: "F03", title: "Misi Tengah Malam", genre: "Aksi · Thriller", rating: 7.9, price: 30000, poster: "images/misi-tengah-malam.svg", symbol: "✦", kicker: "ONE NIGHT. ONE MISSION.", colors: "linear-gradient(145deg,#e0a14f,#a94b39 50%,#291d3e)", schedules: ["11:30", "14:40", "18:45"] },
  { id: "F04", title: "Rumah di Ujung Jalan", genre: "Horor · Misteri", rating: 8.5, price: 45000, poster: "images/rumah-ujung-jalan.svg", symbol: "⌂", kicker: "DON'T LOOK BACK", colors: "linear-gradient(145deg,#738b76,#354d51 50%,#191e31)", schedules: ["13:00", "17:15", "21:10"] },
  { id: "F05", title: "Galaksi Baru", genre: "Fiksi Ilmiah · Aksi", rating: 8.9, price: 35000, poster: "images/galaksi-baru.svg", symbol: "✧", kicker: "A NEW UNIVERSE", colors: "linear-gradient(145deg,#ba83d5,#6159a9 50%,#1b2452)", schedules: ["12:00", "15:25", "19:00"] },
  { id: "F06", title: "Surat untuk Esok", genre: "Romansa · Drama", rating: 8.1, price: 30000, poster: "images/surat-untuk-esok.svg", symbol: "♡", kicker: "SOME WORDS STAY", colors: "linear-gradient(145deg,#e5a6b6,#a95d8a 50%,#42335d)", schedules: ["10:50", "14:00", "18:20"] }
];

const movieGrid = document.querySelector("#movieGrid");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const logList = document.querySelector("#logList");
const filmCount = document.querySelector("#filmCount");
const emptyState = document.querySelector("#emptyState");
const bookingDialog = document.querySelector("#bookingDialog");
const bookingContent = document.querySelector("#bookingContent");

let visibleLogs = [];
let activeLogFilter = "all";
let currentMovies = [...movies];
let latestSearchTerm = "";

const rupiah = amount => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(amount);

function addLog(type, message) {
  const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  visibleLogs.unshift({ type, message, time });
  renderLogs();
}

function renderLogs() {
  const filtered = activeLogFilter === "all"
    ? visibleLogs
    : visibleLogs.filter(log => log.type === activeLogFilter);
  logList.innerHTML = "";

  if (filtered.length === 0) {
    logList.innerHTML = '<div class="log-entry">Belum ada log untuk kategori ini. Coba lakukan pencarian atau pengurutan film.</div>';
    return;
  }

  filtered.slice(0, 50).forEach(log => {
    const entry = document.createElement("div");
    entry.className = "log-entry";
    const typeLabel = log.type === "search" ? "SEARCH" : log.type === "sort" ? "SORT" : "INFO";
    entry.innerHTML = `<span class="log-type ${log.type}">${typeLabel}</span>${escapeHtml(log.message)}<span class="log-time">${log.time}</span>`;
    logList.appendChild(entry);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function renderMovies(list) {
  movieGrid.innerHTML = "";
  filmCount.textContent = list.length;
  emptyState.classList.toggle("hidden", list.length !== 0);

  list.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie-card";
    card.innerHTML = `
      <div class="poster">
        <img src="${movie.poster}" alt="Poster ilustrasi ${escapeHtml(movie.title)}" loading="lazy">
        <span class="rating"><span>★</span> ${movie.rating.toFixed(1)}</span>
      </div>
      <div class="movie-info">
        <p class="genre">${escapeHtml(movie.genre)}</p>
        <div class="movie-bottom">
          <div><div class="price-label">TIKET MULAI</div><div class="price">${rupiah(movie.price)}</div></div>
          <button class="book-btn" data-book="${movie.id}">Lihat jadwal ↗</button>
        </div>
      </div>`;
    movieGrid.appendChild(card);
  });
}

function applySearch() {
  const term = searchInput.value.trim().toLocaleLowerCase("id-ID");
  latestSearchTerm = term;
  const results = [];
  let checked = 0;

  // Linear Search: memeriksa judul satu per satu dari daftar film.
  movies.forEach(movie => {
    checked++;
    const matched = movie.title.toLocaleLowerCase("id-ID").includes(term);
    if (!term || matched) results.push(movie);
    if (term) {
      addLog("search", `Langkah ${checked}: "${movie.title}" → ${matched ? "cocok" : "tidak cocok"}.`);
    }
  });

  if (term) {
    addLog("search", results.length
      ? `Pencarian "${searchInput.value.trim()}" selesai: ${results.length} film cocok dari ${checked} data yang diperiksa.`
      : `Pencarian "${searchInput.value.trim()}" selesai: tidak ada film yang cocok (${checked} data diperiksa).`);
  } else {
    addLog("info", `Daftar film ditampilkan kembali (${movies.length} film).`);
  }

  currentMovies = results;
  applySort(false);
}

function bubbleSortByPrice(list, direction) {
  const sorted = [...list];
  let comparisons = 0;
  let swaps = 0;
  const ascending = direction === "price-asc";
  addLog("sort", `Bubble Sort dimulai: ${sorted.length} film, urutan ${ascending ? "harga termurah ke termahal" : "harga termahal ke termurah"}.`);

  for (let i = 0; i < sorted.length - 1; i++) {
    let swappedThisPass = false;
    for (let j = 0; j < sorted.length - 1 - i; j++) {
      comparisons++;
      const shouldSwap = ascending
        ? sorted[j].price > sorted[j + 1].price
        : sorted[j].price < sorted[j + 1].price;
      addLog("sort", `Bandingkan ${sorted[j].title} (${rupiah(sorted[j].price)}) dengan ${sorted[j + 1].title} (${rupiah(sorted[j + 1].price)}).`);
      if (shouldSwap) {
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
        swaps++;
        swappedThisPass = true;
        addLog("sort", `Tukar posisi: ${sorted[j].title} ↔ ${sorted[j + 1].title}.`);
      }
    }
    if (!swappedThisPass) {
      addLog("sort", `Putaran ${i + 1}: tidak ada pertukaran; daftar sudah terurut.`);
      break;
    }
  }
  addLog("sort", `Bubble Sort selesai. Perbandingan: ${comparisons}; pertukaran: ${swaps}.`);
  return sorted;
}

function applySort(logAction = true) {
  const method = sortSelect.value;
  let result = [...currentMovies];

  if (method === "price-asc" || method === "price-desc") {
    result = bubbleSortByPrice(result, method);
  } else if (method === "rating-desc") {
    result.sort((a, b) => b.rating - a.rating);
    if (logAction) addLog("sort", "Daftar diurutkan berdasarkan rating tertinggi ke terendah.");
  } else if (method === "title-asc") {
    result.sort((a, b) => a.title.localeCompare(b.title, "id"));
    if (logAction) addLog("sort", "Daftar diurutkan berdasarkan judul A–Z.");
  } else if (logAction) {
    addLog("info", "Urutan pilihan CineTix diterapkan.");
  }

  renderMovies(result);
}

function openBooking(movieId) {
  const movie = movies.find(item => item.id === movieId);
  if (!movie) return;
  bookingContent.innerHTML = `
    <p class="eyebrow">PESAN TIKET</p>
    <h2 class="booking-title">${escapeHtml(movie.title)}</h2>
    <p class="booking-sub">${escapeHtml(movie.genre)} · ★ ${movie.rating.toFixed(1)}<br>Harga tiket ${rupiah(movie.price)} per orang.</p>
    <form id="bookingForm" class="booking-form">
      <label for="cinema">Pilih bioskop</label>
      <select id="cinema" required><option value="CineTix Central">CineTix Central</option><option value="CineTix Galaxy">CineTix Galaxy</option><option value="CineTix Town">CineTix Town</option></select>
      <label>Jam tayang</label>
      <div class="schedule-options">${movie.schedules.map((time, index) => `<label class="schedule-chip"><input type="radio" name="schedule" value="${time}" ${index === 0 ? "checked" : ""}><span>${time}</span></label>`).join("")}</div>
      <label for="ticketQty">Jumlah tiket</label>
      <select id="ticketQty"><option value="1">1 tiket</option><option value="2">2 tiket</option><option value="3">3 tiket</option><option value="4">4 tiket</option><option value="5">5 tiket</option></select>
      <div class="booking-summary"><span>Total simulasi</span><strong id="bookingTotal">${rupiah(movie.price)}</strong></div>
      <button class="confirm-btn" type="submit">Buat pesanan simulasi</button>
    </form>
    <div id="bookingResult"></div>`;

  const qty = document.querySelector("#ticketQty");
  const total = document.querySelector("#bookingTotal");
  qty.addEventListener("change", () => total.textContent = rupiah(movie.price * Number(qty.value)));
  document.querySelector("#bookingForm").addEventListener("submit", event => {
    event.preventDefault();
    const count = Number(qty.value);
    const cinema = document.querySelector("#cinema").value;
    const schedule = document.querySelector('input[name="schedule"]:checked').value;
    document.querySelector("#bookingResult").innerHTML = `<div class="booking-result"><h3>✓ Pesanan simulasi berhasil dibuat</h3><p>Film: ${escapeHtml(movie.title)}<br>Bioskop: ${escapeHtml(cinema)}<br>Jadwal: ${escapeHtml(schedule)} WIB<br>Jumlah: ${count} tiket<br>Total: <strong>${rupiah(movie.price * count)}</strong><br><small>Ini bukan tiket asli dan tidak ada pembayaran yang dilakukan.</small></p></div>`;
    addLog("info", `Pesanan simulasi: ${movie.title}, ${count} tiket, total ${rupiah(movie.price * count)}.`);
  });
  bookingDialog.showModal();
}

searchInput.addEventListener("input", () => {
  // Hindari menumpuk log terlalu banyak saat kolom kosong.
  if (searchInput.value.trim()) applySearch();
  else {
    currentMovies = [...movies];
    addLog("info", "Kolom pencarian dikosongkan; semua film ditampilkan.");
    applySort(false);
  }
});
sortSelect.addEventListener("change", () => applySort(true));
document.querySelector("#clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  currentMovies = [...movies];
  addLog("info", "Pencarian dihapus.");
  applySort(false);
});
document.querySelector("#clearLogs").addEventListener("click", () => {
  visibleLogs = [];
  renderLogs();
});
document.querySelectorAll(".log-tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".log-tab").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    activeLogFilter = button.dataset.log;
    renderLogs();
  });
});
movieGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-book]");
  if (button) openBooking(button.dataset.book);
});

renderMovies(movies);
addLog("info", "CineTix siap. Data film simulasi berhasil dimuat.");
addLog("info", "Searching menggunakan Linear Search; sorting harga menggunakan Bubble Sort.");
