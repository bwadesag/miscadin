# Script PowerShell pour déployer sur Vercel
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Déploiement Frontend sur Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Vercel CLI est installé
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Installation de Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "[OK] Vercel CLI installé" -ForegroundColor Green
} else {
    Write-Host "[OK] Vercel CLI déjà installé" -ForegroundColor Green
}

Write-Host ""
Write-Host "Build du frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Build réussi" -ForegroundColor Green
    Write-Host ""
    Write-Host "Démarrage du déploiement Vercel..." -ForegroundColor Yellow
    Write-Host "Suivez les instructions à l'écran :" -ForegroundColor Cyan
    Write-Host "  1. Connectez-vous à votre compte Vercel" -ForegroundColor White
    Write-Host "  2. Sélectionnez votre projet" -ForegroundColor White
    Write-Host "  3. Configurez les variables d'environnement" -ForegroundColor White
    Write-Host ""
    vercel
} else {
    Write-Host "[ERREUR] Le build a échoué" -ForegroundColor Red
    exit 1
}

