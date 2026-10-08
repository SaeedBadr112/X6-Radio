// keyboardShortcuts.js - نسخة تعمل بغض النظر عن لغة لوحة المفاتيح
// تعتمد على e.code (الرمز الفيزيائي) بدلاً من e.key

function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;
        const alt = e.altKey;
        const code = e.code;
        let key = e.key.toLowerCase();

        if (key === 'control' || key === 'shift' || key === 'alt' || key === 'meta') return;

        const handledCodes = [
            'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
            'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4',
            'KeyP', 'Space', 'KeyS',
            'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft',
            'KeyE', 'KeyF', 'KeyJ', 'KeyO', 'KeyN', 'KeyI', 'KeyQ', 'KeyW',
            'KeyL', 'KeyC', 'KeyD', 'KeyT', 'KeyK', 'KeyA', 'KeyG',
            'KeyH', 'Digit0', 'Digit9', 'KeyY', 'KeyM', 'KeyZ', 'KeyR',
            'KeyU', 'KeyV', 'KeyX', 'KeyB', 'Slash', 'IntlBackslash',
            'F1', 'F2', 'F3', 'F10', 'F11', 'F12'
        ];

        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isInputFocused = (activeTag === 'input' || activeTag === 'textarea');

        const preventDefault = () => {
            e.preventDefault();
            e.stopPropagation();
        };

        let handled = false;
        if (ctrl && shift) {
            if (handledCodes.includes(code)) handled = true;
        } else if (ctrl && !shift && !alt) {
            if (handledCodes.includes(code)) handled = true;
        } else if (shift && !ctrl && !alt) {
            if (!isInputFocused && handledCodes.includes(code)) handled = true;
        }
        if (handled) preventDefault();

// ========== إعادة ضبط التطبيق إلى حالة المصنع (Ctrl+Shift+Alt+R) ==========
if (ctrl && shift && alt && code === 'KeyR') {
    e.preventDefault();
    const userConfirmed = confirm(t('confirm_reset_app'));
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

    // 3. إعادة تحميل الصفحة (سيؤدي إلى تهيئة كل شيء من الصفر)
    location.reload();
    return;
}


