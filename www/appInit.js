// ========== طلب اختيار اللغة عند أول تشغيل (نافذة زرين) ==========
// تعمل في سطح المكتب (Electron) والجوال (Capacitor)
function showLanguageSelectionDialog() {
    // إنشاء نافذة منبثقة مخصصة
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const dialog = document.createElement('div');
    dialog.style.backgroundColor = '#0a2a44';
    dialog.style.borderRadius = '20px';
    dialog.style.padding = '30px';
    dialog.style.width = '85%';
    dialog.style.maxWidth = '350px';
    dialog.style.textAlign = 'center';
    dialog.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
    dialog.style.border = '1px solid #2563eb';

    dialog.innerHTML = `
        <h2 style="color: #60a5fa; margin-bottom: 20px;">🌍 Choose Language</h2>
        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 10px; flex-wrap: wrap;">
            <button id="langArBtn" style="background: #2563eb; border: none; color: white; padding: 12px 30px; border-radius: 40px; font-size: 18px; font-weight: bold; cursor: pointer; transition: 0.2s;">العربية</button>
            <button id="langEnBtn" style="background: #4b5563; border: none; color: white; padding: 12px 30px; border-radius: 40px; font-size: 18px; font-weight: bold; cursor: pointer; transition: 0.2s;">English</button>
        </div>
        <p style="color: #9ec8f0; font-size: 14px; margin-top: 15px;">اختر اللغة / Select Language</p>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const langArBtn = dialog.querySelector('#langArBtn');
    const langEnBtn = dialog.querySelector('#langEnBtn');

    const selectLanguage = (selectedLang) => {
        overlay.remove();
        if (window.electronAPI && window.electronAPI.saveConfigLanguage) {
            window.electronAPI.saveConfigLanguage(selectedLang).catch(err => {
                console.warn('فشل حفظ اللغة في config.json', err);
            });
        }
        localStorage.setItem('setting_language', selectedLang);
        window.location.reload();
    };

    langArBtn.addEventListener('click', () => selectLanguage('ar'));
    langEnBtn.addEventListener('click', () => selectLanguage('en'));
}

(async function firstRunLanguageSelection() {
    let lang = null;

    // 1. قراءة اللغة من config.json (سطح المكتب فقط)
    if (window.electronAPI && window.electronAPI.getConfigLanguage) {
        try {
            lang = await window.electronAPI.getConfigLanguage();
            console.log('✅ تم تحميل اللغة من config.json:', lang);
        } catch (err) {
            console.warn('فشل في قراءة config.json', err);
        }
    }

    // 2. إذا لم توجد لغة في config.json (أو على الجوال)، نقرأ من localStorage
    if (!lang) {
        lang = localStorage.getItem('setting_language');
    }

    // 3. إذا كانت لغة صالحة محفوظة → نستخدمها
    if (lang === 'ar' || lang === 'en') {
        localStorage.setItem('setting_language', lang);
        console.log('✅ اللغة الحالية:', lang);
        return;
    }

    // 4. لا توجد لغة محفوظة (أول تشغيل أو بعد إعادة الضبط) → أظهر مربع الاختيار
    console.log('🌍 لا توجد لغة محفوظة، عرض مربع اختيار اللغة...');
    showLanguageSelectionDialog();
})();

// ========== قراءة اللغة من config.json (عبر IPC) ==========
(async function initLanguageFromConfig() {
    if (window.electronAPI && window.electronAPI.getConfigLanguage) {
        try {
            const lang = await window.electronAPI.getConfigLanguage();
            if (lang === 'ar' || lang === 'en') {
                localStorage.setItem('setting_language', lang);
                console.log('✅ تم تحميل اللغة من config.json:', lang);
            } else if (lang) {
                console.warn('⚠️ لغة غير صالحة في config.json، تجاهل');
            }
        } catch (err) {
            console.warn('⚠️ فشل قراءة config.json، سيتم استخدام اللغة المخزنة أو العربية', err);
        }
    } else {
        console.log('ℹ️ electronAPI غير متاح، سيتم استخدام اللغة من localStorage أو العربية');
    }
})();

// ========== باقي الكود ==========
document.addEventListener('DOMContentLoaded', async () => {
    // شاشة البداية
    // ملاحظة: لا نحذف العنصر من الصفحة إطلاقاً حتى يبقى متاحاً
    // لإظهاره مجدداً عند تغيير اللغة (تغطية إعادة التحميل على الجوال)
    const splash = document.getElementById('splashScreen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('hide');
        }, 2000);
    }
    
    // تحميل البيانات الأساسية
    await loadMasterStations();
console.log('🔍 [appInit.js] Master stations loaded:', masterStations.length);
console.log('🔍 [appInit.js] Favorites array after load:', favorites);
console.log('🔍 [appInit.js] History array after load:', historyList);
console.log('🔍 [appInit.js] Raw localStorage x6RadioMasterStations:', localStorage.getItem("x6RadioMasterStations")?.substring(0, 200) + '...');
    loadFailedIconsSet();
    
    // ========== تطبيق اللغة مع ضبط الاتجاه تلقائياً ==========
    const savedLanguage = localStorage.getItem('setting_language') || 'en';
    currentLanguage = savedLanguage;
    document.documentElement.lang = currentLanguage === 'ar' ? 'ar' : 'en';
    if (currentLanguage === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.style.direction = 'rtl';
        document.body.style.textAlign = 'right';
     updateAllTexts();
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.style.direction = 'ltr';
        document.body.style.textAlign = 'left';
    }
    
    // تحديث النصوص ديناميكياً
    updateAllTexts();
    
    // إعداد عنصر الحالة
    let statusEl = document.getElementById('playerStatus');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'playerStatus';
        statusEl.className = 'player-status';
        const searchWrapper = document.querySelector('.search-wrapper');
        if (searchWrapper && searchWrapper.parentNode) searchWrapper.insertAdjacentElement('afterend', statusEl);
        else document.querySelector('.main-header').appendChild(statusEl);
    }
    
    // ========== إضافة محطة جديدة ==========
    const submitAddStationBtn = document.getElementById('submitAddStation');
    if (submitAddStationBtn) {
        submitAddStationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.addNewStationFromForm === 'function') {
                window.addNewStationFromForm();
            } else {
                console.error('addNewStationFromForm function not found');
                setStatus(t('add_button') + ' ' + (currentLanguage === 'ar' ? 'غير متوفر' : 'not available'), true);
            }
        });
    }

    const cancelAddStationBtn = document.getElementById('cancelAddStation');
    if (cancelAddStationBtn) {
        cancelAddStationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.resetAddStationForm === 'function') {
                window.resetAddStationForm();
            }
        });
    }

    // ✅ تعبئة قائمة الدول في نموذج الإضافة
    if (typeof window.populateCountrySelect === 'function') {
        window.populateCountrySelect();
    } else {
        console.warn('populateCountrySelect function not found');
    }

    // ربط الأزرار الأساسية
    const playPauseBtn = document.getElementById("playPauseBtn");
    if (playPauseBtn) {
        playPauseBtn.addEventListener("click", () => {
            if (!audioPlayer.paused && currentStation) {
                stopPlayback();
            } else {
                if (currentStation && currentStation.url) {
                    playStation(currentStation.url, currentStation.name, currentStation.country, currentStation.id, currentStation.isWebPage || false);
                } else {
                    setStatus(t('no_station_selected'), true);
                }
            }
        });
    }
    
    // تهيئة زر "المحطة التالية"
    if (typeof initNextStationButton === 'function') {
        initNextStationButton();
    }
    
    const volumeSlider = document.getElementById("volumeSlider");
    if (volumeSlider) {
        const savedVolume = parseFloat(localStorage.getItem('x6RadioVolume'));
        audioPlayer.volume = !isNaN(savedVolume) ? savedVolume : 0.8;
        volumeSlider.value = audioPlayer.volume;
        volumeSlider.addEventListener("input", (e) => { const v = parseFloat(e.target.value); audioPlayer.volume = v; localStorage.setItem('x6RadioVolume', v); });
    }

    // ربط النقر على القلب لتبديل المفضلة
document.getElementById('favHeart')?.addEventListener('click', function(e) {
    e.stopPropagation();
    if (currentStation && currentStation.id) {
        toggleFavorite(currentStation.id);
        updateFavButtonCurrent(); // تحديث القلب والنص
        // تحديث باقي الواجهة
        if (typeof renderStations === 'function') renderStations();
        if (typeof renderFavoritesTab === 'function') renderFavoritesTab();
    }
});
        
  const searchInputEl = document.getElementById("searchInput");
if (searchInputEl) {
    searchInputEl.addEventListener("input", (e) => { 
        const val = e.target.value; 
        searchKeyword = val; 
        const searchQueryLabel = document.getElementById("searchQueryLabel");
        if (searchQueryLabel) searchQueryLabel.innerText = searchKeyword || "---"; 
        if (searchDebounceTimer) clearTimeout(searchDebounceTimer); 
        searchDebounceTimer = setTimeout(() => { 
            performSearch(searchKeyword); 
            // إذا كان الجوال والبحث فارغاً، نلغي البحث
            if (isMobile() && val.trim() === '' && window._searchActive) {
                cancelMobileSearch();
            }
            // في سطح المكتب نتحكم بالتبويب
            if (!isMobile()) {
                if (searchKeyword.trim() !== "") switchTab('search-tab'); 
                else if(currentTab === 'search-tab') switchTab('stations-tab'); 
            }
        }, 300); 
    });
}
    
    // أحداث التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => { const target = btn.dataset.tab; if (target) switchTab(target); }));
    const favoritesNavBtn = document.getElementById("favoritesNavBtn");
    if (favoritesNavBtn) favoritesNavBtn.addEventListener("click", () => switchTab('favorites-tab'));
    const stationsNavBtn = document.getElementById("stationsNavBtn");
    if (stationsNavBtn) stationsNavBtn.addEventListener("click", () => switchTab('stations-tab'));
    
    // النقر على البطاقات
    const containers = ['stationsContainer', 'favoritesContainer', 'searchResultsContainer'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) container.addEventListener('click', (e) => { const card = e.target.closest('.station-card'); if (!card) return; if (e.target.closest('.play-station-btn') || e.target.closest('.fav-star')) return; updateCurrentStationFromCard(card); });
    });
    
    // بدء العرض
    renderCountriesList();
    renderStations();
    restoreLastStationWithoutPlaying();
    initMenuBar();
    // تهيئة القوائم بالنقر
if (typeof initClickMenus === 'function') {
    initClickMenus();
}
    initHistoryEvents();
// ===== سجلات للتحقق من البيانات قبل عرض الواجهة =====
console.log('🔍 [appInit.js] Final check before render - Favorites:', favorites);
console.log('🔍 [appInit.js] Final check before render - History:', historyList);
console.log('🔍 [appInit.js] Final check before render - Master Stations:', masterStations.length);
    // تطبيق الثيم المحفوظ مع تأخير بسيط لضمان جاهزية electronAPI
setTimeout(() => {
    applyTheme(currentTheme);
}, 50);
    applyAllAdvancedSettings();
    updateSettingCheckmarks();
    bindSettingsMenuEvents();
    bindRecordButton();

// تهيئة معادل الصوت المتقدم
if (typeof initEqualizer === 'function') {
    initEqualizer();
}
        // استعادة وضع الصوت المخزن
    if (typeof restoreAudioPreset === 'function') {
        restoreAudioPreset();
    }

    if (window.electronAPI) {
        window.electronAPI.onUpdateAvailable(() => {
            setStatus(currentLanguage === 'ar' ? '📢 يتوفر تحديث جديد! جاري التحميل...' : '📢 New update available! Downloading...', false);
        });
        
        window.electronAPI.onUpdateDownloaded(() => {
            const userConfirmed = confirm(currentLanguage === 'ar' 
                ? 'تم تحميل التحديث. هل تريد تثبيته الآن؟ (سيتم إعادة تشغيل التطبيق)'
                : 'Update downloaded. Restart now to install?');
            if (userConfirmed && window.electronAPI.quitAndInstall) {
                window.electronAPI.quitAndInstall();
            }
        });
        
        window.electronAPI.onUpdateNotAvailable(() => {
            setStatus(currentLanguage === 'ar' ? '✅ لا توجد تحديثات متاحة. أنت تستخدم أحدث إصدار.' : '✅ No updates available. You are using the latest version.', false);
        });
        
        window.electronAPI.onUpdateError(() => {
            setStatus(currentLanguage === 'ar' ? '❌ فشل البحث عن تحديثات. تأكد من اتصالك بالإنترنت.' : '❌ Failed to check for updates. Check your internet connection.', true);
        });
    }

    // ربط زر تغيير أيقونة المحطة (ثلاث النقاط)
    const changeIconBtn = document.getElementById('changeIconBtn');
    if (changeIconBtn) {
        changeIconBtn.addEventListener('click', () => {
            if (currentStation && currentStation.id) {
                if (typeof changeStationIcon === 'function') {
                    changeStationIcon(currentStation.id);
                } else {
                    console.warn('changeStationIcon function not defined');
                }
            } else {
                setStatus(t('no_station_selected'), true);
            }
        });
    }
    
    setTimeout(() => {
        bindTimerSubmenu();
        bindStereoSubmenu();
        bindOutputSubmenu();
        bindThemeSubmenu();
    }, 500);
    
    // إصلاح تخطيط شريط التشغيل
    function fixPlayerBarOnceAndForAll() {
 if (isMobile()) return; // لا تفعل شيئاً في الجوال
        if (document.body.classList.contains('compact-mode')) return;
        const isElectron = !!(window.electronAPI && window.electronAPI.closeApp);
        const bottomValue = isElectron ? '400px' : '380px';
        const styleId = 'player-bar-fix';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .player-bar {
                    position: fixed !important;
                    bottom: ${bottomValue} !important;
                    left: 10px !important;
                    right: 10px !important;
                    z-index: 800 !important;
                }
            `;
            document.head.appendChild(style);
        }
        const player = document.querySelector('.player-bar');
        if (player) {
            player.style.setProperty('position', 'fixed', 'important');
            player.style.setProperty('bottom', bottomValue, 'important');
            player.style.setProperty('left', '10px', 'important');
            player.style.setProperty('right', '10px', 'important');
            player.style.setProperty('z-index', '1100', 'important');
        }
        console.log(`✅ fixPlayerBarOnceAndForAll: bottom = ${bottomValue} (Electron: ${isElectron})`);
    }

    fixPlayerBarOnceAndForAll();
    let fixInterval = setInterval(fixPlayerBarOnceAndForAll, 200);
    setTimeout(() => clearInterval(fixInterval), 3000);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) fixPlayerBarOnceAndForAll();
    });
    
    function fixTabScrolling() {
        const contentPanel = document.querySelector('.content-panel');
        const tabsContainer = document.querySelector('.tabs-container');
        const tabContent = document.querySelector('.tab-content');
        if (contentPanel && tabsContainer && tabContent) {
            contentPanel.style.display = 'flex';
            contentPanel.style.flexDirection = 'column';
            contentPanel.style.overflow = 'hidden';
            tabsContainer.style.flexShrink = '0';
            tabContent.style.flexGrow = '1';
            tabContent.style.overflowY = 'auto';
        }
    }
    setTimeout(fixTabScrolling, 100);
    setTimeout(fixTabScrolling, 500);

