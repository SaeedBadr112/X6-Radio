// ========== الثوابت والمتغيرات العامة ==========
const DEFAULT_ICON_PATH = "./assets/666.png";
const FAILED_ICONS_KEY = "x6RadioFailedIcons";
let failedIconsSet = new Set();
let historyList = JSON.parse(localStorage.getItem("x6RadioHistory")) || [];
let historyFilterKeyword = "";
let currentTheme = localStorage.getItem("x6RadioTheme") || "default";
let autoResume = localStorage.getItem("x6RadioAutoResume") === "true";
let stopTimer = null;
let timerRemainingSeconds = 0;
let timerInterval = null;
let timerUpInterval = null;
let timerUpSeconds = 0;
let mediaRecorder = null;
let recordedChunks = [];
let recordTimerInterval = null;
let recordSeconds = 0;
let audioFilters = [];
// ========== حالة المعادل ==========
let isEqualizerEnabled = true;   // مفعل افتراضياً
const EQ_STATE_KEY = 'x6RadioEqEnabled'; // مفتاح التخزين

// ========== معادل الصوت المتقدم (يستخدم في audioCore.js) ==========
const EQ_BANDS = 15;
const EQ_FREQUENCIES = [];
for (let i = 0; i < EQ_BANDS; i++) {
    const minFreq = 20;
    const maxFreq = 20000;
    const ratio = i / (EQ_BANDS - 1);
    const freq = minFreq * Math.pow(maxFreq / minFreq, ratio);
    EQ_FREQUENCIES.push(Math.round(freq));
}
let eqGains = new Array(EQ_BANDS).fill(0);

let advancedSettings = {
    autoResumeDelay: parseFloat(localStorage.getItem('setting_autoResumeDelay') || '0.5'),
    fontSize: localStorage.getItem('setting_fontSize') || 'medium',
    language: localStorage.getItem('setting_language') || 'en',
    autoClearHistory: localStorage.getItem('setting_autoClearHistory') === 'true',
    visualizer: localStorage.getItem('setting_visualizer') !== 'false',
    recordIcon: localStorage.getItem('setting_recordIcon') !== 'false'
};

let audioPlayer = new Audio();
audioPlayer.crossOrigin = "anonymous";
window.audioPlayer = audioPlayer;

let audioCtx = null;
let sourceNode = null;
let gainNode = null;
let compressorNode = null;
let stereoPanner = null;
let analyserNode = null;
let isCompressorActive = false;
let isStereoModeActive = false;

let masterStations = [];
window.masterStations = masterStations;
let currentStation = null;
let favorites = JSON.parse(localStorage.getItem("x6RadioFavs")) || [];
let currentTab = "stations-tab";
let searchKeyword = "";
let searchDebounceTimer = null;
let currentFilterItem = null;

console.log('🔍 [globals.js] Favorites loaded from localStorage:', favorites);
console.log('🔍 [globals.js] History loaded from localStorage:', historyList.length, 'items');
console.log('🔍 [globals.js] Raw localStorage favs:', localStorage.getItem("x6RadioFavs"));
console.log('🔍 [globals.js] Raw localStorage history:', localStorage.getItem("x6RadioHistory"));

