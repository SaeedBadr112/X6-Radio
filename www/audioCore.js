// ========== Web Audio ==========
async function initWebAudio() {
    if (audioCtx) return true;

    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        sourceNode = audioCtx.createMediaElementSource(audioPlayer);
        gainNode = audioCtx.createGain();
        compressorNode = audioCtx.createDynamicsCompressor();
        stereoPanner = audioCtx.createStereoPanner();
        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 1024;
        analyserNode.smoothingTimeConstant = 0.85;
        sourceNode.connect(compressorNode);
        compressorNode.connect(stereoPanner);
        stereoPanner.connect(gainNode);
        gainNode.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);
        window.audioCtx = audioCtx;
        window.sourceNode = sourceNode;
        window.analyserNode = analyserNode;
        console.log("✅ تم تهيئة Web Audio وربط analyserNode عالميًا");
        return true;
    } catch (e) {
        console.error("❌ فشل تهيئة Web Audio:", e);
        return false;
    }
}

async function resumeAudioContext() {
    if (audioCtx && audioCtx.state === 'suspended') await audioCtx.resume();
}

function enableAudioContextOnUserInteraction() {
    if (audioCtx && audioCtx.state === 'suspended') {
        const resume = () => {
            audioCtx.resume().then(() => console.log("✅ AudioContext تم تفعيله بنقرة المستخدم"));
            document.removeEventListener('click', resume);
            document.removeEventListener('touchstart', resume);
        };
        document.addEventListener('click', resume);
        document.addEventListener('touchstart', resume);
    }
}

function ensureAnalyserConnection() {
    if (gainNode && analyserNode && audioCtx) {
        try {
            gainNode.disconnect(analyserNode);
            gainNode.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);
            console.log("✅ analyserNode متصل بشكل صحيح");
        } catch(e) { console.warn("ensureAnalyserConnection error", e); }
    }
}

async function toggleCompressor() {
    if (!await initWebAudio()) { if (typeof setStatus === 'function') setStatus(t('not_supported'), true); return; }
    await resumeAudioContext();
    try {
        sourceNode.disconnect();
        if (!isCompressorActive) {
            sourceNode.connect(compressorNode);
            compressorNode.connect(gainNode);
            isCompressorActive = true;
            if (typeof setStatus === 'function') setStatus(t('compressor_on'), false);
        } else {
            sourceNode.connect(gainNode);
            isCompressorActive = false;
            if (typeof setStatus === 'function') setStatus(t('compressor_off'), false);
        }
        if (isStereoModeActive) {
            const currentPan = stereoPanner.pan.value;
            if (currentPan !== 0) {
                sourceNode.disconnect();
                if (isCompressorActive) {
                    sourceNode.connect(compressorNode);
                    compressorNode.connect(stereoPanner);
                } else {
                    sourceNode.connect(stereoPanner);
                }
                stereoPanner.connect(gainNode);
            }
        }
        ensureAnalyserConnection();
    } catch(e) { if (typeof setStatus === 'function') setStatus(t('compressor_error'), true); }
}

async function applyStereoMode(direction) {
    if (!await initWebAudio()) return;
    await resumeAudioContext();
    try {
        sourceNode.disconnect();
        if (direction === 'left') {
            stereoPanner.pan.value = -1;
            if (isCompressorActive) {
                sourceNode.connect(compressorNode);
                compressorNode.connect(stereoPanner);
            } else {
                sourceNode.connect(stereoPanner);
            }
            stereoPanner.connect(gainNode);
            isStereoModeActive = true;
            if (typeof setStatus === 'function') setStatus(t('stereo_left'), false);
        } else if (direction === 'right') {
            stereoPanner.pan.value = 1;
            if (isCompressorActive) {
                sourceNode.connect(compressorNode);
                compressorNode.connect(stereoPanner);
            } else {
                sourceNode.connect(stereoPanner);
            }
            stereoPanner.connect(gainNode);
            isStereoModeActive = true;
            if (typeof setStatus === 'function') setStatus(t('stereo_right'), false);
        } else {
            if (isCompressorActive) {
                sourceNode.connect(compressorNode);
                compressorNode.connect(gainNode);
            } else {
                sourceNode.connect(gainNode);
            }
            isStereoModeActive = false;
            if (typeof setStatus === 'function') setStatus(t('stereo_center'), false);
        }
        ensureAnalyserConnection();
    } catch(e) { if (typeof setStatus === 'function') setStatus(t('stereo_error'), true); }
}

