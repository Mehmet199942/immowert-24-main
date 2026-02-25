$htmlFiles = Get-ChildItem -Path "c:\Users\mehme\Desktop\immowert-24-main-main" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\email-campaigns\\" }

$gtmHead = @"
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-NLWCD6XS');</script>
    <!-- End Google Tag Manager -->
"@

$gtmBody = @"
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NLWCD6XS"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
"@

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # 1. Remove old gtag setup (both the old AW-652501538 and the new one we just added)
    $content = $content -replace '(?s)<!-- Google tag \(gtag\.js\) -->.*?</script>', ''
    $content = $content -replace '(?s)<!-- Default Consent Mode setup.*?gtag\(''config'', ''AW-6236030037''\);.*?</script>', ''
    
    # 2. Add GTM to <head> if not exists
    if ($content -notmatch 'GTM-NLWCD6XS' -and $content -match '</head>') {
        $content = $content -replace '</head>', "`n$gtmHead`n</head>"
    }
    
    # 3. Add GTM to <body> if not exists (taking into account attributes on body if any)
    if ($content -match '<body[^>]*>' -and $content -notmatch 'ns\.html\?id=GTM-NLWCD6XS') {
        # This regex replaces the first opening body tag it finds with the body tag + the iframe
        $content = [regex]::Replace($content, '<body[^>]*>', {
            param($match)
            $match.Value + "`n    <!-- Google Tag Manager (noscript) -->`n    <noscript><iframe src=`"https://www.googletagmanager.com/ns.html?id=GTM-NLWCD6XS`"`n    height=`"0`" width=`"0`" style=`"display:none;visibility:hidden`"></iframe></noscript>`n    <!-- End Google Tag Manager (noscript) -->"
        }, 1)
    }

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated GTM in $($file.Name)"
}