// ===== التحكم بشريط العنوان المخصص =====
const minimizeBtn = document.getElementById('minimizeBtn');
const maximizeBtn = document.getElementById('maximizeBtn');
const closeBtn = document.getElementById('closeBtn');

if (minimizeBtn && window.electronAPI) {
  minimizeBtn.addEventListener('click', () => {
    console.log('Minimize button clicked');
    window.electronAPI.minimizeWindow();
  });
} else {
  console.warn('Minimize button or electronAPI not found');
}

if (maximizeBtn && window.electronAPI) {
  maximizeBtn.addEventListener('click', () => {
    console.log('Maximize button clicked');
    window.electronAPI.maximizeWindow();
    // تحديث الأيقونة بعد تغيير الحالة
    setTimeout(() => {
      const isMax = window.electronAPI.isWindowMaximized();
      maximizeBtn.textContent = isMax ? '☐' : '☐';
    }, 100);
  });
  // تعيين الأيقونة الأولية
  setTimeout(() => {
    const isMax = window.electronAPI.isWindowMaximized();
    maximizeBtn.textContent = isMax ? '☐' : '☐';
  }, 500);
} else {
  console.warn('Maximize button or electronAPI not found');
}

if (closeBtn && window.electronAPI) {
  closeBtn.addEventListener('click', () => {
    console.log('Close button clicked');
    window.electronAPI.closeWindow();
  });
} else {
  console.warn('Close button or electronAPI not found');
}
   
    // ======================================================
    // كود خاص بالجوال (Mobile UI) - يوضع هنا بعد تهيئة كل شيء
    // ======================================================
