$headerPattern = '<a href="index\.html" class="logo">\s*Dr\. Schwarz <span class="accent">Immobilien</span>\s*</a>'
$headerPattern2 = '<a href="index\.html" class="logo">\s*Dr\. Schwarz <span class=\\"accent\\">Immobilien</span>\s*</a>'
$headerReplacement = '<a href="index.html" class="logo">
                <img src="logo.png" alt="Dr. Schwarz Immobilien" class="logo-img" width="200" height="76" loading="eager">
            </a>'

$footerPattern = '<div class="footer-logo">Dr\. Schwarz <span class="accent">Immobilien</span></div>'
$footerPattern2 = '<div class="footer-logo">Dr\. Schwarz <span class=\\"accent\\">Immobilien</span></div>'
$footerReplacement = '<div class="footer-logo"><img src="logo.png" alt="Dr. Schwarz Immobilien" class="footer-logo-img" width="80" height="32" loading="lazy"></div>'

Get-ChildItem -Path "c:\Users\mehme\Desktop\immowert-24-main-main" -Filter "*.html" -File | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    $newContent = $content -replace $headerPattern, $headerReplacement
    $newContent = $newContent -replace $headerPattern2, $headerReplacement
    $newContent = $newContent -replace $footerPattern, $footerReplacement
    $newContent = $newContent -replace $footerPattern2, $footerReplacement
    
    if ($content -ne $newContent) {
        [System.IO.File]::WriteAllText($_.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($_.Name)"
    }
}