// ========== فتح أدوات المطور (Ctrl+Shift+Alt+N) ==========
if (ctrl && shift && alt && code === 'KeyE') {
    e.preventDefault();
    if (window.electronAPI && window.electronAPI.openDevTools) {
        window.electronAPI.openDevTools();
    } else {
        // إذا لم تكن electronAPI متاحة، استخدم الطريقة المباشرة في المتصفح
        if (typeof window.openDevTools === 'function') {
            window.openDevTools();
        } else {
            console.warn('DevTools not available');
        }
    }
    return;
}

        // ========== 1. Ctrl + Shift ==========
        if (ctrl && shift) {
            switch (code) {
                case 'Digit1': startTimer(20); setStatus(t('timer_set',20),false); break;
                case 'Digit2': startTimer(40); setStatus(t('timer_set',40),false); break;
                case 'Digit3': startTimer(60); setStatus(t('timer_set',60),false); break;
                case 'Digit4': startTimer(80); setStatus(t('timer_set',80),false); break;
                case 'Numpad1': startTimer(20); setStatus(t('timer_set',20),false); break;
                case 'Numpad2': startTimer(40); setStatus(t('timer_set',40),false); break;
                case 'Numpad3': startTimer(60); setStatus(t('timer_set',60),false); break;
                case 'Numpad4': startTimer(80); setStatus(t('timer_set',80),false); break;
                case 'KeyZ': shuffleRandomStation(); break;
                case 'KeyT': toggleAlwaysOnTop(); break;
                case 'KeyU':
                    if (window.electronAPI && window.electronAPI.checkForUpdates) {
                        window.electronAPI.checkForUpdates();
                        setStatus(t('checking_for_updates'), false);
                    } else {
                        const isPackaged = window.electronAPI && window.electronAPI.isPackaged ? window.electronAPI.isPackaged : false;
                        if (!isPackaged) setStatus(t('updates_only_in_production'), true);
                        else setStatus(t('updates_not_supported'), true);
                    }
                    break;
                case 'KeyX': exportStations(); break;
                case 'KeyA': autoResume = true; localStorage.setItem('x6RadioAutoResume','true'); setStatus(t('auto_resume_toggled','enabled'),false); updateSettingCheckmarks(); break;
                case 'KeyD': autoResume = false; localStorage.setItem('x6RadioAutoResume','false'); setStatus(t('auto_resume_toggled','disabled'),false); updateSettingCheckmarks(); break;
                case 'Digit5': applyAdvancedSetting('autoResumeDelay',0.5); updateSettingCheckmarks(); break;
                case 'Digit6': applyAdvancedSetting('autoResumeDelay',1); updateSettingCheckmarks(); break;
                case 'Digit7': applyAdvancedSetting('autoResumeDelay',2); updateSettingCheckmarks(); break;
                case 'Digit8': applyAdvancedSetting('autoResumeDelay',3); updateSettingCheckmarks(); break;
                case 'KeyV': applyAdvancedSetting('visualizer',true); updateSettingCheckmarks(); break;
                case 'KeyB': applyAdvancedSetting('visualizer',false); updateSettingCheckmarks(); break;
                case 'KeyH': applyAdvancedSetting('autoClearHistory',true); updateSettingCheckmarks(); break;
                case 'KeyJ': applyAdvancedSetting('autoClearHistory',false); updateSettingCheckmarks(); break;
                case 'KeyE': applyAdvancedSetting('recordIcon',false); updateSettingCheckmarks(); break;
                case 'KeyR': applyAdvancedSetting('recordIcon',true); updateSettingCheckmarks(); setStatus(t('settings_record_icon')+' '+(currentLanguage==='ar'?'ظاهرة':'Visible'),false); break;
                case 'KeyY': showLicense(); break;
                case 'KeyI': showAbout(); break;
                case 'KeyM': openAdvancedSettingsModal(); break;
                case 'KeyK': showKeyboardShortcutsModal(); break;
                case 'KeyG': openSourceLink(); break;
                case 'KeyN': showReleaseNotes(); break;
                case 'KeyF': sendFeedback(); break;
                case 'Slash':
                case 'IntlBackslash':
                    showDebugInfo();
                    break;
                case 'F10': applyAdvancedSetting('fontSize','small'); updateSettingCheckmarks(); break;
                case 'F11': applyAdvancedSetting('fontSize','medium'); updateSettingCheckmarks(); break;
                case 'F12': applyAdvancedSetting('fontSize','large'); updateSettingCheckmarks(); break;
                case 'F1': applyTheme('default'); break;
                case 'F2': applyTheme('dark'); break;
                case 'F3': applyTheme('light'); break;
                case 'F4': applyTheme('red'); break;
                default: break;
            }
            return;
        }

        // ========== 2. Ctrl فقط ==========
        if (ctrl && !shift && !alt) {
            switch (code) {
                case 'Digit1': switchTab('stations-tab'); break;
                case 'Digit2': switchTab('favorites-tab'); break;
                case 'Digit3': switchTab('search-tab'); break;
                case 'Digit4': switchTab('add-station-tab'); break;
                case 'Digit5': switchTab('history-tab'); break;
                case 'Numpad1': switchTab('stations-tab'); break;
                case 'Numpad2': switchTab('favorites-tab'); break;
                case 'Numpad3': switchTab('search-tab'); break;
                case 'Numpad4': switchTab('add-station-tab'); break;
                case 'Numpad5': switchTab('history-tab'); break;
                case 'KeyP':
                case 'Space':
                    if (audioPlayer.paused) {
                        if (currentStation?.url) playStation(currentStation.url, currentStation.name, currentStation.country, currentStation.id, currentStation.isWebPage || false);
                        else setStatus(t('no_station_selected'), true);
                    } else {
                        audioPlayer.pause();
                        updatePlayPauseButton(false);
                        if (currentStation) updateStationPlayButtons(currentStation.id, false);
                    }
                    break;
                case 'KeyS':
                    // Ctrl+S -> تشغيل المحطة التالية
                    if (typeof playNextStation === 'function') playNextStation();
                    else setStatus(t('no_stations'), true);
                    break;
                case 'ArrowUp':
                case 'ArrowRight':
                    let vUp = Math.min(1, audioPlayer.volume + 0.05);
                    audioPlayer.volume = vUp;
                    const volSliderUp = document.getElementById("volumeSlider");
                    if (volSliderUp) volSliderUp.value = vUp;
                    localStorage.setItem('x6RadioVolume', vUp);
                    setStatus(`🔊 ${Math.round(vUp*100)}%`, false);
                    break;
                case 'ArrowDown':
                case 'ArrowLeft':
                    let vDown = Math.max(0, audioPlayer.volume - 0.05);
                    audioPlayer.volume = vDown;
                    const volSliderDown = document.getElementById("volumeSlider");
                    if (volSliderDown) volSliderDown.value = vDown;
                    localStorage.setItem('x6RadioVolume', vDown);
                    setStatus(`🔉 ${Math.round(vDown*100)}%`, false);
                    break;
                case 'KeyR': shuffleRandomStation(); break;
                case 'KeyF': document.getElementById('searchInput')?.focus(); setStatus('🔎 '+(currentLanguage==='ar'?'ابحث':'Search'),false); break;
                case 'KeyJ': toggleCompressor(); break;
                case 'KeyO':
                    window.customPrompt(currentLanguage === 'ar' ? 'أدخل رابط البث المباشر (URL):' : 'Enter stream URL:').then(url => {
                        if (url?.trim()) playStation(url.trim(), currentLanguage === 'ar' ? 'رابط مخصص' : 'Custom URL', currentLanguage === 'ar' ? 'رابط خارجي' : 'External Link', 'custom_' + Date.now(), false);
                    });
                    break;
                case 'KeyN': switchTab('add-station-tab'); break;
                case 'KeyI':
                    const input = document.createElement('input');
                    input.type='file'; input.accept='application/json';
                    input.onchange=(ev)=>{
                        const file=ev.target.files[0];
                        if(!file) return;
                        const reader=new FileReader();
                        reader.onload=(evLoad)=>{
                            try{
                                const imported=JSON.parse(evLoad.target.result);
                                if(Array.isArray(imported)){
                                    masterStations=[...masterStations,...imported];
                                    const unique=new Map();
                                    masterStations.forEach(st=>unique.set(st.id,st));
                                    masterStations=Array.from(unique.values());
                                    saveMasterStations(); renderStations(); if(typeof renderFavoritesTab==='function') renderFavoritesTab();
                                    setStatus(t('stations_imported',imported.length),false);
                                } else throw new Error();
                            } catch(err){ setStatus(t('invalid_file'),true); }
                        };
                        reader.readAsText(file);
                    };
                    input.click();
                    break;
                case 'KeyQ':
                case 'KeyW':
                    if(confirm(t('confirm_exit'))){
                        if(window.electronAPI) window.electronAPI.closeApp();
                        else window.close();
                    }
                    break;
                default: break;
            }
            return;
        }

