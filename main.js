// GSAP Animations Registration & Lenis Sync
gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true, nullTargetWarn: false }); // Enable GPU acceleration globally

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2, /* Slightly faster for snappier feel */
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    lerp: 0.1, /* Snappier response */
    wheelMultiplier: 1,
    smoothTouch: true, /* Enabled: Pure smooth momentum-based touch scrolling for mobile */
    touchMultiplier: 1.5,
    infinite: false,
});

// GSAP Ticker for Lenis Sync
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Cinematic Intro Branding Animation
function initCinematicIntro() {
    const introOverlay = document.querySelector('.intro-branding-overlay');
    const introLogoWrap = document.querySelector('.intro-logo-wrap');
    const nav = document.querySelector('.nav-minimal');
    const heroElements = [".hero-heading", ".hero-subheading", ".hero-cta", ".scroll-indicator", ".hamburger", ".nav-cta", ".nav-minimal .logo"];

    if (!introOverlay || !introLogoWrap) return;

    // Optimized: Only play intro once per session
    if (sessionStorage.getItem('eh_intro_played')) {
        gsap.set(introOverlay, { display: 'none', opacity: 0, pointerEvents: 'none' });
        gsap.set(heroElements, { opacity: 1, y: 0, visibility: "visible" });
        if (typeof lenis !== 'undefined') {
            lenis.start();
            ScrollTrigger.refresh();
        }
        return;
    }

    // Mark as played for this session
    sessionStorage.setItem('eh_intro_played', 'true');

    // Halt smooth scroll during intro
    if (typeof lenis !== 'undefined') lenis.stop();

    // Prepare initial states
    gsap.set([".hamburger", ".nav-cta", ".nav-minimal .logo"], { opacity: 0, visibility: "hidden" });
    gsap.set(".hero-content", { opacity: 1 }); // Ensure parent is visible
    gsap.set([".hero-heading", ".hero-subheading", ".hero-cta", ".scroll-indicator"], { opacity: 0, y: 30 });
    gsap.set(introLogoWrap, { scale: 0.7, opacity: 0, y: 30 });

    const introTl = gsap.timeline({
        onComplete: () => {
            if (typeof lenis !== 'undefined') {
                lenis.start();
                ScrollTrigger.refresh();
            }
        }
    });

    // 1. Logo Pop-up
    introTl.to(introLogoWrap, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "expo.out"
    });

    // 2. Automtic Fade-out (Faster, more premium feel)
    introTl.to(introLogoWrap, {
        opacity: 0,
        y: -15,
        scale: 0.99,
        duration: 0.5, 
        delay: 0.4, 
        ease: "power3.inOut"
    })
    .to(introOverlay, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.set(introOverlay, { pointerEvents: 'none', display: 'none' });
        }
    }, "-=0.4");

    // 3. Reveal Site Content
    introTl.to([".hero-heading", ".hero-subheading", ".hero-cta", ".scroll-indicator"], {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out"
    }, "-=1.2")
    .to([".nav-minimal .logo", ".hamburger", ".nav-cta"], {
        opacity: 1,
        visibility: "visible",
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=1.0");

    // 4. Parallax & Scroll Triggers (Simplified)
    const scrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "500px top",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });

    scrollTl.to(nav, {
        padding: "0",
        ease: "none"
    }, 0);
}


// Update DOMContentLoaded to initialize animations
document.addEventListener("DOMContentLoaded", () => {
    initCinematicIntro();
    initHeroAnimation();
    initScrollStoryAnimation();
    initParallax();
});

// Parallax Optimization Engine
function initParallax() {
    gsap.utils.toArray(".parallax-img").forEach(img => {
        gsap.to(img, {
            y: "15%",
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.0, // Cinematic smooth scrub
                invalidateOnRefresh: true,
                force3D: true
            }
        });
    });
}