// ========== قائمة الدول والتصنيفات ==========
const allCountriesList = [
  { code: "JO", name: "Jordan", nameAr: "الأردن", nameFr: "Jordanie", nameEs: "Jordania", namePt: "Jordânia", nameDe: "Jordanien", isArab: true },
  { code: "AE", name: "UAE", nameAr: "الإمارات", nameFr: "UAE", nameEs: "UAE", namePt: "UAE", nameDe: "UAE", isArab: true },
  { code: "BH", name: "Bahrain", nameAr: "البحرين", nameFr: "Bahreïn", nameEs: "Bahréin", namePt: "Bahrein", nameDe: "Bahrain", isArab: true },
  { code: "DZ", name: "Algeria", nameAr: "الجزائر", nameFr: "Algérie", nameEs: "Argelia", namePt: "Argélia", nameDe: "Algerien", isArab: true },
  { code: "SD", name: "Sudan", nameAr: "السودان", nameFr: "Soudan", nameEs: "Sudán", namePt: "Sudão", nameDe: "Sudan", isArab: true },
  { code: "SA", name: "Saudi Arabia", nameAr: "السعودية", nameFr: "Arabie saoudite", nameEs: "Arabia Saudita", namePt: "Arábia Saudita", nameDe: "Saudi-Arabien", isArab: true },
  { code: "SO", name: "Somalia", nameAr: "الصومال", nameFr: "Somalie", nameEs: "Somalia", namePt: "Somália", nameDe: "Somalia", isArab: true },
  { code: "IQ", name: "Iraq", nameAr: "العراق", nameFr: "Irak", nameEs: "Irak", namePt: "Iraque", nameDe: "Irak", isArab: true },
  { code: "KW", name: "Kuwait", nameAr: "الكويت", nameFr: "Koweït", nameEs: "Kuwait", namePt: "Kuwait", nameDe: "Kuwait", isArab: true },
  { code: "MA", name: "Morocco", nameAr: "المغرب", nameFr: "Maroc", nameEs: "Marruecos", namePt: "Marrocos", nameDe: "Marokko", isArab: true },
  { code: "YE", name: "Yemen", nameAr: "اليمن", nameFr: "Yémen", nameEs: "Yemen", namePt: "Iémen", nameDe: "Jemen", isArab: true },
  { code: "TN", name: "Tunisia", nameAr: "تونس", nameFr: "Tunisie", nameEs: "Túnez", namePt: "Tunísia", nameDe: "Tunesien", isArab: true },
  { code: "KM", name: "Comoros", nameAr: "جزر القمر", nameFr: "Comores", nameEs: "Comoras", namePt: "Comores", nameDe: "Komoren", isArab: true },
  { code: "DJ", name: "Djibouti", nameAr: "جيبوتي", nameFr: "Djibouti", nameEs: "Yibuti", namePt: "Djibuti", nameDe: "Dschibuti", isArab: true },
  { code: "SY", name: "Syria", nameAr: "سوريا", nameFr: "Syrie", nameEs: "Siria", namePt: "Síria", nameDe: "Syrien", isArab: true },
  { code: "OM", name: "Oman", nameAr: "عُمان", nameFr: "Oman", nameEs: "Omán", namePt: "Omã", nameDe: "Oman", isArab: true },
  { code: "PS", name: "Palestine", nameAr: "فلسطين", nameFr: "Palestine", nameEs: "Palestina", namePt: "Palestina", nameDe: "Palästina", isArab: true },
  { code: "QA", name: "Qatar", nameAr: "قطر", nameFr: "Qatar", nameEs: "Catar", namePt: "Catar", nameDe: "Katar", isArab: true },
  { code: "LB", name: "Lebanon", nameAr: "لبنان", nameFr: "Liban", nameEs: "Líbano", namePt: "Líbano", nameDe: "Libanon", isArab: true },
  { code: "LY", name: "Libya", nameAr: "ليبيا", nameFr: "Libye", nameEs: "Libia", namePt: "Líbia", nameDe: "Libyen", isArab: true },
  { code: "MR", name: "Mauritania", nameAr: "موريتانيا", nameFr: "Mauritanie", nameEs: "Mauritania", namePt: "Mauritânia", nameDe: "Mauretanien", isArab: true },
  { code: "EG", name: "Egypt", nameAr: "مصر", nameFr: "Égypte", nameEs: "Egipto", namePt: "Egito", nameDe: "Ägypten", isArab: true },
  { code: "JP", name: "Japan", nameAr: "اليابان", nameFr: "Japon", nameEs: "Japón", namePt: "Japão", nameDe: "Japan", isArab: false },
  { code: "US", name: "USA", nameAr: "أمريكا", nameFr: "États-Unis", nameEs: "Estados Unidos", namePt: "Estados Unidos", nameDe: "USA", isArab: false },
  { code: "PH", name: "Philippines", nameAr: "الفلبين", nameFr: "Philippines", nameEs: "Filipinas", namePt: "Filipinas", nameDe: "Philippinen", isArab: false },
  { code: "NE", name: "Niger", nameAr: "النيجر", nameFr: "Niger", nameEs: "Níger", namePt: "Níger", nameDe: "Niger", isArab: false },
  { code: "BA", name: "Bosnia", nameAr: "البوسنة", nameFr: "BIH", nameEs: "BIH", namePt: "BIH", nameDe: "BIH", isArab: false },
  { code: "BS", name: "Bahamas", nameAr: "الباهاماس", nameFr: "Bahamas", nameEs: "Bahamas", namePt: "Bahamas", nameDe: "Bahamas", isArab: false },
  { code: "CZ", name: "Czech Republic", nameAr: "التشيك", nameFr: "République tchèque", nameEs: "República Checa", namePt: "Chéquia", nameDe: "Tschechien", isArab: false },
  { code: "HU", name: "Hungary", nameAr: "المجر", nameFr: "Hongrie", nameEs: "Hungría", namePt: "Hungria", nameDe: "Ungarn", isArab: false },
  { code: "GR", name: "Greece", nameAr: "اليونان", nameFr: "Grèce", nameEs: "Grecia", namePt: "Grécia", nameDe: "Griechenland", isArab: false },
  { code: "CV", name: "Cape Verde", nameAr: "الرأس الأخضر", nameFr: "Cap-Vert", nameEs: "Cabo Verde", namePt: "Cabo Verde", nameDe: "Kap Verde", isArab: false },
  { code: "AT", name: "Austria", nameAr: "النمسا", nameFr: "Autriche", nameEs: "Austria", namePt: "Áustria", nameDe: "Österreich", isArab: false },
  { code: "IN", name: "India", nameAr: "الهند", nameFr: "Inde", nameEs: "India", namePt: "Índia", nameDe: "Indien", isArab: false },
  { code: "ME", name: "Montenegro", nameAr: "الجبل الأسود", nameFr: "Monténégro", nameEs: "Montenegro", namePt: "Montenegro", nameDe: "Montenegro", isArab: false },
  { code: "SV", name: "El Salvador", nameAr: "السلفادور", nameFr: "El Salvador", nameEs: "El Salvador", namePt: "El Salvador", nameDe: "El Salvador", isArab: false },
  { code: "AR", name: "Argentina", nameAr: "الأرجنتين", nameFr: "Argentine", nameEs: "Argentina", namePt: "Argentina", nameDe: "Argentinien", isArab: false },
  { code: "UY", name: "Uruguay", nameAr: "الأوروغواي", nameFr: "Uruguay", nameEs: "Uruguay", namePt: "Uruguai", nameDe: "Uruguay", isArab: false },
  { code: "VA", name: "Vatican City", nameAr: "الفاتيكان", nameFr: "Vatican", nameEs: "Vaticano", namePt: "Vaticano", nameDe: "Vatikanstadt", isArab: false },
  { code: "GA", name: "Gabon", nameAr: "الغابون", nameFr: "Gabon", nameEs: "Gabón", namePt: "Gabão", nameDe: "Gabun", isArab: false },
  { code: "EC", name: "Ecuador", nameAr: "الإكوادور", nameFr: "Équateur", nameEs: "Ecuador", namePt: "Equador", nameDe: "Ecuador", isArab: false },
  { code: "DK", name: "Denmark", nameAr: "الدنمارك", nameFr: "Danemark", nameEs: "Dinamarca", namePt: "Dinamarca", nameDe: "Dänemark", isArab: false },
  { code: "CM", name: "Cameroon", nameAr: "الكاميرون", nameFr: "Cameroun", nameEs: "Camerún", namePt: "Camarões", nameDe: "Kamerun", isArab: false },
  { code: "CN", name: "China", nameAr: "الصين", nameFr: "Chine", nameEs: "China", namePt: "China", nameDe: "China", isArab: false },
  { code: "SE", name: "Sweden", nameAr: "السويد", nameFr: "Suède", nameEs: "Suecia", namePt: "Suécia", nameDe: "Schweden", isArab: false },
  { code: "NO", name: "Norway", nameAr: "النرويج", nameFr: "Norvège", nameEs: "Noruega", namePt: "Noruega", nameDe: "Norwegen", isArab: false },
  { code: "SN", name: "Senegal", nameAr: "السنغال", nameFr: "Sénégal", nameEs: "Senegal", namePt: "Senegal", nameDe: "Senegal", isArab: false },
  { code: "PT", name: "Portugal", nameAr: "البرتغال", nameFr: "Portugal", nameEs: "Portugal", namePt: "Portugal", nameDe: "Portugal", isArab: false },
  { code: "BR", name: "Brazil", nameAr: "البرازيل", nameFr: "Brésil", nameEs: "Brasil", namePt: "Brasil", nameDe: "Brasilien", isArab: false },
  { code: "GB", name: "United Kingdom", nameAr: "إنجلترا", nameFr: "Royaume-Uni", nameEs: "Reino Unido", namePt: "Reino Unido", nameDe: "Vereinigtes Königreich", isArab: false },
  { code: "MX", name: "Mexico", nameAr: "المكسيك", nameFr: "Mexique", nameEs: "México", namePt: "México", nameDe: "Mexiko", isArab: false },
  { code: "DE", name: "Germany", nameAr: "ألمانيا", nameFr: "Allemagne", nameEs: "Alemania", namePt: "Alemanha", nameDe: "Deutschland", isArab: false },
  { code: "IS", name: "Iceland", nameAr: "أيسلندا", nameFr: "Islande", nameEs: "Islandia", namePt: "Islândia", nameDe: "Island", isArab: false },
  { code: "UA", name: "Ukraine", nameAr: "أوكرانيا", nameFr: "Ukraine", nameEs: "Ucrania", namePt: "Ucrânia", nameDe: "Ukraine", isArab: false },
  { code: "AO", name: "Angola", nameAr: "أنغولا", nameFr: "Angola", nameEs: "Angola", namePt: "Angola", nameDe: "Angola", isArab: false },
  { code: "UG", name: "Uganda", nameAr: "أوغندا", nameFr: "Ouganda", nameEs: "Uganda", namePt: "Uganda", nameDe: "Uganda", isArab: false },
  { code: "AL", name: "Albania", nameAr: "ألبانيا", nameFr: "Albanie", nameEs: "Albania", namePt: "Albânia", nameDe: "Albanien", isArab: false },
  { code: "AZ", name: "Azerbaijan", nameAr: "أذربيجان", nameFr: "Azerbaïdjan", nameEs: "Azerbaiyán", namePt: "Azerbaijão", nameDe: "Aserbaidschan", isArab: false },
  { code: "AD", name: "Andorra", nameAr: "أندورا", nameFr: "Andorre", nameEs: "Andorra", namePt: "Andorra", nameDe: "Andorra", isArab: false },
  { code: "AU", name: "Australia", nameAr: "أستراليا", nameFr: "Australie", nameEs: "Australia", namePt: "Austrália", nameDe: "Australien", isArab: false },
  { code: "AG", name: "Antigua", nameAr: "أنتيغوا", nameFr: "ATG", nameEs: "ATG", namePt: "ATG", nameDe: "ATG", isArab: false },
  { code: "AM", name: "Armenia", nameAr: "أرمينيا", nameFr: "Arménie", nameEs: "Armenia", namePt: "Arménia", nameDe: "Armenien", isArab: false },
  { code: "UZ", name: "Uzbekistan", nameAr: "أوزبكستان", nameFr: "Ouzbékistan", nameEs: "Uzbekistán", namePt: "Uzbequistão", nameDe: "Usbekistan", isArab: false },
  { code: "AF", name: "Afghanistan", nameAr: "أفغانستان", nameFr: "Afghanistan", nameEs: "Afganistán", namePt: "Afeganistão", nameDe: "Afghanistan", isArab: false },
  { code: "ID", name: "Indonesia", nameAr: "إندونيسيا", nameFr: "Indonésie", nameEs: "Indonesia", namePt: "Indonésia", nameDe: "Indonesien", isArab: false },
  { code: "EE", name: "Estonia", nameAr: "إستونيا", nameFr: "Estonie", nameEs: "Estonia", namePt: "Estónia", nameDe: "Estland", isArab: false },
  { code: "ES", name: "Spain", nameAr: "إسبانيا", nameFr: "Espagne", nameEs: "España", namePt: "Espanha", nameDe: "Spanien", isArab: false },
  { code: "IE", name: "Ireland", nameAr: "إيرلندا", nameFr: "Irlande", nameEs: "Irlanda", namePt: "Irlanda", nameDe: "Irland", isArab: false },
  { code: "ER", name: "Eritrea", nameAr: "إريتريا", nameFr: "Érythrée", nameEs: "Eritrea", namePt: "Eritreia", nameDe: "Eritrea", isArab: false },
  { code: "IR", name: "Iran", nameAr: "إيران", nameFr: "Iran", nameEs: "Irán", namePt: "Irão", nameDe: "Iran", isArab: false },
  { code: "ET", name: "Ethiopia", nameAr: "إثيوبيا", nameFr: "Éthiopie", nameEs: "Etiopía", namePt: "Etiópia", nameDe: "Äthiopien", isArab: false },
  { code: "IT", name: "Italy", nameAr: "إيطاليا", nameFr: "Italie", nameEs: "Italia", namePt: "Itália", nameDe: "Italien", isArab: false },
  { code: "PW", name: "Palau", nameAr: "بالاو", nameFr: "Palaos", nameEs: "Palaos", namePt: "Palau", nameDe: "Palau", isArab: false },
  { code: "PG", name: "PNG", nameAr: "بابوا", nameFr: "PNG", nameEs: "PNG", namePt: "PNG", nameDe: "Papua Neuguinea", isArab: false },
  { code: "BW", name: "Botswana", nameAr: "بوتسوانا", nameFr: "Botswana", nameEs: "Botsuana", namePt: "Botsuana", nameDe: "Botswana", isArab: false },
  { code: "BJ", name: "Benin", nameAr: "بنين", nameFr: "Bénin", nameEs: "Benín", namePt: "Benim", nameDe: "Benin", isArab: false },
  { code: "BI", name: "Burundi", nameAr: "بوروندي", nameFr: "Burundi", nameEs: "Burundi", namePt: "Burundi", nameDe: "Burundi", isArab: false },
  { code: "PK", name: "Pakistan", nameAr: "باكستان", nameFr: "Pakistan", nameEs: "Pakistán", namePt: "Paquistão", nameDe: "Pakistan", isArab: false },
  { code: "BT", name: "Bhutan", nameAr: "بوتان", nameFr: "Bhoutan", nameEs: "Bután", namePt: "Butão", nameDe: "Bhutan", isArab: false },
  { code: "BB", name: "Barbados", nameAr: "باربادوس", nameFr: "Barbade", nameEs: "Barbados", namePt: "Barbados", nameDe: "Barbados", isArab: false },
  { code: "BZ", name: "Belize", nameAr: "بليز", nameFr: "Belize", nameEs: "Belice", namePt: "Belize", nameDe: "Belize", isArab: false },
  { code: "BN", name: "Brunei", nameAr: "بروناي", nameFr: "Brunei", nameEs: "Brunéi", namePt: "Brunei", nameDe: "Brunei", isArab: false },
  { code: "PE", name: "Peru", nameAr: "بيرو", nameFr: "Pérou", nameEs: "Perú", namePt: "Peru", nameDe: "Peru", isArab: false },
  { code: "BO", name: "Bolivia", nameAr: "بوليفيا", nameFr: "Bolivie", nameEs: "Bolivia", namePt: "Bolívia", nameDe: "Bolivien", isArab: false },
  { code: "PY", name: "Paraguay", nameAr: "باراغواي", nameFr: "Paraguay", nameEs: "Paraguay", namePt: "Paraguai", nameDe: "Paraguay", isArab: false },
  { code: "BE", name: "Belgium", nameAr: "بلجيكا", nameFr: "Belgique", nameEs: "Bélgica", namePt: "Bélgica", nameDe: "Belgien", isArab: false },
  { code: "BG", name: "Bulgaria", nameAr: "بلغاريا", nameFr: "Bulgarie", nameEs: "Bulgaria", namePt: "Bulgária", nameDe: "Bulgarien", isArab: false },
  { code: "BD", name: "Bangladesh", nameAr: "بنغلاديش", nameFr: "Bangladesh", nameEs: "Bangladés", namePt: "Bangladesh", nameDe: "Bangladesch", isArab: false },
  { code: "PL", name: "Poland", nameAr: "بولندا", nameFr: "Pologne", nameEs: "Polonia", namePt: "Polónia", nameDe: "Polen", isArab: false },
  { code: "BF", name: "Burkina Faso", nameAr: "بوركينا فاسو", nameFr: "Burkina Faso", nameEs: "Burkina Faso", namePt: "Burquina Faso", nameDe: "Burkina Faso", isArab: false },
  { code: "PA", name: "Panama", nameAr: "بنما", nameFr: "Panama", nameEs: "Panamá", namePt: "Panamá", nameDe: "Panama", isArab: false },
  { code: "TH", name: "Thailand", nameAr: "تايلاند", nameFr: "Thaïlande", nameEs: "Tailandia", namePt: "Tailândia", nameDe: "Thailand", isArab: false },
  { code: "TZ", name: "Tanzania", nameAr: "تنزانيا", nameFr: "Tanzanie", nameEs: "Tanzania", namePt: "Tanzânia", nameDe: "Tansania", isArab: false },
  { code: "CL", name: "Chile", nameAr: "تشيلي", nameFr: "Chili", nameEs: "Chile", namePt: "Chile", nameDe: "Chile", isArab: false },
  { code: "TR", name: "Turkey", nameAr: "تركيا", nameFr: "Turquie", nameEs: "Turquía", namePt: "Turquia", nameDe: "Türkei", isArab: false },
  { code: "TL", name: "Timor-Leste", nameAr: "تيمور", nameFr: "Timor oriental", nameEs: "Timor Oriental", namePt: "Timor-Leste", nameDe: "Osttimor", isArab: false },
  { code: "TT", name: "Trinidad", nameAr: "ترينيداد", nameFr: "TTO", nameEs: "TTO", namePt: "TTO", nameDe: "TTO", isArab: false },
  { code: "TW", name: "Taiwan", nameAr: "تايوان", nameFr: "Taïwan", nameEs: "Taiwán", namePt: "Taiwan", nameDe: "Taiwan", isArab: false },
  { code: "TG", name: "Togo", nameAr: "توغو", nameFr: "Togo", nameEs: "Togo", namePt: "Togo", nameDe: "Togo", isArab: false },
  { code: "TM", name: "Turkmenistan", nameAr: "تركمانستان", nameFr: "Turkménistan", nameEs: "Turkmenistán", namePt: "Turquemenistão", nameDe: "Turkmenistan", isArab: false },
  { code: "TV", name: "Tuvalu", nameAr: "توفالو", nameFr: "Tuvalu", nameEs: "Tuvalu", namePt: "Tuvalu", nameDe: "Tuvalu", isArab: false },
  { code: "TO", name: "Tonga", nameAr: "تونغا", nameFr: "Tonga", nameEs: "Tonga", namePt: "Tonga", nameDe: "Tonga", isArab: false },
  { code: "TD", name: "Chad", nameAr: "تشاد", nameFr: "Tchad", nameEs: "Chad", namePt: "Chade", nameDe: "Tschad", isArab: false },
  { code: "CD", name: "DR Congo", nameAr: "الكونغو كنشاسا", nameFr: "DRC", nameEs: "DRC", namePt: "DRC", nameDe: "DRC", isArab: false },
  { code: "CG", name: "Congo", nameAr: "الكونغو", nameFr: "Congo", nameEs: "Congo", namePt: "Congo", nameDe: "Kongo", isArab: false },
  { code: "MV", name: "Maldives", nameAr: "المالديف", nameFr: "Maldives", nameEs: "Maldivas", namePt: "Maldivas", nameDe: "Malediven", isArab: false },
  { code: "ZA", name: "South Africa", nameAr: "جنوب أفريقيا", nameFr: "Afrique du Sud", nameEs: "Sudáfrica", namePt: "África do Sul", nameDe: "Südafrika", isArab: false },
  { code: "KI", name: "Kiribati", nameAr: "كيريباتي", nameFr: "Kiribati", nameEs: "Kiribati", namePt: "Kiribati", nameDe: "Kiribati", isArab: false },
  { code: "CF", name: "CAR", nameAr: "أفريقيا الوسطى", nameFr: "CAF", nameEs: "CAF", namePt: "CAF", nameDe: "CAF", isArab: false },
  { code: "DO", name: "Dominica", nameAr: "الدومينيكان", nameFr: "DOM", nameEs: "DOM", namePt: "DOM", nameDe: "DOM", isArab: false },
  { code: "SS", name: "South Sudan", nameAr: "جنوب السودان", nameFr: "Soudan du Sud", nameEs: "Sudán del Sur", namePt: "Sudão do Sul", nameDe: "Südsudan", isArab: false },
  { code: "MH", name: "Marshall Islands", nameAr: "جزر مارشال", nameFr: "Îles Marshall", nameEs: "Islas Marshall", namePt: "Ilhas Marshall", nameDe: "Marshallinseln", isArab: false },
  { code: "GE", name: "Georgia", nameAr: "جورجيا", nameFr: "Géorgie", nameEs: "Georgia", namePt: "Geórgia", nameDe: "Georgien", isArab: false },
  { code: "JM", name: "Jamaica", nameAr: "جامايكا", nameFr: "Jamaïque", nameEs: "Jamaica", namePt: "Jamaica", nameDe: "Jamaika", isArab: false },
  { code: "SB", name: "Solomon Islands", nameAr: "جزر سليمان", nameFr: "Îles Salomon", nameEs: "Islas Salomón", namePt: "Ilhas Salomão", nameDe: "Salomonen", isArab: false },
  { code: "DM", name: "Dominica", nameAr: "دومينيكا", nameFr: "Dominique", nameEs: "Dominica", namePt: "Dominica", nameDe: "Dominica", isArab: false },
  { code: "RO", name: "Romania", nameAr: "رومانيا", nameFr: "Roumanie", nameEs: "Rumania", namePt: "Roménia", nameDe: "Rumänien", isArab: false },
  { code: "RW", name: "Rwanda", nameAr: "رواندا", nameFr: "Rwanda", nameEs: "Ruanda", namePt: "Ruanda", nameDe: "Ruanda", isArab: false },
  { code: "RU", name: "Russia", nameAr: "روسيا", nameFr: "Russie", nameEs: "Rusia", namePt: "Rússia", nameDe: "Russland", isArab: false },
  { code: "BY", name: "Belarus", nameAr: "بيلاروسيا", nameFr: "Biélorussie", nameEs: "Bielorrusia", namePt: "Bielorrússia", nameDe: "Belarus", isArab: false },
  { code: "ZW", name: "Zimbabwe", nameAr: "زيمبابوي", nameFr: "Zimbabwe", nameEs: "Zimbabue", namePt: "Zimbábue", nameDe: "Simbabwe", isArab: false },
  { code: "ZM", name: "Zambia", nameAr: "زامبيا", nameFr: "Zambie", nameEs: "Zambia", namePt: "Zâmbia", nameDe: "Sambia", isArab: false },
  { code: "LK", name: "Sri Lanka", nameAr: "سريلانكا", nameFr: "Sri Lanka", nameEs: "Sri Lanka", namePt: "Sri Lanka", nameDe: "Sri Lanka", isArab: false },
  { code: "SZ", name: "Eswatini", nameAr: "إسواتيني", nameFr: "Eswatini", nameEs: "Eswatini", namePt: "Eswatini", nameDe: "Eswatini", isArab: false },
  { code: "SC", name: "Seychelles", nameAr: "سيشل", nameFr: "Seychelles", nameEs: "Seychelles", namePt: "Seychelles", nameDe: "Seychellen", isArab: false },
  { code: "SG", name: "Singapore", nameAr: "سنغافورة", nameFr: "Singapour", nameEs: "Singapur", namePt: "Cingapura", nameDe: "Singapur", isArab: false },
  { code: "KN", name: "St. Kitts", nameAr: "سانت كيتس", nameFr: "KNA", nameEs: "KNA", namePt: "KNA", nameDe: "KNA", isArab: false },
  { code: "SK", name: "Slovakia", nameAr: "سلوفاكيا", nameFr: "Slovaquie", nameEs: "Eslovaquia", namePt: "Eslováquia", nameDe: "Slowakei", isArab: false },
  { code: "WS", name: "Samoa", nameAr: "ساموا", nameFr: "Samoa", nameEs: "Samoa", namePt: "Samoa", nameDe: "Samoa", isArab: false },
  { code: "SM", name: "San Marino", nameAr: "سان مارينو", nameFr: "Saint-Marin", nameEs: "San Marino", namePt: "San Marino", nameDe: "San Marino", isArab: false },
  { code: "ST", name: "Sao Tome", nameAr: "ساو تومي", nameFr: "STP", nameEs: "STP", namePt: "STP", nameDe: "STP", isArab: false },
  { code: "SI", name: "Slovenia", nameAr: "سلوفينيا", nameFr: "Slovénie", nameEs: "Eslovenia", namePt: "Eslovénia", nameDe: "Slowenien", isArab: false },
  { code: "CH", name: "Switzerland", nameAr: "سويسرا", nameFr: "Suisse", nameEs: "Suiza", namePt: "Suíça", nameDe: "Schweiz", isArab: false },
  { code: "SR", name: "Suriname", nameAr: "سورينام", nameFr: "Suriname", nameEs: "Surinam", namePt: "Suriname", nameDe: "Suriname", isArab: false },
  { code: "VC", name: "St. Vincent", nameAr: "سانت فينسنت", nameFr: "SVG", nameEs: "SVG", namePt: "SVG", nameDe: "SVG", isArab: false },
  { code: "LC", name: "Saint Lucia", nameAr: "سانت لوسيا", nameFr: "Sainte-Lucie", nameEs: "Santa Lucía", namePt: "Santa Lúcia", nameDe: "St. Lucia", isArab: false },
  { code: "SL", name: "Sierra Leone", nameAr: "سيراليون", nameFr: "Sierra Leone", nameEs: "Sierra Leona", namePt: "Serra Leoa", nameDe: "Sierra Leone", isArab: false },
  { code: "CI", name: "Ivory Coast", nameAr: "ساحل العاج", nameFr: "Côte d'Ivoire", nameEs: "Costa de Marfil", namePt: "Costa do Marfim", nameDe: "Elfenbeinküste", isArab: false },
  { code: "RS", name: "Serbia", nameAr: "صربيا", nameFr: "Serbie", nameEs: "Serbia", namePt: "Sérvia", nameDe: "Serbien", isArab: false },
  { code: "TJ", name: "Tajikistan", nameAr: "طاجيكستان", nameFr: "Tadjikistan", nameEs: "Tayikistán", namePt: "Tajiquistão", nameDe: "Tadschikistan", isArab: false },
  { code: "GT", name: "Guatemala", nameAr: "غواتيمالا", nameFr: "Guatemala", nameEs: "Guatemala", namePt: "Guatemala", nameDe: "Guatemala", isArab: false },
  { code: "GY", name: "Guyana", nameAr: "غيانا", nameFr: "Guyana", nameEs: "Guyana", namePt: "Guiana", nameDe: "Guyana", isArab: false },
  { code: "GQ", name: "Eq. Guinea", nameAr: "غينيا الاستوائية", nameFr: "GNQ", nameEs: "GNQ", namePt: "GNQ", nameDe: "Äquatorialguinea", isArab: false },
  { code: "GD", name: "Grenada", nameAr: "غرينادا", nameFr: "Grenade", nameEs: "Granada", namePt: "Granada", nameDe: "Grenada", isArab: false },
  { code: "GM", name: "Gambia", nameAr: "غامبيا", nameFr: "Gambie", nameEs: "Gambia", namePt: "Gâmbia", nameDe: "Gambia", isArab: false },
  { code: "GW", name: "Guinea-Bissau", nameAr: "غينيا بيساو", nameFr: "Guinée-Bissau", nameEs: "Guinea-Bisáu", namePt: "Guiné-Bissau", nameDe: "Guinea-Bissau", isArab: false },
  { code: "GH", name: "Ghana", nameAr: "غانا", nameFr: "Ghana", nameEs: "Ghana", namePt: "Gana", nameDe: "Ghana", isArab: false },
  { code: "GN", name: "Guinea", nameAr: "غينيا", nameFr: "Guinée", nameEs: "Guinea", namePt: "Guiné", nameDe: "Guinea", isArab: false },
  { code: "VU", name: "Vanuatu", nameAr: "فانواتو", nameFr: "Vanuatu", nameEs: "Vanuatu", namePt: "Vanuatu", nameDe: "Vanuatu", isArab: false },
  { code: "FJ", name: "Fiji", nameAr: "فيجي", nameFr: "Fidji", nameEs: "Fiyi", namePt: "Fiji", nameDe: "Fidschi", isArab: false },
  { code: "FI", name: "Finland", nameAr: "فنلندا", nameFr: "Finlande", nameEs: "Finlandia", namePt: "Finlândia", nameDe: "Finnland", isArab: false },
  { code: "VN", name: "Vietnam", nameAr: "فيتنام", nameFr: "Viêt Nam", nameEs: "Vietnam", namePt: "Vietname", nameDe: "Vietnam", isArab: false },
  { code: "FR", name: "France", nameAr: "فرنسا", nameFr: "France", nameEs: "Francia", namePt: "França", nameDe: "Frankreich", isArab: false },
  { code: "VE", name: "Venezuela", nameAr: "فنزويلا", nameFr: "Venezuela", nameEs: "Venezuela", namePt: "Venezuela", nameDe: "Venezuela", isArab: false },
  { code: "CY", name: "Cyprus", nameAr: "قبرص", nameFr: "Chypre", nameEs: "Chipre", namePt: "Chipre", nameDe: "Zypern", isArab: false },
  { code: "KG", name: "Kyrgyzstan", nameAr: "قيرغيزستان", nameFr: "Kirghizistan", nameEs: "Kirguistán", namePt: "Quirguistão", nameDe: "Kirgisistan", isArab: false },
  { code: "KE", name: "Kenya", nameAr: "كينيا", nameFr: "Kenya", nameEs: "Kenia", namePt: "Quénia", nameDe: "Kenia", isArab: false },
  { code: "XK", name: "Kosovo", nameAr: "كوسوفو", nameFr: "Kosovo", nameEs: "Kosovo", namePt: "Kosovo", nameDe: "Kosovo", isArab: false },
  { code: "CR", name: "Costa Rica", nameAr: "كوستاريكا", nameFr: "Costa Rica", nameEs: "Costa Rica", namePt: "Costa Rica", nameDe: "Costa Rica", isArab: false },
  { code: "HR", name: "Croatia", nameAr: "كرواتيا", nameFr: "Croatie", nameEs: "Croacia", namePt: "Croácia", nameDe: "Kroatien", isArab: false },
  { code: "KH", name: "Cambodia", nameAr: "كمبوديا", nameFr: "Cambodge", nameEs: "Camboya", namePt: "Camboja", nameDe: "Kambodscha", isArab: false },
  { code: "CA", name: "Canada", nameAr: "كندا", nameFr: "Canada", nameEs: "Canadá", namePt: "Canadá", nameDe: "Kanada", isArab: false },
  { code: "CU", name: "Cuba", nameAr: "كوبا", nameFr: "Cuba", nameEs: "Cuba", namePt: "Cuba", nameDe: "Kuba", isArab: false },
  { code: "KZ", name: "Kazakhstan", nameAr: "كازاخستان", nameFr: "Kazakhstan", nameEs: "Kazajistán", namePt: "Cazaquistão", nameDe: "Kasachstan", isArab: false },
  { code: "KR", name: "South Korea", nameAr: "كوريا الجنوبية", nameFr: "Corée du Sud", nameEs: "Corea del Sur", namePt: "Coreia do Sul", nameDe: "Südkorea", isArab: false },
  { code: "KP", name: "North Korea", nameAr: "كوريا الشمالية", nameFr: "Corée du Nord", nameEs: "Corea del Nord", namePt: "Coreia do Norte", nameDe: "Nordkorea", isArab: false },
  { code: "CO", name: "Colombia", nameAr: "كولومبيا", nameFr: "Colombie", nameEs: "Colombia", namePt: "Colômbia", nameDe: "Kolumbien", isArab: false },
  { code: "LU", name: "Luxembourg", nameAr: "لوكسمبورغ", nameFr: "Luxembourg", nameEs: "Luxemburgo", namePt: "Luxemburgo", nameDe: "Luxemburg", isArab: false },
  { code: "LS", name: "Lesotho", nameAr: "ليسوتو", nameFr: "Lesotho", nameEs: "Lesoto", namePt: "Lesoto", nameDe: "Lesotho", isArab: false },
  { code: "LA", name: "Laos", nameAr: "لاوس", nameFr: "Laos", nameEs: "Laos", namePt: "Laos", nameDe: "Laos", isArab: false },
  { code: "LV", name: "Latvia", nameAr: "لاتفيا", nameFr: "Lettonie", nameEs: "Letonia", namePt: "Letónia", nameDe: "Lettland", isArab: false },
  { code: "LT", name: "Lithuania", nameAr: "ليتوانيا", nameFr: "Lituanie", nameEs: "Lituania", namePt: "Lituânia", nameDe: "Litauen", isArab: false },
  { code: "LR", name: "Liberia", nameAr: "ليبيريا", nameFr: "Libéria", nameEs: "Liberia", namePt: "Libéria", nameDe: "Liberia", isArab: false },
  { code: "LI", name: "Liechtenstein", nameAr: "ليختنشتاين", nameFr: "Liechtenstein", nameEs: "Liechtenstein", namePt: "Liechtenstein", nameDe: "Liechtenstein", isArab: false },
  { code: "ML", name: "Mali", nameAr: "مالي", nameFr: "Mali", nameEs: "Mali", namePt: "Mali", nameDe: "Mali", isArab: false },
  { code: "MZ", name: "Mozambique", nameAr: "موزمبيق", nameFr: "Mozambique", nameEs: "Mozambique", namePt: "Moçambique", nameDe: "Mosambik", isArab: false },
  { code: "MM", name: "Myanmar", nameAr: "ميانمار", nameFr: "Myanmar", nameEs: "Myanmar", namePt: "Myanmar", nameDe: "Myanmar", isArab: false },
  { code: "MK", name: "Macedonia", nameAr: "مقدونيا", nameFr: "Macédoine", nameEs: "Macedonia", namePt: "Macedónia", nameDe: "Nordmazedonien", isArab: false },
  { code: "MD", name: "Moldova", nameAr: "مولدافيا", nameFr: "Moldavie", nameEs: "Moldavia", namePt: "Moldávia", nameDe: "Moldawien", isArab: false },
  { code: "MW", name: "Malawi", nameAr: "مالاوي", nameFr: "Malawi", nameEs: "Malaui", namePt: "Malaui", nameDe: "Malawi", isArab: false },
  { code: "MU", name: "Mauritius", nameAr: "موريشيوس", nameFr: "Maurice", nameEs: "Mauricio", namePt: "Maurício", nameDe: "Mauritius", isArab: false },
  { code: "MT", name: "Malta", nameAr: "مالطا", nameFr: "Malte", nameEs: "Malta", namePt: "Malta", nameDe: "Malta", isArab: false },
  { code: "MC", name: "Monaco", nameAr: "موناكو", nameFr: "Monaco", nameEs: "Mónaco", namePt: "Mónaco", nameDe: "Monaco", isArab: false },
  { code: "MO", name: "Macau", nameAr: "ماكاو", nameFr: "Macao", nameEs: "Macao", namePt: "Macau", nameDe: "Macau", isArab: false },
  { code: "MG", name: "Madagascar", nameAr: "مدغشقر", nameFr: "Madagascar", nameEs: "Madagascar", namePt: "Madagáscar", nameDe: "Madagaskar", isArab: false },
  { code: "MY", name: "Malaysia", nameAr: "ماليزيا", nameFr: "Malaisie", nameEs: "Malasia", namePt: "Malásia", nameDe: "Malaysia", isArab: false },
  { code: "MN", name: "Mongolia", nameAr: "منغوليا", nameFr: "Mongolie", nameEs: "Mongolia", namePt: "Mongólia", nameDe: "Mongolei", isArab: false },
  { code: "NZ", name: "New Zealand", nameAr: "نيوزيلندا", nameFr: "Nouvelle-Zélande", nameEs: "Nueva Zelanda", namePt: "Nova Zelândia", nameDe: "Neuseeland", isArab: false },
  { code: "NG", name: "Nigeria", nameAr: "نيجيريا", nameFr: "Nigéria", nameEs: "Nigeria", namePt: "Nigéria", nameDe: "Nigeria", isArab: false },
  { code: "NI", name: "Nicaragua", nameAr: "نيكاراغوا", nameFr: "Nicaragua", nameEs: "Nicaragua", namePt: "Nicarágua", nameDe: "Nicaragua", isArab: false },
  { code: "NR", name: "Nauru", nameAr: "ناورو", nameFr: "Nauru", nameEs: "Nauru", namePt: "Nauru", nameDe: "Nauru", isArab: false },
  { code: "NP", name: "Nepal", nameAr: "نيبال", nameFr: "Népal", nameEs: "Nepal", namePt: "Nepal", nameDe: "Nepal", isArab: false },
  { code: "NA", name: "Namibia", nameAr: "ناميبيا", nameFr: "Namibie", nameEs: "Namibia", namePt: "Namíbia", nameDe: "Namibia", isArab: false },
  { code: "HK", name: "Hong Kong", nameAr: "هونغ كونغ", nameFr: "Hong Kong", nameEs: "Hong Kong", namePt: "Hong Kong", nameDe: "Hongkong", isArab: false },
  { code: "HT", name: "Haiti", nameAr: "هايتي", nameFr: "Haïti", nameEs: "Haití", namePt: "Haiti", nameDe: "Haiti", isArab: false },
  { code: "NL", name: "Netherlands", nameAr: "هولندا", nameFr: "Pays-Bas", nameEs: "Países Bajos", namePt: "Países Baixos", nameDe: "Niederlande", isArab: false },
  { code: "HN", name: "Honduras", nameAr: "هندوراس", nameFr: "Honduras", nameEs: "Honduras", namePt: "Honduras", nameDe: "Honduras", isArab: false },
  { code: "FM", name: "Micronesia", nameAr: "ميكرونيسيا", nameFr: "Micronésie", nameEs: "Micronesia", namePt: "Micronésia", nameDe: "Mikronesien", isArab: false }
];

