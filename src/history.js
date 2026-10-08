// ========== دوال السجل ==========
let lastAddedHistoryId = null;
let lastAddedHistoryTime = 0;

// ========== دالة مساعدة لتحديد اللغة المحلية للتواريخ ==========
function getLocaleForDate(lang) {
    const localeMap = {
        'ar': 'ar-EG',
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'pt': 'pt-PT'
    };
    return localeMap[lang] || 'en-US';
}

// ========== دالة للحصول على اسم الدولة المترجم من إدخال السجل ==========
function getCountryDisplayNameForHistory(entry) {
    if (!entry) return '';
    // محاولة العثور على المحطة في masterStations باستخدام id
    const station = masterStations.find(s => s.id === entry.id);
    if (station && station.countryCode) {
        const countryObj = allCountries.find(c => c.code === station.countryCode);
        if (countryObj) {
            return getCountryDisplayName(countryObj, currentLanguage);
        }
    }
    // fallback: استخدام الاسم المخزن
    return entry.country || '';
}

function addToHistory(stationId, stationName, stationCountry, stationUrl) {
    if (!stationId) return;
    
    const now = Date.now();
    // منع إضافة نفس المحطة أكثر من مرة خلال ثانيتين
    if (lastAddedHistoryId === stationId && (now - lastAddedHistoryTime) < 2000) {
        console.log('⏳ تم منع إضافة المحطة للسجل (مكرر خلال ثانيتين)');
        return;
    }
    
    lastAddedHistoryId = stationId;
    lastAddedHistoryTime = now;
    
    // إزالة أي إدخال سابق
    historyList = historyList.filter(entry => entry.id !== stationId);
    
   historyList.unshift({
    id: stationId,
    name: stationName,
    country: stationCountry,
    url: stationUrl,
    timestamp: now
    // لا نضيف dateStr هنا، بل سننشئه في renderHistoryTab حسب اللغة
});
    
    if (historyList.length > 100) historyList.pop();
    localStorage.setItem("x6RadioHistory", JSON.stringify(historyList));
    if (typeof renderHistoryTab === 'function') renderHistoryTab();
}

