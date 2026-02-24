import os
import re

def main():
    directory = r"c:\Users\mehme\Desktop\immowert-24-main-main"
    
    header_pattern = re.compile(
        r'<a href="index\.html" class="logo">\s*Dr\. Schwarz <span class="accent">Immobilien</span>\s*</a>',
        re.MULTILINE
    )
    
    header_replacement = '''<a href="index.html" class="logo">
                <img src="logo.png" alt="Dr. Schwarz Immobilien" class="logo-img" width="200" height="76" loading="eager">
            </a>'''
            
    footer_pattern = re.compile(
        r'<div class="footer-logo">\s*Dr\. Schwarz <span class="accent">Immobilien</span>\s*</div>',
        re.MULTILINE
    )
    
    footer_replacement = '<div class="footer-logo"><img src="logo.png" alt="Dr. Schwarz Immobilien" class="footer-logo-img" width="80" height="32" loading="lazy"></div>'
    
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = header_pattern.sub(header_replacement, content)
            new_content = footer_pattern.sub(footer_replacement, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")

if __name__ == "__main__":
    main()
