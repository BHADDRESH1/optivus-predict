# Helper script to update MongoDB password in .env file
param(
    [Parameter(Mandatory=$true)]
    [string]$Password
)

$envFile = ".env"
$content = Get-Content $envFile -Raw
$updatedContent = $content -replace '<db_password>', $Password
Set-Content -Path $envFile -Value $updatedContent -NoNewline
Write-Host "✅ MongoDB password updated in .env file" -ForegroundColor Green

