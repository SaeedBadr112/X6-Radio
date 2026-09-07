// ================================================================
// backgroundAudio.js
// يربط عنصر <audio> الفعلي (audioPlayer) بخدمة Foreground Service
// الأصلية على أندرويد (BackgroundAudioPlugin) حتى يستمر البث عند
// تصغير التطبيق أو قفل الشاشة، مع إشعار تحكم (تشغيل/إيقاف/إغلاق).
//
// على iOS: لا حاجة لهذا الملف؛ يكفي UIBackgroundModes = audio في
// Info.plist (راجع README-MOBILE.md) لأن WKWebView يربط <audio>
// مباشرة بجلسة AVAudioSession النظامية.
//
// هذا الملف لا يعدّل أي ملف أصلي من التطبيق، فقط "يستمع" لأحداث
// audioPlayer الموجودة أصلاً في globals.js / playerControls.js.
// ================================================================
(function () {
    var isAndroidNative = !!(
        window.Capacitor &&
        window.Capacitor.isNativePlatform &&
        window.Capacitor.isNativePlatform() &&
        window.Capacitor.getPlatform &&
        window.Capacitor.getPlatform() === 'android'
    );
    if (!isAndroidNative) return; // فقط أندرويد يحتاج هذا الحل الأصلي

    var BackgroundAudio = window.Capacitor.Plugins && window.Capacitor.Plugins.BackgroundAudio;
    if (!BackgroundAudio) {
        console.warn('⚠️ BackgroundAudio plugin غير مسجَّل. تأكد من تعديل MainActivity.java ' +
            'حسب التعليمات في android-native-patch/README.md');
        return;
    }

    function getStationInfo() {
        var st = (typeof currentStation !== 'undefined') ? currentStation : null;
        return {
            title: (st && st.name) || 'X6 Radio',
            artist: (st && st.country) || ''
        };
    }

    var serviceStarted = false;

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof audioPlayer === 'undefined' || !audioPlayer) {
            console.warn('⚠️ audioPlayer غير موجود بعد؛ تأكد من ترتيب تحميل السكريبتات');
            return;
        }

        audioPlayer.addEventListener('play', function () {
            var info = getStationInfo();
            BackgroundAudio.start({ title: info.title, artist: info.artist });
            serviceStarted = true;
        });

        audioPlayer.addEventListener('pause', function () {
            if (serviceStarted) BackgroundAudio.updatePlaybackState({ isPlaying: false });
        });

        audioPlayer.addEventListener('ended', function () {
            if (serviceStarted) BackgroundAudio.updatePlaybackState({ isPlaying: false });
        });
    });

    // تحديث اسم/بلد المحطة في الإشعار عند تغييرها (بدون تعديل playerControls.js)
    var lastStationId = null;
    setInterval(function () {
        if (!serviceStarted) return;
        var st = (typeof currentStation !== 'undefined') ? currentStation : null;
        if (st && st.id !== lastStationId) {
            lastStationId = st.id;
            var info = getStationInfo();
            BackgroundAudio.updateMetadata({ title: info.title, artist: info.artist });
        }
    }, 2000);

    // استقبال ضغطات أزرار إشعار أندرويد والتحكم الفعلي في عنصر audio
    BackgroundAudio.addListener('remoteControl', function (data) {
        if (typeof audioPlayer === 'undefined' || !audioPlayer) return;
        if (data.action === 'play') {
            audioPlayer.play();
        } else if (data.action === 'pause') {
            audioPlayer.pause();
        } else if (data.action === 'stop') {
            audioPlayer.pause();
            BackgroundAudio.stop();
            serviceStarted = false;
        }
    });

    // إيقاف الخدمة عند إغلاق التطبيق فعلياً من قائمة "الخروج" في menuBar.js
    window.addEventListener('beforeunload', function () {
        if (serviceStarted) BackgroundAudio.stop();
    });
})();
