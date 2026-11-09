@echo off
title Pasang Auto-Start Signage Server
cls
echo ===================================================================
echo   MEMASANG AUTO-START SIGNAGE SERVER DI WINDOWS STARTUP
echo ===================================================================
echo.

set "VBS_SCRIPT=%~dp0run-hidden.vbs"
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\SignageServer.lnk"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$s = $ws.CreateShortcut('%SHORTCUT_PATH%'); " ^
  "$s.TargetPath = 'wscript.exe'; " ^
  "$s.Arguments = '\"%VBS_SCRIPT%\"'; " ^
  "$s.WorkingDirectory = '%~dp0'; " ^
  "$s.Save()"

echo [SUKSES] Shortcut berhasil ditambahkan ke Startup Windows!
echo.
echo Sekarang setiap kali PC/Windows dinyalakan atau direstart,
echo server signage akan otomatis berjalan di latar belakang (background)
echo tanpa perlu Anda buka atau jalankan aplikasi apa pun secara manual.
echo ===================================================================
echo.
pause
