'use strict';

// ===== Security Utilities (duplicated here so this file is self-contained) =====

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function sanitiseText(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
}

function isValidEmail(email) {
    return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
    return /^[\+\d][\d\s\-\/\(\)]{6,20}$/.test(phone.trim());
}

// ===== Submit Rate Limiting =====
let lastFunnelSubmitTime = 0;
const FUNNEL_SUBMIT_COOLDOWN_MS = 8000;

// ===== Funnel Configuration =====
// Mailchimp action URL — set via environment/config, never hardcoded with credentials
const MAILCHIMP_ACTION_URL = ''; // Set this to your Mailchimp form action URL

// ===== Quiz Data Storage =====
const quizData = {
    propertyType: '',
    condition: '',
    situation: [],
    timeline: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    fullName: '',
    phone: '',
    email: '',
    callTime: ''
};

const ALLOWED_PROPERTY_TYPES = ['Haus', 'Wohnung', 'Grundstück', 'Mehrfamilienhaus', 'Gewerbeobjekt'];
const ALLOWED_CONDITIONS = ['Neubau', 'Modernisiert', 'Gepflegt', 'Renovierungsbedarf'];
const ALLOWED_TIMELINES = ['Sofort', '3–6 Monate', '6–12 Monate', 'Noch unklar'];

let currentStep = 1;
const totalSteps = 7;

// Open Quiz Modal
function startQuiz() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
}

// Alias for index.html header compatibility
function openFunnel() {
    startQuiz();
}

// Close Quiz Modal
function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigate to Specific Step
function goToStep(stepNumber) {
    const steps = document.querySelectorAll('.quiz-step');
    steps.forEach(function (step) { step.classList.remove('active'); });

    const targetStep = document.getElementById('step' + stepNumber);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
        updateProgress();
    }
}

// Update Progress Bar
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const percentage = (currentStep / totalSteps) * 100;
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = 'Schritt ' + currentStep + ' von ' + totalSteps;
}

/**
 * Select an option and advance.
 * SECURITY: validate field name and value against allowlists.
 * NOTE: caller must pass the event explicitly — do NOT rely on the implicit
 * global `event` object (deprecated, unreliable in strict mode).
 * HTML usage: onclick="selectOption('propertyType','Haus',2,event)"
 *
 * @param {string} field
 * @param {string} value
 * @param {number} nextStep
 * @param {Event} e
 */
function selectOption(field, value, nextStep, e) {
    const FIELD_ALLOWLIST = {
        propertyType: ALLOWED_PROPERTY_TYPES,
        condition: ALLOWED_CONDITIONS,
        timeline: ALLOWED_TIMELINES
    };

    if (!FIELD_ALLOWLIST[field]) return; // Unknown field
    if (!FIELD_ALLOWLIST[field].includes(value)) return; // Unknown value

    quizData[field] = value;

    if (e && e.currentTarget) {
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(function () {
            e.currentTarget.style.transform = 'scale(1)';
        }, 100);
    }

    setTimeout(function () {
        goToStep(nextStep);
    }, 300);
}

// Validate Address Form
function validateAddress() {
    const street = sanitiseText(document.getElementById('street').value, 200);
    const city = sanitiseText(document.getElementById('city').value, 100);
    const state = sanitiseText(document.getElementById('state').value, 100);
    const zip = sanitiseText(document.getElementById('zip').value, 10);

    if (!street || !city || !state || !zip) {
        alert('Bitte füllen Sie alle Adressfelder aus.');
        return;
    }

    if (!/^[0-9]{5}$/.test(zip)) {
        alert('Bitte geben Sie eine gültige 5-stellige PLZ ein.');
        return;
    }

    quizData.street = street;
    quizData.city = city;
    quizData.state = state;
    quizData.zip = zip;
    goToStep(6);
}