// 1.5 Scroll-Driven Luxury Showcase Animation (Premium 3D Carousel)
function initScrollStoryAnimation() {
    const section = document.querySelector('.scroll-story-section');
    const cards = gsap.utils.toArray('.scroll-card');
    const wrapper = document.querySelector('.scroll-cards-wrapper');
    const indicators = document.querySelectorAll('.indicator');

    if (!section || cards.length === 0) return;

    let mm = gsap.matchMedia();

    mm.add({
        isDesktop: "(min-width: 1025px)",
        isMobile: "(max-width: 1024px)"
    }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        // Initial setup for cards
        gsap.set(cards, {
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            scale: isDesktop ? 0.8 : 0.6,
            z: -1000,
            rotateY: isDesktop ? 15 : 10,
            filter: "blur(15px)",
            transformOrigin: "center center",
            pointerEvents: "none"
        });

        // Add slight slant to wrapper (reduced on mobile)
        gsap.set(wrapper, {
            rotateX: isDesktop ? 5 : 2,
            rotateY: isDesktop ? -10 : -5,
            transformStyle: "preserve-3d"
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                pin: ".scroll-sticky-container",
                pinSpacing: false,
                invalidateOnRefresh: true,
            }
        });

        // Current transition logic
        cards.forEach((card, i) => {
            const isLast = i === cards.length - 1;

            // Current Card focus
            tl.to(card, {
                opacity: 1,
                scale: isDesktop ? 1.15 : 1.05,
                z: isDesktop ? 150 : 50,
                rotateY: 0,
                filter: "blur(0px)",
                x: "0%",
                duration: 1,
                ease: "power2.inOut",
                pointerEvents: "auto",
                onStart: () => {
                    card.style.zIndex = 100;
                    indicators.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
                },
                onReverseComplete: () => {
                    card.style.zIndex = cards.length - i;
                    if (i > 0) indicators.forEach((dot, idx) => dot.classList.toggle('active', idx === i - 1));
                }
            }, i);

            // Previous Card fade out left
            if (i > 0) {
                tl.to(cards[i - 1], {
                    opacity: 0.3,
                    scale: isDesktop ? 0.85 : 0.7,
                    z: -400,
                    rotateY: isDesktop ? 35 : 25,
                    x: isDesktop ? "-110%" : "-80%",
                    filter: "blur(10px)",
                    duration: 1,
                    ease: "power2.inOut",
                    pointerEvents: "none",
                    onStart: () => cards[i-1].style.zIndex = 1
                }, i);
            }

            // Next Card peek from right
            if (i < cards.length - 1) {
                tl.fromTo(cards[i + 1], {
                    opacity: 0,
                    x: isDesktop ? "110%" : "80%",
                    z: -400,
                    rotateY: isDesktop ? -35 : -25,
                    filter: "blur(10px)",
                    scale: isDesktop ? 0.85 : 0.7
                }, {
                    opacity: 0.4,
                    x: isDesktop ? "110%" : "80%",
                    z: -400,
                    rotateY: isDesktop ? -35 : -25,
                    filter: "blur(10px)",
                    scale: isDesktop ? 0.85 : 0.7,
                    duration: 1,
                    ease: "power2.inOut"
                }, i);
            }
            
            if (!isLast) {
                tl.to({}, { duration: 0.5 }); // Buffer pause
            }
        });

        // Ambient background
        const glows = document.querySelectorAll('.ambient-glow');
        glows.forEach((glow, index) => {
            tl.to(glow, {
                x: index % 2 === 0 ? "35%" : "-35%",
                y: index % 2 === 0 ? "15%" : "-15%",
                opacity: 0.12,
                duration: cards.length,
                ease: "none"
            }, 0);
        });

        return () => {
            // Clean up
        };
    });
}


// 1. Hero — Simple Reveal (Plain & Clean)
function initHeroAnimation() {
    // We now handle the content reveal inside the Cinematic Intro timeline for better flow
    const heroImg = document.querySelector('.hero-bg-img');
    const heroOverlay = document.querySelector('.hero-overlay');

    // Initial State for visual clarity: Background is ready, content handled by Intro
    gsap.set(heroImg, { opacity: 1, scale: 1 });
    gsap.set(heroOverlay, { opacity: 1 });

    // Initial State for visual clarity
    // Scroll Parallax on the main image remains for luxury depth
    gsap.to(heroImg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end:   'bottom top',
            scrub: true
        }
    });
}


// 2. Services Stagger Reveal (Optimized & Consolidated)
const initServiceAnimations = () => {
    const serviceSection = document.querySelector('#services');
    const serviceItems = document.querySelectorAll('.fade-stagger');
    
    if (serviceItems.length > 0 && serviceSection) {
        gsap.fromTo(serviceItems, 
            { y: 50, opacity: 0 },
            {
                y: 0, 
                opacity: 1,
                duration: 1.5,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: serviceSection,
                    start: "top 85%", // Trigger earlier on mobile
                    toggleActions: "play none none none"
                }
            }
        );
    }
}
initServiceAnimations();