(function initMobileUI() {
    // ✅ استخدام كشف أكثر موثوقية للجوال
    const isNative = !!(window.Capacitor && 
        window.Capacitor.isNativePlatform && 
        window.Capacitor.isNativePlatform());
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth <= 900; // ✅ توسيع الحد
    
    // إذا لم يكن جوال أصلي ولا شاشة لمس ولا شاشة صغيرة، اخرج
    if (!isNative && !isTouchDevice && !isSmallScreen) return;
    
    console.log('📱 initMobileUI: تهيئة واجهة الجوال');
    
    // 1. فتح/إغلاق القائمة الجانبية
    const btnOpen = document.getElementById('btnOpenDrawer');
    const btnClose = document.getElementById('btnCloseDrawer');
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawerOverlay');
    
    function openDrawer() {
        if (!drawer || !overlay) return;
        drawer.classList.add('open');
        overlay.classList.add('open');
        console.log('✅ Drawer opened');
    }
    
    function closeDrawer() {
        if (!drawer || !overlay) return;
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.querySelectorAll('.menu-group').forEach(g => g.classList.remove('open'));
        console.log('✅ Drawer closed');
    }
    
    // ✅ إضافة أحداث touch + click للضمان
    if (btnOpen) {
        btnOpen.addEventListener('click', openDrawer);
        btnOpen.addEventListener('touchend', function(e) {
            e.preventDefault();
            openDrawer();
        }, { passive: false });
        console.log('✅ btnOpen events attached');
    } else {
        console.warn('⚠️ btnOpenDrawer not found!');
    }
    
    if (btnClose) {
        btnClose.addEventListener('click', closeDrawer);
        btnClose.addEventListener('touchend', function(e) {
            e.preventDefault();
            closeDrawer();
        }, { passive: false });
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
        overlay.addEventListener('touchend', function(e) {
            e.preventDefault();
            closeDrawer();
        }, { passive: false });
    }
    
    // ... باقي الكود الأصلي كما هو (من "// 2. تبديل التبويبات" إلى النهاية)
// 2. تبديل التبويبات عبر الشريط السفلي (مع تجاهل المعادل)
// 2. تبديل التبويبات عبر الشريط السفلي
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        if (tabId && typeof switchTab === 'function') {
            switchTab(tabId);
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            closeDrawer();
        }
    });
});

