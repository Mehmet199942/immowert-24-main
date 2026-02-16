$template = @"
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__TITLE__ - ImmoWERT24</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <header class="header">
        <div class="container header-content">
            <a href="index.html" class="logo">
                ImmoWERT<span class="accent">24</span>
            </a>
            <nav class="nav">
                <a href="index.html#bewertung">Bewertung starten</a>
                <a href="index.html#so-gehts">So geht's</a>
                <a href="index.html#vorteile">Vorteile</a>
            </nav>
            <button class="btn-header" onclick="window.location.href='index.html'">Kostenlos bewerten</button>
        </div>
    </header>

    <section class="how-it-works">
        <div class="container">
            <h1 style="margin-bottom: 2rem;">__TITLE__</h1>
            <div style="max-width: 800px;">
                <p>Willkommen auf der Seite für __TITLE__. Hier finden Sie in Kürze alle relevanten Informationen.</p>
                <!-- Placeholder content -->
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container footer-content">
            <div class="footer-col">
                <h4>Über ImmoWERT24</h4>
                <ul>
                    <li><a href="ueber-uns.html">Über uns</a></li>
                    <li><a href="karriere.html">Karriere</a></li>
                    <li><a href="sitemap.html">Sitemap</a></li>
                    <li><a href="barrierefreiheit.html">Barrierefreiheit</a></li>
                    <li><a href="impressum.html">Impressum</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Services</h4>
                <ul>
                    <li><a href="kontakt.html">Kontakt & Hilfe</a></li>
                    <li><a href="presseservice.html">Presseservice</a></li>
                    <li><a href="kuendigung.html">Verträge hier kündigen</a></li>
                    <li><a href="it-entwicklung.html">IT & Entwicklung</a></li>
                    <li><a href="preisatlas.html">Preisatlas</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Sicherheit</h4>
                <ul>
                    <li><a href="agb.html">AGB & Rechtliche Hinweise</a></li>
                    <li><a href="verbraucherinformationen.html">Verbraucherinformationen</a></li>
                    <li><a href="datenschutz.html">Datenschutz</a></li>
                    <li><a href="privacy-manager.html">Zum Privacy-Manager</a></li>
                    <li><a href="datenschutz-kodex.html">Datenschutz-Kodex</a></li>
                    <li><a href="sicherheit.html">Sicherheit</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Für Profis</h4>
                <ul>
                    <li><a href="produktuebersicht.html">Produktübersicht</a></li>
                    <li><a href="maklernetzwerk.html">Maklernetzwerk</a></li>
                    <li><a href="eigentuemeranfragen.html">Eigentümeranfragen</a></li>
                    <li><a href="finanzierungsanfragen.html">Finanzierungsanfragen</a></li>
                    <li><a href="umzugsanfragen.html">Umzugsanfragen</a></li>
                    <li><a href="modernisierungsanfragen.html">Modernisierungsanfragen</a></li>
                    <li><a href="werben.html">Werben mit uns</a></li>
                </ul>
            </div>
        </div>
        <div class="container footer-bottom">
            <div class="footer-logo">ImmoWERT<span class="accent">24</span></div>
            <p class="footer-copyright">© 2026 ImmoWERT24. Alle Rechte vorbehalten.</p>
        </div>
    </footer>
</body>
</html>
"@

$pages = @{
    "ueber-uns.html" = "Über uns";
    "karriere.html" = "Karriere";
    "sitemap.html" = "Sitemap";
    "barrierefreiheit.html" = "Barrierefreiheit";
    "kontakt.html" = "Kontakt & Hilfe";
    "presseservice.html" = "Presseservice";
    "kuendigung.html" = "Verträge hier kündigen";
    "it-entwicklung.html" = "IT & Entwicklung";
    "preisatlas.html" = "Preisatlas";
    "agb.html" = "AGB & Rechtliche Hinweise";
    "verbraucherinformationen.html" = "Verbraucherinformationen";
    "privacy-manager.html" = "Privacy Manager";
    "datenschutz-kodex.html" = "Datenschutz-Kodex";
    "sicherheit.html" = "Sicherheit";
    "produktuebersicht.html" = "Produktübersicht";
    "maklernetzwerk.html" = "Maklernetzwerk";
    "eigentuemeranfragen.html" = "Eigentümeranfragen";
    "finanzierungsanfragen.html" = "Finanzierungsanfragen";
    "umzugsanfragen.html" = "Umzugsanfragen";
    "modernisierungsanfragen.html" = "Modernisierungsanfragen";
    "werben.html" = "Werben mit uns"
}

foreach ($key in $pages.Keys) {
    if (-not (Test-Path $key)) {
        $pageTitle = $pages[$key]
        $content = $template.Replace("__TITLE__", $pageTitle)
        Set-Content -Path $key -Value $content -Encoding UTF8
        Write-Host "Created $key"
    } else {
        Write-Host "Skipped $key (already exists)"
    }
}