// 3. Image Mask Reveals (Bottom to Top / Right to Left)
const revealMasks = document.querySelectorAll('.reveal-mask');
revealMasks.forEach(mask => {
    let _clipStart = 'inset(100% 0 0 0)';
    if(mask.classList.contains('right-reveal')) {
        _clipStart = 'inset(0 0 0 100%)';
    }

    gsap.set(mask, { clipPath: _clipStart });

    const img = mask.querySelector('img');
    if(img && !img.classList.contains('parallax-img')) {
        gsap.set(img, { scale: 1.15 });
    }

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: mask,
            start: "top bottom-=50", // Earlier trigger for mobile reliability
            toggleActions: "play none none none",
            onEnter: () => mask.classList.add('gsap-revealed')
        }
    });

    tl.to(mask, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 2.0, // Smoother reveal
        ease: "power4.inOut"
    });

    if(img && !img.classList.contains('parallax-img')) {
        tl.to(img, {
            scale: 1,
            duration: 1.8,
            ease: "power3.out"
        }, "-=1.8");
    }
});

// 4. Parallax Images within Showcases
const parallaxImages = document.querySelectorAll('.parallax-img');
parallaxImages.forEach(img => {
    gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// 5. Fade & Slide Text Reveals
const fadeSlideRight = document.querySelectorAll('.fade-slide-right');
if (fadeSlideRight.length > 0) {
    gsap.fromTo(fadeSlideRight, 
        { x: -50, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1.5, ease: "power3.out",
            scrollTrigger: {
                trigger: fadeSlideRight[0],
                start: "top 80%"
            }
        }
    );
}

const fadeSlideUp = document.querySelectorAll('.fade-slide-up');
fadeSlideUp.forEach(el => {
    gsap.fromTo(el, 
        { y: 80, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1.8, ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            }
        }
    );
});

// 5.5 Statistics Count-up Animation
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    if (stat) {
        gsap.to(stat, {
            innerText: target,
            duration: 7.5, // Tripled from 2.5s
            snap: { innerText: 1 },
            ease: "power2.out",
            scrollTrigger: {
                trigger: stat,
                start: "top bottom-=50px", // Trigger when nearly in view
                toggleActions: "play none none none"
            }
        });
    }
});

// Refresh ScrollTrigger on resize (critical for mobile)
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Added: Final refresh after all inits
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

const hamburger = document.querySelector('.hamburger');
const menuClose = document.querySelector('.menu-close');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');
const menuSubLinks = document.querySelectorAll('.menu-sub-links li');
const menuCols = document.querySelectorAll('.menu-col');

let isMenuOpen = false;

// GSAP Menu Timeline
const menuTl = gsap.timeline({ paused: true });

menuTl.to(menuOverlay, {
    top: 0,
    duration: 1.2,
    ease: "power4.inOut"
})
.from('.menu-top', {
    y: -20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
}, "-=0.6")
.from(menuLinks, {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out"
}, "-=0.8")
.from(menuCols, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out"
}, "-=0.8");

function openMenu() {
    isMenuOpen = true;
    menuOverlay.classList.add('active');
    menuTl.play();
    lenis.stop(); // Pause smooth scroll
}

function closeMenu() {
    isMenuOpen = false;
    menuTl.reverse();
    setTimeout(() => {
        menuOverlay.classList.remove('active');
    }, 1200);
    lenis.start(); // Resume smooth scroll
}

hamburger.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

// Close menu on link click
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Hamburger Hover animation handled completely by CSS to prevent responsive layout jumps.

// 7. Luxury Gallery Modal & Filters
const galleryTriggers = document.querySelectorAll('.gallery-trigger');
const galleryModal = document.querySelector('.gallery-modal');
const galleryClose = document.querySelector('.gallery-close');
const filterBtns = document.querySelectorAll('.filter-btn');

