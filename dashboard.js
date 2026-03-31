// Dashboard Logic & Animations
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Smooth Scroll (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 1.5,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const loginForm = document.getElementById('login-form');
    const loginWrap = document.getElementById('login-wrap');
    const dashWrap = document.getElementById('dashboard-wrap');

    // Transitions
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Fade out Login Card
        const tl = gsap.timeline();
        
        tl.to('.login-card', {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power4.inOut"
        });

        tl.to(loginWrap, {
            clipPath: "circle(0% at 50% 50%)",
            duration: 1.2,
            ease: "expo.inOut"
        }, "-=0.4");

        // 2. Prepare Dashboard
        tl.set(loginWrap, { display: 'none' });
        tl.set(dashWrap, { display: 'flex', opacity: 0 });

        // 3. Animate Dashboard In
        tl.to(dashWrap, {
            opacity: 1,
            duration: 1,
            onStart: () => {
                // Background subtle movement
                gsap.to('.bg-blur', {
                    scale: 1,
                    duration: 10,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true
                });
            }
        });

        // 4. Staggered Entrance of Components
        tl.from('.sidebar', {
            x: -100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        }, "-=0.5");

        tl.from('.dash-header', {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.8");

        tl.from('.glass-card', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.8");

        // 5. Section Specific Animations
        tl.from('.progress-bar', {
            width: 0,
            duration: 2,
            stagger: 0.1,
            ease: "expo.out"
        }, "-=0.5");

        tl.from('.timeline-event', {
            x: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=1");

        tl.from('.quote-card', {
            x: -30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=1");

        tl.from('.invoice-item', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out"
        }, "-=0.8");
    });

    // Suble Cinematic Background Movement (Slow Pan)
    document.addEventListener('mousemove', (e) => {
        if (dashWrap.style.display === 'flex') {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            gsap.to('.bg-blur', {
                x: xPos,
                y: yPos,
                duration: 2,
                ease: "power2.out"
            });
        }
    });

    // Hover highlights for Quotation Cards
    document.querySelectorAll('.quote-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                borderColor: '#C5A028',
                boxShadow: '0 0 20px rgba(197, 160, 40, 0.2)',
                duration: 0.3
            });
        });
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active-border')) {
                gsap.to(card, {
                    borderColor: 'transparent',
                    boxShadow: 'none',
                    duration: 0.3
                });
            }
        });
    });
});
