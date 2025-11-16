@echo off
echo ========================================
echo   Demarrage de l'application MISCADIN
echo ========================================
echo.

cd /d %~dp0

echo [1/3] Verification de la base de données...
python -c "from backend.app import create_app, db; from backend.config import Config; from backend.models import User; app = create_app(Config); app.app_context().push(); count = User.query.count(); print(f'  Base de données OK ({count} utilisateurs)')" 2>nul
if errorlevel 1 (
    echo   Initialisation de la base de données...
    python -m backend.init_db
)

echo.
echo [2/3] Demarrage du backend Flask (port 5000)...
start "MISCADIN Backend" cmd /k "cd /d %~dp0 && python backend/run.py"
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Demarrage du frontend React (port 5173)...
start "MISCADIN Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   Application demarree !
echo ========================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo   Appuyez sur une touche pour fermer cette fenetre...
echo   (Les serveurs continueront de fonctionner)
pause

