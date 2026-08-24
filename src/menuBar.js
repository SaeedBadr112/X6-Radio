// ========== القوائم المنسدلة بالنقر ==========
let activeMenu = null;

function closeAllMenus() {
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    menu.classList.remove('show');
  });
  activeMenu = null;
}

function toggleMenu(menuItem) {
  const dropdown = menuItem.querySelector('.dropdown-menu');
  if (!dropdown) return;
  
  const wasOpen = dropdown.classList.contains('show');
  closeAllMenus();
  
  if (!wasOpen) {
    dropdown.classList.add('show');
    activeMenu = dropdown;
  }
}

// ربط الأحداث
function initClickMenus() {
  document.querySelectorAll('.menu-item').forEach(menuItem => {
    // إزالة أي مستمعات قديمة
    menuItem.removeEventListener('click', menuClickHandler);
    menuItem.addEventListener('click', menuClickHandler);
  });
  
  // إغلاق القوائم عند النقر خارجها
  document.removeEventListener('click', outsideClickHandler);
  document.addEventListener('click', outsideClickHandler);
  
  // إغلاق القوائم بالضغط على Escape
  document.removeEventListener('keydown', escapeHandler);
  document.addEventListener('keydown', escapeHandler);
}

function menuClickHandler(e) {
  e.stopPropagation();
  const menuItem = e.currentTarget;
  toggleMenu(menuItem);
}

function outsideClickHandler(e) {
  if (!e.target.closest('.menu-item')) {
    closeAllMenus();
  }
}

function escapeHandler(e) {
  if (e.key === 'Escape') {
    closeAllMenus();
  }
}

// تصدير الدوال
window.initClickMenus = initClickMenus;
window.closeAllMenus = closeAllMenus;
// ========== القوائم الرئيسية ==========
function bindStereoSubmenu() {
    document.querySelectorAll('.submenu-item[data-stereo]').forEach(item => {
        item.removeEventListener('click', stereoClickHandler);
        item.addEventListener('click', stereoClickHandler);
    });
}

function stereoClickHandler(e) {
    e.stopPropagation();
    const mode = this.dataset.stereo;
    if (mode === 'left') applyStereoMode('left');
    else if (mode === 'right') applyStereoMode('right');
    else if (mode === 'center') applyStereoMode('center');
    const dropdown = this.closest('.dropdown-menu');
    if (dropdown) dropdown.style.display = 'none';
}

function bindOutputSubmenu() {
    document.querySelectorAll('#outputDeviceSubmenu .submenu-item').forEach(item => {
        item.removeEventListener('click', outputClickHandler);
        item.addEventListener('click', outputClickHandler);
    });
}

function outputClickHandler(e) {
    e.stopPropagation();
    const option = this.dataset.device;
    if (option === 'default') {
        setAudioOutputDevice('');
    } else if (option === 'select') {
        selectAndSetAudioOutput();
    }
}

function bindThemeSubmenu() {
    const themeItems = document.querySelectorAll('.submenu-item[data-theme]');
    themeItems.forEach(item => {
        item.removeEventListener('click', themeClickHandler);
        item.addEventListener('click', themeClickHandler);
    });
}
function themeClickHandler(e) {
    e.stopPropagation();
    const theme = this.dataset.theme;
    if (theme === 'default') applyTheme('default');
    else if (theme === 'dark') applyTheme('dark');
    else if (theme === 'light') applyTheme('light');
    else if (theme === 'red') applyTheme('red');   // ✅ هذا هو السطر المضاف
    const dropdown = this.closest('.dropdown-menu');
    if (dropdown) dropdown.style.display = 'none';
}

