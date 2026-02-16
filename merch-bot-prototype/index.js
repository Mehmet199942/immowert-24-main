const puppeteer = require('puppeteer');
const config = require('./config');
const path = require('path');

(async () => {
    // 1. Launch Browser with a persistent user data directory
    // This allows you to log in once manually, and it will remember your session.
    const browser = await puppeteer.launch({
        headless: false, // Run in headful mode to see the browser
        userDataDir: './user_data', // Data will be saved here
        defaultViewport: null,
        args: ['--start-maximized'] // Start maximized
    });

    const page = await browser.newPage();

    // 2. Navigate to Merch by Amazon "Create" page
    console.log('Navigating to Merch by Amazon...');
    await page.goto('https://merch.amazon.com/designs/new', { waitUntil: 'networkidle2' });

    // 3. Check for Login
    // If we are redirected to a login page (url contains 'signin' or similar), wait for user.
    if (page.url().includes('signin') || page.url().includes('ap/signin')) {
        console.log('⚠️  PLEASE LOG IN MANUALLY IN THE BROWSER WINDOW ⚠️');
        console.log('Waiting for you to log in and navigate to the "Create" page...');

        // Wait until we are on the correct page
        await page.waitForFunction("window.location.href.includes('merch.amazon.com/designs/new')", { timeout: 0 });
        console.log('✅ Login detected! Proceeding...');
    }

    // 4. Upload Design
    console.log('Uploading design...');
    const fileInputSelector = 'input[type="file"]';
    await page.waitForSelector(fileInputSelector);
    const inputUpload = await page.$(fileInputSelector);

    // Resolve absolute path
    const filePath = config.imagePath;
    await inputUpload.uploadFile(filePath);

    // Wait for upload processing (this can vary, we might need a better wait condition)
    // For now, let's wait a few seconds. In a real bot, we'd wait for a specific element (like "Upload Complete")
    console.log('Waiting for upload to process (10s)...');
    await new Promise(r => setTimeout(r, 10000));

    // 5. Select Product (Standard T-Shirt)
    // This is tricky as MBA UI changes. We'll try to find the "Select Products" button or ensure Standard T-Shirt is selected.
    // By default, usually "Standard T-Shirt" is the first one. Let's assume we want to click "Edit Details" on the first card if needed.
    // For this simple prototype, we will assume the default selection is often enabled or we just skip this for now to focus on text.

    // 6. Fill Text Fields
    console.log('Filling text fields...');

    // Function to type into a field if it exists
    async function typeToField(selector, text) {
        try {
            await page.waitForSelector(selector, { timeout: 5000 });
            await page.type(selector, text);
            console.log(`Filled ${selector}`);
        } catch (e) {
            console.log(`Could not find or fill ${selector}. Selector might be wrong.`);
        }
    }

    // These selectors are guesses based on standard MBA structure. 
    // They OFTEN change. We need to inspect the page to be sure.
    // Common IDs: #brand, #title, #bullet_point1, #bullet_point2, #description
    // Or sometimes they use input[name="brand"], etc.

    // Let's try to be robust and find by ID first
    await typeToField('#brand', config.brand);
    await typeToField('#title', config.title);
    await typeToField('#bullet_point1', config.bullet1);
    await typeToField('#bullet_point2', config.bullet2);
    await typeToField('#description', config.description);

    // 7. Colors
    // Clicking colors is complex because they are usually buttons or list items.
    // We will skip this for the "Simple Prototype" unless we can inspect the DOM.

    console.log('✅ Automation Complete (Draft Mode)');
    console.log('⚠️  Script stopping here. Review the listing and click Publish manually.');

    // Keep browser open
    // await browser.close(); 
})();
