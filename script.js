document.addEventListener('DOMContentLoaded', () => {
    createPetals();

    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    if (guestName) {
        const formattedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
        document.getElementById('guest-name').innerText = formattedName;
    }

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); 
            } else {
                entry.target.classList.remove('is-visible'); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anim').forEach(el => observer.observe(el));

    // Countdown
    const countdownDate = new Date("Jul 26, 2026 10:00:00").getTime();
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

    // Horizontal Scroll Gallery
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (galleryScroll) {
        let isDown = false;
        let startX;
        let scrollLeft;

        galleryScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            galleryScroll.classList.add('is-dragging');
            startX = e.pageX - galleryScroll.offsetLeft;
            scrollLeft = galleryScroll.scrollLeft;
        });
        galleryScroll.addEventListener('mouseleave', () => {
            isDown = false;
            galleryScroll.classList.remove('is-dragging');
        });
        galleryScroll.addEventListener('mouseup', () => {
            isDown = false;
            galleryScroll.classList.remove('is-dragging');
        });
        galleryScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            const x = e.pageX - galleryScroll.offsetLeft;
            const walk = (x - startX) * 2; 
            galleryScroll.scrollLeft = scrollLeft - walk;
        });
    }
});

function createPetals() {
    const container = document.getElementById('particles-container');
    if (!container) return; 
    
    const petalCount = 20; 
    for (let i = 0; i < petalCount; i++) {
        let petal = document.createElement('div');
        petal.classList.add('petal');
        let startLeft = Math.random() * 100; 
        let duration = Math.random() * 8 + 8; 
        let delay = Math.random() * 10; 
        let size = Math.random() * 8 + 10; 
        
        petal.style.left = startLeft + 'vw';
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = delay + 's';
        container.appendChild(petal);
    }
}

let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicCtrl = document.getElementById('music-control');

function openInvitation() {
    // 1. Geser cover dan buka kunci body
    document.getElementById('cover').style.transform = 'translateY(-100vh)';
    document.body.classList.remove('locked');
    
    // 2. Mainkan musik dengan penanganan aman untuk kebijakan browser mobile
    bgMusic.play().then(() => {
        isPlaying = true;
        musicCtrl.style.display = 'block'; 
        musicCtrl.style.animationPlayState = 'running'; 
    }).catch(error => console.log("Auto-play prevented by browser"));
    
    // 3. Tampilkan tombol kontrol
    document.getElementById('autoscroll-control').style.display = 'block';

    // 4. SAFARI & CHROME SAFE: Langsung aktifkan auto-scroll di dalam klik user (Zero Delay)
    if (!isAutoScrolling) {
        toggleAutoScroll();
    }
}

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicCtrl.style.animationPlayState = 'paused';
        musicCtrl.innerHTML = '<i class="fas fa-volume-mute"></i>'; 
    } else {
        bgMusic.play();
        musicCtrl.style.animationPlayState = 'running';
        musicCtrl.innerHTML = '<i class="fas fa-music"></i>'; 
    }
    isPlaying = !isPlaying;
}

// ==========================================
// AUTO-SCROLL UNIVERSAL ENGINE (CROSS-BROWSER)
// ==========================================
let isAutoScrolling = false;
let scrollAnimation;
let lastTime = 0;
const SCROLL_SPEED = 40; // Kecepatan optimal agar mata nyaman membaca di semua jenis layar HP

function autoScrollStep(timestamp) {
    if (!isAutoScrolling) return;

    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;
    lastTime = timestamp;

    const distance = (SCROLL_SPEED * elapsed) / 1000;
    window.scrollBy(0, distance);
    
    // Berhenti otomatis jika sudah mencapai bagian paling bawah halaman
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
        toggleAutoScroll();
        return;
    }

    scrollAnimation = requestAnimationFrame(autoScrollStep);
}

function toggleAutoScroll() {
    const btn = document.getElementById('autoscroll-control');
    
    if (isAutoScrolling) {
        isAutoScrolling = false;
        cancelAnimationFrame(scrollAnimation);
        lastTime = 0; 
        btn.innerHTML = '<i class="fas fa-play"></i> Auto Scroll';
        btn.style.background = 'var(--c-gold)';
    } else {
        isAutoScrolling = true;
        lastTime = 0; 
        scrollAnimation = requestAnimationFrame(autoScrollStep);
        btn.innerHTML = '<i class="fas fa-pause"></i> Stop Scroll';
        btn.style.background = 'var(--c-gold-hover)';
    }
}

// Interupsi manual: Sentuhan jari atau *scroll* manual oleh tamu langsung mematikan auto-scroll dengan mulus
['mousedown', 'touchstart', 'wheel'].forEach(evt => {
    window.addEventListener(evt, () => {
        if (isAutoScrolling) {
            toggleAutoScroll();
        }
    }, { passive: true });
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) { lightbox.style.display = "block"; lightboxImg.src = src; }
function closeLightbox() { lightbox.style.display = "none"; }

function copyRekening(elementId) {
    const textToCopy = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Nomor rekening berhasil disalin ✨");
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message; 
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// DATABASE GOOGLE SHEETS
const scriptURL = 'https://script.google.com/macros/s/AKfycbxLegGcO07uyO4UtePWFiTYXbndf9rhXpAHbXpGr3cHdunKDRthyOu9qaP8dIkDPIcN-A/exec'; 

const form = document.getElementById('wish-form');
const wishesList = document.getElementById('wishes-list');
const submitBtn = form.querySelector('button[type="submit"]');

function loadComments() {
    wishesList.innerHTML = '<p class="text-center" style="font-size:0.9rem; color:var(--c-soft-brown);">Memuat ucapan... <i class="fas fa-spinner fa-spin"></i></p>';
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            wishesList.innerHTML = ''; 
            if (data.length === 0) {
                wishesList.innerHTML = '<p class="text-center" style="font-size:0.9rem; color:var(--c-soft-brown);">Belum ada ucapan. Jadilah yang pertama!</p>';
                return;
            }
            data.forEach(item => {
                const wishHTML = `
                    <div class="wish-card">
                        <h4>${item.nama}</h4>
                        <p class="time">${item.waktu}</p>
                        <p>${item.ucapan}</p>
                    </div>
                `;
                wishesList.insertAdjacentHTML('beforeend', wishHTML);
            });
        })
        .catch(error => {
            console.error('Error!', error.message);
            wishesList.innerHTML = '<p class="text-center" style="font-size:0.9rem; color:red;">Gagal memuat ucapan.</p>';
        });
}

loadComments();

form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    const formData = new FormData();
    formData.append('nama', document.getElementById('sender-name').value);
    formData.append('ucapan', document.getElementById('sender-msg').value);

    fetch(scriptURL, { method: 'POST', body: formData})
        .then(response => {
            submitBtn.innerHTML = 'Kirim Ucapan';
            submitBtn.disabled = false;
            form.reset(); 
            loadComments(); 
            showToast("Ucapan berhasil terkirim ✨");
        })
        .catch(error => {
            submitBtn.innerHTML = 'Kirim Ucapan';
            submitBtn.disabled = false;
            showToast("Gagal mengirim ucapan, periksa koneksi internet.");
        });
});

// ==========================================
// FITUR BACA SELENGKAPNYA (READ MORE)
// ==========================================
function toggleReadMore(btn) {
    const card = btn.parentElement;
    const dots = card.querySelector('.dots');
    const moreText = card.querySelector('.more-text');

    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btn.innerHTML = "Baca selengkapnya";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btn.innerHTML = "Tutup sedikit"; 
        moreText.style.display = "inline";
    }
}