// زر الرجوع من شاشة المعادل
document.getElementById('btnBackFromEq')?.addEventListener('click', function() {
    document.getElementById('eqScreen')?.classList.remove('open');
    // إلغاء التنشيط من الشريط السفلي
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
});

// إغلاق الشاشة عند النقر خارجها
document.getElementById('eqScreen')?.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('open');
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    }
});

    // 3. فتح/إغلاق شاشة الإعدادات الفرعية
    const settingsScreen = document.getElementById('settingsScreen');
    const btnOpenSettings = document.getElementById('menuOpenSettings');
    const btnBackSettings = document.getElementById('btnBackFromSettings');

    function openSettings() {
        if (settingsScreen) settingsScreen.classList.add('open');
        closeDrawer();
    }
    function closeSettings() {
        if (settingsScreen) settingsScreen.classList.remove('open');
        // إعادة فتح القائمة الجانبية بعد الخروج من الإعدادات
        openDrawer();
    }

    if (btnOpenSettings) btnOpenSettings.addEventListener('click', openSettings);
    if (btnBackSettings) btnBackSettings.addEventListener('click', closeSettings);

    // 4. فتح/إغلاق المجموعات الفرعية في القائمة الجانبية
    document.querySelectorAll('.menu-group-header').forEach(header => {
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            const group = this.closest('.menu-group');
            if (group) {
                // إغلاق المجموعات الأخرى
                document.querySelectorAll('.menu-group').forEach(g => {
                    if (g !== group) g.classList.remove('open');
                });
                group.classList.toggle('open');
            }
        });
    });

    // 5. ربط خيارات المؤقت (إيقاف بعد مدة)
    document.querySelectorAll('.timer-option').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const minutes = parseInt(this.dataset.minutes);
            if (typeof audioPlayer !== 'undefined' && audioPlayer && !audioPlayer.paused && typeof currentStation !== 'undefined' && currentStation) {
                if (typeof startTimer === 'function') {
                    startTimer(minutes);
                }
                if (typeof setStatus === 'function') {
                    setStatus(t('timer_set', minutes), false);
                }
                const valueSpan = document.getElementById('sleepTimerValue');
                if (valueSpan) {
                    valueSpan.textContent = minutes + ' ' + (currentLanguage === 'ar' ? 'دقيقة' : 'min');
                }
                const group = this.closest('.menu-group');
                if (group) group.classList.remove('open');
            } else {
                if (typeof setStatus === 'function') {
                    setStatus(t('no_active_stream'), true);
                }
            }
        });
    });

    // 6. زر إلغاء المؤقت
    const cancelTimerBtn = document.getElementById('timerCancelOption');
    if (cancelTimerBtn) {
        cancelTimerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (typeof stopTimerAndClear === 'function') {
                stopTimerAndClear();
            }
            const valueSpan = document.getElementById('sleepTimerValue');
            if (valueSpan) {
                valueSpan.textContent = currentLanguage === 'ar' ? 'إيقاف' : 'Off';
            }
            if (typeof setStatus === 'function') {
                setStatus(currentLanguage === 'ar' ? '✅ تم إلغاء المؤقت' : '✅ Timer cancelled', false);
            }
            const group = this.closest('.menu-group');
            if (group) group.classList.remove('open');
        });
    }

    // 7. مفاتيح الإعدادات (Switches)
    document.querySelectorAll('.switch[data-setting]').forEach(sw => {
        sw.addEventListener('click', function(e) {
            e.stopPropagation();
            const setting = this.dataset.setting;
            const current = this.dataset.on === 'true';
            const newVal = !current;
            this.dataset.on = newVal ? 'true' : 'false';

            if (setting === 'autoResume') {
                if (typeof autoResume !== 'undefined') {
                    autoResume = newVal;
                    localStorage.setItem('x6RadioAutoResume', newVal);
                    if (typeof setStatus === 'function') {
                        setStatus(t('auto_resume_toggled', newVal ? 'enabled' : 'disabled'), false);
                    }
                }
            } else if (setting === 'autoClearHistory') {
                if (typeof applyAdvancedSetting === 'function') {
                    applyAdvancedSetting('autoClearHistory', newVal);
                }
            } else if (setting === 'visualizer') {
                if (typeof applyAdvancedSetting === 'function') {
                    applyAdvancedSetting('visualizer', newVal);
                }
                const canvas = document.getElementById('audioVisualizerCanvas');
                if (canvas) canvas.style.display = newVal ? 'block' : 'none';
                const wrapper = document.getElementById('audioVisualizerWrapper');
                if (wrapper) wrapper.style.display = newVal ? 'block' : 'none';
            } else if (setting === 'recordIcon') {
                if (typeof applyAdvancedSetting === 'function') {
                    applyAdvancedSetting('recordIcon', newVal);
                }
                const recordBtn = document.getElementById('recordIconBtn');
                if (recordBtn) recordBtn.style.display = newVal ? 'flex' : 'none';
            }
            if (typeof updateSettingCheckmarks === 'function') updateSettingCheckmarks();
        });
    });

    // 8. أزرار اختيار القيم (value buttons) في الإعدادات
    document.querySelectorAll('.value-btn[data-setting]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const setting = this.dataset.setting;
            const options = this.dataset.options.split(',');
            const currentText = this.textContent.trim();
            let selected = prompt('اختر القيمة:', currentText);
            if (selected !== null) {
                selected = selected.trim();
                if (options.some(opt => opt.trim() === selected)) {
                    this.childNodes[0].textContent = selected;
                    if (setting === 'autoResumeDelay') {
                        const val = parseFloat(selected);
                        if (!isNaN(val) && typeof applyAdvancedSetting === 'function') {
                            applyAdvancedSetting('autoResumeDelay', val);
                            if (typeof setStatus === 'function') {
                                setStatus(`${t('settings_auto_resume_delay')} ${val} ${currentLanguage === 'ar' ? 'ثانية' : 'sec'}`, false);
                            }
                        }
                    } else if (setting === 'fontSize') {
                        const map = { 'كبير': 'large', 'متوسط': 'medium', 'صغير': 'small' };
                        const val = map[selected] || selected;
                        if (typeof applyAdvancedSetting === 'function') {
                            applyAdvancedSetting('fontSize', val);
                        }
                    } else if (setting === 'language') {
                        const map = { 'العربية': 'ar', 'الإنجليزية': 'en' };
                        const lang = map[selected] || selected;
                        if (typeof applyLanguage === 'function') {
                            applyLanguage(lang);
                        }
                    }
                    if (typeof updateSettingCheckmarks === 'function') updateSettingCheckmarks();
                } else {
                    alert('قيمة غير صالحة. اختر من: ' + options.join(', '));
                }
            }
        });
    });

    // 9. أزرار المظهر (Theme chips)
    document.querySelectorAll('#themeChips .chip').forEach(chip => {
        chip.addEventListener('click', function() {
            const theme = this.dataset.theme;
            if (theme && typeof applyTheme === 'function') {
                applyTheme(theme);
                document.querySelectorAll('#themeChips .chip').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                closeDrawer();
            }
        });
    });