function initMenuBar() {
        document.getElementById('menuOpenURL')?.addEventListener('click', async () => { 
        const url = await window.customPrompt(currentLanguage === 'ar' ? 'أدخل رابط البث المباشر (URL):' : 'Enter stream URL:'); 
        if (url && url.trim()) playStation(url.trim(), currentLanguage === 'ar' ? 'رابط مخصص' : 'Custom URL', currentLanguage === 'ar' ? 'رابط خارجي' : 'External Link', 'custom_' + Date.now(), false);
    });
document.getElementById('menuReload')?.addEventListener('click', () => {
    // تأكيد من المستخدم
    const userConfirmed = confirm(
        currentLanguage === 'ar'
            ? '⚠️ هل أنت متأكد من إعادة ضبط التطبيق بالكامل؟ سيتم حذف جميع البيانات (المفضلة، السجل، الإعدادات).'
            : '⚠️ Are you sure you want to reset the app completely? All data (favorites, history, settings) will be deleted.'
    );
    if (!userConfirmed) return;

    // 1. حذف جميع مفاتيح localStorage الخاصة بالتطبيق
    const keysToRemove = [
        'x6RadioLastCountry',
        'x6RadioCurrentStation',
        'x6RadioFavs',
        'x6RadioHistory',
        'x6RadioEqEnabled',
        'x6RadioAudioPreset',
        'x6RadioEqGains',
        'x6RadioCustomEqGains',
        'x6RadioTheme',
        'x6RadioAutoResume',
        'setting_autoResumeDelay',
        'setting_fontSize',
        'setting_language',
        'setting_autoClearHistory',
        'setting_visualizer',
        'setting_recordIcon',
        'x6RadioFailedIcons',
        'x6RadioMasterStations',
        'x6RadioVolume',
        'x6RadioLastAddedStation',
        'lastHistoryClear',
        'eqCustomSaved'
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // 2. حذف config.json (ملف اللغة خارج localStorage)
    if (window.electronAPI && window.electronAPI.resetConfig) {
        window.electronAPI.resetConfig();
    }

    // 3. إعادة تحميل الصفحة
    location.reload();
});
    document.getElementById('menuCompressor')?.addEventListener('click', () => { toggleCompressor(); });
    document.getElementById('menuAddStation')?.addEventListener('click', () => { switchTab('add-station-tab'); });
    document.getElementById('menuImportStations')?.addEventListener('click', () => { 
        const input = document.createElement('input'); 
        input.type = 'file'; 
        input.accept = 'application/json'; 
        input.onchange = (e) => { 
            const file = e.target.files[0]; 
            if (!file) return; 
            const reader = new FileReader(); 
            reader.onload = (ev) => { 
                try { 
                    const imported = JSON.parse(ev.target.result); 
                    if (Array.isArray(imported)) { 
                        masterStations = [...masterStations, ...imported]; 
                        const unique = new Map(); 
                        masterStations.forEach(st => unique.set(st.id, st)); 
                        masterStations = Array.from(unique.values()); 
                        saveMasterStations(); 
                        renderStations(); 
                        if (typeof renderFavoritesTab === 'function') renderFavoritesTab(); 
                        setStatus(t('stations_imported', imported.length), false);
                    } else throw new Error(); 
                } catch (err) { 
                    setStatus(t('invalid_file'), true); 
                } 
            }; 
            reader.readAsText(file); 
        }; 
        input.click(); 
    });
    document.getElementById('menuExportStations')?.addEventListener('click', () => { exportStations(); });
    document.getElementById('menuExit')?.addEventListener('click', () => { if (confirm(t('confirm_exit'))) { if (window.electronAPI) window.electronAPI.closeApp(); else window.close(); } });
    document.getElementById('menuResume')?.addEventListener('click', () => { if (audioPlayer.paused && currentStation && currentStation.url) playStation(currentStation.url, currentStation.name, currentStation.country, currentStation.id, currentStation.isWebPage); else if (!audioPlayer.paused) audioPlayer.play(); });
    document.getElementById('menuPause')?.addEventListener('click', () => { if (!audioPlayer.paused) audioPlayer.pause(); });
    document.getElementById('menuStop')?.addEventListener('click', () => { stopPlayback(); });
    document.getElementById('menuShuffle')?.addEventListener('click', () => { if (!masterStations.length) return; const randomIndex = Math.floor(Math.random() * masterStations.length); const randomStation = masterStations[randomIndex]; const countryObj = allCountries.find(c => c.code === randomStation.countryCode); const cName = countryObj ? countryObj.nameAr : randomStation.countryCode; playStation(randomStation.streamUrl, randomStation.name, cName, randomStation.id, randomStation.isWebPage); });
    document.getElementById('menuAbout')?.addEventListener('click', () => { showAbout(); });
    document.getElementById('menuViewStations')?.addEventListener('click', () => { switchTab('stations-tab'); });
    document.getElementById('menuHistory')?.addEventListener('click', () => { switchTab('history-tab'); });
    document.getElementById('menuSettings')?.addEventListener('click', () => { openSettings(); });
    document.getElementById('menuAlwaysOnTop')?.addEventListener('click', () => { toggleAlwaysOnTop(); });
    document.getElementById('menuCloseTab')?.addEventListener('click', () => { closeCurrentTab(); });
    document.getElementById('menuDebug')?.addEventListener('click', showDebugInfo);
    document.getElementById('menuFeedback')?.addEventListener('click', sendFeedback);
    document.getElementById('menuLicense')?.addEventListener('click', showLicense);
    document.getElementById('menuOpenSource')?.addEventListener('click', openSourceLink);
    document.getElementById('menuReleaseNotes')?.addEventListener('click', showReleaseNotes);
    document.getElementById('menuKeyboardShortcuts')?.addEventListener('click', showKeyboardShortcutsModal);
    document.getElementById('menuHello')?.addEventListener('click', sayHello);
    document.getElementById('menuAboutHelp')?.addEventListener('click', showAbout);
document.getElementById('menuCheckForUpdates')?.addEventListener('click', () => {
    if (window.electronAPI && window.electronAPI.checkForUpdates) {
        window.electronAPI.checkForUpdates();
        setStatus(currentLanguage === 'ar' ? 'جاري البحث عن تحديثات...' : 'Checking for updates...', false);
    } else {
        setStatus(currentLanguage === 'ar' ? 'التحديثات غير مدعومة في هذا الإصدار' : 'Updates not supported in this version', true);
    }
});
// قراءة الحالة الحالية لـ "دائماً في المقدمة" عند بدء التشغيل
if (window.electronAPI && window.electronAPI.getAlwaysOnTop) {
    window.electronAPI.getAlwaysOnTop().then(isOnTop => {
        updateAlwaysOnTopMenuState(isOnTop);
    }).catch(() => {});
}
}

// ========== دوال المظهر ==========
function applyTheme(theme) {
    document.body.classList.remove('default-theme', 'dark-high-contrast', 'light-theme', 'red-theme');
    if (theme === 'default') {
        document.body.classList.add('default-theme');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-high-contrast');
    } else if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (theme === 'red') {
        document.body.classList.add('red-theme');
    }
    localStorage.setItem("x6RadioTheme", theme);
    currentTheme = theme;

    // ✅ تحديث رسالة الترحيب (للتأكد من تطبيق الألوان)
    if (typeof renderStations === 'function') renderStations();

    // ✅ ===== تحديث meta theme-color للمتصفحات =====
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        const colors = {
            'default': '#0a192f',
            'dark': '#000000',
            'light': '#f8f9fa',
            'red': '#8b3c3c'
        };
        metaThemeColor.setAttribute('content', colors[theme] || '#0a192f');
    }

    // ✅ ===== تغيير لون شريط العنوان (Title Bar) في Electron =====
    if (window.electronAPI && window.electronAPI.setTitleBarColor) {
        let bgColor, symbolColor;
        switch (theme) {
            case 'default':
                bgColor = '#0a192f';
                symbolColor = '#ffffff';
                break;
            case 'dark':
                bgColor = '#000000';
                symbolColor = '#ffffff';
                break;
            case 'light':
                bgColor = '#f8f9fa';
                symbolColor = '#212529';
                break;
            case 'red':
                bgColor = '#8b3c3c';
                symbolColor = '#fef7e8';
                break;
            default:
                bgColor = '#0a192f';
                symbolColor = '#ffffff';
        }

console.log('🎨 Applying theme:', theme);
console.log('🎨 Setting title bar color to:', bgColor);

        window.electronAPI.setTitleBarColor(bgColor, symbolColor);
    }

    let themeDisplay = theme === 'default' ? t('theme_default') : (theme === 'dark' ? t('theme_dark') : (theme === 'light' ? t('theme_light') : t('theme_red')));
    setStatus(t('theme_changed', themeDisplay), false);
}

