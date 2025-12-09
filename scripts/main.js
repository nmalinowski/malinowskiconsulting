// Portfolio data
const portfolioData = [
    {
        title: 'Malinowski Consulting',
        image: '/images/malinowskiconsulting-thumb.png',
        description: 'Designed and crafted our very own site, check it out! Modern, responsive design with space-themed aesthetics and smooth animations.',
        client: 'Malinowski Consulting, LLC',
        date: 'December 2025',
        service: 'Web Development',
        link: 'https://www.malinowskiconsulting.com'
    },
    {
        title: 'Fortitude Supply, LLC',
        image: '/images/fortitude-thumb.png',
        description: 'Full-featured tactical gear e-commerce platform with inventory management, secure checkout, and customer portal.',
        client: 'Fortitude Supply, LLC',
        date: 'September 2025',
        service: 'eCommerce Solutions',
        link: 'https://www.fortitudesupply.com'
    },
    {
        title: 'QuikTriage AI',
        image: '/images/quiktriage-thumb.png',
        description: 'AI-powered symptom checker and medical triage chatbot helping users assess their health concerns with intelligent conversational interfaces.',
        client: 'Healthcare Startup',
        date: 'October 2024',
        service: 'Custom AI Solutions',
        link: 'https://www.quiktriage.com'
    },
    {
        title: 'SE Masonry Repair',
        image: '/images/semasonryrepair-thumb.png',
        description: 'Complete website redesign with modern UI, service showcase, before/after galleries, and lead generation forms.',
        client: 'SE Masonry Repair',
        date: 'January 2025',
        service: 'Web Development & SEO',
        link: 'https://semasonryrepair.com'
    },
    {
        title: 'EGO Canna',
        image: '/images/egocanna-thumb.png',
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

// Generate stars
const heroBg = document.getElementById('heroBg');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    heroBg.appendChild(star);
}

// Generate planets
const planets = [
    { size: 100, color: 'rgba(76, 154, 255, 0.2)', x: '10%', y: '20%' },
    { size: 60, color: 'rgba(124, 58, 237, 0.15)', x: '85%', y: '70%' },
    { size: 80, color: 'rgba(6, 182, 212, 0.18)', x: '75%', y: '15%' }
];

planets.forEach(planet => {
    const el = document.createElement('div');
    el.className = 'planet';
    el.style.width = planet.size + 'px';
    el.style.height = planet.size + 'px';
    el.style.background = planet.color;
    el.style.left = planet.x;
    el.style.top = planet.y;
    heroBg.appendChild(el);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Rocket animation
const rocket = document.getElementById('rocket');
let rocketLaunched = false;

const launchRocket = () => {
    if (!rocketLaunched) {
        rocket.classList.add('launched');
        rocketLaunched = true;
        setTimeout(() => {
            rocket.style.display = 'none';
        }, 3000);
    }
};

const servicesSection = document.getElementById('services');
const servicesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            launchRocket();
        }
    });
}, { threshold: 0.3 });

servicesObserver.observe(servicesSection);

// Scroll animations
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

// Portfolio Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');
const lightboxClient = document.getElementById('lightboxClient');
const lightboxDate = document.getElementById('lightboxDate');
const lightboxService = document.getElementById('lightboxService');
const lightboxLink = document.getElementById('lightboxLink');

// Open lightbox
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
        const index = parseInt(item.dataset.portfolio);
        const project = portfolioData[index];

        lightboxImage.src = project.image;
        lightboxImage.alt = project.title;
        lightboxTitle.textContent = project.title;
        lightboxDescription.textContent = project.description;
        lightboxClient.textContent = project.client;
        lightboxDate.textContent = project.date;
        lightboxService.textContent = project.service;
        lightboxLink.href = project.link;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
});

// Close on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        } else {
            alert('Oops! There was a problem sending your message.');
        }
    } catch (error) {
        alert('Oops! There was a problem sending your message.');
    }
});