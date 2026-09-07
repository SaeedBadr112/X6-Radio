// الترجمة (i18n)
const translations = {
  ar: {
    app_title: "X6 Radio",
    settings_language_arabic: "عربي",
settings_language_english: "إنجليزي",
settings_language_spanish: "إسباني",
settings_language_french: "فرنسي",
settings_language_german: "ألماني",
settings_language_portuguese: "برتغالي",
    eq_saved_success: "تم الحفظ",
    welcome_title: "🎵 أهلاً بك في تطبيق X6 Radio",
welcome_subtitle: "اختر دولة أو تصنيفاً من القائمة الجانبية لعرض المحطات هنا",
    eq_reset: "إعادة ضبط",
    eq_save_custom: "حفظ مخصص",
    eq_save: "حفظ ",
    eq_apply: "تطبيق",
    tab_eq: "معادل الصوت",
    eq_title: "معادل الصوت المتقدم",
    eq_reset: "إعادة ضبط",
    eq_save_preset: "حفظ الإعداد الحالي",
    eq_preset_label: "الإعدادات المسبقة:",
    eq_apply: "تطبيق",
    eq_reset_done: "✅ تم إعادة ضبط المعادل",
    eq_preset_saved: (name) => `✅ تم حفظ الإعداد المسبق "${name}"`,
    eq_preset_applied: (name) => `✅ تم تطبيق الإعداد المسبق "${name}"`,
    eq_custom_applied: "✅ تم تطبيق الإعداد المخصص",
    audio_preset: "وضع الصوت",
    preset_flat: "قياسى",
    preset_rock: "روك",
    preset_pop: "بوب",
    preset_jazz: "جاز",
    preset_classical: "كلاسيكى",
    preset_dance: "رقص",
    preset_ballad: "بالاد",
    preset_rnb: "ريزم أند بلوز",
    preset_hiphop: "هيب هوب",
    menu_reload: "إعادة ضبط التطبيق",
    loading: "جاري تحميل المحطات...",
    no_stations: "📻 لا توجد محطات",
    no_stations_genre: "📻 لا توجد محطات في هذا التصنيف حالياً.",
    no_stations_country: "📻 لا توجد محطات لهذه الدولة حالياً.",
    no_favorites: "❤️ لا توجد محطات مفضلة. أضف من خلال القلب .",
    no_history: "📋 لا توجد محطات في السجل بعد. استمع إلى أي محطة ستظهر هنا.",
    search_placeholder: "ابحث عن محطة إذاعة، أو مدينة...",
    search_results_for: "نتائج البحث عن:",
    search_empty: "🔍 اكتب كلمة للبحث في جميع المحطات.",
    no_search_results: "⚠️ لا توجد نتائج مطابقة للبحث.",
    add_station_title: "إضافة محطة إذاعية جديدة",
    station_name_label: "اسم المحطة:",
    station_url_label: "رابط البث (URL):",
    country_label: "الدولة:",
    menu_check_for_updates: "البحث عن تحديثات",
    selected: "تم اختيار",
    genre_label: "النوع (اختياري):",
    icon_url_label: "رابط الأيقونة (اختياري):",
    add_button: "إضافة",
    cancel_button: "إلغاء",
    tab_stations: "المحطات",
    tab_favorites: "المفضلة",
    tab_search: "نتائج البحث",
    tab_add_station: "إضافة محطة",
    tab_history: "السجل",
    play: "تشغيل",
    stop: "إيقاف",
    save_to_favorites: "حفظ",
    saved_to_favorites: "تم الحفظ",
    current_station_default: "لم يتم اختيار محطة",
    connecting: "جارٍ الاتصال...",
    stopped_auto: "تم إيقاف البث تلقائياً بعد المدة المحددة",
    timer_set: (minutes) => `تم ضبط إيقاف البث بعد ${minutes} دقيقة`,
    no_active_stream: "لا يوجد بث نشط لتحديد مدة الإيقاف",
    no_station_selected: "لم يتم اختيار محطة للتشغيل",
    playback_failed: "تعذر تشغيل البث - تأكد من الرابط",
    stream_error: "خطأ في البث",
    not_supported: "متصفحك لا يدعم تشغيل هذا النوع",
    hls_error: "فشل تشغيل البث",
    webview_error: "عذراً، لا يدعم التطبيق هذا النوع من البث",
    webview_working: "يعمل الآن (بث مباشر من الموقع)",
    added_to_favorites: "تمت الإضافة إلى المفضلة",
    removed_from_favorites: "تمت الإزالة من المفضلة",
    theme_default: "الافتراضي",
    theme_dark: "داكن (تباين عالٍ)",
    theme_light: "فاتح",
    theme_changed: (theme) => `تم تغيير المظهر إلى ${theme}`,
    menu_file: "ملف",
    menu_open_url: "فتح رابط البث",
    menu_add_station: "إضافة محطة جديدة",
    menu_import: "استيراد المحطات",
    menu_export: "تصدير المحطات",
    menu_exit: "خروج",
    menu_playback: "تشغيل",
    menu_resume: "استئناف",
    menu_stop_after: "إيقاف بعد مدة",
    menu_stop_now: "إيقاف الآن",
    menu_shuffle: "تشغيل عشوائي",
    menu_audio: "صوت",
    menu_compressor: "ضاغط",
    menu_stereo: "فصل ستيريو",
    menu_output: "جهاز إخراج",
    menu_view: "عرض",
    menu_history: "سجل",
    menu_settings: "الإعدادات",
    menu_always_on_top: "دائماً في المقدمة",
    menu_theme: "المظهر",
    menu_close_tab: "إغلاق التبويب الحالي",
    menu_help: "مساعدة",
    menu_shortcuts: "اختصارات لوحة المفاتيح",
    menu_debug: "تصحيح الأخطاء",
    menu_feedback: "إرسال ملاحظات",
    menu_about: "حول",
    menu_license: "الترخيص",
    menu_open_source: "مفتوح المصدر",
    menu_release_notes: "ملاحظات الإصدار",
    menu_hello: "مرحباً",
    settings_auto_resume: "تشغيل تلقائى للمحطة الأخيرة",
    settings_auto_resume_delay: "تأخير التشغيل التلقائي",
    settings_font_size: "حجم الخط",
    settings_language: "اللغة",
    settings_auto_clear_history: "مسح السجل كل 7 أيام",
    settings_visualizer: "مؤثرات الصوت البصرية",
    settings_record_icon: "أيقونة التسجيل",
    history_count: "عدد المحطات:",
    clear_history: "مسح الكل",
    export_history: "تصدير",
    search_history: "بحث في السجل...",
    delete_from_history: "حذف من السجل",
    no_history_filter: (keyword) => `🔍 لا توجد نتائج مطابقة للبحث "${keyword}"`,
    delete_station: "حذف المحطة",
    confirm_delete_station: (name) => `⚠️ هل أنت متأكد من حذف المحطة "${name}" نهائياً؟`,
    station_deleted: "🗑️ تم حذف المحطة بنجاح",
    timer_remaining: (minutes, seconds) => `⏱️ إيقاف بعد ${minutes}:${seconds}`,
    timer_up_format: (hours, minutes, seconds) => `${hours}:${minutes}:${seconds}`,
    recording: "🔴 جاري تسجيل البث...",
    recording_stopped: "✅ تم إيقاف تسجيل البث",
    recording_saved: "📀 تم حفظ التسجيل",
    recording_not_supported: "التسجيل غير مدعوم في هذا المتصفح",
    recording_failed: "فشل بدء التسجيل",
    output_device_changed: (label) => `🔊 تم تغيير جهاز الإخراج إلى: ${label}`,
    output_device_default: "🔊 تم تغيير جهاز الإخراج إلى: النظام الافتراضي",
    output_device_not_supported: "⚠️ ميزة تغيير جهاز الإخراج غير مدعومة في هذا المتصفح.",
    output_device_select: "اختيار جهاز...",
    output_device_selected: "الجهاز المختار",
    output_device_not_selected: "⚠️ لم يتم اختيار أي جهاز إخراج.",
    output_device_select_error: (msg) => `❌ فشل اختيار جهاز الإخراج: ${msg}`,
    output_device_changed_to_selected: "🔊 تم تغيير جهاز الإخراج إلى الجهاز المختار",
    output_device_change_error: (msg) => `❌ فشل تغيير جهاز الإخراج: ${msg}`,
    compressor_on: "✅ تم تفعيل ضاغط الصوت",
    compressor_off: "✅ تم إلغاء ضاغط الصوت",
    compressor_error: "خطأ في الضاغط",
    stereo_left: "🎧 توجيه الصوت إلى اليسار",
    stereo_right: "🎧 توجيه الصوت إلى اليمين",
    stereo_center: "🎵 إلغاء فصل الستيريو",
    stereo_error: "خطأ في الستيريو",
    confirm_clear_history: "⚠️ هل أنت متأكد من مسح سجل الاستماع بالكامل؟ لا يمكن التراجع.",
    confirm_exit: "هل تريد إغلاق التطبيق؟",
    confirm_auto_clear: "تم تفعيل مسح السجل التلقائي. هل تريد مسح السجل القديم الآن؟",
    no_history_to_export: "⚠️ لا يوجد سجل لتصديره",
    history_exported: "📁 تم تصدير السجل بنجاح",
    searching_online: "جاري البحث عبر الإنترنت...",
    opening_source: "🌐 جاري فتح صفحة المصدر المفتوح...",
    always_on_top_set: "تم ضبط النافذة دائماً في المقدمة",
    always_on_top_electron_only: "هذه الميزة تعمل فقط في تطبيق Electron",
    auto_resume_toggled: (status) => `✅ تم ${status === 'enabled' ? 'تفعيل' : 'تعطيل'} التشغيل التلقائي للمحطة الأخيرة`,
    checking_for_updates: "جاري البحث عن تحديثات...",
updates_only_in_production: "⚠️ ميزة البحث عن تحديثات تعمل فقط في النسخة المثبتة من التطبيق",
updates_not_supported: "⚠️ التحديثات غير مدعومة في هذا الإصدار",
    opening_email: "📧 سيتم فتح بريدك الإلكتروني لإرسال الملاحظات",
    version: "الإصدار 2.0.0",
    about_text: "تطبيق راديو متعدد المصادر يدعم المحطات العربية والعالمية، مع مؤثرات صوتية، تايمر، سجل استماع، وواجهة سهلة الاستخدام.\n\nجميع الحقوق محفوظة © 2026 سعيد بدر\nمرخص بموجب رخصة MIT",
    station_added: (name) => `✅ تمت إضافة المحطة: ${name}`,
    stations_imported: (count) => `تم استيراد ${count} محطة.`,
    invalid_file: "⚠️ الملف غير صالح",
    greeting_morning: "صباح الخير",
    greeting_evening: "مساء الخير",
    greeting_night: "مساء الخير",
    thank_you_message: "شكراً لاستخدامك تطبيق X6 Radio.\nنتمنى لك وقتاً ممتعاً مع الموسيقى والإذاعات.",
    genre_variety: "متنوع",
    compact_mode: "وضع مصغر",
    exit_compact_mode: "خروج من المصغر",
    station_name_placeholder: "مثال: إذاعة القرآن الكريم",
    genre_placeholder: "مثل: ديني, موسيقى",
  worldwide: "عالمي",
  // المفاتيح الجديدة لتغيير الأيقونة:
  change_icon: "تغيير الأيقونة",
  icon_changed_success: "✅ تم تغيير الأيقونة بنجاح",
  icon_change_failed: "❌ فشل تغيير الأيقونة",
  icon_file_too_large: "⚠️ حجم الصورة كبير جداً (الحد الأقصى 2 ميغابايت)",
  theme_red: "أحمر",
  search_countries_placeholder: "🔍 بحث عن دولة أو تصنيف...",
  station_not_found: "⚠️ المحطة غير موجودة",
    drawer_file: "ملف",
    drawer_playback: "تشغيل",
    drawer_stop_after: "إيقاف بعد مدة",
    drawer_sound: "صوت",
    drawer_help: "مساعدة",
    drawer_appearance: "المظهر",
    drawer_settings: "الإعدادات",
    drawer_exit: "خروج",
    drawer_version: "الإصدار 2.0.0",
    settings_general: "عام",
    settings_display: "العرض",
    sleep_timer_off: "إيقاف",
    timer_minutes: (m) => `${m} دقيقة`,
    timer_cancel: "إلغاء المؤقت",
    compressor_label: "ضاغط الصوت",
    stereo_label: "فصل ستيريو",
    stereo_btn_center: "وسط",
    stereo_btn_left: "يسار",
    stereo_btn_right: "يمين",
    output_device_label: "جهاز إخراج",
    output_default: "الافتراضي",
    output_other: "جهاز آخر",
    settings_font_large: "كبير",
    settings_font_medium: "متوسط",
    settings_font_small: "صغير",
    settings_lang_ar: "عربي",
    settings_lang_en: "إنجليزي",
    drawer_section_appearance: "التخصيص",
    "search_server_unavailable": "⚠️ تعذر الاتصال بخادم البحث"
  },
  en: {
    app_title: "X6 Radio",
    tab_eq: "Equalizer",
    welcome_title: "🎵 Welcome to X6 Radio",
    welcome_subtitle: "Select a country or category from the sidebar to display stations here",
    eq_title: "Advanced Equalizer",
    eq_reset: "Reset",
    eq_save_preset: "Save Current Preset",
    eq_preset_label: "Presets:",
    eq_apply: "Apply",
    eq_reset_done: "✅ Equalizer reset",
    eq_preset_saved: (name) => `✅ Preset "${name}" saved`,
    eq_preset_applied: (name) => `✅ Preset "${name}" applied`,
    eq_custom_applied: "✅ Custom settings applied",
    audio_preset: "Audio Preset",
    preset_flat: "Flat",
    eq_saved_success: "Saved",
    eq_reset: "Reset",
    eq_save_custom: "Save Custom",
    eq_save: "Save ",
    eq_apply: "Apply",
    preset_rock: "Rock",
    preset_pop: "Pop",
    preset_jazz: "Jazz",
    preset_classical: "Classical",
    preset_dance: "Dance",
    preset_ballad: "Ballad",
    preset_rnb: "R&B",
    preset_hiphop: "Hip Hop",
    loading: "Loading stations...",
    menu_reload: "Reset App",
    no_stations: "📻 No stations available.",
    no_stations_genre: "📻 No stations in this genre currently.",
    no_stations_country: "📻 No stations for this country currently.",
    no_favorites: "❤️ No favorite stations. Add via heart..",
    no_history: "📋 No stations in history yet. Listen to any station and it will appear here.",
    search_placeholder: "Search for a radio station or city...",
    search_countries_placeholder: "🔍 Search for a country or category...",
    search_results_for: "Search results for:",
    search_empty: "🔍 Type a keyword to search all stations.",
    no_search_results: "⚠️ No matching results.",
    add_station_title: "Add New Radio Station",
    station_name_label: "Station Name:",
    station_url_label: "Stream URL:",
    country_label: "Country:",
    genre_label: "Genre (optional):",
    icon_url_label: "Icon URL (optional):",
    add_button: "Add",
    cancel_button: "Cancel",
    tab_stations: "Stations",
    tab_favorites: "Favorites",
    tab_search: "Search Results",
    tab_add_station: "Add Station",
    menu_check_for_updates: "Check for Updates",
    tab_history: "History",
    play: "Play",
    stop: "Stop",
    save_to_favorites: "Save",
    saved_to_favorites: "Saved",
    current_station_default: "No station selected",
    connecting: "Connecting...",
    stopped_auto: "Stream stopped automatically after timer",
    timer_set: (minutes) => `Auto-stop after ${minutes} minutes`,
    no_active_stream: "No active stream to set timer",
    no_station_selected: "No station selected",
    playback_failed: "Failed to play - check the stream URL",
    stream_error: "Stream error",
    not_supported: "Your browser does not support this stream type",
    hls_error: "Failed to play HLS stream",
    webview_error: "Sorry, this stream type is not supported",
    webview_working: "Now playing (live from website)",
    added_to_favorites: "Added to favorites",
    removed_from_favorites: "Removed from favorites",
    theme_default: "Default",
    theme_dark: "Dark (High Contrast)",
    theme_light: "Light",
    theme_changed: (theme) => `Theme changed to ${theme}`,
    menu_file: "File",
    menu_open_url: "Open Stream URL",
    menu_add_station: "Add New Station",
    menu_import: "Import Stations",
    menu_export: "Export Stations",
    menu_exit: "Exit",
    menu_playback: "Playback",
    menu_resume: "Resume",
    menu_stop_after: "Stop after",
    menu_stop_now: "Stop Now",
    menu_shuffle: "Shuffle Play",
    menu_audio: "Audio",
    menu_compressor: "Compressor",
    menu_stereo: "Stereo Separation",
    menu_output: "Output Device",
    menu_view: "View",
    selected: "Selected",
    menu_history: "History",
    menu_settings: "Settings",
    menu_always_on_top: "Always on Top",
    menu_theme: "Theme",
    menu_close_tab: "Close Current Tab",
    menu_help: "Help",
    menu_shortcuts: "Keyboard Shortcuts",
    menu_debug: "Debug Info",
    menu_feedback: "Send Feedback",
    menu_about: "About",
    menu_license: "License",
    menu_open_source: "Open Source",
    menu_release_notes: "Release Notes",
    menu_hello: "Hello",
    theme_red: "Red",
    settings_auto_resume: "Auto-resume last station",
    settings_auto_resume_delay: "Auto-resume delay",
    settings_font_size: "Font size",
    settings_language: "Language",
    settings_auto_clear_history: "Auto-clear history every 7 days",
    settings_visualizer: "Audio visualizer",
    settings_record_icon: "Record icon",
    history_count: "Stations:",
    clear_history: "Clear All",
    export_history: "Export",
    search_history: "Search history...",
    delete_from_history: "Delete from history",
    no_history_filter: (keyword) => `🔍 No results for "${keyword}"`,
    delete_station: "Delete station",
    confirm_delete_station: (name) => `⚠️ Are you sure you want to permanently delete "${name}"?`,
    station_deleted: "🗑️ Station deleted successfully",
    timer_remaining: (minutes, seconds) => `⏱️ Stop after ${minutes}:${seconds}`,
    timer_up_format: (hours, minutes, seconds) => `${hours}:${minutes}:${seconds}`,
    recording: "🔴 Recording stream...",
    recording_stopped: "✅ Recording stopped",
    recording_saved: "📀 Recording saved",
    recording_not_supported: "Recording not supported in this browser",
    recording_failed: "Failed to start recording",
    output_device_changed: (label) => `🔊 Output device changed to: ${label}`,
    output_device_default: "🔊 Output device changed to: System Default",
    output_device_not_supported: "⚠️ Output device selection not supported in this browser.",
    output_device_select: "Select device...",
    output_device_selected: "selected device",
    output_device_not_selected: "⚠️ No output device selected.",
    output_device_select_error: (msg) => `❌ Failed to select output device: ${msg}`,
    output_device_changed_to_selected: "🔊 Output device changed to selected device",
    output_device_change_error: (msg) => `❌ Failed to change output device: ${msg}`,
    compressor_on: "✅ Compressor enabled",
    compressor_off: "✅ Compressor disabled",
    compressor_error: "Compressor error",
    stereo_left: "🎧 Audio left channel only",
    stereo_right: "🎧 Audio right channel only",
    stereo_center: "🎵 Stereo restored",
    stereo_error: "Stereo error",
    confirm_clear_history: "⚠️ Are you sure you want to clear all history? This cannot be undone.",
    confirm_exit: "Do you want to close the application?",
    confirm_auto_clear: "Auto-clear history enabled. Do you want to clear old history now?",
    no_history_to_export: "⚠️ No history to export",
    history_exported: "📁 History exported successfully",
    searching_online: "Searching online...",
    opening_source: "🌐 Opening open source page...",
    always_on_top_set: "Window set to always on top",
    always_on_top_electron_only: "This feature only works in Electron app",
    auto_resume_toggled: (status) => `✅ Auto-resume ${status === 'enabled' ? 'enabled' : 'disabled'}`,
    opening_email: "📧 Opening your email client to send feedback",
    version: "Version 2.0.0",
    about_text: "Multi-source radio app supporting Arabic and international stations, with audio effects, timer, listening history, and easy-to-use interface.\n\nAll rights reserved © 2026 Saeed Badr\nLicensed under MIT License",
    station_added: (name) => `✅ Station added: ${name}`,
    stations_imported: (count) => `Imported ${count} stations.`,
    invalid_file: "⚠️ Invalid file",
    greeting_morning: "Good morning",
    greeting_evening: "Good evening",
    greeting_night: "Good evening",
    thank_you_message: "Thank you for using X6 Radio.\nEnjoy your music and radio stations.",
    checking_for_updates: "Checking for updates...",
updates_only_in_production: "⚠️ Update check feature works only in the installed version of the app",
updates_not_supported: "⚠️ Updates not supported in this version",
    genre_variety: "Variety",
    compact_mode: "Compact Mode",
    exit_compact_mode: "Exit Compact Mode",
    station_name_placeholder: "e.g., BBC Radio",
    genre_placeholder: "e.g., Religious, Music",
  worldwide: "Worldwide",
  // New keys for changing icon:
  change_icon: "Change Icon",
  icon_changed_success: "✅ Icon changed successfully",
  icon_change_failed: "❌ Failed to change icon",
  icon_file_too_large: "⚠️ Image file too large (max 2 MB)",
  station_not_found: "⚠️ Station not found",
  drawer_file: "File",
  drawer_playback: "Playback",
  drawer_stop_after: "Stop after",
  drawer_sound: "Sound",
  drawer_help: "Help",
  drawer_appearance: "Appearance",
  drawer_settings: "Settings",
  drawer_exit: "Exit",
  drawer_version: "Version 2.0.0",
  settings_general: "General",
  settings_display: "Display",
  sleep_timer_off: "Off",
  timer_minutes: (m) => `${m} min`,
  timer_cancel: "Cancel timer",
  compressor_label: "Compressor",
  stereo_label: "Stereo Separation",
  stereo_btn_center: "Center",
  stereo_btn_left: "Left",
  stereo_btn_right: "Right",
  output_device_label: "Output Device",
  output_default: "Default",
  output_other: "Other Device",
  settings_font_large: "Large",
  settings_font_medium: "Medium",
  settings_font_small: "Small",
  settings_lang_ar: "Arabic",
  settings_lang_en: "English",
  drawer_section_appearance: "Customize",
  "search_server_unavailable": "⚠️ Search server unavailable"
  },
 es: {
    app_title: "X6 Radio",
    tab_eq: "Ecualizador",
    countries_title: "Países y principales estaciones mundiales",
    categories_title: "📂 Categorías",
    history_count_label: "Estaciones:",
    welcome_title: "🎵 Bienvenido a X6 Radio",
    welcome_subtitle: "Selecciona un país o categoría en la barra lateral para ver las emisoras aquí",
    eq_title: "Ecualizador avanzado",
    eq_reset: "Restablecer",
    eq_save_preset: "Guardar ajuste actual",
    eq_preset_label: "Preajustes:",
    eq_apply: "Aplicar",
    eq_reset_done: "✅ Ecualizador restablecido",
    eq_preset_saved: (name) => `✅ Preajuste "${name}" guardado`,
    eq_preset_applied: (name) => `✅ Preajuste "${name}" aplicado`,
    eq_custom_applied: "✅ Ajustes personalizados aplicados",
    audio_preset: "Preajuste de audio",
    preset_flat: "Plano",
    eq_saved_success: "Guardado",
    eq_save_custom: "Guardar personalizado",
    eq_save: "Guardar ",
    preset_rock: "Rock",
    preset_pop: "Pop",
    preset_jazz: "Jazz",
    preset_classical: "Clásico",
    preset_dance: "Dance",
    preset_ballad: "Balada",
    preset_rnb: "R&B",
    preset_hiphop: "Hip Hop",
    loading: "Cargando emisoras...",
    menu_reload: "Restablecer aplicación",
    no_stations: "📻 No hay emisoras disponibles.",
    no_stations_genre: "📻 No hay emisoras en este género actualmente.",
    no_stations_country: "📻 No hay emisoras para este país actualmente.",
    no_favorites: "❤️ No hay emisoras favoritas. Añade una tocando la estrella.",
    no_history: "📋 Aún no hay emisoras en el historial. Escucha una emisora y aparecerá aquí.",
    search_placeholder: "Buscar una emisora de radio o ciudad...",
    search_countries_placeholder: "🔍 Buscar un país o categoría...",
    search_results_for: "Resultados de búsqueda para:",
    search_empty: "🔍 Escribe una palabra clave para buscar en todas las emisoras.",
    no_search_results: "⚠️ No se encontraron resultados.",
    add_station_title: "Añadir nueva emisora de radio",
    station_name_label: "Nombre de la emisora:",
    station_url_label: "URL de transmisión:",
    country_label: "País:",
    genre_label: "Género (opcional):",
    icon_url_label: "URL del icono (opcional):",
    add_button: "Añadir",
    cancel_button: "Cancelar",
    tab_stations: "Emisoras",
    tab_favorites: "Favoritas",
    tab_search: "Buscar",
    tab_add_station: "Emisora",
    menu_check_for_updates: "Buscar actualizaciones",
    tab_history: "Historial",
    play: "Reproducir",
    stop: "Detener",
    save_to_favorites: "Guardar",
    saved_to_favorites: "Guardado",
    current_station_default: "Ninguna emisora seleccionada",
    connecting: "Conectando...",
    stopped_auto: "La transmisión se detuvo automáticamente tras el temporizador",
    timer_set: (minutes) => `Detención automática en ${minutes} minutos`,
    no_active_stream: "No hay ninguna transmisión activa para configurar el temporizador",
    no_station_selected: "No se ha seleccionado ninguna emisora",
    playback_failed: "No se pudo reproducir. Verifica la URL de la transmisión",
    stream_error: "Error de transmisión",
    not_supported: "Tu navegador no admite este tipo de transmisión",
    hls_error: "Error al reproducir la transmisión HLS",
    webview_error: "Lo sentimos, este tipo de transmisión no es compatible",
    webview_working: "Reproduciendo ahora (en vivo desde el sitio web)",
    added_to_favorites: "Añadido a favoritas",
    removed_from_favorites: "Eliminado de favoritas",
    theme_default: "Predeterminado",
    theme_dark: "Oscuro (alto contraste)",
    theme_light: "Claro",
    theme_changed: (theme) => `Tema cambiado a ${theme}`,
    menu_file: "Archivo",
    menu_open_url: "Abrir URL de transmisión",
    menu_add_station: "Añadir nueva emisora",
    menu_import: "Importar emisoras",
    menu_export: "Exportar emisoras",
    menu_exit: "Salir",
    menu_playback: "Reproducción",
    menu_resume: "Reanudar",
    menu_stop_after: "Detener después de",
    menu_stop_now: "Detener ahora",
    menu_shuffle: "Reproducción aleatoria",
    menu_audio: "Audio",
    menu_compressor: "Compresor",
    menu_stereo: "Separación estéreo",
    menu_output: "Dispositivo de salida",
    menu_view: "Ver",
    selected: "Seleccionado",
    menu_history: "Historial",
    menu_settings: "Configuración",
    menu_always_on_top: "Siempre visible",
    menu_theme: "Tema",
    menu_close_tab: "Cerrar pestaña actual",
    menu_help: "Ayuda",
    menu_shortcuts: "Atajos de teclado",
    menu_debug: "Información de depuración",
    menu_feedback: "Enviar comentarios",
    menu_about: "Acerca de",
    menu_license: "Licencia",
    menu_open_source: "Código abierto",
    menu_release_notes: "Notas de la versión",
    menu_hello: "Hola",
    theme_red: "Rojo",
    settings_auto_resume: "Reanudar última emisora automáticamente",
    settings_auto_resume_delay: "Retraso de reanudación automática",
    settings_font_size: "Tamaño de fuente",
    settings_language: "Idioma",
    settings_auto_clear_history: "Borrar historial cada 7 días",
    settings_visualizer: "Efectos visuales de audio",
    settings_record_icon: "Icono de grabación",
    history_count: "Emisoras:",
    clear_history: "Borrar todo",
    export_history: "Exportar",
    search_history: "Buscar en el historial...",
    delete_from_history: "Eliminar del historial",
    no_history_filter: (keyword) => `🔍 No hay resultados para "${keyword}"`,
    delete_station: "Eliminar emisora",
    confirm_delete_station: (name) => `⚠️ ¿Seguro que deseas eliminar permanentemente "${name}"?`,
    station_deleted: "🗑️ Emisora eliminada con éxito",
    timer_remaining: (minutes, seconds) => `⏱️ Detener en ${minutes}:${seconds}`,
    timer_up_format: (hours, minutes, seconds) => `${hours}:${minutes}:${seconds}`,
    recording: "🔴 Grabando transmisión...",
    recording_stopped: "✅ Grabación detenida",
    recording_saved: "📀 Grabación guardada",
    recording_not_supported: "La grabación no es compatible con este navegador",
    recording_failed: "No se pudo iniciar la grabación",
    output_device_changed: (label) => `🔊 Dispositivo de salida cambiado a: ${label}`,
    output_device_default: "🔊 Dispositivo de salida cambiado a: Predeterminado del sistema",
    output_device_not_supported: "⚠️ La selección de dispositivo de salida no es compatible con este navegador.",
    output_device_select: "Seleccionar dispositivo...",
    output_device_selected: "dispositivo seleccionado",
    output_device_not_selected: "⚠️ No se ha seleccionado ningún dispositivo de salida.",
    output_device_select_error: (msg) => `❌ Error al seleccionar el dispositivo de salida: ${msg}`,
    output_device_changed_to_selected: "🔊 Dispositivo de salida cambiado al dispositivo seleccionado",
    output_device_change_error: (msg) => `❌ Error al cambiar el dispositivo de salida: ${msg}`,
    compressor_on: "✅ Compresor activado",
    compressor_off: "✅ Compresor desactivado",
    compressor_error: "Error del compresor",
    stereo_left: "🎧 Audio solo canal izquierdo",
    stereo_right: "🎧 Audio solo canal derecho",
    stereo_center: "🎵 Estéreo restaurado",
    stereo_error: "Error de estéreo",
    confirm_clear_history: "⚠️ ¿Seguro que deseas borrar todo el historial? Esta acción no se puede deshacer.",
    confirm_exit: "¿Deseas cerrar la aplicación?",
    confirm_auto_clear: "Se activó el borrado automático del historial. ¿Deseas borrar el historial antiguo ahora?",
    no_history_to_export: "⚠️ No hay historial para exportar",
    history_exported: "📁 Historial exportado con éxito",
    searching_online: "Buscando en línea...",
    opening_source: "🌐 Abriendo página de código abierto...",
    always_on_top_set: "Ventana configurada para estar siempre visible",
    always_on_top_electron_only: "Esta función solo funciona en la aplicación Electron",
    auto_resume_toggled: (status) => `✅ Reanudación automática ${status === 'enabled' ? 'activada' : 'desactivada'}`,
    opening_email: "📧 Se abrirá tu cliente de correo para enviar comentarios",
    version: "Versión 2.0.0",
    about_text: "Aplicación de radio multiplataforma que admite emisoras árabes e internacionales, con efectos de audio, temporizador, historial de escucha e interfaz fácil de usar.\n\nTodos los derechos reservados © 2026 Saeed Badr\nBajo licencia MIT",
    station_added: (name) => `✅ Emisora añadida: ${name}`,
    stations_imported: (count) => `Se importaron ${count} emisoras.`,
    invalid_file: "⚠️ Archivo no válido",
    greeting_morning: "Buenos días",
    greeting_evening: "Buenas tardes",
    greeting_night: "Buenas noches",
    thank_you_message: "Gracias por usar X6 Radio.\nEsperamos que disfrutes de la música y las emisoras de radio.",
    checking_for_updates: "Buscando actualizaciones...",
    updates_only_in_production: "⚠️ La función de búsqueda de actualizaciones solo funciona en la versión instalada de la aplicación",
    updates_not_supported: "⚠️ Las actualizaciones no son compatibles con esta versión",
    genre_variety: "Variado",
    compact_mode: "Modo compacto",
    exit_compact_mode: "Salir del modo compacto",
    station_name_placeholder: "ej., Radio BBC",
    genre_placeholder: "ej., Religioso, Música",
    worldwide: "Mundial",
    change_icon: "Cambiar icono",
    icon_changed_success: "✅ Icono cambiado con éxito",
    icon_change_failed: "❌ Error al cambiar el icono",
    icon_file_too_large: "⚠️ La imagen es demasiado grande (máx. 2 MB)",
    station_not_found: "⚠️ Emisora no encontrada",
  // ===== Nuevas claves =====
  confirm_reset_app: "⚠️ ¿Estás seguro de que quieres restablecer la aplicación por completo? Se eliminarán todos los datos (favoritos, historial, configuraciones).",
  update_available: "📢 ¡Nueva actualización disponible! Descargando...",
  update_downloaded: "Actualización descargada. ¿Reiniciar ahora para instalar?",
  no_updates: "✅ No hay actualizaciones disponibles. Estás usando la última versión.",
  update_check_error: "❌ Error al buscar actualizaciones. Verifica tu conexión a Internet.",
  preset_custom: "Personalizado",
  eq_enabled: "✅ Ecualizador activado",
  eq_disabled: "⛔ Ecualizador desactivado",
  always_on_top_enabled: "✅ Siempre visible activado",
  always_on_top_disabled: "✅ Siempre visible desactivado",
  repair_url: "Reparar URL",
  testing_url: (index, total) => `🧪 Probando URL ${index} de ${total}...`,
  searching_alternative_url: (name) => `🔍 Buscando una URL alternativa para «${name}»...`,
  url_repaired_success: (name) => `✅ URL reparada con éxito para «${name}»`,
  url_working_correctly: (name) => `✅ La URL de «${name}» funciona correctamente`,
  no_working_alternative_url: "❌ No se encontró ninguna URL alternativa que funcione",
  failed_to_find_alternative_url: "❌ Error al buscar una URL alternativa",
  auto_resume_playing: "🔄 Reanudar automáticamente",
  settings_enabled: "Activado",
  settings_disabled: "Desactivado",
  settings_seconds: "seg",
  settings_visible: "Visible",
  settings_hidden: "Oculto",
  settings_language_arabic: "Árabe",
  settings_language_english: "Inglés",
  settings_language_spanish: "Español",
  settings_language_french: "Francés",
  settings_language_german: "Alemán",
drawer_file: "Archivo",
drawer_playback: "Reproducción",
drawer_stop_after: "Detener después",
drawer_sound: "Sonido",
drawer_help: "Ayuda",
drawer_appearance: "Apariencia",
drawer_settings: "Configuración",
drawer_exit: "Salir",
drawer_version: "Versión 2.0.0",
drawer_section_appearance: "Personalizar",
settings_general: "General",
settings_display: "Pantalla",
sleep_timer_off: "Apagado",
timer_minutes: (m) => `${m} min`,
timer_cancel: "Cancelar temporizador",
compressor_label: "Compresor",
stereo_label: "Separación estéreo",
stereo_btn_center: "Centro",
stereo_btn_left: "Izquierda",
stereo_btn_right: "Derecha",
output_device_label: "Dispositivo de salida",
output_default: "Predeterminado",
output_other: "Otro dispositivo",
settings_font_large: "Grande",
settings_font_medium: "Mediano",
settings_font_small: "Pequeño",
settings_lang_ar: "Árabe",
settings_lang_en: "Inglés",
  settings_language_portuguese: "Portugués",
"search_server_unavailable": "⚠️ Servidor de búsqueda no disponible"
  },
  fr: {
    app_title: "X6 Radio",
    tab_eq: "Égaliseur",
    countries_title: "Pays et principales stations mondiales",
    categories_title: "📂 Catégories",
    history_count_label: "Stations:",
    welcome_title: "🎵 Bienvenue sur X6 Radio",
    welcome_subtitle: "Sélectionnez un pays ou une catégorie dans la barre latérale pour afficher les stations ici",
    eq_title: "Égaliseur avancé",
    eq_reset: "Réinitialiser",
    eq_save_preset: "Enregistrer le préréglage actuel",
    eq_preset_label: "Préréglages :",
    eq_apply: "Appliquer",
    eq_reset_done: "✅ Égaliseur réinitialisé",
    eq_preset_saved: (name) => `✅ Préréglage "${name}" enregistré`,
    eq_preset_applied: (name) => `✅ Préréglage "${name}" appliqué`,
    eq_custom_applied: "✅ Réglages personnalisés appliqués",
    audio_preset: "Préréglage audio",
    preset_flat: "Neutre",
    eq_saved_success: "Enregistré",
    eq_save_custom: "Enregistrer personnalisé",
    eq_save: "Enregistrer ",
    preset_rock: "Rock",
    preset_pop: "Pop",
    preset_jazz: "Jazz",
    preset_classical: "Classique",
    preset_dance: "Dance",
    preset_ballad: "Ballade",
    preset_rnb: "R&B",
    preset_hiphop: "Hip Hop",
    loading: "Chargement des stations...",
    menu_reload: "Réinitialiser l'application",
    no_stations: "📻 Aucune station disponible.",
    no_stations_genre: "📻 Aucune station dans ce genre actuellement.",
    no_stations_country: "📻 Aucune station pour ce pays actuellement.",
    no_favorites: "❤️ Aucune station favorite. Ajoutez-en une en cliquant sur l'étoile.",
    no_history: "📋 Aucune station dans l'historique pour l'instant. Écoutez une station et elle apparaîtra ici.",
    search_placeholder: "Rechercher une station de radio ou une ville...",
    search_countries_placeholder: "🔍 Rechercher un pays ou une catégorie...",
    search_results_for: "Résultats de recherche pour :",
    search_empty: "🔍 Tapez un mot-clé pour rechercher dans toutes les stations.",
    no_search_results: "⚠️ Aucun résultat correspondant.",
    add_station_title: "Ajouter une nouvelle station de radio",
    station_name_label: "Nom de la station :",
    station_url_label: "URL du flux :",
    country_label: "Pays :",
    genre_label: "Genre (facultatif) :",
    icon_url_label: "URL de l'icône (facultatif) :",
    add_button: "Ajouter",
    cancel_button: "Annuler",
    tab_stations: "Stations",
    tab_favorites: "Favoris",
    tab_search: "Recherche",
    tab_add_station: "Station",
    menu_check_for_updates: "Vérifier les mises à jour",
    tab_history: "Historique",
    play: "Lecture",
    stop: "Arrêt",
    save_to_favorites: "Enregistrer",
    saved_to_favorites: "Enregistré",
    current_station_default: "Aucune station sélectionnée",
    connecting: "Connexion...",
    stopped_auto: "Flux arrêté automatiquement après la minuterie",
    timer_set: (minutes) => `Arrêt automatique après ${minutes} minutes`,
    no_active_stream: "Aucun flux actif pour définir une minuterie",
    no_station_selected: "Aucune station sélectionnée",
    playback_failed: "Échec de la lecture - vérifiez l'URL du flux",
    stream_error: "Erreur de flux",
    not_supported: "Votre navigateur ne prend pas en charge ce type de flux",
    hls_error: "Échec de la lecture du flux HLS",
    webview_error: "Désolé, ce type de flux n'est pas pris en charge",
    webview_working: "Lecture en cours (en direct depuis le site web)",
    added_to_favorites: "Ajouté aux favoris",
    removed_from_favorites: "Retiré des favoris",
    theme_default: "Par défaut",
    theme_dark: "Sombre (contraste élevé)",
    theme_light: "Clair",
    theme_changed: (theme) => `Thème changé en ${theme}`,
    menu_file: "Fichier",
    menu_open_url: "Ouvrir l'URL du flux",
    menu_add_station: "Ajouter une nouvelle station",
    menu_import: "Importer des stations",
    menu_export: "Exporter des stations",
    menu_exit: "Quitter",
    menu_playback: "Lecture",
    menu_resume: "Reprendre",
    menu_stop_after: "Arrêter après",
    menu_stop_now: "Arrêter maintenant",
    menu_shuffle: "Lecture aléatoire",
    menu_audio: "Audio",
    menu_compressor: "Compresseur",
    menu_stereo: "Séparation stéréo",
    menu_output: "Périphérique de sortie",
    menu_view: "Affichage",
    selected: "Sélectionné",
    menu_history: "Historique",
    menu_settings: "Paramètres",
    menu_always_on_top: "Toujours au premier plan",
    menu_theme: "Thème",
    menu_close_tab: "Fermer l'onglet actuel",
    menu_help: "Aide",
    menu_shortcuts: "Raccourcis clavier",
    menu_debug: "Infos de débogage",
    menu_feedback: "Envoyer des commentaires",
    menu_about: "À propos",
    menu_license: "Licence",
    menu_open_source: "Open Source",
    menu_release_notes: "Notes de version",
    menu_hello: "Bonjour",
    theme_red: "Rouge",
    settings_auto_resume: "Reprendre automatiquement la dernière station",
    settings_auto_resume_delay: "Délai de reprise automatique",
    settings_font_size: "Taille de police",
    settings_language: "Langue",
    settings_auto_clear_history: "Effacer l'historique tous les 7 jours",
    settings_visualizer: "Effets visuels audio",
    settings_record_icon: "Icône d'enregistrement",
    history_count: "Stations :",
    clear_history: "Tout effacer",
    export_history: "Exporter",
    search_history: "Rechercher dans l'historique...",
    delete_from_history: "Supprimer de l'historique",
    no_history_filter: (keyword) => `🔍 Aucun résultat pour "${keyword}"`,
    delete_station: "Supprimer la station",
    confirm_delete_station: (name) => `⚠️ Voulez-vous vraiment supprimer définitivement "${name}" ?`,
    station_deleted: "🗑️ Station supprimée avec succès",
    timer_remaining: (minutes, seconds) => `⏱️ Arrêt dans ${minutes}:${seconds}`,
    timer_up_format: (hours, minutes, seconds) => `${hours}:${minutes}:${seconds}`,
    recording: "🔴 Enregistrement du flux...",
    recording_stopped: "✅ Enregistrement arrêté",
    recording_saved: "📀 Enregistrement sauvegardé",
    recording_not_supported: "L'enregistrement n'est pas pris en charge par ce navigateur",
    recording_failed: "Échec du démarrage de l'enregistrement",
    output_device_changed: (label) => `🔊 Périphérique de sortie changé pour : ${label}`,
    output_device_default: "🔊 Périphérique de sortie changé pour : Système par défaut",
    output_device_not_supported: "⚠️ La sélection du périphérique de sortie n'est pas prise en charge par ce navigateur.",
    output_device_select: "Sélectionner un périphérique...",
    output_device_selected: "périphérique sélectionné",
    output_device_not_selected: "⚠️ Aucun périphérique de sortie sélectionné.",
    output_device_select_error: (msg) => `❌ Échec de la sélection du périphérique de sortie : ${msg}`,
    output_device_changed_to_selected: "🔊 Périphérique de sortie changé pour le périphérique sélectionné",
    output_device_change_error: (msg) => `❌ Échec du changement de périphérique de sortie : ${msg}`,
    compressor_on: "✅ Compresseur activé",
    compressor_off: "✅ Compresseur désactivé",
    compressor_error: "Erreur du compresseur",
    stereo_left: "🎧 Audio canal gauche uniquement",
    stereo_right: "🎧 Audio canal droit uniquement",
    stereo_center: "🎵 Stéréo restaurée",
    stereo_error: "Erreur stéréo",
    confirm_clear_history: "⚠️ Voulez-vous vraiment effacer tout l'historique ? Cette action est irréversible.",
    confirm_exit: "Voulez-vous fermer l'application ?",
    confirm_auto_clear: "L'effacement automatique de l'historique est activé. Voulez-vous effacer l'ancien historique maintenant ?",
    no_history_to_export: "⚠️ Aucun historique à exporter",
    history_exported: "📁 Historique exporté avec succès",
    searching_online: "Recherche en ligne...",
    opening_source: "🌐 Ouverture de la page open source...",
    always_on_top_set: "Fenêtre définie pour rester toujours au premier plan",
    always_on_top_electron_only: "Cette fonctionnalité ne fonctionne que dans l'application Electron",
    auto_resume_toggled: (status) => `✅ Reprise automatique ${status === 'enabled' ? 'activée' : 'désactivée'}`,
    opening_email: "📧 Votre client de messagerie va s'ouvrir pour envoyer vos commentaires",
    version: "Version 2.0.0",
    about_text: "Application radio multi-sources prenant en charge les stations arabes et internationales, avec effets audio, minuterie, historique d'écoute et interface facile à utiliser.\n\nTous droits réservés © 2026 Saeed Badr\nSous licence MIT",
    station_added: (name) => `✅ Station ajoutée : ${name}`,
    stations_imported: (count) => `${count} stations importées.`,
    invalid_file: "⚠️ Fichier invalide",
    greeting_morning: "Bonjour",
    greeting_evening: "Bonsoir",
    greeting_night: "Bonsoir",
    thank_you_message: "Merci d'utiliser X6 Radio.\nProfitez bien de la musique et des stations de radio.",
    checking_for_updates: "Recherche de mises à jour...",
    updates_only_in_production: "⚠️ La fonction de recherche de mises à jour ne fonctionne que dans la version installée de l'application",
    updates_not_supported: "⚠️ Les mises à jour ne sont pas prises en charge dans cette version",
    genre_variety: "Varié",
    compact_mode: "Mode compact",
    exit_compact_mode: "Quitter le mode compact",
    station_name_placeholder: "ex. : BBC Radio",
    genre_placeholder: "ex. : Religieux, Musique",
    worldwide: "Mondial",
    change_icon: "Changer l'icône",
    icon_changed_success: "✅ Icône changée avec succès",
    icon_change_failed: "❌ Échec du changement d'icône",
    icon_file_too_large: "⚠️ Image trop volumineuse (max 2 Mo)",
    station_not_found: "⚠️ Station introuvable",
  // ===== Nouvelles clés =====
  confirm_reset_app: "⚠️ Voulez-vous vraiment réinitialiser complètement l'application ? Toutes les données (favoris, historique, paramètres) seront supprimées.",
  update_available: "📢 Une nouvelle mise à jour est disponible ! Téléchargement...",
  update_downloaded: "Mise à jour téléchargée. Redémarrer maintenant pour installer ?",
  no_updates: "✅ Aucune mise à jour disponible. Vous utilisez la dernière version.",
  update_check_error: "❌ Échec de la recherche de mises à jour. Vérifiez votre connexion Internet.",
  preset_custom: "Personnalisé",
  eq_enabled: "✅ Égaliseur activé",
  eq_disabled: "⛔ Égaliseur désactivé",
  always_on_top_enabled: "✅ Toujours au premier plan activé",
  always_on_top_disabled: "✅ Toujours au premier plan désactivé",
  repair_url: "Réparer l'URL",
  testing_url: (index, total) => `🧪 Test de l'URL ${index} sur ${total}...`,
  searching_alternative_url: (name) => `🔍 Recherche d'une URL alternative pour «${name}»...`,
  url_repaired_success: (name) => `✅ URL réparée avec succès pour «${name}»`,
  url_working_correctly: (name) => `✅ L'URL de «${name}» fonctionne correctement`,
  no_working_alternative_url: "❌ Aucune URL alternative fonctionnelle trouvée",
  failed_to_find_alternative_url: "❌ Échec de la recherche d'une URL alternative",
  auto_resume_playing: "🔄 Reprise automatique",
  settings_enabled: "Activé",
  settings_disabled: "Désactivé",
  settings_seconds: "sec",
  settings_visible: "Visible",
  settings_hidden: "Caché",
  settings_language_arabic: "Arabe",
  settings_language_english: "Anglais",
  settings_language_spanish: "Espagnol",
  settings_language_french: "Français",
  settings_language_german: "Allemand",
  settings_language_portuguese: "Portugais",
drawer_file: "Fichier",
drawer_playback: "Lecture",
drawer_stop_after: "Arrêter après",
drawer_sound: "Son",
drawer_help: "Aide",
drawer_appearance: "Apparence",
drawer_settings: "Paramètres",
drawer_exit: "Quitter",
drawer_version: "Version 2.0.0",
drawer_section_appearance: "Personnaliser",
settings_general: "Général",
settings_display: "Affichage",
sleep_timer_off: "Arrêt",
timer_minutes: (m) => `${m} min`,
timer_cancel: "Annuler la minuterie",
compressor_label: "Compresseur",
stereo_label: "Séparation stéréo",
stereo_btn_center: "Centre",
stereo_btn_left: "Gauche",
stereo_btn_right: "Droite",
output_device_label: "Périphérique de sortie",
output_default: "Par défaut",
output_other: "Autre périphérique",
settings_font_large: "Grand",
settings_font_medium: "Moyen",
settings_font_small: "Petit",
settings_lang_ar: "Arabe",
settings_lang_en: "Anglais",
"search_server_unavailable": "⚠️ Serveur de recherche indisponible"
  },
  de: {
    app_title: "X6 Radio",
    tab_eq: "Equalizer",
    countries_title: "Länder und wichtige Weltstationen",
    categories_title: "📂 Kategorien",
    history_count_label: "Sender:",
    welcome_title: "🎵 Willkommen bei X6 Radio",
    welcome_subtitle: "Wähle ein Land oder eine Kategorie in der Seitenleiste, um hier Sender anzuzeigen",
    eq_title: "Erweiterter Equalizer",
    eq_reset: "Zurücksetzen",
    eq_save_preset: "Aktuelle Voreinstellung speichern",
    eq_preset_label: "Voreinstellungen:",
    eq_apply: "Anwenden",
    eq_reset_done: "✅ Equalizer zurückgesetzt",
    eq_preset_saved: (name) => `✅ Voreinstellung "${name}" gespeichert`,
    eq_preset_applied: (name) => `✅ Voreinstellung "${name}" angewendet`,
    eq_custom_applied: "✅ Benutzerdefinierte Einstellungen angewendet",
    audio_preset: "Audio-Voreinstellung",
    preset_flat: "Neutral",
    eq_saved_success: "Gespeichert",
    eq_save_custom: "Benutzerdefiniert speichern",
    eq_save: "Speichern ",
    preset_rock: "Rock",
    preset_pop: "Pop",
    preset_jazz: "Jazz",
    preset_classical: "Klassik",
    preset_dance: "Dance",
    preset_ballad: "Ballade",
    preset_rnb: "R&B",
    preset_hiphop: "Hip-Hop",
    loading: "Sender werden geladen...",
    menu_reload: "App zurücksetzen",
    no_stations: "📻 Keine Sender verfügbar.",
    no_stations_genre: "📻 Derzeit keine Sender in diesem Genre.",
    no_stations_country: "📻 Derzeit keine Sender für dieses Land.",
    no_favorites: "❤️ Keine favorisierten Sender. Füge einen hinzu, indem du auf den Stern klickst.",
    no_history: "📋 Noch keine Sender im Verlauf. Höre einen Sender an und er erscheint hier.",
    search_placeholder: "Nach einem Radiosender oder einer Stadt suchen...",
    search_countries_placeholder: "🔍 Nach einem Land oder einer Kategorie suchen...",
    search_results_for: "Suchergebnisse für:",
    search_empty: "🔍 Gib ein Stichwort ein, um alle Sender zu durchsuchen.",
    no_search_results: "⚠️ Keine passenden Ergebnisse.",
    add_station_title: "Neuen Radiosender hinzufügen",
    station_name_label: "Sendername:",
    station_url_label: "Stream-URL:",
    country_label: "Land:",
    genre_label: "Genre (optional):",
    icon_url_label: "Symbol-URL (optional):",
    add_button: "Hinzufügen",
    cancel_button: "Abbrechen",
    tab_stations: "Sender",
    tab_favorites: "Favoriten",
    tab_search: "Suchen",
    tab_add_station: "Sender",
    menu_check_for_updates: "Nach Updates suchen",
    tab_history: "Verlauf",
    play: "Abspielen",
    stop: "Stopp",
    save_to_favorites: "Speichern",
    saved_to_favorites: "Gespeichert",
    current_station_default: "Kein Sender ausgewählt",
    connecting: "Verbindung wird hergestellt...",
    stopped_auto: "Stream nach Ablauf des Timers automatisch gestoppt",
    timer_set: (minutes) => `Automatischer Stopp nach ${minutes} Minuten`,
    no_active_stream: "Kein aktiver Stream, um einen Timer festzulegen",
    no_station_selected: "Kein Sender ausgewählt",
    playback_failed: "Wiedergabe fehlgeschlagen - Stream-URL überprüfen",
    stream_error: "Stream-Fehler",
    not_supported: "Dein Browser unterstützt diesen Stream-Typ nicht",
    hls_error: "HLS-Stream konnte nicht wiedergegeben werden",
    webview_error: "Entschuldigung, dieser Stream-Typ wird nicht unterstützt",
    webview_working: "Wird jetzt wiedergegeben (live von der Website)",
    added_to_favorites: "Zu Favoriten hinzugefügt",
    removed_from_favorites: "Aus Favoriten entfernt",
    theme_default: "Standard",
    theme_dark: "Dunkel (hoher Kontrast)",
    theme_light: "Hell",
    theme_changed: (theme) => `Design geändert zu ${theme}`,
    menu_file: "Datei",
    menu_open_url: "Stream-URL öffnen",
    menu_add_station: "Neuen Sender hinzufügen",
    menu_import: "Sender importieren",
    menu_export: "Sender exportieren",
    menu_exit: "Beenden",
    menu_playback: "Wiedergabe",
    menu_resume: "Fortsetzen",
    menu_stop_after: "Stoppen nach",
    menu_stop_now: "Jetzt stoppen",
    menu_shuffle: "Zufallswiedergabe",
    menu_audio: "Audio",
    menu_compressor: "Kompressor",
    menu_stereo: "Stereo-Trennung",
    menu_output: "Ausgabegerät",
    menu_view: "Ansicht",
    selected: "Ausgewählt",
    menu_history: "Verlauf",
    menu_settings: "Einstellungen",
    menu_always_on_top: "Immer im Vordergrund",
    menu_theme: "Design",
    menu_close_tab: "Aktuellen Tab schließen",
    menu_help: "Hilfe",
    menu_shortcuts: "Tastenkombinationen",
    menu_debug: "Debug-Informationen",
    menu_feedback: "Feedback senden",
    menu_about: "Über",
    menu_license: "Lizenz",
    menu_open_source: "Open Source",
    menu_release_notes: "Versionshinweise",
    menu_hello: "Hallo",
    theme_red: "Rot",
    settings_auto_resume: "Letzten Sender automatisch fortsetzen",
    settings_auto_resume_delay: "Verzögerung der automatischen Fortsetzung",
    settings_font_size: "Schriftgröße",
    settings_language: "Sprache",
    settings_auto_clear_history: "Verlauf alle 7 Tage automatisch löschen",
    settings_visualizer: "Audio-Visualizer",
    settings_record_icon: "Aufnahmesymbol",
    history_count: "Sender:",
    clear_history: "Alle löschen",
    export_history: "Exportieren",
    search_history: "Verlauf durchsuchen...",
    delete_from_history: "Aus Verlauf löschen",
    no_history_filter: (keyword) => `🔍 Keine Ergebnisse für "${keyword}"`,
    delete_station: "Sender löschen",
    confirm_delete_station: (name) => `⚠️ Möchtest du "${name}" wirklich endgültig löschen?`,
    station_deleted: "🗑️ Sender erfolgreich gelöscht",
    timer_remaining: (minutes, seconds) => `⏱️ Stopp in ${minutes}:${seconds}`,
    timer_up_format: (hours, minutes, seconds) => `${hours}:${minutes}:${seconds}`,
    recording: "🔴 Stream wird aufgenommen...",
    recording_stopped: "✅ Aufnahme gestoppt",
    recording_saved: "📀 Aufnahme gespeichert",
    recording_not_supported: "Aufnahme wird in diesem Browser nicht unterstützt",
    recording_failed: "Aufnahme konnte nicht gestartet werden",
    output_device_changed: (label) => `🔊 Ausgabegerät geändert zu: ${label}`,
    output_device_default: "🔊 Ausgabegerät geändert zu: Systemstandard",
    output_device_not_supported: "⚠️ Die Auswahl des Ausgabegeräts wird in diesem Browser nicht unterstützt.",
    output_device_select: "Gerät auswählen...",
    output_device_selected: "ausgewähltes Gerät",
    output_device_not_selected: "⚠️ Kein Ausgabegerät ausgewählt.",
    output_device_select_error: (msg) => `❌ Auswahl des Ausgabegeräts fehlgeschlagen: ${msg}`,
    output_device_changed_to_selected: "🔊 Ausgabegerät zum ausgewählten Gerät geändert",
    output_device_change_error: (msg) => `❌ Ändern des Ausgabegeräts fehlgeschlagen: ${msg}`,
    compressor_on: "✅ Kompressor aktiviert",
    compressor_off: "✅ Kompressor deaktiviert",
    compressor_error: "Kompressor-Fehler",
    stereo_left: "🎧 Audio nur linker Kanal",
    stereo_right: "🎧 Audio nur rechter Kanal",
    stereo_center: "🎵 Stereo wiederhergestellt",
    stereo_error: "Stereo-Fehler",
    confirm_clear_history: "⚠️ Möchtest du wirklich den gesamten Verlauf löschen? Dies kann nicht rückgängig gemacht werden.",
    confirm_exit: "Möchtest du die Anwendung schließen?",
    confirm_auto_clear: "Automatisches Löschen des Verlaufs ist aktiviert. Möchtest du den alten Verlauf jetzt löschen?",
    no_history_to_export: "⚠️ Kein Verlauf zum Exportieren",
    history_exported: "📁 Verlauf erfolgreich exportiert",
    searching_online: "Online-Suche läuft...",
    opening_source: "🌐 Open-Source-Seite wird geöffnet...",
    always_on_top_set: "Fenster wurde auf 'Immer im Vordergrund' eingestellt",
    always_on_top_electron_only: "Diese Funktion funktioniert nur in der Electron-App",
    auto_resume_toggled: (status) => `✅ Automatische Fortsetzung ${status === 'enabled' ? 'aktiviert' : 'deaktiviert'}`,
    opening_email: "📧 Dein E-Mail-Programm wird geöffnet, um Feedback zu senden",
    version: "Version 2.0.0",
    about_text: "Multi-Source-Radio-App mit Unterstützung für arabische und internationale Sender, mit Audioeffekten, Timer, Hörverlauf und benutzerfreundlicher Oberfläche.\n\nAlle Rechte vorbehalten © 2026 Saeed Badr\nLizenziert unter der MIT-Lizenz",
    station_added: (name) => `✅ Sender hinzugefügt: ${name}`,
    stations_imported: (count) => `${count} Sender importiert.`,
    invalid_file: "⚠️ Ungültige Datei",
    greeting_morning: "Guten Morgen",
    greeting_evening: "Guten Abend",
    greeting_night: "Guten Abend",
    thank_you_message: "Danke, dass du X6 Radio nutzt.\nWir wünschen dir viel Freude mit Musik und Radiosendern.",
    checking_for_updates: "Suche nach Updates...",
    updates_only_in_production: "⚠️ Die Update-Suche funktioniert nur in der installierten Version der App",
    updates_not_supported: "⚠️ Updates werden in dieser Version nicht unterstützt",
    genre_variety: "Vielfältig",
    compact_mode: "Kompaktmodus",
    exit_compact_mode: "Kompaktmodus verlassen",
    station_name_placeholder: "z. B. BBC Radio",
    genre_placeholder: "z. B. Religiös, Musik",
    worldwide: "Weltweit",
    change_icon: "Symbol ändern",
    icon_changed_success: "✅ Symbol erfolgreich geändert",
    icon_change_failed: "❌ Symbol konnte nicht geändert werden",
    icon_file_too_large: "⚠️ Bilddatei zu groß (max. 2 MB)",
    station_not_found: "⚠️ Sender nicht gefunden",
  // ===== Neue Schlüssel =====
  confirm_reset_app: "⚠️ Möchten Sie die App wirklich vollständig zurücksetzen? Alle Daten (Favoriten, Verlauf, Einstellungen) werden gelöscht.",
  update_available: "📢 Neues Update verfügbar! Wird heruntergeladen...",
  update_downloaded: "Update heruntergeladen. Jetzt neu starten, um zu installieren?",
  no_updates: "✅ Keine Updates verfügbar. Sie verwenden die neueste Version.",
  update_check_error: "❌ Fehler bei der Suche nach Updates. Überprüfen Sie Ihre Internetverbindung.",
  preset_custom: "Benutzerdefiniert",
  eq_enabled: "✅ Equalizer aktiviert",
  eq_disabled: "⛔ Equalizer deaktiviert",
  always_on_top_enabled: "✅ Immer im Vordergrund aktiviert",
  always_on_top_disabled: "✅ Immer im Vordergrund deaktiviert",
  repair_url: "URL reparieren",
  testing_url: (index, total) => `🧪 Teste URL ${index} von ${total}...`,
  searching_alternative_url: (name) => `🔍 Suche nach einer alternativen URL für «${name}»...`,
  url_repaired_success: (name) => `✅ URL für «${name}» erfolgreich repariert`,
  url_working_correctly: (name) => `✅ Die URL von «${name}» funktioniert korrekt`,
  no_working_alternative_url: "❌ Keine funktionierende alternative URL gefunden",
  failed_to_find_alternative_url: "❌ Suche nach einer alternativen URL fehlgeschlagen",
  auto_resume_playing: "🔄 Automatisch fortsetzen",
  settings_enabled: "Aktiviert",
  settings_disabled: "Deaktiviert",
  settings_seconds: "Sek.",
  settings_visible: "Sichtbar",
  settings_hidden: "Versteckt",
  settings_language_arabic: "Arabisch",
  settings_language_english: "Englisch",
  settings_language_spanish: "Spanisch",
  settings_language_french: "Französisch",
  settings_language_german: "Deutsch",
  settings_language_portuguese: "Portugiesisch",
drawer_file: "Datei",
drawer_playback: "Wiedergabe",
drawer_stop_after: "Stoppen nach",
drawer_sound: "Klang",
drawer_help: "Hilfe",
drawer_appearance: "Erscheinungsbild",
drawer_settings: "Einstellungen",
drawer_exit: "Beenden",
drawer_version: "Version 2.0.0",
drawer_section_appearance: "Anpassen",
settings_general: "Allgemein",
settings_display: "Anzeige",
sleep_timer_off: "Aus",
timer_minutes: (m) => `${m} Min.`,
timer_cancel: "Timer abbrechen",
compressor_label: "Kompressor",
stereo_label: "Stereo-Trennung",
stereo_btn_center: "Mitte",
stereo_btn_left: "Links",
stereo_btn_right: "Rechts",
output_device_label: "Ausgabegerät",
output_default: "Standard",
output_other: "Anderes Gerät",
settings_font_large: "Groß",
settings_font_medium: "Mittel",
settings_font_small: "Klein",
settings_lang_ar: "Arabisch",
settings_lang_en: "Englisch",
"search_server_unavailable": "⚠️ Suchserver nicht verfügbar"
  },
  pt: {
    app_title: "X6 Radio",
    tab_eq: "Equalizador",
    countries_title: "Países e principais estações mundiais",
    categories_title: "📂 Categorias",
    history_count_label: "Estações:",
    welcome_title: "🎵 Bem-vindo ao X6 Radio",
    welcome_subtitle: "Selecione um país ou categoria na barra lateral para exibir as estações aqui",
    eq_title: "Equalizador avançado",
    eq_reset: "Redefinir",
    eq_save_preset: "Salvar predefinição atual",
    eq_preset_label: "Predefinições:",
    eq_apply: "Aplicar",
    eq_reset_done: "✅ Equalizador redefinido",
    eq_preset_saved: (name) => `✅ Predefinição "${name}" salva`,
    eq_preset_applied: (name) => `✅ Predefinição "${name}" aplicada`,
    eq_custom_applied: "✅ Configurações personalizadas aplicadas",
    audio_preset: "Predefinição de áudio",
    preset_flat: "Plano",
    eq_saved_success: "Salvo",
    eq_save_custom: "Salvar personalizado",
    eq_save: "Salvar ",
    preset_rock: "Rock",
    preset_pop: "Pop",
    preset_jazz: "Jazz",
    preset_classical: "Clássico",
    preset_dance: "Dance",
    preset_ballad: "Balada",
    preset_rnb: "R&B",
    preset_hiphop: "Hip Hop",
    loading: "Carregando estações...",
    menu_reload: "Redefinir aplicativo",
    no_stations: "📻 Nenhuma estação disponível.",
    no_stations_genre: "📻 Nenhuma estação neste gênero no momento.",
    no_stations_country: "📻 Nenhuma estação para este país no momento.",
    no_favorites: "❤️ Nenhuma estação favorita. Adicione uma clicando na estrela.",
    no_history: "📋 Ainda não há estações no histórico. Ouça uma estação e ela aparecerá aqui.",
    search_placeholder: "Buscar uma estação de rádio ou cidade...",
    search_countries_placeholder: "🔍 Buscar um país ou categoria...",
    search_results_for: "Resultados da busca por:",
    search_empty: "🔍 Digite uma palavra-chave para buscar em todas as estações.",
    no_search_results: "⚠️ Nenhum resultado encontrado.",
    add_station_title: "Adicionar nova estação de rádio",
    station_name_label: "Nome da estação:",
    station_url_label: "URL de transmissão:",
    country_label: "País:",
    genre_label: "Gênero (opcional):",
    icon_url_label: "URL do ícone (opcional):",
    add_button: "Adicionar",
    cancel_button: "Cancelar",
    tab_stations: "Estações",
    tab_favorites: "Favoritas",
    tab_search: "Procurar",
    tab_add_station: "Estação",
    menu_check_for_updates: "Verificar atualizações",
    tab_history: "Histórico",
    play: "Reproduzir",
    stop: "Parar",
    save_to_favorites: "Salvar",
    saved_to_favorites: "Salvo",
    current_station_default: "Nenhuma estação selecionada",
    connecting: "Conectando...",
    stopped_auto: "Transmissão parada automaticamente após o temporizador",
    timer_set: (minutes) => `Parada automática após ${minutes} minutos`,
    no_active_stream: "Nenhuma transmissão ativa para definir o temporizador",
    no_station_selected: "Nenhuma estação selecionada",
    playback_failed: "Falha ao reproduzir - verifique a URL da transmissão",
    stream_error: "Erro na transmissão",
    not_supported: "Seu navegador não suporta este tipo de transmissão",
    hls_error: "Falha ao reproduzir a transmissão HLS",
    webview_error: "Desculpe, este tipo de transmissão não é suportado",
    webview_working: "Reproduzindo agora (ao vivo do site)",
    added_to_favorites: "Adicionado aos favoritos",
    removed_from_favorites: "Removido dos favoritos",
    theme_default: "Padrão",
    theme_dark: "Escuro (alto contraste)",
    theme_light: "Claro",
    theme_changed: (theme) => `Tema alterado para ${theme}`,
    menu_file: "Arquivo",
    menu_open_url: "Abrir URL de transmissão",
    menu_add_station: "Adicionar nova estação",
    menu_import: "Importar estações",
    menu_export: "Exportar estações",
    menu_exit: "Sair",
    menu_playback: "Reprodução",
    menu_resume: "Retomar",
    menu_stop_after: "Parar após",
    menu_stop_now: "Parar agora",
    menu_shuffle: "Reprodução aleatória",
    menu_audio: "Áudio",
    menu_compressor: "Compressor",
    menu_stereo: "Separação estéreo",
    menu_output: "Dispositivo de saída",
    menu_view: "Exibir",
    selected: "Selecionado",
    menu_history: "Histórico",
    menu_settings: "Configurações",
    menu_always_on_top: "Sempre visível",
    menu_theme: "Tema",
    menu_close_tab: "Fechar aba atual",
    menu_help: "Ajuda",
    menu_shortcuts: "Atalhos de teclado",
    menu_debug: "Informações de depuração",
    menu_feedback: "Enviar feedback",
    menu_about: "Sobre",
    menu_license: "Licença",
    menu_open_source: "Código aberto",
    menu_release_notes: "Notas da versão",
    menu_hello: "Olá",
    theme_red: "Vermelho",
    settings_auto_resume: "Retomar última estação automaticamente",
    settings_auto_resume_delay: "Atraso da retomada automática",
    settings_font_size: "Tamanho da fonte",
    settings_language: "Idioma",
    settings_auto_clear_history: "Limpar histórico a cada 7 dias",
    settings_visualizer: "Efeitos visuais de áudio",
    settings_record_icon: "Ícone de gravação",
    history_count: "Estações:",
    clear_history: "Limpar tudo",
    export_history: "Exportar",
    search_history: "Buscar no histórico...",
    delete_from_history: "Excluir do histórico",
    no_history_filter: (keyword) => `🔍 Nenhum resultado para "${keyword}"`,
    delete_station: "Excluir estação",
    confirm_delete_station: (name) => `⚠️ Tem certeza de que deseja excluir permanentemente "${name}"?`,
    station_deleted: "🗑️ Estação excluída com sucesso",
    timer_remaining: (minutes, seconds) => `⏱️ Parar em ${minutes}:${seconds}`,
    timer_up_format: (hours, minutes, seconds) => `${hours}:${minutes}:${seconds}`,
    recording: "🔴 Gravando transmissão...",
    recording_stopped: "✅ Gravação parada",
    recording_saved: "📀 Gravação salva",
    recording_not_supported: "Gravação não suportada neste navegador",
    recording_failed: "Falha ao iniciar a gravação",
    output_device_changed: (label) => `🔊 Dispositivo de saída alterado para: ${label}`,
    output_device_default: "🔊 Dispositivo de saída alterado para: Padrão do sistema",
    output_device_not_supported: "⚠️ Seleção de dispositivo de saída não suportada neste navegador.",
    output_device_select: "Selecionar dispositivo...",
    output_device_selected: "dispositivo selecionado",
    output_device_not_selected: "⚠️ Nenhum dispositivo de saída selecionado.",
    output_device_select_error: (msg) => `❌ Falha ao selecionar o dispositivo de saída: ${msg}`,
    output_device_changed_to_selected: "🔊 Dispositivo de saída alterado para o dispositivo selecionado",
    output_device_change_error: (msg) => `❌ Falha ao alterar o dispositivo de saída: ${msg}`,
    compressor_on: "✅ Compressor ativado",
    compressor_off: "✅ Compressor desativado",
    compressor_error: "Erro do compressor",
    stereo_left: "🎧 Áudio apenas no canal esquerdo",
    stereo_right: "🎧 Áudio apenas no canal direito",
    stereo_center: "🎵 Estéreo restaurado",
    stereo_error: "Erro de estéreo",
    confirm_clear_history: "⚠️ Tem certeza de que deseja limpar todo o histórico? Esta ação não pode ser desfeita.",
    confirm_exit: "Deseja fechar o aplicativo?",
    confirm_auto_clear: "A limpeza automática do histórico foi ativada. Deseja limpar o histórico antigo agora?",
    no_history_to_export: "⚠️ Nenhum histórico para exportar",
    history_exported: "📁 Histórico exportado com sucesso",
    searching_online: "Buscando online...",
    opening_source: "🌐 Abrindo página de código aberto...",
    always_on_top_set: "Janela definida para ficar sempre visível",
    always_on_top_electron_only: "Este recurso funciona apenas no aplicativo Electron",
    auto_resume_toggled: (status) => `✅ Retomada automática ${status === 'enabled' ? 'ativada' : 'desativada'}`,
    opening_email: "📧 Seu cliente de e-mail será aberto para enviar feedback",
    version: "Versão 2.0.0",
    about_text: "Aplicativo de rádio multi-fontes com suporte a estações árabes e internacionais, com efeitos de áudio, temporizador, histórico de audição e interface fácil de usar.\n\nTodos os direitos reservados © 2026 Saeed Badr\nLicenciado sob a licença MIT",
    station_added: (name) => `✅ Estação adicionada: ${name}`,
    stations_imported: (count) => `${count} estações importadas.`,
    invalid_file: "⚠️ Arquivo inválido",
    greeting_morning: "Bom dia",
    greeting_evening: "Boa tarde",
    greeting_night: "Boa noite",
    thank_you_message: "Obrigado por usar o X6 Radio.\nAproveite a música e as estações de rádio.",
    checking_for_updates: "Verificando atualizações...",
    updates_only_in_production: "⚠️ O recurso de verificação de atualizações funciona apenas na versão instalada do aplicativo",
    updates_not_supported: "⚠️ Atualizações não suportadas nesta versão",
    genre_variety: "Variado",
    compact_mode: "Modo compacto",
    exit_compact_mode: "Sair do modo compacto",
    station_name_placeholder: "ex.: BBC Radio",
    genre_placeholder: "ex.: Religioso, Música",
    worldwide: "Mundial",
    change_icon: "Alterar ícone",
    icon_changed_success: "✅ Ícone alterado com sucesso",
    icon_change_failed: "❌ Falha ao alterar o ícone",
    icon_file_too_large: "⚠️ Imagem muito grande (máx. 2 MB)",
    station_not_found: "⚠️ Estação não encontrada",
  // ===== Novas chaves =====
  confirm_reset_app: "⚠️ Tem certeza de que deseja redefinir o aplicativo completamente? Todos os dados (favoritos, histórico, configurações) serão excluídos.",
  update_available: "📢 Nova atualização disponível! Baixando...",
  update_downloaded: "Atualização baixada. Reiniciar agora para instalar?",
  no_updates: "✅ Nenhuma atualização disponível. Você está usando a versão mais recente.",
  update_check_error: "❌ Falha ao verificar atualizações. Verifique sua conexão com a Internet.",
  preset_custom: "Personalizado",
  eq_enabled: "✅ Equalizador ativado",
  eq_disabled: "⛔ Equalizador desativado",
  always_on_top_enabled: "✅ Sempre visível ativado",
  always_on_top_disabled: "✅ Sempre visível desativado",
  repair_url: "Reparar URL",
  testing_url: (index, total) => `🧪 Testando URL ${index} de ${total}...`,
  searching_alternative_url: (name) => `🔍 Procurando uma URL alternativa para «${name}»...`,
  url_repaired_success: (name) => `✅ URL reparada com sucesso para «${name}»`,
  url_working_correctly: (name) => `✅ A URL de «${name}» está funcionando corretamente`,
  no_working_alternative_url: "❌ Nenhuma URL alternativa funcional encontrada",
  failed_to_find_alternative_url: "❌ Falha ao encontrar uma URL alternativa",
  auto_resume_playing: "🔄 Retomada automática",
  settings_enabled: "Ativado",
  settings_disabled: "Desativado",
  settings_seconds: "seg",
  settings_visible: "Visível",
  settings_hidden: "Oculto",
  settings_language_arabic: "Árabe",
  settings_language_english: "Inglês",
  settings_language_spanish: "Espanhol",
  settings_language_french: "Francês",
  settings_language_german: "Alemão",
  settings_language_portuguese: "Português",
drawer_file: "Arquivo",
drawer_playback: "Reprodução",
drawer_stop_after: "Parar após",
drawer_sound: "Som",
drawer_help: "Ajuda",
drawer_appearance: "Aparência",
drawer_settings: "Configurações",
drawer_exit: "Sair",
drawer_version: "Versão 2.0.0",
drawer_section_appearance: "Personalizar",
settings_general: "Geral",
settings_display: "Exibição",
sleep_timer_off: "Desligado",
timer_minutes: (m) => `${m} min`,
timer_cancel: "Cancelar temporizador",
compressor_label: "Compressor",
stereo_label: "Separação estéreo",
stereo_btn_center: "Centro",
stereo_btn_left: "Esquerda",
stereo_btn_right: "Direita",
output_device_label: "Dispositivo de saída",
output_default: "Padrão",
output_other: "Outro dispositivo",
settings_font_large: "Grande",
settings_font_medium: "Médio",
settings_font_small: "Pequeno",
settings_lang_ar: "Árabe",
settings_lang_en: "Inglês",
"search_server_unavailable": "⚠️ Servidor de busca indisponível"
  }
};