// ========== دوال القائمة مساعدة ==========
function showDebugInfo() {
    const info = {
        [currentLanguage === 'ar' ? "إصدار التطبيق" : "App Version"]: "2.0.0",
        [currentLanguage === 'ar' ? "آخر تحديث" : "Last Update"]: "2026-04-15",
        [currentLanguage === 'ar' ? "المتصفح" : "Browser"]: navigator.userAgent,
        [currentLanguage === 'ar' ? "حالة Web Audio" : "Web Audio State"]: audioCtx ? (audioCtx.state === 'running' ? (currentLanguage === 'ar' ? 'نشط' : 'Active') : audioCtx.state) : (currentLanguage === 'ar' ? 'غير مهيأ' : 'Not initialized'),
        [currentLanguage === 'ar' ? "عدد المحطات المحملة" : "Loaded Stations"]: masterStations.length,
        [currentLanguage === 'ar' ? "عدد المحطات المفضلة" : "Favorites"]: favorites.length,
        [currentLanguage === 'ar' ? "عدد محطات السجل" : "History Count"]: historyList.length,
        [currentLanguage === 'ar' ? "حالة الضاغط" : "Compressor"]: isCompressorActive ? (currentLanguage === 'ar' ? 'مفعل' : 'Enabled') : (currentLanguage === 'ar' ? 'غير مفعل' : 'Disabled'),
        [currentLanguage === 'ar' ? "حالة فصل الستيريو" : "Stereo Mode"]: isStereoModeActive ? (currentLanguage === 'ar' ? 'مفعل' : 'Enabled') : (currentLanguage === 'ar' ? 'غير مفعل' : 'Disabled'),
        [currentLanguage === 'ar' ? "مستوى الصوت الحالي" : "Volume"]: audioPlayer.volume,
        [currentLanguage === 'ar' ? "التايمر نشط؟" : "Timer Active"]: timerInterval ? (currentLanguage === 'ar' ? 'نعم' : 'Yes') : (currentLanguage === 'ar' ? 'لا' : 'No'),
        [currentLanguage === 'ar' ? "المحطة الحالية" : "Current Station"]: currentStation ? currentStation.name : (currentLanguage === 'ar' ? 'لا توجد محطة' : 'No station'),
    };
    let msg = (currentLanguage === 'ar' ? "🔧 معلومات تصحيح الأخطاء:\n\n" : "🔧 Debug Info:\n\n");
    for (const [key, value] of Object.entries(info)) {
        msg += `${key}: ${value}\n`;
    }
    alert(msg);
}

