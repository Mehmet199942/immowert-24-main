'use strict';

// ===== Security Utilities =====

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

// ===== Modal Controls =====
function startQuiz() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
}

function openFunnel() { startQuiz(); }

function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Step Navigation =====
function goToStep(stepNumber) {
    document.querySelectorAll('.quiz-step').forEach(function (s) { s.classList.remove('active'); });
    const target = document.getElementById('step' + stepNumber);
    if (target) {
        target.classList.add('active');
        currentStep = stepNumber;
        updateProgress();
    }
}

function updateProgress() {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const pct = (currentStep / totalSteps) * 100;
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = 'Schritt ' + currentStep + ' von ' + totalSteps;
}

/**
 * Called from onclick — e must be passed explicitly.
 * HTML: onclick="selectOption('propertyType','Haus',2,event)"
 */
function selectOption(field, value, nextStep, e) {
    const allowlists = {
        propertyType: ALLOWED_PROPERTY_TYPES,
        condition: ALLOWED_CONDITIONS,
        timeline: ALLOWED_TIMELINES
    };
    if (!allowlists[field] || !allowlists[field].includes(value)) return;
    quizData[field] = value;

    if (e && e.currentTarget) {
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(function () { e.currentTarget.style.transform = 'scale(1)'; }, 100);
    }
    setTimeout(function () { goToStep(nextStep); }, 300);
}

// ===== Address Validation =====
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

// ===== Lead Submission (FormSubmit.co only — Mailchimp removed) =====
function submitLead(event) {
    event.preventDefault();

    // Rate limiting
    const now = Date.now();
    if (now - lastFunnelSubmitTime < FUNNEL_SUBMIT_COOLDOWN_MS) {
        alert('Bitte warten Sie einen Moment, bevor Sie erneut senden.');
        return;
    }

    // Honeypot — silent abort
    const form = event.target || document.getElementById('leadForm');
    const honeypot = form ? form.querySelector('input[name="_honey"]') : null;
    if (honeypot && honeypot.value.length > 0) {
        showThankYou();
        return;
    }

    // Validate contact fields
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

    quizData.fullName = fullName;
    quizData.phone = phone;
    quizData.email = email;
    quizData.callTime = callTime;

    const situationCheckboxes = document.querySelectorAll('input[name="situation"]:checked');
    quizData.situation = Array.from(situationCheckboxes).map(function (cb) {
        return sanitiseText(cb.value, 100);
    });

    // UI: loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.classList.add('hidden');
    if (submitLoader) submitLoader.classList.remove('hidden');

    // Populate hidden fields with escaped values
    var setHidden = function (id, val) {
        var el = document.getElementById(id);
        if (el) el.value = escapeHTML(String(val));
    };
    setHidden('hiddenPropertyType', quizData.propertyType);
    setHidden('hiddenCondition', quizData.condition);
    setHidden('hiddenSituation', quizData.situation.join(', '));
    setHidden('hiddenTimeline', quizData.timeline);
    setHidden('hiddenAddress', quizData.street + ', ' + quizData.city + ', ' + quizData.state + ' ' + quizData.zip);

    lastFunnelSubmitTime = now;

    // Submit via FormSubmit.co (form action set in HTML/DOMContentLoaded)
    if (form) {
        // Allow a brief moment for UI update before native submit
        setTimeout(function () { form.submit(); }, 400);
    } else {
        showThankYou();
    }
}

// ===== Thank You Step — textContent only (XSS safe) =====
function showThankYou() {
    var n = document.getElementById('thankYouName');
    var a = document.getElementById('thankYouAddress');
    var p = document.getElementById('thankYouPhone');
    var em = document.getElementById('thankYouEmail');

    if (n) n.textContent = quizData.fullName.split(' ')[0] || 'Kunde';
    if (a) a.textContent = quizData.street + ', ' + quizData.city;
    if (p) p.textContent = quizData.phone || '—';
    if (em) em.textContent = quizData.email;

    goToStep(7);

    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/XXXXXXXXX', value: 1.0, currency: 'EUR' });
    }
    if (typeof fbq !== 'undefined') { fbq('track', 'Lead'); }
}

// ===== Full Funnel Form (bewertung.html) =====
document.addEventListener('DOMContentLoaded', function () {
    var fullFunnelForm = document.getElementById('fullFunnelForm');
    if (fullFunnelForm) {
        fullFunnelForm.action = 'https://formsubmit.co/mehmet.oezyildirim2@hotmail.com';
        fullFunnelForm.method = 'POST';

        fullFunnelForm.addEventListener('submit', function (e) {
            var now = Date.now();
            if (now - lastFunnelSubmitTime < FUNNEL_SUBMIT_COOLDOWN_MS) {
                e.preventDefault();
                alert('Bitte warten Sie einen Moment.');
                return;
            }
            var honeypot = fullFunnelForm.querySelector('input[name="_honey"]');
            if (honeypot && honeypot.value.length > 0) {
                e.preventDefault();
                return;
            }
            var btn = document.getElementById('finalSubmitBtn');
            if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet...'; }
            lastFunnelSubmitTime = now;
        });
    }
});

// ===== Modal: outside click & Escape key =====
document.addEventListener('click', function (event) {
    var modal = document.getElementById('quizModal');
    if (modal && event.target === modal) { closeQuiz(); }
});
document.addEventListener('keydown', function (event) {
    var modal = document.getElementById('quizModal');
    if (modal && modal.classList.contains('active') && event.key === 'Escape') { closeQuiz(); }
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            if (!href || !/^#[a-zA-Z0-9_-]+$/.test(href)) return;
            var target = document.querySelector(href);
            if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', { page_title: document.title, page_path: window.location.pathname });
    }
    if (typeof fbq !== 'undefined') { fbq('track', 'PageView'); }
});
