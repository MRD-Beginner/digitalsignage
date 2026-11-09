/**
 * PT Sumatera Kemasindo - Digital Signage Main Application
 * Handles live date updates, fullscreen kiosk mode, background switching, and interactive polish.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Helper to obtain current Date shifted accurately to WIB (UTC+7)
  const getWIBDate = () => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utcTime + (7 * 3600000));
  };

  // 1. Live Digital Clock (Floating Top Left: WIB / UTC+7)
  const liveClock = document.getElementById('liveClock');
  const updateLiveClock = () => {
    if (!liveClock) return;
    const wib = getWIBDate();
    const hours = String(wib.getHours()).padStart(2, '0');
    const minutes = String(wib.getMinutes()).padStart(2, '0');
    const seconds = String(wib.getSeconds()).padStart(2, '0');
    liveClock.textContent = `${hours}:${minutes}:${seconds} WIB`;
  };
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // 2. Live Date Formatter (Defaults to Indonesian format "PEKANBARU, 07 NOVEMBER 2026")
  const dateDisplay = document.getElementById('dateDisplay');
  const updateDate = () => {
    if (!dateDisplay) return;
    const wib = getWIBDate();
    const months = [
      'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
      'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
    ];
    const day = String(wib.getDate()).padStart(2, '0');
    const month = months[wib.getMonth()];
    const year = wib.getFullYear();
    
    // Set formatted text
    dateDisplay.textContent = `PEKANBARU, ${day} ${month} ${year}`;
  };
  updateDate();
  setInterval(updateDate, 30000);

  // 2. Fullscreen Digital Signage Kiosk Mode
  const btnFullscreen = document.getElementById('btnFullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request denied:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // 3. Background Switcher (Toggle between Building, HD Factory, and Original)
  const btnSwitchBg = document.getElementById('btnSwitchBg');
  const bgModes = [
    { id: 'building', label: 'Latar: Gedung (inigambarnya.jpeg)' },
    { id: 'factory', label: 'Latar: Pabrik Modern (HD 4K)' },
    { id: 'original', label: 'Latar: Original Design' }
  ];
  let currentBgIdx = 0;

  if (btnSwitchBg) {
    btnSwitchBg.addEventListener('click', (e) => {
      e.stopPropagation();
      currentBgIdx = (currentBgIdx + 1) % bgModes.length;
      const nextBg = bgModes[currentBgIdx];
      document.body.setAttribute('data-bg', nextBg.id);
      btnSwitchBg.title = `${nextBg.label} (Klik untuk ganti)`;
    });
  }

  // 4. Subtle Interactive 3D Card Tilt (Glass depth on pointer move)
  const card = document.getElementById('welcomeCard');
  const screen = document.getElementById('mainScreen');

  if (screen && card) {
    screen.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - cardX) / (rect.width / 2);
      const deltaY = (e.clientY - cardY) / (rect.height / 2);

      // Max tilt 5 degrees for subtlety
      const tiltX = Math.max(-1, Math.min(1, deltaY)) * -5;
      const tiltY = Math.max(-1, Math.min(1, deltaX)) * 5;

      card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-2px)`;
    });

    screen.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  }

  // 5. Keyboard Shortcuts for Digital Signage (F for Fullscreen Kiosk Mode)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  });
});