function sendFeedback() {
    const subject = encodeURIComponent(currentLanguage === 'ar' ? "ملاحظات على تطبيق X6 Radio" : "Feedback on X6 Radio");
    const body = encodeURIComponent(currentLanguage === 'ar' ? "أكتب ملاحظاتك هنا:\n\n" : "Write your feedback here:\n\n");
    window.location.href = `mailto:saeedbadr112@hotmail.com?subject=${subject}&body=${body}`;
    setStatus(t('opening_email'), false);
}

function showAbout() {
    alert(`🎵 ${t('app_title')}\n${t('version')}\n\n${t('about_text')}`);
}

function showLicense() {
    alert(`📄 ${currentLanguage === 'ar' ? 'رخصة التطبيق' : 'License'}\n\n${currentLanguage === 'ar' ? 'هذا البرنامج مجاني ومفتوح المصدر.\nيمكنك استخدامه وتعديله وتوزيعه بحرية.\n\nرخصة MIT:\nيُسمح لأي شخص باستخدام هذا البرنامج دون قيود، بما في ذلك نسخه وتعديله ودمجه مع برامج أخرى، بشرط الاحتفاظ بإشعار حقوق الملكية.\n\nالبرنامج يُقدم "كما هو" دون أي ضمان.\nلمزيد من التفاصيل، راجع https://opensource.org/licenses/MIT' : 'This software is free and open source.\nYou may use, modify, and distribute it freely.\n\nMIT License:\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.\nFor more details, see https://opensource.org/licenses/MIT'}`);
}