const tabKeys = ['tab_stations', 'tab_favorites', 'tab_search', 'tab_add_station', 'tab_history', 'tab_eq'];

let currentLanguage = localStorage.getItem('setting_language') || 'en';

function t(key, ...args) {
  let str = translations[currentLanguage]?.[key] || translations['ar'][key] || key;
  if (args.length) {
    if (typeof str === 'function') str = str(...args);
    else for (let i = 0; i < args.length; i++) str = str.replace(new RegExp(`\\{${i}\\}`, 'g'), args[i]);
  }
  return str;
}

function updateAllTexts() {
// داخل updateAllTexts
document.documentElement.lang = currentLanguage === 'ar' ? 'ar' : 'en';
document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
document.body.style.direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
document.body.style.textAlign = currentLanguage === 'ar' ? 'right' : 'left';
  // 1. تحديث العناصر التي تحمل data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) {
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.placeholder = t(key);
      } else {
        el.textContent = t(key);
      }
    }
  });

  // 2. تحديث placeholders الخاصة (لأن بعضها ليس له data-i18n-placeholder)
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('search_placeholder');
  const historySearch = document.getElementById('historySearchInput');
  if (historySearch) historySearch.placeholder = t('search_history');
  const countriesSearchInput = document.getElementById('countriesSearchInput');
