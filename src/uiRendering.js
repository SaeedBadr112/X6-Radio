// ========== عرض الواجهة ==========
let assetsBasePath = './assets';
let pulseApplied = false;   // لمنع إعادة النبض
let countriesFilterText = '';   // ← أضف هذا السطر

// تهيئة المسار الأساسي للأصول (يتم استدعاؤها عند تحميل الصفحة)
(async function initAssetsPath() {
  if (window.electronAPI && window.electronAPI.getAssetsDir) {
    assetsBasePath = await window.electronAPI.getAssetsDir();
    console.log('✅ Assets path set to:', assetsBasePath);
  }
  // إعادة عرض قائمة الدول بعد تعيين المسار الصحيح
  if (typeof renderCountriesList === 'function') {
    renderCountriesList();
  }
 setTimeout(() => applyTemporaryPulse(), 1000);
// ربط حدث البحث في قائمة الدول
const countriesSearchInput = document.getElementById('countriesSearchInput');
if (countriesSearchInput) {
    countriesSearchInput.addEventListener('input', filterCountriesList);
}
})();

function applyTemporaryPulse() {
    if (pulseApplied) return;
    const playButtons = document.querySelectorAll('.play-station-btn');
    playButtons.forEach(btn => btn.classList.add('pulse-temp'));
    setTimeout(() => {
        playButtons.forEach(btn => btn.classList.remove('pulse-temp'));
    }, 10000);
    pulseApplied = true;
}
function renderStations(keepScroll = false) {
    const container = document.getElementById("stationsContainer");
    if (!container) {
        console.error('❌ renderStations: #stationsContainer not found');
        return;
    }

    // ===== حفظ موضع التمرير إذا كان keepScroll = true =====
    const stationsTab = document.getElementById('stations-tab');
    const savedScrollTop = (keepScroll && stationsTab) ? stationsTab.scrollTop : 0;

    // ============================================================
    // 1. حالة عدم اختيار دولة أو تصنيف → عرض رسالة الترحيب
    // ============================================================
    if (!currentFilterItem) {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '300px';
        container.style.padding = '20px';
        container.style.margin = '0';
        container.style.boxSizing = 'border-box';
        container.style.overflow = 'hidden';
        container.style.gap = '0';
        container.style.gridTemplateColumns = 'none';
        container.style.display = 'flex';

        const isLight = document.body.classList.contains('light-theme');
        const isRed = document.body.classList.contains('red-theme');
        const isDark = document.body.classList.contains('dark-high-contrast');

        let titleColor, subColor;
        if (isLight) {
            titleColor = '#1e293b';
            subColor = '#475569';
        } else if (isRed) {
            titleColor = '#2d1a0e';
            subColor = '#5a3a2a';
        } else if (isDark) {
            titleColor = '#f1f5f9';
            subColor = '#94a3b8';
        } else {
            titleColor = '#e0f2fe';
            subColor = '#9ec8f0';
        }

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 100%; text-align: center; padding: 10px; box-sizing: border-box; margin-top: -30px; transform: translateX(0px);">
                <div style="font-size: 2.8rem; font-weight: bold; color: ${titleColor}; margin-bottom: 12px; line-height: 1.2; width: 100%; max-width: 100%; word-break: break-word; padding: 0 10px; box-sizing: border-box;">
                    ${t('welcome_title')}
                </div>
                <div style="font-size: 1.4rem; color: ${subColor}; opacity: 0.9; line-height: 1.4; width: 100%; max-width: 700px; word-break: break-word; padding: 0 10px; box-sizing: border-box;">
                    ${t('welcome_subtitle')}
                </div>
            </div>
        `;

        // استعادة التمرير أو العودة للأعلى
        if (stationsTab && keepScroll) {
            requestAnimationFrame(() => {
                stationsTab.scrollTop = savedScrollTop;
            });
        } else if (stationsTab && !keepScroll) {
            stationsTab.scrollTop = 0;
        }
        return;
    }

    // ============================================================
    // 2. حالة اختيار دولة أو تصنيف → عرض المحطات
    // ============================================================
    
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    container.style.gap = '12px';
    container.style.padding = '0';
    container.style.margin = '0';
    container.style.minHeight = 'auto';
    container.style.alignItems = 'start';
    container.style.justifyContent = 'start';
    container.style.overflow = 'visible';

    const stations = getStationsByFilter(currentFilterItem);
    const title = currentLanguage === 'en' ? currentFilterItem.name : currentFilterItem.nameAr;

    if (!stations || stations.length === 0) {
        let emptyMsg = currentFilterItem.isGenre 
            ? t('no_stations_genre') 
            : t('no_stations_country');
        container.innerHTML = `<div class="empty-message">${emptyMsg}</div>`;

        if (stationsTab && keepScroll) {
            requestAnimationFrame(() => {
                stationsTab.scrollTop = savedScrollTop;
            });
        } else if (stationsTab && !keepScroll) {
            stationsTab.scrollTop = 0;
        }
        return;
    }

    container.innerHTML = stations.map(station => `
        <div class="station-card" data-id="${station.id}">
            <div class="station-info">
                <div class="station-name"><i class="fas fa-microphone-alt"></i> ${escapeHtml(station.name)}</div>
                <div class="station-country">${title} • ${translateGenre(station.genre)}</div>
            </div>
            <button class="play-station-btn play-this" 
                    data-id="${station.id}" 
                    data-url="${station.streamUrl}" 
                    data-name="${escapeHtml(station.name)}" 
                    data-country="${title}" 
                    data-iswebpage="${station.isWebPage || false}" 
                    title="${t('play')}">
                <i class="fas fa-play"></i> ${t('play')}
            </button>
            <button class="fav-star ${isFavorite(station.id) ? 'active-fav' : ''}" 
                    data-id="${station.id}" 
                    title="${t('save_to_favorites')}">
                ${isFavorite(station.id) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'}
            </button>
            <button class="repair-station-btn" 
                    data-id="${station.id}" 
                    title="${currentLanguage === 'ar' ? 'إصلاح الرابط' : 'Repair URL'}">
                <i class="fas fa-wrench"></i>
            </button>
            <button class="delete-station-btn" 
                    data-id="${station.id}" 
                    title="${t('delete_station')}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');

    attachStationEvents();
    attachDeleteEvents();
    attachRepairEvents();

    updateStationPlayButtons(
        currentStation ? currentStation.id : null, 
        currentStation && !audioPlayer.paused
    );

    // ===== استعادة موضع التمرير أو العودة للأعلى =====
    if (stationsTab && keepScroll) {
        requestAnimationFrame(() => {
            stationsTab.scrollTop = savedScrollTop;
        });
    } else if (stationsTab && !keepScroll) {
        stationsTab.scrollTop = 0;
    }
}

function attachStationEvents() {
    document.querySelectorAll('.play-this').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); playStation(btn.dataset.url, btn.dataset.name, btn.dataset.country, btn.dataset.id, btn.dataset.iswebpage === 'true'); }));
    document.querySelectorAll('.fav-star').forEach(star => star.addEventListener('click', (e) => { e.stopPropagation(); toggleFavorite(star.dataset.id); renderStations(true); if(currentTab === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab(); }));
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
        renderCountriesList();   // إعادة رسم القائمة بعد التصفية
    }
}