// ===== ضاغط الصوت - Switch =====
const compressorSwitch = document.getElementById('compressorSwitch');
if (compressorSwitch) {
    function updateCompressorSwitch() {
        compressorSwitch.dataset.on = isCompressorActive ? 'true' : 'false';
    }
    updateCompressorSwitch();

    compressorSwitch.addEventListener('click', function(e) {
        e.stopPropagation();
        if (typeof toggleCompressor === 'function') {
            toggleCompressor();
            setTimeout(updateCompressorSwitch, 50);
        }
    });
}

// ===== فصل ستيريو - أزرار =====
const stereoButtons = document.querySelectorAll('.stereo-btn');
if (stereoButtons.length) {
    // تحديث الحالة النشطة بناءً على isStereoModeActive والمخزن
    function updateStereoButtons() {
        let activeMode = 'center';
        if (isStereoModeActive) {
            // نحدد الوضع الحالي من الـ stereo panner
            if (typeof stereoPanner !== 'undefined' && stereoPanner) {
                const pan = stereoPanner.pan.value;
                if (pan === -1) activeMode = 'left';
                else if (pan === 1) activeMode = 'right';
                else activeMode = 'center';
            }
        }
        stereoButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.stereo === activeMode);
        });
    }
    updateStereoButtons();

    stereoButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const mode = this.dataset.stereo;
            // تطبيق الوضع
            if (typeof applyStereoMode === 'function') {
                applyStereoMode(mode);
            }
            // تحديث الواجهة
            stereoButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // تحديث قيمة isStereoModeActive (افتراض أن applyStereoMode يضبطها)
            // ويمكن تحديث الـ switch الخاص بالستيريو إن وجد
        });
    });
}

// ===== جهاز إخراج - أزرار =====
const outputButtons = document.querySelectorAll('.output-btn');
if (outputButtons.length) {
    // تحديث الحالة النشطة
    function updateOutputButtons() {
        // نقرأ من localStorage أو من الإعداد الحالي
        const currentDevice = localStorage.getItem('x6RadioOutputDevice') || 'default';
        outputButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.device === currentDevice);
        });
    }
    updateOutputButtons();

    outputButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const device = this.dataset.device;
            if (device === 'default') {
                if (typeof setAudioOutputDevice === 'function') {
                    setAudioOutputDevice('');
                }
                localStorage.setItem('x6RadioOutputDevice', 'default');
            } else if (device === 'select') {
                if (typeof selectAndSetAudioOutput === 'function') {
                    selectAndSetAudioOutput();
                }
                // لا نغير الـ localStorage هنا لأن المستخدم سيختار جهازاً
                // يمكن تعيينه لاحقاً عند النجاح
            }
            outputButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===== إضافة مستمع لتحديث زر الجهاز بعد الاختيار =====
