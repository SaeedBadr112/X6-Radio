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
        timestamp: now,
        // تخزين الوقت كـ timestamp فقط، وسيتم تنسيقه عند العرض حسب اللغة الحالية
// (لا حاجة لتخزين dateStr لأنه سيعاد إنشاؤه في renderHistoryTab)
    });
    
    if (historyList.length > 100) historyList.pop();
    localStorage.setItem("x6RadioHistory", JSON.stringify(historyList));
    if (typeof renderHistoryTab === 'function') renderHistoryTab();
}
function renderHistoryTab() {
    const container = document.getElementById("historyContainer");
    const countSpan = document.getElementById("historyCount");
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

    container.innerHTML = filteredList.map(entry => {
        let station = masterStations.find(s => s.id === entry.id);
        if (!station) {
            station = {
                id: entry.id,
                name: entry.name,
                countryCode: 'XX',
                streamUrl: entry.url,
                isWebPage: false,
                genre: 'عامة'
            };
        }
        const isPlaying = currentStation && currentStation.id === entry.id && !audioPlayer.paused;
// استخدام اللغة الحالية لتنسيق التاريخ
const locale = getLocaleForDate(currentLanguage);
const dateStr = new Date(entry.timestamp).toLocaleString(locale, { hour12: true });

const extraInfo = {
    isHistory: true,
    dateStr: dateStr
};
        return createStationCardHTML(station, isPlaying, extraInfo);
    }).join('');

    if (countSpan) countSpan.innerText = filteredList.length;

    attachStationEvents();
    attachDeleteEvents();

    document.querySelectorAll('#historyContainer .repair-station-btn').forEach(btn => btn.style.display = 'none');

    updateStationPlayButtons(
        currentStation ? currentStation.id : null,
        currentStation && !audioPlayer.paused
    );
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