function renderHistoryTab() {
    // تعريف countSpan في نطاق الدالة (خارج الـ if)
    let countSpan = null;

    // تحديث ملصق عدد المحطات بالترجمة الحالية
    const labelSpan = document.querySelector('.history-stats span:first-child');
    if (labelSpan) {
        countSpan = labelSpan.querySelector('#historyCount');
        const icon = labelSpan.querySelector('i');
        let iconHtml = icon ? icon.outerHTML : '📋';
        labelSpan.innerHTML = '';
        labelSpan.innerHTML = iconHtml + ' ' + t('history_count_label') + ' ';
        if (countSpan) {
            labelSpan.appendChild(countSpan);
        } else {
            const newCountSpan = document.createElement('span');
            newCountSpan.id = 'historyCount';
            newCountSpan.textContent = historyList ? historyList.length : 0;
            labelSpan.appendChild(newCountSpan);
            // تحديث countSpan ليشير إلى العنصر الجديد
            countSpan = newCountSpan;
        }
    }

    const container = document.getElementById("historyContainer");
    if (!container) {
        console.error("historyContainer not found!");
        return;
    }

    let filteredList = [...historyList];
    if (historyFilterKeyword.trim() !== "") {
        const lowerKeyword = historyFilterKeyword.toLowerCase();
        filteredList = filteredList.filter(entry =>
            entry.name.toLowerCase().includes(lowerKeyword) ||
            entry.country.toLowerCase().includes(lowerKeyword)
        );
    }
    if (filteredList.length === 0) {
        if (historyList.length === 0) {
            container.innerHTML = `<div class="empty-message">${t('no_history')}</div>`;
        } else {
            container.innerHTML = `<div class="empty-message">${t('no_history_filter', escapeHtml(historyFilterKeyword))}</div>`;
        }
        if (countSpan) countSpan.innerText = '0';
        return;
    }
   const locale = getLocaleForDate(currentLanguage);

container.innerHTML = filteredList.map(entry => {
    // إذا كان هناك timestamp، استخدمه للتنسيق حسب اللغة الحالية
    let dateStr = '';
    if (entry.timestamp) {
        dateStr = new Date(entry.timestamp).toLocaleString(locale, { hour12: true });
    } else if (entry.dateStr) {
        // fallback للسجلات القديمة التي تحتوي على dateStr
        dateStr = entry.dateStr;
    } else {
        dateStr = ''; // أو قيمة افتراضية
    }
    return `
    <div class="history-item" data-id="${entry.id}">
        <div class="history-info">
            <div class="history-name"><i class="fas fa-microphone-alt"></i> ${escapeHtml(entry.name)}</div>
            <div class="history-time">📅 ${dateStr} • ${escapeHtml(getCountryDisplayNameForHistory(entry))}</div>
        </div>
        <div class="history-actions">
            <button class="play-history-btn" data-url="${escapeHtml(entry.url)}" data-name="${escapeHtml(entry.name)}" data-country="${escapeHtml(entry.country)}" data-id="${entry.id}" title="${t('play')}"><i class="fas fa-play"></i></button>
            <button class="fav-star ${isFavorite(entry.id) ? 'active-fav' : ''}" data-id="${entry.id}" title="${t('save_to_favorites')}"><i class="fas fa-heart"></i></button>
            <button class="delete-history-btn" data-id="${entry.id}" title="${t('delete_from_history')}"><i class="fas fa-trash-alt"></i></button>
        </div>
    </div>
`;
}).join('');
    if (countSpan) countSpan.innerText = filteredList.length;
    
    // أحداث أزرار التشغيل
    document.querySelectorAll('.play-history-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            playStation(btn.dataset.url, btn.dataset.name, btn.dataset.country, btn.dataset.id, false);
        });
    });
    
    // أحداث أزرار الحذف من السجل
    document.querySelectorAll('.delete-history-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            historyList = historyList.filter(entry => entry.id !== id);
            localStorage.setItem("x6RadioHistory", JSON.stringify(historyList));
            renderHistoryTab();
            setStatus(t('station_deleted'), false);
        });
    });
    
    // أحداث أزرار المفضلة (القلب)
    document.querySelectorAll('#historyContainer .fav-star').forEach(star => {
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            const stationId = star.dataset.id;
            // التأكد من وجود المحطة في masterStations (قد تكون محطة من API أو مضافة يدويًا)
            const station = masterStations.find(s => s.id === stationId);
            if (!station) return;
            toggleFavorite(stationId);
            renderHistoryTab(); // إعادة رسم السجل لتحديث لون القلب
            if (typeof renderStations === 'function') renderStations();
            if (typeof renderFavoritesTab === 'function') renderFavoritesTab();
        });
    });
    
    updateStationPlayButtons(currentStation ? currentStation.id : null, currentStation && !audioPlayer.paused);
}
function clearAllHistory() {
    if (confirm(t('confirm_clear_history'))) {
        historyList = [];
        localStorage.setItem("x6RadioHistory", JSON.stringify(historyList));
        renderHistoryTab();
        setStatus(t('history_cleared'), false);
    }
}

function exportHistoryToJSON() {
    if (historyList.length === 0) {
        setStatus(t('no_history_to_export'), true);
        return;
    }
    const dataStr = JSON.stringify(historyList, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `radio_history_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus(t('history_exported'), false);
}

function initHistoryEvents() {
    const clearBtn = document.getElementById('clearAllHistoryBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAllHistory);
    const exportBtn = document.getElementById('exportHistoryBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportHistoryToJSON);
    const searchInput = document.getElementById('historySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            historyFilterKeyword = e.target.value;
            renderHistoryTab();
        });
    }
}