if (countriesSearchInput) countriesSearchInput.placeholder = t('search_countries_placeholder');
  
  // 2b. تحديث placeholder لحقل اسم المحطة والنوع
  const stationNameInput = document.getElementById('newStationName');
  if (stationNameInput) stationNameInput.placeholder = t('station_name_placeholder');
  
  const genreInput = document.getElementById('newStationGenre');
  if (genreInput) genreInput.placeholder = t('genre_placeholder');
  
  // 3. عنوان التطبيق
  document.title = t('app_title');
  const logoTitle = document.querySelector('.logo-area h1');
  if (logoTitle) logoTitle.textContent = t('app_title');
  
  // 4. تبويب إضافة محطة
  const addTitle = document.querySelector('#add-station-tab h3');
  if (addTitle) addTitle.innerHTML = `<i class="fas fa-plus-circle"></i> ${t('add_station_title')}`;
  
  // 5. حقول النموذج
  const labels = ['newStationName', 'newStationUrl', 'newStationCountry', 'newStationGenre', 'newStationIcon'];
  const labelTexts = ['station_name_label', 'station_url_label', 'country_label', 'genre_label', 'icon_url_label'];
  labels.forEach((id, idx) => {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) label.textContent = t(labelTexts[idx]);
  });
  const addBtn = document.getElementById('submitAddStation');
  if (addBtn) addBtn.innerHTML = `<i class="fas fa-save"></i> ${t('add_button')}`;
  const cancelBtn = document.getElementById('cancelAddStation');
  if (cancelBtn) cancelBtn.innerHTML = `<i class="fas fa-times"></i> ${t('cancel_button')}`;
  
  // 6. أزرار التبويبات
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab, idx) => {
    if (idx < tabKeys.length) {
      const icon = tab.querySelector('i');
      tab.innerHTML = '';
      if (icon) tab.appendChild(icon);
      tab.appendChild(document.createTextNode(' ' + t(tabKeys[idx])));
    }
  });
  
  // 7. عنوان لوحة الدول
  const countriesTitle = document.querySelector('.countries-panel h3');
  if (countriesTitle) {
    countriesTitle.innerHTML = (currentLanguage === 'en' ? 'Countries & Major World Stations ' : 'الدول و أهم المحطات العالمية ') + '<span class="country-count"></span>';
  }
  
  // 8. ترجمة عناوين القوائم الرئيسية
  const mainMenuItems = document.querySelectorAll('.menu-item');
  const mainMenuKeys = ['menu_file', 'menu_playback', 'menu_audio', 'menu_view', 'menu_help'];
  mainMenuItems.forEach((item, idx) => {
    if (idx < mainMenuKeys.length) {
      const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = t(mainMenuKeys[idx]);
    }
  });
  
  const menuMap = {
    menuOpenURL: 'menu_open_url',
    menuAddStation: 'menu_add_station',
    menuImportStations: 'menu_import',
    menuExportStations: 'menu_export',
    menuExit: 'menu_exit',
    menuResume: 'menu_resume',
    menuStop: 'menu_stop_now',
    menuShuffle: 'menu_shuffle',
    menuCompressor: 'menu_compressor',
    menuAlwaysOnTop: 'menu_always_on_top',
    menuCloseTab: 'menu_close_tab',
    menuKeyboardShortcuts: 'menu_shortcuts',
    menuDebug: 'menu_debug',
    menuFeedback: 'menu_feedback',
    menuAboutHelp: 'menu_about',
    menuLicense: 'menu_license',
    menuOpenSource: 'menu_open_source',
    menuReleaseNotes: 'menu_release_notes',
    menuHello: 'menu_hello',
    menuViewStations: 'tab_stations',
    menuHistory: 'tab_history',
    menuCheckForUpdates: 'menu_check_for_updates'
  };
  for (const [id, key] of Object.entries(menuMap)) {
    const el = document.getElementById(id);
    if (el) {
      const icon = el.querySelector('i');
      const shortcut = el.querySelector('.menu-shortcut');
      el.innerHTML = '';
      if (icon) el.appendChild(icon);
      el.appendChild(document.createTextNode(' ' + t(key) + ' '));
      if (shortcut) el.appendChild(shortcut);
    }
  }
  
  // 10. ترجمة عناوين القوائم الفرعية
  const submenuItems = document.querySelectorAll('.dropdown-item.has-submenu');
  const submenuMap = {
    'إيقاف بعد مدة': 'menu_stop_after',
    'فصل ستيريو': 'menu_stereo',
    'جهاز إخراج': 'menu_output',
    'المظهر': 'menu_theme',
    'الإعدادات': 'menu_settings'
  };
  submenuItems.forEach(item => {
    const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (textNode && submenuMap[textNode.textContent.trim()]) {
      textNode.textContent = t(submenuMap[textNode.textContent.trim()]);
    }
  });

  // 11. ترجمة الخيارات الثانوية
  document.querySelectorAll('.submenu-item[data-minutes]').forEach(item => {
    const minutes = item.dataset.minutes;
    const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = currentLanguage === 'en' ? `${minutes} min` : `${minutes} دقيقة`;
  });
  document.querySelectorAll('.submenu-item[data-stereo]').forEach(item => {
    const mode = item.dataset.stereo;
    let text = '';
    if (mode === 'left') text = currentLanguage === 'en' ? 'Left' : 'يسار';
    else if (mode === 'right') text = currentLanguage === 'en' ? 'Right' : 'يمين';
    else if (mode === 'center') text = currentLanguage === 'en' ? 'Center' : 'وسط';
    const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode && text) textNode.textContent = text;
  });
  document.querySelectorAll('#outputDeviceSubmenu .submenu-item').forEach(item => {
    const device = item.dataset.device;
    const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
      if (device === 'default') textNode.textContent = currentLanguage === 'en' ? 'Default' : 'افتراضي';
      else if (device === 'select') textNode.textContent = currentLanguage === 'en' ? 'Select device...' : 'اختيار جهاز...';
    }
  });
  document.querySelectorAll('.submenu-item[data-theme]').forEach(item => {
    const theme = item.dataset.theme;
    let text = '';
    if (theme === 'default') text = currentLanguage === 'en' ? 'Default' : 'الافتراضي';
    else if (theme === 'dark') text = currentLanguage === 'en' ? 'Dark' : 'داكن';
    else if (theme === 'light') text = currentLanguage === 'en' ? 'Light' : 'فاتح';
    const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode && text) textNode.textContent = text;
  });
  
  // 12. ترجمة إعدادات القوائم الفرعية
  document.querySelectorAll('.submenu-item.has-submenu-settings').forEach(item => {
    const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
      const original = textNode.textContent.trim();
      const keyMap = {
        'تشغيل تلقائى للمحطة الأخيرة': 'settings_auto_resume',
        'تأخير التشغيل التلقائي': 'settings_auto_resume_delay',
        'حجم الخط': 'settings_font_size',
        'اللغة': 'settings_language',
        'مسح السجل كل 7 أيام': 'settings_auto_clear_history',
        'مؤثرات الصوت البصرية': 'settings_visualizer',
        'أيقونة التسجيل': 'settings_record_icon'
      };
      if (keyMap[original]) textNode.textContent = t(keyMap[original]);
    }
  });
  
  // 13. ترجمة القيم داخل الإعدادات
  document.querySelectorAll('.submenu-vertical .submenu-value').forEach(item => {
    const value = item.dataset.value;
    const parentSetting = item.closest('.has-submenu-settings');
    if (parentSetting) {
      const settingKey = parentSetting.dataset.setting;
      let text = '';
      if (settingKey === 'autoResume') text = currentLanguage === 'en' ? (value === 'true' ? 'Enabled' : 'Disabled') : (value === 'true' ? 'مفعل' : 'معطل');
      else if (settingKey === 'autoResumeDelay') text = currentLanguage === 'en' ? `${value} sec` : `${value} ثانية`;
      else if (settingKey === 'fontSize') {
        if (value === 'large') text = currentLanguage === 'en' ? 'Large' : 'كبير';
        else if (value === 'medium') text = currentLanguage === 'en' ? 'Medium' : 'متوسط';
        else if (value === 'small') text = currentLanguage === 'en' ? 'Small' : 'صغير';
      } else if (settingKey === 'language') text = value === 'ar' ? 'العربية' : 'English';
      else if (settingKey === 'autoClearHistory') text = currentLanguage === 'en' ? (value === 'true' ? 'Enabled' : 'Disabled') : (value === 'true' ? 'مفعل' : 'معطل');
      else if (settingKey === 'visualizer') text = currentLanguage === 'en' ? (value === 'true' ? 'Enabled' : 'Disabled') : (value === 'true' ? 'مفعل' : 'معطل');
      else if (settingKey === 'recordIcon') text = currentLanguage === 'en' ? (value === 'true' ? 'Visible' : 'Hidden') : (value === 'true' ? 'ظاهرة' : 'مخفية');
      const textNode = Array.from(item.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode && text) textNode.textContent = text;
    }
  });
  
 // في i18n.js - دالة updateAllTexts()
