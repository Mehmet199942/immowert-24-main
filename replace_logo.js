const fs = require('fs');
const path = require('path');

const directory = 'c:\\Users\\mehme\\Desktop\\immowert-24-main-main';

const headerPattern = /<a href="index\.html" class="logo">\s*Dr\. Schwarz <span class="accent">Immobilien<\/span>\s*<\/a>/gm;
const headerReplacement = `<a href="index.html" class="logo">
                <img src="logo.png" alt="Dr. Schwarz Immobilien" class="logo-img" width="200" height="76" loading="eager">
            </a>`;

const headerPattern2 = /<a href="index\.html" class="logo">\s*Dr\. Schwarz <span class=\\"accent\\">Immobilien<\/span>\s*<\/a>/gm;

const footerPattern = /<div class="footer-logo">Dr\. Schwarz <span class="accent">Immobilien<\/span><\/div>/gm;
const footerReplacement = '<div class="footer-logo"><img src="logo.png" alt="Dr. Schwarz Immobilien" class="footer-logo-img" width="80" height="32" loading="lazy"></div>';

const footerPattern2 = /<div class="footer-logo">Dr\. Schwarz <span class=\\"accent\\">Immobilien<\/span><\/div>/gm;

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(headerPattern, headerReplacement)
            .replace(headerPattern2, headerReplacement)
            .replace(footerPattern, footerReplacement)
            .replace(footerPattern2, footerReplacement);

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});
