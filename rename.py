import os
import glob
import re

directories = ["/Users/mehmetozyildirim/Desktop/immowert-24-main"]

replacements = [
    (r"ImmoWERT<span class=\"accent\">24</span>", r"Dr. Schwarz <span class=\"accent\">Immobilien</span>"),
    (r"ImmoWERT<span>24</span>", r"Dr. Schwarz <span>Immobilien</span>"),
    (r"ImmoWERT<span style=\"color: #2563eb;\">24</span>", r"Dr. Schwarz <span style=\"color: #2563eb;\">Immobilien</span>"),
    (r"ImmoWERT24", r"Dr. Schwarz Immobilien"),
    (r"Immowert24", r"Dr. Schwarz Immobilien")
]

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for old, new in replacements:
        # Regex replacement to catch exact matches but avoid emails/urls if needed (but the simple string match is fine since emails are usually lowercase like immowert24)
        new_content = re.sub(old, new, new_content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

for directory in directories:
    for ext in ['*.html', '*.md', '*.js']:
        for file_path in glob.glob(os.path.join(directory, '**', ext), recursive=True):
            process_file(file_path)

print("Done")
