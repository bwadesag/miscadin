# Script PowerShell pour démarrer l'application MISCADIN
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage de l'application MISCADIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier la base de données
Write-Host "[1/3] Vérification de la base de données..." -ForegroundColor Yellow
try {
    $result = python -c "from backend.app import create_app, db; from backend.config import Config; from backend.models import User; app = create_app(Config); app.app_context().push(); count = User.query.count(); print(f'Base de données OK ({count} utilisateurs)')" 2>&1
    Write-Host "  $result" -ForegroundColor Green
} catch {
    Write-Host "  Initialisation de la base de données..." -ForegroundColor Yellow
    python -m backend.init_db
}

Write-Host ""
Write-Host "[2/3] Démarrage du backend Flask (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python backend/run.py" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "[3/3] Démarrage du frontend React (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application démarrée !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Les serveurs sont en cours d'exécution dans des fenêtres séparées." -ForegroundColor Yellow
Write-Host ""

