// ================================================================
// capacitorBridge.js
// طبقة توافق تحل محل preload.js (Electron) عند التشغيل داخل تطبيق
// جوال مبني بواسطة Capacitor. يجب تحميل هذا الملف قبل أي سكريبت آخر.
//
// ملاحظة مهمة: باقي ملفات التطبيق (appInit.js, menuBar.js,
// keyboardShortcuts.js, stationsData.js, uiRendering.js ...) تتحقق
// أصلاً من وجود window.electronAPI قبل استخدامه، ولديها فولباك آمن
// (localStorage, ./assets, تجاهل بصمت) في حال عدم وجوده — لذلك لا
// داعٍ لتعريف كل الدوال هنا، فقط ما يحتاج فعلياً سلوكاً مختلفاً على
// الجوال (الخروج من التطبيق، وتخزين اللغة بشكل أكثر ثباتاً).
// ================================================================

(function () {
    var isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

    // تمييز الجسم بكلاس لاستخدامه فى mobile.css لإخفاء عناصر سطح المكتب
    document.documentElement.classList.add(isNative ? 'capacitor-native' : 'capacitor-web');

    if (!window.Capacitor) {
        // نعمل داخل متصفح عادي أثناء التطوير (npx cap serve أو فتح index.html مباشرة)
        // لا نعرّف electronAPI هنا؛ الكود الأصلي سيستخدم فولباك المتصفح تلقائياً.
        return;
    }

    var Plugins = window.Capacitor.Plugins || {};
    var CapApp = Plugins.App;
    var Preferences = Plugins.Preferences;
    var StatusBar = Plugins.StatusBar;

    var LANG_KEY = 'x6_language';

    window.electronAPI = {
        // ===== إغلاق التطبيق (بدلاً من إغلاق نافذة ويندوز) =====
        closeApp: function () {
            if (CapApp && CapApp.exitApp) CapApp.exitApp();
        },
        closeWindow: function () {
            if (CapApp && CapApp.exitApp) CapApp.exitApp();
        },

        // ===== تخزين اللغة عبر Capacitor Preferences (أكثر ثباتاً من localStorage) =====
        getConfigLanguage: async function () {
            if (!Preferences) return null;
            try {
                var res = await Preferences.get({ key: LANG_KEY });
                return res && res.value ? res.value : null;
            } catch (e) {
                console.warn('capacitorBridge: getConfigLanguage failed', e);
                return null;
            }
        },
        saveConfigLanguage: async function (lang) {
            if (!Preferences) return false;
            try {
                await Preferences.set({ key: LANG_KEY, value: lang });
                return true;
            } catch (e) {
                console.warn('capacitorBridge: saveConfigLanguage failed', e);
                return false;
            }
        },
        resetConfig: async function () {
            if (!Preferences) return false;
            try {
                await Preferences.remove({ key: LANG_KEY });
                return true;
            } catch (e) {
                return false;
            }
        },

        // ===== لا يوجد تحديث تلقائي عبر GitHub على الجوال، متجر التطبيقات يتولى ذلك =====
        checkForUpdates: function () { /* no-op: يديره المتجر (Play Store / App Store) */ },
        isPackaged: async function () { return true; },
        onUpdateAvailable: function () {},
        onUpdateDownloaded: function () {},
        onUpdateNotAvailable: function () {},
        onUpdateError: function () {},
        quitAndInstall: function () {},

        // ===== لون شريط الحالة (StatusBar) بدلاً من شريط عنوان ويندوز =====
        setTitleBarColor: function (color) {
            if (StatusBar && StatusBar.setBackgroundColor && color) {
                try { StatusBar.setBackgroundColor({ color: color }); } catch (e) {}
            }
        }

        // تعمداً لم يتم تعريف: minimizeWindow / maximizeWindow / isWindowMaximized /
        // setWindowSize / setWindowPosition / getWindowPosition / setAlwaysOnTop /
        // getAlwaysOnTop / setFullScreen / isFullScreen / openDevTools / toggleDevTools /
        // getAssetsDir / getUserDataPath / mkdir / fileExists / saveFile /
        // onShortcutTriggered / setMenuBarVisibility
        // لأن هذه المفاهيم غير موجودة على الجوال، والكود الأصلي يتجاهلها بأمان
        // بالفعل عند غيابها (راجع الفحص في appInit.js / menuBar.js / stationsData.js).
    };
})();