// ========== جهاز الإخراج ==========
async function setAudioOutputDevice(deviceId) {
    if (!audioCtx) {
        if (!await initWebAudio()) {
            if (typeof setStatus === 'function') setStatus(t('output_device_not_supported'), true);
            return;
        }
    }
    if (typeof audioCtx.setSinkId !== 'function') {
        if (typeof setStatus === 'function') setStatus(t('output_device_not_supported'), true);
        return;
    }
    try {
        const sinkId = deviceId || '';
        await audioCtx.setSinkId(sinkId);
        if (typeof setStatus === 'function') setStatus(sinkId ? t('output_device_changed_to_selected') : t('output_device_default'), false);
    } catch(e) {
        console.error(e);
        if (typeof setStatus === 'function') setStatus(t('output_device_change_error', e.message), true);
    }
}

async function selectAndSetAudioOutput() {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.selectAudioOutput !== 'function') {
        if (typeof setStatus === 'function') setStatus(t('output_device_not_supported'), true);
        return;
    }
    try {
        const selectedDevice = await navigator.mediaDevices.selectAudioOutput();
        if (selectedDevice && selectedDevice.deviceId) {
            await setAudioOutputDevice(selectedDevice.deviceId);
            if (typeof setStatus === 'function') setStatus(t('output_device_changed', selectedDevice.label || t('output_device_selected')), false);
        } else {
            if (typeof setStatus === 'function') setStatus(t('output_device_not_selected'), true);
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            if (typeof setStatus === 'function') setStatus(t('output_device_not_selected'), false);
        } else {
            console.error("خطأ في selectAudioOutput:", err);
            if (typeof setStatus === 'function') setStatus(t('output_device_select_error', err.message), true);
        }
    }
}

// ========== معرض الصوت (Visualizer) الحقيقي ==========
(function setupAudioVisualizer() {
    const canvas = document.getElementById('audioVisualizerCanvas');
    const wrapper = document.getElementById('audioVisualizerWrapper');
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isActive = false;
    const barCount = 20;
    const stripHeight = 4;
    const stripGap = 1;
    const neonRed = '#ff3333';
    const neonBlue = '#33aaff';
    const glowSize = 5;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    function drawBars() {
        if (!ctx || !canvas) return;
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // إذا لم يكن المؤشر نشطاً (لا تشغيل) أو لا توجد بيانات حقيقية، امسح ولا ترسم شيئاً
        if (!isActive) {
            animationId = requestAnimationFrame(drawBars);
            return;
        }

        let dataArray = null;
        if (analyserNode && audioCtx && audioCtx.state === 'running') {
            const freqArray = new Uint8Array(analyserNode.frequencyBinCount);
            analyserNode.getByteFrequencyData(freqArray);
            dataArray = freqArray;
        }

        // إذا لم تكن هناك بيانات صالحة (حتى مع isActive صحيح)، لا ترسم شرطات وهمية
        if (!dataArray || dataArray.length === 0) {
            animationId = requestAnimationFrame(drawBars);
            return;
        }

        const barWidth = (width / barCount) * 0.8;
        const gap = (width / barCount) * 0.2;

        for (let i = 0; i < barCount; i++) {
            let value = 0;
            const start = Math.floor(i * dataArray.length / barCount);
            const end = Math.floor((i + 1) * dataArray.length / barCount);
            let sum = 0;
            for (let j = start; j < end; j++) sum += dataArray[j];
            const avg = (end > start) ? sum / (end - start) : 0;
            value = Math.pow(avg / 255, 1.2);

            const barHeight = Math.max(10, value * height * 0.9);
            const x = i * (barWidth + gap);
            let numStrips = Math.floor(barHeight / (stripHeight + stripGap));
            if (numStrips < 1) numStrips = 1;
            
            for (let s = 0; s < numStrips; s++) {
                const ratio = s / numStrips;
                const r = 51 + Math.floor(204 * ratio);
                const g = 170 - Math.floor(170 * ratio);
                const b = 255 - Math.floor(255 * ratio);
                const color = `rgb(${r}, ${g}, ${b})`;
                const yStrip = height - (s + 1) * (stripHeight + stripGap);
                if (yStrip + stripHeight < 0) continue;
                if (ratio > 0.8) {
                    ctx.shadowBlur = glowSize;
                    ctx.shadowColor = neonRed;
                } else {
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = neonBlue;
                }
                ctx.fillStyle = color;
                ctx.fillRect(x, yStrip, barWidth, stripHeight);
            }
        }
        ctx.shadowBlur = 0;
        animationId = requestAnimationFrame(drawBars);
    }

    audioPlayer.addEventListener('play', () => {
        isActive = true;
        resizeCanvas();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    });
    audioPlayer.addEventListener('pause', () => { isActive = false; });
    audioPlayer.addEventListener('ended', () => { isActive = false; });
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawBars();
})();

