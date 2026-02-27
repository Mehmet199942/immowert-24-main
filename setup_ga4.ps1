$htmlFiles = Get-ChildItem -Path "c:\Users\mehme\Desktop\immowert-24-main-main" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\email-campaigns\\" }

$ga4Snippet = @"
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-J4M57MW39M"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-J4M57MW39M');
    </script>
"@

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Safely inject right after the opening <head> tag
    if ($content -notmatch 'G-J4M57MW39M') {
        $content = $content -replace '(?i)(<head[^>]*>)', "`$1`n$ga4Snippet"
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Injected GA4 tag into $($file.Name)"
    }
}
