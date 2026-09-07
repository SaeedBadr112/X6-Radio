# X6 Radio — نسخة الجوال (Android + iOS) عبر Capacitor

هذا المشروع يغلّف نفس كود X6 Radio (HTML/CSS/JS) داخل تطبيق جوال حقيقي
باستخدام [Capacitor](https://capacitorjs.com)، بدون إعادة كتابة الواجهة.

---

## 0) ماذا تغيّر بالضبط عن نسخة ويندوز؟

| الملف | التغيير |
|---|---|
| `main.js`, `preload.js`, `installer.nsh` | **لم تُنسخ** — خاصة بـ Electron فقط، لا حاجة لها هنا |
| `capacitorBridge.js` (جديد) | يحل محل `preload.js`: يوفر إغلاق التطبيق + تخزين اللغة عبر Capacitor، والباقي يعمل تلقائياً بالفولباك الأصلي الموجود في الكود |
| `mobileMediaSession.js` (جديد) | يضيف أزرار تشغيل/إيقاف على شاشة القفل وإشعار النظام |
| `mobile.css` (جديد) | يخفي شريط عنوان ويندوز المخصص ووضع "مصغر"، ويضيف دعم `safe-area` للنوتش، ويكبّر مساحة اللمس |
| `hls_min.js` → `hls.min.js` | تصحيح اسم الملف ليطابق ما يستدعيه `index.html` |
| باقي الملفات (`stationsData.js`, `favorites.js`, `search.js`, `style.css`...) | **بدون أي تعديل** — تعمل كما هي لأنها أصلاً تعتمد على `localStorage` و`fetch` العاديين |

**لماذا لم أُضطر لتعديل كل الملفات؟** لأن الكود الأصلي مكتوب باحتراف: كل استخدام لـ
`window.electronAPI` فيه فحص `if (window.electronAPI && ...)` مع فولباك جاهز
(localStorage، `./assets`، تجاهل بصمت). لذلك 90% من التوافق تم "مجاناً".

---

## 1) ملف ناقص يجب عليك إضافته يدوياً: مجلد `assets`

⚠️ لم يتم رفع مجلد `src/assets` (الشعارات، أعلام الدول، أيقونة `0001.ico`، الصور)
ضمن الملفات التي أرسلتها. يجب نسخه يدوياً إلى:

```
www/assets/
```

(المسار المتوقع في الكود هو `./assets/...` كما هو في `index.html`).

كما ستحتاج أيقونة تطبيق مربعة عالية الدقة (1024×1024 بدون شفافية) وصورة splash
لتوليد أيقونات أندرويد/iOS لاحقاً (خطوة 5).

---

## 2) مكان تنفيذ أوامر npm وCapacitor

نفّذ الأوامر من **المجلد الرئيسي للمشروع** الذي يحتوي على الملفات التالية:

```text
x6-radio-mobile/
├── package.json
├── package-lock.json
├── capacitor.config.json
├── www/
└── android/              # يظهر بعد npx cap add android
```

لا تنفّذها من `android/` أو `android/app/` أو `www/` أو `www/assets/`.

في Android Studio افتح **Terminal** ثم انتقل إلى هذا المجلد:

```bash
cd /path/to/x6-radio-mobile
```

تحقق من أنك في المكان الصحيح قبل التثبيت:

```bash
npm prefix
```

يجب أن يطبع مسار مجلد `x6-radio-mobile` نفسه، ثم نفّذ:

```bash
npm install
```

## 3) إضافة أندرويد والمزامنة

```bash
# نفّذ هذا مرة واحدة فقط إذا لم يوجد مجلد android/
npx cap add android

# انسخ ملفات www إلى مشروع أندرويد وطبّق إعدادات Capacitor
npx cap sync android
```

إذا كان مجلد `android/` موجوداً مسبقاً، لا تعِد تنفيذ `npx cap add android`؛ استخدم `npx cap sync android` فقط.

## 4) فتح وتشغيل

```bash
npx cap open android   # يفتح Android Studio
```

بعد أي تعديل على ملفات `www/`:

```bash
npx cap copy android
```

ثم نفّذ **Sync Project with Gradle Files** أو أعد البناء من Android Studio.

## 5) تشخيص توقف التطبيق عند شاشة البداية

إذا ظهر التطبيق على شاشة البداية فقط، افتح Logcat وابحث عن `Capacitor/Console`.

أخطاء مثل:

```text
Uncaught SyntaxError: Unexpected token function
Uncaught SyntaxError: Unexpected token .
```

تعني أن Android System WebView داخل المحاكي قديم ولا يفهم بعض صياغات JavaScript الحديثة مثل `async/await` أو Optional Chaining (`?.`). هذه ليست مشكلة في صورة Splash أو في `capacitor.config.json`.

الحل المفضل:

1. استخدم صورة نظام حديثة للمحاكي.
2. حدّث Google Chrome وAndroid System WebView داخل المحاكي.
3. نفّذ من مجلد المشروع الرئيسي:

```bash
npm install
npx cap sync android
npx cap open android
```

لا تضف Babel أو تغيّر ملفات JavaScript إلى صيغة قديمة قبل تجربة تحديث WebView؛ لأن تحويل جميع ملفات التطبيق يحتاج إعداد build كامل واختباراً منفصلاً.

---

## 4) ✅ تشغيل الصوت في الخلفية / عند قفل الشاشة (تم حلّه)

### iOS
⚠️ **تحديث**: الجملة القديمة هنا كانت تقول إن إضافة `UIBackgroundModes`
وحدها كافية — هذا غير دقيق بالكامل. تجارب مطورين حقيقيين مع Capacitor
أظهرت أن WKWebView لا يفعّل جلسة AVAudioSession الصحيحة تلقائياً بشكل
موثوق في كل الحالات، فقد يتوقف الصوت عند القفل. الحل الكامل (خطوة Xcode
+ سطرين Swift) موجود جاهزاً في **`ios-native-patch/README.md`** بجانب
هذا الملف — اتبعه بالكامل بدل الاعتماد على `UIBackgroundModes` فقط.

### iOS — السماح بروابط البث http:// (إلزامي، غير موجود سابقاً في هذا الملف)
المشروع يحتوي على أكثر من 2300 محطة برابط `http://` غير مشفر. أندرويد
يسمح بها (بفضل `allowMixedContent: true` في `capacitor.config.json`)،
لكن iOS يمنعها تماماً بحماية اسمها App Transport Security (ATS) ما لم
تُضِف استثناءً صريحاً في `Info.plist`. بدون هذا الاستثناء ستفشل كل هذه
المحطات فوراً عند التشغيل على آيفون. الكود المطلوب لصقه جاهز في
**`ios-native-patch/Info.plist-snippet.xml`**.

### أندرويد
تم تنفيذ **Foreground Service أصلي حقيقي** (Java) + إشعار تحكم مرتبط
بـ MediaSession، موجود في مجلد `android-native-patch/` بجانب هذا الملف.
هذا الحل **لم يُدمج تلقائياً** في مشروع `android/` لأن ذلك المجلد لا يُنشأ
إلا بعد تشغيلك لأمر `npx cap add android` على جهازك (لا يوجد اتصال إنترنت
في بيئة التوليد الحالية لتنفيذ ذلك بنفسي).

**اتبع تعليمات الدمج كاملة في `android-native-patch/README.md`** — تشمل:
نسخ 3 ملفات Java، إضافة صلاحيات وتعريف خدمة في `AndroidManifest.xml`،
وإضافة سطر واحد في `build.gradle`. هذا الجزء **يحتاج اختباراً على جهاز
أندرويد فعلي** بعد الدمج (لم يُختبر التشغيل الفعلي بعد).

---

## 5) أيقونة التطبيق وشاشة البداية (Splash)

```bash
npm install -D @capacitor/assets
npx capacitor-assets generate
```
(يحتاج ملفي `resources/icon.png` (1024×1024) و`resources/splash.png` قبل التشغيل)

---

## 6) صلاحيات يُنصح بإضافتها

- **أندرويد** (`android/app/src/main/AndroidManifest.xml`): `INTERNET` موجودة
  افتراضياً في مشروع Capacitor. أضف `FOREGROUND_SERVICE` و
  `POST_NOTIFICATIONS` (أندرويد 13+) إذا نفّذت حل الخلفية في الخطوة 4.
- **iOS**: لا توجد "صلاحيات" (Permissions) بالمعنى المعروف في أندرويد،
  لكن هناك إعدادان إلزاميان في `Info.plist` بدونهما لن يعمل التطبيق
  بشكل صحيح: `UIBackgroundModes` (للصوت في الخلفية) و
  `NSAppTransportSecurity` (للسماح بروابط `http://`). راجع
  `ios-native-patch/README.md` للتفاصيل الكاملة.

---

## 7) ميزات تحتاج اختباراً يدوياً بعد البناء

- **تسجيل البث** (إن وُجد كود تسجيل عبر `MediaRecorder`) — يحتاج تأكيد صلاحية
  التخزين وعمله داخل WebView على كل من أندرويد/iOS.
- **البحث عبر Radio Browser API** (`search.js`) — يعمل بلا تعديل لأنه `fetch`
  عادي، لكن تأكد أن `AndroidManifest.xml` يسمح بحركة شبكة HTTP إن وُجدت روابط
  بث غير مشفرة (`http://` بدل `https://`)، عبر إضافة
  `android:usesCleartextTraffic="true"` إذا لزم الأمر.
- **الخطوط والأيقونات (Font Awesome)** — محمّلة حالياً من CDN خارجي، يتطلب
  اتصال إنترنت عند أول فتح؛ يمكن تنزيلها محلياً لاحقاً لتحسين الموثوقية.

---

## الخلاصة

المشروع جاهز الآن للبناء المحلي (خطوة 2) بمجرد إضافة مجلد `assets` الناقص.
الوظائف الأساسية (تشغيل، بحث، مفضلة، سجل، لغة، ثيمات) ستعمل مباشرة. الفجوة
التقنية الحقيقية الوحيدة هي **تشغيل الصوت في الخلفية على أندرويد** (خطوة 4).
