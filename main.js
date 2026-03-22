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

// 1. Hero Cinematic Animation (Slices Falling)
const heroBgWrapper = document.querySelector('.hero-bg-wrapper');
const heroBgStrips = document.querySelector('.hero-bg-strips');
const heroStrips = document.querySelectorAll('.hero-strip');
const heroOverlay = document.querySelector('.hero-overlay');
const heroTexts = document.querySelectorAll('.hero-anim');

if (heroBgWrapper) {
    const tlHero = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    
    // Initial states: place strips above screen, remove wrapper mask
    gsap.set(heroTexts, { y: 40, opacity: 0 });
    gsap.set(heroStrips, { yPercent: -100 });
    gsap.set(heroBgWrapper, { clipPath: 'none' }); // Remove old initial inset

    tlHero
    // Step 1: Strip cascade from top
    .to(heroStrips, {
        yPercent: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.2
    })
    // Step 2: Cinematic slow zoom-out of the combining container
    .to(heroBgStrips, {
        scale: 1,
        duration: 3.5,
        ease: "power2.out"
    }, "-=1.0")
    // Step 3: Subtle overlay fade in for text readability
    .to(heroOverlay, {
        opacity: 1,
        duration: 2
    }, "-=3.0")
    // Step 4: Text elements fade in sequentially
    .to(heroTexts, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=2.5");

    // Hero Image Parallax on Scroll down
    gsap.to(heroBgStrips, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
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

// Hamburger Hover Animation
hamburger.addEventListener('mouseenter', () => {
    gsap.to('.hamburger-line:first-child', { width: 20, duration: 0.3 });
    gsap.to('.hamburger-line:last-child', { width: 30, duration: 0.3 });
});
hamburger.addEventListener('mouseleave', () => {
    gsap.to('.hamburger-line:first-child', { width: 30, duration: 0.3 });
    gsap.to('.hamburger-line:last-child', { width: 30, duration: 0.3 });
});
