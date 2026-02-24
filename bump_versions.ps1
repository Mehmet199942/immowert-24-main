# Bump CSS and JS asset versions

Get-ChildItem -Path "c:\Users\mehme\Desktop\immowert-24-main-main" -Filter "*.html" -File | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    
    # Replace landing.css or landing.css?v=... with landing.css?v=3
    $content = $content -replace 'landing\.css(\?v=\d+)?', 'landing.css?v=3'
    
    # Replace styles.css or styles.css?v=... with styles.css?v=2
    $content = $content -replace 'styles\.css(\?v=\d+)?', 'styles.css?v=2'
    
    # Replace script.js or script.js?v=... with script.js?v=6
    $content = $content -replace 'script\.js(\?v=\d+)?', 'script.js?v=6'
    
    [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "Cache busting versions updated."