// Submit Lead Form
function submitLead(event) {
    event.preventDefault();

    // === Rate limiting ===
    const now = Date.now();
    if (now - lastFunnelSubmitTime < FUNNEL_SUBMIT_COOLDOWN_MS) {
        alert('Bitte warten Sie einen Moment, bevor Sie erneut senden.');
        return;
    }

    // === Honeypot check ===
    const form = event.target || document.getElementById('leadForm');
    const honeypot = form ? form.querySelector('input[name="_honey"]') : null;
    if (honeypot && honeypot.value.length > 0) {
        // Silently abort — bot detected
        showThankYou(); // Fake success to not tip off bots
        return;
    }

    // === Validate and sanitise contact fields ===
    const fullName = sanitiseText(document.getElementById('fullName').value, 200);
    const phone = sanitiseText(document.getElementById('phone').value, 50);
    const email = sanitiseText(document.getElementById('email').value, 254);
    const callTime = sanitiseText(document.getElementById('callTime') ? document.getElementById('callTime').value : '', 100);

    if (!fullName || fullName.length < 2) {
        alert('Bitte geben Sie Ihren vollständigen Namen ein.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Bitte geben Sie eine gültige Telefonnummer ein.');
        return;
    }

    // Assign validated data
    quizData.fullName = fullName;
    quizData.phone = phone;
    quizData.email = email;
    quizData.callTime = callTime;

    // Get selected situations (checkboxes)
    const situationCheckboxes = document.querySelectorAll('input[name="situation"]:checked');
    quizData.situation = Array.from(situationCheckboxes).map(function (cb) {
        return sanitiseText(cb.value, 100);
    });

    // === UI: Show loading ===
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.classList.add('hidden');
    if (submitLoader) submitLoader.classList.remove('hidden');

    // === Populate hidden fields with safe, escaped values ===
    const setHidden = function (id, val) {
        const el = document.getElementById(id);
        if (el) el.value = escapeHTML(String(val));
    };

    setHidden('hiddenPropertyType', quizData.propertyType);
    setHidden('hiddenCondition', quizData.condition);
    setHidden('hiddenSituation', quizData.situation.join(', '));
    setHidden('hiddenTimeline', quizData.timeline);
    setHidden('hiddenAddress', quizData.street + ', ' + quizData.city + ', ' + quizData.state + ' ' + quizData.zip);

    lastFunnelSubmitTime = now;

    if (MAILCHIMP_ACTION_URL) {
        // Create hidden form for Mailchimp
        const mcForm = document.createElement('form');
        mcForm.action = MAILCHIMP_ACTION_URL;
        mcForm.method = 'POST';
        mcForm.target = '_blank';
        mcForm.style.display = 'none';

        const fields = {
            'EMAIL': quizData.email,
            'FNAME': quizData.fullName,
            'PHONE': quizData.phone,
            'MMERGE3': quizData.propertyType,
            'MMERGE4': quizData.condition,
            'MMERGE5': quizData.timeline,
            'MMERGE6': quizData.street,
            'MMERGE7': quizData.city,
            'MMERGE10': quizData.situation.join(', ')
        };

        Object.entries(fields).forEach(function (entry) {
            if (entry[1]) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = entry[0];
                // Safe: these go into a server POST body, not the DOM
                input.value = entry[1];
                mcForm.appendChild(input);
            }
        });

        document.body.appendChild(mcForm);
        mcForm.submit();

        setTimeout(function () {
            if (submitBtn) submitBtn.disabled = false;
            if (submitText) submitText.classList.remove('hidden');
            if (submitLoader) submitLoader.classList.add('hidden');
            showThankYou();
        }, 1000);

    } else {
        // Fallback demo — replace with your submission endpoint in production
        setTimeout(function () {
            if (submitBtn) submitBtn.disabled = false;
            if (submitText) submitText.classList.remove('hidden');
            if (submitLoader) submitLoader.classList.add('hidden');
            showThankYou();
        }, 1500);
    }
}

// Show Thank You Step — use textContent (NOT innerHTML) to avoid XSS
function showThankYou() {
    const nameEl = document.getElementById('thankYouName');
    const addrEl = document.getElementById('thankYouAddress');
    const phoneEl = document.getElementById('thankYouPhone');
    const emailEl = document.getElementById('thankYouEmail');

    // Safe: .textContent never interprets HTML
    if (nameEl) nameEl.textContent = quizData.fullName.split(' ')[0] || 'Kunde';
    if (addrEl) addrEl.textContent = quizData.street + ', ' + quizData.city;
    if (phoneEl) phoneEl.textContent = '0123 456 789';
    if (emailEl) emailEl.textContent = quizData.email;

    goToStep(7);

    // Conversion tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            send_to: 'AW-XXXXXXXXX/XXXXXXXXX',
            value: 1.0,
            currency: 'EUR'
        });
    }

    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    const modal = document.getElementById('quizModal');
    if (modal && event.target === modal) {
        closeQuiz();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function (event) {
    const modal = document.getElementById('quizModal');
    if (modal && modal.classList.contains('active') && event.key === 'Escape') {
        closeQuiz();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for anchor links — with safe selector validation
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || !/^#[a-zA-Z0-9_-]+$/.test(href)) return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Analytics
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_path: window.location.pathname
        });
    }

    if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
    }
});
