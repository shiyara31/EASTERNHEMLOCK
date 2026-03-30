// GSAP Animations Registration & Lenis Sync
gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true, nullTargetWarn: false }); // Enable GPU acceleration globally

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.5, /* Weighted Cinematic Duration */
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    lerp: 0.05, /* Deeper weighted smoothness */
    wheelMultiplier: 1,
    smoothTouch: true, 
    touchMultiplier: 1.5, /* Enhanced mobile momentum */
    infinite: false,
});

// GSAP Ticker for Lenis Sync (More robust than manual RAF)
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

lenis.on('scroll', ScrollTrigger.update);

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
        background: "rgba(17,17,17,0.95)", /* Midnight Graphite Translucent */
        backdropFilter: "blur(25px)",
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

// 1.5 Scroll-Driven Luxury Showcase Animation
function initScrollStoryAnimation() {
    const section = document.querySelector('.scroll-story-section');
    const cardCenter = document.querySelector('.card-center');
    const cardLeftInner = document.querySelector('.card-left-inner');
    const cardRightInner = document.querySelector('.card-right-inner');
    const cardLeftOuter = document.querySelector('.card-left-outer');
    const cardRightOuter = document.querySelector('.card-right-outer');

    if (!section || !cardCenter || !cardLeftInner || !cardRightInner) return;

    const sideCards = [cardLeftOuter, cardLeftInner, cardRightInner, cardRightOuter];
    const allCards = [cardCenter, ...sideCards];

    // Responsive Animation Logic
    let mm = gsap.matchMedia();

    mm.add({
        isDesktop: "(min-width: 1025px)",
        isMobile: "(max-width: 1024px)"
    }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        // 1. Initial State: Stacking cards behind center
        gsap.set(allCards, { xPercent: -50, yPercent: -50 });
        
        gsap.set(sideCards, {
            x: 0,
            y: 0,
            z: -300,
            opacity: 0, // Keep clean start
            scale: 0.8,
            rotateY: 0,
            force3D: true // Enable Hardware Acceleration
        });

        gsap.set(cardCenter, { z: 50, scale: 1, opacity: 1, x: 0, y: 0, force3D: true });

        // 2. Scroll Animation Timeline (Scroll DOWN = Cards Spread OUT Widely)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8, // More weighted 'cinematic' spread
                pin: ".scroll-sticky-container",
                invalidateOnRefresh: true, 
                pinSpacing: false,
                onUpdate: self => {
                    // Force refresh for smoother synchronization on touch
                    if (isMobile) ScrollTrigger.update();
                }
            }
        });

        // Spread Ease
        const spreadEase = "power2.out";

        // Center card scales up slightly for focus
        tl.to(cardCenter, { scale: 1.15, z: 250, duration: 1 }, 0);

        // Inner side cards spread (increased wide values as requested)
        tl.to(cardLeftInner, {
            x: isDesktop ? '-65%' : '-55%',
            rotateY: isDesktop ? 18 : 14,
            z: 0,
            opacity: 1,
            scale: isDesktop ? 1 : 0.95,
            ease: spreadEase
        }, 0.1);

        tl.to(cardRightInner, {
            x: isDesktop ? '65%' : '55%',
            rotateY: isDesktop ? -18 : -14,
            z: 0,
            opacity: 1,
            scale: isDesktop ? 1 : 0.95,
            ease: spreadEase
        }, 0.1);

        // Outer side cards spread even further (Extra wide spread)
        tl.to(cardLeftOuter, {
            x: isDesktop ? '-140%' : '-125%',
            rotateY: isDesktop ? 30 : 25,
            z: -100,
            opacity: 0.9,
            scale: isDesktop ? 0.9 : 0.85,
            ease: spreadEase
        }, 0.2);

        tl.to(cardRightOuter, {
            x: isDesktop ? '140%' : '125%',
            rotateY: isDesktop ? -30 : -25,
            z: -100,
            opacity: 0.9,
            scale: isDesktop ? 0.9 : 0.85,
            ease: spreadEase
        }, 0.2);

        // Ambient Glow Drifting (Matching Dark Theme)
        const glows = document.querySelectorAll('.ambient-glow');
        glows.forEach((glow, index) => {
            tl.to(glow, {
                x: index % 2 === 0 ? (isDesktop ? '35%' : '20%') : (isDesktop ? '-35%' : '-20%'),
                y: index % 2 === 0 ? '20%' : '-20%',
                scale: isDesktop ? 1.5 : 1.2,
                duration: 1,
                ease: "none"
            }, 0);
        });
        
        // Final refresh to ensure mobile layout sync
        ScrollTrigger.refresh();

        return () => {
            // Cleanup logic if needed
        };
    });

    // 3. Subtle Floating "Bouncing" Animation (Persistent)
    allCards.forEach((card, index) => {
        if (card) {
            gsap.to(card, {
                y: "-=20",
                duration: 2.5 + (index * 0.3),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
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
        // Generate exactly 10 images each
        generateItems('interiors', interiorIds, 'Bespoke Interior');
        generateItems('landscapes', landscapeIds, 'Private Estate Landscape');
        generateItems('pools', poolIds, 'Infinity Pool Concept');

        track.innerHTML = galleryData.map(item => `
            <div class="gallery-item" data-category="${item.category}">
                <div class="gallery-img-wrap">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="card-overlay"></div>
                    <div class="card-content">
                        <div class="card-top">
                            <span class="card-location">${item.location}</span>
                            <h3 class="card-title">${item.title}</h3>
                        </div>
                        <div class="card-view-btn">VIEW</div>
                        <div class="card-bottom">
                            <span class="card-date">${item.date}</span>
                        </div>
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

    // Horizontal scroll override inside gallery track for smooth seamless tracking
    if (track) {
        track.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                track.scrollLeft += e.deltaY * 2.5;
            }
        });
    }
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
