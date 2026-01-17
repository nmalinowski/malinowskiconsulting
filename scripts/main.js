// Portfolio data
const portfolioData = [
    {
        title: 'Malinowski Consulting',
        image: 'images/malinowskiconsulting-thumb.png',
        description: 'Designed and crafted our very own site, check it out! Modern, responsive design with space-themed aesthetics and smooth animations.',
        client: 'Malinowski Consulting, LLC',
        date: 'December 2025',
        service: 'Web Development',
        link: 'https://www.malinowskiconsulting.com'
    },
    {
        title: 'QuikTriage AI',
        image: 'images/quiktriage-thumb.png',
        description: 'AI-powered symptom checker and medical triage chatbot helping users assess their health concerns with intelligent conversational interfaces.',
        client: 'Healthcare Startup',
        date: 'October 2024',
        service: 'Custom AI Solutions',
        link: 'https://www.quiktriage.com'
    },
    {
        title: 'SE Masonry Repair',
        image: 'images/semasonryrepair-thumb.png',
        description: 'Complete website redesign with modern UI, service showcase, before/after galleries, and lead generation forms.',
        client: 'SE Masonry Repair',
        date: 'January 2025',
        service: 'Web Development & SEO',
        link: 'https://semasonryrepair.com'
    },
    {
        title: 'EGO Canna',
        image: 'images/egocanna-thumb.png',
        description: 'Full-featured e-commerce platform with age verification, product catalog, inventory management, and optimized checkout experience.',
        client: 'EGO Canna',
        date: 'February 2022',
        service: 'eCommerce Solutions',
        link: '#'
    }
];

// Team member data
const teamData = [
    {
        name: 'Nathan Malinowski',
        role: 'Lead Technical Consultant/Lead Developer',
        image: 'images/nathan-malinowski.jpeg',
        bio: 'Nathan Malinowski is a HealthTech engineering leader and entrepreneur who manages software development teams building AI‑enabled radiology workflow and imaging platforms used by thousands of radiologists across the U.S. His background spans full‑stack engineering in .NET, Go, Node.js, and cloud‑native architectures, plus earlier experience in cardiology PACS/VNA support, giving him deep expertise in DICOM, HL7, and regulated healthcare environments. He also runs an AI consulting practice for SMBs and co‑founded a direct‑to‑consumer supplement brand, combining technical leadership with product, compliance, and P&L ownership experience.',
        linkedin: 'https://www.linkedin.com/in/nathanielmalinowski/'
    },
    {
        name: 'Alexis Malinowski',
        role: 'Lead Creative Consultant/Graphic Artist',
        image: 'images/alexis-malinowski.jpeg',
        bio: 'Alexis Malinowski is an ISTQB‑certified Software QA Engineer with a BS in Software Development, focused on manual testing, test case design, and defect tracking, and aiming to grow further into automation and agile testing practices. She previously spent nearly a decade as a Training Resource Coordinator, where she scheduled instructors, maintained corporate and client websites, supported customers, and managed learning platforms and SharePoint, building strong organizational, communication, and technical support skills. Earlier administrative roles reinforced her strengths in documentation, coordination, and attention to detail.',
        linkedin: 'https://www.linkedin.com/in/alexismalinowski/'
    },
    {
        name: 'Joe Tabora',
        role: 'Lead Marketing Consultant/Developer',
        image: 'images/joe-tabora.png',
        bio: 'Joe Tabora is a customer success and growth leader with over fifteen years at the intersection of technology, marketing, and client relations, progressing from web development into senior roles driving client engagement and revenue. As Chief Marketing Officer at Vance Global, he led brand and client strategies that increased annual revenue, repeat orders, and partner engagement through targeted programs. Prior roles as Sales Director and President in consumer brands saw him launch and scale national products, build large B2B account bases, and consistently grow revenue through structured partnerships and retention initiatives, grounded in a foundation of earlier web development leadership.',
        linkedin: 'https://www.linkedin.com/in/joseph-tabora-a3594525/'
    }
];

// Use requestIdleCallback for non-critical initialization
const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

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

function init() {
    // Critical: Navigation and header (runs immediately)
    initNavigation();
    initHeader();
    
    // Schedule non-critical tasks
    scheduleTask(() => initHeroBackground());
    scheduleTask(() => initScrollAnimations());
    scheduleTask(() => initRocket());
    scheduleTask(() => initLightbox());
    scheduleTask(() => initForm());
}

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        
        // Close mobile menu on link click
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') navMenu.classList.remove('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function initHeroBackground() {
    const heroBg = document.getElementById('heroBg');
    if (!heroBg) return;
    
    // Create stars in batches to avoid long task
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;
        fragment.appendChild(star);
    }
    
    // Add planets
    const planets = [
        { size: 100, color: 'rgba(76,154,255,0.2)', x: '10%', y: '20%' },
        { size: 60, color: 'rgba(124,58,237,0.15)', x: '85%', y: '70%' },
        { size: 80, color: 'rgba(6,182,212,0.18)', x: '75%', y: '15%' }
    ];
    
    planets.forEach(p => {
        const el = document.createElement('div');
        el.className = 'planet';
        el.style.cssText = `width:${p.size}px;height:${p.size}px;background:${p.color};left:${p.x};top:${p.y}`;
        fragment.appendChild(el);
    });
    
    heroBg.appendChild(fragment);
}