// ========== 4. Ctrl + Alt (تغيير اللغة) ==========
if (ctrl && alt && !shift) {
    switch (code) {
        case 'KeyA': applyAdvancedSetting('language','ar'); updateSettingCheckmarks(); break; // العربية
        case 'KeyE': applyAdvancedSetting('language','en'); updateSettingCheckmarks(); break; // الإنجليزية
        case 'KeyF': applyAdvancedSetting('language','fr'); updateSettingCheckmarks(); break; // الفرنسية
        case 'KeyS': applyAdvancedSetting('language','es'); updateSettingCheckmarks(); break; // الإسبانية
        case 'KeyP': applyAdvancedSetting('language','pt'); updateSettingCheckmarks(); break; // البرتغالية
        case 'KeyD': applyAdvancedSetting('language','de'); updateSettingCheckmarks(); break; // الألمانية
    }
    return;
}

        // ========== 3. Shift فقط (بدون Ctrl) – لا تعمل في حقول الإدخال ==========
        if (shift && !ctrl && !alt) {
            if (isInputFocused) return;
            switch (code) {
                case 'KeyL': applyStereoMode('left'); break;
                case 'KeyE': applyStereoMode('right'); break;
                case 'KeyC': applyStereoMode('center'); break;
                case 'Digit0': setAudioOutputDevice(''); setStatus(t('output_device_default'),false); break;
                case 'Digit9': selectAndSetAudioOutput(); break;
                case 'KeyH': sayHello(); break;
                case 'KeyP':
                    if (audioPlayer.paused && currentStation?.url)
                        playStation(currentStation.url, currentStation.name, currentStation.country, currentStation.id, currentStation.isWebPage || false);
                    else if (!audioPlayer.paused) audioPlayer.play();
                    break;
                case 'KeyS':
                    // Shift+S -> تشغيل المحطة التالية
                    if (typeof playNextStation === 'function') playNextStation();
                    else setStatus(t('no_stations'), true);
                    break;
                case 'ArrowUp':
                    let vUp = Math.min(1, audioPlayer.volume + 0.05);
                    audioPlayer.volume = vUp;
                    const volUp = document.getElementById("volumeSlider");
                    if (volUp) volUp.value = vUp;
                    localStorage.setItem('x6RadioVolume', vUp);
                    setStatus(`🔊 ${Math.round(vUp*100)}%`, false);
                    break;
                case 'ArrowDown':
                    let vDown = Math.max(0, audioPlayer.volume - 0.05);
                    audioPlayer.volume = vDown;
                    const volDown = document.getElementById("volumeSlider");
                    if (volDown) volDown.value = vDown;
                    localStorage.setItem('x6RadioVolume', vDown);
                    setStatus(`🔉 ${Math.round(vDown*100)}%`, false);
                    break;
                case 'KeyR': shuffleRandomStation(); break;
                case 'KeyF': document.getElementById('searchInput')?.focus(); break;
                case 'KeyJ': toggleCompressor(); break;
                case 'KeyO':
                    window.customPrompt(currentLanguage === 'ar' ? 'أدخل رابط البث المباشر (URL):' : 'Enter stream URL:').then(url => {
                        if (url?.trim()) playStation(url.trim(), currentLanguage === 'ar' ? 'رابط مخصص' : 'Custom URL', currentLanguage === 'ar' ? 'رابط خارجي' : 'External Link', 'custom_' + Date.now(), false);
                    });
                    break;
                case 'KeyN': switchTab('add-station-tab'); break;
                case 'Digit1': switchTab('stations-tab'); break;
                case 'Digit2': switchTab('favorites-tab'); break;
                case 'Digit3': switchTab('search-tab'); break;
                case 'Digit4': switchTab('add-station-tab'); break;
                case 'Digit5': switchTab('history-tab'); break;
                default: break;
            }
            return;
        }

        function shuffleRandomStation() {
            if (masterStations.length) {
                const st = masterStations[Math.floor(Math.random() * masterStations.length)];
                const cObj = allCountries.find(c => c.code === st.countryCode);
                playStation(st.streamUrl, st.name, cObj ? getCountryDisplayName(cObj, currentLanguage) : st.countryCode, st.id, st.isWebPage || false);
            } else setStatus(t('no_stations'), true);
        }
    });
}

