document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Hamburger Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple animation for hamburger icon
        hamburger.classList.toggle('open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open');
        });
    });

    // --- Intersection Observer for Fade-in Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in, .fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // --- Smooth Scroll (Optional enhancement for older browsers or specific behaviors) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // --- Premium Scroll Animation ---
    const canvas = document.getElementById('premium-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 80;
        const currentFrame = index => `./Premium/Premium%20chocolate/Smooth_cinematic_transition_202602082329_oo1_${index.toString().padStart(3, '0')}.jpg`;

        const images = [];
        const preloadImages = () => {
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images.push(img);
            }
        };

        const render = (index) => {
            if (images[index]) {
                const img = images[index];
                if (img.complete) {
                    drawImageProp(context, img);
                } else {
                    img.onload = () => drawImageProp(context, img);
                }
            } else {
                // Fallback
                const tempImg = new Image();
                tempImg.src = currentFrame(index);
                tempImg.onload = () => drawImageProp(context, tempImg);
            }
        };

        // Helper to mimic object-fit: cover
        function drawImageProp(ctx, img) {
            const canvas = ctx.canvas;
            const w = canvas.width;
            const h = canvas.height;
            const ratio = w / h;
            const imgRatio = img.width / img.height;

            let newWidth, newHeight;
            if (imgRatio > ratio) {
                newHeight = h;
                newWidth = imgRatio * h;
            } else {
                newWidth = w;
                newHeight = w / imgRatio;
            }

            const x = (w - newWidth) * 0.5;
            const y = (h - newHeight) * 0.5;

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, x, y, newWidth, newHeight);
        }

        // Set canvas dimensions
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Redraw current frame based on current scroll
            handleScroll();
        };

        const handleScroll = () => {
            const section = document.querySelector('.premium-showcase');
            if (!section) return;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollPos = window.scrollY;

            // Calculate progress
            // Start when section Top hits bottom of viewport?
            // Or when section Top hits top of viewport? 
            // Stickiness is usually when section hits top.
            // But we want to scrub AS we go through the section.

            // The logic: 
            // 0% when section top is at viewport top
            // 100% when section bottom is at viewport bottom (scrolled past)

            const scrollTop = window.scrollY;
            const maxScroll = sectionHeight - windowHeight;
            const startScroll = sectionTop;

            let scrollFraction = (scrollTop - startScroll) / maxScroll;
            if (scrollFraction < 0) scrollFraction = 0;
            if (scrollFraction > 1) scrollFraction = 1;

            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );

            requestAnimationFrame(() => render(frameIndex));
        };

        window.addEventListener('resize', updateCanvasSize);
        window.addEventListener('scroll', handleScroll);

        // Initial setup
        updateCanvasSize();
        preloadImages();
    }

});