// ========== معادل الصوت (Equalizer) ==========
let currentPreset = localStorage.getItem('x6RadioAudioPreset') || 'flat';

// تعريف أوضاع الصوت (قيم التعزيز/الخفض بالديسيبل)
const AUDIO_PRESETS = {
    flat:       { name: 'قياسى', gains: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
    rock:       { name: 'روك', gains: [4,3,2,0,-1,-2,-1,0,1,2,3,4,5,4,3] },
    pop:        { name: 'بوب', gains: [-1,0,1,2,3,2,0,-1,-1,-1,-1,-1,-2,-2,-2] },
    jazz:       { name: 'جاز', gains: [3,3,2,1,0,0,0,1,2,3,3,3,2,1,0] },
    classical:  { name: 'كلاسيكية', gains: [4,4,3,2,0,0,0,1,2,3,4,4,3,2,0] },
    dance:      { name: 'دانس', gains: [5,4,3,2,0,-1,-2,-1,0,1,2,3,4,5,4] },
    ballad:     { name: 'بالاد', gains: [3,2,1,0,-1,-1,0,1,2,3,3,3,2,1,0] },
    rnb:        { name: 'ريزم أند بلوز', gains: [5,4,3,1,0,-1,-1,0,1,2,3,4,5,4,3] },
    hiphop:     { name: 'هيب هوب', gains: [6,5,4,2,0,-1,-2,-1,0,1,2,3,4,5,6] },
};

function initAudioFilters() {
    console.log('🔧 initAudioFilters called');
    if (audioFilters && audioFilters.length > 0) {
        console.log('✅ Audio filters already exist');
        return;
    }
    if (!audioCtx) {
        console.warn('⚠️ AudioContext not initialized yet');
        return;
    }
    if (audioCtx.state === 'suspended') {
        console.warn('⚠️ AudioContext suspended, waiting for user interaction...');
        const resumeAndInit = () => {
            if (audioCtx.state === 'running') {
                setTimeout(() => initAudioFilters(), 100);
                document.removeEventListener('click', resumeAndInit);
                document.removeEventListener('touchstart', resumeAndInit);
            }
        };
        document.addEventListener('click', resumeAndInit);
        document.addEventListener('touchstart', resumeAndInit);
        return;
    }
    if (!sourceNode) {
        console.warn('⚠️ sourceNode not initialized. Creating from audioPlayer...');
        try {
            sourceNode = audioCtx.createMediaElementSource(audioPlayer);
            window.sourceNode = sourceNode;
            console.log('✅ sourceNode created from audioPlayer');
        } catch (e) {
            console.error('❌ Failed to create sourceNode:', e);
            return;
        }
    }

    audioFilters = [];
    try {
        let prevNode = sourceNode;
        for (let i = 0; i < EQ_BANDS; i++) {
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = EQ_FREQUENCIES[i];
            filter.Q.value = 1.41;
            filter.gain.value = 0;
            prevNode.connect(filter);
            audioFilters.push(filter);
            console.log(`✅ Filter ${i} created for ${EQ_FREQUENCIES[i]}Hz`);
            prevNode = filter;
        }
        if (!gainNode) {
            gainNode = audioCtx.createGain();
            window.gainNode = gainNode;
        }
        prevNode.connect(gainNode);
        if (analyserNode) {
            gainNode.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);
        } else {
            gainNode.connect(audioCtx.destination);
        }
        console.log('✅ Audio filters initialized successfully');
        window.audioFilters = audioFilters;
        const savedPreset = localStorage.getItem('x6RadioAudioPreset') || 'flat';
        console.log('📌 Applying saved preset:', savedPreset);
        applyAudioPreset(savedPreset);
    } catch (e) {
        console.error('❌ Failed to initialize audio filters:', e);
    }
    console.log('✅ audioFilters initialized with length:', audioFilters.length);
}

