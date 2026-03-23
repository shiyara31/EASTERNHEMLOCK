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

// 1. Hero — Falling Pieces Animation
function initHeroAnimation() {
    const heroImg = document.querySelector('.hero-bg-img');
    const heroWrapper = document.querySelector('.hero-bg-wrapper');
    const heroHeading = document.querySelector('.hero-heading');
    const heroSubheading = document.querySelector('.hero-subheading');
    const heroOverlay = document.querySelector('.hero-overlay');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (!heroWrapper || !heroImg) return;

    // We'll create a grid of pieces using clip-path on clones of the image
    const rows = 8;
    const cols = 6;
    const pieces = [];

    const src = heroImg.getAttribute('src'); // Get exact relative path to avoid absolute path encoding issues
    
    const pieceContainer = document.createElement('div');
    pieceContainer.className = 'hero-pieces-container';
    Object.assign(pieceContainer.style, {
        position: 'absolute',
        inset: '0',
        zIndex: '1',
        overflow: 'hidden'
    });
    heroWrapper.appendChild(pieceContainer);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const piece = document.createElement('div');
            piece.className = 'hero-piece';
            
            // Calculate clip-path inset percentages: inset(top right bottom left)
            const top = (r / rows) * 100;
            const bottom = 100 - ((r + 1) / rows) * 100;
            const left = (c / cols) * 100;
            const right = 100 - ((c + 1) / cols) * 100;

            Object.assign(piece.style, {
                position: 'absolute',
                inset: '0', 
                backgroundImage: `url("${src}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                clipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
                filter: 'brightness(0.65) contrast(1.05)',
                willChange: 'transform'
            });

            pieceContainer.appendChild(piece);
            pieces.push(piece);
            
            // Initial state for pieces (falling from high above)
            gsap.set(piece, {
                y: -window.innerHeight * 1.5,
                rotation: gsap.utils.random(-15, 15),
                z: gsap.utils.random(-300, 300),
                opacity: 0
            });
        }
    }

    // Timeline for animation
    const tl = gsap.timeline({
        onComplete: () => {
            // Once combined, show the original image and remove pieces to save DOM memory
            gsap.set(heroImg, { opacity: 1 });
            pieceContainer.remove();
        }
    });

    // 1. Pieces fall from above
    tl.to(pieces, {
        y: 0,
        rotation: 0,
        z: 0,
        opacity: 1,
        duration: 2.2,
        ease: "power4.out",
        stagger: {
            amount: 1.2,
            from: "random"
        }
    });

    // 2. Overlay fades in
    tl.to(heroOverlay, {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut"
    }, "-=1.5");

    // 3. Writings come up
    tl.to(heroHeading, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=1.0")
    .to(heroSubheading, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.9");

    // 4. Scroll indicator fades in late
    if (scrollIndicator) {
        tl.to(scrollIndicator, {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out"
        }, "-=0.5");
    }

    // Scroll Parallax on the main image (runs independently on scroll after load)
    gsap.to(heroImg, {
        yPercent: 12, // subtle luxury parallax
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end:   'bottom top',
            scrub: true
        }
    });
}
document.addEventListener("DOMContentLoaded", initHeroAnimation);


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
