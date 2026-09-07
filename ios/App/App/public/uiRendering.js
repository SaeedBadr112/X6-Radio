// ========== عرض الواجهة ==========
let assetsBasePath = 'assets';

// دالة ترجع جميع أسماء الدولة/التصنيف بكل اللغات المتاحة للبحث
function getAllCountryNameVariants(item) {
    if (!item) return [];
    const names = [];
    if (item.name) names.push(item.name.toLowerCase());
    if (item.nameAr) names.push(item.nameAr.toLowerCase());
    if (item.nameFr) names.push(item.nameFr.toLowerCase());
    if (item.nameEs) names.push(item.nameEs.toLowerCase());
    if (item.nameDe) names.push(item.nameDe.toLowerCase());
    if (item.namePt) names.push(item.namePt.toLowerCase());
    return names;
}
window.getAllCountryNameVariants = getAllCountryNameVariants;
// ================================================================
// إصلاح أعلام الدول في تطبيق الجوال (Android WebView)
// نظام أندرويد حساس لحالة الأحرف في أسماء الملفات، بينما ويندوز ليس
// كذلك، لذلك نحاول عدة صيغ للمسار (نفس الحالة → أحرف صغيرة → مجلد
// بأحرف صغيرة) ثم CDN احتياطي قبل إخفاء العلم.
// ================================================================
function flagVariants(code) {
    var base = (typeof assetsBasePath !== 'undefined' && assetsBasePath) ? assetsBasePath : 'assets';
    var folder = 'Icons_of_all_countries';
    var low = (code || '').toLowerCase();
    var up = (code || '').toUpperCase();
    var list = [];
    function add(p) { if (list.indexOf(p) === -1) list.push(p); }
    add(base + '/' + folder + '/' + up + '.png');                 // 1) نفس الحالة المكتوبة في الكود
    add(base + '/' + folder + '/' + low + '.png');                // 2) الملف بأحرف صغيرة (شائع في الحزم)
    add(base + '/' + folder.toLowerCase() + '/' + low + '.png');  // 3) المجلد نفسه بأحرف صغيرة
    add('https://flagcdn.com/w80/' + low + '.png');               // 4) CDN احتياطي (يتطلب إنترنت)
    return list;
}

// معالج فشل تحميل العلم: يحاول الصيغ المحلية ثم CDN، وبعد الفشل الكامل
// يخفي الصورة وينفذ done() (لعرض الأيقونة الاحتياطية في الهيدر).
window.resolveFlagError = function (img, done) {
    var src = img ? (img.getAttribute('src') || '') : '';
    var m = src.match(/^.*\/([A-Za-z]{2})\.png$/);
    var code = m ? m[1] : '';

    // حماية: لا نحاول إلا رموز دول معروفة
    if (!code ||
        (typeof allCountries !== 'undefined' &&
         !allCountries.some(function (c) { return c.code === code.toUpperCase(); }))) {
        if (img) img.style.display = 'none';
        if (typeof done === 'function') done();
        return;
    }

    var localV = flagVariants(code).filter(function (p) {
        return p.indexOf('flagcdn.com') === -1 && p !== src;
    });
    var cdn = 'https://flagcdn.com/w80/' + code.toLowerCase() + '.png';
    var cdnTried = false;

    (function tryNext() {
        if (localV.length) {
            img.onerror = tryNext;
            img.src = localV.shift();
            return;
        }
        if (!cdnTried) {
            cdnTried = true;
            console.warn('[flags] فشل التحميل المحلي للعلم:', src, '→ نجرّب CDN');
            img.onerror = tryNext;
            img.src = cdn;
            return;
        }
        if (img) img.style.display = 'none';
        if (typeof done === 'function') done();
    })();
};

// توليد وسم <img> للعلم مع المعالجة التلقائية عند الفشل
function flagImgHtml(code, cls, styleAttr) {
    var v = flagVariants(code);
    var first = v.shift();
    var style = styleAttr ? ' style="' + styleAttr + '"' : '';
    return '<img src="' + first + '" alt="' + code + '" class="' + cls + '"' + style +
           ' onerror="if(window.resolveFlagError){window.resolveFlagError(this)}else{this.style.display=\'none\'}">';
}

let pulseApplied = false;
let countriesFilterText = '';

// ===== متغيرات تلميحة الميكروفون =====
let micTooltip = null;
let micTooltipHideListener = null;

// ===== دالة معالج النقر على أيقونة الميكروفون =====
function micIconClickHandler(e) {
    e.stopPropagation();
    console.log('🔊 micIconClickHandler تم استدعاؤها!');

    const icon = this;

    // إذا كانت التلميحة ظاهرة بالفعل، إخفاؤها
    if (micTooltip && micTooltip.classList.contains('visible')) {
        hideMicTooltip();
        return;
    }

    const station = icon.dataset.station || (currentLanguage === 'en' ? 'Unknown Station' : 'محطة غير معروفة');
    const country = icon.dataset.country || '';
    const rawGenre = icon.dataset.genre || '';
    // ترجمة التصنيف إذا كانت الواجهة إنجليزية
    const genre = (currentLanguage === 'en' && rawGenre) ? translateGenre(rawGenre) : rawGenre;

    console.log('📊 بيانات المحطة:', { station, country, genre });

    let text = '';
    if (country) text += country;
    if (genre && genre !== '') text += (text ? ` • ${genre}` : genre);
    // إذا كانت التلميحة فارغة (لا دولة ولا تصنيف)
    if (!text) text = currentLanguage === 'en' ? 'Unknown' : 'غير معروف';

    console.log('📝 النص المعروض:', text);

    // إنشاء عنصر التلميحة إذا لم يكن موجوداً
    if (!micTooltip) {
        console.log('🔧 إنشاء عنصر التلميحة لأول مرة');
        micTooltip = document.createElement('div');
        micTooltip.id = 'micTooltip';
        micTooltip.className = 'mic-tooltip';
        document.body.appendChild(micTooltip);
        console.log('✅ تم إنشاء التلميحة');
    }

    // تعيين النص وإظهار التلميحة
    micTooltip.textContent = text;
    micTooltip.classList.add('visible');
    console.log('✅ تم إضافة class visible');

    // تحديد موقع التلميحة بجوار الأيقونة
    const rect = icon.getBoundingClientRect();
    const tooltipWidth = micTooltip.offsetWidth || 200;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
    }
    micTooltip.style.left = left + 'px';
    micTooltip.style.top = (rect.bottom + 10) + 'px';
    console.log('📍 موقع التلميحة:', { left, top: rect.bottom + 10 });

    // إخفاء التلميحة عند النقر في أي مكان آخر
    const hideOnClick = (ev) => {
        if (!micTooltip.contains(ev.target) && ev.target !== icon) {
            hideMicTooltip();
        }
    };
    document.removeEventListener('click', micTooltipHideListener);
    micTooltipHideListener = hideOnClick;
    document.addEventListener('click', hideOnClick);
}

// ===== دالة إخفاء التلميحة =====
function hideMicTooltip() {
    if (!micTooltip) return;
    micTooltip.classList.remove('visible');
    if (micTooltipHideListener) {
        document.removeEventListener('click', micTooltipHideListener);
        micTooltipHideListener = null;
    }
    console.log('👆 تم إخفاء التلميحة');
}

// ========== دالة إنشاء بطاقة محطة موحدة (ترتيب ثابت) ==========
function createStationCardHTML(station, isPlaying, extraInfo = null) {
    const stationName = escapeHtml(station.name);
    const isApiStation = station.isFromAPI === true;

    // اسم الدولة أو المصدر
    let countryName;
    if (isApiStation) {
        countryName = currentLanguage === 'en' ? 'Radio Browser' : 'راديو براوزر';
    } else {
const countryObj = allCountries.find(c => c.code === station.countryCode);
countryName = countryObj ? getCountryDisplayName(countryObj, currentLanguage) : station.countryCode;
    }

    // التصنيف للمحطات الخارجية
    let genreForMic = station.genre || '';
    if (isApiStation) {
        // إذا كان التصنيف مجرد "من Radio Browser"، نجعله "متنوع/Variety"
        if (genreForMic === 'من Radio Browser' || genreForMic === 'From Radio Browser') {
            genreForMic = currentLanguage === 'en' ? 'Variety' : 'متنوع';
        }
        // وإلا نستخدم التصنيف الأصلي من API
    }

    let extraHtml = '';
    if (extraInfo && extraInfo.isHistory && extraInfo.dateStr) {
        extraHtml = `<div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${escapeHtml(extraInfo.dateStr)}</div>`;
    }

    const leftPart = `
        <div class="station-card-left">
            <button class="play-station-btn play-this ${isPlaying ? 'playing' : ''}" 
                    data-id="${station.id}" 
                    data-url="${station.streamUrl}" 
                    data-name="${stationName}" 
                    data-country="${escapeHtml(countryName)}" 
                    data-iswebpage="${station.isWebPage || false}" 
                    title="${t('play')}">
                <i class="fas ${isPlaying ? 'fa-stop' : 'fa-play'}"></i>
                <span class="play-label">${isPlaying ? t('stop') : t('play')}</span>
            </button>
        </div>
    `;

    const infoPart = `
        <div class="station-card-info">
            <span class="station-name">
                <i class="fas fa-microphone-alt station-mic-icon ${isApiStation ? 'api-mic' : ''}" 
                   data-station="${escapeHtml(station.name)}"
                   data-country="${escapeHtml(countryName)}"
                   data-genre="${escapeHtml(genreForMic)}">
                </i>
                ${stationName}
                ${extraHtml}
            </span>
        </div>
    `;

    const rightPart = `
        <div class="station-card-right">
            <button class="fav-star ${isFavorite(station.id) ? 'active-fav' : ''}" 
                    data-id="${station.id}" 
                    title="${t('save_to_favorites')}">
                ${isFavorite(station.id) 
                    ? '<i class="fa-solid fa-heart" style="color: #ff1744;"></i>' 
                    : '<i class="fa-regular fa-heart" style="color: #ff1744;"></i>'}
            </button>
            <button class="delete-station-btn" 
                    data-id="${station.id}" 
                    title="${t('delete_station')}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;

    return `<div class="station-card ${isApiStation ? 'api-station' : ''}" data-id="${station.id}">${leftPart}${infoPart}${rightPart}</div>`;
}
window.createStationCardHTML = createStationCardHTML;

// ========== تهيئة المسار الأساسي للأصول ==========
(async function initAssetsPath() {
    if (window.electronAPI && window.electronAPI.getAssetsDir) {
        assetsBasePath = await window.electronAPI.getAssetsDir();
        console.log('✅ Assets path set to:', assetsBasePath);
    }
    if (typeof renderCountriesList === 'function') {
        renderCountriesList();
    }
    setTimeout(() => applyTemporaryPulse(), 1000);
    const countriesSearchInput = document.getElementById('countriesSearchInput');
    if (countriesSearchInput) {
        countriesSearchInput.addEventListener('input', filterCountriesList);
    }
})();

// ========== دعم البحث في الجوال ==========
let _savedFilterItem = null;

function showMobileSearchResults(results, keyword) {
    if (_savedFilterItem === null) {
        _savedFilterItem = currentFilterItem;
    }

    const container = document.getElementById("stationsContainer");
    const headerRow = document.querySelector('.list-header-row');
    if (!container || !headerRow) return;

    const countryDetails = headerRow.querySelector('.country-details');
    if (countryDetails) {
        countryDetails.innerHTML = `
            <i class="fas fa-search" style="font-size:14px; color:var(--accent);"></i>
            <span style="font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${t('search_results_for')} "${escapeHtml(keyword)}"
            </span>
        `;
    }
    const miniSearch = headerRow.querySelector('.mini-search');
    if (miniSearch) miniSearch.style.display = 'none';

    if (results.length === 0) {
        container.innerHTML = `<div class="empty-message">${t('no_search_results')}</div>`;
    } else {
        container.innerHTML = results.map(station => {
            const isPlaying = currentStation && currentStation.id === station.id && !audioPlayer.paused;
            return createStationCardHTML(station, isPlaying);
        }).join('');
    }

    attachStationEvents();
    attachDeleteEvents();
    updateStationPlayButtons(
        currentStation ? currentStation.id : null,
        currentStation && !audioPlayer.paused
    );
    window._searchActive = true;
}

function cancelMobileSearch() {
    if (!window._searchActive) return;
    window._searchActive = false;

    if (_savedFilterItem !== null) {
        currentFilterItem = _savedFilterItem;
        _savedFilterItem = null;
    } else {
        const savedCountry = localStorage.getItem('x6RadioLastCountry');
        if (savedCountry) {
            const found = allCountries.find(c => c.code === savedCountry);
            currentFilterItem = found || null;
        } else {
            currentFilterItem = null;
        }
    }

    updateHeaderForFilter(currentFilterItem);
    renderStations();

    const headerRow = document.querySelector('.list-header-row');
    if (headerRow) {
        const miniSearch = headerRow.querySelector('.mini-search');
        if (miniSearch) miniSearch.style.display = 'flex';
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.style.display = 'none';
}

window.showMobileSearchResults = showMobileSearchResults;
window.cancelMobileSearch = cancelMobileSearch;

function applyTemporaryPulse() {
    if (pulseApplied) return;
    const playButtons = document.querySelectorAll('.play-station-btn');
    playButtons.forEach(btn => btn.classList.add('pulse-temp'));
    setTimeout(() => {
        playButtons.forEach(btn => btn.classList.remove('pulse-temp'));
    }, 10000);
    pulseApplied = true;
}

// ========== عرض المحطات ==========
function renderStations(keepScroll = false) {
    const container = document.getElementById("stationsContainer");
    if (!container) {
        console.error('❌ renderStations: #stationsContainer not found');
        return;
    }

    if (!currentFilterItem) {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '300px';
        container.style.padding = '20px';
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 10px;">
                <div style="font-size: 2.8rem; font-weight: bold; color: #e0f2fe; margin-bottom: 12px;">
                    ${t('welcome_title')}
                </div>
                <div style="font-size: 1.4rem; color: #9ec8f0; opacity: 0.9;">
                    ${t('welcome_subtitle')}
                </div>
            </div>
        `;
        return;
    }

    const stations = getStationsByFilter(currentFilterItem);
    if (!stations || stations.length === 0) {
        container.innerHTML = `<div class="empty-message">${t('no_stations')}</div>`;
        return;
    }

    const stationsTab = document.getElementById('stations-tab');
    const savedScrollTop = (keepScroll && stationsTab) ? stationsTab.scrollTop : 0;

    console.log('🔍 renderStations: currentLanguage =', currentLanguage);
  container.innerHTML = stations.map(station => {
    const isPlaying = currentStation && currentStation.id === station.id && !audioPlayer.paused;
    return createStationCardHTML(station, isPlaying);
}).join('') + `
    <div class="search-hint-box">
        <i class="fas fa-search"></i>
        <span>${currentLanguage === 'ar' ? 'يمكنك الحصول على المزيد من المحطات بالبحث في أعلى الصفحة' : 'You can find more stations by searching at the top of the page'}</span>
    </div>
`;

    attachStationEvents();
    attachDeleteEvents();
    attachRepairEvents();

    updateStationPlayButtons(
        currentStation ? currentStation.id : null,
        currentStation && !audioPlayer.paused
    );

    if (stationsTab && keepScroll) {
        requestAnimationFrame(() => {
            stationsTab.scrollTop = savedScrollTop;
        });
    } else if (stationsTab && !keepScroll) {
        stationsTab.scrollTop = 0;
    }
}

// ===== دالة attachStationEvents (مع سجلات إضافية) =====
function attachStationEvents() {
    console.log('🔍 attachStationEvents called!');

    // أحداث زر التشغيل
    document.querySelectorAll('.play-this').forEach(btn => {
        btn.removeEventListener('click', playClickHandler);
        btn.addEventListener('click', playClickHandler);
    });

    // أحداث زر المفضلة
    document.querySelectorAll('.fav-star').forEach(star => {
        star.removeEventListener('click', favClickHandler);
        star.addEventListener('click', favClickHandler);
    });

    // أحداث أيقونة الميكروفون
    const micIcons = document.querySelectorAll('.station-mic-icon');
    console.log('🔍 عدد أيقونات الميكروفون:', micIcons.length);

    micIcons.forEach((icon, index) => {
        icon.removeEventListener('click', micIconClickHandler);
        icon.addEventListener('click', micIconClickHandler);
        console.log(`✅ تم ربط المستمع بالأيقونة ${index + 1}:`, icon.dataset.station);
    });
}

