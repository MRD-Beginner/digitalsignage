@echo off
:: Skrip untuk membuka Port 7777 di Windows Defender Firewall
:: Harus dijalankan dengan "Run as administrator" (Klik Kanan -> Run as administrator)

echo ===================================================================
echo   MENGIZINKAN AKSES PORT 7777 DI WINDOWS DEFENDER FIREWALL
echo ===================================================================
echo.

netsh advfirewall firewall add rule name="Signage Port 7777" dir=in action=allow protocol=TCP localport=7777

echo.
echo ===================================================================
echo Selesai! Jika muncul tulisan "Ok.", port 7777 sudah berhasil dibuka
echo dan PC lain sekarang sudah bisa mengakses web signage ini.
echo ===================================================================
echo.
pause
