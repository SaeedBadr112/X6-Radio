// ================================================================
// mobileMediaSession.js
// يضيف عناصر تحكم (تشغيل/إيقاف) على شاشة القفل وإشعار النظام عبر
// Media Session API القياسي (يعمل في متصفح الجوال/الويب فيو بدون
// أي حزمة Capacitor إضافية). لا يعدّل أي ملف أصلي من التطبيق.
// يجب تحميله بعد globals.js و playerControls.js.
// ================================================================

(function () {
    if (!('mediaSession' in navigator)) return;

    function updateMetadata() {
        if (typeof currentStation === 'undefined' || !currentStation) return;
        try {
            var artwork = (typeof assetsBasePath !== 'undefined' ? assetsBasePath : './assets') + '/0001.ico';
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentStation.name || 'X6 Radio',
                artist: currentStation.country || '',
                album: 'X6 Radio',
                artwork: [{ src: artwork, sizes: '256x256', type: 'image/x-icon' }]
            });
        } catch (e) {
            console.warn('mediaSession metadata error:', e);
        }
    }

    function updatePlaybackState() {
        if (typeof audioPlayer === 'undefined' || !audioPlayer) return;
        navigator.mediaSession.playbackState = audioPlayer.paused ? 'paused' : 'playing';
    }

    try {
        navigator.mediaSession.setActionHandler('play', function () {
            if (typeof audioPlayer !== 'undefined' && audioPlayer) audioPlayer.play();
        });
        navigator.mediaSession.setActionHandler('pause', function () {
            if (typeof audioPlayer !== 'undefined' && audioPlayer) audioPlayer.pause();
        });
        navigator.mediaSession.setActionHandler('stop', function () {
            if (typeof audioPlayer !== 'undefined' && audioPlayer) audioPlayer.pause();
        });
    } catch (e) {
        console.warn('mediaSession action handlers not fully supported:', e);
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof audioPlayer === 'undefined' || !audioPlayer) return;
        audioPlayer.addEventListener('play', function () { updateMetadata(); updatePlaybackState(); });
        audioPlayer.addEventListener('pause', updatePlaybackState);
    });

    // فحص دوري بسيط لالتقاط تغيّر المحطة الحالية دون تعديل playerControls.js
    setInterval(function () {
        if (typeof audioPlayer !== 'undefined' && audioPlayer && !audioPlayer.paused) updateMetadata();
    }, 4000);
})();
