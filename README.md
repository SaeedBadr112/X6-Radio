# 📻 X6 Radio | World Radio Stations

[![Version](https://shields.io)](https://github.com)
[![License](https://shields.io)](LICENSE)
[![Electron](https://shields.io)](https://electronjs.org)

**X6 Radio** is an advanced cross-platform desktop application built for Windows using Electron. It provides access to thousands of Arabic and international radio stations, featuring professional audio effects, sleep timers, live stream recording, and a modern, fully responsive bilingual user interface.

![Application Screenshot](screenshot.png)

---

## ✨ Main Features

- 🎙️ **Thousands of Radio Stations:** Stream global and regional stations with options to add, delete, and import/export lists.
- 🌐 **Full Bilingual Support:** Smooth, instant switching between Arabic (RTL) and English (LTR) layouts.
- 🎛️ **Advanced Audio Effects:**
  - Built-in Audio Compressor.
  - Stereo separation configurations (Left / Right / Center).
  - Dynamic Output Device switching.
- ⏱️ **Sleep Timer:** Automated shutdown timer settings (20, 40, 60, 80 minutes) with an active countdown display.
- ⏫ **Count-up Timer:** Track your current continuous listening session duration.
- 🔴 **Live Recording:** Capture and record live audio broadcasts directly into high-quality WebM files.
- 💾 **Listening History:** Keeps track of the last 100 played stations with instant search, export, and automatic cleanup options.
- ❤️ **Favorites System:** Save and easily access your top-rated radio stations.
- 🔍 **Advanced Search UI:**
  - Local database indexing for loaded stations.
  - Live global directory lookup powered by the **Radio Browser API**.
- 🎨 **Multiple Themes:**
  - Default Cyber Blue theme.
  - High-Contrast Dark mode.
  - Clean Light mode.
  - 🆕 Elegant Red theme.
- ⌨️ **Extensive Key Shortcuts:** Fully controllable via keyboard with over 50 registered shortcuts.
- 📦 **Auto Updates:** Built-in seamless updater via GitHub Releases using `electron-updater`.
- 🔧 **Compact Mode:** Mini-player view layout hiding unnecessary elements to show the playback bar only.
- 📁 **Data Portability:** Seamlessly import and export your personalized station lists via JSON files.
- 🖼️ **Station Customization:** Manually upload and change station cover images using local assets.

---

## 📦 Requirements

- **Operating System:** Windows 7 / 8 / 10 / 11 (64-bit)
- **Network:** An active internet connection is recommended for remote API lookups and automatic updates.

---

## 🚀 Download & Install

Get the latest stable installation assets directly from the [Releases Page](https://github.com).

- **`X6 Radio Setup X.X.X.exe`** – Standard NSIS installer supporting folder selection and desktop shortcut creation.
- **`X6 Radio X.X.X.exe`** – Portable zero-installation standalone binary.

*Note: Custom user configurations, logs, and cache data are securely stored locally within the `%APPDATA%\X6 Radio` directory.*

---

## 🛠️ Build from Source

Follow these sequential terminal commands to establish a local build workspace:

1. **Clone the Repository:**
```bash
git clone https://github.com
cd X6-Radio
```

2. **Install Core Dependencies:**
```bash
npm install
```

3. **Launch Live Development Workspace:**
```bash
npm start
```

4. **Compile Production Binaries:**
```bash
npm run dist
```
*Compiled output build packages will be generated inside the local `dist/` directory.*

---

## ⌨️ Key Shortcuts Overview

| Shortcut | Functionality |
| :--- | :--- |
| **Ctrl+Shift+1 ... 4** | Configure Sleep Timer (20-80 mins) |
| **Ctrl+Shift+A / D** | Toggle Auto-play for the last active station |
| **Ctrl+Shift+V / B** | Toggle Audio Visualizer animations |
| **Ctrl+Shift+R / U** | Show / Hide Live Recording dashboard icons |
| **Ctrl+Shift+5 ... 8** | Adjust Auto-play delay intervals (0.5 – 3 seconds) |
| **Ctrl+Shift+F10 ... F12** | Scale Global Application Font Size (Small – Medium – Large) |
| **Ctrl+Shift+F1 ... F4** | Cycle Active Interface Themes (Default – Dark – Light – Red) |
| **Ctrl+Shift+K** | Display comprehensive Keyboard Shortcuts list |
| **Ctrl+Shift+U** | Manually force check for application updates (Installed client only) |
| **Ctrl+Shift+G** | Open the official open-source GitHub repository |
| **Ctrl+P / Space** | Global Play / Pause toggle |
| **Ctrl+1 ... 5** | Navigate application modules (Stations – Favorites – Search – Add – History) |
| **Ctrl+O / Shift+O** | Open custom live streaming network audio URL |
| **Ctrl+Q / Ctrl+W** | Terminate and Exit Application |

> To trigger the complete interactive shortcuts overlay list inside the application workspace, use **Ctrl+Shift+K** or navigate via Help → Keyboard Shortcuts.

---

## 🔄 Auto Updates Lifecycle

The distribution utilizes the `electron-updater` package workspace ecosystem.
- Upon booting, the client securely queries GitHub Releases for newer version tags.
- If a newer package is found, a prompt handles background retrieval and triggers an automatic software restart upon confirmation.
- Manual triggers can be forced anytime via Help → Check for Updates (**Ctrl+Shift+U**).

*Notice: Automated update deployment lifecycles are restricted to standard installed environments (NSIS Installers) and are inactive in portable distributions or local development environments.*

---

## 📄 Project Structure

```text
X6-Radio/
├── main.js                 # Electron Core Main Process
├── preload.js              # Secure IPC Bridge Interface
├── package.json            # Application Manifest and Configurations
├── src/
│   ├── index.html          # Core Interface View Layout
│   ├── style.css           # Styling Schemas and Theme Properties
│   ├── assets/             # Branding Icons, Flags, and Graphical Assets
│   ├── *.js                # Logic Modules (appInit, i18n, stations, settings, etc.)
│   └── ...
├── dist/                   # Production Build Outputs (Populated via npm run dist)
└── README.md
```

---

## 🤝 Contributing

This distribution is open-source under the MIT license terms. Community pull requests, localization updates, and bug reports are highly welcome.
1. Fork the codebase repository workspace.
2. Initialize an isolated feature branch (`git checkout -b feature/amazing-feature`).
3. Commit localized code adjustments (`git commit -m 'Add some amazing feature'`).
4. Push updates to your fork remote (`git push origin feature/amazing-feature`).
5. Open an official upstream Pull Request.

---

## 📜 License

This application layout is distributed freely under the open-source **MIT License** terms. You are permitted to reuse, modify, and redistribute the assets provided the original copyright header is preserved.

---

## 📧 Contact & Support

- **Email Support:** saeedbadr112@hotmail.com
- **Developer Profile:** [SaeedBadr112](https://github.com)

---
⭐ **If you like the app, don't forget to star the repository!**
-------------------------------------------------------------------------------------------------------------------------
# 📻 X6 Radio | World Radio Stations

[![Version](https://shields.io)](https://github.com)
[![License](https://shields.io)](LICENSE)
[![Electron](https://shields.io)](https://electronjs.org)

**X6 Radio** هو تطبيق سطح مكتب متقدم للمنصة Windows (Electron) يوفر آلاف المحطات الإذاعية العربية والعالمية، مع مؤثرات صوتية محترفة، تايمر، تسجيل البث المباشر، وواجهة مستخدم حديثة تدعم اللغتين العربية والإنجليزية بشكل كامل.

**X6 Radio** is an advanced desktop application (Electron) for Windows, offering thousands of Arabic and international radio stations with professional audio effects, timer, live recording, and a modern bilingual UI (Arabic/English).

![لقطة واجهة التطبيق](screenshot.png)

---

## ✨ الميزات الرئيسية | Main Features

- 🎙️ **آلاف المحطات الإذاعية** من جميع الدول العربية والعالم، مع إمكانية الإضافة والحذف والاستيراد/التصدير.
- 🌐 **دعم كامل للغتين** العربية (RTL) والإنجليزية (LTR) مع تبديل فوري.
- 🎛️ **مؤثرات صوتية متقدمة**:
  - ضاغط الصوت (Compressor)
  - فصل الاستيريو (يسار / يمين / وسط)
  - تغيير جهاز الإخراج الصوتي (Output Device)
- ⏱️ **مؤقت إيقاف التشغيل** (20, 40, 60, 80 دقيقة) مع عرض الوقت المتبقي.
- ⏫ **مؤقت تصاعدي** (Timer Up) لمعرفة مدة استماعك الحالية.
- 🔴 **تسجيل البث المباشر** وحفظه بصيغة WebM.
- 💾 **سجل الاستماع** (آخر 100 محطة) مع إمكانية البحث والتصدير والمسح التلقائي.
- ❤️ **المفضلة** لحفظ المحطات المفضلة لديك.
- 🔍 **البحث المتقدم**:
  - بحث محلي في المحطات المحملة.
  - بحث عبر **Radio Browser API** (آلاف المحطات الإضافية).
- 🎨 **ثلاثة مظاهر (Themes)**:
  - الوضع الافتراضي (كحلي)
  - الوضع الداكن عالي التباين
  - الوضع الفاتح
  - 🆕 الوضع الأحمر (Red Theme)
- ⌨️ **اختصارات لوحة مفاتيح شاملة** (أكثر من 50 اختصاراً).
- 📦 **تحديث تلقائي** عبر GitHub Releases (باستخدام `electron-updater`).
- 🔧 **وضع مصغر (Compact Mode)** لمشاهدة شريط التشغيل فقط.
- 📁 **استيراد / تصدير** قائمة المحطات (JSON).
- 🖼️ **تغيير أيقونة المحطة** يدوياً (صور من المستخدم).

---

## 📦 متطلبات التشغيل | Requirements

- نظام التشغيل: **Windows 7 / 8 / 10 / 11** (64-bit)
- (اختياري) اتصال بالإنترنت للبحث عبر API وللتحديثات التلقائية.

---

## 🚀 تحميل وتثبيت | Download & Install

يمكنك تحميل أحدث إصدار من [صفحة الإصدارات](https://github.com).

- **`X6 Radio Setup X.X.X.exe`** – المثبت القياسي (NSIS) مع خيار اختيار مجلد التثبيت وإنشاء اختصارات.
- **`X6 Radio X.X.X.exe`** – النسخة المحمولة (Portable) التي لا تحتاج إلى تثبيت.

بعد التثبيت، سيتم إنشاء مجلد `%APPDATA%\X6 Radio` لحفظ التفضيلات والملفات.

---

## 🛠️ بناء التطبيق من المصدر | Build from Source

1. **استنساخ المستودع**
```bash
git clone https://github.com
cd X6-Radio
```

2. **تثبيت الاعتماديات**
```bash
npm install
```

3. **تشغيل وضع التطوير**
```bash
npm start
```

4. **بناء التطبيق للإنتاج**
```bash
npm run dist
```
ستجد ملفات الإخراج في مجلد `dist/`.

---

## ⌨️ أبرز اختصارات لوحة المفاتيح | Key Shortcuts

| الاختصار | الوظيفة |
| :--- | :--- |
| **Ctrl+Shift+1 ... 4** | تعيين مؤقت إيقاف (20-80 دقيقة) |
| **Ctrl+Shift+A / D** | تفعيل / تعطيل التشغيل التلقائي للمحطة الأخيرة |
| **Ctrl+Shift+V / B** | تفعيل / تعطيل المؤثرات البصرية (Visualizer) |
| **Ctrl+Shift+R / U** | إظهار / إخفاء أيقونة التسجيل |
| **Ctrl+Shift+5 ... 8** | تغيير تأخير التشغيل التلقائي (0.5 – 3 ثوانٍ) |
| **Ctrl+Shift+F10 ... F12** | تغيير حجم الخط (صغير – متوسط – كبير) |
| **Ctrl+Shift+F1 ... F4** | تغيير المظهر (افتراضي – داكن – فاتح – أحمر) |
| **Ctrl+Shift+K** | عرض نافذة جميع الاختصارات |
| **Ctrl+Shift+U** | البحث عن تحديثات (في النسخة المثبتة) |
| **Ctrl+Shift+G** | فتح صفحة GitHub (مفتوح المصدر) |
| **Ctrl+P / Space** | تشغيل / إيقاف مؤقت |
| **Ctrl+1 ... 5** | التبديل بين التبويبات (المحطات – المفضلة – البحث – الإضافة – السجل) |
| **Ctrl+O / Shift+O** | فتح رابط بث مباشر (URL) |
| **Ctrl+Q / Ctrl+W** | الخروج من التطبيق |

> لعرض جميع الاختصارات داخل التطبيق: استخدم الاختصار **Ctrl+Shift+K** أو من قائمة مساعدة ← اختصارات لوحة المفاتيح.

---

## 🔄 آلية التحديث التلقائي | Auto Updates

يستخدم التطبيق مكتبة `electron-updater`.
- عند بدء التشغيل، يتحقق من وجود إصدار جديد على GitHub Releases.
- إذا توفر تحديث، سيظهر إشعار للمستخدم ويمكنه تثبيته فوراً (سيتم إعادة تشغيل التطبيق).
- يمكنك أيضاً التحقق يدوياً من خلال مساعدة ← البحث عن تحديثات (**Ctrl+Shift+U**).

*ملاحظة: خاصية التحديث التلقائي تعمل فقط في النسخة المثبتة (Installer)، وليس في النسخة المحمولة أو بيئة التطوير.*

---

## 📄 هيكل المشروع | Project Structure

```text
X6-Radio/
├── main.js                 # عملية Electron الرئيسية
├── preload.js              # Bridge آمن بين العمليات
├── package.json            # إعدادات المشروع والتحديثات
├── src/
│   ├── index.html          # الواجهة الرئيسية
│   ├── style.css           # التنسيقات والثيمات
│   ├── assets/             # أيقونات وأعلام وصور
│   ├── *.js                # جميع ملفات المنطق (appInit, i18n, stations, settings, ...)
│   └── ...
├── dist/                   # مخرجات البناء (يتم إنشاؤها بعد npm run dist)
└── README.md
```

---

## 🤝 المساهمة | Contributing

المشروع مفتوح المصدر تحت رخصة MIT. نرحب بأي مساهمات (تحسينات، إصلاح أخطاء، ترجمات إضافية، إلخ).
1. قم بعمل Fork للمستودع.
2. أنشئ فرعاً جديداً للميزة (`git checkout -b feature/amazing-feature`).
3. قم بعمل Commit للتغييرات (`git commit -m 'Add some amazing feature'`).
4. ادفع إلى الفرع (`git push origin feature/amazing-feature`).
5. افتح طلب سحب (Pull Request).

---

## 📜 الترخيص | License

هذا المشروع مرخص بموجب **MIT License**. يمكنك استخدامه وتعديله وتوزيعه بحرية مع الاحتفاظ بإشعار حقوق الملكية.

---

## 📧 تواصل | Contact

- البريد الإلكتروني: saeedbadr112@hotmail.com
- GitHub: [SaeedBadr112](https://github.com)

---
⭐ **إذا أعجبك التطبيق، لا تنسى وضع نجمة (Star) على المستودع!**
⭐ **If you like the app, don't forget to star the repository!**