// ========== تحديث المعادل ==========
function updateEqualizer(gains) {
    if (!audioFilters || audioFilters.length !== gains.length) {
        console.warn('⚠️ Filters not ready or length mismatch');
        return;
    }
    // تحديث قيم الـ gain لكل مرشح
    audioFilters.forEach((filter, index) => {
        if (index < gains.length) {
            filter.gain.value = gains[index];
        }
    });
    // حفظ القيم في المتغير العام للتزامن
    eqGains = gains.slice();
    // تحديث عرض الإعداد المسبق في واجهة المستخدم (سيتم استدعاؤه من equalizer.js)
    if (window.onEqualizerUpdate) {
        window.onEqualizerUpdate(gains);
    }
    console.log('🎛️ Equalizer updated:', gains);
}

// ========== تطبيق وضع الصوت المختار ==========
function applyAudioPreset(presetKey) {
    // دعم الوضع المخصص مع استعادة القيم المحفوظة
    if (presetKey === 'custom') {
        // محاولة استعادة القيم المخصصة المحفوظة
        const savedCustomGains = localStorage.getItem('x6RadioCustomEqGains');
        if (savedCustomGains) {
            try {
                const gains = JSON.parse(savedCustomGains);
                if (gains && gains.length === EQ_BANDS) {
                    // تحديث eqGains والقيم الحالية
                    eqGains = gains.slice();
                    if (typeof currentEqGains !== 'undefined') {
                        currentEqGains = gains.slice();
                    }
                    // تطبيق القيم على المرشحات إذا كان المعادل مفعلاً
                    if (isEqualizerEnabled && audioFilters.length === gains.length) {
                        window.updateEqualizer(gains);
                    } else if (window.onEqualizerUpdate) {
                        window.onEqualizerUpdate(gains);
                    }
                    // تحديث الأشرطة في الواجهة
                    if (typeof eqSliders !== 'undefined' && eqSliders.length === gains.length) {
                        eqSliders.forEach((slider, i) => {
                            const val = gains[i] || 0;
                            slider.value = val;
                            const parent = slider.parentElement;
                            const valLabel = parent.querySelector('.eq-value-label');
                            if (valLabel) valLabel.textContent = (val > 0 ? '+' : '') + val + 'dB';
                        });
                        localStorage.setItem('x6RadioEqGains', JSON.stringify(gains));
                    }
                }
            } catch (e) {
                console.warn('⚠️ Could not restore custom gains:', e);
            }
        }
        localStorage.setItem('x6RadioAudioPreset', 'custom');
        if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
        if (typeof setStatus === 'function') {
            const displayName = currentLanguage === 'ar' ? 'مخصص' : 'Custom';
            setStatus(`🎛️ ${t('audio_preset')}: ${displayName}`, false);
        }
        if (window.onPresetChanged) window.onPresetChanged();
        return;
    }

    // ===== الكود الأصلي للوضع غير المخصص =====
    if (!presetKey || !AUDIO_PRESETS[presetKey]) {
        presetKey = 'flat';
    }
    currentPreset = presetKey;
    localStorage.setItem('x6RadioAudioPreset', presetKey);
    const preset = AUDIO_PRESETS[presetKey];
    if (!preset) return;

    if (audioFilters.length === preset.gains.length) {
        audioFilters.forEach((filter, index) => {
            filter.gain.value = preset.gains[index];
        });
        eqGains = preset.gains.slice();
    } else {
        console.warn('⚠️ Filters count mismatch:', audioFilters.length, 'vs', preset.gains.length);
    }

    if (typeof eqSliders !== 'undefined' && eqSliders.length === preset.gains.length) {
        eqSliders.forEach((slider, i) => {
            const val = preset.gains[i] || 0;
            slider.value = val;
            const parent = slider.parentElement;
            const valLabel = parent.querySelector('.eq-value-label');
            if (valLabel) valLabel.textContent = (val > 0 ? '+' : '') + val + 'dB';
        });
        if (typeof currentEqGains !== 'undefined') {
            currentEqGains = preset.gains.slice();
        }
        localStorage.setItem('x6RadioEqGains', JSON.stringify(preset.gains));
    } else {
        if (window.onEqualizerUpdate) {
            window.onEqualizerUpdate(preset.gains);
        }
    }

    if (typeof updatePresetDisplay === 'function') {
        updatePresetDisplay();
    }
    if (typeof setStatus === 'function') {
        const displayName = currentLanguage === 'ar' ? preset.name : presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
        setStatus(`🎛️ ${t('audio_preset')}: ${displayName}`, false);
    }
    if (window.onPresetChanged) window.onPresetChanged();
}

