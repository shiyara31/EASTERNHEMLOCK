// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Cinematic Camera Movement Logic
const heroLayers = Array.from(document.querySelectorAll('.hero-layer'));
let currentHeroIndex = 0;

function applyCinematicMovement(index) {
    const slide = heroLayers[index];
    if (!slide) return;

    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    
    // Reset initial state
    gsap.set(slide, { scale: 1.15, rotation: 0, x: 0, y: 0 });

    if (index === 0) { // Pool - Horizontal Pan
        tl.to(slide, { x: 50, duration: 12 });
    } else if (index === 1) { // Entrance - Upward Floating
        tl.to(slide, { y: -40, duration: 12 });
    } else { // 3rd Image - Panning
        tl.to(slide, { x: -60, duration: 12 });
    }
}

function cycleHeroLayers() {
    const oldIndex = currentHeroIndex;
    const nextIndex = (currentHeroIndex + 1) % heroLayers.length;
    
    // Fade Out old
    gsap.to(heroLayers[oldIndex], { opacity: 0, duration: 3, ease: "power2.inOut" });
    
    // Fade In and start specific movement for next slide
    gsap.to(heroLayers[nextIndex], { 
        opacity: 1, 
        duration: 3, 
        ease: "power2.inOut",
        onStart: () => {
            gsap.set(heroLayers[nextIndex], { zIndex: 10 });
            gsap.set(heroLayers[oldIndex], { zIndex: 5 });
            applyCinematicMovement(nextIndex);
        }
    });

    currentHeroIndex = nextIndex;
}

// Every 7 seconds cycle with 3-second blend overlap
if (heroLayers.length > 0) {
    gsap.set(heroLayers[0], { opacity: 1, zIndex: 10 });
    applyCinematicMovement(0);
    setInterval(cycleHeroLayers, 7000);
}




// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const heroTl = gsap.timeline();
heroTl.to('.fade-up', {
    y: 0,
    opacity: 1,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out",
    delay: 0.5
});

// Scroll Trigger Animations for Sections
const fadeUpElements = document.querySelectorAll('.fade-up:not(.hero-content .fade-up)');
fadeUpElements.forEach((el) => {
    let animDelay = 0;
    if (el.classList.contains('delay-1')) animDelay = 0.2;
    if (el.classList.contains('delay-2')) animDelay = 0.4;
    if (el.classList.contains('delay-3')) animDelay = 0.6;

    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        delay: animDelay,
        ease: "power3.out"
    });
});

// Service Cards Animation (Staggering from above)
gsap.from('.service-card', {
    scrollTrigger: {
        trigger: '.services-grid',
        start: "top 80%",
        toggleActions: "play none none none"
    },
    y: -60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.3,
    ease: "power3.out"
});

// About Image Parallax
gsap.to('.about-image img', {
    scrollTrigger: {
        trigger: '.about-image',
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: 100,
    ease: "none"
});

// Portfolio Scroll Animation (Horizontal Peek)
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: '#portfolio',
            start: "top 80%",
            toggleActions: "play none none none"
        },
        x: 100,
        opacity: 0,
        duration: 1,
        delay: index * 0.2,
        ease: "power3.out"
    });
});

// Process Timeline Animation
const timelineLine = document.querySelector('.timeline-line');
if (timelineLine) {
    gsap.to(timelineLine, {
        scrollTrigger: {
            trigger: '.process-timeline',
            start: "top 70%",
            end: "bottom 50%",
            scrub: 2,
        },
        width: "100%",
        ease: "none"
    });
}

// Portfolio Parallax Effect
const portfolioSlider = document.querySelector('.portfolio-slider');
gsap.to(portfolioSlider, {
    scrollTrigger: {
        trigger: '#portfolio',
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5
    },
    x: -200,
    ease: "none"
});

// Testimonial Carousel Auto-scroll Simulation
let scrollAmount = 0;
const carousel = document.querySelector('.testimonial-carousel');

function autoScroll() {
    if (carousel) {
        scrollAmount += 1;
        if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
            scrollAmount = 0;
        }
        carousel.scrollLeft = scrollAmount;
    }
}

// Dynamic Background Image Transitions
const bgLayers = document.querySelectorAll('.bg-layer');
const serviceSections = document.querySelectorAll('.service-card');

serviceSections.forEach((card, index) => {
    ScrollTrigger.create({
        trigger: card,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
            bgLayers.forEach(l => l.classList.remove('active'));
            bgLayers[index].classList.add('active');
        },
        onEnterBack: () => {
            bgLayers.forEach(l => l.classList.remove('active'));
            bgLayers[index].classList.add('active');
        }
    });
});

// Gallery Modal Logic
const modal = document.getElementById('gallery-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const galleryOverlay = document.querySelector('.modal-overlay');

document.querySelectorAll('.card-link').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = link.closest('.card-content').querySelector('h3').innerText;
        modalTitle.innerText = serviceName + " Gallery";
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });
});

const hideModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
};

if (closeModal) closeModal.addEventListener('click', hideModal);
if (galleryOverlay) galleryOverlay.addEventListener('click', hideModal);

// Mobile Menu (Simple)
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Contact Form Simple Logic
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Sending...";
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerText = "Message Sent Successfully";
            btn.style.backgroundColor = "#27ae60";
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                btn.disabled = false;
            }, 3000);
        }, 2000);
    });
}
