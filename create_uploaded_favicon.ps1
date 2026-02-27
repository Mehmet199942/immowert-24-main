Add-Type -AssemblyName System.Drawing

$sourceImagePath = "C:\Users\mehme\.gemini\antigravity\brain\71b45136-6d6c-444c-b26b-873a02103c43\media__1772199480652.png"

function Create-SquareImage ($targetPath, $targetSize) {
    if (-not (Test-Path $sourceImagePath)) {
        Write-Host "Source image not found!"
        return
    }

    $sourceImage = [System.Drawing.Image]::FromFile($sourceImagePath)
    $bitmap = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    
    $scale = [math]::Min($targetSize / $sourceImage.Width, $targetSize / $sourceImage.Height)
    $newWidth = [int]::Parse([math]::Floor($sourceImage.Width * $scale).ToString())
    $newHeight = [int]::Parse([math]::Floor($sourceImage.Height * $scale).ToString())
    
    $posX = [int]::Parse([math]::Floor(($targetSize - $newWidth) / 2).ToString())
    $posY = [int]::Parse([math]::Floor(($targetSize - $newHeight) / 2).ToString())
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($sourceImage, $posX, $posY, $newWidth, $newHeight)
    
    $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $sourceImage.Dispose()
    
    Write-Host "Created $targetPath at ${targetSize}x${targetSize}"
}

Create-SquareImage "c:\Users\mehme\Desktop\immowert-24-main-main\favicon.png" 512
Create-SquareImage "c:\Users\mehme\Desktop\immowert-24-main-main\favicon-192.png" 192
Create-SquareImage "c:\Users\mehme\Desktop\immowert-24-main-main\apple-touch-icon.png" 180

