// في أعلى ملف stationsData.js (خارج أي دالة)
let lastKnownIconUrl = DEFAULT_ICON_PATH;
// متغير عام لتخزين مسار مجلد أيقونات المستخدم
let userIconsCachePath = '';

// تهيئة مسار مجلد أيقونات المستخدم (يُستدعى عند بدء التشغيل)
async function initUserIconsCache() {
    if (window.electronAPI && window.electronAPI.getUserDataPath) {
        try {
            const userData = await window.electronAPI.getUserDataPath();
            userIconsCachePath = `${userData}/icons_cache`;
            // إنشاء المجلد إذا لم يكن موجوداً
            if (window.electronAPI.mkdir) {
                await window.electronAPI.mkdir(userIconsCachePath);
            }
            console.log('✅ User icons cache path:', userIconsCachePath);
        } catch (err) {
            console.warn('⚠️ Failed to init user icons cache:', err);
        }
    } else {
        console.warn('⚠️ electronAPI not available for user icons');
    }
}
// ========== إدارة المحطات ==========
function saveMasterStations() {
    localStorage.setItem("x6RadioMasterStations", JSON.stringify(masterStations));
    console.log(`💾 تم حفظ ${masterStations.length} محطة في localStorage`);
}

function loadFailedIconsSet() {
    const stored = localStorage.getItem(FAILED_ICONS_KEY);
    if (stored) {
        try {
            const arr = JSON.parse(stored);
            failedIconsSet = new Set(arr);
            console.log(`📋 تم تحميل ${failedIconsSet.size} محطة فاشلة من localStorage`);
        } catch(e) { console.error("فشل تحميل قائمة الفشل", e); }
    }
}

function saveFailedIconsSet() {
    const arr = Array.from(failedIconsSet);
    localStorage.setItem(FAILED_ICONS_KEY, JSON.stringify(arr));
    console.log(`💾 تم حفظ ${arr.length} محطة فاشلة في localStorage`);
}

function markStationAsFailed(stationId) {
    if (!failedIconsSet.has(stationId)) {
        failedIconsSet.add(stationId);
        saveFailedIconsSet();
        console.log(`🚫 تم إضافة المحطة ${stationId} إلى قائمة الفشل الدائمة`);
    }
}

async function loadMasterStations() {
    const stored = localStorage.getItem("x6RadioMasterStations");
    if (stored) {
        try {
            masterStations = JSON.parse(stored);
            console.log(`✅ تم تحميل ${masterStations.length} محطة من localStorage`);
            return true;
        } catch(e) { console.error("فشل قراءة localStorage", e); }
    }
    if (window.fallbackStations && Array.isArray(window.fallbackStations) && window.fallbackStations.length > 0) {
        masterStations = window.fallbackStations;
        console.log(`✅ تم تحميل ${masterStations.length} محطة من stations_fallback.js`);
        saveMasterStations();
        return true;
    } else {
        console.error('❌ لا توجد محطات متاحة');
        masterStations = [];
        return false;
    }
}

function getStationsByFilter(filterItem) {
    if (filterItem.isGenre) {
        // إذا كان التصنيف هو "عالمي"
        if (filterItem.genreKey === "عالمي") {
            // عرض المحطات التي genre = "عالمي" أو "GENRE_WORLDWIDE"
            return masterStations.filter(st => 
                st.genre === "عالمي" || 
                st.genre === "GENRE_WORLDWIDE"
            );
        }
        // باقي التصنيفات (مثل الطعام، الرياضة، إلخ)
        return masterStations.filter(st => st.genre && st.genre.toLowerCase() === filterItem.genreKey.toLowerCase());
    } else {
        // الدول
        return masterStations.filter(st => st.countryCode === filterItem.code);
    }
}

