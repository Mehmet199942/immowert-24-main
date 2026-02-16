# Mailchimp Setup Guide

Follow these steps to connect your funnel to Mailchimp and set up your email automation.

## 1. Get Your Mailchimp Action URL
This URL allows your funnel to send leads directly to your Mailchimp audience.

1.  Log in to your Mailchimp account.
2.  Go to **Audience** > **Signup forms**.
3.  Select **Embedded forms**.
4.  Click **Continue** (you don't need to design it here).
5.  Look for the code block section (usually labeled "Copy/paste onto your site").
6.  Find the part that looks like `<form action="..."`.
7.  **Copy the URL inside the quotes.** It will look something like this:
    `https://yourname.us20.list-manage.com/subscribe/post?u=...&amp;id=...`
8.  **Paste this URL** into `funnel-script.js` (see step 3 below).

## 2. Configure Audience Fields
Your funnel collects Name, Email, and Phone. You need to make sure Mailchimp is ready to receive them.

1.  Go to **Audience** > **All contacts** > **Settings** > **Audience fields and *|MERGE|* tags**.
2.  Ensure you have the following fields (Tag Name is important):
    *   **Email Address** (Required)
    *   **First Name** -> Tag: `FNAME`
    *   **Phone Number** -> Tag: `PHONE`
3.  Save your changes.

## 3. Connect the Funnel
1.  Open `funnel-script.js` on your computer.
2.  Find the line at the top: `const MAILCHIMP_ACTION_URL = '';`
3.  Paste your Action URL between the quotes.
    *   Example: `const MAILCHIMP_ACTION_URL = 'https://immowert24.us10.list-manage.com/subscribe/post?u=123...';`
4.  Save the file.

## 4. Import Email Templates
I have created 7 HTML email templates for you in the `email-campaigns/` folder.

1.  In Mailchimp, go to **Campaigns** > **Email Templates**.
2.  Click **Create Template** > **Import HTML**.
3.  Upload `email-1-confirmation.html` from the `email-campaigns` folder.
4.  Preview it and Save.
5.  Repeat for all 7 emails.

## 5. Set Up the Automation (Customer Journey)
1.  Go to **Automations** > **Customer Journeys** > **Create Journey**.
2.  **Trigger:** "Sign up" (or "Subscribes to audience").
3.  **Action 1:** Send Email (Select "Email 1 - Confirmation").
4.  **Wait:** 1 Day.
5.  **Action 2:** Send Email (Select "Email 2 - Offer Delivery").
6.  **Wait:** 1 Day.
7.  **Action 3:** Send Email (Select "Email 3 - Education").
8.  ...and so on for all 7 emails.
9.  **Turn On** the journey.

## Checklist
- [ ] Action URL pasted in `funnel-script.js`
- [ ] Audience fields (FNAME, PHONE) configured
- [ ] All 7 templates imported
- [ ] Automation journey active

Reference: [Mailchimp Help: Custom Signup Forms](https://mailchimp.com/help/add-a-signup-form-to-your-website/)
