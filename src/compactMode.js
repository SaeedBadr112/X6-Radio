// ========== الوضع المصغر (Compact Mode) – إخفاء الزر أثناء المصغر ==========
let compactModeMenuItem = null;
let compactModeToggleBtn = null;
let originalWindowSize = { width: 950, height: 700 };
let wasFullScreen = false;

function updateCompactModeButtonText() {
    if (!compactModeToggleBtn) return;
    // استخدام t إن وجدت، وإلا استخدام currentLanguage مع قيمة افتراضية
    let text;
    if (typeof t === 'function') {
        text = t('compact_mode');
    } else {
        text = (typeof currentLanguage !== 'undefined' && currentLanguage === 'ar') ? 'وضع مصغر' : 'Compact Mode';
    }
    compactModeToggleBtn.innerHTML = `<i class="fas fa-compress-alt"></i> ${text}`;
}

async function setCompactMode(enable) {
    const menuBar = document.querySelector('.menu-bar');
    const mainHeader = document.querySelector('.main-header');
    const countriesPanel = document.querySelector('.countries-panel');
    const contentPanel = document.querySelector('.content-panel');
    const customTitleBar = document.getElementById('customTitleBar');
    
    if (enable) {
        // حفظ الحجم الحالي وحالة ملء الشاشة
        if (window.electronAPI?.getCurrentWindowSize) {
            const size = await window.electronAPI.getCurrentWindowSize();
            originalWindowSize = { width: size.width, height: size.height };
        } else {
            originalWindowSize = { width: window.innerWidth, height: window.innerHeight };
        }
        
        if (window.electronAPI?.isFullScreen) {
            wasFullScreen = await window.electronAPI.isFullScreen();
        } else if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
            wasFullScreen = true;
        } else {
            wasFullScreen = false;
        }

        // الخروج من ملء الشاشة إذا كانت مفعلة
        if (wasFullScreen) {
            if (window.electronAPI?.setFullScreen) {
                await window.electronAPI.setFullScreen(false);
                await new Promise(resolve => setTimeout(resolve, 300));
            } else if (document.exitFullscreen) {
                await document.exitFullscreen();
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }

        document.body.classList.add('compact-mode');
        
        // إخفاء العناصر يدوياً
        if (menuBar) menuBar.style.display = 'none';
        if (mainHeader) mainHeader.style.display = 'none';
        if (countriesPanel) countriesPanel.style.display = 'none';
        if (contentPanel) contentPanel.style.display = 'none';
        if (compactModeMenuItem) compactModeMenuItem.style.display = 'none';
        if (customTitleBar) customTitleBar.style.display = 'none';
        
        // تغيير حجم النافذة وإخفاء شريط القوائم الخاص بـ Electron
        if (window.electronAPI?.setWindowSize) {
            console.log('Attempting to set window size to 950x140');
            await window.electronAPI.setWindowSize(950, 140);
            if (window.electronAPI?.getCurrentWindowSize) {
                const newSize = await window.electronAPI.getCurrentWindowSize();
                console.log('New window size after setWindowSize:', newSize);
            }
        } else {
            window.resizeTo(950, 140);
        }

        // إخفاء شريط القوائم الخاص بـ Electron
        if (window.electronAPI && window.electronAPI.setMenuBarVisibility) {
            await window.electronAPI.setMenuBarVisibility(false);
        }

        // تحريك النافذة إلى أسفل يمين الشاشة
        try {
            const screenWidth = window.screen.availWidth || window.screen.width;
            const screenHeight = window.screen.availHeight || window.screen.height;
            const winWidth = 950;
            const winHeight = 140;
            const margin = 10;
            const x = screenWidth - winWidth - margin;
            const y = screenHeight - winHeight - margin;
            await window.electronAPI.setWindowPosition(x, y);
            console.log(`Window moved to bottom-right: (${x}, ${y})`);
        } catch (err) {
            console.warn('Failed to set window position:', err);
        }
        
        addFloatingRestoreButton();
    } else {
        // إلغاء الوضع المصغر
        document.body.classList.remove('compact-mode');
        
        // إظهار العناصر
        if (menuBar) menuBar.style.display = '';
        if (mainHeader) mainHeader.style.display = '';
        if (countriesPanel) countriesPanel.style.display = '';
        if (contentPanel) contentPanel.style.display = '';
        if (compactModeMenuItem) compactModeMenuItem.style.display = '';
        if (customTitleBar) customTitleBar.style.display = '';
        
        // استعادة الحجم الأصلي
        if (window.electronAPI?.setWindowPosition) {
            try {
                await window.electronAPI.setWindowPosition(0, 0);
                console.log('Window moved to top-left (0,0)');
            } catch (err) {
                console.warn('Failed to set window position to top-left:', err);
            }
        } else {
            try {
                window.moveTo(0, 0);
            } catch (e) {}
        }

        if (window.electronAPI?.setWindowSize) {
            console.log('Restoring window size to', originalWindowSize);
            await window.electronAPI.setWindowSize(originalWindowSize.width, originalWindowSize.height);
        } else {
            window.resizeTo(originalWindowSize.width, originalWindowSize.height);
        }
        
        // استعادة وضع ملء الشاشة إذا كان مفعلاً سابقاً
        if (wasFullScreen) {
            if (window.electronAPI?.setFullScreen) {
                await window.electronAPI.setFullScreen(true);
            } else if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
            wasFullScreen = false;
        }
        
        removeFloatingRestoreButton();

        // إظهار شريط القوائم الخاص بـ Electron عند الخروج
        if (window.electronAPI && window.electronAPI.setMenuBarVisibility) {
            await window.electronAPI.setMenuBarVisibility(true);
        }
    }
}

