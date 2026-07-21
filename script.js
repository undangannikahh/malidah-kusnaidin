document.addEventListener('DOMContentLoaded', () => {
    // 1. Eksekusi Efek Bunga Jatuh
    createPetals();

    // 2. Get Guest Name from URL (?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    if (guestName) {
        const formattedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
        document.getElementById('guest-name').innerText = formattedName;
    }

    // 3. Scroll Animation Observer (Animasi jalan TIAP scroll)
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Baris ini yang bikin animasi ke-reset pas lu scroll ke atas
                entry.target.classList.remove('visible'); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up').forEach(el => observer.observe(el));

    // 4. Countdown Timer
    const countdownDate = new Date("Nov 25, 2026 08:00:00").getTime();
    
    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days < 10 ? '0'+days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? '0'+hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? '0'+minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? '0'+seconds : seconds;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "<p class='gold-text'>Acara Sedang Berlangsung</p>";
        }
    }, 1000);

    // 5. Fitur Swipe / Drag to scroll untuk Galeri Foto Horizontal
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (galleryScroll) {
        let isDown = false;
        let startX;
        let scrollLeft;

        galleryScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            galleryScroll.style.cursor = 'grabbing';
            startX = e.pageX - galleryScroll.offsetLeft;
            scrollLeft = galleryScroll.scrollLeft;
        });
        galleryScroll.addEventListener('mouseleave', () => {
            isDown = false;
            galleryScroll.style.cursor = 'grab';
        });
        galleryScroll.addEventListener('mouseup', () => {
            isDown = false;
            galleryScroll.style.cursor = 'grab';
        });
        galleryScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // cegah blok teks terpilih pas lagi nge-drag
            const x = e.pageX - galleryScroll.offsetLeft;
            const walk = (x - startX) * 2; // kecepatan scroll
            galleryScroll.scrollLeft = scrollLeft - walk;
        });
    }
});

// --- FUNGSI EFEK JATUH KELOPAK BUNGA EKSKLUSIF ---
function createPetals() {
    const container = document.getElementById('particles-container');
    if (!container) return; 
    
    const petalCount = 20; 

    for (let i = 0; i < petalCount; i++) {
        let petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Random posisi dan durasi biar jatuhnya natural
        let startLeft = Math.random() * 100; // 0vw - 100vw
        let duration = Math.random() * 8 + 8; // 8s - 16s
        let delay = Math.random() * 10; 
        
        // Ukuran kecil biar elegan (kayak bunga asli)
        let size = Math.random() * 8 + 10; // 10px - 18px
        
        petal.style.left = startLeft + 'vw';
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = delay + 's';
        
        container.appendChild(petal);
    }
}

// --- FUNGSI OPEN INVITATION & MUSIC ---
let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicCtrl = document.getElementById('music-control');

function openInvitation() {
    document.getElementById('cover').style.transform = 'translateY(-100vh)';
    document.body.classList.remove('locked');
    
    // Play Music
    bgMusic.play().then(() => {
        isPlaying = true;
        musicCtrl.style.display = 'block'; // Tombolnya muncul di sini
        musicCtrl.style.animationPlayState = 'running'; // Animasinya muter
    }).catch(error => console.log("Auto-play prevented by browser"));

    // Tampilkan tombol auto-scroll
    document.getElementById('autoscroll-control').style.display = 'block';
}

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicCtrl.style.animationPlayState = 'paused';
        musicCtrl.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Icon berubah jadi mute
    } else {
        bgMusic.play();
        musicCtrl.style.animationPlayState = 'running';
        musicCtrl.innerHTML = '<i class="fas fa-music"></i>'; // Icon berubah jadi nada
    }
    isPlaying = !isPlaying;
}

// --- FUNGSI AUTO SCROLL (BARU) ---
let isAutoScrolling = false;
let autoScrollInterval;

function toggleAutoScroll() {
    const btn = document.getElementById('autoscroll-control');
    
    if (isAutoScrolling) {
        clearInterval(autoScrollInterval);
        btn.innerHTML = '<i class="fas fa-play"></i> Auto Scroll';
        btn.style.background = 'var(--c-gold)';
    } else {
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, 1);
        }, 20); // Kecepatan scroll
        btn.innerHTML = '<i class="fas fa-pause"></i> Stop Scroll';
        btn.style.background = 'var(--c-gold-hover)';
    }
    isAutoScrolling = !isAutoScrolling;
}

