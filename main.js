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
    }, "-=0.9")
    .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.8");

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