// ========== التصنيفات (مع ترجمات) ==========
const genresAsCountries = [
  { code: "GENRE_WORLDWIDE", name: "Worldwide", nameAr: "عالمي", nameFr: "Monde", nameEs: "Mundial", namePt: "Mundial", nameDe: "Weltweit", isGenre: true, genreKey: "عالمي" },
  { code: "GENRE_ISLAMIC", name: "Islamic", nameAr: "الإسلامية", nameFr: "Islamique", nameEs: "Islámica", namePt: "Islâmica", nameDe: "Islamisch", isGenre: true, genreKey: "الإسلامية" },
  { code: "GENRE_ARABIC", name: "Arabic", nameAr: "العربية", nameFr: "Arabe", nameEs: "Árabe", namePt: "Árabe", nameDe: "Arabisch", isGenre: true, genreKey: "العربية" },
  { code: "GENRE_TURKISH", name: "Turkish", nameAr: "التركية", nameFr: "Turque", nameEs: "Turca", namePt: "Turca", nameDe: "Türkisch", isGenre: true, genreKey: "التركية" },
  { code: "GENRE_BEST_SONGS", name: "Best Songs", nameAr: "أفضل الأغاني", nameFr: "Meilleures chansons", nameEs: "Mejores canciones", namePt: "Melhores músicas", nameDe: "Beste Lieder", isGenre: true, genreKey: "أفضل الأغاني" },
  { code: "GENRE_BLUES", name: "Blues", nameAr: "البلوز", nameFr: "Blues", nameEs: "Blues", namePt: "Blues", nameDe: "Blues", isGenre: true, genreKey: "البلوز" },
  { code: "GENRE_CLASSICAL", name: "Classical", nameAr: "الكلاسيكية", nameFr: "Classique", nameEs: "Clásica", namePt: "Clássica", nameDe: "Klassisch", isGenre: true, genreKey: "الكلاسيكية" },
  { code: "GENRE_DISCO", name: "Disco", nameAr: "الديسكو", nameFr: "Disco", nameEs: "Disco", namePt: "Disco", nameDe: "Disco", isGenre: true, genreKey: "الديسكو" },
  { code: "GENRE_FLAMENCO", name: "Flamenco", nameAr: "الفلامنكو", nameFr: "Flamenco", nameEs: "Flamenco", namePt: "Flamenco", nameDe: "Flamenco", isGenre: true, genreKey: "الفلامنكو" },
  { code: "GENRE_HIPHOP", name: "Hip Hop", nameAr: "الهيب هوب", nameFr: "Hip Hop", nameEs: "Hip Hop", namePt: "Hip Hop", nameDe: "Hip-Hop", isGenre: true, genreKey: "الهيب هوب" },
  { code: "GENRE_JAZZ", name: "Jazz", nameAr: "الجاز", nameFr: "Jazz", nameEs: "Jazz", namePt: "Jazz", nameDe: "Jazz", isGenre: true, genreKey: "الجاز" },
  { code: "GENRE_OPERA", name: "Opera", nameAr: "الأوبرا", nameFr: "Opéra", nameEs: "Ópera", namePt: "Ópera", nameDe: "Oper", isGenre: true, genreKey: "الأوبرا" },
  { code: "GENRE_POP", name: "Pop", nameAr: "البوب", nameFr: "Pop", nameEs: "Pop", namePt: "Pop", nameDe: "Pop", isGenre: true, genreKey: "البوب" },
  { code: "GENRE_RNB", name: "R&B", nameAr: "آر أند بي", nameFr: "R&B", nameEs: "R&B", namePt: "R&B", nameDe: "R&B", isGenre: true, genreKey: "آر أند بي" },
  { code: "GENRE_RAP", name: "Rap", nameAr: "الراب", nameFr: "Rap", nameEs: "Rap", namePt: "Rap", nameDe: "Rap", isGenre: true, genreKey: "الراب" },
  { code: "GENRE_ROCK", name: "Rock", nameAr: "الروك", nameFr: "Rock", nameEs: "Rock", namePt: "Rock", nameDe: "Rock", isGenre: true, genreKey: "الروك" },
  { code: "GENRE_SALSA", name: "Salsa", nameAr: "السالسا", nameFr: "Salsa", nameEs: "Salsa", namePt: "Salsa", nameDe: "Salsa", isGenre: true, genreKey: "السالسا" },
  { code: "GENRE_TANGO", name: "Tango", nameAr: "التانغو", nameFr: "Tango", nameEs: "Tango", namePt: "Tango", nameDe: "Tango", isGenre: true, genreKey: "التانغو" },
  { code: "GENRE_WORLD", name: "World Music", nameAr: "موسيقى العالم", nameFr: "Musique du monde", nameEs: "Música del mundo", namePt: "Música do mundo", nameDe: "Weltmusik", isGenre: true, genreKey: "موسيقى العالم" },
  { code: "GENRE_MUSIC", name: "Music", nameAr: "الموسيقى", nameFr: "Musique", nameEs: "Música", namePt: "Música", nameDe: "Musik", isGenre: true, genreKey: "الموسيقى" },
  { code: "GENRE_CLASSICS", name: "Classics", nameAr: "الكلاسيكيات", nameFr: "Classiques", nameEs: "Clásicos", namePt: "Clássicos", nameDe: "Klassiker", isGenre: true, genreKey: "الكلاسيكيات" },
  { code: "GENRE_VARIETY", name: "Variety", nameAr: "متنوع", nameFr: "Variété", nameEs: "Variedad", namePt: "Variedade", nameDe: "Vielfalt", isGenre: true, genreKey: "متنوع" },
  { code: "GENRE_COMEDY", name: "Comedy", nameAr: "الكوميديا", nameFr: "Comédie", nameEs: "Comedia", namePt: "Comédia", nameDe: "Komödie", isGenre: true, genreKey: "الكوميديا" },
  { code: "GENRE_DOCUMENTARY", name: "Documentary", nameAr: "الوثائقي", nameFr: "Documentaire", nameEs: "Documental", namePt: "Documentário", nameDe: "Dokumentation", isGenre: true, genreKey: "الوثائقي" },
  { code: "GENRE_DRAMA", name: "Drama", nameAr: "الدراما", nameFr: "Drame", nameEs: "Drama", namePt: "Drama", nameDe: "Drama", isGenre: true, genreKey: "الدراما" },
  { code: "GENRE_FOOD", name: "Food", nameAr: "الطعام", nameFr: "Cuisine", nameEs: "Comida", namePt: "Comida", nameDe: "Essen", isGenre: true, genreKey: "الطعام" },
  { code: "GENRE_HEALTH", name: "Health", nameAr: "الصحة", nameFr: "Santé", nameEs: "Salud", namePt: "Saúde", nameDe: "Gesundheit", isGenre: true, genreKey: "الصحة" },
  { code: "GENRE_KIDS", name: "Kids", nameAr: "الأطفال", nameFr: "Enfants", nameEs: "Niños", namePt: "Crianças", nameDe: "Kinder", isGenre: true, genreKey: "الأطفال" },
  { code: "GENRE_TRAVEL", name: "Travel", nameAr: "السفر", nameFr: "Voyage", nameEs: "Viajes", namePt: "Viagem", nameDe: "Reisen", isGenre: true, genreKey: "السفر" },
  { code: "GENRE_NEWS", name: "News", nameAr: "الأخبار", nameFr: "Actualités", nameEs: "Noticias", namePt: "Notícias", nameDe: "Nachrichten", isGenre: true, genreKey: "الأخبار" },
  { code: "GENRE_SPORTS", name: "Sports", nameAr: "الرياضة", nameFr: "Sport", nameEs: "Deportes", namePt: "Esportes", nameDe: "Sport", isGenre: true, genreKey: "الرياضة" },
  { code: "GENRE_BASKETBALL", name: "Basketball", nameAr: "كرة السلة", nameFr: "Basket-ball", nameEs: "Baloncesto", namePt: "Basquetebol", nameDe: "Basketball", isGenre: true, genreKey: "كرة السلة" },
  { code: "GENRE_FOOTBALL", name: "Football", nameAr: "كرة القدم", nameFr: "Football", nameEs: "Fútbol", namePt: "Futebol", nameDe: "Fußball", isGenre: true, genreKey: "كرة القدم" }
];

