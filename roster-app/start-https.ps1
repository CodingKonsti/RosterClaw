# start-https.ps1
# Exports the .NET dev certificate and starts ng serve with HTTPS.
# Run once: you may be prompted for your password to access the cert store.

$sslDir = Join-Path $PSScriptRoot "ssl"
$certFile = Join-Path $sslDir "localhost.pem"
$keyFile  = Join-Path $sslDir "localhost-key.pem"

if (-not (Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir | Out-Null
}

# Export the dev cert if not already done (or if you want to refresh, delete ssl/)
if (-not (Test-Path $certFile) -or -not (Test-Path $keyFile)) {
    Write-Host "Exporting .NET dev certificate..." -ForegroundColor Cyan
    dotnet dev-certs https --export-path $certFile --format Pem --no-password
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to export dev cert. Run 'dotnet dev-certs https --trust' first."
        exit 1
    }
    Write-Host "Certificate exported to ssl/" -ForegroundColor Green
} else {
    Write-Host "Using existing cert in ssl/ (delete the folder to refresh)" -ForegroundColor DarkGray
}

Write-Host "Starting ng serve with HTTPS on https://localhost:4200" -ForegroundColor Cyan
npx ng serve --configuration https