function addFloatingRestoreButton() {
    if (document.getElementById('compactFloatingBtn')) return;
    if (!document.body) return;

    if (!document.querySelector('#pulseGlowStyle')) {
        const style = document.createElement('style');
        style.id = 'pulseGlowStyle';
        style.textContent = `
            @keyframes pulseGlow {
                0% { box-shadow: 0 0 4px 2px #ef4444; opacity: 0.9; }
                50% { box-shadow: 0 0 18px 8px #ef4444; opacity: 1; }
                100% { box-shadow: 0 0 4px 2px #ef4444; opacity: 0.9; }
            }
        `;
        document.head.appendChild(style);
    }

    try {
        const floatBtn = document.createElement('button');
        floatBtn.id = 'compactFloatingBtn';
        floatBtn.innerHTML = '🔼';

        floatBtn.style.cssText = `
            position: fixed;
            bottom: 2px;
            right: 2px;
            width: 16px;
            height: 16px;
            border-radius: 10%;
            background: #6B1A1A;
            color: white;
            border: none;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            box-shadow: 0 0 8px 2px #ef4444;
            transition: 0.2s;
        `;

        floatBtn.onclick = () => { setCompactMode(false); };
        document.body.appendChild(floatBtn);

        floatBtn.style.animation = 'none';
        requestAnimationFrame(() => {
            floatBtn.style.animation = 'pulseGlow 1.2s infinite ease-in-out';
        });
    } catch (err) {
        console.error('Failed to add restore button:', err);
    }
}

function removeFloatingRestoreButton() {
    const btn = document.getElementById('compactFloatingBtn');
    if (btn) btn.remove();
}

function initCompactModeToggle() {
    const menuBar = document.querySelector('.menu-bar');
    if (!menuBar) {
        console.error('menu-bar not found, cannot create compact mode toggle');
        return;
    }
    if (document.getElementById('compactModeToggleItem')) return;

    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.id = 'compactModeToggleItem';
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'dropdown-item';
    toggleBtn.id = 'compactModeToggleMenu';
    toggleBtn.style.cursor = 'pointer';
    
    compactModeMenuItem = menuItem;
    compactModeToggleBtn = toggleBtn;
    updateCompactModeButtonText();

    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        if (!document.body.classList.contains('compact-mode')) {
            setCompactMode(true);
        }
    };

    menuItem.appendChild(toggleBtn);
    menuBar.appendChild(menuItem);
}

window.updateCompactModeText = updateCompactModeButtonText;

function syncCompactModeButtonVisibility() {
    if (compactModeMenuItem && document.body.classList.contains('compact-mode')) {
        compactModeMenuItem.style.display = 'none';
    } else if (compactModeMenuItem) {
        compactModeMenuItem.style.display = '';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCompactModeToggle();
        syncCompactModeButtonVisibility();
    });
} else {
    initCompactModeToggle();
    syncCompactModeButtonVisibility();
}