function renderCountriesList() {
    if (!currentFilterItem) {
        currentFilterItem = null;
    }
    const container = document.getElementById("countriesList");
    if (!container) return;

    const countries = allCountries.filter(function(c) { return !c.isGenre; });
    const genres = allCountries.filter(function(c) { return c.isGenre; });

    const lang = currentLanguage || 'en';
    countries.sort(function(a, b) {
        var nameA = lang === 'ar' ? a.nameAr : a.name;
        var nameB = lang === 'ar' ? b.nameAr : b.name;
        return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en');
    });
    genres.sort(function(a, b) {
        var nameA = lang === 'ar' ? a.nameAr : a.name;
        var nameB = lang === 'ar' ? b.nameAr : b.name;
        return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en');
    });

    var filteredCountries = countries;
    var filteredGenres = genres;
    if (countriesFilterText) {
        filteredCountries = countries.filter(function(item) {
            var nameEn = item.name.toLowerCase();
            var nameAr = item.nameAr.toLowerCase();
            return nameEn.indexOf(countriesFilterText) !== -1 || nameAr.indexOf(countriesFilterText) !== -1;
        });
        filteredGenres = genres.filter(function(item) {
            var nameEn = item.name.toLowerCase();
            var nameAr = item.nameAr.toLowerCase();
            return nameEn.indexOf(countriesFilterText) !== -1 || nameAr.indexOf(countriesFilterText) !== -1;
        });
    }

    var html = '';
    filteredCountries.forEach(function(item) {
        html += buildCountryItem(item);
    });

    if (filteredGenres.length > 0) {
        var genresTitle = lang === 'ar' ? '📂 التصنيفات' : '📂 Categories';
        html += '<div class="countries-divider">' + genresTitle + '</div>';
        filteredGenres.forEach(function(item) {
            html += buildCountryItem(item);
        });
    }

    container.innerHTML = html;

    document.querySelectorAll('.country-item').forEach(function(el) {
        el.addEventListener('click', function() {
            var code = this.dataset.code;
            var selected = allCountries.find(function(c) { return c.code === code; });
            if (selected) {
                currentFilterItem = selected;
                localStorage.setItem('x6RadioLastCountry', code);
                countriesFilterText = '';
                var searchInput = document.getElementById('countriesSearchInput');
                if (searchInput) searchInput.value = '';
                renderCountriesList();
                updateHeaderForFilter(selected);
                renderStations();
                if (currentTab !== 'stations-tab') switchTab('stations-tab');
                var mainSearchInput = document.getElementById("searchInput");
                if (mainSearchInput) mainSearchInput.value = '';
            }
        });
    });

    var countryCountSpan = document.querySelector(".country-count");
    if (countryCountSpan) countryCountSpan.innerText = '(' + (filteredCountries.length + filteredGenres.length) + ')';
}

