// ========== معادل الصوت المتقدم ==========
let eqSliders = [];
let currentEqGains = [];

// ========== دالة للتحقق من حالة الحفظ المخصص ==========
function isCustomSaved() {
    return localStorage.getItem('eqCustomSaved') === 'true';
}

function setCustomSavedState(state) {
    localStorage.setItem('eqCustomSaved', state ? 'true' : 'false');
}

// ========== التحقق من تطابق القيم مع الإعدادات المسبقة ==========
function matchPreset(gains) {
    try {
        const presets = window.AUDIO_PRESETS || {};
        for (const key in presets) {
            if (key === 'custom') continue;
            const preset = presets[key];
            if (preset.gains && preset.gains.length === gains.length) {
                if (preset.gains.every((v, i) => v === gains[i])) {
                    return key;
                }
            }
        }
        return null;
    } catch (e) {
        console.warn('matchPreset error:', e);
        return null;
    }
}

// ========== تحديث نصوص الأزرار عند تغيير اللغة ==========
function updateEqualizerButtonsText() {
    // زر إعادة الضبط
    const resetBtn = document.getElementById('eqResetBtn');
    if (resetBtn) {
        resetBtn.innerHTML = `<i class="fas fa-undo-alt"></i> ${t('eq_reset')}`;
    }

    // زر حفظ مخصص
    const saveBtn = document.getElementById('eqSaveCustomBtn');
    if (saveBtn) {
        const isSaved = isCustomSaved();
        if (isSaved) {
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = `<i class="fas fa-check"></i> ${t('eq_saved_success')}`;
        } else {
            saveBtn.classList.remove('saved');
            saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t('eq_save_custom')}`;
        }
    }

    // زر تطبيق (إن وجد)
    const applyBtn = document.getElementById('eqApplyPresetBtn');
    if (applyBtn) {
        applyBtn.innerHTML = `<i class="fas fa-check"></i> ${t('eq_apply')}`;
    }
}

// تهيئة المعادل
function initEqualizer() {
    const container = document.getElementById('eq-sliders');
    if (!container) return;


    // ===== استعادة حالة المعادل من localStorage =====
    const savedState = localStorage.getItem('x6RadioEqEnabled');
    if (savedState !== null) {
        isEqualizerEnabled = (savedState === 'true');
    } else {
        // إذا لم توجد قيمة، نضع القيمة الافتراضية true ونخزنها
        isEqualizerEnabled = true;
        localStorage.setItem('x6RadioEqEnabled', 'true');
    }


    // ربط زر الطاقة
    const powerBtn = document.getElementById('eqPowerBtn');
    if (powerBtn) {
        powerBtn.classList.toggle('active', isEqualizerEnabled);
        if (!isEqualizerEnabled) {
            document.querySelectorAll('.eq-slider').forEach(s => s.disabled = true);
        }
        powerBtn.removeEventListener('click', togglePowerHandler);
        powerBtn.addEventListener('click', togglePowerHandler);
    }

    container.innerHTML = '';
    eqSliders = [];
    const savedGains = localStorage.getItem('x6RadioEqGains');
    if (savedGains) {
        try {
            currentEqGains = JSON.parse(savedGains);
            if (currentEqGains.length !== EQ_BANDS) currentEqGains = new Array(EQ_BANDS).fill(0);
        } catch (e) {
            currentEqGains = new Array(EQ_BANDS).fill(0);
        }
    } else {
        currentEqGains = new Array(EQ_BANDS).fill(0);
    }

    for (let i = 0; i < EQ_BANDS; i++) {
        const freq = EQ_FREQUENCIES[i];
        const div = document.createElement('div');
        div.className = 'eq-slider-container';
        div.setAttribute('data-band', i);
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = -12;
        slider.max = 12;
        slider.step = 0.5;
        slider.value = currentEqGains[i] || 0;
        slider.className = 'eq-slider';
        slider.setAttribute('data-band', i);
        slider.title = `${freq} Hz`;
        const label = document.createElement('span');
        label.className = 'eq-frequency-label';
        label.textContent = freq >= 1000 ? (freq/1000).toFixed(0) + 'k' : freq;
        const valueLabel = document.createElement('span');
        valueLabel.className = 'eq-value-label';
        valueLabel.textContent = (slider.value > 0 ? '+' : '') + slider.value + 'dB';
        div.appendChild(label);
        div.appendChild(slider);
        div.appendChild(valueLabel);
        container.appendChild(div);
        eqSliders.push(slider);
        
        slider.addEventListener('input', function() {
            const band = parseInt(this.dataset.band);
            const val = parseFloat(this.value);
            currentEqGains[band] = val;
            
            const parent = this.parentElement;
            const valLabel = parent.querySelector('.eq-value-label');
            if (valLabel) valLabel.textContent = (val > 0 ? '+' : '') + val + 'dB';
            
            if (typeof window.updateEqualizer === 'function') {
                window.updateEqualizer(currentEqGains);
            }
            localStorage.setItem('x6RadioEqGains', JSON.stringify(currentEqGains));
            
            const matched = matchPreset(currentEqGains);
            const presetSelect = document.getElementById('eqPresetSelect');
            if (matched) {
                localStorage.setItem('x6RadioAudioPreset', matched);
                if (presetSelect) presetSelect.value = matched;
            } else {
                localStorage.setItem('x6RadioAudioPreset', 'custom');
                if (presetSelect) presetSelect.value = 'custom';
                // حفظ القيم المخصصة تلقائياً عند التعديل اليدوي
                localStorage.setItem('x6RadioCustomEqGains', JSON.stringify(currentEqGains));
            }
            if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
            if (typeof updatePresetButtons === 'function') updatePresetButtons();
            
            // ✅ إعادة زر "حفظ مخصص" إلى اللون الأصفر عند تغيير أي شريط
            setCustomSavedState(false);
            const saveBtn = document.getElementById('eqSaveCustomBtn');
            if (saveBtn) {
                saveBtn.classList.remove('saved');
                saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t('eq_save_custom')}`;
            }
        });
    }

    populatePresetSelect();

    // ===== زر إعادة الضبط =====
    document.getElementById('eqResetBtn')?.addEventListener('click', function() {
        if (typeof window.resetEqualizer === 'function') {
            window.resetEqualizer();
            eqSliders.forEach((slider, i) => {
                slider.value = 0;
                const parent = slider.parentElement;
                const valLabel = parent.querySelector('.eq-value-label');
                if (valLabel) valLabel.textContent = '0dB';
                currentEqGains[i] = 0;
            });
            localStorage.setItem('x6RadioEqGains', JSON.stringify(currentEqGains));
            const presetSelect = document.getElementById('eqPresetSelect');
            if (presetSelect) presetSelect.value = 'flat';
            if (typeof window.applyAudioPreset === 'function') {
                window.applyAudioPreset('flat');
            }
            if (typeof setStatus === 'function') setStatus(t('eq_reset_done'), false);
            if (typeof updatePresetButtons === 'function') updatePresetButtons();
            
            // إعادة زر الحفظ إلى الأصفر
            setCustomSavedState(false);
            const saveBtn = document.getElementById('eqSaveCustomBtn');
            if (saveBtn) {
                saveBtn.classList.remove('saved');
                saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t('eq_save_custom')}`;
            }
        }
    });

    // ===== زر حفظ الإعداد المخصص (بدون طلب اسم) =====
    document.getElementById('eqSaveCustomBtn')?.addEventListener('click', function() {
        // إنشاء اسم افتراضي بناءً على الوقت
        const now = new Date();
        const defaultName = (currentLanguage === 'ar' ? 'مخصص ' : 'Custom ') + now.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        const key = 'custom_' + Date.now();
        const gains = currentEqGains.slice();
        
        // حفظ في AUDIO_PRESETS
        AUDIO_PRESETS[key] = { name: defaultName, gains: gains };
        
        // حفظ في localStorage
        localStorage.setItem('x6RadioCustomPreset_' + key, JSON.stringify(gains));
        
        // ✅ تحديث حالة الحفظ في localStorage
        setCustomSavedState(true);
        
        // تغيير لون الزر إلى الأخضر (تأكيد الحفظ) مع النص المترجم
        this.classList.add('saved');
        this.innerHTML = `<i class="fas fa-check"></i> ${t('eq_saved_success')}`;
        
        // إضافة الخيار إلى القائمة المنسدلة
        const select = document.getElementById('eqPresetSelect');
        if (select) {
            // إزالة الخيار المكرر إن وجد
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === key) {
                    select.remove(i);
                    break;
                }
            }
            const option = document.createElement('option');
            option.value = key;
            option.textContent = defaultName;
            select.appendChild(option);
            select.value = key;
        }
        
        if (typeof setStatus === 'function') {
            setStatus(t('eq_preset_saved', defaultName), false);
        }
    });

    // ===== زر تطبيق الإعداد المسبق =====
    document.getElementById('eqApplyPresetBtn')?.addEventListener('click', function() {
        const select = document.getElementById('eqPresetSelect');
        if (!select) return;
        const presetKey = select.value;
        if (presetKey && presetKey !== 'custom' && typeof window.applyAudioPreset === 'function') {
            window.applyAudioPreset(presetKey);
            const preset = AUDIO_PRESETS[presetKey];
            if (preset) {
                eqSliders.forEach((slider, i) => {
                    const val = preset.gains[i] || 0;
                    slider.value = val;
                    const parent = slider.parentElement;
                    const valLabel = parent.querySelector('.eq-value-label');
                    if (valLabel) valLabel.textContent = (val > 0 ? '+' : '') + val + 'dB';
                    currentEqGains[i] = val;
                });
                localStorage.setItem('x6RadioEqGains', JSON.stringify(currentEqGains));
                if (typeof setStatus === 'function') setStatus(t('eq_preset_applied', preset.name), false);
                if (typeof updatePresetButtons === 'function') updatePresetButtons();
            }
        } else if (presetKey === 'custom') {
            // تطبيق الإعداد المخصص الحالي (الأشرطة الحالية)
            if (typeof window.updateEqualizer === 'function') {
                window.updateEqualizer(currentEqGains);
            }
            if (typeof setStatus === 'function') setStatus(t('eq_custom_applied'), false);
        }
    });

    // تطبيق القيم الأولية
    if (typeof window.updateEqualizer === 'function') {
        window.updateEqualizer(currentEqGains);
    }
    if (typeof updatePresetDisplay === 'function') updatePresetDisplay();

    window.onEqualizerUpdate = function(gains) {
        if (!gains || gains.length !== EQ_BANDS) return;
        eqSliders.forEach((slider, i) => {
            const val = gains[i] || 0;
            slider.value = val;
            const parent = slider.parentElement;
            const valLabel = parent.querySelector('.eq-value-label');
            if (valLabel) valLabel.textContent = (val > 0 ? '+' : '') + val + 'dB';
        });
        currentEqGains = gains.slice();
        localStorage.setItem('x6RadioEqGains', JSON.stringify(currentEqGains));
        const select = document.getElementById('eqPresetSelect');
        if (select) {
            const matched = matchPreset(gains);
            if (matched) {
                select.value = matched;
                localStorage.setItem('x6RadioAudioPreset', matched);
            } else {
                select.value = 'custom';
                localStorage.setItem('x6RadioAudioPreset', 'custom');
                localStorage.setItem('x6RadioCustomEqGains', JSON.stringify(gains));
            }
        }
        if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
        if (typeof updatePresetButtons === 'function') updatePresetButtons();
    };

    createPresetButtons();
    
    // تحديث نصوص الأزرار بعد الإنشاء مع استعادة حالة الحفظ
    updateEqualizerButtonsText();
}

function togglePowerHandler() {
    if (typeof window.toggleEqualizer === 'function') {
        window.toggleEqualizer();
    } else {
        console.error('❌ window.toggleEqualizer غير معرفة');
    }
}

function populatePresetSelect() {
    const select = document.getElementById('eqPresetSelect');
    if (!select) return;
    while (select.options.length > 0) select.remove(0);
    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = currentLanguage === 'ar' ? 'مخصص' : 'Custom';
    select.appendChild(customOpt);
    for (const key in AUDIO_PRESETS) {
        if (key.startsWith('custom_')) continue;
        const preset = AUDIO_PRESETS[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = currentLanguage === 'ar' ? preset.name : key.charAt(0).toUpperCase() + key.slice(1);
        select.appendChild(option);
    }
    // إضافة المخصصات المحفوظة
    for (const key in AUDIO_PRESETS) {
        if (key.startsWith('custom_')) {
            const preset = AUDIO_PRESETS[key];
            const option = document.createElement('option');
            option.value = key;
            option.textContent = preset.name;
            select.appendChild(option);
        }
    }
    const currentPreset = localStorage.getItem('x6RadioAudioPreset') || 'flat';
    if (AUDIO_PRESETS[currentPreset]) {
        select.value = currentPreset;
    } else {
        select.value = 'custom';
    }
}

// ========== إنشاء أزرار أوضاع الصوت ==========
function createPresetButtons() {
    const container = document.getElementById('eqPresetButtons');
    if (!container) return;
    container.innerHTML = '';
    const order = window.PRESET_ORDER || ['flat', 'rock', 'pop', 'jazz', 'classical', 'dance', 'ballad', 'rnb', 'hiphop', 'custom'];
    order.forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'eq-preset-btn';
        btn.dataset.preset = key;
        btn.textContent = window.getPresetDisplayName ? window.getPresetDisplayName(key) : key;
        btn.addEventListener('click', function() {
            const preset = this.dataset.preset;
            if (preset === 'custom') {
                // استعادة القيم المخصصة المحفوظة
                const savedCustomGains = localStorage.getItem('x6RadioCustomEqGains');
                if (savedCustomGains) {
                    try {
                        const gains = JSON.parse(savedCustomGains);
                        if (gains && gains.length === EQ_BANDS) {
                            currentEqGains = gains.slice();
                            eqSliders.forEach((slider, i) => {
                                const val = gains[i] || 0;
                                slider.value = val;
                                const parent = slider.parentElement;
                                const valLabel = parent.querySelector('.eq-value-label');
                                if (valLabel) valLabel.textContent = (val > 0 ? '+' : '') + val + 'dB';
                            });
                            localStorage.setItem('x6RadioEqGains', JSON.stringify(gains));
                            if (typeof window.updateEqualizer === 'function') {
                                window.updateEqualizer(gains);
                            }
                        }
                    } catch (e) {
                        console.warn('⚠️ Could not restore custom gains:', e);
                    }
                }
                localStorage.setItem('x6RadioAudioPreset', 'custom');
                if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
                if (typeof updatePresetButtons === 'function') updatePresetButtons();
            } else {
                if (typeof window.applyAudioPreset === 'function') {
                    window.applyAudioPreset(preset);
                }
            }
        });
        container.appendChild(btn);
    });
    updatePresetButtons();
}

function updatePresetButtons() {
    const isEnabled = (typeof isEqualizerEnabled !== 'undefined') ? isEqualizerEnabled : true;
    const current = localStorage.getItem('x6RadioAudioPreset') || 'flat';
    
    document.querySelectorAll('.eq-preset-btn').forEach(btn => {
        if (!isEnabled) {
            btn.classList.remove('active');
            return;
        }
        const isActive = btn.dataset.preset === current;
        btn.classList.toggle('active', isActive);
    });
}

window.updatePresetButtons = updatePresetButtons;
window.onPresetChanged = function() {
    updatePresetButtons();
    if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
};

// ===== استدعاء تحديث الترجمة عند تغيير اللغة =====
window.addEventListener('languageChanged', () => {
    populatePresetSelect();
    updateEqualizerButtonsText();
    // تحديث أزرار أوضاع الصوت العشرة أيضاً
    if (typeof createPresetButtons === 'function') {
        createPresetButtons();
    }
});

// استدعاء التهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEqualizer);
} else {
    initEqualizer();
}

// تحديث نصوص الأزرار بعد التحميل مباشرة (ضمان)
setTimeout(updateEqualizerButtonsText, 200);