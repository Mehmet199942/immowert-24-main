Add-Type -AssemblyName System.Drawing

$sourceImagePath = "c:\Users\mehme\Desktop\immowert-24-main-main\logo.png"

# Setup high quality graphics
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

Create-SquareImage "c:\Users\mehme\Desktop\immowert-24-main-main\favicon-192.png" 192
Create-SquareImage "c:\Users\mehme\Desktop\immowert-24-main-main\apple-touch-icon.png" 180

# Also make an standard 32x32 favicon.ico by just renaming a png (browsers support png as ico) but better yet, just link to png