function initRocket() {
    const rocket = document.getElementById('rocket');
    const servicesSection = document.getElementById('services');
    if (!rocket || !servicesSection) return;
    
    let launched = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !launched) {
            launched = true;
            rocket.classList.add('launched');
            setTimeout(() => rocket.style.display = 'none', 3000);
            observer.disconnect();
        }
    }, { threshold: 0.3 });
    
    observer.observe(servicesSection);
}

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const elements = {
        image: document.getElementById('lightboxImage'),
        title: document.getElementById('lightboxTitle'),
        description: document.getElementById('lightboxDescription'),
        client: document.getElementById('lightboxClient'),
        date: document.getElementById('lightboxDate'),
        service: document.getElementById('lightboxService'),
        link: document.getElementById('lightboxLink'),
        meta: document.querySelector('.lightbox-meta'),
        close: document.getElementById('lightboxClose')
    };
    
    const openLightbox = (data, isTeam = false) => {
        elements.image.src = data.image;
        elements.image.alt = data.title || data.name;
        elements.title.textContent = isTeam ? `${data.name} - ${data.role}` : data.title;
        elements.description.textContent = isTeam ? data.bio : data.description;
        elements.meta.style.display = isTeam ? 'none' : 'grid';
        
        if (!isTeam) {
            elements.client.textContent = data.client;
            elements.date.textContent = data.date;
            elements.service.textContent = data.service;
        }
        
        elements.link.href = isTeam ? data.linkedin : data.link;
        elements.link.textContent = isTeam ? 'Connect on LinkedIn' : 'View Project →';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const data = portfolioData[parseInt(item.dataset.portfolio)];
            if (data) openLightbox(data);
        });
    });
    
    // Team cards
    document.querySelectorAll('.team-card').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.linkedin-icon')) return;
            const data = teamData[parseInt(item.dataset.member)];
            if (data) openLightbox(data, true);
        });
    });
    
    // Close handlers
    elements.close?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

function initForm() {
    const form = document.getElementById('form');
    if (!form) return;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const fields = {
        name: { el: form.querySelector('#name'), error: form.querySelector('#name-error') },
        email: { el: form.querySelector('#email'), error: form.querySelector('#email-error') },
        message: { el: form.querySelector('#message'), error: form.querySelector('#message-error') }
    };
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validation functions
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            if (value.trim().length > 100) return 'Name must be less than 100 characters';
            return '';
        },
        email: (value) => {
            if (!value.trim()) return 'Email is required';
            if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
            return '';
        },
        message: (value) => {
            if (!value.trim()) return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            if (value.trim().length > 5000) return 'Message must be less than 5000 characters';
            return '';
        }
    };
    
    // Show/hide error
    const setError = (field, message) => {
        const { el, error } = fields[field];
        if (message) {
            el.classList.add('invalid');
            el.classList.remove('valid');
            if (error) error.textContent = message;
        } else {
            el.classList.remove('invalid');
            el.classList.add('valid');
            if (error) error.textContent = '';
        }
    };
    
    // Validate single field
    const validateField = (field) => {
        const value = fields[field].el.value;
        const error = validators[field](value);
        setError(field, error);
        return !error;
    };
    
    // Validate all fields
    const validateForm = () => {
        let isValid = true;
        Object.keys(fields).forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        return isValid;
    };
    
    // Real-time validation on blur
    Object.keys(fields).forEach(field => {
        fields[field].el.addEventListener('blur', () => validateField(field));
        fields[field].el.addEventListener('input', () => {
            // Clear error on input if field was invalid
            if (fields[field].el.classList.contains('invalid')) {
                validateField(field);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        if (!validateForm()) {
            // Focus first invalid field
            const firstInvalid = form.querySelector('.invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        
        // Validate hCaptcha - check for response in either textarea or input
        const hCaptchaResponse = form.querySelector('[name="h-captcha-response"]');
        if (!hCaptchaResponse || !hCaptchaResponse.value) {
            alert('Please complete the captcha.');
            return;
        }
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Convert FormData to JSON as per Web3Forms docs
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        
        // Ensure access_key is a string (not array)
        if (Array.isArray(object.access_key)) {
            object.access_key = object.access_key[0];
        }
        
        const json = JSON.stringify(object);
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            const data = await response.json();
            
            if (response.status === 200) {
                alert('Success! Your message has been sent.');
                form.reset();
                // Clear validation states
                Object.keys(fields).forEach(field => {
                    fields[field].el.classList.remove('valid', 'invalid');
                    if (fields[field].error) fields[field].error.textContent = '';
                });
                // Reset hCaptcha if present
                if (typeof hcaptcha !== 'undefined') {
                    hcaptcha.reset();
                }
            } else {
                alert('Error: ' + (data.message || 'Something went wrong. Please try again.'));
            }
        } catch (error) {
            console.log(error);
            alert('Something went wrong. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