function openSourceLink() {
    window.open('https://github.com/Saeed-Badr/X6-Radio', '_blank');
    setStatus(t('opening_source'), false);
}
function showReleaseNotes() {
    const notes = currentLanguage === 'ar' 
        ? "📌 ملاحظات الإصدار 2.0.0\n\n" +
          "✨ تحسينات وإضافات جديدة:\n" +
          "• إضافة **معادل الصوت المتقدم** (15 نطاق ترددي) للتحكم الدقيق بالصوت.\n" +
          "• إضافة **10 أوضاع صوتية مسبقة** (قياسي، روك، بوب، جاز، كلاسيكي، دانس، بالاد، R&B، هيب هوب، مخصص).\n" +
          "• إضافة **ميزة إعادة ضبط التطبيق** (Ctrl+Shift+Alt+R) لإعادة التشغيل الفوري.\n" +
          "• إضافة **تغيير أيقونة المحطة** يدوياً عبر رفع صورة من الجهاز.\n" +
          "• إضافة **بحث متقدم في قائمة الدول والتصنيفات** لتسهيل الوصول السريع.\n" +
          "• إضافة **المزيد من المحطات الإذاعية الجديدة** محلياً ضمن قاعدة البيانات.\n\n" +
          "🐛 إصلاح الأخطاء:\n" +
          "• إصلاح مشكلة اختفاء القوائم المنسدلة بسرعة عند تمرير الماوس.\n" +
          "• إصلاح مشكلة **التمرير المتزامن للتبويبات** (كانت التبويبات تنزلق معاً عند التمرير).\n\n" +
          "🎨 تحسينات الواجهة:\n" +
          "• تحسين **المؤشر الصوتي البصري** (Visualizer) ليكون أكثر سلاسة واستجابة للموسيقى.\n" +
          "• تحسينات شاملة على **مظهر التطبيق** في جميع المظاهر (الافتراضي، الداكن، الفاتح، الأحمر)."
        : "📌 Release Notes 2.0.0\n\n" +
          "✨ New Features & Enhancements:\n" +
          "• Added **Advanced Equalizer** (15 bands) for precise audio control.\n" +
          "• Added **10 Audio Presets** (Flat, Rock, Pop, Jazz, Classical, Dance, Ballad, R&B, HipHop, Custom).\n" +
          "• Added **Reset App** feature (Ctrl+Shift+Alt+R) for instant restart.\n" +
          "• Added **Custom Station Icon** changer (upload image from device).\n" +
          "• Added **Advanced Search** in Countries & Categories list for quick access.\n" +
          "• Added **more new local radio stations** to the built-in database.\n\n" +
          "🐛 Bug Fixes:\n" +
          "• Fixed dropdown menus disappearing too quickly on mouse hover.\n" +
          "• Fixed **synchronized scrolling issue between tabs** (tabs were scrolling together).\n\n" +
          "🎨 UI Improvements:\n" +
          "• Improved **Audio Visualizer** for smoother and more responsive animation.\n" +
          "• Comprehensive **UI/Theme** improvements across all modes (Default, Dark, Light, Red).";
    alert(notes);
}

function sayHello() {
    const hour = new Date().getHours();
    let greeting = "";
    if (hour < 12) greeting = t('greeting_morning');
    else if (hour < 18) greeting = t('greeting_evening');
    else greeting = t('greeting_night');
    alert(`👋 ${greeting}!\n${t('thank_you_message')}`);
}

function openSettings() {
    let currentStatus = autoResume ? (currentLanguage === 'ar' ? "مفعل" : "Enabled") : (currentLanguage === 'ar' ? "غير مفعل" : "Disabled");
    let userChoice = confirm(`${currentLanguage === 'ar' ? '⚙️ إعدادات التشغيل التلقائي\n\nالحالة الحالية: ' : '⚙️ Auto-resume Settings\n\nCurrent status: '}${currentStatus}\n\n${currentLanguage === 'ar' ? 'اضغط "موافق" لتغيير الإعداد، أو "إلغاء" للإلغاء.' : 'Press "OK" to change setting, or "Cancel" to cancel.'}`);
    if (userChoice) {
        autoResume = !autoResume;
        localStorage.setItem("X6RadioAutoResume", autoResume);
        setStatus(t('auto_resume_toggled', autoResume ? 'enabled' : 'disabled'), false);
    }
}

function setAlwaysOnTop() {
    if (window.electronAPI && window.electronAPI.setAlwaysOnTop) {
        window.electronAPI.setAlwaysOnTop(true);
        setStatus(t('always_on_top_set'), false);
    } else {
        setStatus(t('always_on_top_electron_only'), true);
    }
}