// أضف هذا الكود لتحديث أزرار الشريط السفلي
document.querySelectorAll('.nav-item span[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
});

  // 14. تحديث شريط التشغيل والمحطة الحالية
  const currentStationName = document.getElementById('currentStationName');
  if (currentStationName && (!window.currentStation || !window.currentStation.name)) {
    currentStationName.innerText = t('current_station_default');
  }
  if (typeof updateFavButtonCurrent === 'function') updateFavButtonCurrent();
  
  // 15. تحديث أزرار السجل
  const clearBtn = document.getElementById('clearAllHistoryBtn');
  if (clearBtn) clearBtn.innerHTML = `<i class="fas fa-trash-alt"></i> ${t('clear_history')}`;
  const exportBtn = document.getElementById('exportHistoryBtn');
  if (exportBtn) exportBtn.innerHTML = `<i class="fas fa-download"></i> ${t('export_history')}`;
  
  // 16. تحديث المحتوى الديناميكي
  if (window.currentTab === 'stations-tab' && typeof renderStations === 'function') renderStations();
  else if (window.currentTab === 'favorites-tab' && typeof renderFavoritesTab === 'function') renderFavoritesTab();
  else if (window.currentTab === 'history-tab' && typeof renderHistoryTab === 'function') renderHistoryTab();
  else if (window.currentTab === 'search-tab' && typeof performSearch === 'function') performSearch(window.searchKeyword || '');
  
  // 17. تحديث قائمة الدول
  if (typeof renderCountriesList === 'function') renderCountriesList();
  if (typeof updateHeaderForFilter === 'function' && currentFilterItem) updateHeaderForFilter(currentFilterItem);
  
  // 18. تحديث نص زر الوضع المصغر
  if (typeof window.updateCompactModeText === 'function') window.updateCompactModeText();