// Hentikan auto-scroll kalau tamu scroll layarnya secara manual
['wheel', 'touchmove'].forEach(evt => {
    window.addEventListener(evt, () => {
        if(isAutoScrolling) toggleAutoScroll();
    }, { passive: true });
});

// --- FUNGSI LIGHTBOX GALLERY ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) {
    lightbox.style.display = "block";
    lightboxImg.src = src;
}
function closeLightbox() {
    lightbox.style.display = "none";
}

// --- FUNGSI COPY REKENING & DOWNLOAD QRIS ---
function copyRekening(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Tampilkan pesan khusus untuk copy rekening
        showToast("Nomor rekening berhasil disalin ✨");
    });
}

function downloadQRIS() {
    // Fungsi ini bikin browser otomatis download gambar QRIS ke HP tamu
    const link = document.createElement('a');
    link.href = 'gambar-qris-lo.png'; // NAMA FILE GAMBAR HARUS SAMA KAYAK DI HTML
    link.download = 'QRIS_Pernikahan.png'; // Nama file pas ke-download di HP
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Tampilkan pesan khusus untuk download QRIS
    showToast("QRIS berhasil disimpan ke galeri ✨");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message; // Teksnya sekarang dinamis menyesuaikan aksi
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// --- MOCKUP FORM UCAPAN ---
document.getElementById('wish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('sender-name').value;
    const msg = document.getElementById('sender-msg').value;
    
    const newWish = `
        <div class="wish-card slide-up visible">
            <h4>${name}</h4>
            <p class="time">Baru saja</p>
            <p>${msg}</p>
        </div>
    `;
    document.getElementById('wishes-list').insertAdjacentHTML('afterbegin', newWish);
    this.reset();
});


document.addEventListener('DOMContentLoaded', () => {
    // 1. Eksekusi Efek Bunga Jatuh
    createPetals();

    // 2. Get Guest Name from URL (?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    if (guestName) {
        const formattedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
        document.getElementById('guest-name').innerText = formattedName;
    }

    // 3. Scroll Animation Observer (Animasi jalan TIAP scroll)
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Baris ini yang bikin animasi ke-reset pas lu scroll ke atas
                entry.target.classList.remove('visible'); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up').forEach(el => observer.observe(el));

    // 4. Countdown Timer
    const countdownDate = new Date("Nov 25, 2026 08:00:00").getTime();
    
    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerHTML = days < 10 ? '0'+days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? '0'+hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? '0'+minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? '0'+seconds : seconds;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "<p class='gold-text'>Acara Sedang Berlangsung</p>";
        }
    }, 1000);

    // 5. Fitur Swipe / Drag to scroll untuk Galeri Foto Horizontal
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (galleryScroll) {
        let isDown = false;
        let startX;
        let scrollLeft;

        galleryScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            galleryScroll.style.cursor = 'grabbing';
            startX = e.pageX - galleryScroll.offsetLeft;
            scrollLeft = galleryScroll.scrollLeft;
        });
        galleryScroll.addEventListener('mouseleave', () => {
            isDown = false;
            galleryScroll.style.cursor = 'grab';
        });
        galleryScroll.addEventListener('mouseup', () => {
            isDown = false;
            galleryScroll.style.cursor = 'grab';
        });
        galleryScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // cegah blok teks terpilih pas lagi nge-drag
            const x = e.pageX - galleryScroll.offsetLeft;
            const walk = (x - startX) * 2; // kecepatan scroll
            galleryScroll.scrollLeft = scrollLeft - walk;
        });
    }
});

// --- FUNGSI EFEK JATUH KELOPAK BUNGA EKSKLUSIF ---
function createPetals() {
    const container = document.getElementById('particles-container');
    if (!container) return; 
    
    const petalCount = 20; 

    for (let i = 0; i < petalCount; i++) {
        let petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Random posisi dan durasi biar jatuhnya natural
        let startLeft = Math.random() * 100; // 0vw - 100vw
        let duration = Math.random() * 8 + 8; // 8s - 16s
        let delay = Math.random() * 10; 
        
        // Ukuran kecil biar elegan (kayak bunga asli)
        let size = Math.random() * 8 + 10; // 10px - 18px
        
        petal.style.left = startLeft + 'vw';
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = delay + 's';
        
        container.appendChild(petal);
    }
}

// --- FUNGSI OPEN INVITATION & MUSIC ---
let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicCtrl = document.getElementById('music-control');

