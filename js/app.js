/* ============================================
   MINDEASE - INTERACTIVE FEATURES & PERFORMANCE
   ============================================
   Features:
   - Smooth scrolling navigation
   - Interactive modal chat system
   - Form validation & submission
   - Number counter animations
   - Mobile responsive hamburger menu
   - Performance optimizations
   ============================================ */

// ============================================
// PERFORMANCE: Debounce Utility
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// PERFORMANCE: Intersection Observer for Lazy Loading
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Animate numbers when section comes into view
            if (entry.target.classList.contains('about-stats')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// ============================================
// DOM ELEMENTS
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const ctaBtn = document.getElementById('ctaBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const chatModal = document.getElementById('chatModal');
const closeBtn = document.querySelector('.close');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const contactForm = document.getElementById('contactForm');
const chatContainer = document.querySelector('.chat-container');

// Botpress shareable URL (embed via iframe)
const BOTPRESS_SHAREABLE_URL = 'https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2026/01/13/04/20260113041415-LRC6BDKT.json';
let _originalChatContainerHTML = null;

// ============================================
// NAVIGATION: Hamburger Menu Toggle
// ============================================

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ============================================
// NAVIGATION: Smooth Scroll Active Link
// ============================================

window.addEventListener('scroll', debounce(() => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}, 100));

// ============================================
// MODAL: Chat System
// ============================================

function openChatModal() {
    console.log('Opening chat modal with URL:', BOTPRESS_SHAREABLE_URL);
    // Open the Botpress chat in a new window
    window.open(BOTPRESS_SHAREABLE_URL, 'MindEaseChat', 'width=500,height=700,resizable=yes,scrollbars=yes');
    
    // Track analytics
    trackEvent('botpress_chat_opened', { timestamp: new Date().toISOString() });
}

function closeChatModal() {
    if (!chatModal) {
        console.error('Chat modal element not found');
        return;
    }
    
    chatModal.style.display = 'none';
    console.log('Chat modal closed');
}

// Modal button events
if (ctaBtn) ctaBtn.addEventListener('click', openChatModal);
if (learnMoreBtn) learnMoreBtn.addEventListener('click', () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
});

if (closeBtn) closeBtn.addEventListener('click', closeChatModal);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === chatModal) {
        closeChatModal();
    }
});

// ============================================
// FEATURE CARDS: Chat Button Integration
// ============================================

function openFeatureChat(chatUrl) {
    console.log('Opening feature chat with URL:', chatUrl);
    // Open the Botpress chat in a new window
    window.open(chatUrl, 'MindEaseChat', 'width=500,height=700,resizable=yes,scrollbars=yes');
    
    trackEvent('feature_chat_opened', { chat_url: chatUrl, timestamp: new Date().toISOString() });
}



// ============================================
// CHAT: AI Response System
// ============================================

const botResponses = [
    "That sounds challenging. I'm here to listen. Can you tell me more about what you're experiencing?",
    "Your feelings are completely valid. Remember that it's okay to feel this way. What would help you right now?",
    "I appreciate you sharing that with me. Taking one small step at a time can make a big difference. What could you do today to care for yourself?",
    "It's wonderful that you're being mindful of your emotions. How are you feeling right now on a scale of 1-10?",
    "Thank you for trusting me with this. You're not alone in feeling this way. Would you like to try a coping technique?",
    "That's really brave of you to open up about this. Remember, healing is not linear - progress isn't always visible but it's always happening.",
    "I hear you. Sometimes just talking about it helps. What support do you think you need most right now?",
    "You're doing great by reaching out. Self-care and emotional support are signs of strength. What's one thing that usually helps you relax?"
];

function getBotResponse() {
    return botResponses[Math.floor(Math.random() * botResponses.length)];
}

function createMessageElement(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const p = document.createElement('p');
    p.textContent = text;
    
    messageDiv.appendChild(p);
    return messageDiv;
}

function addBotResponse() {
    // Simulate typing delay for natural conversation
    setTimeout(() => {
        const response = getBotResponse();
        const messageElement = createMessageElement(response, false);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500 + Math.random() * 500);
}

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    const userMessageElement = createMessageElement(message, true);
    chatMessages.appendChild(userMessageElement);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Track user message
    trackEvent('message_sent', { 
        message_length: message.length,
        timestamp: new Date().toISOString()
    });
    
    // Add bot response
    addBotResponse();
}

// ============================================
// FORMS: Contact Form Validation & Submission
// ============================================

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Track form submission
        trackEvent('contact_form_submitted', {
            name: name,
            email_domain: email.split('@')[1],
            message_length: message.length,
            timestamp: new Date().toISOString()
        });
        
        // Simulate form submission
        submitContactForm(name, email, message);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitContactForm(name, email, message) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 1500);
}

// ============================================
// NOTIFICATIONS: Toast Messages
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-in-out',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    if (type === 'success') {
        Object.assign(notification.style, {
            backgroundColor: '#4ECB71',
            color: 'white'
        });
    } else if (type === 'error') {
        Object.assign(notification.style, {
            backgroundColor: '#FF6B6B',
            color: 'white'
        });
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// ANIMATIONS: Number Counter
// ============================================

function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50; // Animate over 50 frames
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateCount();
    });
}

// Observe stats section
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    observer.observe(statsSection);
}

// ============================================
// PERFORMANCE: Image Lazy Loading
// ============================================

function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// PERFORMANCE: Font Loading Optimization
// ============================================

if ('fonts' in document) {
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
    });
}

// ============================================
// ANALYTICS: Basic Event Tracking
// ============================================

function trackEvent(eventName, eventData = {}) {
    // This is a placeholder for analytics integration
    // In production, this would send data to an analytics service
    const analyticsData = {
        event: eventName,
        data: eventData,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', analyticsData);
    }
    
    // Send to analytics endpoint (commented out for demo)
    // fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(analyticsData)
    // });
}

// ============================================
// ACCESSIBILITY: Screen Reader Support
// ============================================

function setupAccessibility() {
    // Add ARIA labels where needed
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
    
    // Announce page changes to screen readers
    const main = document.querySelector('main') || document.querySelector('body');
    main.setAttribute('role', 'main');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupLazyLoading();
    setupAccessibility();
    
    // Initialize feature chat buttons after DOM load
    const featureChatBtns = document.querySelectorAll('.chat-feature-btn');
    featureChatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const chatUrl = btn.getAttribute('data-chat-url');
            if (chatUrl) {
                openFeatureChat(chatUrl);
            }
        });
    });
    
    // Track page view
    trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer
    });
    
    console.log('MindEase App Initialized ✨');
    console.log('CTA Button:', ctaBtn);
    console.log('Chat Modal:', chatModal);
    console.log('Chat Container:', chatContainer);
});

// ============================================
// PERFORMANCE: Service Worker Registration (Optional)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ============================================
// UTILITY: Smooth Scroll Polyfill
// ============================================

function smoothScroll(target) {
    if (typeof target === 'string') {
        target = document.querySelector(target);
    }
    
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Make available globally for debugging
window.MindEase = {
    openChat: openChatModal,
    closeChat: closeChatModal,
    trackEvent: trackEvent,
    smoothScroll: smoothScroll
};

console.log('MindEase - Available commands: MindEase.openChat(), MindEase.closeChat(), MindEase.trackEvent()');
