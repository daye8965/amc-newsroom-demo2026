@echo off
chcp 65001 >nul
set PYTHONUTF8=1
where py >nul 2>nul && (py -3 "%~dp0scrapfinder.py" %*) || (python "%~dp0scrapfinder.py" %*)
echo.
pause
