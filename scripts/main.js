// Team member data
const teamData = [
    {
        name: 'Nathan Malinowski',
        role: 'Principal, Strategy and AI Advisory',
        image: 'images/nathan-malinowski.webp',
        bio: 'Nathan Malinowski is a HealthTech engineering leader and entrepreneur who manages software development teams building AI‑enabled radiology workflow and imaging platforms used by thousands of radiologists across the U.S. His background spans full‑stack engineering in .NET, Go, Node.js, and cloud‑native architectures, plus earlier experience in cardiology PACS/VNA support, giving him deep expertise in DICOM, HL7, and regulated healthcare environments. He also runs an AI consulting practice for SMBs and co‑founded a direct‑to‑consumer supplement brand, combining technical leadership with product, compliance, and P&L ownership experience.',
        linkedin: 'https://www.linkedin.com/in/nathanielmalinowski/',
        github: [
            'https://github.com/nmalinowski',
            'https://github.com/nathan-malinowski'
        ]
    },
    {
        name: 'Alexis Malinowski',
        role: 'Principal, Conversion & Regulatory Risk Advisory',
        image: 'images/alexis-malinowski.webp',
        bio: 'Alexis Malinowski is an ISTQB‑certified Software QA Engineer with a BS in Software Development, focused on manual testing, test case design, and defect tracking, and aiming to grow further into automation and agile testing practices. She previously spent nearly a decade as a Training Resource Coordinator, where she scheduled instructors, maintained corporate and client websites, supported customers, and managed learning platforms and SharePoint, building strong organizational, communication, and technical support skills. Earlier administrative roles reinforced her strengths in documentation, coordination, and attention to detail.',
        linkedin: 'https://www.linkedin.com/in/alexismalinowski/'
    }
];

// Use requestIdleCallback for non-critical initialization
const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

// Handle bfcache restoration
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from bfcache
        const form = document.getElementById('form');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
    
    // Only initialize neural background if user has NOT requested reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initNeuralBackground();
    }
    
    initTextCycler();
    initSpotlightCards();
});

// Spotlight Effect
function initSpotlightCards() {
    const cards = document.querySelectorAll('[data-spotlight]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Navigation Toggle
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const floatingNav = document.querySelector('.floating-nav');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && floatingNav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = floatingNav.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (floatingNav.classList.contains('active') && !floatingNav.contains(e.target)) {
                floatingNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close when clicking a link
        if (navMenu) {
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    floatingNav.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
        
        // Accessibility: Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && floatingNav.classList.contains('active')) {
                floatingNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus(); // Return focus to toggle
            }
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (floatingNav && floatingNav.classList.contains('active')) {
                floatingNav.classList.remove('active');
                if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize scroll-based nav transformation
    initScrollNav();
}

function initScrollNav() {
    const navBar = document.querySelector('.nav-bar');
    const floatingNav = document.querySelector('.floating-nav');
    
    if (!navBar || !floatingNav) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Nav bar is out of view -> Show floating hamburger
                floatingNav.classList.add('scrolled');
            } else {
                // Nav bar is visible -> Hide floating hamburger
                floatingNav.classList.remove('scrolled');
            }
        });
    }, {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px 0px 0px"
    });

    observer.observe(navBar);
}

// Scroll Animations (Intersection Observer)
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// Neural Network Canvas Background
function initNeuralBackground() {
    const canvas = document.getElementById('neural-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Configuration
    const particleCount = window.innerWidth < 768 ? 40 : 80; // Responsive particle count
    const connectionDistance = 150;
    const speed = 0.5;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * speed;
            this.vy = (Math.random() - 0.5) * speed;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Use getComputedStyle to respect dark/light mode
            const style = getComputedStyle(document.body);
            ctx.fillStyle = style.getPropertyValue('--primary') || 'rgba(16, 185, 129, 0.5)';
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    const style = getComputedStyle(document.body);
                    const primary = style.getPropertyValue('--primary') || '#10b981';
                    
                    // Convert hex to rgb for opacity handling if needed, or just use simple opacity
                    ctx.strokeStyle = primary; 
                    ctx.globalAlpha = 1 - distance / connectionDistance;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        particles = [];
        init();
    });

    // Handle theme switches
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        resize();
        particles = [];
        init();
    });

    init();
    animate();
}

// Text Cycling Animation
function initTextCycler() {
    const textElement = document.getElementById('cycling-text');
    if (!textElement) return;

    const phrases = [
        "Healthcare",
        "Finance",
        "Pharma",
        "Biotech",
        "Insurance",
        "Legal",
        "Government",
        "Retail",
        "Manufacturing",
        "Education",
        "Energy",
        "Transportation"
    ];
    
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true; // Start in deleting mode since text is already there
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 100; // Deleting speed
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150; // Typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start after initial delay
    setTimeout(type, 3000);
}