// دوال المعالجة (خارج attachStationEvents)
function playClickHandler(e) {
    e.stopPropagation();
    const btn = this;
    playStation(btn.dataset.url, btn.dataset.name, btn.dataset.country, btn.dataset.id, btn.dataset.iswebpage === 'true');
}

function favClickHandler(e) {
    e.stopPropagation();
    toggleFavorite(this.dataset.id);
    renderStations(true);
    if (currentTab === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab();
}

function attachRepairEvents() {
    document.querySelectorAll('.repair-station-btn').forEach(btn => {
        btn.removeEventListener('click', repairClickHandler);
        btn.addEventListener('click', repairClickHandler);
    });
}

async function repairClickHandler(e) {
    e.stopPropagation();
    const stationId = this.dataset.id;
    if (window.repairStationStream) {
        await window.repairStationStream(stationId);
    } else {
        console.error('repairStationStream function not found');
        if (typeof setStatus === 'function') setStatus('⚠️ وظيفة الإصلاح غير متوفرة', true);
    }
}

function filterCountriesList() {
    const input = document.getElementById('countriesSearchInput');
    if (input) {
        countriesFilterText = input.value.trim().toLowerCase();
        renderCountriesList();
    }
}

// ========== عرض قائمة الدول والتصنيفات ==========
function renderCountriesList() {
    if (!currentFilterItem) {
        currentFilterItem = null;
    }
    const container = document.getElementById("countriesList");
    if (!container) return;

    const countries = allCountries.filter(c => !c.isGenre);
    const genres = allCountries.filter(c => c.isGenre);

    const lang = currentLanguage || 'en';
   countries.sort((a, b) => {
    const nameA = getCountryDisplayName(a, lang);
    const nameB = getCountryDisplayName(b, lang);
    return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en');
});
genres.sort((a, b) => {
    const nameA = getCountryDisplayName(a, lang);
    const nameB = getCountryDisplayName(b, lang);
    return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en');
});
   let filteredCountries = countries;
let filteredGenres = genres;
if (countriesFilterText) {
    filteredCountries = countries.filter(item => {
        const variants = getAllCountryNameVariants(item);
        return variants.some(name => name.includes(countriesFilterText));
    });
    filteredGenres = genres.filter(item => {
        const variants = getAllCountryNameVariants(item);
        return variants.some(name => name.includes(countriesFilterText));
    });
}

    let html = '';
    filteredCountries.forEach(item => {
        html += buildCountryItem(item);
    });

    if (filteredGenres.length > 0) {
        const genresTitle = lang === 'ar' ? '📂 التصنيفات' : '📂 Categories';
        html += '<div class="countries-divider">' + genresTitle + '</div>';
        filteredGenres.forEach(item => {
            html += buildCountryItem(item);
        });
    }

    container.innerHTML = html;

    document.querySelectorAll('.country-item').forEach(el => {
        el.addEventListener('click', function() {
            if (window._searchActive) {
                cancelMobileSearch();
            }
            const code = this.dataset.code;
            const selected = allCountries.find(c => c.code === code);
            if (selected) {
                currentFilterItem = selected;
                localStorage.setItem('x6RadioLastCountry', code);
                countriesFilterText = '';
                const searchInput = document.getElementById('countriesSearchInput');
                if (searchInput) searchInput.value = '';
                renderCountriesList();
                updateHeaderForFilter(selected);
                renderStations();
                if (currentTab !== 'stations-tab') switchTab('stations-tab');
                const mainSearchInput = document.getElementById("searchInput");
                if (mainSearchInput) mainSearchInput.value = '';
            }
        });
    });

    const countryCountSpan = document.querySelector(".country-count");
    if (countryCountSpan) countryCountSpan.innerText = '(' + (filteredCountries.length + filteredGenres.length) + ')';
}

function buildCountryItem(item) {
let iconHtml = '';
if (item.isGenre) {
const iconPath = assetsBasePath + '/Category_icons/' + item.code + '.png';
iconHtml = '<img src="' + iconPath + '" alt="' + item.code + '" class="country-flag-icon genre-icon" onerror="this.style.display=\'none\'">';
} else {
iconHtml = flagImgHtml(item.code, 'country-flag-icon', '');
}

    let displayName = getCountryDisplayName(item, currentLanguage);
    if (currentLanguage === 'en' && displayName) {
        displayName = displayName.replace(/^[A-Z]{2}\s/, '').trim();
    }

    const isActive = (currentFilterItem && currentFilterItem.code === item.code) ? 'active-country' : '';

    if (item.isGenre) {
        return `<div class="country-item ${isActive}" data-code="${item.code}" data-isgenre="true" data-genrekey="${item.genreKey || ''}" role="button" tabindex="0">${iconHtml}<span class="country-name">${displayName}</span></div>`;
    }

    const countryCode = item.code;
    return `<div class="country-item ${isActive}" data-code="${item.code}" data-isgenre="false" role="button" tabindex="0">${iconHtml}<span class="country-code">${countryCode}</span><span class="country-name">${displayName}</span></div>`;
}

function updateHeaderForFilter(filterItem) {
    const countryDetails = document.querySelector('.country-details');
    if (!countryDetails) {
        console.warn('updateHeaderForFilter: country-details not found');
        return;
    }

    if (!filterItem) {
        countryDetails.style.display = 'none';
        return;
    }

    countryDetails.style.display = 'flex';

    let displayName = getCountryDisplayName(filterItem, currentLanguage);
    if (currentLanguage === 'en' && displayName) {
        displayName = displayName.replace(/^[A-Z]{2}\s/, '').trim();
    }

    let flagHtml = '';
    if (filterItem.isGenre) {
        const iconPath = `${assetsBasePath}/Category_icons/${filterItem.code}.png`;
        flagHtml = `<img id="selectedCountryFlag" src="${iconPath}" class="country-flag-icon genre-icon" style="width:40px; height:30px; object-fit:contain; flex-shrink:0;" onerror="this.style.display='none'; document.getElementById('selectedCountryIconFallback').style.display='inline-block'; document.getElementById('selectedCountryIconFallback').className='fas fa-tag';">`;
    } else {
        const flagPath = `${assetsBasePath}/Icons_of_all_countries/${filterItem.code}.png`;
        flagHtml = `<img id="selectedCountryFlag" src="${flagPath}" class="country-flag-icon" style="width:40px; height:30px; object-fit:contain; flex-shrink:0;" onerror="if(window.resolveFlagError){window.resolveFlagError(this, function(){ var fb=document.getElementById('selectedCountryIconFallback'); if(fb){ fb.style.display='inline-block'; fb.className='fas fa-flag'; } });}else{this.style.display='none';}">`;
    }

    const fallbackIconHtml = `<i id="selectedCountryIconFallback" style="display:none; font-size:18px;"></i>`;
    const nameSpanHtml = `<span id="selectedCountryName" style="font-size:20px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${displayName}</span>`;

    countryDetails.innerHTML = flagHtml + fallbackIconHtml + nameSpanHtml;
}

// ========== تبديل التبويبات ==========
function switchTab(tabId) {
    console.log('🟡 [switchTab] Called with tabId:', tabId);

    document.querySelectorAll('.subscreen').forEach(s => s.classList.remove('open'));

    const isMainTab = (tabId === 'stations-tab' || tabId === 'search-tab');
    const countriesList = document.getElementById('countriesList');
    const headerRow = document.querySelector('.list-header-row');
    const searchBar = document.querySelector('.search-bar');

    if (countriesList) countriesList.style.display = isMainTab ? 'flex' : 'none';
    if (headerRow) headerRow.style.display = isMainTab ? 'flex' : 'none';
    if (searchBar) searchBar.style.display = isMainTab ? 'flex' : 'none';

    document.querySelectorAll('.view').forEach(p => p.classList.remove('active'));
    const activePane = document.getElementById(tabId);
    if (activePane) {
        activePane.classList.add('active');
        activePane.scrollTop = 0;
    }

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    currentTab = tabId;

    if (tabId === 'stations-tab') {
        renderStations();
    } else if (tabId === 'search-tab') {
        performSearch(searchKeyword);
    } else if (tabId === 'favorites-tab') {
        if (typeof renderFavoritesTab === 'function') renderFavoritesTab();
    } else if (tabId === 'history-tab') {
        if (typeof renderHistoryTab === 'function') renderHistoryTab();
    } else if (tabId === 'add-station-tab') {
        resetAddStationForm();
        populateCountrySelect();
    } else if (tabId === 'audio-eq-tab') {
        if (typeof initEqualizer === 'function') {
            setTimeout(initEqualizer, 100);
        }
    }
}

function openEqScreen() {
    const eqScreen = document.getElementById('eqScreen');
    if (eqScreen) {
        eqScreen.classList.add('open');
        if (typeof initEqualizer === 'function' && !document.querySelector('#eq-sliders .eq-slider')) {
            initEqualizer();
        }
    } else {
        console.warn('eqScreen element not found');
    }
}

function closeEqScreen() {
    const eqScreen = document.getElementById('eqScreen');
    if (eqScreen) {
        eqScreen.classList.remove('open');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('btnBackFromEq');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            closeEqScreen();
            switchTab('stations-tab');
        });
    }
});

document.querySelectorAll('.close-subscreen').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const screen = document.getElementById(targetId);
        if (screen) {
            screen.classList.remove('open');
            switchTab('stations-tab');
        }
    });
});