async function fetchIconForStation(station) {
    console.log("🔍 جلب أيقونة لـ:", station.name);
    if (station.icon && station.icon !== DEFAULT_ICON_PATH && station.icon.trim() !== "") {
        return station.icon;
    }
    try {
        const urlObj = new URL(station.streamUrl);
        const domain = urlObj.hostname;
        if (domain) {
            const domainIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            console.log(`🌐 تم استخراج نطاق ${domain} للمحطة ${station.name}`);
            return domainIcon;
        }
    } catch(e) {
        console.warn(`فشل استخراج النطاق من ${station.streamUrl}`);
    }
    const searchName = encodeURIComponent(station.name);
    const servers = ["de1", "nl1", "fr1", "all"];
    for (const server of servers) {
        try {
            const url = `https://${server}.api.radio-browser.info/json/stations/byname?name=${searchName}&hidebroken=true&limit=5`;
            const response = await fetch(url);
            if (!response.ok) continue;
            const stations = await response.json();
            let bestMatch = stations.find(s => s.url === station.streamUrl);
            if (!bestMatch && stations.length > 0) bestMatch = stations[0];
            if (bestMatch && bestMatch.favicon && bestMatch.favicon.trim()) {
                const favicon = bestMatch.favicon.trim();
                if (!favicon.includes('favicon.ico')) {
                    return favicon;
                }
            }
        } catch (e) {
            console.warn(`فشل الاتصال بـ ${server} لمحطة ${station.name}:`, e);
        }
    }
    return DEFAULT_ICON_PATH;
}

