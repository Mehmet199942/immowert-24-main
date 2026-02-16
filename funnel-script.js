// Funnel Configuration
// PASTE YOUR MAILCHIMP ACTION URL HERE
const MAILCHIMP_ACTION_URL = ''; // e.g. 'https://immowert24.us10.list-manage.com/subscribe/post?u=...'

// Quiz Funnel Data Storage
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

let currentStep = 1;
const totalSteps = 7;

// Open Quiz Modal
function startQuiz() {
    const modal = document.getElementById('quizModal');
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
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate to Specific Step
function goToStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.quiz-step');
    steps.forEach(step => step.classList.remove('active'));

    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
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
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Question ${currentStep} of ${totalSteps}`;
}

// Select Option and Move to Next Step
function selectOption(field, value, nextStep) {
    quizData[field] = value;

    // Add selection animation
    event.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.target.style.transform = 'scale(1)';
    }, 100);

    // Move to next step after short delay
    setTimeout(() => {
        goToStep(nextStep);
    }, 300);
}

// Validate Address Form
function validateAddress() {
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;

    if (street && city && state && zip) {
        quizData.street = street;
        quizData.city = city;
        quizData.state = state;
        quizData.zip = zip;
        goToStep(6);
    }
}

// Submit Lead Form
function submitLead(event) {
    event.preventDefault();

    // Get form values
    quizData.fullName = document.getElementById('fullName').value;
    quizData.phone = document.getElementById('phone').value;
    quizData.email = document.getElementById('email').value;
    quizData.callTime = document.getElementById('callTime').value;

    // Get selected situations
    const situationCheckboxes = document.querySelectorAll('input[name="situation"]:checked');
    quizData.situation = Array.from(situationCheckboxes).map(cb => cb.value);

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');

    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    submitLoader.classList.remove('hidden');

    // Populate hidden fields (optional, for other integrations)
    document.getElementById('hiddenPropertyType').value = quizData.propertyType;
    document.getElementById('hiddenCondition').value = quizData.condition;
    document.getElementById('hiddenSituation').value = quizData.situation.join(', ');
    document.getElementById('hiddenTimeline').value = quizData.timeline;
    document.getElementById('hiddenAddress').value = `${quizData.street}, ${quizData.city}, ${quizData.state} ${quizData.zip}`;

    // Mailchimp Integration Logic
    if (MAILCHIMP_ACTION_URL) {
        // Create hidden form for Mailchimp
        const mcForm = document.createElement('form');
        mcForm.action = MAILCHIMP_ACTION_URL;
        mcForm.method = 'POST';
        mcForm.target = '_blank'; // Open in new tab to avoid redirect issues
        mcForm.style.display = 'none';

        // Map fields to Mailchimp expected names
        // Adjust these MMERGE tags based on your specific Mailchimp audience settings
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

        for (const [key, value] of Object.entries(fields)) {
            if (value) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                mcForm.appendChild(input);
            }
        }

        document.body.appendChild(mcForm);
        mcForm.submit();

        // Simulate local success since Mailchimp opens in new tab
        setTimeout(() => {
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            submitLoader.classList.add('hidden');
            showThankYou();
        }, 1000);

    } else {
        // Fallback: Default FormSubmit or Demo settings
        console.log('Mailchimp not configured. Using default behavior.');

        // Simulate API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            submitLoader.classList.add('hidden');

            showThankYou();

            // Optional: Submit to other service
            // const form = document.getElementById('leadForm');
            // form.submit();
        }, 1500);
    }
}

// Show Thank You Page
function showThankYou() {
    // Populate thank you page with user data
    document.getElementById('thankYouName').textContent = quizData.fullName.split(' ')[0];
    document.getElementById('thankYouAddress').textContent = `${quizData.street}, ${quizData.city}`;

    // Default placeholders if not set
    document.getElementById('thankYouPhone').textContent = "0123 456 789";
    document.getElementById('thankYouEmail').textContent = quizData.email;

    // Go to thank you step
    goToStep(7);

    // Track conversions
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-XXXXXXXXX/XXXXXXXXX',
            'value': 1.0,
            'currency': 'USD'
        });
    }

    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    const modal = document.getElementById('quizModal');
    if (event.target === modal) {
        closeQuiz();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function (event) {
    const modal = document.getElementById('quizModal');
    if (modal.classList.contains('active') && event.key === 'Escape') {
        closeQuiz();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            'page_title': 'Cash Offer Funnel',
            'page_path': window.location.pathname
        });
    }

    // Facebook Pixel PageView
    if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView');
    }
});