function resetEqualizer() {
    const flatGains = new Array(EQ_BANDS).fill(0);
    updateEqualizer(flatGains);
    localStorage.setItem('x6RadioAudioPreset', 'flat');
    currentPreset = 'flat';
    if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
    if (typeof setStatus === 'function') setStatus(t('eq_reset_done'), false);
}

// ========== تشغيل/إيقاف المعادل ==========
function toggleEqualizer() {
 console.log('🔥 toggleEqualizer تم استدعاؤها!');
    isEqualizerEnabled = !isEqualizerEnabled;

 localStorage.setItem('x6RadioEqEnabled', isEqualizerEnabled ? 'true' : 'false');

    applyEqualizerState();
    
    // تحديث مظهر زر الطاقة
    const powerBtn = document.getElementById('eqPowerBtn');
    if (powerBtn) {
        powerBtn.classList.toggle('active', isEqualizerEnabled);
    }
    
    // تفعيل/تعطيل أشرطة المعادل
    const sliders = document.querySelectorAll('.eq-slider');
    sliders.forEach(slider => {
        slider.disabled = !isEqualizerEnabled;
    });
    
    // تحديث شاشة العرض
    if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
    if (typeof setStatus === 'function') {
        const msg = isEqualizerEnabled ? '✅ معادل الصوت مفعل' : '⛔ معادل الصوت معطل';
        setStatus(msg, false);
    }
 if (typeof updatePresetButtons === 'function') {
        updatePresetButtons();
}
}
function applyEqualizerState() {
    if (!audioFilters || audioFilters.length === 0) return;
    // إذا كان مفعلاً، نطبق القيم المحفوظة (eqGains)
    // وإلا نضبط جميع المرشحات على 0 (تأثير محايد)
    const gains = isEqualizerEnabled ? eqGains : new Array(EQ_BANDS).fill(0);
    audioFilters.forEach((filter, index) => {
        if (index < gains.length) {
            filter.gain.value = gains[index];
        }
    });
}

// تعديل دالة updateEqualizer لتأخذ في الاعتبار حالة التفعيل
const originalUpdateEqualizer = window.updateEqualizer || function() {};
window.updateEqualizer = function(gains) {
    if (!isEqualizerEnabled) {
        // حفظ القيم ولكن لا نطبقها على المرشحات
        eqGains = gains.slice();
        if (window.onEqualizerUpdate) {
            window.onEqualizerUpdate(gains);
        }
        return;
    }
    if (!audioFilters || audioFilters.length !== gains.length) {
        console.warn('⚠️ Filters not ready or length mismatch');
        return;
    }
    audioFilters.forEach((filter, index) => {
        if (index < gains.length) {
            filter.gain.value = gains[index];
        }
    });
    eqGains = gains.slice();
    if (window.onEqualizerUpdate) {
        window.onEqualizerUpdate(gains);
    }
    console.log('🎛️ Equalizer updated:', gains);
};

