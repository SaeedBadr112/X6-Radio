// ========== المفضلة ==========
function saveFavorites() { localStorage.setItem("x6RadioFavs", JSON.stringify(favorites)); if (typeof renderFavoritesTab === 'function') renderFavoritesTab(); if (typeof renderStations === 'function') renderStations(true); if (typeof updateFavButtonCurrent === 'function') updateFavButtonCurrent(); }
function isFavorite(stationId) { return favorites.includes(stationId); }
function addFavorite(stationId) { if (!isFavorite(stationId)) favorites.push(stationId); saveFavorites(); setStatus(t('added_to_favorites'), false); }
function removeFavorite(stationId) { favorites = favorites.filter(id => id !== stationId); saveFavorites(); setStatus(t('removed_from_favorites'), false); }
function toggleFavorite(stationId) { isFavorite(stationId) ? removeFavorite(stationId) : addFavorite(stationId); if (typeof updateFavButtonCurrent === 'function') updateFavButtonCurrent(); }
function updateFavButtonCurrent() {
    const heart = document.getElementById("favHeart");
    const text = document.getElementById("favText");
    if (!heart) return;

    if (currentStation && currentStation.id && isFavorite(currentStation.id)) {
        heart.innerHTML = '<i class="fa-solid fa-heart" style="color: #ff1744;"></i>';
        if (text) text.textContent = t('saved_to_favorites');
    } else {
        heart.innerHTML = '<i class="fa-regular fa-heart" style="color: #ff1744;"></i>';
        if (text) text.textContent = t('save_to_favorites');
    }
}
// ========== عرض تبويب المفضلة ==========
function renderFavoritesTab() {
    console.log('🔴 [renderFavoritesTab] START');
    console.log('🔴 [renderFavoritesTab] favorites array:', favorites);
    console.log('🔴 [renderFavoritesTab] masterStations count:', masterStations.length);

    const container = document.getElementById("favoritesContainer");
    if (!container) {
        console.error('🔴 [renderFavoritesTab] Container not found!');
        return;
    }

    if (typeof window.createStationCardHTML !== 'function') {
        console.error('🔴 [renderFavoritesTab] createStationCardHTML is not defined!');
        const favStations = masterStations.filter(st => favorites.includes(st.id));
        if (!favStations.length) {
            container.innerHTML = `<div class="empty-message">${t('no_favorites')}</div>`;
        } else {
            container.innerHTML = favStations.map(st => `<div style="padding:10px; border-bottom:1px solid #333;">${st.name}</div>`).join('');
        }
        return;
    }

    const favStations = masterStations.filter(st => favorites.includes(st.id));
    console.log('🔴 [renderFavoritesTab] Filtered favStations count:', favStations.length);

    if (!favStations.length) {
        container.innerHTML = `<div class="empty-message">${t('no_favorites')}</div>`;
        return;
    }

    // استخدام createStationCardHTML بدون معامل rtl
    container.innerHTML = favStations.map(st => {
        const isPlaying = currentStation && currentStation.id === st.id && !audioPlayer.paused;
        return createStationCardHTML(st, isPlaying);
    }).join('');

    console.log('🔴 [renderFavoritesTab] HTML generated, length:', container.innerHTML.length);

    attachStationEvents();
    attachDeleteEvents();

    updateStationPlayButtons(
        currentStation ? currentStation.id : null,
        currentStation && !audioPlayer.paused
    );
}

// تصدير الدالة للنطاق العام
window.renderFavoritesTab = renderFavoritesTab;