if (galleryModal) {
    const track = document.querySelector('.gallery-track');
    if (track) {
        const galleryData = [];
        const interiorIds = ['1600210492486-724fe5c67fb0', '1618221195710-dd6b41faaea6', '1600607686527-6fb886090705', '1628042436063-2292f7e71f49', '1600596542815-ffad4c1539a9'];
        const landscapeIds = ['1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c', '1584318556661-d703bc681bca', '1600607687939-ce8a6c25118c', '1504307651254-35680f356dfd'];
        const poolIds = ['1576013551627-0cc20b96c2a7', '1519710164309-8fac43ec29a4', '1533158326339-7f3cb6cebbfb', '1574362844322-6323a32f6381', '1573843981267-be11f611bfdd'];

        function generateItems(category, ids, baseTitle) {
            for(let i=1; i<=10; i++) {
                galleryData.push({
                    category: category,
                    location: 'DUBAI, UAE',
                    title: `${baseTitle} 0${i}`,
                    date: `0${(i%9)+1}.15.26`,
                    image: `https://images.unsplash.com/photo-${ids[i%5]}?auto=format&fit=crop&w=800&q=80`
                });
            }
        }
        // Removed generic interior, landscape and pool items as requested

        // New: User Provided Interior Images
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_01.jpg' });
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_02.jpg' });
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_03.jpg' });
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_04.jpg' });
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_05.jpg' });
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_06.jpg' });
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_07.jpg' });
        galleryData.push({ category: 'interiors', image: 'assets/interiors/interior_08.jpg' });
        // Removed generic landscape and pool items as requested

        // New: User Provided Landscape Images
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_01.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_02.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_03.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_04.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_05.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_06.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_07.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_08.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_09.jpg' });
        galleryData.push({ category: 'landscapes', image: 'assets/landscapes/landscape_10.jpg' });

        // New: User Provided Pool Images
        galleryData.push({
            category: 'pools',
            location: 'DUBAI, UAE',
            title: 'Modern Infinity Pool',
            date: '03.30.26',
            image: 'assets/pools/pool_01.jpg'
        });
        galleryData.push({
            category: 'pools',
            location: 'DUBAI, UAE',
            title: 'Designer Pool Oasis 01',
            date: '03.30.26',
            image: 'assets/pools/pool_03.jpg'
        });
        galleryData.push({
            category: 'pools',
            location: 'DUBAI, UAE',
            title: 'Premium Deck Pool 01',
            date: '03.30.26',
            image: 'assets/pools/pool_04.jpg'
        });
        galleryData.push({
            category: 'pools',
            location: 'DUBAI, UAE',
            title: 'Skyline Pool Concept 01',
            date: '03.30.26',
            image: 'assets/pools/pool_05.jpg'
        });
        galleryData.push({
            category: 'pools',
            location: 'DUBAI, UAE',
            title: 'Atmospheric Pool Design',
            date: '03.30.26',
            image: 'assets/pools/pool_06.jpg'
        });
        galleryData.push({
            category: 'pools',
            location: 'DUBAI, UAE',
            title: 'Neon Glow Infinity',
            date: '03.30.26',
            image: 'assets/pools/pool_07.jpg'
        });
        galleryData.push({
            category: 'pools',
            location: 'DUBAI, UAE',
            title: 'Midnight Oasis View',
            date: '03.30.26',
            image: 'assets/pools/pool_08.jpg'
        });

        // New: User Provided Maintenance Images
        galleryData.push({ category: 'maintenance', image: 'assets/maintenance/maintenance_01.jpg' });
        galleryData.push({ category: 'maintenance', image: 'assets/maintenance/maintenance_02.jpg' });
        galleryData.push({ category: 'maintenance', image: 'assets/maintenance/maintenance_03.jpg' });
        galleryData.push({ category: 'maintenance', image: 'assets/maintenance/maintenance_04.jpg' });
        galleryData.push({ category: 'maintenance', image: 'assets/maintenance/maintenance_05.jpg' });

        // New: User Provided Smart Home Images
        galleryData.push({ category: 'smarthomes', image: 'assets/smarthome/smarthome_01.jpg' });

        track.innerHTML = galleryData.map(item => `
            <div class="gallery-item" data-category="${item.category}">
                <div class="gallery-img-wrap">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="card-overlay"></div>
                    <div class="card-content">
                        <div class="card-view-btn">VIEW</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryTl = gsap.timeline({ paused: true });
    
    galleryTl.fromTo('.gallery-header', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" })
             .fromTo(galleryItems, { y: 150, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, stagger: 0.1, ease: "expo.out" }, "-=0.7");

    function openGallery(filter = 'all') {
        galleryModal.classList.add('active');
        if(typeof lenis !== 'undefined') lenis.stop(); // Stop main layout scrolling
        applyFilter(filter);
        galleryTl.restart();
    }

    function closeGallery() {
        galleryModal.classList.remove('active');
        if(typeof lenis !== 'undefined') lenis.start();
    }

    function applyFilter(category) {
        filterBtns.forEach(btn => {
            if(btn.dataset.filter === category || (category==='all' && btn.dataset.filter === 'all')) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.classList.remove('hidden');
                gsap.fromTo(item, { scale: 0.85, opacity: 0, y: 50}, {scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power3.out"});
            } else {
                item.classList.add('hidden');
            }
        });
    }

    galleryTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = trigger.dataset.filter || 'all';
            openGallery(filter);
        });
    });

    if(galleryClose) galleryClose.addEventListener('click', closeGallery);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyFilter(btn.dataset.filter);
        });
    });

    // --- GALLERY NAVIGATION ARROWS ---
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');

    if (galleryPrev && galleryNext && track) {
        galleryNext.addEventListener('click', () => {
            const item = track.querySelector('.gallery-item:not(.hidden)');
            if (item) {
                const itemWidth = item.offsetWidth;
                track.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        });

        galleryPrev.addEventListener('click', () => {
            const item = track.querySelector('.gallery-item:not(.hidden)');
            if (item) {
                const itemWidth = item.offsetWidth;
                track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            }
        });
    }

    // Horizontal scroll override inside gallery track for smooth seamless tracking
    if (track) {
        track.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                track.scrollLeft += e.deltaY * 2.5;
            }
        });
    }
    // --- LIGHTBOX PORTAL LOGIC ---
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCloseBtn = document.querySelector('.lightbox-close');

    // --- LIGHTBOX NAVIGATION ---
    let currentLightboxIdx = -1;
    let currentGalleryItems = [];

    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    function updateLightbox(idx) {
        if (idx < 0 || idx >= currentGalleryItems.length) return;
        currentLightboxIdx = idx;
        const targetItem = currentGalleryItems[idx];
        const targetImg = targetItem.querySelector('img');
        if (targetImg && lightboxImg) {
            lightboxImg.src = targetImg.src;
        }
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIdx = currentLightboxIdx + 1;
            if (nextIdx >= currentGalleryItems.length) nextIdx = 0;
            updateLightbox(nextIdx);
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            let prevIdx = currentLightboxIdx - 1;
            if (prevIdx < 0) prevIdx = currentGalleryItems.length - 1;
            updateLightbox(prevIdx);
        });
    }

    function openLightbox(src, item) {
        if (!lightbox || !lightboxImg) return;
        
        // Populate current items for navigation (only visible ones)
        currentGalleryItems = Array.from(track.querySelectorAll('.gallery-item:not(.hidden)'));
        currentLightboxIdx = currentGalleryItems.indexOf(item);
        
        lightboxImg.src = src;
        lightbox.classList.add('active');
        if(typeof lenis !== 'undefined') lenis.stop();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        // Only restart lenis if the gallery modal itself is not active
        if (!galleryModal.classList.contains('active')) {
            if(typeof lenis !== 'undefined') lenis.start();
        }
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
        });
    }

    // Modal track click delegation for "VIEW" buttons & Image clicks
    if (track) {
        track.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;

            const viewBtn = e.target.closest('.card-view-btn');
            
            const imgWrap = e.target.closest('.gallery-img-wrap');
            if (viewBtn || imgWrap || item) {
                const itemImg = item.querySelector('img');
                if (itemImg) openLightbox(itemImg.src, item);
            }
        });
    }

    // --- GLOBAL NO DOWNLOAD PROTECTION ---
    // Universal blocker for context menu on all images across the whole site
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('.gallery-track') || e.target.closest('.lightbox-portal')) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // --- AUTO-OPEN GALLERY via URL PARAMETER ---
    function checkUrlForGallery() {
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        
        if (filter) {
            // Wait slightly for dynamic content generation
            setTimeout(() => {
                if (typeof openGallery === 'function') {
                    openGallery(filter);
                }
            }, 600);
        }
    }

    checkUrlForGallery();
}


// Final safety kickstart for smooth scroll
if (typeof lenis !== 'undefined') {
    lenis.start();
}
