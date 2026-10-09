# 📻 تطبيق الراديو | نسخة الهاتف (Android)

مرحباً بك في مستودع الكود المصدري لنسخة الهواتف الذكية من تطبيق **X6-Radio**. تم بناء هذه النسخة باستخدام **Capacitor** لتقديم تجربة أداء عالية ومستقرة تشبه التطبيقات الأصلية (Native) على نظام الأندرويد.

---

## 🛠 المتطلبات الأساسية للبيئة المحمولة
قبل البدء في البناء، تأكد من تثبيت الأدوات التالية على جهازك:
* **Node.js** (إصدار LTS)
* **Android Studio** (مع تثبيت SDK والأدوات المساعدة Build Tools)
* **Gradle** (مهيأ في متغيرات البيئة للويندوز)

---

## 🚀 تشغيل بيئة التطوير والمزامنة

عند تحميل المشروع لأول مرة أو الانتقال إلى هذا الفرع، نفذ الأوامر التالية بالترتيب لتثبيت الحزم وإصلاح بيئة المزامنة:

```cmd
:: 1. تثبيت الحزم الاعتمادية للمشروع
npm install

:: 2. تثبيت حزمة أندرويد الخاصة بـ Capacitor
npm install @capacitor/android

:: 3. عمل المزامنة وربط ملفات الويب بمجلد الأندرويد
npx cap sync android
```

---

## 📦 خطوات البناء والتوقيع النهائي (Production Build)

لاستخراج ملف الـ **APK** النهائي والموقع يدوياً بالشكل الصحيح وتفادي مشاكل لغة الأرقام، اتبع الخطوات التالية:

### 1. تنظيف وبناء بيئة Gradle
```cmd
cd android
set GRADLE_OPTS=-Duser.language=en -Duser.country=US
gradlew clean
gradlew assembleRelease
cd ..
```

### 2. نقل ملف الـ APK غير الموقع
```cmd
copy android\app\build\outputs\apk\release\app-release-unsigned.apk app-unsigned.apk
```

### 3. عمل المحاذاة (Zipalign)
```cmd
"D:\Apps\AndroidSDK\build-tools\35.0.0\zipalign.exe" -v -p 4 app-unsigned.apk X6-Radio-Final.apk
```

### 4. التوقيع النهائي عبر (Apksigner)
```cmd
"D:\Apps\AndroidSDK\build-tools\35.0.0\apksigner.bat" sign --ks my-release-key.jks --out X6-Radio-Official.apk X6-Radio-Final.apk
```

> ⚠️ **تنبيه أمني:** تأكد دائماً من الإبقاء على ملف المفتاح الرقمي `my-release-key.jks` في مكان آمن وخارج مجلد تتبع Git لحماية توقيع تطبيقك.

---

## 🎨 مميزات نسخة الهاتف (Android Features)
* 📱 واجهة مستخدم متجاوبة بالكامل ومتوافقة مع شاشات اللمس.
* 🛑 دعم الاستماع في الخلفية (Background Audio) بفضل الـ Plugins المخصصة للمشروع.
* 🔋 استهلاك منخفض جداً للطاقة وموارد الجهاز أثناء البث المباشر.
* 🎨 دعم كامل لكافة المظاهر (الداكن، الفاتح، الأحمر) والأقسام المحلية المتاحة في نسخة سطح المكتب.
