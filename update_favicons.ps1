$utf8NoBom = New-Object System.Text.UTF8Encoding($False)
$htmlFiles = Get-ChildItem -Path "c:\Users\mehme\Desktop\immowert-24-main-main" -Filter *.html -Recurse

# Full suite of modern favicons
$faviconTags = "`n    <link rel=`"icon`" href=`"/favicon-192.png`" sizes=`"192x192`" type=`"image/png`">`n    <link rel=`"icon`" href=`"/favicon.png`" sizes=`"512x512`" type=`"image/png`">`n    <link rel=`"apple-touch-icon`" href=`"/apple-touch-icon.png`">`n"

foreach ($file in $htmlFiles) {
    # Skip script files or markdown
    if ($file.Name -match "\.(ps1|md)$") { continue }
    
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    $changed = $false
    # Remove our previous injection
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?i)\s*<link[^>]*rel=["'']?(icon|apple-touch-icon)["'']?[^>]*>', '')

    # Inject new tags before </head>
    if ($content -match '(?i)([\t ]*)<\/head>') {
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?i)([\t ]*)<\/head>', "$faviconTags`$1</head>")
        $changed = $true
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        Write-Host "Updated favicons for $($file.Name)"
    }
}
Write-Host "Updating complete!"
