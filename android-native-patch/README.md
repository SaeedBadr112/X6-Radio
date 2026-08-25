# تفعيل تشغيل الصوت في الخلفية على أندرويد (Foreground Service)

هذا المجلد يحتوي كود Android أصلي (Java) يحل مشكلة توقف الصوت عند تصغير
التطبيق أو قفل الشاشة، عبر Foreground Service حقيقية + إشعار تحكم مرتبط
بـ MediaSession النظامي. **لا تُدمج هذه الملفات إلا بعد تنفيذ `npx cap add
android` أولاً** (راجع README-MOBILE.md، الخطوة 2)، لأن مجلد `android/`
غير موجود قبل ذلك.

## خطوات الدمج (مرة واحدة فقط)

### 1) انسخ 3 ملفات Java
انسخ محتوى هذه الملفات إلى نفس المسار داخل مشروعك (المسار سيكون موجوداً
مسبقاً بعد `cap add android`، فقط أضف/استبدل الملفات):

```
android-native-patch/app/src/main/java/com/saeed/x6radio/MainActivity.java
android-native-patch/app/src/main/java/com/saeed/x6radio/BackgroundAudioPlugin.java
android-native-patch/app/src/main/java/com/saeed/x6radio/BackgroundAudioService.java
```

→ انسخها إلى:

```
android/app/src/main/java/com/saeed/x6radio/
```

⚠️ إن كان `appId` مختلفاً عن `com.saeed.x6radio` في `capacitor.config.json`
لديك، يجب تغيير اسم الحزمة (package) في أعلى كل ملف Java + اسم المجلد ليطابق
`appId` الفعلي.

**ملاحظة:** ملف `MainActivity.java` الذي ننسخه هنا **يستبدل** الملف
الافتراضي الذي أنشأه Capacitor تلقائياً (فقط أضفنا سطر `registerPlugin`
واحد إليه). إن كنت عدّلت `MainActivity.java` الأصلي بشيء آخر، ادمج
`registerPlugin(BackgroundAudioPlugin.class);` يدوياً بدلاً من الاستبدال
الكامل.

### 2) عدّل AndroidManifest.xml
افتح `android/app/src/main/AndroidManifest.xml` وأضف الأسطر الموجودة في
`AndroidManifest_additions.xml` (صلاحيات + تعريف الخدمة) في مكانيها
الصحيحين كما هو موضح في التعليقات داخل الملف.

### 3) أضف الاعتمادية (dependency) في build.gradle
افتح `android/app/build.gradle` وأضف ضمن قسم `dependencies { ... }`:

```gradle
implementation "androidx.media:media:1.7.0"
```

(هذه المكتبة توفر `MediaSessionCompat` المستخدمة في الإشعار)

### 4) أعد المزامنة والبناء
```bash
npx cap copy android
npx cap sync android
npx cap open android
```
ثم Build → Rebuild Project من داخل Android Studio.

---

## كيف يعمل الحل

1. عند بدء تشغيل أي محطة، يستدعي `www/backgroundAudio.js` (يُحمَّل تلقائياً
   ضمن `index.html`) الدالة `BackgroundAudio.start()`.
2. هذا يشغّل `BackgroundAudioService` كـ **Foreground Service** حقيقية مع
   إشعار دائم (غير قابل للمسح أثناء التشغيل)، مما يمنع نظام أندرويد من تجميد
   عملية التطبيق (Doze / App Standby) ويُبقي WebView وعنصر `<audio>` يعملان.
3. الإشعار يعرض زر تشغيل/إيقاف مرتبط بـ `MediaSessionCompat`، فتظهر عناصر
   التحكم أيضاً على شاشة القفل تلقائياً (سلوك أندرويد القياسي لأي MediaSession
   نشط).
4. عند ضغط المستخدم على زر الإشعار، تُرسل الخدمة الأصلية الأمر إلى JS عبر
   `notifyListeners('remoteControl', ...)`، فيستقبله `backgroundAudio.js`
   وينفّذ `audioPlayer.play()` أو `audioPlayer.pause()` فعلياً — أي أن
   الصوت نفسه يبقى محكوماً بالكامل من داخل WebView كما هو الحال دائماً،
   والخدمة الأصلية فقط "تُبقي كل شيء حياً" وتعرض واجهة التحكم.

## اختبار حقيقي مطلوب

هذا الكود لم يُختبر على جهاز فعلي (بيئة العمل الحالية بلا اتصال إنترنت أو
Android SDK). بعد البناء، اختبر تحديداً:
- تشغيل محطة ثم الضغط على زر الشاشة الرئيسية (Home) — يجب أن يستمر الصوت.
- قفل الشاشة أثناء التشغيل — يجب ظهور عناصر تحكم على شاشة القفل.
- التبديل بين عدة محطات والتأكد أن عنوان الإشعار يتحدث.
- الضغط على "إغلاق" في الإشعار — يجب أن يتوقف الصوت وتختفي الخدمة.
- على أجهزة Android 13+: تأكد من ظهور طلب صلاحية الإشعارات (أو أضف طلبها
  يدوياً وقت التشغيل إن لم يظهر تلقائياً).