function updateCurrentStationFromCard(cardElement) {
    const stationId = cardElement.dataset.id;
    if (!stationId) return false;
    const station = masterStations.find(s => s.id === stationId);
    if (!station) return false;

    const countryObj = allCountries.find(c => c.code === station.countryCode);
    const countryNameForNow = countryObj ? (currentLanguage === 'en' ? countryObj.name : countryObj.nameAr) : station.countryCode;

    currentStation = {
        id: station.id,
        name: station.name,
        country: countryNameForNow,
        url: station.streamUrl,
        isWebPage: station.isWebPage || false,
        countryCode: station.countryCode
    };
    localStorage.setItem('x6RadioCurrentStation', JSON.stringify(currentStation));

    const currentStationNameEl = document.getElementById("currentStationName");
    if (currentStationNameEl) currentStationNameEl.innerText = currentStation.name;

    if (typeof updateCurrentStationCountry === 'function') {
        updateCurrentStationCountry();
    } else {
        const currentStationCountryEl = document.getElementById("currentStationCountry");
        if (currentStationCountryEl) currentStationCountryEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentStation.country}`;
    }

    updateFavButtonCurrent();
    updateStationIcon(currentStation.id);
    setStatus(`${t('selected')} ${station.name}`, false);
    return true;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function translateGenre(genre) {
    if (!genre) return t('genre_variety');

    const lang = currentLanguage || 'en';
    if (lang === 'ar') return genre; // النوع مكتوب بالعربية أصلاً

    // ============================================================
    // 1. الخريطة الأساسية: العربية -> الإنجليزية
    // ============================================================
    const mapEn = {
        'هاوس': 'House',
        'مستشفى': 'Hospital',
        'ترانس': 'Trans',
        'كانتري': 'Country',
        'أفريقية': 'African',
        'إيطالية': 'Italian',
        'ألمانية': 'German',
        'هولندية': 'Dutch',
        'أخبار بالروسية': 'News in Russian',
        'رياضة / كرة سلة': 'Sports / Basketball',
        'روسية': 'Russian',
        'أخبار / دينية': 'News / Religious',
        'موسيقى / رياضة': 'Music / Sports',
        'موسيقى متنوعة': 'Various music',
        'موسيقى استوائية': 'Tropical music',
        'كلاسيكيات إيطالية': 'Italian classics',
        'موسيقى إثيوبية': 'Ethiopian music',
        'شبابية / موسيقى': 'Youth / Music',
        'موسيقى راقصة': 'dance music',
        'بلقانية': 'Balkan',
        'أفروبيت': 'Afrobeat',
        'موسيقى / محلية': 'Music / Local',
        'كارنفال': 'Carnival',
        'حوار / موسيقى': 'Dialogue/Music',
        ' أخبار / ترفيه': 'News / Entertainment',
        'موسيقى / شبابية': 'Music / Youth',
        'محيطية': 'Peripheral',
        'روك / موسيقى': 'Rock / Music',
        'روسية / عامة': 'Russian / General',
        'دينية / مسيحية': 'Music / Youth',
        'جاز لونج': 'Jazz Lounge',
        'موسيقى / متنوع': 'Music / Miscellaneous',
        'طعام': 'food',
        'موسيقى / أخبار': 'Music / News',
        'موسيقى / شبابية': 'Music / Youth',
        'جاز حمضي': 'acid gas',
        'بيت / إلكتروني': 'Home / Electronic',
        'ترفيه': 'Entertainment',
        'رومانسية': 'Romantic',
        'بلوز وسول': 'Blues and Souls',
        'مرور': 'Traffic',
        'موسيقى إلكترونية': 'Electronic Music',
        'روك ألماني': 'German rock',
        'روك هادئ': 'Quiet Rock',
        'بوب / شبابية': 'Pop/Youth',
        'بروغريسيف روك': 'Progressive Rock',
        'تقليدي': 'Traditional',
        'جاز كلاسيكي': 'Classical Jazz',
        'روك / بديل': 'Rock/Alternative',
        'بوب روك': 'pop rock',
        'روك أند رول': 'Rock and Roll',
        'روك ديسكو': 'Rock Disco',
        'روك بديل': 'Alternative rock',
        'روك إسباني': 'Spanish rock',
        'ديسكو فانك': 'Disco Funk',
        'هواة راديو': 'Amateur radio',
        'روك ألماني': 'German rock',
        'بوب هندي': 'Indian Bob',
        'فولكلور': 'Folklore',
        'بانك روك': 'punkrock',
        'بلوز روك': 'Blues Rock',
        'جاز سموث': 'Jazz Smooth',
        ' جاز بيبوب': 'Jazz Bebop',
        ' جاز حمضي': 'Acid jazz',
        'جاز ترانس': 'jazz trance',
        'كي-بوب': 'K-Pop',
        'جاز فيوجن': 'Jazz Fusion',
        'جاز صوتي': 'acoustic jazz',
        'تراب': 'Trap',
        'بوب فولكلور': 'Pop Folklore',
        'إنجليزية': 'English',
        'صينية': 'Chinese',
        'سول/جاز': 'Soul/Jazz',
        'موسيقى حضرية': 'Urban Music',
        'سول/فانك': 'Soul/Funk',
        'هاردستايل': 'Hardstyle',
        'كانتري ديني': 'Country religious',
        'سوينغ': 'Swing',
        'عالمى': 'worldwide',
        'إسلامى': 'Islamic',
        'مجتمعي': 'My community',
        'راب': 'Rap',
        'روك/بوب': 'Rock/Pop',
        'روك/إندي': 'Rock/Indie',
        'سالسا/كومبيا': 'Salsa/Cumbia',
        'كومبيا': 'Cumbia',
        'كومبيا/سالسا': 'Cumbia/Salsa',
        'بوليرو/بالاد': 'Bolero/Ballad',
        'رقص/بوب': 'Dance/Pop',
        'بوب-فولك': 'Pop-Folk',
        'موسيقى بلغارية': 'Bulgarian Music',
        'كلاسيكيات بلغارية': 'Bulgarian Classics',
        'شبابية/ثقافة': 'Youth/Culture',
        'موسيقى/ثقافة': 'Music/Culture',
        'كلاسيكية/ثقافة': 'Classical/Culture',
        'كلاسيكية/موسيقى تصويرية': 'Classical/Soundtrack',
        'بوب/موسيقى': 'Pop/Music',
        'فلامنكو': 'Flamenco',
        'إيسيزولو': 'IsiZulu',
        'سكا/روكستدي': 'Ska/Rocksteady',
        'ريغي/هادئ': 'Reggae/Calm',
        'موسيقى شبابية': 'Youth Music',
        'بوب روسي': 'Russian Pop',
        'بوب/رقص': 'Pop/Dance',
        'روك روسي': 'Russian Rock',
        'هاي لايف': 'Hi-Life',
        'أخبار/ثقافة': 'News/Culture',
        'أخبار/اقتصاد': 'News/Economy',
        'شانسون': 'Chanson',
        'بوب/شانسون': 'Pop/Chanson',
        'غير محدد': 'Undefined',
        'موسيقى/حوار': 'Music/Dialogue',
        'بديل/ثقافة': 'Alternative/Culture',
        'أوربان/ريغيتون': 'Urban/Reggaeton',
        'أفريكانس/حوار': 'Afrikaans/Dialogue',
        'موسيقى/رياضة': 'Music/Sports',
        'شبابية/أوربان': 'Youth/Urban',
        'معاصرة': 'Contemporary',
        'بوب/روك': 'Pop/Rock',
        'متنوعة': 'Various',
        'ريغي/موسيقى': 'Reggae/Music',
        'ريغي/دانسهول': 'Reggae/Dancehall',
        'لوك ثونغ': 'Luk Thung',
        'روك/بديل': 'Rock/Alternative',
        'بونغو فلافا': 'Bongo Flava',
        'أخبار/رياضة': 'News/Sports',
        'جامعية/ثقافة': 'University/Culture',
        'عامة/محلية': 'General/Local',
        'محلية/توباغو': 'Local/Tobago',
        'لونج/هادئة': 'Long/Quiet',
        'صحة': 'Health',
        'أوربان/موسيقى': 'Urban/Music',
        'سوكا/ريغي': 'Soca/Reggae',
        'موسيقى/ترفيه': 'Music/Entertainment',
        'حوار/أخبار': 'Talk/News',
        'أخبار/ترفيه': 'News/Entertainment',
        'أصوات طبيعية': 'Natural Sounds',
        'أخبار / موسيقى': 'News / Music',
        'أخبار/موسيقى': 'News/Music',
        'أخبار / ثقافة': 'News / Culture',
        'أخبار/عامة': 'News/General',
        'أخبار 24/7': '24/7 News',
        'موسيقى/أخبار': 'Music/News',
        'روك/ميتال': 'Rock/Metal',
        'أخبار/حوار': 'News/Talk',
        'ديسكو/بوب': 'Disco/Pop',
        'ديسكو بولو': 'Disco Polo',
        'هادئ/لونج': 'Quiet/Long',
        'رقص/شبابي': 'Dance/Youth',
        'رقص/إلكتروني': 'Dance/Electronic',
        'وطني': 'Patriotic',
        'بوب ألماني': 'German Pop',
        'راب ألماني': 'German Rap',
        'روك أوكراني': 'Ukrainian Rock',
        'بروغريسيف': 'Progressive',
        'أندرجراوند': 'Underground',
        'ألعاب': 'Games',
        'إندي': 'Indie',
        'موسيقى شبابية': 'Youth Music',
        'موسيقى إستونية': 'Estonian Music',
        'درام آند بيس': 'Drum and Bass',
        'دانغدوت': 'Dangdut',
        'موسيقى عالمية': 'World Music',
        'ميتال': 'Metal',
        'جروبيرا': 'Grupera',
        'توب 40': 'Top 40',
        'حدث': 'Event',
        'موسيقى': 'Music',
        'أخبار': 'News',
        'عامة': 'General',
        'رياضة': 'Sports',
        'ديني': 'Religious',
        'جامعة': 'University',
        'مؤسسي': 'Corporate',
        'متنوع': 'Variety',
        'كلاسيكي': 'Classical',
        'بوب': 'Pop',
        'روك': 'Rock',
        'جاز': 'Jazz',
        'محادثة': 'Talk',
        'ثقافة': 'Culture',
        'تعليمي': 'Educational',
        'إسلامي': 'Islamic',
        'قرآن': 'Quran',
        'منوعات': 'Variety',
        'بلوز': 'Blues',
        'هيب هوب': 'Hip Hop',
        'سالسا': 'Salsa',
        'تانغو': 'Tango',
        'ديسكو': 'Disco',
        'تكنو': 'Techno',
        'ريغي': 'Reggae',
        'فانك': 'Funk',
        'سول': 'Soul',
        'لاتيني': 'Latin',
        'عربية': 'Arabic',
        'الإسلامية': 'Islamic',
        'الكلاسيكية': 'Classical',
        'الفلامنكو': 'Flamenco',
        'الأوبرا': 'Opera',
        'أر أند بى': 'R&B',
        'الراب': 'Rap',
        'رقص': 'Dance',
        'محلية': 'Local',
        'أفريكانس': 'Afrikaans',
        'موسيقى استوائية': 'Tropical Music',
        'حوار': 'Dialogue',
        'موسيقى هادئة': 'Relaxing Music',
        'آر أند بي': 'R&B',
        'فارسية': 'Persian',
        'مغاربية': 'Maghrebi',
        'مجتمعية': 'Community',
        'مجتمعى': 'Community',
        'جامعى': 'University',
        'قرآن كريم': 'Holy Quran',
        'هندية': 'Indian',
        'حديث': 'Modern',
        'جامعي': 'University',
        'أطفال': 'Children',
        'ريفي': 'Rural',
        'كوميديا': 'Comedy',
        'فوكالويد': 'Vocaloid',
        'موسيقى إيطالية': 'Italian Music',
        'فوررو': 'Forró',
        'لاتينية': 'Latin',
        'أخبار وثقافة': 'News and Culture',
        'أنمي': 'Anime',
        'بوب ياباني': 'Japanese Pop',
        'روك ياباني': 'Japanese Rock',
        'بوب نمساوي': 'Austrian Pop',
        'أفلام': 'Movies',
        'شلاغر': 'Schlager',
        'لونج': 'Lounge',
        'ثقافية': 'Cultural',
        'ثقافي': 'Cultural',
        'إخبارية': 'News',
        'موسيقى تراثية': 'Traditional Music',
        'جامعية': 'University',
        'موسيقى قديمة': 'Oldies',
        'سيارات': 'Cars',
        'شباب': 'Youth',
        'تركية': 'Turkish',
        'روك كلاسيكي': 'Classic Rock',
        'استرخاء': 'Relaxation',
        'شبابية': 'Youthful',
        'بديل': 'Alternative',
        'كريسماس': 'Christmas',
        'دينية': 'Religious',
        'أفضل الأغاني': 'Best Songs',
        'موسيقى العالم': 'World Music',
        'الكلاسيكيات': 'Classics',
        'كلاسيكيات': 'Classics',
        'كلاسيكية': 'Classical',
        'كلاسيك': 'Classical',
        'روحاني': 'Spiritual',
        'طرب': 'Tarab',
        'فرنكوفونية': 'Francophone',
        'مسيحية': 'Christian',
        'أندلسي': 'Andalusian',
        'الكوميديا': 'Comedy',
        'الوثائقي': 'Documentary',
        'الدراما': 'Drama',
        'الطعام': 'Food',
        'الصحة': 'Health',
        'أوربان': 'Urban',
        'الأطفال': 'Kids',
        'السفر': 'Travel',
        'أوبرا': 'Opera',
        'فادو': 'Fado',
        'برتغالية': 'Portuguese',
        'برازيلية': 'Brazilian',
        'كلاسيك روك': 'Classic Rock',
        'الأخبار': 'News',
        'الرياضة': 'Sports',
        'كرة السلة': 'Basketball',
        'كرة القدم': 'Football',
        'بودكاست': 'Podcast',
        'هيب هوب/أوربان': 'Hip Hop/Urban',
        'لوك ثونغ/فلكلور': 'Lok Thong/Folklore',
        'موسيقى تقليدية': 'Traditional Music',
        'رومانسي': 'Romantic',
        'هادئ': 'Relaxing',
        'إلكتروني': 'Electronic',
        'تراثي': 'Folk',
        'فلكلور': 'Folklore',
        'شبابي': 'Youth',
        'أخبار / ثقافة': 'News / Culture',
        'أخبار / حوار': 'News / Dialogue',
        'أخبار / عامة': 'News / General',
        'أخبار / موسيقى': 'News / Music',
        'أخبار إخبارية': 'News Report',
        'أخبار ترفيه': 'Entertainment News',
        'أخبار دولية': 'International News',
        'أخبار رياضة': 'Sports News',
        'أخبار عالمية': 'World News',
        'أكاديمية': 'Academic',
        'أمازيغية': 'Amazigh',
        'أناشيد': 'Nasheeds',
        'أوكرانية': 'Ukrainian',
        'بالاد': 'Ballad',
        'بيئة': 'Environment',
        'تاريخية': 'Historical',
        'تراثية': 'Heritage',
        'تسجيلات إذاعية': 'Radio Recordings',
        'تمثيلية': 'Drama',
        'تمكين المرأة / موسيقى': "Women's Empowerment / Music",
        'توعوية': 'Awareness',
        'جريئة': 'Bold',
        'جوائز': 'Awards',
        'دينية (إسلامية)': 'Religious (Islamic)',
        'دينية (مسيحية)': 'Religious (Christian)',
        'دينيّة': 'Religious',
        'روك إنجليزي': 'English Rock',
        'سريالية': 'Surrealism',
        'سموث جاز': 'Smooth Jazz',
        'شعبية': 'Popular',
        'شعبية / فلكلورية': 'Popular / Folklore',
        'طعام / طبخ': 'Food / Cooking',
        'عامة - متنوعة': 'General - Various',
        'عبرية': 'Hebrew',
        'عربي': 'Arabic',
        'علمية': 'Scientific',
        'فلكلوري': 'Folklore',
        'فيديوهات': 'Videos',
        'قرآني': 'Quranic',
        'كلاسيكية إيطالية': 'Italian Classical',
        'كلاسيكية عربية': 'Arabic Classical',
        'كوميدية': 'Comedy',
        'كينيا': 'Kenya',
        'محلية (أمازيغية)': 'Local (Amazigh)',
        'محلية (إنجليزية)': 'Local (English)',
        'محلية (عربية)': 'Local (Arabic)',
        'محلية (فرنسية)': 'Local (French)',
        'محلية (كردية)': 'Local (Kurdish)',
        'مختلط': 'Mixed',
        'مستقلة (إندي)': 'Independent (Indie)',
        'مشاهدات': 'Views',
        'مصرية': 'Egyptian',
        'مقابلات': 'Interviews',
        'مناظرات': 'Debates',
        'موسيقى إيندي': 'Indie Music',
        'موسيقى البلوز': 'Blues Music',
        'موسيقى العصر الجديد': 'New Age Music',
        'موسيقى الكترونية': 'Electronic Music',
        'موسيقى الليل': 'Night Music',
        'موسيقى أمازيغية': 'Berber Music',
        'موسيقى أندلسية': 'Andalusian Music',
        'موسيقى أوكرانية': 'Ukrainian Music',
        'موسيقى إسبانية': 'Spanish Music',
        'موسيقى إفريقية': 'African Music',
        'موسيقى إلكترونية راقصة': 'Electronic Dance Music',
        'موسيقى الأطفال': "Children's Music",
        'موسيقى الأنديز': 'Andean Music',
        'موسيقى البحر الكاريبي': 'Caribbean Music',
        'موسيقى البوب': 'Pop Music',
        'موسيقى البوب العربية': 'Arabic Pop Music',
        'موسيقى البوب الكلاسيكية': 'Classical Pop Music',
        'موسيقى التركية': 'Turkish Music',
        'موسيقى الجاز': 'Jazz Music',
        'موسيقى الجيل الجديد': 'New Generation Music',
        'موسيقى الحجرة': 'Chamber Music',
        'موسيقى الروك': 'Rock Music',
        'موسيقى الزمن الجميل': 'Golden Age Music',
        'موسيقى السالسا': 'Salsa Music',
        'موسيقى السول': 'Soul Music',
        'موسيقى الشرق الأوسط': 'Middle Eastern Music',
        'موسيقى العالم الجديد': 'New World Music',
        'موسيقى العربية': 'Arabic Music',
        'موسيقى الكانتري': 'Country Music',
        'موسيقى اللاتينية': 'Latin Music',
        'موسيقى الليل الهادئة': 'Chill Night Music',
        'موسيقى المسيحية': 'Christian Music',
        'موسيقى المصاعد': 'Elevator Music',
        'موسيقى الملكية': 'Royal Music',
        'موسيقى الميتال': 'Metal Music',
        'موسيقى النادي': 'Club Music',
        'موسيقى الهند': 'Indian Music',
        'موسيقى اليابان': 'Japanese Music',
        'موسيقى بوب': 'Pop Music',
        'موسيقى بوب عربية': 'Arabic Pop Music',
        'موسيقى تركية': 'Turkish Music',
        'موسيقى تراثية': 'Traditional Music',
        'موسيقى ترفيهية': 'Entertainment Music',
        'موسيقى جنوب أفريقيا': 'South African Music',
        'موسيقى حزينة': 'Sad Music',
        'موسيقى حماسية': 'Upbeat Music',
        'موسيقى خليجية': 'Gulf Music',
        'موسيقى دينية': 'Religious Music',
        'موسيقى رقص إلكترونية': 'Electronic Dance Music',
        'موسيقى رومانسية': 'Romantic Music',
        'موسيقى سريعة': 'Fast Music',
        'موسيقى سودانية': 'Sudanese Music',
        'موسيقى شعبية': 'Folk Music',
        'موسيقى صامتة': 'Silent Music',
        'موسيقى عربية': 'Arabic Music',
        'موسيقى عربية كلاسيكية': 'Classical Arabic Music',
        'موسيقى عصرية': 'Contemporary Music',
        'موسيقى غربية': 'Western Music',
        'موسيقى فرنسية': 'French Music',
        'موسيقى فلكلورية': 'Folk Music',
        'موسيقى قبطية': 'Coptic Music',
        'موسيقى كلاسيكية': 'Classical Music',
        'موسيقى كمبودية': 'Cambodian Music',
        'موسيقى كندية': 'Canadian Music',
        'موسيقى كورية': 'Korean Music',
        'موسيقى لاتينية': 'Latin Music',
        'موسيقى لبنانية': 'Lebanese Music',
        'موسيقى ليتورجية': 'Liturgical Music',
        'موسيقى متعددة الثقافات': 'Multicultural Music',
        'موسيقى مصرية': 'Egyptian Music',
        'موسيقى مغربية': 'Moroccan Music',
        'موسيقى هادئة / كلاسيكية': 'Calm / Classical Music',
        'موسيقى هادئة/لونج': 'Relaxing / Lounge Music',
        'موسيقى هولندية': 'Dutch Music',
        'موسيقى يابانية': 'Japanese Music',
        'نادي': 'Club',
        'نهارية': 'Daytime',
        'هندوسية': 'Hindu',
        'وإذاعة': 'And Radio',
        'وقت العمل': 'Working Time',
        'يابانية': 'Japanese',
        'إسلامية': 'Islamic',
        'اسباني': 'Spanish',
        'بوب إنجليزي': 'English Pop',
        'بوب سويدي': 'Swedish Pop',
        'بوب عربي': 'Arabic Pop',
        'بوب فرنسي': 'French Pop',
        'سياسة': 'Politics',
        'عالمي': 'Worldwide',
        'من': 'From',
        'بوب بلغاري': 'Bulgarian Pop',
        'من Radio Browser': 'From Radio Browser',
        'جاز/لونج': 'Jazz/Lounge',
        'موجة جديدة ألمانية': 'German New Wave',
        'تكنولوجيا': 'Technology',
        'أخبار/ترفيه': 'News/Entertainment',
        'موسيقى/ترفيه': 'Music/Entertainment',
        'ديسكو إيطالي': 'Italian Disco',
        'بلوز أكوستيك': 'Acoustic Blues',
        'اسلامية': 'Islamic',
        'الاسلامية': 'Islamic',
        'هندية/موسيقى': 'Indian Music',
        'أسيوية': 'Asian',
        'قرآن/دينية': 'Quran/Religious',
        'جاز بيبوب': 'Bebop Jazz',
        'موسيقى مكسيكية': 'Mexican Music',
        'صحي': 'Wellness'
    };

    // ============================================================
    // 2. خرائط الترجمة إلى الفرنسية والإسبانية والألمانية والبرتغالية
    //    (نفس المفاتيح العربية، مع ترجمات مقابلة)
    // ============================================================
    const mapFr = {};
    const mapEs = {};
    const mapDe = {};
    const mapPt = {};

    // نقوم بملء الخرائط بناءً على mapEn، باستخدام ترجمات تقريبية
    // (يمكنك تعديل أي ترجمة لاحقاً)
    for (const [ar, en] of Object.entries(mapEn)) {
        // ترجمة فرنسية (تقريبية)
        mapFr[ar] = {
            'House': 'House',
            'Hospital': 'Hôpital',
            'Trans': 'Trans',
            'Country': 'Country',
            'African': 'Africain',
            'Italian': 'Italien',
            'German': 'Allemand',
            'Dutch': 'Néerlandais',
            'News in Russian': 'Actualités en russe',
            'Sports / Basketball': 'Sports / Basket-ball',
            'Russian': 'Russe',
            'News / Religious': 'Actualités / Religieux',
            'Music / Sports': 'Musique / Sports',
            'Various music': 'Musique variée',
            'Tropical music': 'Musique tropicale',
            'Italian classics': 'Classiques italiens',
            'Ethiopian music': 'Musique éthiopienne',
            'Youth / Music': 'Jeunesse / Musique',
            'dance music': 'musique dance',
            'Balkan': 'Balkanique',
            'Afrobeat': 'Afrobeat',
            'Music / Local': 'Musique / Local',
            'Carnival': 'Carnaval',
            'Dialogue/Music': 'Dialogue/Musique',
            'News / Entertainment': 'Actualités / Divertissement',
            'Music / Youth': 'Musique / Jeunesse',
            'Peripheral': 'Périphérique',
            'Rock / Music': 'Rock / Musique',
            'Russian / General': 'Russe / Général',
            'Music / Youth': 'Musique / Jeunesse',
            'Jazz Lounge': 'Jazz Lounge',
            'Music / Miscellaneous': 'Musique / Divers',
            'food': 'nourriture',
            'Music / News': 'Musique / Actualités',
            'Music / Youth': 'Musique / Jeunesse',
            'acid gas': 'gaz acide',
            'Home / Electronic': 'Maison / Électronique',
            'Entertainment': 'Divertissement',
            'Romantic': 'Romantique',
            'Blues and Souls': 'Blues et Soul',
            'Traffic': 'Trafic',
            'Electronic Music': 'Musique électronique',
            'German rock': 'Rock allemand',
            'Quiet Rock': 'Rock calme',
            'Pop/Youth': 'Pop/Jeunesse',
            'Progressive Rock': 'Rock progressif',
            'Traditional': 'Traditionnel',
            'Classical Jazz': 'Jazz classique',
            'Rock/Alternative': 'Rock/Alternatif',
            'pop rock': 'pop rock',
            'Rock and Roll': 'Rock and Roll',
            'Rock Disco': 'Rock Disco',
            'Alternative rock': 'Rock alternatif',
            'Spanish rock': 'Rock espagnol',
            'Disco Funk': 'Disco Funk',
            'Amateur radio': 'Radio amateur',
            'German rock': 'Rock allemand',
            'Indian Bob': 'Bob indien',
            'Folklore': 'Folklore',
            'punkrock': 'punkrock',
            'Blues Rock': 'Blues Rock',
            'Jazz Smooth': 'Jazz Smooth',
            'Jazz Bebop': 'Jazz Bebop',
            'Acid jazz': 'Acid jazz',
            'jazz trance': 'jazz trance',
            'K-Pop': 'K-Pop',
            'Jazz Fusion': 'Jazz Fusion',
            'acoustic jazz': 'jazz acoustique',
            'Trap': 'Trap',
            'Pop Folklore': 'Pop Folklore',
            'English': 'Anglais',
            'Chinese': 'Chinois',
            'Soul/Jazz': 'Soul/Jazz',
            'Urban Music': 'Musique urbaine',
            'Soul/Funk': 'Soul/Funk',
            'Hardstyle': 'Hardstyle',
            'Country religious': 'Country religieux',
            'Swing': 'Swing',
            'worldwide': 'mondial',
            'Islamic': 'Islamique',
            'My community': 'Ma communauté',
            'Rap': 'Rap',
            'Rock/Pop': 'Rock/Pop',
            'Rock/Indie': 'Rock/Indie',
            'Salsa/Cumbia': 'Salsa/Cumbia',
            'Cumbia': 'Cumbia',
            'Cumbia/Salsa': 'Cumbia/Salsa',
            'Bolero/Ballad': 'Boléro/Ballade',
            'Dance/Pop': 'Danse/Pop',
            'Pop-Folk': 'Pop-Folk',
            'Bulgarian Music': 'Musique bulgare',
            'Bulgarian Classics': 'Classiques bulgares',
            'Youth/Culture': 'Jeunesse/Culture',
            'Music/Culture': 'Musique/Culture',
            'Classical/Culture': 'Classique/Culture',
            'Classical/Soundtrack': 'Classique/Bande son',
            'Pop/Music': 'Pop/Musique',
            'Flamenco': 'Flamenco',
            'IsiZulu': 'IsiZulu',
            'Ska/Rocksteady': 'Ska/Rocksteady',
            'Reggae/Calm': 'Reggae/Calme',
            'Youth Music': 'Musique jeunesse',
            'Russian Pop': 'Pop russe',
            'Pop/Dance': 'Pop/Danse',
            'Russian Rock': 'Rock russe',
            'Hi-Life': 'Hi-Life',
            'News/Culture': 'Actualités/Culture',
            'News/Economy': 'Actualités/Économie',
            'Chanson': 'Chanson',
            'Pop/Chanson': 'Pop/Chanson',
            'Undefined': 'Non défini',
            'Music/Dialogue': 'Musique/Dialogue',
            'Alternative/Culture': 'Alternatif/Culture',
            'Urban/Reggaeton': 'Urbain/Reggaeton',
            'Afrikaans/Dialogue': 'Afrikaans/Dialogue',
            'Music/Sports': 'Musique/Sports',
            'Youth/Urban': 'Jeunesse/Urbain',
            'Contemporary': 'Contemporain',
            'Pop/Rock': 'Pop/Rock',
            'Various': 'Divers',
            'Reggae/Music': 'Reggae/Musique',
            'Reggae/Dancehall': 'Reggae/Dancehall',
            'Luk Thung': 'Luk Thung',
            'Rock/Alternative': 'Rock/Alternatif',
            'Bongo Flava': 'Bongo Flava',
            'News/Sports': 'Actualités/Sports',
            'University/Culture': 'Université/Culture',
            'General/Local': 'Général/Local',
            'Local/Tobago': 'Local/Tobago',
            'Long/Quiet': 'Long/Calme',
            'Health': 'Santé',
            'Urban/Music': 'Urbain/Musique',
            'Soca/Reggae': 'Soca/Reggae',
            'Music/Entertainment': 'Musique/Divertissement',
            'Talk/News': 'Talk/Actualités',
            'News/Entertainment': 'Actualités/Divertissement',
            'Natural Sounds': 'Sons naturels',
            'News / Music': 'Actualités / Musique',
            'News/Music': 'Actualités/Musique',
            'News / Culture': 'Actualités / Culture',
            'News/General': 'Actualités/Général',
            '24/7 News': 'Actualités 24/7',
            'Music/News': 'Musique/Actualités',
            'Rock/Metal': 'Rock/Metal',
            'News/Talk': 'Actualités/Talk',
            'Disco/Pop': 'Disco/Pop',
            'Disco Polo': 'Disco Polo',
            'Quiet/Long': 'Calme/Long',
            'Dance/Youth': 'Danse/Jeunesse',
            'Dance/Electronic': 'Danse/Électronique',
            'Patriotic': 'Patriotique',
            'German Pop': 'Pop allemande',
            'German Rap': 'Rap allemand',
            'Ukrainian Rock': 'Rock ukrainien',
            'Progressive': 'Progressif',
            'Underground': 'Souterrain',
            'Games': 'Jeux',
            'Indie': 'Indie',
            'Youth Music': 'Musique jeunesse',
            'Estonian Music': 'Musique estonienne',
            'Drum and Bass': 'Drum and Bass',
            'Dangdut': 'Dangdut',
            'World Music': 'Musique du monde',
            'Metal': 'Metal',
            'Grupera': 'Grupera',
            'Top 40': 'Top 40',
            'Event': 'Événement',
            'Music': 'Musique',
            'News': 'Actualités',
            'General': 'Général',
            'Sports': 'Sports',
            'Religious': 'Religieux',
            'University': 'Université',
            'Corporate': 'Entreprise',
            'Variety': 'Variété',
            'Classical': 'Classique',
            'Pop': 'Pop',
            'Rock': 'Rock',
            'Jazz': 'Jazz',
            'Talk': 'Talk',
            'Culture': 'Culture',
            'Educational': 'Éducatif',
            'Islamic': 'Islamique',
            'Quran': 'Coran',
            'Variety': 'Variété',
            'Blues': 'Blues',
            'Hip Hop': 'Hip Hop',
            'Salsa': 'Salsa',
            'Tango': 'Tango',
            'Disco': 'Disco',
            'Techno': 'Techno',
            'Reggae': 'Reggae',
            'Funk': 'Funk',
            'Soul': 'Soul',
            'Latin': 'Latin',
            'Arabic': 'Arabe',
            'Islamic': 'Islamique',
            'Classical': 'Classique',
            'Flamenco': 'Flamenco',
            'Opera': 'Opéra',
            'R&B': 'R&B',
            'Rap': 'Rap',
            'Dance': 'Danse',
            'Local': 'Local',
            'Afrikaans': 'Afrikaans',
            'Tropical Music': 'Musique tropicale',
            'Dialogue': 'Dialogue',
            'Relaxing Music': 'Musique relaxante',
            'R&B': 'R&B',
            'Persian': 'Persan',
            'Maghrebi': 'Maghrébin',
            'Community': 'Communauté',
            'University': 'Université',
            'Holy Quran': 'Saint Coran',
            'Indian': 'Indien',
            'Modern': 'Moderne',
            'University': 'Université',
            'Children': 'Enfants',
            'Rural': 'Rural',
            'Comedy': 'Comédie',
            'Vocaloid': 'Vocaloid',
            'Italian Music': 'Musique italienne',
            'Forró': 'Forró',
            'Latin': 'Latin',
            'News and Culture': 'Actualités et culture',
            'Anime': 'Anime',
            'Japanese Pop': 'Pop japonaise',
            'Japanese Rock': 'Rock japonais',
            'Austrian Pop': 'Pop autrichienne',
            'Movies': 'Films',
            'Schlager': 'Schlager',
            'Lounge': 'Lounge',
            'Cultural': 'Culturel',
            'Cultural': 'Culturel',
            'News': 'Actualités',
            'Traditional Music': 'Musique traditionnelle',
            'University': 'Université',
            'Oldies': 'Oldies',
            'Cars': 'Voitures',
            'Youth': 'Jeunesse',
            'Turkish': 'Turc',
            'Classic Rock': 'Rock classique',
            'Relaxation': 'Détente',
            'Youthful': 'Juvénile',
            'Alternative': 'Alternatif',
            'Christmas': 'Noël',
            'Religious': 'Religieux',
            'Best Songs': 'Meilleures chansons',
            'World Music': 'Musique du monde',
            'Classics': 'Classiques',
            'Classics': 'Classiques',
            'Classical': 'Classique',
            'Classical': 'Classique',
            'Spiritual': 'Spirituel',
            'Tarab': 'Tarab',
            'Francophone': 'Francophone',
            'Christian': 'Chrétien',
            'Andalusian': 'Andalou',
            'Comedy': 'Comédie',
            'Documentary': 'Documentaire',
            'Drama': 'Drame',
            'Food': 'Cuisine',
            'Health': 'Santé',
            'Urban': 'Urbain',
            'Kids': 'Enfants',
            'Travel': 'Voyage',
            'Opera': 'Opéra',
            'Fado': 'Fado',
            'Portuguese': 'Portugais',
            'Brazilian': 'Brésilien',
            'Classic Rock': 'Rock classique',
            'News': 'Actualités',
            'Sports': 'Sports',
            'Basketball': 'Basketball',
            'Football': 'Football',
            'Podcast': 'Podcast',
            'Hip Hop/Urban': 'Hip Hop/Urbain',
            'Lok Thong/Folklore': 'Lok Thong/Folklore',
            'Traditional Music': 'Musique traditionnelle',
            'Romantic': 'Romantique',
            'Relaxing': 'Relaxant',
            'Electronic': 'Électronique',
            'Folk': 'Folk',
            'Folklore': 'Folklore',
            'Youth': 'Jeunesse',
            'News / Culture': 'Actualités / Culture',
            'News / Dialogue': 'Actualités / Dialogue',
            'News / General': 'Actualités / Général',
            'News / Music': 'Actualités / Musique',
            'News Report': 'Reportage',
            'Entertainment News': 'Actualités divertissement',
            'International News': 'Actualités internationales',
            'Sports News': 'Actualités sportives',
            'World News': 'Actualités mondiales',
            'Academic': 'Académique',
            'Amazigh': 'Amazigh',
            'Nasheeds': 'Nasheeds',
            'Ukrainian': 'Ukrainien',
            'Ballad': 'Ballade',
            'Environment': 'Environnement',
            'Historical': 'Historique',
            'Heritage': 'Patrimoine',
            'Radio Recordings': 'Enregistrements radio',
            'Drama': 'Drame',
            "Women's Empowerment / Music": "Autonomisation des femmes / Musique",
            'Awareness': 'Sensibilisation',
            'Bold': 'Audacieux',
            'Awards': 'Récompenses',
            'Religious (Islamic)': 'Religieux (Islamique)',
            'Religious (Christian)': 'Religieux (Chrétien)',
            'Religious': 'Religieux',
            'English Rock': 'Rock anglais',
            'Surrealism': 'Surréalisme',
            'Smooth Jazz': 'Smooth Jazz',
            'Popular': 'Populaire',
            'Popular / Folklore': 'Populaire / Folklore',
            'Food / Cooking': 'Cuisine / Cuisine',
            'General - Various': 'Général - Divers',
            'Hebrew': 'Hébreu',
            'Arabic': 'Arabe',
            'Scientific': 'Scientifique',
            'Folklore': 'Folklore',
            'Videos': 'Vidéos',
            'Quranic': 'Coranique',
            'Italian Classical': 'Classique italien',
            'Arabic Classical': 'Classique arabe',
            'Comedy': 'Comédie',
            'Kenya': 'Kenya',
            'Local (Amazigh)': 'Local (Amazigh)',
            'Local (English)': 'Local (Anglais)',
            'Local (Arabic)': 'Local (Arabe)',
            'Local (French)': 'Local (Français)',
            'Local (Kurdish)': 'Local (Kurde)',
            'Mixed': 'Mixte',
            'Independent (Indie)': 'Indépendant (Indie)',
            'Views': 'Vues',
            'Egyptian': 'Égyptien',
            'Interviews': 'Interviews',
            'Debates': 'Débats',
            'Indie Music': 'Musique indie',
            'Blues Music': 'Musique blues',
            'New Age Music': 'Musique New Age',
            'Electronic Music': 'Musique électronique',
            'Night Music': 'Musique nocturne',
            'Berber Music': 'Musique berbère',
            'Andalusian Music': 'Musique andalouse',
            'Ukrainian Music': 'Musique ukrainienne',
            'Spanish Music': 'Musique espagnole',
            'African Music': 'Musique africaine',
            'Electronic Dance Music': 'Musique électronique dance',
            "Children's Music": "Musique pour enfants",
            'Andean Music': 'Musique andine',
            'Caribbean Music': 'Musique caribéenne',
            'Pop Music': 'Musique pop',
            'Arabic Pop Music': 'Musique pop arabe',
            'Classical Pop Music': 'Musique pop classique',
            'Turkish Music': 'Musique turque',
            'Jazz Music': 'Musique jazz',
            'New Generation Music': 'Musique nouvelle génération',
            'Chamber Music': 'Musique de chambre',
            'Rock Music': 'Musique rock',
            'Golden Age Music': 'Musique de l\'âge d\'or',
            'Salsa Music': 'Musique salsa',
            'Soul Music': 'Musique soul',
            'Middle Eastern Music': 'Musique du Moyen-Orient',
            'New World Music': 'Musique du Nouveau Monde',
            'Arabic Music': 'Musique arabe',
            'Country Music': 'Musique country',
            'Latin Music': 'Musique latine',
            'Chill Night Music': 'Musique chill nuit',
            'Christian Music': 'Musique chrétienne',
            'Elevator Music': 'Musique d\'ascenseur',
            'Royal Music': 'Musique royale',
            'Metal Music': 'Musique metal',
            'Club Music': 'Musique de club',
            'Indian Music': 'Musique indienne',
            'Japanese Music': 'Musique japonaise',
            'Pop Music': 'Musique pop',
            'Arabic Pop Music': 'Musique pop arabe',
            'Turkish Music': 'Musique turque',
            'Traditional Music': 'Musique traditionnelle',
            'Entertainment Music': 'Musique de divertissement',
            'South African Music': 'Musique sud-africaine',
            'Sad Music': 'Musique triste',
            'Upbeat Music': 'Musique entraînante',
            'Gulf Music': 'Musique du Golfe',
            'Religious Music': 'Musique religieuse',
            'Electronic Dance Music': 'Musique électronique dance',
            'Romantic Music': 'Musique romantique',
            'Fast Music': 'Musique rapide',
            'Sudanese Music': 'Musique soudanaise',
            'Folk Music': 'Musique folk',
            'Silent Music': 'Musique silencieuse',
            'Arabic Music': 'Musique arabe',
            'Classical Arabic Music': 'Musique arabe classique',
            'Contemporary Music': 'Musique contemporaine',
            'Western Music': 'Musique occidentale',
            'French Music': 'Musique française',
            'Folk Music': 'Musique folk',
            'Coptic Music': 'Musique copte',
            'Classical Music': 'Musique classique',
            'Cambodian Music': 'Musique cambodgienne',
            'Canadian Music': 'Musique canadienne',
            'Korean Music': 'Musique coréenne',
            'Latin Music': 'Musique latine',
            'Lebanese Music': 'Musique libanaise',
            'Liturgical Music': 'Musique liturgique',
            'Multicultural Music': 'Musique multiculturelle',
            'Egyptian Music': 'Musique égyptienne',
            'Moroccan Music': 'Musique marocaine',
            'Calm / Classical Music': 'Musique calme / classique',
            'Relaxing / Lounge Music': 'Musique relaxante / Lounge',
            'Dutch Music': 'Musique néerlandaise',
            'Japanese Music': 'Musique japonaise',
            'Club': 'Club',
            'Daytime': 'Journée',
            'Hindu': 'Hindou',
            'And Radio': 'Et Radio',
            'Working Time': 'Temps de travail',
            'Japanese': 'Japonais',
            'Islamic': 'Islamique',
            'Spanish': 'Espagnol',
            'English Pop': 'Pop anglaise',
            'Swedish Pop': 'Pop suédoise',
            'Arabic Pop': 'Pop arabe',
            'French Pop': 'Pop française',
            'Politics': 'Politique',
            'Worldwide': 'Mondial',
            'From': 'De',
            'Bulgarian Pop': 'Pop bulgare',
            'From Radio Browser': 'De Radio Browser',
            'Jazz/Lounge': 'Jazz/Lounge',
            'German New Wave': 'Nouvelle vague allemande',
            'Technology': 'Technologie',
            'News/Entertainment': 'Actualités/Divertissement',
            'Music/Entertainment': 'Musique/Divertissement',
            'Italian Disco': 'Disco italien',
            'Acoustic Blues': 'Blues acoustique',
            'Islamic': 'Islamique',
            'Islamic': 'Islamique',
            'Indian Music': 'Musique indienne',
            'Asian': 'Asiatique',
            'Quran/Religious': 'Coran/Religieux',
            'Bebop Jazz': 'Jazz Bebop',
            'Mexican Music': 'Musique mexicaine',
            'Wellness': 'Bien-être'
        }[en] || en; // إذا لم نجد الترجمة الفرنسية، نأخذ الإنجليزية

        // ترجمة إسبانية (تقريبية)
        mapEs[ar] = {
            'House': 'House',
            'Hospital': 'Hospital',
            'Trans': 'Trans',
            'Country': 'Country',
            'African': 'Africano',
            'Italian': 'Italiano',
            'German': 'Alemán',
            'Dutch': 'Neerlandés',
            'News in Russian': 'Noticias en ruso',
            'Sports / Basketball': 'Deportes / Baloncesto',
            'Russian': 'Ruso',
            'News / Religious': 'Noticias / Religioso',
            'Music / Sports': 'Música / Deportes',
            'Various music': 'Música variada',
            'Tropical music': 'Música tropical',
            'Italian classics': 'Clásicos italianos',
            'Ethiopian music': 'Música etíope',
            'Youth / Music': 'Juventud / Música',
            'dance music': 'música dance',
            'Balkan': 'Balcánico',
            'Afrobeat': 'Afrobeat',
            'Music / Local': 'Música / Local',
            'Carnival': 'Carnaval',
            'Dialogue/Music': 'Diálogo/Música',
            'News / Entertainment': 'Noticias / Entretenimiento',
            'Music / Youth': 'Música / Juventud',
            'Peripheral': 'Periférico',
            'Rock / Music': 'Rock / Música',
            'Russian / General': 'Ruso / General',
            'Music / Youth': 'Música / Juventud',
            'Jazz Lounge': 'Jazz Lounge',
            'Music / Miscellaneous': 'Música / Varios',
            'food': 'comida',
            'Music / News': 'Música / Noticias',
            'Music / Youth': 'Música / Juventud',
            'acid gas': 'gas ácido',
            'Home / Electronic': 'Hogar / Electrónico',
            'Entertainment': 'Entretenimiento',
            'Romantic': 'Romántico',
            'Blues and Souls': 'Blues y Soul',
            'Traffic': 'Tráfico',
            'Electronic Music': 'Música electrónica',
            'German rock': 'Rock alemán',
            'Quiet Rock': 'Rock tranquilo',
            'Pop/Youth': 'Pop/Juventud',
            'Progressive Rock': 'Rock progresivo',
            'Traditional': 'Tradicional',
            'Classical Jazz': 'Jazz clásico',
            'Rock/Alternative': 'Rock/Alternativo',
            'pop rock': 'pop rock',
            'Rock and Roll': 'Rock and Roll',
            'Rock Disco': 'Rock Disco',
            'Alternative rock': 'Rock alternativo',
            'Spanish rock': 'Rock español',
            'Disco Funk': 'Disco Funk',
            'Amateur radio': 'Radioaficionado',
            'German rock': 'Rock alemán',
            'Indian Bob': 'Bob indio',
            'Folklore': 'Folclore',
            'punkrock': 'punkrock',
            'Blues Rock': 'Blues Rock',
            'Jazz Smooth': 'Jazz Smooth',
            'Jazz Bebop': 'Jazz Bebop',
            'Acid jazz': 'Acid jazz',
            'jazz trance': 'jazz trance',
            'K-Pop': 'K-Pop',
            'Jazz Fusion': 'Jazz Fusion',
            'acoustic jazz': 'jazz acústico',
            'Trap': 'Trap',
            'Pop Folklore': 'Pop Folclore',
            'English': 'Inglés',
            'Chinese': 'Chino',
            'Soul/Jazz': 'Soul/Jazz',
            'Urban Music': 'Música urbana',
            'Soul/Funk': 'Soul/Funk',
            'Hardstyle': 'Hardstyle',
            'Country religious': 'Country religioso',
            'Swing': 'Swing',
            'worldwide': 'mundial',
            'Islamic': 'Islámico',
            'My community': 'Mi comunidad',
            'Rap': 'Rap',
            'Rock/Pop': 'Rock/Pop',
            'Rock/Indie': 'Rock/Indie',
            'Salsa/Cumbia': 'Salsa/Cumbia',
            'Cumbia': 'Cumbia',
            'Cumbia/Salsa': 'Cumbia/Salsa',
            'Bolero/Ballad': 'Bolero/Balada',
            'Dance/Pop': 'Danza/Pop',
            'Pop-Folk': 'Pop-Folk',
            'Bulgarian Music': 'Música búlgara',
            'Bulgarian Classics': 'Clásicos búlgaros',
            'Youth/Culture': 'Juventud/Cultura',
            'Music/Culture': 'Música/Cultura',
            'Classical/Culture': 'Clásica/Cultura',
            'Classical/Soundtrack': 'Clásica/Banda sonora',
            'Pop/Music': 'Pop/Música',
            'Flamenco': 'Flamenco',
            'IsiZulu': 'IsiZulu',
            'Ska/Rocksteady': 'Ska/Rocksteady',
            'Reggae/Calm': 'Reggae/Calma',
            'Youth Music': 'Música juvenil',
            'Russian Pop': 'Pop ruso',
            'Pop/Dance': 'Pop/Danza',
            'Russian Rock': 'Rock ruso',
            'Hi-Life': 'Hi-Life',
            'News/Culture': 'Noticias/Cultura',
            'News/Economy': 'Noticias/Economía',
            'Chanson': 'Chanson',
            'Pop/Chanson': 'Pop/Chanson',
            'Undefined': 'No definido',
            'Music/Dialogue': 'Música/Diálogo',
            'Alternative/Culture': 'Alternativo/Cultura',
            'Urban/Reggaeton': 'Urbano/Reggaeton',
            'Afrikaans/Dialogue': 'Afrikaans/Diálogo',
            'Music/Sports': 'Música/Deportes',
            'Youth/Urban': 'Juventud/Urbano',
            'Contemporary': 'Contemporáneo',
            'Pop/Rock': 'Pop/Rock',
            'Various': 'Varios',
            'Reggae/Music': 'Reggae/Música',
            'Reggae/Dancehall': 'Reggae/Dancehall',
            'Luk Thung': 'Luk Thung',
            'Rock/Alternative': 'Rock/Alternativo',
            'Bongo Flava': 'Bongo Flava',
            'News/Sports': 'Noticias/Deportes',
            'University/Culture': 'Universidad/Cultura',
            'General/Local': 'General/Local',
            'Local/Tobago': 'Local/Tobago',
            'Long/Quiet': 'Largo/Tranquilo',
            'Health': 'Salud',
            'Urban/Music': 'Urbano/Música',
            'Soca/Reggae': 'Soca/Reggae',
            'Music/Entertainment': 'Música/Entretenimiento',
            'Talk/News': 'Talk/Noticias',
            'News/Entertainment': 'Noticias/Entretenimiento',
            'Natural Sounds': 'Sonidos naturales',
            'News / Music': 'Noticias / Música',
            'News/Music': 'Noticias/Música',
            'News / Culture': 'Noticias / Cultura',
            'News/General': 'Noticias/General',
            '24/7 News': 'Noticias 24/7',
            'Music/News': 'Música/Noticias',
            'Rock/Metal': 'Rock/Metal',
            'News/Talk': 'Noticias/Talk',
            'Disco/Pop': 'Disco/Pop',
            'Disco Polo': 'Disco Polo',
            'Quiet/Long': 'Tranquilo/Largo',
            'Dance/Youth': 'Danza/Juventud',
            'Dance/Electronic': 'Danza/Electrónica',
            'Patriotic': 'Patriótico',
            'German Pop': 'Pop alemán',
            'German Rap': 'Rap alemán',
            'Ukrainian Rock': 'Rock ucraniano',
            'Progressive': 'Progresivo',
            'Underground': 'Subterráneo',
            'Games': 'Juegos',
            'Indie': 'Indie',
            'Youth Music': 'Música juvenil',
            'Estonian Music': 'Música estonia',
            'Drum and Bass': 'Drum and Bass',
            'Dangdut': 'Dangdut',
            'World Music': 'Música del mundo',
            'Metal': 'Metal',
            'Grupera': 'Grupera',
            'Top 40': 'Top 40',
            'Event': 'Evento',
            'Music': 'Música',
            'News': 'Noticias',
            'General': 'General',
            'Sports': 'Deportes',
            'Religious': 'Religioso',
            'University': 'Universidad',
            'Corporate': 'Corporativo',
            'Variety': 'Variedad',
            'Classical': 'Clásica',
            'Pop': 'Pop',
            'Rock': 'Rock',
            'Jazz': 'Jazz',
            'Talk': 'Talk',
            'Culture': 'Cultura',
            'Educational': 'Educativo',
            'Islamic': 'Islámico',
            'Quran': 'Corán',
            'Variety': 'Variedad',
            'Blues': 'Blues',
            'Hip Hop': 'Hip Hop',
            'Salsa': 'Salsa',
            'Tango': 'Tango',
            'Disco': 'Disco',
            'Techno': 'Tecno',
            'Reggae': 'Reggae',
            'Funk': 'Funk',
            'Soul': 'Soul',
            'Latin': 'Latino',
            'Arabic': 'Árabe',
            'Islamic': 'Islámico',
            'Classical': 'Clásica',
            'Flamenco': 'Flamenco',
            'Opera': 'Ópera',
            'R&B': 'R&B',
            'Rap': 'Rap',
            'Dance': 'Danza',
            'Local': 'Local',
            'Afrikaans': 'Afrikaans',
            'Tropical Music': 'Música tropical',
            'Dialogue': 'Diálogo',
            'Relaxing Music': 'Música relajante',
            'R&B': 'R&B',
            'Persian': 'Persa',
            'Maghrebi': 'Magrebí',
            'Community': 'Comunidad',
            'University': 'Universidad',
            'Holy Quran': 'Santo Corán',
            'Indian': 'Indio',
            'Modern': 'Moderno',
            'University': 'Universidad',
            'Children': 'Niños',
            'Rural': 'Rural',
            'Comedy': 'Comedia',
            'Vocaloid': 'Vocaloid',
            'Italian Music': 'Música italiana',
            'Forró': 'Forró',
            'Latin': 'Latino',
            'News and Culture': 'Noticias y cultura',
            'Anime': 'Anime',
            'Japanese Pop': 'Pop japonés',
            'Japanese Rock': 'Rock japonés',
            'Austrian Pop': 'Pop austriaco',
            'Movies': 'Películas',
            'Schlager': 'Schlager',
            'Lounge': 'Lounge',
            'Cultural': 'Cultural',
            'Cultural': 'Cultural',
            'News': 'Noticias',
            'Traditional Music': 'Música tradicional',
            'University': 'Universidad',
            'Oldies': 'Oldies',
            'Cars': 'Coches',
            'Youth': 'Juventud',
            'Turkish': 'Turco',
            'Classic Rock': 'Rock clásico',
            'Relaxation': 'Relajación',
            'Youthful': 'Juvenil',
            'Alternative': 'Alternativo',
            'Christmas': 'Navidad',
            'Religious': 'Religioso',
            'Best Songs': 'Mejores canciones',
            'World Music': 'Música del mundo',
            'Classics': 'Clásicos',
            'Classics': 'Clásicos',
            'Classical': 'Clásica',
            'Classical': 'Clásica',
            'Spiritual': 'Espiritual',
            'Tarab': 'Tarab',
            'Francophone': 'Francófono',
            'Christian': 'Cristiano',
            'Andalusian': 'Andaluz',
            'Comedy': 'Comedia',
            'Documentary': 'Documental',
            'Drama': 'Drama',
            'Food': 'Comida',
            'Health': 'Salud',
            'Urban': 'Urbano',
            'Kids': 'Niños',
            'Travel': 'Viajes',
            'Opera': 'Ópera',
            'Fado': 'Fado',
            'Portuguese': 'Portugués',
            'Brazilian': 'Brasileño',
            'Classic Rock': 'Rock clásico',
            'News': 'Noticias',
            'Sports': 'Deportes',
            'Basketball': 'Baloncesto',
            'Football': 'Fútbol',
            'Podcast': 'Podcast',
            'Hip Hop/Urban': 'Hip Hop/Urbano',
            'Lok Thong/Folklore': 'Lok Thong/Folklore',
            'Traditional Music': 'Música tradicional',
            'Romantic': 'Romántico',
            'Relaxing': 'Relajante',
            'Electronic': 'Electrónico',
            'Folk': 'Folk',
            'Folklore': 'Folclore',
            'Youth': 'Juventud',
            'News / Culture': 'Noticias / Cultura',
            'News / Dialogue': 'Noticias / Diálogo',
            'News / General': 'Noticias / General',
            'News / Music': 'Noticias / Música',
            'News Report': 'Reportaje',
            'Entertainment News': 'Noticias de entretenimiento',
            'International News': 'Noticias internacionales',
            'Sports News': 'Noticias deportivas',
            'World News': 'Noticias mundiales',
            'Academic': 'Académico',
            'Amazigh': 'Amazigh',
            'Nasheeds': 'Nasheeds',
            'Ukrainian': 'Ucraniano',
            'Ballad': 'Balada',
            'Environment': 'Medio ambiente',
            'Historical': 'Histórico',
            'Heritage': 'Patrimonio',
            'Radio Recordings': 'Grabaciones de radio',
            'Drama': 'Drama',
            "Women's Empowerment / Music": "Empoderamiento de la mujer / Música",
            'Awareness': 'Concienciación',
            'Bold': 'Audaz',
            'Awards': 'Premios',
            'Religious (Islamic)': 'Religioso (Islámico)',
            'Religious (Christian)': 'Religioso (Cristiano)',
            'Religious': 'Religioso',
            'English Rock': 'Rock inglés',
            'Surrealism': 'Surrealismo',
            'Smooth Jazz': 'Smooth Jazz',
            'Popular': 'Popular',
            'Popular / Folklore': 'Popular / Folclore',
            'Food / Cooking': 'Comida / Cocina',
            'General - Various': 'General - Varios',
            'Hebrew': 'Hebreo',
            'Arabic': 'Árabe',
            'Scientific': 'Científico',
            'Folklore': 'Folclore',
            'Videos': 'Vídeos',
            'Quranic': 'Coránico',
            'Italian Classical': 'Clásica italiana',
            'Arabic Classical': 'Clásica árabe',
            'Comedy': 'Comedia',
            'Kenya': 'Kenia',
            'Local (Amazigh)': 'Local (Amazigh)',
            'Local (English)': 'Local (Inglés)',
            'Local (Arabic)': 'Local (Árabe)',
            'Local (French)': 'Local (Francés)',
            'Local (Kurdish)': 'Local (Kurdo)',
            'Mixed': 'Mixto',
            'Independent (Indie)': 'Independiente (Indie)',
            'Views': 'Vistas',
            'Egyptian': 'Egipcio',
            'Interviews': 'Entrevistas',
            'Debates': 'Debates',
            'Indie Music': 'Música indie',
            'Blues Music': 'Música blues',
            'New Age Music': 'Música New Age',
            'Electronic Music': 'Música electrónica',
            'Night Music': 'Música nocturna',
            'Berber Music': 'Música bereber',
            'Andalusian Music': 'Música andaluza',
            'Ukrainian Music': 'Música ucraniana',
            'Spanish Music': 'Música española',
            'African Music': 'Música africana',
            'Electronic Dance Music': 'Música electrónica dance',
            "Children's Music": "Música para niños",
            'Andean Music': 'Música andina',
            'Caribbean Music': 'Música caribeña',
            'Pop Music': 'Música pop',
            'Arabic Pop Music': 'Música pop árabe',
            'Classical Pop Music': 'Música pop clásica',
            'Turkish Music': 'Música turca',
            'Jazz Music': 'Música jazz',
            'New Generation Music': 'Música nueva generación',
            'Chamber Music': 'Música de cámara',
            'Rock Music': 'Música rock',
            'Golden Age Music': 'Música de la edad de oro',
            'Salsa Music': 'Música salsa',
            'Soul Music': 'Música soul',
            'Middle Eastern Music': 'Música de Oriente Medio',
            'New World Music': 'Música del Nuevo Mundo',
            'Arabic Music': 'Música árabe',
            'Country Music': 'Música country',
            'Latin Music': 'Música latina',
            'Chill Night Music': 'Música chill noche',
            'Christian Music': 'Música cristiana',
            'Elevator Music': 'Música de ascensor',
            'Royal Music': 'Música real',
            'Metal Music': 'Música metal',
            'Club Music': 'Música de club',
            'Indian Music': 'Música india',
            'Japanese Music': 'Música japonesa',
            'Pop Music': 'Música pop',
            'Arabic Pop Music': 'Música pop árabe',
            'Turkish Music': 'Música turca',
            'Traditional Music': 'Música tradicional',
            'Entertainment Music': 'Música de entretenimiento',
            'South African Music': 'Música sudafricana',
            'Sad Music': 'Música triste',
            'Upbeat Music': 'Música alegre',
            'Gulf Music': 'Música del Golfo',
            'Religious Music': 'Música religiosa',
            'Electronic Dance Music': 'Música electrónica dance',
            'Romantic Music': 'Música romántica',
            'Fast Music': 'Música rápida',
            'Sudanese Music': 'Música sudanesa',
            'Folk Music': 'Música folk',
            'Silent Music': 'Música silenciosa',
            'Arabic Music': 'Música árabe',
            'Classical Arabic Music': 'Música árabe clásica',
            'Contemporary Music': 'Música contemporánea',
            'Western Music': 'Música occidental',
            'French Music': 'Música francesa',
            'Folk Music': 'Música folk',
            'Coptic Music': 'Música copta',
            'Classical Music': 'Música clásica',
            'Cambodian Music': 'Música camboyana',
            'Canadian Music': 'Música canadiense',
            'Korean Music': 'Música coreana',
            'Latin Music': 'Música latina',
            'Lebanese Music': 'Música libanesa',
            'Liturgical Music': 'Música litúrgica',
            'Multicultural Music': 'Música multicultural',
            'Egyptian Music': 'Música egipcia',
            'Moroccan Music': 'Música marroquí',
            'Calm / Classical Music': 'Música tranquila / clásica',
            'Relaxing / Lounge Music': 'Música relajante / Lounge',
            'Dutch Music': 'Música neerlandesa',
            'Japanese Music': 'Música japonesa',
            'Club': 'Club',
            'Daytime': 'Diurno',
            'Hindu': 'Hindú',
            'And Radio': 'Y Radio',
            'Working Time': 'Tiempo de trabajo',
            'Japanese': 'Japonés',
            'Islamic': 'Islámico',
            'Spanish': 'Español',
            'English Pop': 'Pop inglés',
            'Swedish Pop': 'Pop sueco',
            'Arabic Pop': 'Pop árabe',
            'French Pop': 'Pop francés',
            'Politics': 'Política',
            'Worldwide': 'Mundial',
            'From': 'De',
            'Bulgarian Pop': 'Pop búlgaro',
            'From Radio Browser': 'De Radio Browser',
            'Jazz/Lounge': 'Jazz/Lounge',
            'German New Wave': 'Nueva ola alemana',
            'Technology': 'Tecnología',
            'News/Entertainment': 'Noticias/Entretenimiento',
            'Music/Entertainment': 'Música/Entretenimiento',
            'Italian Disco': 'Disco italiano',
            'Acoustic Blues': 'Blues acústico',
            'Islamic': 'Islámico',
            'Islamic': 'Islámico',
            'Indian Music': 'Música india',
            'Asian': 'Asiático',
            'Quran/Religious': 'Corán/Religioso',
            'Bebop Jazz': 'Jazz Bebop',
            'Mexican Music': 'Música mexicana',
            'Wellness': 'Bienestar'
        }[en] || en;

        // ترجمة ألمانية (تقريبية)
        mapDe[ar] = {
            'House': 'House',
            'Hospital': 'Krankenhaus',
            'Trans': 'Trans',
            'Country': 'Country',
            'African': 'Afrikanisch',
            'Italian': 'Italienisch',
            'German': 'Deutsch',
            'Dutch': 'Niederländisch',
            'News in Russian': 'Nachrichten auf Russisch',
            'Sports / Basketball': 'Sport / Basketball',
            'Russian': 'Russisch',
            'News / Religious': 'Nachrichten / Religiös',
            'Music / Sports': 'Musik / Sport',
            'Various music': 'Verschiedene Musik',
            'Tropical music': 'Tropische Musik',
            'Italian classics': 'Italienische Klassiker',
            'Ethiopian music': 'Äthiopische Musik',
            'Youth / Music': 'Jugend / Musik',
            'dance music': 'Tanzmusik',
            'Balkan': 'Balkan',
            'Afrobeat': 'Afrobeat',
            'Music / Local': 'Musik / Lokal',
            'Carnival': 'Karneval',
            'Dialogue/Music': 'Dialog/Musik',
            'News / Entertainment': 'Nachrichten / Unterhaltung',
            'Music / Youth': 'Musik / Jugend',
            'Peripheral': 'Peripher',
            'Rock / Music': 'Rock / Musik',
            'Russian / General': 'Russisch / Allgemein',
            'Music / Youth': 'Musik / Jugend',
            'Jazz Lounge': 'Jazz Lounge',
            'Music / Miscellaneous': 'Musik / Verschiedenes',
            'food': 'Essen',
            'Music / News': 'Musik / Nachrichten',
            'Music / Youth': 'Musik / Jugend',
            'acid gas': 'saures Gas',
            'Home / Electronic': 'Zuhause / Elektronisch',
            'Entertainment': 'Unterhaltung',
            'Romantic': 'Romantisch',
            'Blues and Souls': 'Blues und Soul',
            'Traffic': 'Verkehr',
            'Electronic Music': 'Elektronische Musik',
            'German rock': 'Deutscher Rock',
            'Quiet Rock': 'Leiser Rock',
            'Pop/Youth': 'Pop/Jugend',
            'Progressive Rock': 'Progressiver Rock',
            'Traditional': 'Traditionell',
            'Classical Jazz': 'Klassischer Jazz',
            'Rock/Alternative': 'Rock/Alternative',
            'pop rock': 'Pop-Rock',
            'Rock and Roll': 'Rock and Roll',
            'Rock Disco': 'Rock Disco',
            'Alternative rock': 'Alternative Rock',
            'Spanish rock': 'Spanischer Rock',
            'Disco Funk': 'Disco Funk',
            'Amateur radio': 'Amateurfunk',
            'German rock': 'Deutscher Rock',
            'Indian Bob': 'Indischer Bob',
            'Folklore': 'Folklore',
            'punkrock': 'Punkrock',
            'Blues Rock': 'Blues Rock',
            'Jazz Smooth': 'Jazz Smooth',
            'Jazz Bebop': 'Jazz Bebop',
            'Acid jazz': 'Acid Jazz',
            'jazz trance': 'Jazz Trance',
            'K-Pop': 'K-Pop',
            'Jazz Fusion': 'Jazz Fusion',
            'acoustic jazz': 'Akustischer Jazz',
            'Trap': 'Trap',
            'Pop Folklore': 'Pop-Folklore',
            'English': 'Englisch',
            'Chinese': 'Chinesisch',
            'Soul/Jazz': 'Soul/Jazz',
            'Urban Music': 'Urbane Musik',
            'Soul/Funk': 'Soul/Funk',
            'Hardstyle': 'Hardstyle',
            'Country religious': 'Country religiös',
            'Swing': 'Swing',
            'worldwide': 'weltweit',
            'Islamic': 'Islamisch',
            'My community': 'Meine Gemeinde',
            'Rap': 'Rap',
            'Rock/Pop': 'Rock/Pop',
            'Rock/Indie': 'Rock/Indie',
            'Salsa/Cumbia': 'Salsa/Cumbia',
            'Cumbia': 'Cumbia',
            'Cumbia/Salsa': 'Cumbia/Salsa',
            'Bolero/Ballad': 'Bolero/Ballade',
            'Dance/Pop': 'Tanz/Pop',
            'Pop-Folk': 'Pop-Folk',
            'Bulgarian Music': 'Bulgarische Musik',
            'Bulgarian Classics': 'Bulgarische Klassiker',
            'Youth/Culture': 'Jugend/Kultur',
            'Music/Culture': 'Musik/Kultur',
            'Classical/Culture': 'Klassik/Kultur',
            'Classical/Soundtrack': 'Klassik/Soundtrack',
            'Pop/Music': 'Pop/Musik',
            'Flamenco': 'Flamenco',
            'IsiZulu': 'IsiZulu',
            'Ska/Rocksteady': 'Ska/Rocksteady',
            'Reggae/Calm': 'Reggae/Ruhig',
            'Youth Music': 'Jugendmusik',
            'Russian Pop': 'Russischer Pop',
            'Pop/Dance': 'Pop/Tanz',
            'Russian Rock': 'Russischer Rock',
            'Hi-Life': 'Hi-Life',
            'News/Culture': 'Nachrichten/Kultur',
            'News/Economy': 'Nachrichten/Wirtschaft',
            'Chanson': 'Chanson',
            'Pop/Chanson': 'Pop/Chanson',
            'Undefined': 'Undefiniert',
            'Music/Dialogue': 'Musik/Dialog',
            'Alternative/Culture': 'Alternative/Kultur',
            'Urban/Reggaeton': 'Urban/Reggaeton',
            'Afrikaans/Dialogue': 'Afrikaans/Dialog',
            'Music/Sports': 'Musik/Sport',
            'Youth/Urban': 'Jugend/Urban',
            'Contemporary': 'Zeitgenössisch',
            'Pop/Rock': 'Pop/Rock',
            'Various': 'Verschiedene',
            'Reggae/Music': 'Reggae/Musik',
            'Reggae/Dancehall': 'Reggae/Dancehall',
            'Luk Thung': 'Luk Thung',
            'Rock/Alternative': 'Rock/Alternative',
            'Bongo Flava': 'Bongo Flava',
            'News/Sports': 'Nachrichten/Sport',
            'University/Culture': 'Universität/Kultur',
            'General/Local': 'Allgemein/Lokal',
            'Local/Tobago': 'Lokal/Tobago',
            'Long/Quiet': 'Lang/Ruhig',
            'Health': 'Gesundheit',
            'Urban/Music': 'Urban/Musik',
            'Soca/Reggae': 'Soca/Reggae',
            'Music/Entertainment': 'Musik/Unterhaltung',
            'Talk/News': 'Talk/Nachrichten',
            'News/Entertainment': 'Nachrichten/Unterhaltung',
            'Natural Sounds': 'Naturgeräusche',
            'News / Music': 'Nachrichten / Musik',
            'News/Music': 'Nachrichten/Musik',
            'News / Culture': 'Nachrichten / Kultur',
            'News/General': 'Nachrichten/Allgemein',
            '24/7 News': '24/7 Nachrichten',
            'Music/News': 'Musik/Nachrichten',
            'Rock/Metal': 'Rock/Metal',
            'News/Talk': 'Nachrichten/Talk',
            'Disco/Pop': 'Disco/Pop',
            'Disco Polo': 'Disco Polo',
            'Quiet/Long': 'Ruhig/Lang',
            'Dance/Youth': 'Tanz/Jugend',
            'Dance/Electronic': 'Tanz/Elektronisch',
            'Patriotic': 'Patriotisch',
            'German Pop': 'Deutscher Pop',
            'German Rap': 'Deutscher Rap',
            'Ukrainian Rock': 'Ukrainischer Rock',
            'Progressive': 'Progressiv',
            'Underground': 'Untergrund',
            'Games': 'Spiele',
            'Indie': 'Indie',
            'Youth Music': 'Jugendmusik',
            'Estonian Music': 'Estnische Musik',
            'Drum and Bass': 'Drum and Bass',
            'Dangdut': 'Dangdut',
            'World Music': 'Weltmusik',
            'Metal': 'Metal',
            'Grupera': 'Grupera',
            'Top 40': 'Top 40',
            'Event': 'Ereignis',
            'Music': 'Musik',
            'News': 'Nachrichten',
            'General': 'Allgemein',
            'Sports': 'Sport',
            'Religious': 'Religiös',
            'University': 'Universität',
            'Corporate': 'Unternehmen',
            'Variety': 'Vielfalt',
            'Classical': 'Klassik',
            'Pop': 'Pop',
            'Rock': 'Rock',
            'Jazz': 'Jazz',
            'Talk': 'Talk',
            'Culture': 'Kultur',
            'Educational': 'Lehrreich',
            'Islamic': 'Islamisch',
            'Quran': 'Koran',
            'Variety': 'Vielfalt',
            'Blues': 'Blues',
            'Hip Hop': 'Hip Hop',
            'Salsa': 'Salsa',
            'Tango': 'Tango',
            'Disco': 'Disco',
            'Techno': 'Techno',
            'Reggae': 'Reggae',
            'Funk': 'Funk',
            'Soul': 'Soul',
            'Latin': 'Latein',
            'Arabic': 'Arabisch',
            'Islamic': 'Islamisch',
            'Classical': 'Klassik',
            'Flamenco': 'Flamenco',
            'Opera': 'Oper',
            'R&B': 'R&B',
            'Rap': 'Rap',
            'Dance': 'Tanz',
            'Local': 'Lokal',
            'Afrikaans': 'Afrikaans',
            'Tropical Music': 'Tropische Musik',
            'Dialogue': 'Dialog',
            'Relaxing Music': 'Entspannungsmusik',
            'R&B': 'R&B',
            'Persian': 'Persisch',
            'Maghrebi': 'Maghrebinisch',
            'Community': 'Gemeinschaft',
            'University': 'Universität',
            'Holy Quran': 'Heiliger Koran',
            'Indian': 'Indisch',
            'Modern': 'Modern',
            'University': 'Universität',
            'Children': 'Kinder',
            'Rural': 'Ländlich',
            'Comedy': 'Komödie',
            'Vocaloid': 'Vocaloid',
            'Italian Music': 'Italienische Musik',
            'Forró': 'Forró',
            'Latin': 'Latein',
            'News and Culture': 'Nachrichten und Kultur',
            'Anime': 'Anime',
            'Japanese Pop': 'Japanischer Pop',
            'Japanese Rock': 'Japanischer Rock',
            'Austrian Pop': 'Österreichischer Pop',
            'Movies': 'Filme',
            'Schlager': 'Schlager',
            'Lounge': 'Lounge',
            'Cultural': 'Kulturell',
            'Cultural': 'Kulturell',
            'News': 'Nachrichten',
            'Traditional Music': 'Traditionelle Musik',
            'University': 'Universität',
            'Oldies': 'Oldies',
            'Cars': 'Autos',
            'Youth': 'Jugend',
            'Turkish': 'Türkisch',
            'Classic Rock': 'Klassischer Rock',
            'Relaxation': 'Entspannung',
            'Youthful': 'Jugendlich',
            'Alternative': 'Alternative',
            'Christmas': 'Weihnachten',
            'Religious': 'Religiös',
            'Best Songs': 'Beste Lieder',
            'World Music': 'Weltmusik',
            'Classics': 'Klassiker',
            'Classics': 'Klassiker',
            'Classical': 'Klassik',
            'Classical': 'Klassik',
            'Spiritual': 'Spirituell',
            'Tarab': 'Tarab',
            'Francophone': 'Frankophon',
            'Christian': 'Christlich',
            'Andalusian': 'Andalusisch',
            'Comedy': 'Komödie',
            'Documentary': 'Dokumentation',
            'Drama': 'Drama',
            'Food': 'Essen',
            'Health': 'Gesundheit',
            'Urban': 'Urban',
            'Kids': 'Kinder',
            'Travel': 'Reisen',
            'Opera': 'Oper',
            'Fado': 'Fado',
            'Portuguese': 'Portugiesisch',
            'Brazilian': 'Brasilianisch',
            'Classic Rock': 'Klassischer Rock',
            'News': 'Nachrichten',
            'Sports': 'Sport',
            'Basketball': 'Basketball',
            'Football': 'Fußball',
            'Podcast': 'Podcast',
            'Hip Hop/Urban': 'Hip Hop/Urban',
            'Lok Thong/Folklore': 'Lok Thong/Folklore',
            'Traditional Music': 'Traditionelle Musik',
            'Romantic': 'Romantisch',
            'Relaxing': 'Entspannend',
            'Electronic': 'Elektronisch',
            'Folk': 'Folk',
            'Folklore': 'Folklore',
            'Youth': 'Jugend',
            'News / Culture': 'Nachrichten / Kultur',
            'News / Dialogue': 'Nachrichten / Dialog',
            'News / General': 'Nachrichten / Allgemein',
            'News / Music': 'Nachrichten / Musik',
            'News Report': 'Nachrichtenbericht',
            'Entertainment News': 'Unterhaltungsnachrichten',
            'International News': 'Internationale Nachrichten',
            'Sports News': 'Sportnachrichten',
            'World News': 'Weltnachrichten',
            'Academic': 'Akademisch',
            'Amazigh': 'Amazigh',
            'Nasheeds': 'Nasheeds',
            'Ukrainian': 'Ukrainisch',
            'Ballad': 'Ballade',
            'Environment': 'Umwelt',
            'Historical': 'Historisch',
            'Heritage': 'Erbe',
            'Radio Recordings': 'Radioaufnahmen',
            'Drama': 'Drama',
            "Women's Empowerment / Music": "Frauenförderung / Musik",
            'Awareness': 'Bewusstseinsbildung',
            'Bold': 'Kühn',
            'Awards': 'Auszeichnungen',
            'Religious (Islamic)': 'Religiös (Islamisch)',
            'Religious (Christian)': 'Religiös (Christlich)',
            'Religious': 'Religiös',
            'English Rock': 'Englischer Rock',
            'Surrealism': 'Surrealismus',
            'Smooth Jazz': 'Smooth Jazz',
            'Popular': 'Populär',
            'Popular / Folklore': 'Populär / Folklore',
            'Food / Cooking': 'Essen / Kochen',
            'General - Various': 'Allgemein - Verschiedenes',
            'Hebrew': 'Hebräisch',
            'Arabic': 'Arabisch',
            'Scientific': 'Wissenschaftlich',
            'Folklore': 'Folklore',
            'Videos': 'Videos',
            'Quranic': 'Koranisch',
            'Italian Classical': 'Italienische Klassik',
            'Arabic Classical': 'Arabische Klassik',
            'Comedy': 'Komödie',
            'Kenya': 'Kenia',
            'Local (Amazigh)': 'Lokal (Amazigh)',
            'Local (English)': 'Lokal (Englisch)',
            'Local (Arabic)': 'Lokal (Arabisch)',
            'Local (French)': 'Lokal (Französisch)',
            'Local (Kurdish)': 'Lokal (Kurdisch)',
            'Mixed': 'Gemischt',
            'Independent (Indie)': 'Unabhängig (Indie)',
            'Views': 'Ansichten',
            'Egyptian': 'Ägyptisch',
            'Interviews': 'Interviews',
            'Debates': 'Debatten',
            'Indie Music': 'Indie-Musik',
            'Blues Music': 'Blues-Musik',
            'New Age Music': 'New-Age-Musik',
            'Electronic Music': 'Elektronische Musik',
            'Night Music': 'Nachtmusik',
            'Berber Music': 'Berbermusik',
            'Andalusian Music': 'Andalusische Musik',
            'Ukrainian Music': 'Ukrainische Musik',
            'Spanish Music': 'Spanische Musik',
            'African Music': 'Afrikanische Musik',
            'Electronic Dance Music': 'Elektronische Tanzmusik',
            "Children's Music": "Kindermusik",
            'Andean Music': 'Andenmusik',
            'Caribbean Music': 'Karibische Musik',
            'Pop Music': 'Popmusik',
            'Arabic Pop Music': 'Arabische Popmusik',
            'Classical Pop Music': 'Klassische Popmusik',
            'Turkish Music': 'Türkische Musik',
            'Jazz Music': 'Jazzmusik',
            'New Generation Music': 'Musik der neuen Generation',
            'Chamber Music': 'Kammermusik',
            'Rock Music': 'Rockmusik',
            'Golden Age Music': 'Musik des Goldenen Zeitalters',
            'Salsa Music': 'Salsamusik',
            'Soul Music': 'Soulmusik',
            'Middle Eastern Music': 'Musik des Nahen Ostens',
            'New World Music': 'Musik der Neuen Welt',
            'Arabic Music': 'Arabische Musik',
            'Country Music': 'Countrymusik',
            'Latin Music': 'Lateinamerikanische Musik',
            'Chill Night Music': 'Chill-Nachtmusik',
            'Christian Music': 'Christliche Musik',
            'Elevator Music': 'Fahrstuhlmusik',
            'Royal Music': 'Königliche Musik',
            'Metal Music': 'Metalmusik',
            'Club Music': 'Clubmusik',
            'Indian Music': 'Indische Musik',
            'Japanese Music': 'Japanische Musik',
            'Pop Music': 'Popmusik',
            'Arabic Pop Music': 'Arabische Popmusik',
            'Turkish Music': 'Türkische Musik',
            'Traditional Music': 'Traditionelle Musik',
            'Entertainment Music': 'Unterhaltungsmusik',
            'South African Music': 'Südafrikanische Musik',
            'Sad Music': 'Traurige Musik',
            'Upbeat Music': 'Fröhliche Musik',
            'Gulf Music': 'Golfmusik',
            'Religious Music': 'Religiöse Musik',
            'Electronic Dance Music': 'Elektronische Tanzmusik',
            'Romantic Music': 'Romantische Musik',
            'Fast Music': 'Schnelle Musik',
            'Sudanese Music': 'Sudanesische Musik',
            'Folk Music': 'Volksmusik',
            'Silent Music': 'Stille Musik',
            'Arabic Music': 'Arabische Musik',
            'Classical Arabic Music': 'Klassische arabische Musik',
            'Contemporary Music': 'Zeitgenössische Musik',
            'Western Music': 'Westliche Musik',
            'French Music': 'Französische Musik',
            'Folk Music': 'Volksmusik',
            'Coptic Music': 'Koptische Musik',
            'Classical Music': 'Klassische Musik',
            'Cambodian Music': 'Kambodschanische Musik',
            'Canadian Music': 'Kanadische Musik',
            'Korean Music': 'Koreanische Musik',
            'Latin Music': 'Lateinamerikanische Musik',
            'Lebanese Music': 'Libanesische Musik',
            'Liturgical Music': 'Liturgische Musik',
            'Multicultural Music': 'Multikulturelle Musik',
            'Egyptian Music': 'Ägyptische Musik',
            'Moroccan Music': 'Marokkanische Musik',
            'Calm / Classical Music': 'Ruhige / Klassische Musik',
            'Relaxing / Lounge Music': 'Entspannende / Lounge-Musik',
            'Dutch Music': 'Niederländische Musik',
            'Japanese Music': 'Japanische Musik',
            'Club': 'Club',
            'Daytime': 'Tagsüber',
            'Hindu': 'Hindu',
            'And Radio': 'Und Radio',
            'Working Time': 'Arbeitszeit',
            'Japanese': 'Japanisch',
            'Islamic': 'Islamisch',
            'Spanish': 'Spanisch',
            'English Pop': 'Englischer Pop',
            'Swedish Pop': 'Schwedischer Pop',
            'Arabic Pop': 'Arabischer Pop',
            'French Pop': 'Französischer Pop',
            'Politics': 'Politik',
            'Worldwide': 'Weltweit',
            'From': 'Von',
            'Bulgarian Pop': 'Bulgarischer Pop',
            'From Radio Browser': 'Von Radio Browser',
            'Jazz/Lounge': 'Jazz/Lounge',
            'German New Wave': 'Deutsche Neue Welle',
            'Technology': 'Technologie',
            'News/Entertainment': 'Nachrichten/Unterhaltung',
            'Music/Entertainment': 'Musik/Unterhaltung',
            'Italian Disco': 'Italienischer Disco',
            'Acoustic Blues': 'Akustischer Blues',
            'Islamic': 'Islamisch',
            'Islamic': 'Islamisch',
            'Indian Music': 'Indische Musik',
            'Asian': 'Asiatisch',
            'Quran/Religious': 'Koran/Religiös',
            'Bebop Jazz': 'Bebop-Jazz',
            'Mexican Music': 'Mexikanische Musik',
            'Wellness': 'Wohlbefinden'
        }[en] || en;

        // ترجمة برتغالية (تقريبية)
        mapPt[ar] = {
            'House': 'House',
            'Hospital': 'Hospital',
            'Trans': 'Trans',
            'Country': 'Country',
            'African': 'Africano',
            'Italian': 'Italiano',
            'German': 'Alemão',
            'Dutch': 'Holandês',
            'News in Russian': 'Notícias em russo',
            'Sports / Basketball': 'Esportes / Basquetebol',
            'Russian': 'Russo',
            'News / Religious': 'Notícias / Religioso',
            'Music / Sports': 'Música / Esportes',
            'Various music': 'Música variada',
            'Tropical music': 'Música tropical',
            'Italian classics': 'Clássicos italianos',
            'Ethiopian music': 'Música etíope',
            'Youth / Music': 'Juventude / Música',
            'dance music': 'música dance',
            'Balkan': 'Balcânico',
            'Afrobeat': 'Afrobeat',
            'Music / Local': 'Música / Local',
            'Carnival': 'Carnaval',
            'Dialogue/Music': 'Diálogo/Música',
            'News / Entertainment': 'Notícias / Entretenimento',
            'Music / Youth': 'Música / Juventude',
            'Peripheral': 'Periférico',
            'Rock / Music': 'Rock / Música',
            'Russian / General': 'Russo / Geral',
            'Music / Youth': 'Música / Juventude',
            'Jazz Lounge': 'Jazz Lounge',
            'Music / Miscellaneous': 'Música / Diversos',
            'food': 'comida',
            'Music / News': 'Música / Notícias',
            'Music / Youth': 'Música / Juventude',
            'acid gas': 'gás ácido',
            'Home / Electronic': 'Casa / Eletrônico',
            'Entertainment': 'Entretenimento',
            'Romantic': 'Romântico',
            'Blues and Souls': 'Blues e Soul',
            'Traffic': 'Trânsito',
            'Electronic Music': 'Música eletrônica',
            'German rock': 'Rock alemão',
            'Quiet Rock': 'Rock tranquilo',
            'Pop/Youth': 'Pop/Juventude',
            'Progressive Rock': 'Rock progressivo',
            'Traditional': 'Tradicional',
            'Classical Jazz': 'Jazz clássico',
            'Rock/Alternative': 'Rock/Alternativo',
            'pop rock': 'pop rock',
            'Rock and Roll': 'Rock and Roll',
            'Rock Disco': 'Rock Disco',
            'Alternative rock': 'Rock alternativo',
            'Spanish rock': 'Rock espanhol',
            'Disco Funk': 'Disco Funk',
            'Amateur radio': 'Rádio amador',
            'German rock': 'Rock alemão',
            'Indian Bob': 'Bob indiano',
            'Folklore': 'Folclore',
            'punkrock': 'punkrock',
            'Blues Rock': 'Blues Rock',
            'Jazz Smooth': 'Jazz Smooth',
            'Jazz Bebop': 'Jazz Bebop',
            'Acid jazz': 'Acid jazz',
            'jazz trance': 'jazz trance',
            'K-Pop': 'K-Pop',
            'Jazz Fusion': 'Jazz Fusion',
            'acoustic jazz': 'jazz acústico',
            'Trap': 'Trap',
            'Pop Folklore': 'Pop Folclore',
            'English': 'Inglês',
            'Chinese': 'Chinês',
            'Soul/Jazz': 'Soul/Jazz',
            'Urban Music': 'Música urbana',
            'Soul/Funk': 'Soul/Funk',
            'Hardstyle': 'Hardstyle',
            'Country religious': 'Country religioso',
            'Swing': 'Swing',
            'worldwide': 'mundial',
            'Islamic': 'Islâmico',
            'My community': 'Minha comunidade',
            'Rap': 'Rap',
            'Rock/Pop': 'Rock/Pop',
            'Rock/Indie': 'Rock/Indie',
            'Salsa/Cumbia': 'Salsa/Cumbia',
            'Cumbia': 'Cumbia',
            'Cumbia/Salsa': 'Cumbia/Salsa',
            'Bolero/Ballad': 'Bolero/Balada',
            'Dance/Pop': 'Dança/Pop',
            'Pop-Folk': 'Pop-Folk',
            'Bulgarian Music': 'Música búlgara',
            'Bulgarian Classics': 'Clássicos búlgaros',
            'Youth/Culture': 'Juventude/Cultura',
            'Music/Culture': 'Música/Cultura',
            'Classical/Culture': 'Clássica/Cultura',
            'Classical/Soundtrack': 'Clássica/Trilha sonora',
            'Pop/Music': 'Pop/Música',
            'Flamenco': 'Flamenco',
            'IsiZulu': 'IsiZulu',
            'Ska/Rocksteady': 'Ska/Rocksteady',
            'Reggae/Calm': 'Reggae/Calmo',
            'Youth Music': 'Música jovem',
            'Russian Pop': 'Pop russo',
            'Pop/Dance': 'Pop/Dança',
            'Russian Rock': 'Rock russo',
            'Hi-Life': 'Hi-Life',
            'News/Culture': 'Notícias/Cultura',
            'News/Economy': 'Notícias/Economia',
            'Chanson': 'Chanson',
            'Pop/Chanson': 'Pop/Chanson',
            'Undefined': 'Indefinido',
            'Music/Dialogue': 'Música/Diálogo',
            'Alternative/Culture': 'Alternativo/Cultura',
            'Urban/Reggaeton': 'Urbano/Reggaeton',
            'Afrikaans/Dialogue': 'Afrikaans/Diálogo',
            'Music/Sports': 'Música/Esportes',
            'Youth/Urban': 'Juventude/Urbano',
            'Contemporary': 'Contemporâneo',
            'Pop/Rock': 'Pop/Rock',
            'Various': 'Vários',
            'Reggae/Music': 'Reggae/Música',
            'Reggae/Dancehall': 'Reggae/Dancehall',
            'Luk Thung': 'Luk Thung',
            'Rock/Alternative': 'Rock/Alternativo',
            'Bongo Flava': 'Bongo Flava',
            'News/Sports': 'Notícias/Esportes',
            'University/Culture': 'Universidade/Cultura',
            'General/Local': 'Geral/Local',
            'Local/Tobago': 'Local/Tobago',
            'Long/Quiet': 'Longo/Calmo',
            'Health': 'Saúde',
            'Urban/Music': 'Urbano/Música',
            'Soca/Reggae': 'Soca/Reggae',
            'Music/Entertainment': 'Música/Entretenimento',
            'Talk/News': 'Talk/Notícias',
            'News/Entertainment': 'Notícias/Entretenimento',
            'Natural Sounds': 'Sons naturais',
            'News / Music': 'Notícias / Música',
            'News/Music': 'Notícias/Música',
            'News / Culture': 'Notícias / Cultura',
            'News/General': 'Notícias/Geral',
            '24/7 News': 'Notícias 24/7',
            'Music/News': 'Música/Notícias',
            'Rock/Metal': 'Rock/Metal',
            'News/Talk': 'Notícias/Talk',
            'Disco/Pop': 'Disco/Pop',
            'Disco Polo': 'Disco Polo',
            'Quiet/Long': 'Calmo/Longo',
            'Dance/Youth': 'Dança/Juventude',
            'Dance/Electronic': 'Dança/Eletrônica',
            'Patriotic': 'Patriótico',
            'German Pop': 'Pop alemão',
            'German Rap': 'Rap alemão',
            'Ukrainian Rock': 'Rock ucraniano',
            'Progressive': 'Progressivo',
            'Underground': 'Subterrâneo',
            'Games': 'Jogos',
            'Indie': 'Indie',
            'Youth Music': 'Música jovem',
            'Estonian Music': 'Música estoniana',
            'Drum and Bass': 'Drum and Bass',
            'Dangdut': 'Dangdut',
            'World Music': 'Música do mundo',
            'Metal': 'Metal',
            'Grupera': 'Grupera',
            'Top 40': 'Top 40',
            'Event': 'Evento',
            'Music': 'Música',
            'News': 'Notícias',
            'General': 'Geral',
            'Sports': 'Esportes',
            'Religious': 'Religioso',
            'University': 'Universidade',
            'Corporate': 'Corporativo',
            'Variety': 'Variedade',
            'Classical': 'Clássica',
            'Pop': 'Pop',
            'Rock': 'Rock',
            'Jazz': 'Jazz',
            'Talk': 'Talk',
            'Culture': 'Cultura',
            'Educational': 'Educativo',
            'Islamic': 'Islâmico',
            'Quran': 'Corão',
            'Variety': 'Variedade',
            'Blues': 'Blues',
            'Hip Hop': 'Hip Hop',
            'Salsa': 'Salsa',
            'Tango': 'Tango',
            'Disco': 'Disco',
            'Techno': 'Tecno',
            'Reggae': 'Reggae',
            'Funk': 'Funk',
            'Soul': 'Soul',
            'Latin': 'Latino',
            'Arabic': 'Árabe',
            'Islamic': 'Islâmico',
            'Classical': 'Clássica',
            'Flamenco': 'Flamenco',
            'Opera': 'Ópera',
            'R&B': 'R&B',
            'Rap': 'Rap',
            'Dance': 'Dança',
            'Local': 'Local',
            'Afrikaans': 'Afrikaans',
            'Tropical Music': 'Música tropical',
            'Dialogue': 'Diálogo',
            'Relaxing Music': 'Música relaxante',
            'R&B': 'R&B',
            'Persian': 'Persa',
            'Maghrebi': 'Magrebino',
            'Community': 'Comunidade',
            'University': 'Universidade',
            'Holy Quran': 'Santo Corão',
            'Indian': 'Indiano',
            'Modern': 'Moderno',
            'University': 'Universidade',
            'Children': 'Crianças',
            'Rural': 'Rural',
            'Comedy': 'Comédia',
            'Vocaloid': 'Vocaloid',
            'Italian Music': 'Música italiana',
            'Forró': 'Forró',
            'Latin': 'Latino',
            'News and Culture': 'Notícias e cultura',
            'Anime': 'Anime',
            'Japanese Pop': 'Pop japonês',
            'Japanese Rock': 'Rock japonês',
            'Austrian Pop': 'Pop austríaco',
            'Movies': 'Filmes',
            'Schlager': 'Schlager',
            'Lounge': 'Lounge',
            'Cultural': 'Cultural',
            'Cultural': 'Cultural',
            'News': 'Notícias',
            'Traditional Music': 'Música tradicional',
            'University': 'Universidade',
            'Oldies': 'Oldies',
            'Cars': 'Carros',
            'Youth': 'Juventude',
            'Turkish': 'Turco',
            'Classic Rock': 'Rock clássico',
            'Relaxation': 'Relaxamento',
            'Youthful': 'Juvenil',
            'Alternative': 'Alternativo',
            'Christmas': 'Natal',
            'Religious': 'Religioso',
            'Best Songs': 'Melhores músicas',
            'World Music': 'Música do mundo',
            'Classics': 'Clássicos',
            'Classics': 'Clássicos',
            'Classical': 'Clássica',
            'Classical': 'Clássica',
            'Spiritual': 'Espiritual',
            'Tarab': 'Tarab',
            'Francophone': 'Francófono',
            'Christian': 'Cristão',
            'Andalusian': 'Andaluz',
            'Comedy': 'Comédia',
            'Documentary': 'Documentário',
            'Drama': 'Drama',
            'Food': 'Comida',
            'Health': 'Saúde',
            'Urban': 'Urbano',
            'Kids': 'Crianças',
            'Travel': 'Viagem',
            'Opera': 'Ópera',
            'Fado': 'Fado',
            'Portuguese': 'Português',
            'Brazilian': 'Brasileiro',
            'Classic Rock': 'Rock clássico',
            'News': 'Notícias',
            'Sports': 'Esportes',
            'Basketball': 'Basquetebol',
            'Football': 'Futebol',
            'Podcast': 'Podcast',
            'Hip Hop/Urban': 'Hip Hop/Urbano',
            'Lok Thong/Folklore': 'Lok Thong/Folklore',
            'Traditional Music': 'Música tradicional',
            'Romantic': 'Romântico',
            'Relaxing': 'Relaxante',
            'Electronic': 'Eletrônico',
            'Folk': 'Folk',
            'Folklore': 'Folclore',
            'Youth': 'Juventude',
            'News / Culture': 'Notícias / Cultura',
            'News / Dialogue': 'Notícias / Diálogo',
            'News / General': 'Notícias / Geral',
            'News / Music': 'Notícias / Música',
            'News Report': 'Reportagem',
            'Entertainment News': 'Notícias de entretenimento',
            'International News': 'Notícias internacionais',
            'Sports News': 'Notícias esportivas',
            'World News': 'Notícias mundiais',
            'Academic': 'Acadêmico',
            'Amazigh': 'Amazigh',
            'Nasheeds': 'Nasheeds',
            'Ukrainian': 'Ucraniano',
            'Ballad': 'Balada',
            'Environment': 'Meio ambiente',
            'Historical': 'Histórico',
            'Heritage': 'Patrimônio',
            'Radio Recordings': 'Gravações de rádio',
            'Drama': 'Drama',
            "Women's Empowerment / Music": "Empoderamento feminino / Música",
            'Awareness': 'Conscientização',
            'Bold': 'Audacioso',
            'Awards': 'Prêmios',
            'Religious (Islamic)': 'Religioso (Islâmico)',
            'Religious (Christian)': 'Religioso (Cristão)',
            'Religious': 'Religioso',
            'English Rock': 'Rock inglês',
            'Surrealism': 'Surrealismo',
            'Smooth Jazz': 'Smooth Jazz',
            'Popular': 'Popular',
            'Popular / Folklore': 'Popular / Folclore',
            'Food / Cooking': 'Comida / Culinária',
            'General - Various': 'Geral - Diversos',
            'Hebrew': 'Hebraico',
            'Arabic': 'Árabe',
            'Scientific': 'Científico',
            'Folklore': 'Folclore',
            'Videos': 'Vídeos',
            'Quranic': 'Corânico',
            'Italian Classical': 'Clássica italiana',
            'Arabic Classical': 'Clássica árabe',
            'Comedy': 'Comédia',
            'Kenya': 'Quênia',
            'Local (Amazigh)': 'Local (Amazigh)',
            'Local (English)': 'Local (Inglês)',
            'Local (Arabic)': 'Local (Árabe)',
            'Local (French)': 'Local (Francês)',
            'Local (Kurdish)': 'Local (Curdo)',
            'Mixed': 'Misto',
            'Independent (Indie)': 'Independente (Indie)',
            'Views': 'Visualizações',
            'Egyptian': 'Egípcio',
            'Interviews': 'Entrevistas',
            'Debates': 'Debates',
            'Indie Music': 'Música indie',
            'Blues Music': 'Música blues',
            'New Age Music': 'Música New Age',
            'Electronic Music': 'Música eletrônica',
            'Night Music': 'Música noturna',
            'Berber Music': 'Música berbere',
            'Andalusian Music': 'Música andaluza',
            'Ukrainian Music': 'Música ucraniana',
            'Spanish Music': 'Música espanhola',
            'African Music': 'Música africana',
            'Electronic Dance Music': 'Música eletrônica dance',
            "Children's Music": "Música infantil",
            'Andean Music': 'Música andina',
            'Caribbean Music': 'Música caribenha',
            'Pop Music': 'Música pop',
            'Arabic Pop Music': 'Música pop árabe',
            'Classical Pop Music': 'Música pop clássica',
            'Turkish Music': 'Música turca',
            'Jazz Music': 'Música jazz',
            'New Generation Music': 'Música nova geração',
            'Chamber Music': 'Música de câmara',
            'Rock Music': 'Música rock',
            'Golden Age Music': 'Música da era de ouro',
            'Salsa Music': 'Música salsa',
            'Soul Music': 'Música soul',
            'Middle Eastern Music': 'Música do Oriente Médio',
            'New World Music': 'Música do Novo Mundo',
            'Arabic Music': 'Música árabe',
            'Country Music': 'Música country',
            'Latin Music': 'Música latina',
            'Chill Night Music': 'Música chill noturna',
            'Christian Music': 'Música cristã',
            'Elevator Music': 'Música de elevador',
            'Royal Music': 'Música real',
            'Metal Music': 'Música metal',
            'Club Music': 'Música de clube',
            'Indian Music': 'Música indiana',
            'Japanese Music': 'Música japonesa',
            'Pop Music': 'Música pop',
            'Arabic Pop Music': 'Música pop árabe',
            'Turkish Music': 'Música turca',
            'Traditional Music': 'Música tradicional',
            'Entertainment Music': 'Música de entretenimento',
            'South African Music': 'Música sul-africana',
            'Sad Music': 'Música triste',
            'Upbeat Music': 'Música animada',
            'Gulf Music': 'Música do Golfo',
            'Religious Music': 'Música religiosa',
            'Electronic Dance Music': 'Música eletrônica dance',
            'Romantic Music': 'Música romântica',
            'Fast Music': 'Música rápida',
            'Sudanese Music': 'Música sudanesa',
            'Folk Music': 'Música folk',
            'Silent Music': 'Música silenciosa',
            'Arabic Music': 'Música árabe',
            'Classical Arabic Music': 'Música árabe clássica',
            'Contemporary Music': 'Música contemporânea',
            'Western Music': 'Música ocidental',
            'French Music': 'Música francesa',
            'Folk Music': 'Música folk',
            'Coptic Music': 'Música copta',
            'Classical Music': 'Música clássica',
            'Cambodian Music': 'Música cambojana',
            'Canadian Music': 'Música canadense',
            'Korean Music': 'Música coreana',
            'Latin Music': 'Música latina',
            'Lebanese Music': 'Música libanesa',
            'Liturgical Music': 'Música litúrgica',
            'Multicultural Music': 'Música multicultural',
            'Egyptian Music': 'Música egípcia',
            'Moroccan Music': 'Música marroquina',
            'Calm / Classical Music': 'Música calma / clássica',
            'Relaxing / Lounge Music': 'Música relaxante / Lounge',
            'Dutch Music': 'Música holandesa',
            'Japanese Music': 'Música japonesa',
            'Club': 'Clube',
            'Daytime': 'Diurno',
            'Hindu': 'Hindu',
            'And Radio': 'E Rádio',
            'Working Time': 'Tempo de trabalho',
            'Japanese': 'Japonês',
            'Islamic': 'Islâmico',
            'Spanish': 'Espanhol',
            'English Pop': 'Pop inglês',
            'Swedish Pop': 'Pop sueco',
            'Arabic Pop': 'Pop árabe',
            'French Pop': 'Pop francês',
            'Politics': 'Política',
            'Worldwide': 'Mundial',
            'From': 'De',
            'Bulgarian Pop': 'Pop búlgaro',
            'From Radio Browser': 'Do Radio Browser',
            'Jazz/Lounge': 'Jazz/Lounge',
            'German New Wave': 'Nova onda alemã',
            'Technology': 'Tecnologia',
            'News/Entertainment': 'Notícias/Entretenimento',
            'Music/Entertainment': 'Música/Entretenimento',
            'Italian Disco': 'Disco italiano',
            'Acoustic Blues': 'Blues acústico',
            'Islamic': 'Islâmico',
            'Islamic': 'Islâmico',
            'Indian Music': 'Música indiana',
            'Asian': 'Asiático',
            'Quran/Religious': 'Corão/Religioso',
            'Bebop Jazz': 'Jazz Bebop',
            'Mexican Music': 'Música mexicana',
            'Wellness': 'Bem-estar'
        }[en] || en;
    }

    // اختيار الخريطة المناسبة حسب اللغة
    let map;
    switch (lang) {
        case 'fr': map = mapFr; break;
        case 'es': map = mapEs; break;
        case 'de': map = mapDe; break;
        case 'pt': map = mapPt; break;
        default: map = mapEn; // الإنجليزية
    }

    // البحث عن الترجمة
    let translated = map[genre];
    if (!translated) {
        // إذا لم نجد في خريطة اللغة، نستخدم الإنجليزية
        translated = mapEn[genre];
    }
    if (!translated) {
        // محاولة إزالة "الـ" من البداية
        let withoutAl = genre.replace(/^(ال)/, '');
        translated = map[withoutAl] || mapEn[withoutAl] || genre;
    }
    return translated;
}

// تصدير الدوال للنطاق العام
window.renderStations = renderStations;
window.renderCountriesList = renderCountriesList;
window.switchTab = switchTab;
window.updateHeaderForFilter = updateHeaderForFilter;
window.escapeHtml = escapeHtml;
window.translateGenre = translateGenre;
window.createStationCardHTML = createStationCardHTML;
window.getAllCountryNameVariants = getAllCountryNameVariants;  // ← أضف هذه إذا كانت جديدة
window.getCountryDisplayName = getCountryDisplayName;          // ← أضفها إذا كانت معرفة في ملف آخر
window.flagImgHtml = flagImgHtml;                              // ← إذا كنت تحتاجها خارجياً
window.resolveFlagError = resolveFlagError;                    // ← كذلك