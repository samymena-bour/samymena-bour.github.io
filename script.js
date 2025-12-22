/* 1. CONFIGURATION PARTICULES */
particlesJS("canvas-container", {
    "particles": {
        // ... (tes réglages de nombre/couleur ne changent pas)
        "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#00ff88" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#00ff88", "opacity": 0.2, "width": 1 },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
        "detect_on": "window",  /* <--- C'EST ICI LE CHANGEMENT (avant c'était "canvas") */
        "events": {
            "onhover": { "enable": true, "mode": "repulse" },
            "onclick": { "enable": true, "mode": "push" }
        },
        "modes": { "repulse": { "distance": 100, "duration": 0.4 } }
    },
    "retina_detect": true
});

/* 2. ANIMATION INTRO */
const tl = gsap.timeline();
tl.to(".hero-title", { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
    .to(".subtitle", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.5")
    .to(".scroll-down", { opacity: 1, duration: 1 })
    .to(".scroll-down", { y: 10, duration: 1.5, repeat: -1, yoyo: true, ease: "power1.inOut" });

/* 3. SWIPER (CAROUSEL) - MODIFIÉ */
var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,

    // Configuration Autoplay Avancée
    autoplay: {
        delay: 5000,
        disableOnInteraction: false, // Ne pas désactiver définitivement après interaction
        pauseOnMouseEnter: true,     // PAUSE si la souris est dessus (Focus)
    },

    // Événements pour reset le timer
    on: {
        // Dès qu'on commence à toucher/cliquer
        touchStart: function () {
            this.autoplay.stop(); // On stop net pour éviter un saut
        },
        // Dès qu'on relâche ou finit le drag
        touchEnd: function () {
            this.autoplay.start(); // On relance le timer à 0
        },
        // Dès que la slide change (clic pagination ou drag)
        slideChange: function () {
            this.autoplay.start(); // On s'assure que le timer repart de 5s
        }
    },

    coverflowEffect: {
        rotate: 30, stretch: 0, depth: 200, modifier: 1, slideShadows: true,
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
        320: { slidesPerView: 1, effect: "slide" },
        768: { slidesPerView: "auto", effect: "coverflow" }
    }
});

function switchLang(lang) {
    // 1. Gestion des boutons (Active/Inactive)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.textContent.toLowerCase() === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Remplacement du texte
    const elementsToTranslate = document.querySelectorAll(`[data-${lang}]`);

    elementsToTranslate.forEach(el => {
        gsap.to(el, {
            opacity: 0, duration: 0.2, onComplete: () => {

                // --- C'EST ICI QU'ON CHANGE ---
                // On utilise innerHTML pour interpréter les balises <strong>
                el.innerHTML = el.getAttribute(`data-${lang}`);
                // ------------------------------

                gsap.to(el, { opacity: 1, duration: 0.2 });
            }
        });
    });
}

/* 5. CUSTOM SCROLL ENGINE */
const world = document.getElementById("world-container");
const sections = document.querySelectorAll("header, .projects-section");
let currentSectionIndex = 0;
let isAnimating = false;

function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isAnimating = true;
    currentSectionIndex = index;
    const targetYPercent = -100 * index;
    gsap.to(world, {
        yPercent: targetYPercent, duration: 1.5, ease: "power2.inOut",
        onComplete: () => { isAnimating = false; }
    });
}
window.addEventListener("wheel", (e) => {
    if (isAnimating) return;
    if (e.deltaY > 0) scrollToSection(currentSectionIndex + 1);
    else scrollToSection(currentSectionIndex - 1);
}, { passive: false });

/* 6. GESTION FULLSCREEN */
const overlay = document.getElementById('fullscreen-overlay');
const overlayImg = document.getElementById('fullscreen-image');
const closeBtn = document.querySelector('.overlay-close');

function openFullscreen(mediaUrl) {
    swiper.autoplay.stop(); // On stop quand c'est ouvert
    overlayImg.src = mediaUrl;
    overlay.classList.add('active');
}

function closeFullscreen() {
    overlay.classList.remove('active');
    // On relance le timer après la fermeture
    setTimeout(() => { swiper.autoplay.start(); }, 500);
}

document.querySelector('.swiper-wrapper').addEventListener('click', function (e) {
    const slide = e.target.closest('.swiper-slide');
    if (slide && !e.target.classList.contains('btn')) {
        const fullMediaUrl = slide.getAttribute('data-full-media');
        if (fullMediaUrl) openFullscreen(fullMediaUrl);
    }
});

closeBtn.addEventListener('click', closeFullscreen);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeFullscreen();
});