// إذا تم اختيار جهاز عبر selectAndSetAudioOutput، نضبط الزر النشط
if (window.electronAPI && window.electronAPI.onAudioOutputChanged) {
    window.electronAPI.onAudioOutputChanged((deviceId) => {
        // نبحث عن الزر المطابق إذا كان deviceId معروفاً، وإلا نضبط default
        const defaultBtn = document.querySelector('.output-btn[data-device="default"]');
        const selectBtn = document.querySelector('.output-btn[data-device="select"]');
        if (deviceId && deviceId !== '') {
            // إذا كان هناك جهاز محدد، نفعّل زر "جهاز آخر"
            if (selectBtn) {
                outputButtons.forEach(b => b.classList.remove('active'));
                selectBtn.classList.add('active');
            }
        } else {
            if (defaultBtn) {
                outputButtons.forEach(b => b.classList.remove('active'));
                defaultBtn.classList.add('active');
            }
        }
    });
}
// ===== تهيئة أزرار الخيارات في الإعدادات =====
function initOptionButtons() {
    document.querySelectorAll('.option-group').forEach(group => {
        const setting = group.dataset.setting;
        // تحديد القيمة الحالية من localStorage أو المتغيرات العامة
        let currentValue = null;
        if (setting === 'autoResumeDelay') {
            currentValue = String(advancedSettings.autoResumeDelay || 0.5);
        } else if (setting === 'fontSize') {
            currentValue = advancedSettings.fontSize || 'medium';
        } else if (setting === 'language') {
            currentValue = advancedSettings.language || 'ar';
        }

        // تعيين الحالة النشطة
        group.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === currentValue);
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.dataset.value;
                // تطبيق الإعداد
                if (setting === 'autoResumeDelay') {
                    if (typeof applyAdvancedSetting === 'function') {
                        applyAdvancedSetting('autoResumeDelay', parseFloat(value));
                    }
                    if (typeof setStatus === 'function') {
                        setStatus(`${t('settings_auto_resume_delay')} ${value} ${currentLanguage === 'ar' ? 'ثانية' : 'sec'}`, false);
                    }
                } else if (setting === 'fontSize') {
                    if (typeof applyAdvancedSetting === 'function') {
                        applyAdvancedSetting('fontSize', value);
                    }
                } else if (setting === 'language') {
                    if (typeof applyLanguage === 'function') {
                        applyLanguage(value);
                    }
                }
                // تحديث الحالة النشطة
                group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
}
// ===== دائماً في المقدمة - Switch =====
const alwaysOnTopSwitch = document.getElementById('alwaysOnTopSwitch');
if (alwaysOnTopSwitch) {
    // تحديث الحالة عند التحميل
    function updateAlwaysOnTopSwitch() {
        if (window.electronAPI && window.electronAPI.getAlwaysOnTop) {
            window.electronAPI.getAlwaysOnTop().then(isOnTop => {
                alwaysOnTopSwitch.dataset.on = isOnTop ? 'true' : 'false';
            }).catch(() => {});
        }
    }
    updateAlwaysOnTopSwitch();

    alwaysOnTopSwitch.addEventListener('click', function(e) {
        e.stopPropagation();
        if (typeof toggleAlwaysOnTop === 'function') {
            toggleAlwaysOnTop();
            // تحديث الـ Switch بعد تغيير الحالة
            setTimeout(updateAlwaysOnTopSwitch, 200);
        } else {
            // إذا كانت الدالة غير معرفة، استخدم التنفيذ المباشر
            if (window.electronAPI && window.electronAPI.setAlwaysOnTop) {
                const newState = this.dataset.on !== 'true';
                window.electronAPI.setAlwaysOnTop(newState);
                this.dataset.on = newState ? 'true' : 'false';
                if (typeof setStatus === 'function') {
                    setStatus(newState ? '✅ تم تفعيل دائماً في المقدمة' : '✅ تم إلغاء دائماً في المقدمة', false);
                }
            }
        }
    });
}

// استدعاء التهيئة بعد تحميل DOM (ضمن initMobileUI)
initOptionButtons();

    // محاولة تهيئة السياق
    if (window.analyserNode && window.audioCtx) {
        isContextReady = true;
        console.log("✅ analyserNode و audioCtx جاهزان");
    } else {
        const checkInterval = setInterval(() => {
            if (window.analyserNode && window.audioCtx) {
                isContextReady = true;
                clearInterval(checkInterval);
                console.log("✅ analyserNode جاهز بعد الانتظار");
            }
        }, 500);
        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    console.log("✅ مؤشر الصوت الجديد (15 عامود) جاهز");
})();
});