function closeCurrentTab() {
    if (confirm(t('confirm_exit'))) {
        if (window.electronAPI) window.electronAPI.closeApp();
        else window.close();
    }
}

// ========== عرض وضع الصوت في البانر العلوي ==========

const PRESET_ORDER = ['flat', 'rock', 'pop', 'jazz', 'classical', 'dance', 'ballad', 'rnb', 'hiphop', 'custom'];

function getPresetDisplayName(presetKey) {
    if (presetKey === 'custom') {
        return currentLanguage === 'ar' ? 'مخصص' : 'Custom';
    }
    const map = {
        'flat': t('preset_flat'),
        'rock': t('preset_rock'),
        'pop': t('preset_pop'),
        'jazz': t('preset_jazz'),
        'classical': t('preset_classical'),
        'dance': t('preset_dance'),
        'ballad': t('preset_ballad'),
        'rnb': t('preset_rnb'),
        'hiphop': t('preset_hiphop')
    };
    return map[presetKey] || presetKey;
}

window.getPresetDisplayName = getPresetDisplayName;
window.PRESET_ORDER = PRESET_ORDER;

function updatePresetDisplay() {
    const display = document.getElementById('currentPresetDisplay');
    if (!display) return;
    const current = localStorage.getItem('x6RadioAudioPreset') || 'flat';
    display.textContent = getPresetDisplayName(current);
}

function goToPreviousPreset() {
    const current = localStorage.getItem('x6RadioAudioPreset') || 'flat';
    const currentIndex = PRESET_ORDER.indexOf(current);
    // إذا كان current غير موجود (مثلاً custom ليس في القائمة) نضع الفهرس في نهاية القائمة
    const idx = currentIndex === -1 ? PRESET_ORDER.length - 1 : currentIndex;
    const prevIndex = (idx - 1 + PRESET_ORDER.length) % PRESET_ORDER.length;
    const newPreset = PRESET_ORDER[prevIndex];
    applyPresetAndUpdate(newPreset);
}

function goToNextPreset() {
    const current = localStorage.getItem('x6RadioAudioPreset') || 'flat';
    const currentIndex = PRESET_ORDER.indexOf(current);
    const idx = currentIndex === -1 ? PRESET_ORDER.length - 1 : currentIndex;
    const nextIndex = (idx + 1) % PRESET_ORDER.length;
    const newPreset = PRESET_ORDER[nextIndex];
    applyPresetAndUpdate(newPreset);
}

function applyPresetAndUpdate(preset) {
    // إذا كان preset هو 'custom'، لا نطبق أي تغيير على قيم المعادل، فقط نحدث العرض والتخزين
    if (preset === 'custom') {
        localStorage.setItem('x6RadioAudioPreset', 'custom');
        updatePresetDisplay();
        if (typeof setStatus === 'function') {
            setStatus(currentLanguage === 'ar' ? '🎛️ الوضع: مخصص' : '🎛️ Mode: Custom', false);
        }
        return;
    }
    if (typeof window.applyAudioPreset === 'function') {
        window.applyAudioPreset(preset);
        updatePresetDisplay();
    } else {
        console.warn('applyAudioPreset not available yet');
    }
}

function bindPresetButtons() {
    const prevBtn = document.getElementById('prevPresetBtn');
    const nextBtn = document.getElementById('nextPresetBtn');
    if (prevBtn) {
        prevBtn.removeEventListener('click', goToPreviousPreset);
        prevBtn.addEventListener('click', goToPreviousPreset);
    }
    if (nextBtn) {
        nextBtn.removeEventListener('click', goToNextPreset);
        nextBtn.addEventListener('click', goToNextPreset);
    }
}

function initPresetDisplay() {
    updatePresetDisplay();
    bindPresetButtons();
}

// تهيئة عند تحميل DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPresetDisplay);
} else {
    initPresetDisplay();
}

window.updatePresetDisplay = updatePresetDisplay;
window.applyTheme = applyTheme;
window.setAlwaysOnTop = setAlwaysOnTop;
window.sayHello = sayHello;
window.showAbout = showAbout;
window.showLicense = showLicense;
window.openSourceLink = openSourceLink;
window.showReleaseNotes = showReleaseNotes;
window.showDebugInfo = showDebugInfo;
window.sendFeedback = sendFeedback;