function showKeyboardShortcutsModal() {
    let modal = document.getElementById('shortcutsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shortcutsModal';
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-content">
                <h2>${t('shortcuts_title')}</h2>
                <div class="shortcuts-grid">
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_general')}</h3>
                        <div class="shortcut-item"><span>${t('shortcuts_play_pause')}</span><span class="shortcut-key">Ctrl+P / Space / Shift+P</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_next_station')}</span><span class="shortcut-key">Ctrl+S / Shift+S</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_volume_up')}</span><span class="shortcut-key">Ctrl+↑ / Ctrl+→ / Shift+↑</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_volume_down')}</span><span class="shortcut-key">Ctrl+↓ / Ctrl+← / Shift+↓</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_shuffle')}</span><span class="shortcut-key">Ctrl+R / Shift+R / Ctrl+Shift+Z</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_search')}</span><span class="shortcut-key">Ctrl+F / Shift+F</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_compressor')}</span><span class="shortcut-key">Ctrl+J / Shift+J</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_always_on_top')}</span><span class="shortcut-key">Ctrl+Shift+T</span></div>
                    </div>
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_file')}</h3>
                        <div class="shortcut-item"><span>${t('shortcuts_open_url')}</span><span class="shortcut-key">Ctrl+O / Shift+O</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_add_station')}</span><span class="shortcut-key">Ctrl+N / Shift+N</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_import_stations')}</span><span class="shortcut-key">Ctrl+I</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_export_stations')}</span><span class="shortcut-key">Ctrl+Shift+X</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_exit')}</span><span class="shortcut-key">Ctrl+Q / Ctrl+W</span></div>
                    </div>
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_view')}</h3>
                        <div class="shortcut-item"><span>${t('shortcuts_stations_tab')}</span><span class="shortcut-key">Ctrl+1 / Shift+1</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_favorites_tab')}</span><span class="shortcut-key">Ctrl+2 / Shift+2</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_search_tab')}</span><span class="shortcut-key">Ctrl+3 / Shift+3</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_add_station_tab')}</span><span class="shortcut-key">Ctrl+4 / Shift+4</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_history_tab')}</span><span class="shortcut-key">Ctrl+5 / Shift+5</span></div>
                    </div>
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_advanced_audio')}</h3>
                        <div class="shortcut-item"><span>${t('shortcuts_stereo_left')}</span><span class="shortcut-key">Shift+L</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_stereo_right')}</span><span class="shortcut-key">Shift+E</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_stereo_center')}</span><span class="shortcut-key">Shift+C</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_default_output')}</span><span class="shortcut-key">Shift+0</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_select_output')}</span><span class="shortcut-key">Shift+9</span></div>
                    </div>
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_stop_timer')}</h3>
                        <div class="shortcut-item"><span>${t('minutes_format', 20)}</span><span class="shortcut-key">Ctrl+Shift+1</span></div>
                        <div class="shortcut-item"><span>${t('minutes_format', 40)}</span><span class="shortcut-key">Ctrl+Shift+2</span></div>
                        <div class="shortcut-item"><span>${t('minutes_format', 60)}</span><span class="shortcut-key">Ctrl+Shift+3</span></div>
                        <div class="shortcut-item"><span>${t('minutes_format', 80)}</span><span class="shortcut-key">Ctrl+Shift+4</span></div>
                    </div>
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_settings')}</h3>
                        <div class="shortcut-item"><span>${t('shortcuts_enable_auto_resume')}</span><span class="shortcut-key">Ctrl+Shift+A</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_disable_auto_resume')}</span><span class="shortcut-key">Ctrl+Shift+D</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_delay_0.5')}</span><span class="shortcut-key">Ctrl+Shift+5</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_delay_1')}</span><span class="shortcut-key">Ctrl+Shift+6</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_delay_2')}</span><span class="shortcut-key">Ctrl+Shift+7</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_delay_3')}</span><span class="shortcut-key">Ctrl+Shift+8</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_font_small')}</span><span class="shortcut-key">Ctrl+Shift+F10</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_font_medium')}</span><span class="shortcut-key">Ctrl+Shift+F11</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_font_large')}</span><span class="shortcut-key">Ctrl+Shift+F12</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_language_arabic')}</span><span class="shortcut-key">Ctrl+Alt+A</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_language_english')}</span><span class="shortcut-key">Ctrl+Alt+E</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_language_spanish')}</span><span class="shortcut-key">Ctrl+Alt+S</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_language_french')}</span><span class="shortcut-key">Ctrl+Alt+F</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_language_german')}</span><span class="shortcut-key">Ctrl+Alt+D</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_language_portuguese')}</span><span class="shortcut-key">Ctrl+Alt+P</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_enable_auto_clear')}</span><span class="shortcut-key">Ctrl+Shift+H</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_disable_auto_clear')}</span><span class="shortcut-key">Ctrl+Shift+J</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_enable_visualizer')}</span><span class="shortcut-key">Ctrl+Shift+V</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_disable_visualizer')}</span><span class="shortcut-key">Ctrl+Shift+B</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_hide_record_icon')}</span><span class="shortcut-key">Ctrl+Shift+E</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_show_record_icon')}</span><span class="shortcut-key">Ctrl+Shift+R</span></div>
                    </div>
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_themes')}</h3>
                        <div class="shortcut-item"><span>${t('shortcuts_theme_default')}</span><span class="shortcut-key">Ctrl+Shift+F1</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_theme_dark')}</span><span class="shortcut-key">Ctrl+Shift+F2</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_theme_light')}</span><span class="shortcut-key">Ctrl+Shift+F3</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_theme_red')}</span><span class="shortcut-key">Ctrl+Shift+F4</span></div>
                    </div>
                    <div class="shortcut-category">
                        <h3>${t('shortcuts_help')}</h3>
                        <div class="shortcut-item"><span>${t('shortcuts_show_shortcuts')}</span><span class="shortcut-key">Ctrl+Shift+K</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_debug_info')}</span><span class="shortcut-key">Ctrl+Shift+?</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_check_updates')}</span><span class="shortcut-key">Ctrl+Shift+U</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_reset_app')}</span><span class="shortcut-key">Ctrl+Shift+Alt+R</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_send_feedback')}</span><span class="shortcut-key">Ctrl+Shift+F</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_open_source')}</span><span class="shortcut-key">Ctrl+Shift+G</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_release_notes')}</span><span class="shortcut-key">Ctrl+Shift+N</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_say_hello')}</span><span class="shortcut-key">Shift+H</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_license')}</span><span class="shortcut-key">Ctrl+Shift+Y</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_advanced_settings')}</span><span class="shortcut-key">Ctrl+Shift+M</span></div>
                        <div class="shortcut-item"><span>${t('shortcuts_about')}</span><span class="shortcut-key">Ctrl+Shift+I</span></div>
                    </div>
                </div>
                <button class="close-modal">${t('shortcuts_close')}</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
    modal.classList.add('active');
}

