// ========== عرض الواجهة ==========
let assetsBasePath = 'assets';

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
        countryName = countryObj ? (currentLanguage === 'en' ? countryObj.name : countryObj.nameAr) : station.countryCode;
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
        const nameA = lang === 'ar' ? a.nameAr : a.name;
        const nameB = lang === 'ar' ? b.nameAr : b.name;
        return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en');
    });
    genres.sort((a, b) => {
        const nameA = lang === 'ar' ? a.nameAr : a.name;
        const nameB = lang === 'ar' ? b.nameAr : b.name;
        return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en');
    });

    let filteredCountries = countries;
    let filteredGenres = genres;
    if (countriesFilterText) {
        filteredCountries = countries.filter(item => {
            const nameEn = item.name.toLowerCase();
            const nameAr = item.nameAr.toLowerCase();
            return nameEn.indexOf(countriesFilterText) !== -1 || nameAr.indexOf(countriesFilterText) !== -1;
        });
        filteredGenres = genres.filter(item => {
            const nameEn = item.name.toLowerCase();
            const nameAr = item.nameAr.toLowerCase();
            return nameEn.indexOf(countriesFilterText) !== -1 || nameAr.indexOf(countriesFilterText) !== -1;
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

    let displayName = currentLanguage === 'en' ? item.name : item.nameAr;
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

    let displayName = currentLanguage === 'en' ? filterItem.name : filterItem.nameAr;
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
    const genreMap = {
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
        'أخبار / ترفيه': 'News / Entertainment',
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
        'بوب هندي': 'Indian Bob',
        'فولكلور': 'Folklore',
        'بانك روك': 'punkrock',
        'بلوز روك': 'Blues Rock',
        'جاز سموث': 'Jazz Smooth',
        'جاز بيبوب': 'Jazz Bebop',
        'جاز حمضي': 'Acid jazz',
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
    if (currentLanguage === 'en') {
        let translated = genreMap[genre];
        if (!translated) {
            let withoutAl = genre.replace(/^(ال)/, '');
            translated = genreMap[withoutAl];
        }
        return translated || genre;
    }
    return genre;
}

// تصدير الدوال للنطاق العام
window.renderStations = renderStations;
window.renderCountriesList = renderCountriesList;
window.switchTab = switchTab;
window.updateHeaderForFilter = updateHeaderForFilter;
window.escapeHtml = escapeHtml;
window.translateGenre = translateGenre;
window.createStationCardHTML = createStationCardHTML;