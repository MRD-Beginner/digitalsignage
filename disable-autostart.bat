@echo off
title Hapus Auto-Start Signage Server
cls
set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\SignageServer.lnk"

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo [SUKSES] Auto-start Signage Server berhasil dihapus dari Startup Windows.
) else (
    echo [INFO] Auto-start Signage Server belum pernah dipasang.
)
echo.
pause
