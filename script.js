'use strict';
// ===== Security Utilities =====

/**
 * Escapes HTML special characters to prevent XSS when inserting
 * user-controlled strings into the DOM.
 * Always use this before setting .textContent from user input in
 * contexts where innerHTML might be used elsewhere.
 * @param {string} str
 * @returns {string}
 */
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

/**
 * Sanitises a plain-text string: trims whitespace and enforces max length.
 * @param {string} value
 * @param {number} maxLength
 * @returns {string}
 */
function sanitiseText(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
}

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    // RFC 5322 simplified — good enough for frontend validation
    return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email);
}

/**
 * Validates a German phone number (loose — allows +49, 0, spaces, hyphens).
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
    return /^[\+\d][\d\s\-\/\(\)]{6,20}$/.test(phone.trim());
}

// ===== Submit Rate Limiting =====
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN_MS = 8000; // 8 seconds between submissions

// ===== Global State =====
let currentStep = 1;
const formData = {
    propertyType: '',
    area: '',
    rooms: '',
    year: '',
    zip: ''
};

// ===== Modal Functions =====
function openFunnel() {
    const modal = document.getElementById('funnelModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
}

function closeFunnel() {
    const modal = document.getElementById('funnelModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetFunnel();
}

function resetFunnel() {
    currentStep = 1;
    formData.propertyType = '';
    formData.area = '';
    formData.rooms = '';
    formData.year = '';
    formData.zip = '';
    const form = document.getElementById('leadForm');
    if (form) form.reset();
}

function goToStep(step) {
    document.querySelectorAll('.funnel-step').forEach(function (el) {
        el.classList.add('hidden');
    });
    const stepEl = document.getElementById('step' + step);
    if (stepEl) {
        stepEl.classList.remove('hidden');
        currentStep = step;
    }
}

function selectProperty(type) {
    // Allowlist: only accept known property types
    const allowed = ['Haus', 'Wohnung', 'Grundstück'];
    if (!allowed.includes(type)) return;
    formData.propertyType = type;
    goToStep(2);
}

function validateStep2() {
    const areaRaw = document.getElementById('area').value;
    const roomsRaw = document.getElementById('rooms').value;
    const yearRaw = document.getElementById('year').value;

    // Parse as integers — critical: string comparison was bug in original (e.g. "2" < 1800 was false)
    const area = parseInt(areaRaw, 10);
    const rooms = parseInt(roomsRaw, 10);
    const year = parseInt(yearRaw, 10);

    if (isNaN(area) || isNaN(rooms) || isNaN(year)) {
        alert('Bitte füllen Sie alle Felder mit gültigen Zahlen aus.');
        return;
    }

    if (area < 1 || area > 99999) {
        alert('Bitte geben Sie eine gültige Wohnfläche ein (1 – 99.999 m²).');
        return;
    }

    if (rooms < 1 || rooms > 99) {
        alert('Bitte geben Sie eine gültige Zimmeranzahl ein (1 – 99).');
        return;
    }

    if (year < 1800 || year > 2026) {
        alert('Bitte geben Sie ein gültiges Baujahr ein (1800 – 2026).');
        return;
    }

    formData.area = area;
    formData.rooms = rooms;
    formData.year = year;
    goToStep(3);
}

function validateStep3() {
    const zip = sanitiseText(document.getElementById('zip').value, 10);

    if (!zip || !/^[0-9]{5}$/.test(zip)) {
        alert('Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.');
        return;
    }

    formData.zip = zip;
    goToStep(4);
}

// ===== Form Submission =====
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('leadForm');

    if (form) {
        form.action = 'https://formsubmit.co/mehmet.oezyildirim2@hotmail.com';
        form.method = 'POST';

        form.addEventListener('submit', function (e) {
            // === Rate limiting ===
            const now = Date.now();
            if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
                e.preventDefault();
                alert('Bitte warten Sie einen Moment, bevor Sie erneut senden.');
                return;
            }

            // === Validate contact fields ===
            const firstName = sanitiseText(document.getElementById('firstName').value, 100);
            const lastName = sanitiseText(document.getElementById('lastName').value, 100);
            const email = sanitiseText(document.getElementById('email').value, 254);
            const phone = sanitiseText(document.getElementById('phone').value, 50);

            if (!firstName || firstName.length < 2) {
                e.preventDefault();
                alert('Bitte geben Sie Ihren Vornamen ein (mind. 2 Zeichen).');
                return;
            }

            if (!lastName || lastName.length < 2) {
                e.preventDefault();
                alert('Bitte geben Sie Ihren Nachnamen ein (mind. 2 Zeichen).');
                return;
            }

            if (!isValidEmail(email)) {
                e.preventDefault();
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            if (!isValidPhone(phone)) {
                e.preventDefault();
                alert('Bitte geben Sie eine gültige Telefonnummer ein.');
                return;
            }

            // === Honeypot check — if filled, silently abort (bot detected) ===
            const honeypot = form.querySelector('input[name="_honey"]');
            if (honeypot && honeypot.value.length > 0) {
                e.preventDefault();
                // Silently prevent — bots should not know they were caught
                return;
            }

            // === Populate hidden fields with sanitised data ===
            document.getElementById('hiddenPropertyType').value = escapeHTML(formData.propertyType);
            document.getElementById('hiddenArea').value = parseInt(formData.area, 10) || 0;
            document.getElementById('hiddenRooms').value = parseInt(formData.rooms, 10) || 0;
            document.getElementById('hiddenYear').value = parseInt(formData.year, 10) || 0;
            document.getElementById('hiddenZip').value = escapeHTML(formData.zip);

            // === UI feedback ===
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            const submitLoader = document.getElementById('submitLoader');

            submitBtn.disabled = true;
            if (submitText) submitText.classList.add('hidden');
            if (submitLoader) submitLoader.classList.remove('hidden');

            lastSubmitTime = now;
            // Form submits naturally to FormSubmit.co
        });
    }
});

// ===== Animated Counters =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// Intersection Observer for stats
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.stat-number').forEach(function (stat) {
        observer.observe(stat);
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        // Validate href is a safe anchor selector
        if (!href || !/^#[a-zA-Z0-9_-]+$/.test(href)) return;
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Close modal on outside click =====
window.addEventListener('click', function (event) {
    const modal = document.getElementById('funnelModal');
    if (event.target === modal) {
        closeFunnel();
    }
});

// ===== Escape key to close modal =====
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeFunnel();
    }
});


// ===== Dedicated Funnel Page Logic (bewertung.html) =====
const funnelState = {
    step: 1,
    data: {}
};

function selectFunnelProperty(type) {
    const allowed = ['Haus', 'Wohnung', 'Grundstück', 'Mehrfamilienhaus', 'Gewerbeobjekt'];
    if (!allowed.includes(type)) return;
    const el = document.getElementById('h-type');
    if (el) el.value = type;
    nextStep(2);
}

function nextStep(step) {
    const current = document.querySelector('#f-step' + funnelState.step);
    if (current) current.classList.add('hidden');
    const next = document.querySelector('#f-step' + step);
    if (next) next.classList.remove('hidden');
    funnelState.step = step;
    updateProgress(step);
}

function prevStep(step) {
    const current = document.querySelector('#f-step' + funnelState.step);
    if (current) current.classList.add('hidden');
    const prev = document.querySelector('#f-step' + step);
    if (prev) prev.classList.remove('hidden');
    funnelState.step = step;
    updateProgress(step);
}

function updateProgress(step) {
    const totalSteps = 6;
    const progress = (step / totalSteps) * 100;

    const fill = document.getElementById('progressFill');
    const text = document.getElementById('stepText');
    const label = document.getElementById('stepLabel');

    if (fill) fill.style.width = progress + '%';
    if (text) text.textContent = 'Schritt ' + step + ' von ' + totalSteps;

    const labels = ['Immobilienart', 'Eckdaten', 'Motivation', 'Zeitplan', 'Lage', 'Kontakt'];
    if (label) label.textContent = labels[step - 1] || '';
}

function validateFunnelStep2() {
    const area = parseInt(document.getElementById('f-area').value, 10);
    const rooms = parseInt(document.getElementById('f-rooms').value, 10);
    const year = parseInt(document.getElementById('f-year').value, 10);
    const condition = sanitiseText(document.getElementById('f-condition').value, 100);

    if (isNaN(area) || isNaN(rooms) || isNaN(year) || !condition) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    if (area < 1 || area > 99999) {
        alert('Bitte geben Sie eine gültige Wohnfläche ein.');
        return;
    }

    if (year < 1800 || year > 2026) {
        alert('Bitte geben Sie ein gültiges Baujahr ein.');
        return;
    }

    const hArea = document.getElementById('h-area');
    const hRooms = document.getElementById('h-rooms');
    const hYear = document.getElementById('h-year');
    const hCond = document.getElementById('h-condition');

    if (hArea) hArea.value = area;
    if (hRooms) hRooms.value = rooms;
    if (hYear) hYear.value = year;
    if (hCond) hCond.value = escapeHTML(condition);

    nextStep(3);
}

function validateFunnelStep5() {
    const zip = sanitiseText(document.getElementById('f-zip').value, 10);
    const city = sanitiseText(document.getElementById('f-city') ? document.getElementById('f-city').value : '', 100);
    const street = sanitiseText(document.getElementById('f-street') ? document.getElementById('f-street').value : '', 200);

    if (!zip || !/^[0-9]{5}$/.test(zip)) {
        alert('Bitte geben Sie eine gültige PLZ ein.');
        return;
    }

    const hZip = document.getElementById('h-zip');
    const hCity = document.getElementById('h-city');
    const hStreet = document.getElementById('h-street');

    if (hZip) hZip.value = escapeHTML(zip);
    if (hCity) hCity.value = escapeHTML(city);
    if (hStreet) hStreet.value = escapeHTML(street);

    nextStep(6);
}

// Full Funnel Submission
document.addEventListener('DOMContentLoaded', function () {
    const fullFunnelForm = document.getElementById('fullFunnelForm');

    if (fullFunnelForm) {
        fullFunnelForm.action = 'https://formsubmit.co/mehmet.oezyildirim2@hotmail.com';
        fullFunnelForm.method = 'POST';

        fullFunnelForm.addEventListener('submit', function (e) {
            // Rate limiting
            const now = Date.now();
            if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
                e.preventDefault();
                alert('Bitte warten Sie einen Moment.');
                return;
            }

            // Honeypot check
            const honeypot = fullFunnelForm.querySelector('input[name="_honey"]');
            if (honeypot && honeypot.value.length > 0) {
                e.preventDefault();
                return;
            }

            const btn = document.getElementById('finalSubmitBtn');
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Wird gesendet...';
            }
            lastSubmitTime = now;
        });
    }
});