// تعديل دالة applyAudioPreset لتأخذ الحالة في الاعتبار
const originalApplyPreset = window.applyAudioPreset || function() {};
window.applyAudioPreset = function(presetKey) {
    // ===== دعم الوضع المخصص =====
    if (presetKey === 'custom') {
        localStorage.setItem('x6RadioAudioPreset', 'custom');
        if (typeof updatePresetDisplay === 'function') updatePresetDisplay();
        if (typeof setStatus === 'function') {
            const displayName = currentLanguage === 'ar' ? 'مخصص' : 'Custom';
            setStatus(`🎛️ ${t('audio_preset')}: ${displayName}`, false);
        }
        return; // لا نغير القيم، فقط نحدث العرض
    }

    // ===== الكود الأصلي الذي يعمل (بدون تغيير) =====
    if (!presetKey || !AUDIO_PRESETS[presetKey]) {
        presetKey = 'flat';
    }
    currentPreset = presetKey;
    localStorage.setItem('x6RadioAudioPreset', presetKey);
    const preset = AUDIO_PRESETS[presetKey];
    if (!preset) return;
    
    // تحديث eqGains بالقيم الجديدة
    eqGains = preset.gains.slice();
    
    // إذا كان المعادل مفعلاً، طبق القيم
    if (isEqualizerEnabled) {
        if (audioFilters.length === eqGains.length) {
            window.updateEqualizer(eqGains);
        } else {
            console.warn('⚠️ Filters count mismatch:', audioFilters.length, 'vs', eqGains.length);
        }
    } else {
        // إذا كان معطلاً، فقط حفظ القيم ولكن لا نطبقها على المرشحات
        console.log('⏸️ Equalizer disabled, preset values saved but not applied');
        if (window.onEqualizerUpdate) {
            window.onEqualizerUpdate(eqGains);
        }
    }
    
    // تحديث شاشة العرض في البانر العلوي
    if (typeof updatePresetDisplay === 'function') {
        updatePresetDisplay();
    }
    if (typeof setStatus === 'function') {
        const displayName = currentLanguage === 'ar' ? preset.name : presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
        setStatus(`🎛️ ${t('audio_preset')}: ${displayName}`, false);
    }
 if (window.onPresetChanged) window.onPresetChanged();
};
// ========== تهيئة Web Audio والمعادل عند بدء التشغيل (لـ Electron) ==========
(async function initAudioForElectron() {
    try {
        // 1. تهيئة Web Audio
        if (typeof initWebAudio === 'function') {
            const result = await initWebAudio();
            if (!result) {
                console.warn('⚠️ Web Audio initialization failed, will retry on user interaction');
                return;
            }
        }

        // 2. استئناف AudioContext
        if (audioCtx && audioCtx.state === 'suspended') {
            await audioCtx.resume();
            console.log('✅ AudioContext resumed successfully');
        }

        // 3. تهيئة المرشحات
        if (typeof initAudioFilters === 'function' && audioCtx) {
            // انتظر قليلاً لضمان جاهزية audioCtx
            setTimeout(() => {
                initAudioFilters();
                console.log('✅ Audio filters initialized successfully');
            }, 300);
        }

        // 4. تحديث الأشرطة بالقيم المحفوظة
        const savedGains = localStorage.getItem('x6RadioEqGains');
        if (savedGains && typeof window.updateEqualizer === 'function') {
            try {
                const gains = JSON.parse(savedGains);
                if (gains && gains.length === EQ_BANDS) {
                    setTimeout(() => {
                        window.updateEqualizer(gains);
                        console.log('✅ Equalizer restored from saved values');
                    }, 500);
                }
            } catch (e) {
                console.warn('⚠️ Could not restore saved equalizer values:', e);
            }
        }

        // 5. تحديث شاشة العرض
        if (typeof updatePresetDisplay === 'function') {
            setTimeout(updatePresetDisplay, 600);
        }

    } catch (e) {
        console.warn('⚠️ Could not initialize audio early:', e);
    }
})();
// تصدير الدوال للنطاق العام
window.toggleEqualizer = toggleEqualizer;
window.applyEqualizerState = applyEqualizerState;
window.isEqualizerEnabled = isEqualizerEnabled;
// تصدير الدوال
window.applyAudioPreset = applyAudioPreset;
window.AUDIO_PRESETS = AUDIO_PRESETS;
window.applyStereoMode = applyStereoMode;
window.setAudioOutputDevice = setAudioOutputDevice;
window.selectAndSetAudioOutput = selectAndSetAudioOutput;
window.toggleCompressor = toggleCompressor;
window.updateEqualizer = updateEqualizer;
window.resetEqualizer = resetEqualizer;
window.EQ_BANDS = EQ_BANDS;
window.EQ_FREQUENCIES = EQ_FREQUENCIES;