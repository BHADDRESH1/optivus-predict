# Script to update MongoDB password and start the server
param(
    [Parameter(Mandatory=$false)]
    [string]$MongoPassword
)

Write-Host "`n🚀 OPTIVUS Backend Server Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Check if password is provided
if (-not $MongoPassword) {
    Write-Host "`n⚠️  MongoDB password not provided!" -ForegroundColor Yellow
    Write-Host "Please provide your MongoDB Atlas password:" -ForegroundColor White
    Write-Host "  .\start-server.ps1 -MongoPassword 'YOUR_PASSWORD'" -ForegroundColor Green
    Write-Host "`nOr manually edit .env file and replace <db_password> with your password" -ForegroundColor White
    exit 1
}

# Update .env file with password
Write-Host "`n📝 Updating .env file with MongoDB password..." -ForegroundColor Yellow
$envFile = ".env"
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    $updatedContent = $content -replace '<db_password>', $MongoPassword
    Set-Content -Path $envFile -Value $updatedContent -NoNewline
    Write-Host "✅ Password updated successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host "`n🚀 Starting server..." -ForegroundColor Yellow
Write-Host "Server will run on: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Gray
npm start

