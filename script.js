// Fungsi untuk hitung jarak typo
function levenshtein(a, b) {
  let m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
    }
  }
  return m[b.length][a.length];
}

function cari() {
  let q = document.getElementById('input').value.toLowerCase().trim();
  let hasilDiv = document.getElementById('hasil');
  let saranDiv = document.getElementById('saran');
  
  if (q === "") {
    hasilDiv.innerHTML = "";
    saranDiv.innerHTML = "";
    return;
  }

  // Cari yang cocok
  let hasil = database.filter(d => d.keyword.includes(q) || d.judul.toLowerCase().includes(q));

  // Jika tidak ada hasil, cari yang typo mirip
  if (hasil.length === 0) {
    let best = null;
    let minJarak = 5; // toleransi typo 5 huruf
    database.forEach(d => {
      let jarak = levenshtein(q, d.keyword);
      if (jarak < minJarak) {
        minJarak = jarak;
        best = d;
      }
    });
    if (best) {
      saranDiv.innerHTML = `Tidak ada hasil untuk "<b>${q}</b>". Mungkin yang anda maksud <span onclick="pilihSaran('${best.keyword}')">${best.keyword}</span> ?`;
      hasilDiv.innerHTML = `<div class='no-result'>Coba klik saran di atas</div>`;
    } else {
      saranDiv.innerHTML = "";
      hasilDiv.innerHTML = `<div class='no-result'>Tidak ada hasil untuk "${q}". Periksa lagi tulisan anda.</div>`;
    }
    return;
  }

  saranDiv.innerHTML = "";
  let html = "";
  hasil.forEach(d => {
    html += `<div class="card">${d.foto ? `<img src="${d.foto}" alt="${d.judul}" class="foto-hasil">` : ""}<span class="kategori">${d.kategori}</span><h3>${d.judul}</h3><p>${d.isi}</p></div>`;
    });
  hasilDiv.innerHTML = html;
}

function pilihSaran(keyword) {
  document.getElementById('input').value = keyword;
  cari();
}

/*Menampilkan foto*/
function tampilkanfoto(informatika){
  const hasil=
  document.getElementById("hasil");

    hasil.innerHTML = `<div class="card"><h3>${informatika.judul}</h3><p>${informatika.isi}</p>
    <img src="${informatika.foto}" alt="${informatika.judul}" class="foto-hasil"></div>`;
}
/* Mengganti tema AeroSearch */
function toggleTema() {
  const aktif = document.body.classList.toggle("dark-mode");

// Simpan pilihan tema di browser
localStorage.setItem("temaAeroSearch",aktif ? "gelap" : "terang");

perbaruiTombolTema();
}

/* Mengubah tulisan tombol tema */
function perbaruiTombolTema() {
  const tombol = document.getElementById("tombolTema");

  if (!tombol) return;
    const modeGelap = document.body.classList.contains("dark-mode");

    tombol.textContent = modeGelap
    ? "☀️ Mode Terang"
    : "🌙 Mode Gelap";}

/* Memulihkan tema saat aplikasi dibuka */
function muatTema() {
  const tema = localStorage.getItem("temaAeroSearch");

    document.body.classList.toggle("dark-mode",tema === "gelap");
    perbaruiTombolTema();}
muatTema();