// دالة مساعدة لبناء عنصر الدولة/التصنيف (لتجنب تكرار الكود)
function buildCountryItem(item) {
    let iconHtml = '';
    if (item.isGenre) {
        const iconPath = assetsBasePath + '/Category_icons/' + item.code + '.png';
        iconHtml = '<img src="' + iconPath + '" alt="' + item.code + '" class="country-flag-icon genre-icon" onerror="this.style.display=\'none\'">';
    } else {
        const flagPath = assetsBasePath + '/Icons_of_all_countries/' + item.code + '.png';
        iconHtml = '<img src="' + flagPath + '" alt="' + item.code + '" class="country-flag-icon" onerror="this.style.display=\'none\'">';
    }

    let displayName = currentLanguage === 'en' ? item.name : item.nameAr;
    if (currentLanguage === 'en' && displayName) {
        displayName = displayName.replace(/^[A-Z]{2}\s/, '').trim();
    }

    const isActive = (currentFilterItem && currentFilterItem.code === item.code) ? 'active-country' : '';

    return '<div class="country-item ' + isActive + '" data-code="' + item.code + '" data-isgenre="' + (item.isGenre || false) + '" data-genrekey="' + (item.genreKey || '') + '" role="button" tabindex="0">' +
        iconHtml +
        '<span>' + displayName + '</span>' +
        '</div>';
}
function updateHeaderForFilter(filterItem) {
    const infoContainer = document.querySelector('.current-country-info');
    const nameSpan = document.getElementById("selectedCountryName");
    const flagImg = document.getElementById("selectedCountryFlag");
    const fallbackIcon = document.getElementById("selectedCountryIconFallback");
    
    // إذا لم يتم العثور على العناصر، نخرج من الدالة
    if (!infoContainer || !nameSpan || !flagImg || !fallbackIcon) return;

    // ===== إذا لم يتم اختيار دولة أو تصنيف =====
    if (!filterItem) {
        // إخفاء شريط الدولة بالكامل
        infoContainer.style.display = 'none';
        return;
    }

    // ===== إذا تم اختيار دولة، أظهر الشريط =====
    // إعادة الظهور (نضع display إلى القيمة الافتراضية التي حددها الـ CSS)
    infoContainer.style.display = '';

    // تحديث اسم الدولة
    let displayName = currentLanguage === 'en' ? filterItem.name : filterItem.nameAr;
    if (currentLanguage === 'en' && displayName) {
        displayName = displayName.replace(/^[A-Z]{2}\s/, '').trim();
    }
    nameSpan.innerText = displayName;

    // تحديث العلم أو أيقونة التصنيف
    if (filterItem.isGenre) {
        const iconPath = `${assetsBasePath}/Category_icons/${filterItem.code}.png`;
        flagImg.src = iconPath;
        flagImg.className = "country-flag-icon genre-icon";
        flagImg.style.display = 'inline-block';
        fallbackIcon.style.display = 'none';
        flagImg.onerror = () => {
            flagImg.style.display = 'none';
            fallbackIcon.style.display = 'inline-block';
            fallbackIcon.className = 'fas fa-tag';
        };
    } else {
        const flagPath = `${assetsBasePath}/Icons_of_all_countries/${filterItem.code}.png`;
        flagImg.src = flagPath;
        flagImg.className = "country-flag-icon";
        flagImg.style.display = 'inline-block';
        fallbackIcon.style.display = 'none';
        flagImg.onerror = () => {
            flagImg.style.display = 'none';
            fallbackIcon.style.display = 'inline-block';
            fallbackIcon.className = 'fas fa-flag';
        };
    }
}