window.showKeyboardShortcutsModal = showKeyboardShortcutsModal;

function toggleAlwaysOnTop() {
   if (!window.electronAPI) {
    setStatus(t('always_on_top_electron_only'), true);
    return;
}
    if (window.electronAPI.getAlwaysOnTop) {
        window.electronAPI.getAlwaysOnTop().then(isOnTop => {
            const newState = !isOnTop;
            window.electronAPI.setAlwaysOnTop(newState);
            updateAlwaysOnTopMenuState(newState);
            setStatus(newState ? t('always_on_top_enabled') : t('always_on_top_disabled'), false);
        }).catch(err => {
            console.error('Error getting always on top state:', err);
            window.electronAPI.setAlwaysOnTop(true);
            updateAlwaysOnTopMenuState(true);
        });
    } else {
        window.electronAPI.setAlwaysOnTop(true);
        updateAlwaysOnTopMenuState(true);
        setStatus(t('always_on_top_set'), false);
    }
}

function updateAlwaysOnTopMenuState(isActive) {
    const menuItem = document.getElementById('menuAlwaysOnTop');
    if (!menuItem) return;
    let checkmark = menuItem.querySelector('.checkmark');
    if (isActive) {
        if (!checkmark) {
            checkmark = document.createElement('span');
            checkmark.className = 'checkmark';
            checkmark.textContent = ' ✓';
            checkmark.style.color = '#3b82f6';
            checkmark.style.fontWeight = 'bold';
            menuItem.appendChild(checkmark);
        }
    } else {
        if (checkmark) checkmark.remove();
    }
}