async function updateMissingIcons() {
    console.log("🚀 بدء تحديث الأيقونات... عدد المحطات:", masterStations.length);
    let updated = false;
    let skippedFailed = 0;
    for (let i = 0; i < masterStations.length; i++) {
        const st = masterStations[i];
        if (st.icon && (st.icon.includes('google.com/s2/favicons') || st.icon.includes('gstatic.com'))) {
            st.icon = "";
            updated = true;
            console.log(`🧹 تنظيف أيقونة Google S2 لـ: ${st.name}`);
        }
    }
    const stationsToUpdate = masterStations.filter(st => 
        !failedIconsSet.has(st.id) && 
        (!st.icon || st.icon === DEFAULT_ICON_PATH || st.icon.trim() === "")
    );
    console.log(`🔄 سيتم تحديث ${stationsToUpdate.length} محطة.`);
    if (stationsToUpdate.length === 0) {
        console.log("ℹ️ لا توجد أيقونات جديدة لتحديثها.");
        if (updated) {
            saveMasterStations();
            if (currentTab === 'stations-tab' && typeof renderStations === 'function') renderStations();
            if (currentTab === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab();
        }
        return;
    }
    for (const st of stationsToUpdate) {
        if (failedIconsSet.has(st.id)) continue;
        console.log(`🔄 جاري جلب أيقونة لـ: ${st.name}`);
        const newIcon = await fetchIconForStation(st);
        if (newIcon && newIcon !== DEFAULT_ICON_PATH && newIcon !== st.icon) {
            st.icon = newIcon;
            updated = true;
            console.log(`✅ تم تحديث أيقونة: ${st.name} -> ${newIcon.substring(0, 60)}...`);
            if (currentStation && currentStation.id === st.id && typeof updateStationIcon === 'function') {
                updateStationIcon(st.id);
            }
        } else {
            markStationAsFailed(st.id);
            console.log(`⚠️ فشل جلب أيقونة ${st.name}، تمت إضافتها إلى القائمة السوداء.`);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (updated) {
        saveMasterStations();
        if (currentTab === 'stations-tab' && typeof renderStations === 'function') renderStations();
        if (currentTab === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab();
        console.log("💾 تم حفظ الأيقونات المحدثة في localStorage.");
    }
}

function updateStationIcon(stationId) {
    const stationIconImg = document.getElementById("stationIcon");
    if (!stationIconImg) return;

    // حالة null: استخدام آخر أيقونة معروفة
    if (stationId === null || stationId === undefined) {
        if (lastKnownIconUrl && lastKnownIconUrl !== DEFAULT_ICON_PATH) {
            stationIconImg.src = lastKnownIconUrl;
        } else {
            stationIconImg.src = DEFAULT_ICON_PATH;
        }
        return;
    }

    const station = masterStations.find(s => s.id === stationId);
    if (!station) {
        stationIconImg.src = DEFAULT_ICON_PATH;
        return;
    }

    let basePath = (typeof assetsBasePath !== 'undefined') ? assetsBasePath : './assets';
    if (!basePath.endsWith('/')) basePath += '/';
    const iconsCachePath = basePath + 'icons_cache/';
    
    // 1. الأولوية القصوى: customIcon (صورة مرفوعة من المستخدم)
    let finalIconUrl = DEFAULT_ICON_PATH;
    if (station.customIcon && station.customIcon.startsWith('data:image')) {
        finalIconUrl = station.customIcon;
    } else {
        // 2. ثانياً: صورة من مجلد icons_cache (إن وجدت)
        finalIconUrl = iconsCachePath + stationId + '.jpg';
    }

    if (stationIconImg.src !== finalIconUrl) {
        stationIconImg.src = finalIconUrl;
        stationIconImg.onerror = () => {
            // في حال فشل تحميل customIcon أو الصورة المحلية
            let fallbackUrl = DEFAULT_ICON_PATH;
            // إذا كنا نحاول تحميل الصورة المحلية وفشلت، ننتقل إلى station.icon (الرابط الأصلي)
            if (finalIconUrl !== station.customIcon && station.icon && typeof station.icon === 'string') {
                const icon = station.icon.trim();
                if (icon && !icon.includes('favicon.ico') && !icon.includes('google.com/s2/favicons')) {
                    fallbackUrl = icon;
                }
            }
            if (stationIconImg.src !== fallbackUrl) {
                stationIconImg.src = fallbackUrl;
                // معالج خطأ إضافي للوصول إلى الصورة الافتراضية إذا فشل كل شيء
                stationIconImg.onerror = () => {
                    if (stationIconImg.src !== DEFAULT_ICON_PATH) {
                        stationIconImg.src = DEFAULT_ICON_PATH;
                        stationIconImg.onerror = null;
                    }
                };
            } else {
                stationIconImg.onerror = null;
            }
        };
    }

    // تحديث آخر أيقونة معروفة بعد نجاح التحميل
    setTimeout(() => {
        if (stationIconImg.complete && stationIconImg.naturalHeight !== 0) {
            lastKnownIconUrl = stationIconImg.src;
        }
    }, 500);
}
// ========== إدارة تبويب إضافة محطة ==========
function populateCountrySelect() {
    const select = document.getElementById('newStationCountry');
    if (!select) return;
    
    // تصفية الدول الحقيقية فقط (ليست تصنيفات)
    const realCountries = allCountries.filter(c => !c.isGenre);
    
    // ترتيب هجائي حسب اللغة الحالية
    const lang = currentLanguage || 'en';
    realCountries.sort((a, b) => {
        const collate = lang === 'ar' ? 'ar' : lang;
        return getCountryDisplayName(a, lang).localeCompare(getCountryDisplayName(b, lang), collate);
    });
    
    // إفراغ القائمة وإضافة الخيارات
    select.innerHTML = '';
    realCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = getCountryDisplayName(country, lang);
        select.appendChild(option);
    });
}
function resetAddStationForm() {
    const nameInput = document.getElementById('newStationName');
    const urlInput = document.getElementById('newStationUrl');
    const countrySelect = document.getElementById('newStationCountry');
    const genreInput = document.getElementById('newStationGenre');
    const iconInput = document.getElementById('newStationIcon');
    if (nameInput) nameInput.value = '';
    if (urlInput) urlInput.value = '';
    if (countrySelect) countrySelect.value = 'XX';
    if (genreInput) genreInput.value = '';
    if (iconInput) iconInput.value = '';
}

function addNewStationFromForm() {
    const name = document.getElementById('newStationName').value.trim();
    const url = document.getElementById('newStationUrl').value.trim();
    const countryCode = document.getElementById('newStationCountry').value;
    const genre = document.getElementById('newStationGenre').value.trim() || 'عامة';
    const icon = document.getElementById('newStationIcon').value.trim();
    if (!name) { alert(t('station_name_label') + ' ' + (currentLanguage === 'ar' ? 'مطلوب' : 'required')); return; }
    if (!url) { alert(t('station_url_label') + ' ' + (currentLanguage === 'ar' ? 'مطلوب' : 'required')); return; }
    const newStation = { id: 'custom_' + Date.now(), name, countryCode, streamUrl: url, genre, icon: icon, isWebPage: false };
    masterStations.push(newStation);
    saveMasterStations();
    resetAddStationForm();
    if (currentTab === 'stations-tab' && typeof renderStations === 'function') renderStations();
    if (currentTab === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab();
    alert(t('station_added', name));
    if (typeof switchTab === 'function') switchTab('stations-tab');
}

// ========== حذف المحطة ==========
function deleteStation(stationId) {
    masterStations = masterStations.filter(s => s.id !== stationId);
    saveMasterStations();
    if (favorites.includes(stationId)) {
        favorites = favorites.filter(id => id !== stationId);
        if (typeof saveFavorites === 'function') saveFavorites();
    }
    if (historyList.some(entry => entry.id === stationId)) {
        historyList = historyList.filter(entry => entry.id !== stationId);
        localStorage.setItem("x6RadioHistory", JSON.stringify(historyList));
        if (typeof renderHistoryTab === 'function') renderHistoryTab();
    }
    if (currentTab === 'stations-tab' && typeof renderStations === 'function') renderStations();
    if (currentTab === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab();
    if (currentStation && currentStation.id === stationId) {
        if (typeof stopPlayback === 'function') stopPlayback();
        currentStation = null;
        const currentStationNameEl = document.getElementById("currentStationName");
        if (currentStationNameEl) currentStationNameEl.innerText = t('current_station_default');
        const currentStationCountryEl = document.getElementById("currentStationCountry");
        if (currentStationCountryEl) currentStationCountryEl.innerHTML = "";
        updateStationIcon(null);
    }
    if (typeof setStatus === 'function') setStatus(t('station_deleted'), false);
}

function deleteStationHandler(e) {
    e.stopPropagation();
    const stationId = this.dataset.id;
    const station = masterStations.find(s => s.id === stationId);
    if (!station) return;
    if (confirm(t('confirm_delete_station', station.name))) {
        deleteStation(stationId);
    }
}

function attachDeleteEvents() {
    document.querySelectorAll('.delete-station-btn').forEach(btn => {
        btn.removeEventListener('click', deleteStationHandler);
        btn.addEventListener('click', deleteStationHandler);
    });
}

// ========== تصدير المحطات ==========
function exportStations() {
    const dataStr = JSON.stringify(masterStations, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stations_backup.json';
    a.click();
    URL.revokeObjectURL(url);
    if (typeof setStatus === 'function') setStatus(t('history_exported'), false);
}
// ========== تغيير أيقونة المحطة يدوياً ==========
function changeStationIcon(stationId) {
    console.log("changeStationIcon called with stationId:", stationId);
    const station = masterStations.find(s => s.id === stationId);
    if (!station) {
        setStatus(t('station_not_found'), true);
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png, image/gif, image/webp';
    
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            setStatus(t('icon_file_too_large'), true);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target.result;
            station.customIcon = imageDataUrl;
            saveMasterStations();
            // تحديث الأيقونة إذا كانت هذه المحطة هي الحالية
            if (currentStation && currentStation.id === stationId) {
                updateStationIcon(stationId);
            }
            setStatus(t('icon_changed_success'), false);
            // إعادة عرض المحطات لتحديث أيقونة البطاقة (اختياري)
            if (typeof renderStations === 'function') renderStations();
        };
        reader.onerror = () => {
            setStatus(t('icon_change_failed'), true);
        };
        reader.readAsDataURL(file);
    };
    
    input.click();
}
window.exportStations = exportStations;
// ========== إصلاح رابط المحطة التالف (إصدار محسّن) ==========

// خوادم radio-browser.info (تُجرَّب بالترتيب حتى يستجيب أحدها)
const RADIO_BROWSER_SERVERS = ["de1", "nl1", "fr1", "at1", "pl1", "all"];

// جلب JSON من radio-browser مع مهلة زمنية وتجربة جميع الخوادم
async function fetchRadioBrowserJson(path, timeoutMs = 8000) {
    let lastError = null;
    for (const server of RADIO_BROWSER_SERVERS) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            const response = await fetch(`https://${server}.api.radio-browser.info/json/${path}`, { signal: controller.signal });
            clearTimeout(timer);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) return data;
        } catch (e) {
            lastError = e;
        }
    }
    if (lastError) console.warn("⚠️ fetchRadioBrowserJson:", lastError.message);
    return [];
}

// اختبار حقيقي للرابط: يحاول تشغيل البث بعنصر صوتي صامت ويتأكد من بدء تدفق البيانات
// المدة 25 ثانية لاستيعاب تفاوت سرعة الإنترنت بين المستخدمين والمحطات البطيئة في بدء التشغيل
function verifyStreamUrl(url, timeoutMs = 25000) {
    return new Promise((resolve) => {
        if (!url || !/^https?:\/\//i.test(url)) return resolve(false);

        // روابط HLS (.m3u8): لا يمكن تشغيلها بعنصر صوتي عادي، نتحقق من وجود المانيفست
        if (/\.m3u8($|\?)/i.test(url)) {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 25000);
            fetch(url, { signal: controller.signal })
                .then(r => {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.text();
                })
                .then(text => resolve(/^#EXTM3U|#EXT-X-/m.test(text)))
                .catch(() => resolve(false))
                .finally(() => clearTimeout(tid));
            return;
        }

        // عنصر صوتي بدون crossOrigin حتى يعمل مع البثوث التي لا تدعم CORS
        const audio = new Audio();
        audio.preload = 'auto';
        audio.muted = true;   // كتم الصوت أثناء الاختبار حتى لا يزعج المستخدم
        audio.volume = 0;

        let settled = false;
        const finish = (ok) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch (e) {}
            resolve(ok);
        };

        const timer = setTimeout(() => finish(false), timeoutMs);
        audio.addEventListener('loadeddata', () => finish(true));
        audio.addEventListener('canplay', () => finish(true));
        audio.addEventListener('playing', () => finish(true));
        audio.addEventListener('error', () => finish(false));
        audio.addEventListener('abort', () => finish(false));

        audio.src = url;
        audio.load();
        audio.play().catch(() => { /* بعض المتصفحات قد تمنع play() التلقائي؛ نعتمد على أحداث التحميل */ });
    });
}

// اختبار رابط صفحة ويب (للمحطات من نوع isWebPage) — مهلة 25 ثانية لتفاوت سرعة الإنترنت
function verifyWebPageUrl(url, timeoutMs = 25000) {
    return new Promise((resolve) => {
        if (!url || !/^https?:\/\//i.test(url)) return resolve(false);
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), timeoutMs);
        fetch(url, { method: 'GET', mode: 'no-cors' })
            .then(() => resolve(true))
            .catch(() => resolve(false))
            .finally(() => clearTimeout(tid));
    });
}

// تنظيف اسم المحطة للبحث بشكل أفضل
function cleanStationName(name) {
    if (!name) return '';
    return name
        .replace(/\s*\([^)]*\)\s*/g, ' ')                                 // إزالة (Spreaker) و (Somalia)...
        .replace(/\b\d+(?:[.,]\d+)?\s*(FM|AM|MW|SW)\b/gi, ' ')             // إزالة التردد مثل 90.4 FM
        .replace(/\bFM\b/gi, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

// جمع الروابط المرشحة لنفس المحطة من radio-browser.info بعدة استراتيجيات
async function collectCandidateUrls(station) {
    const candidates = new Set();
    const name = (station.name || '').trim();
    const countryCode = station.countryCode || '';
    const deadline = Date.now() + 40000;   // مهلة قصوى 40 ثانية للجمع بأكمله

    const addFromResults = (results) => {
        if (!Array.isArray(results)) return;
        results.forEach(s => {
            const urls = [s.url, s.url_resolved];
            if (station.isWebPage && s.homepage) urls.push(s.homepage);
            urls.forEach(u => {
                if (u && /^https?:\/\//i.test(u)) candidates.add(u);
            });
        });
    };

    // 1) البحث بالاسم الكامل، ثم بالاسم المنظّف كخطة احتياط
    const nameVariants = [name, cleanStationName(name)].filter((v, i, arr) => v && arr.indexOf(v) === i);
    for (const variant of nameVariants) {
        const queries = [
            `stations/search?name=${encodeURIComponent(variant)}&hidebroken=true&limit=15&order=clickcount`,
            `stations/search?name=${encodeURIComponent(variant)}&limit=15&order=clickcount`,
            `stations/byname?name=${encodeURIComponent(variant)}&hidebroken=true&limit=15`,
            `stations/byname?name=${encodeURIComponent(variant)}&limit=15`
        ];
        for (const query of queries) {
            if (Date.now() > deadline) break;
            const results = await fetchRadioBrowserJson(query);
            if (results.length === 0) continue;

            // ترتيب النتائج: التطابق التام بالاسم أولاً، ثم نفس الدولة
            const nameLower = name.toLowerCase();
            const countryUpper = countryCode.toUpperCase();
            const scored = results
                .map(s => {
                    const sName = (s.name || '').trim().toLowerCase();
                    const sCountry = (s.countrycode || '').toUpperCase();
                    let score = 0;
                    if (sName === nameLower) score += 10;
                    else if (sName.includes(nameLower) || nameLower.includes(sName)) score += 5;
                    if (countryCode && countryCode !== 'XX' && sCountry === countryUpper) score += 3;
                    return { s, score };
                })
                .filter(x => x.score > 0)
                .sort((a, b) => b.score - a.score);

            addFromResults(scored.length ? scored.map(x => x.s) : results);
        }
        if (candidates.size > 0) break;
    }

    // إزالة الروابط المكررة والحد من عددها لتسريع الاختبار
    return Array.from(candidates).slice(0, 10);
}

// البحث عن رابط بديل يعمل للمحطة (يُصدَّر أيضاً للنطاق العام)
async function findNewStreamUrlForStation(station) {
    // دعم الاستدعاء القديم باسم نصي فقط
    if (typeof station === 'string') station = { name: station, countryCode: '', streamUrl: '', isWebPage: false };

    console.log("🔧 findNewStreamUrlForStation called for:", station.name);
    try {
        const candidates = await collectCandidateUrls(station);
        if (candidates.length === 0) {
            console.log("⚠️ No candidate URLs found for:", station.name);
            return null;
        }

        const currentUrl = station.streamUrl || '';
        // ترتيب: الروابط المختلفة عن الحالي أولاً (لأن الحالي معطّل غالباً)
        const ordered = candidates.sort((a, b) => (a === currentUrl ? 1 : 0) - (b === currentUrl ? 1 : 0));

        const verifier = station.isWebPage ? verifyWebPageUrl : verifyStreamUrl;
        for (let i = 0; i < ordered.length; i++) {
            const url = ordered[i];
            if (typeof setStatus === 'function') {
    setStatus(t('testing_url', i + 1, ordered.length), false);
}
            const works = await verifier(url);
            console.log(`🔎 URL ${i + 1}: ${url} →`, works ? '✅ يعمل' : '❌ لا يعمل');
            if (works) return url;
        }
        console.log("❌ No working URL found for:", station.name);
        return null;
    } catch (error) {
        console.error("❌ findNewStreamUrlForStation error:", error);
        return null;
    }
}

// إصلاح رابط المحطة (تُستدعى من زر الإصلاح)
async function repairStationStream(stationId, stationOverride) {
    console.log("🔧 repairStationStream called for stationId:", stationId);
    let station = masterStations.find(s => s.id === stationId);
    if (!station && stationOverride) station = stationOverride;
    if (!station) {
        if (typeof setStatus === 'function') setStatus(t('station_not_found'), true);
        return null;
    }

    // تفعيل حالة "جاري الإصلاح" على الزر
    const repairBtn = document.querySelector(`.repair-station-btn[data-id="${CSS.escape(stationId)}"]`);
    if (repairBtn) {
        repairBtn.classList.add('repairing');
        repairBtn.disabled = true;
    }

    try {
        if (typeof setStatus === 'function') {
    setStatus(t('searching_alternative_url', station.name), false);
}

        const newUrl = await findNewStreamUrlForStation(station);
        console.log("🔧 newUrl returned:", newUrl);

        if (newUrl && newUrl !== station.streamUrl) {
            // ✅ رابط جديد يعمل — تحديث المحطة
            const isApiStation = station.isFromAPI && !masterStations.some(s => s.id === station.id);
            if (isApiStation) {
                // محطة من نتائج البحث غير محفوظة: نضيفها للمحطات الرئيسية بالرابط الجديد
                masterStations.push({ ...station, streamUrl: newUrl, isFromAPI: false });
            } else {
                station.streamUrl = newUrl;
            }
            if (typeof saveMasterStations === 'function') saveMasterStations();

            if (currentStation && currentStation.id === stationId) {
                currentStation.url = newUrl;
                localStorage.setItem('x6RadioCurrentStation', JSON.stringify(currentStation));
                if (!audioPlayer.paused && typeof playStation === 'function') {
                    playStation(newUrl, station.name, currentStation.country, station.id, station.isWebPage || false);
                }
            }
            if (typeof renderStations === 'function') renderStations(true);
            if (typeof renderFavoritesTab === 'function') renderFavoritesTab();
            if (typeof setStatus === 'function') {
    setStatus(t('url_repaired_success', station.name), false);
}
            return newUrl;
        } else if (newUrl === station.streamUrl) {
            if (typeof setStatus === 'function') {
    setStatus(t('url_working_correctly', station.name), false);
}
            return null;
        } else {
            if (typeof setStatus === 'function') {
    setStatus(t('no_working_alternative_url'), true);
}
            return null;
        }
    } catch (error) {
        console.error("❌ repairStationStream error:", error);
        if (typeof setStatus === 'function') setStatus(t('failed_to_find_alternative_url'), true);
        return null;
    } finally {
        if (repairBtn) {
            repairBtn.classList.remove('repairing');
            repairBtn.disabled = false;
        }
    }
}
/**
 * تحديث المحطات القديمة (التي countryCode === "XX") لجعل genre = "GENRE_WORLDWIDE"
 * يُنصح بتنفيذها مرة واحدة فقط.
 */
function migrateWorldwideStations() {
    let updated = 0;
    masterStations.forEach(st => {
        if (st.countryCode === "XX" && st.genre !== "عالمي" && st.genre !== "GENRE_WORLDWIDE") {
            st.genre = "GENRE_WORLDWIDE";
            updated++;
        }
    });
    saveMasterStations();
    console.log(`✅ تم تحديث ${updated} محطة عالمية لجعل genre = "GENRE_WORLDWIDE".`);
    return updated;
}

// تصدير الدالة للاستخدام من Console
window.migrateWorldwideStations = migrateWorldwideStations;

// تصدير الدوال للنطاق العام
window.repairStationStream = repairStationStream;
window.findNewStreamUrlForStation = findNewStreamUrlForStation; // اختياري

// ========== stationsData.js ==========
// ... الكود الموجود ...

// ✅ تصدير الدوال لإتاحتها خارج الملف
window.addNewStationFromForm = addNewStationFromForm;
window.resetAddStationForm = resetAddStationForm;

// ✅ دالة لتعبئة قائمة الدول في نموذج الإضافة (تُستدعى من appInit.js)
window.populateCountrySelect = populateCountrySelect;

// ... باقي الكود ...