function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active-pane'));
    const activePane = document.getElementById(tabId);
    if (activePane) activePane.classList.add('active-pane');
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active-tab');
    
    // إعادة تعيين موضع التمرير إلى الأعلى للتبويب النشط
    if (activePane) {
        activePane.scrollTop = 0;
    }
    
    if (tabId === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab();
    else if (tabId === 'stations-tab') renderStations();
    else if (tabId === 'history-tab' && typeof renderHistoryTab === 'function') renderHistoryTab();
    else if (tabId === 'search-tab') performSearch(searchKeyword);
    else if (tabId === 'add-station-tab') {
        resetAddStationForm();
    }
}
function updateCurrentStationFromCard(cardElement) {
    const stationId = cardElement.dataset.id;
    if (!stationId) return false;
    const station = masterStations.find(s => s.id === stationId);
    if (!station) return false;
    
    // حفظ countryCode واسم باللغة الحالية مؤقتاً
    const countryObj = allCountries.find(c => c.code === station.countryCode);
    const countryNameForNow = countryObj ? (currentLanguage === 'en' ? countryObj.name : countryObj.nameAr) : station.countryCode;
    
    currentStation = { 
        id: station.id, 
        name: station.name, 
        country: countryNameForNow, 
        url: station.streamUrl, 
        isWebPage: station.isWebPage || false,
        countryCode: station.countryCode  // مهم: حفظ كود الدولة
    };
    localStorage.setItem('x6RadioCurrentStation', JSON.stringify(currentStation));
    
    const currentStationNameEl = document.getElementById("currentStationName");
    if (currentStationNameEl) currentStationNameEl.innerText = currentStation.name;
    
    // استخدام الدالة المركزية لتحديث اسم الدولة (ستعتمد على countryCode واللغة الحالية)
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
        // الأنواع الأساسية والمضافة حديثًا (بدون مسافات بادئة)
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
        // الأنواع الأساسية السابقة
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
        // الأنواع المتعلقة بالتصنيفات
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
        // إضافات شائعة
        'بودكاست': 'Podcast',
        'هيب هوب/أوربان': 'Hip Hop/Urban',
        'لوك ثونغ/فلكلور': 'Lok Thong/Folklore',
        'موسيقى تقليدية': 'Traditional Music',   // تم إزالة المسافة البادئة
        'رومانسي': 'Romantic',
        'هادئ': 'Relaxing',
        'إلكتروني': 'Electronic',
        'تراثي': 'Folk',
        'فلكلور': 'Folklore',
        'شبابي': 'Youth',
// إضافات جديدة - أدخلها قبل الإغلاق النهائي للـ genreMap
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
'تمكين المرأة / موسيقى': 'Women\'s Empowerment / Music',
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
'موسيقى الأطفال': 'Children\'s Music',
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
            // محاولة إزالة "الـ" من بداية الكلمة
            let withoutAl = genre.replace(/^(ال)/, '');
            translated = genreMap[withoutAl];
        }
        return translated || genre;
    }
    return genre;
}