// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 2.0, // Extremely slow & smooth
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Animations Registration
gsap.registerPlugin(ScrollTrigger);

// Cinematic Intro Branding Animation
function initCinematicIntro() {
    const introOverlay = document.querySelector('.intro-branding-overlay');
    const introLogoWrap = document.querySelector('.intro-logo-wrap');
    const nav = document.querySelector('.nav-minimal');
    const navLogo = document.querySelector('.nav-minimal .logo');

    if (!introOverlay || !navLogo) return;

    // Stop scroll initially
    if (typeof lenis !== 'undefined') lenis.stop();

    // Initial state: Logo starts hidden to allow Intro centerpiece to emerge
    const navLogoLink = document.querySelector('.nav-minimal .logo');
    if (navLogoLink) navLogoLink.classList.remove('visible');
    
    gsap.set(introLogoWrap, { scale: 0.7, opacity: 0, y: 30 });

    const introTl = gsap.timeline();

    // 1. Pop-up the branding centerpiece
    introTl.to(introLogoWrap, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 2.5,
        delay: 0.5,
        ease: "expo.out",
        onComplete: () => {
            // Allow scrolling once the logo has settled
            if (typeof lenis !== 'undefined') lenis.start();
        }
    });

    // 2. Simple Fade & Reveal on Scroll logic
    const scrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "400px top",
            scrub: 1,
            onLeave: () => {
                const navLogoLink = document.querySelector('.nav-minimal .logo');
                if (navLogoLink) navLogoLink.classList.add('visible');
                gsap.to(introOverlay, { opacity: 0, pointerEvents: 'none', duration: 1.0 });
            },
            onEnterBack: () => {
                const navLogoLink = document.querySelector('.nav-minimal .logo');
                if (navLogoLink) navLogoLink.classList.remove('visible');
                gsap.to(introOverlay, { opacity: 1, pointerEvents: 'all', duration: 0.8 });
            }
        }
    });

    // Fade out Intro Content as we scroll
    scrollTl.to(introLogoWrap, {
        opacity: 0,
        y: -50,
        ease: "power2.inOut"
    }, 0);

    // Fade in Navbar Elements
    scrollTl.to(".hamburger, .nav-cta", {
        opacity: 1,
        visibility: "visible",
        ease: "power2.inOut"
    }, 0.2);

    // Animate Navbar Glass Effect
    scrollTl.to(nav, {
        background: "rgba(10, 10, 10, 0.75)",
        backdropFilter: "blur(20px)",
        padding: "15px 0",
        ease: "power2.inOut"
    }, 0);
}


// Update DOMContentLoaded to initialize animations
document.addEventListener("DOMContentLoaded", () => {
    initCinematicIntro();
    initHeroAnimation();
});


// 1. Hero — Simple Reveal (Plain & Clean)
function initHeroAnimation() {
    const heroImg = document.querySelector('.hero-bg-img');
    const heroWrapper = document.querySelector('.hero-bg-wrapper');
    const heroHeading = document.querySelector('.hero-heading');
    const heroSubheading = document.querySelector('.hero-subheading');
    const heroOverlay = document.querySelector('.hero-overlay');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (!heroWrapper || !heroImg) return;

    // Remove the complex pieces logic and just show everything clearly with a simple timeline
    const tl = gsap.timeline();

    // Initial Reveal (Plain & Clean)
    gsap.set(heroImg, { opacity: 1, scale: 1 });
    
    tl.to(heroOverlay, {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut"
    })
    .to(heroHeading, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1.0")
    .to(heroSubheading, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1.2")
    .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1.1");

    if (scrollIndicator) {
        tl.to(scrollIndicator, {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out"
        }, "-=0.5");
    }

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


// 2. Services Stagger Reveal
const serviceItems = document.querySelectorAll('.fade-stagger');
if (serviceItems.length > 0) {
    gsap.fromTo(serviceItems, 
        { y: 60, opacity: 0 },
        {
            y: 0, 
            opacity: 1,
            duration: 1.6,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#services",
                start: "top 75%",
                toggleActions: "play none none none"
            }
        }
    );
}

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
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    tl.to(mask, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.8,
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

// 6. Luxury Menu Toggle Logic
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
}
