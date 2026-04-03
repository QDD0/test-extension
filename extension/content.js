(function () {
    let protectionActive = false;
    let tabSwitchCount = 0;
    let devToolsDetected = false;
    let devToolsInterval = null;

    function isTestPage() {
        return !!document.querySelector('app-test-start');
    }

    function notifyAngular(reason, data = {}) {
        window.dispatchEvent(new CustomEvent('testViolation', {
            detail: { reason, timestamp: Date.now(), ...data }
        }));
    }

    function addStyles() {
        if (document.getElementById('test-protection-style')) return;

        const style = document.createElement('style');
        style.id = 'test-protection-style';
        style.textContent = `
            * {
                user-select: none !important;
                -webkit-user-select: none !important;
            }
            ::selection {
                background: transparent !important;
            }
            img, video, iframe {
                pointer-events: none !important;
                user-drag: none !important;
            }
        `;
        document.head.appendChild(style);

        console.log('Styles applied');
    }

    function removeStyles() {
        const style = document.getElementById('test-protection-style');
        if (style) style.remove();
    }

    function activateProtection() {
        if (protectionActive) return;

        console.log('Protection ENABLED');

        protectionActive = true;
        tabSwitchCount = 0;
        devToolsDetected = false;

        addStyles();
        notifyAngular('extensionReady');

        startDevToolsCheck();
    }

    function deactivateProtection() {
        if (!protectionActive) return;

        console.log('Protection DISABLED');

        protectionActive = false;
        tabSwitchCount = 0;

        removeStyles();

        if (devToolsInterval) {
            clearInterval(devToolsInterval);
            devToolsInterval = null;
        }
    }

    function handleTabSwitch() {
        if (!protectionActive) return;

        if (document.hidden) {
            tabSwitchCount++;

            if (tabSwitchCount === 1) {
                alert('Не покидайте вкладку!');
                notifyAngular('tabSwitchWarning', { count: tabSwitchCount });
            } else {
                alert('Тест завершен из-за переключения вкладки');
                notifyAngular('tabSwitchViolation', { count: tabSwitchCount });
            }
        }
    }

    function handleKeyDown(e) {
        if (!protectionActive) return;

        const devKeys =
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toUpperCase() === 'U');

        if (devKeys) {
            e.preventDefault();
            e.stopPropagation();
            alert('DevTools запрещены');
            notifyAngular('devToolsViolation');
        }

        if ((e.ctrlKey || e.metaKey) && ['R', 'P'].includes(e.key.toUpperCase())) {
            e.preventDefault();
            alert('Действие запрещено');
        }
    }

    function preventActions(e) {
        if (!protectionActive) return;
        e.preventDefault();
        e.stopPropagation();
    }

    function startDevToolsCheck() {
        devToolsInterval = setInterval(() => {
            if (!protectionActive) return;

            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;

            if ((widthDiff > 160 || heightDiff > 160) && !devToolsDetected) {
                devToolsDetected = true;
                alert('DevTools обнаружены!');
                notifyAngular('devToolsDetected');
            } else if (widthDiff <= 160 && heightDiff <= 160) {
                devToolsDetected = false;
            }
        }, 1000);
    }

    document.addEventListener('visibilitychange', handleTabSwitch);
    document.addEventListener('keydown', handleKeyDown, true);

    ['copy', 'cut', 'paste', 'selectstart', 'contextmenu', 'dragstart']
        .forEach(evt => document.addEventListener(evt, preventActions, true));

    setInterval(() => {
        if (isTestPage()) {
            activateProtection();
        } else {
            deactivateProtection();
        }
    }, 500);

    const observer = new MutationObserver(() => {
        if (isTestPage()) {
            activateProtection();
        } else {
            deactivateProtection();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.__testProtectionAPI = {
        isActive: () => protectionActive,
        getTabSwitchCount: () => tabSwitchCount
    };

    console.log('Test protection READY');
})();