if (window.electronAPI && window.electronAPI.onShortcutTriggered) {
  window.electronAPI.onShortcutTriggered((shortcut, minutes) => {
    console.log('Shortcut from main:', shortcut, minutes);
    if (shortcut === 'ctrl+o') {
      window.customPrompt(currentLanguage === 'ar' ? 'أدخل رابط البث المباشر (URL):' : 'Enter stream URL:').then(url => {
        if (url?.trim()) playStation(url.trim(), currentLanguage === 'ar' ? 'رابط مخصص' : 'Custom URL', currentLanguage === 'ar' ? 'رابط خارجي' : 'External Link', 'custom_' + Date.now(), false);
      });
    } else if (shortcut.startsWith('ctrl+shift+numpad')) {
      if (minutes) startTimer(minutes);
      setStatus(t('timer_set', minutes), false);
    } else if (shortcut.startsWith('ctrl+numpad')) {
      const num = shortcut.slice(-1);
      switch (num) {
        case '1': switchTab('stations-tab'); break;
        case '2': switchTab('favorites-tab'); break;
        case '3': switchTab('search-tab'); break;
        case '4': switchTab('add-station-tab'); break;
        case '5': switchTab('history-tab'); break;
        default: break;
      }
    }
  });
}

function safeInitKeyboardShortcuts() {
    if (typeof startTimer !== 'undefined' && 
        typeof applyAdvancedSetting !== 'undefined' && 
        typeof updateSettingCheckmarks !== 'undefined' &&
        typeof applyTheme !== 'undefined' &&
        typeof playNextStation !== 'undefined') {
        initKeyboardShortcuts();
        console.log('✅ Keyboard shortcuts initialized successfully');
    } else {
        console.log('⏳ Waiting for dependencies...');
        setTimeout(safeInitKeyboardShortcuts, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInitKeyboardShortcuts);
} else {
    safeInitKeyboardShortcuts();
}