// ========== دوال التحديث (HTML) ==========
function updateCurrentStationNameAndCountry() {
    const nameEl = document.getElementById("currentStationName");
    const countryWrapper = document.getElementById("currentStationCountry");
    if (!nameEl || !countryWrapper) return;
    
    if (currentStation && currentStation.name) {
        nameEl.innerText = currentStation.name;
        let countryDisplay = currentStation.country || '';
        if (currentStation.countryCode) {
            const countryObj = allCountries.find(c => c.code === currentStation.countryCode);
            if (countryObj) {
                countryDisplay = currentLanguage === 'en' ? countryObj.name : countryObj.nameAr;
            }
        }
        // عرض أيقونة الدبوس + اسم الدولة
        countryWrapper.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${countryDisplay}`;
    } else {
        nameEl.innerText = t('current_station_default');
        countryWrapper.innerHTML = '';
    }
}

// تعديل الدوال التي كانت تستخدم canvas لاستدعاء دالة HTML بدلاً من ذلك
function updateCurrentStationCountry() {
    updateCurrentStationNameAndCountry();
}

// تعديل restoreLastStationWithoutPlaying لاستخدام HTML بدلاً من canvas
function restoreLastStationWithoutPlaying() {
    // ===== استعادة آخر محطة تم تشغيلها =====
    const saved = localStorage.getItem('x6RadioCurrentStation');
    if (saved) {
        try {
            const savedStation = JSON.parse(saved);
            const stillExists = masterStations.some(st => st.id === savedStation.id);
            if (stillExists && savedStation.url) {
                currentStation = savedStation;
                if (!currentStation.countryCode && currentStation.id) {
                    const stationObj = masterStations.find(s => s.id === currentStation.id);
                    if (stationObj && stationObj.countryCode) {
                        currentStation.countryCode = stationObj.countryCode;
                        localStorage.setItem('x6RadioCurrentStation', JSON.stringify(currentStation));
                    }
                }
                updateCurrentStationNameAndCountry();
                updateFavButtonCurrent();
                if (currentStation.id) updateStationIcon(currentStation.id);
                const playPauseBtn = document.getElementById("playPauseBtn");
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                updateStationPlayButtons(null, false);
                setStatus('', false);
                if (autoResume) {
                    setTimeout(() => {
                        playStation(currentStation.url, currentStation.name, currentStation.country, currentStation.id, currentStation.isWebPage || false);
                        setStatus(`${currentLanguage === 'ar' ? '🔄 تشغيل تلقائي' : '🔄 Auto-resume'}: ${currentStation.name}`, false);
                    }, advancedSettings.autoResumeDelay * 1000);
                }
                // 🔥 لا نعيد تعيين currentFilterItem هنا، نتركه كما هو
                return;
            }
        } catch(e) {}
    }

    // ===== استعادة آخر دولة مختارة من localStorage =====
    const savedCountry = localStorage.getItem('x6RadioLastCountry');
    if (savedCountry) {
        const found = allCountries.find(c => c.code === savedCountry);
        if (found) {
            currentFilterItem = found;
            renderCountriesList();
            updateHeaderForFilter(currentFilterItem);
            renderStations();
            return;
        }
    }

    // ===== إذا لم توجد دولة محفوظة، نضع currentFilterItem = null (صفحة الترحيب) =====
    currentFilterItem = null;
    renderCountriesList();
    updateHeaderForFilter(currentFilterItem);
    renderStations();
}

// ربط الدوال للنوافذ (نفس ما كان موجوداً)
window.renderStations = renderStations;
window.renderFavoritesTab = renderFavoritesTab;
window.performSearch = performSearch;
window.switchTab = switchTab;
window.playStation = playStation;
window.stopPlayback = stopPlayback;
window.toggleFavorite = toggleFavorite;
window.getStationsByFilter = getStationsByFilter;
window.updateStationIcon = updateStationIcon;
window.resetAddStationForm = resetAddStationForm;
window.renderHistoryTab = renderHistoryTab;
window.addNewStationFromForm = addNewStationFromForm;
window.populateCountrySelect = populateCountrySelect;
window.updateCurrentStationCountry = updateCurrentStationCountry;
window.updateCurrentStationNameAndCountry = updateCurrentStationNameAndCountry;

// ============================================================
//  ضبط التخطيط تلقائياً عند تغيير حجم النافذة (لـ Windows)
//  لا يؤثر على وضع ملء الشاشة (Maximized / Fullscreen)
// ============================================================
(function setupResponsiveLayout() {
    'use strict';

    // 1. تعريف نقاط التحول (breakpoints) – يمكنك تعديلها حسب رغبتك
    const BREAKPOINTS = {
        LARGE: 1200,    // أكبر من 1200 بكسل → تخطيط عادي (ملء الشاشة)
        MEDIUM: 992,    // بين 992 و 1200 → تخطيط متوسط (تصغير طفيف)
        SMALL: 768,     // بين 768 و 992 → تخطيط ضيق
        TINY: 576       // أقل من 576 → تخطيط مكثف جداً
    };

    // 2. دالة تحديث التصنيفات بناءً على العرض الحالي
    function updateLayoutClasses() {
        // نأخذ عرض النافذة (بدون احتساب شريط التمرير)
        const width = window.innerWidth;

        // نزيل جميع التصنيفات القديمة
        document.body.classList.remove(
            'layout-large',
            'layout-medium',
            'layout-small',
            'layout-tiny'
        );

        // نضيف التصنيف المناسب
        if (width >= BREAKPOINTS.LARGE) {
            document.body.classList.add('layout-large');
        } else if (width >= BREAKPOINTS.MEDIUM) {
            document.body.classList.add('layout-medium');
        } else if (width >= BREAKPOINTS.SMALL) {
            document.body.classList.add('layout-small');
        } else {
            document.body.classList.add('layout-tiny');
        }
    }

    // 3. استدعاء الدالة فوراً عند التحميل
    updateLayoutClasses();

    // 4. مراقبة تغيير الحجم مع تحسين الأداء (باستخدام requestAnimationFrame)
    let resizeTimer = null;
    window.addEventListener('resize', function() {
        if (resizeTimer) {
            cancelAnimationFrame(resizeTimer);
        }
        resizeTimer = requestAnimationFrame(function() {
            updateLayoutClasses();
            resizeTimer = null;
        });
    });

    console.log('✅ تم تفعيل التخطيط المتجاوب للشاشات الصغيرة.');
})();
// =========================================================
// مؤشر الصوت البصري - يعمل في كل الأحجام (حتى في وضع أفقي عند التحميل)
// =========================================================
(function initAudioVisualizer() {
    const npEqualizer = document.getElementById('npEqualizer');
    if (!npEqualizer) {
        console.warn('⚠️ npEqualizer element not found');
        return;
    }

    // إنشاء Canvas إذا لم يكن موجوداً
    let canvas = npEqualizer.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'audioVisualizerCanvasMobile';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        npEqualizer.innerHTML = '';
        npEqualizer.appendChild(canvas);
        console.log('✅ Canvas created for audio visualizer');
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("❌ لا يمكن الحصول على سياق الرسم للمؤشر الصوتي");
        return;
    }

    // ------------------- إعدادات الألوان والثوابت -------------------
    function getThemeColors() {
        const body = document.body;
        let blue, orange, red;
        if (!body.classList.contains('light-theme') &&
            !body.classList.contains('dark-high-contrast') &&
            !body.classList.contains('red-theme')) {
            blue = '#33aaff';
            orange = '#cc0000';
            red = '#cc0000';
        } else if (body.classList.contains('light-theme')) {
            blue = '#33aaff';
            orange = '#cc0000';
            red = '#cc0000';
        } else if (body.classList.contains('dark-high-contrast')) {
            blue = '#33aaff';
            orange = '#cc0000';
            red = '#cc0000';
        } else if (body.classList.contains('red-theme')) {
            blue = '#33aaff';
            orange = '#cc0000';
            red = '#cc0000';
        }
        return { neonBlue: blue, neonOrange: orange, neonRed: red };
    }

    const colors = getThemeColors();
    const neonBlue = colors.neonBlue;
    const neonOrange = colors.neonOrange;
    const neonRed = colors.neonRed;

    const NUM_BARS = 15;
    const BAR_GAP = 1;
    const GRAVITY = 2.4;
    const PEAK_GRAVITY = 0.7;
    const HOLD_TIME_FRAMES = 35;

    const binsPerBar = [
        1, 3, 5, 8, 12, 17, 24, 33, 45, 60, 80, 105, 135, 170, 200
    ];

    let currentHeights = new Float32Array(NUM_BARS);
    let peakHeights = new Float32Array(NUM_BARS);
    let peakHoldTimers = new Int32Array(NUM_BARS);

    let isActive = false;
    let animationId = null;
    let isContextReady = false;

    // ------------------- دالة تغيير الحجم -------------------
    function resizeCanvas() {
        const rect = npEqualizer.getBoundingClientRect();
        let width = Math.max(rect.width, 100);
        let height = Math.max(rect.height, 40);
        // في حالة iPad أو أي شاشة كبيرة، نضمن ارتفاعاً مناسباً
        if (window.innerWidth > 768) {
            height = Math.max(rect.height, 60);
        }
        // تأكد من أن العرض والارتفاع أرقام صالحة
        if (width < 10 || height < 10) {
            width = Math.max(npEqualizer.clientWidth, 100);
            height = Math.max(npEqualizer.clientHeight, 40);
        }
        canvas.width = width;
        canvas.height = height;
        currentHeights.fill(0);
        peakHeights.fill(0);
        peakHoldTimers.fill(0);
        console.log(`✅ Canvas resized to ${width}x${height}`);
    }

    // ------------------- رسم أعمدة فارغة (عند التوقف) -------------------
    function drawEmptyBars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / NUM_BARS) - BAR_GAP;
        ctx.fillStyle = 'rgba(51, 170, 255, 0.08)';
        for (let i = 0; i < NUM_BARS; i++) {
            const x = (i * (barWidth + BAR_GAP)) + 2;
            ctx.fillRect(x, canvas.height - 0, barWidth, 3);
        }
    }

    // ------------------- دالة الرسم الرئيسية -------------------
    function drawBars() {
        if (!isActive || !isContextReady || !window.analyserNode) {
            drawEmptyBars();
            animationId = requestAnimationFrame(drawBars);
            return;
        }

        const bufferLength = window.analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        window.analyserNode.getByteFrequencyData(dataArray);

        const targetHeights = new Float32Array(NUM_BARS);
        const maxHeight = canvas.height;

        for (let i = 0; i < NUM_BARS; i++) {
            let sum = 0;
            let count = 0;
            const start = binsPerBar[i];
            const end = (i < NUM_BARS - 1) ? binsPerBar[i + 1] - 1 : bufferLength - 1;

            for (let bin = start; bin <= end && bin < bufferLength; bin++) {
                sum += dataArray[bin];
                count++;
            }
            let avg = count > 0 ? sum / count : 0;

            if (i >= 4 && i <= 6) avg *= 1.1;
            if (i >= 7 && i <= 9) avg *= 1.2;
            if (i > 9) avg *= 1.25;
            if (i > 12) avg *= 1.3;
            if (i === NUM_BARS - 1) avg *= 2.3;

            targetHeights[i] = (Math.min(avg, 255) / 255) * maxHeight;
            if (targetHeights[i] < 0) targetHeights[i] = 0;
        }

        for (let i = 0; i < NUM_BARS; i++) {
            if (targetHeights[i] > currentHeights[i]) {
                currentHeights[i] = targetHeights[i];
            } else {
                currentHeights[i] -= GRAVITY;
                if (currentHeights[i] < 0) currentHeights[i] = 0;
            }

            if (currentHeights[i] >= peakHeights[i]) {
                peakHeights[i] = currentHeights[i];
                peakHoldTimers[i] = HOLD_TIME_FRAMES;
            } else {
                if (peakHoldTimers[i] > 0) {
                    peakHoldTimers[i]--;
                } else {
                    peakHeights[i] -= PEAK_GRAVITY;
                    if (peakHeights[i] < 0) peakHeights[i] = 0;
                }
            }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isActive) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
            ctx.lineWidth = 1;
            for (let y = 0; y < canvas.height; y += 10) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }

        const barWidth = (canvas.width / NUM_BARS) - BAR_GAP;
        const segmentHeight = 2;
        const segmentGap = 1;

        const BLUE_PERCENT = 0.80;
        const ORANGE_PERCENT = 0.10;
        const RED_PERCENT = 0.10;

        const blueHeight = maxHeight * BLUE_PERCENT;
        const orangeHeight = maxHeight * ORANGE_PERCENT;

        for (let i = 0; i < NUM_BARS; i++) {
            const x = (i * (barWidth + BAR_GAP)) + 2;
            const barHeight = currentHeights[i];
            const totalSegments = Math.floor(barHeight / (segmentHeight + segmentGap));

            for (let j = 0; j < totalSegments; j++) {
                const y = canvas.height - 0 - (j * (segmentHeight + segmentGap));
                const pixelFromBottom = j * (segmentHeight + segmentGap);

                let color;
                if (pixelFromBottom < blueHeight) {
                    color = neonBlue;
                } else if (pixelFromBottom < blueHeight + orangeHeight) {
                    color = neonOrange;
                } else {
                    color = neonRed;
                }

                ctx.fillStyle = color;
                ctx.fillRect(x, y, barWidth, segmentHeight);
            }

            if (peakHeights[i] > 0) {
                const peakY = canvas.height - 0 - (Math.floor(peakHeights[i] / (segmentHeight + segmentGap)) * (segmentHeight + segmentGap));
                const peakPixel = Math.floor(peakHeights[i] / (segmentHeight + segmentGap)) * (segmentHeight + segmentGap);

                let peakColor;
                if (peakPixel < blueHeight) peakColor = neonBlue;
                else if (peakPixel < blueHeight + orangeHeight) peakColor = neonOrange;
                else peakColor = neonRed;

                ctx.fillStyle = peakColor;
                ctx.fillRect(x, peakY, barWidth, segmentHeight);
            }
        }

        animationId = requestAnimationFrame(drawBars);
    }

    // ------------------- تهيئة الحجم وبدء الحلقة -------------------
    // تأخير صغير للتأكد من أن العنصر له أبعاد
    setTimeout(() => {
        resizeCanvas();
        drawBars();
    }, 100);

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        resizeObserver.observe(npEqualizer);
    }

    // ------------------- ربط أحداث التشغيل والإيقاف -------------------
    if (window.audioPlayer) {
        window.audioPlayer.addEventListener('play', () => {
            console.log("🎵 تشغيل الصوت، تنشيط المؤشر");
            isActive = true;
            if (window.audioCtx && window.audioCtx.state === 'suspended') {
                window.audioCtx.resume().then(() => console.log("✅ AudioContext resumed"));
            }
            if (window.analyserNode) {
                isContextReady = true;
            }
        });

        window.audioPlayer.addEventListener('pause', () => {
            console.log("⏸️ إيقاف مؤقت، إيقاف المؤشر");
            isActive = false;
        });

        window.audioPlayer.addEventListener('ended', () => {
            console.log("⏹️ انتهى التشغيل، إيقاف المؤشر");
            isActive = false;
        });
    }

    // محاولة تهيئة السياق
    if (window.analyserNode && window.audioCtx) {
        isContextReady = true;
        console.log("✅ analyserNode و audioCtx جاهزان");
    } else {
        const checkInterval = setInterval(() => {
            if (window.analyserNode && window.audioCtx) {
                isContextReady = true;
                clearInterval(checkInterval);
                console.log("✅ analyserNode جاهز بعد الانتظار");
            }
        }, 500);
        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    console.log("✅ مؤشر الصوت (Canvas) جاهز");
})();
function updateThemeChips(theme) {
    document.querySelectorAll('#themeChips .chip').forEach(chip => {
        // إذا كان الثيم "default" ولا يوجد كلاس مطابق، نفعّل زر الافتراضي
        const isActive = (theme === 'default' && chip.dataset.theme === 'default') ||
                         chip.dataset.theme === theme;
        chip.classList.toggle('active', isActive);
    });
}