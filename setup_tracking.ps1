$htmlFiles = Get-ChildItem -Path "c:\Users\mehme\Desktop\immowert-24-main-main" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\email-campaigns\\" }

$newScript = @"
    <!-- Google tag (gtag.js) -->
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        // Default Consent Mode setup (GDPR compliant base)
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
        });
    </script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX'); // GA4 ID Placeholder
        gtag('config', 'AW-6236030037'); // New Google Ads ID
    </script>
"@

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Try replacing the existing block
    if ($content -match '<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\(''config'', ''AW-652501538''\);\s*</script>') {
        $content = $content -replace '(?s)<!-- Google tag \(gtag\.js\) -->.*?gtag\(''config'', ''AW-652501538''\);\s*</script>', $newScript
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated tracking in $($file.Name)"
    } else {
        # Insert before </head> if missing
        if ($content -notmatch 'G-XXXXXXXXXX' -and $content -match '</head>') {
            $content = $content -replace '</head>', "`n$newScript`n</head>"
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Injected tracking in $($file.Name)"
        }
    }
}