function openInvitation() {
    document.getElementById('cover').style.transform = 'translateY(-100vh)';
    document.body.classList.remove('locked');
    
    // Play Music
    bgMusic.play().then(() => {
        isPlaying = true;
        musicCtrl.style.display = 'block'; // Tombolnya muncul di sini
        musicCtrl.style.animationPlayState = 'running'; // Animasinya muter
    }).catch(error => console.log("Auto-play prevented by browser"));

    // Tampilkan tombol auto-scroll
    document.getElementById('autoscroll-control').style.display = 'block';
}

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicCtrl.style.animationPlayState = 'paused';
        musicCtrl.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Icon berubah jadi mute
    } else {
        bgMusic.play();
        musicCtrl.style.animationPlayState = 'running';
        musicCtrl.innerHTML = '<i class="fas fa-music"></i>'; // Icon berubah jadi nada
    }
    isPlaying = !isPlaying;
}

// --- FUNGSI AUTO SCROLL (BARU) ---
let isAutoScrolling = false;
let autoScrollInterval;

function toggleAutoScroll() {
    const btn = document.getElementById('autoscroll-control');
    
    if (isAutoScrolling) {
        clearInterval(autoScrollInterval);
        btn.innerHTML = '<i class="fas fa-play"></i> Auto Scroll';
        btn.style.background = 'var(--c-gold)';
    } else {
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, 1);
        }, 20); // Kecepatan scroll
        btn.innerHTML = '<i class="fas fa-pause"></i> Stop Scroll';
        btn.style.background = 'var(--c-gold-hover)';
    }
    isAutoScrolling = !isAutoScrolling;
}

// Hentikan auto-scroll kalau tamu scroll layarnya secara manual
['wheel', 'touchmove'].forEach(evt => {
    window.addEventListener(evt, () => {
        if(isAutoScrolling) toggleAutoScroll();
    }, { passive: true });
});

// --- FUNGSI LIGHTBOX GALLERY ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) {
    lightbox.style.display = "block";
    lightboxImg.src = src;
}
function closeLightbox() {
    lightbox.style.display = "none";
}

// --- FUNGSI COPY REKENING & DOWNLOAD QRIS ---
function copyRekening(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Tampilkan pesan khusus untuk copy rekening
        showToast("Nomor rekening berhasil disalin ✨");
    });
}

function downloadQRIS() {
    // Fungsi ini bikin browser otomatis download gambar QRIS ke HP tamu
    const link = document.createElement('a');
    link.href = 'gambar-qris-lo.png'; // NAMA FILE GAMBAR HARUS SAMA KAYAK DI HTML
    link.download = 'QRIS_Pernikahan.png'; // Nama file pas ke-download di HP
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Tampilkan pesan khusus untuk download QRIS
    showToast("QRIS berhasil disimpan ke galeri ✨");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message; // Teksnya sekarang dinamis menyesuaikan aksi
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// --- MOCKUP FORM UCAPAN ---
document.getElementById('wish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('sender-name').value;
    const msg = document.getElementById('sender-msg').value;
    
    const newWish = `
        <div class="wish-card slide-up visible">
            <h4>${name}</h4>
            <p class="time">Baru saja</p>
            <p>${msg}</p>
        </div>
    `;
    document.getElementById('wishes-list').insertAdjacentHTML('afterbegin', newWish);
    this.reset();
});

// --- EFEK HERO FULL SCREEN LALU MENGECIL SAAT DI-SCROLL ---
const heroEl = document.querySelector('.hero');

// 1. Paksa full layar saat pertama kali render (sebelum scroll)
heroEl.style.minHeight = '100vh';
heroEl.style.display = 'flex';
heroEl.style.flexDirection = 'column';
heroEl.style.justifyContent = 'center';

// 2. Deteksi pergerakan scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        // Jika mulai scroll ke bawah, hapus efek full layar. 
        // Otomatis akan kembali menggunakan .hero { padding: 5rem 1.2rem; } dari CSS
        heroEl.style.minHeight = '';
        heroEl.style.display = '';
        heroEl.style.flexDirection = '';
        heroEl.style.justifyContent = '';
    } else {
        // Jika tamu scroll mentok ke atas lagi, kembalikan efek full layar
        heroEl.style.minHeight = '100vh';
        heroEl.style.display = 'flex';
        heroEl.style.flexDirection = 'column';
        heroEl.style.justifyContent = 'center';
    }
});