// تحديث اسم الدولة في شريط التشغيل حسب اللغة
if (typeof window.updateCurrentStationCountry === 'function') {
    window.updateCurrentStationCountry();
}
}

function applyLanguage(lang) {
    if (lang === currentLanguage) return;
    
    currentLanguage = lang;
    localStorage.setItem('setting_language', lang);
    
    // ✅ أضف هذا الكود لحفظ اللغة في config.json
    if (window.electronAPI && window.electronAPI.saveConfigLanguage) {
        window.electronAPI.saveConfigLanguage(lang).catch(err => {
            console.warn('فشل حفظ اللغة في config.json', err);
        });
    }
    
    window.location.reload();
}

// =====================================================
// ترجمة النصوص الثابتة الإضافية (تبويب البحث وإضافة المحطة)
// =====================================================

function translateExtraElements() {
    const searchResultsSpan = document.querySelector('.search-info span:first-child');
    if (searchResultsSpan && !searchResultsSpan.hasAttribute('data-i18n')) {
        searchResultsSpan.textContent = t('search_results_for');
    }
    
    const addStationTitle = document.querySelector('#add-station-tab h3');
    if (addStationTitle) {
        addStationTitle.innerHTML = `<i class="fas fa-plus-circle"></i> ${t('add_station_title')}`;
    }
    
    const stationNameLabel = document.querySelector('label[for="newStationName"]');
    if (stationNameLabel) stationNameLabel.textContent = t('station_name_label');
    
    const stationUrlLabel = document.querySelector('label[for="newStationUrl"]');
    if (stationUrlLabel) stationUrlLabel.textContent = t('station_url_label');
    
    const countryLabel = document.querySelector('label[for="newStationCountry"]');
    if (countryLabel) countryLabel.textContent = t('country_label');
    
    const genreLabel = document.querySelector('label[for="newStationGenre"]');
    if (genreLabel) genreLabel.textContent = t('genre_label');
    
    const iconLabel = document.querySelector('label[for="newStationIcon"]');
    if (iconLabel) iconLabel.textContent = t('icon_url_label');
    
    const submitBtn = document.getElementById('submitAddStation');
    if (submitBtn) submitBtn.innerHTML = `<i class="fas fa-save"></i> ${t('add_button')}`;
    
    const cancelBtn = document.getElementById('cancelAddStation');
    if (cancelBtn) cancelBtn.innerHTML = `<i class="fas fa-times"></i> ${t('cancel_button')}`;

    // ===== ترجمة القائمة الجانبية (Mobile Drawer) =====
    // ترجمة عناوين المجموعات الرئيسية
    const groupHeaderMap = {
        'file': 'drawer_file',
        'playback': 'drawer_playback',
        'sleep-timer': 'drawer_stop_after',
        'sound': 'drawer_sound',
        'help': 'drawer_help'
    };
    document.querySelectorAll('.menu-group-header').forEach(header => {
        const group = header.closest('.menu-group');
        if (!group) return;
        const groupKey = group.dataset.group;
        const transKey = groupHeaderMap[groupKey];
        if (!transKey) return;
        const span = header.querySelector('span:not(.row-value):not(.switch-knob)');
        if (span && !span.hasAttribute('data-i18n')) {
            span.textContent = t(transKey);
        }
    });

    // ترجمة محتوى مجموعة "إيقاف بعد مدة"
    const sleepVal = document.getElementById('sleepTimerValue');
    if (sleepVal) sleepVal.textContent = t('sleep_timer_off');
    document.querySelectorAll('.timer-option').forEach(btn => {
        const m = parseInt(btn.dataset.minutes);
        if (m) btn.textContent = t('timer_minutes', m);
    });
    const cancelTimer = document.getElementById('timerCancelOption');
    if (cancelTimer) {
        cancelTimer.textContent = t('timer_cancel');
    }

    // ترجمة محتوى مجموعة "صوت"
    const compressorRow = document.querySelector('.toggle-row span:not(.switch-knob)');
    if (compressorRow && !compressorRow.hasAttribute('data-i18n')) {
        compressorRow.textContent = t('compressor_label');
    }
    const stereoRowSpan = document.querySelector('.stereo-row > span');
    if (stereoRowSpan) stereoRowSpan.textContent = t('stereo_label');
    const stereoMap = { center: 'stereo_btn_center', left: 'stereo_btn_left', right: 'stereo_btn_right' };
    document.querySelectorAll('.stereo-btn').forEach(btn => {
        const key = stereoMap[btn.dataset.stereo];
        if (key) btn.textContent = t(key);
    });
    const outputRowSpan = document.querySelector('.output-row > span');
    if (outputRowSpan) outputRowSpan.textContent = t('output_device_label');
    const outputMap = { default: 'output_default', select: 'output_other' };
    document.querySelectorAll('.output-btn').forEach(btn => {
        const key = outputMap[btn.dataset.device];
        if (key) btn.textContent = t(key);
    });

    // ترجمة صف المظهر
    const themeRow = document.querySelector('.menu-row.theme-row > span');
    if (themeRow) {
        const icon = themeRow.querySelector('i');
        themeRow.innerHTML = '';
        if (icon) themeRow.appendChild(icon);
        themeRow.appendChild(document.createTextNode(' ' + t('drawer_appearance')));
    }
    const themeChipMap = { default: 'theme_default', dark: 'theme_dark', light: 'theme_light', red: 'theme_red' };
    document.querySelectorAll('#themeChips .chip').forEach(chip => {
        const key = themeChipMap[chip.dataset.theme];
        if (key) chip.textContent = t(key);
    });

    // ترجمة صف الإعدادات
    const settingsRow = document.getElementById('menuOpenSettings');
    if (settingsRow) {
        const icon = settingsRow.querySelector('i');
        const chevron = settingsRow.querySelector('.chevron-sm');
        settingsRow.innerHTML = '';
        if (icon) settingsRow.appendChild(icon);
        settingsRow.appendChild(document.createTextNode(' ' + t('drawer_settings') + ' '));
        if (chevron) settingsRow.appendChild(chevron);
    }

    // ترجمة زر الخروج والتذييل
    const exitBtn = document.querySelector('.drawer-exit');
    if (exitBtn) {
        const icon = exitBtn.querySelector('i');
        exitBtn.innerHTML = '';
        if (icon) exitBtn.appendChild(icon);
        exitBtn.appendChild(document.createTextNode(' ' + t('drawer_exit')));
    }
    const drawerFooter = document.querySelector('.drawer-footer span');
    if (drawerFooter) drawerFooter.textContent = t('drawer_version');

    // ===== ترجمة شاشة الإعدادات الفرعية =====
    const settingsPanelHeader = document.querySelector('#settingsScreen .subscreen-header span');
    if (settingsPanelHeader) settingsPanelHeader.textContent = t('drawer_settings');

    // ترجمة عناوين مجموعات الإعدادات
    const settingsGroupTitles = document.querySelectorAll('.settings-group-title');
    if (settingsGroupTitles.length >= 2) {
        settingsGroupTitles[0].textContent = t('settings_general');
        settingsGroupTitles[1].textContent = t('settings_display');
    }

    // ترجمة صفوف الإعدادات — نصوص labels
    const settingsLabelMap = {
        'autoResume': 'settings_auto_resume',
        'autoResumeDelay': 'settings_auto_resume_delay',
        'autoClearHistory': 'settings_auto_clear_history',
        'fontSize': 'settings_font_size',
        'language': 'settings_language',
        'visualizer': 'settings_visualizer',
        'recordIcon': 'settings_record_icon'
    };
    document.querySelectorAll('#settingsScreen .settings-row').forEach(row => {
        const span = row.querySelector(':scope > span');
        if (!span) return;
        // البحث عن الإعداد المرتبط
        const sw = row.querySelector('.switch');
        const optGroup = row.querySelector('.option-group');
        let settingKey = null;
        if (sw) settingKey = sw.dataset.setting;
        else if (optGroup) settingKey = optGroup.dataset.setting;
        if (settingKey && settingsLabelMap[settingKey]) {
            span.textContent = t(settingsLabelMap[settingKey]);
        }
    });

    // ترجمة خيارات الأزرار في الإعدادات
    const fontSizeMap = { large: 'settings_font_large', medium: 'settings_font_medium', small: 'settings_font_small' };
document.querySelectorAll('#settingsScreen .option-btn').forEach(btn => {
    const val = btn.dataset.value;
    const group = btn.closest('.option-group');
    if (!group) return;
    const setting = group.dataset.setting;
    if (setting === 'fontSize' && fontSizeMap[val]) {
        btn.textContent = t(fontSizeMap[val]);
    } else if (setting === 'language') {
        // عرض اسم اللغة بلغتها الأصلية (ثابت)
        const languageNames = {
            ar: 'العربية',
            en: 'English',
            es: 'Español',
            fr: 'Français',
            de: 'Deutsch',
            pt: 'Português'
        };
        btn.textContent = languageNames[val] || val;
    } else if (setting === 'autoResumeDelay') {
        const num = parseFloat(val);
        if (!isNaN(num)) {
            btn.textContent = currentLanguage === 'ar' ? (num + ' ث') : (num + ' sec');
        }
    }
});
}

const originalUpdateAllTexts = updateAllTexts;
window.updateAllTexts = function() {
    originalUpdateAllTexts();
    translateExtraElements();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', translateExtraElements);
} else {
    translateExtraElements();
}