const allCountries = [...allCountriesList, ...genresAsCountries];

// في globals.js بعد تعريف المتغيرات العامة
function isMobile() {
    // نتحقق من عرض الشاشة أو من وجود Capacitor في بيئة الجوال
    return window.innerWidth <= 768 || (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}
window.isMobile = isMobile; // تصدير للاستخدام في ملفات أخرى

// دالة مخصصة لاستبدال window.prompt في Electron
window.customPrompt = function(message, defaultValue = '') {
    return new Promise((resolve) => {
        // إنشاء النافذة المنبثقة
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        const dialog = document.createElement('div');
        dialog.style.backgroundColor = '#0a2a44';
        dialog.style.borderRadius = '12px';
        dialog.style.padding = '25px';
        dialog.style.minWidth = '350px';
        dialog.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
        dialog.style.border = '1px solid #2563eb';
        dialog.style.textAlign = 'center';
        
        dialog.innerHTML = `
            <div style="color: #e0f2fe; margin-bottom: 20px; font-size: 16px;">${message}</div>
            <input type="text" id="customPromptInput" value="${defaultValue.replace(/"/g, '&quot;')}" style="width: 100%; padding: 10px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #2563eb; background: #071526; color: white; font-size: 14px; box-sizing: border-box;">
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="customPromptOk" style="background: #2563eb; border: none; color: white; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">${currentLanguage === 'ar' ? 'موافق' : 'OK'}</button>
                <button id="customPromptCancel" style="background: #4b5563; border: none; color: white; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">${currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        const input = dialog.querySelector('#customPromptInput');
        const okBtn = dialog.querySelector('#customPromptOk');
        const cancelBtn = dialog.querySelector('#customPromptCancel');
        
        input.focus();
        
        const close = (result) => {
            overlay.remove();
            resolve(result);
        };
        
        okBtn.addEventListener('click', () => close(input.value));
        cancelBtn.addEventListener('click', () => close(null));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') close(input.value);
        });
    });
};

// ========== استعادة آخر دولة مختارة من localStorage ==========
const savedCountry = localStorage.getItem('x6RadioLastCountry');
if (savedCountry) {
    const found = allCountries.find(c => c.code === savedCountry);
    currentFilterItem = found || null;
} else {
    currentFilterItem = null;
}

function getCountryDisplayName(item, lang) {
    if (!item) return '';
    if (!lang) lang = 'en';
    switch (lang) {
        case 'en': return item.name || '';
        case 'ar': return item.nameAr || item.name || '';
        case 'fr': return item.nameFr || item.name || '';
        case 'es': return item.nameEs || item.name || '';
        case 'de': return item.nameDe || item.name || '';
        case 'pt': return item.namePt || item.name || '';
        default: return item.name || '';
    }
}

function getAllCountryNameVariants(item) {
    if (!item) return [];
    const names = [];
    if (item.name) names.push(item.name.toLowerCase());
    if (item.nameAr) names.push(item.nameAr.toLowerCase());
    if (item.nameFr) names.push(item.nameFr.toLowerCase());
    if (item.nameEs) names.push(item.nameEs.toLowerCase());
    if (item.nameDe) names.push(item.nameDe.toLowerCase());
    if (item.namePt) names.push(item.namePt.toLowerCase());
    return names;
}

window.getCountryDisplayName = getCountryDisplayName;
window.getAllCountryNameVariants = getAllCountryNameVariants;