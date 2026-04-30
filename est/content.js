(function () {
    let protectionActive = false;
    let tabSwitchCount = 0;
    let devToolsDetected = false;
    let devToolsInterval = null;
    let windowBlurCount = 0;
    let lastBlurTime = 0;
    let screenshotSuspicionCount = 0;

    window.__testProtectionAPI = {
        version: '1.1',
        isActive: () => protectionActive,
        getTabSwitchCount: () => tabSwitchCount,
        getWindowBlurCount: () => windowBlurCount,
        getScreenshotSuspicionCount: () => screenshotSuspicionCount
    };

    function initProtection() {
        console.log('Test protection initialized (monitoring mode)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }

    function isTestPage() {
        return !!document.querySelector('app-test-start');
    }

    function notifyAngular(reason, data = {}) {
        window.dispatchEvent(new CustomEvent('testViolation', {
            detail: { reason, timestamp: Date.now(), ...data }
        }));
        console.log(`[Violation] ${reason}:`, data);
    }

    function activateProtection() {
        if (protectionActive) return;

        console.log('Monitoring ENABLED');
        protectionActive = true;
        tabSwitchCount = 0;
        devToolsDetected = false;
        windowBlurCount = 0;
        screenshotSuspicionCount = 0;

        // notifyAngular('extensionReady');
        startDevToolsCheck();
    }

    function deactivateProtection() {
        if (!protectionActive) return;

        console.log('Monitoring DISABLED');
        protectionActive = false;
        tabSwitchCount = 0;
        windowBlurCount = 0;
        screenshotSuspicionCount = 0;

        if (devToolsInterval) {
            clearInterval(devToolsInterval);
            devToolsInterval = null;
        }
    }

    function handleTabSwitch() {
        if (!protectionActive) return;

        if (document.hidden) {
            tabSwitchCount++;
            notifyAngular('tabSwitchWarning', { count: tabSwitchCount });
        } else {
            notifyAngular('tabReturn', { tabSwitchCount });
        }
    }

    function handleWindowBlur() {
        if (!protectionActive) return;

        const now = Date.now();
        windowBlurCount++;
        lastBlurTime = now;

        notifyAngular('windowBlur', {
            count: windowBlurCount,
            timestamp: now,
            reason: 'window_lost_focus'
        });

        checkForScreenshotPattern();
    }

    function handleWindowFocus() {
        if (!protectionActive) return;

        const now = Date.now();
        const timeSinceBlur = now - lastBlurTime;

        notifyAngular('windowFocus', {
            timestamp: now,
            timeSinceBlur: timeSinceBlur,
            blurCount: windowBlurCount
        });

        if (timeSinceBlur > 0 && timeSinceBlur < 500) {
            screenshotSuspicionCount++;
            notifyAngular('screenshotSuspicion', {
                type: 'rapid_focus_switch',
                timeSinceBlur: timeSinceBlur,
                suspicionCount: screenshotSuspicionCount,
                blurCount: windowBlurCount
            });
        }

        checkWindowSizeAnomaly();
    }

    let lastWindowSize = { width: window.innerWidth, height: window.innerHeight };

    function checkWindowSizeAnomaly() {
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;

        if (Math.abs(currentWidth - lastWindowSize.width) > 100 ||
            Math.abs(currentHeight - lastWindowSize.height) > 100) {
            notifyAngular('windowSizeAnomaly', {
                oldSize: lastWindowSize,
                newSize: { width: currentWidth, height: currentHeight },
                reason: 'possible_screenshot_tool'
            });
        }

        lastWindowSize = { width: currentWidth, height: currentHeight };
    }

    function checkForScreenshotPattern() {
        if (windowBlurCount >= 3) {
            screenshotSuspicionCount++;
            notifyAngular('screenshotPattern', {
                type: 'frequent_blur',
                blurCount: windowBlurCount,
                suspicionLevel: 'high'
            });
        }
    }

    function handleKeyDown(e) {
        if (!protectionActive) return;

        const screenshotKeys = [
            { condition: () => e.metaKey && e.shiftKey && e.code === 'KeyS', type: 'win+shift+s' },
            { condition: () => e.metaKey && e.shiftKey && e.code === 'Digit3', type: 'mac_screenshot_full' },
            { condition: () => e.metaKey && e.shiftKey && e.code === 'Digit4', type: 'mac_screenshot_area' },
            { condition: () => e.metaKey && e.shiftKey && e.code === 'Digit5', type: 'mac_screenshot_window' },
            { condition: () => (e.metaKey || e.ctrlKey) && e.code === 'PrintScreen', type: 'screenshot' },
            { condition: () => e.code === 'PrintScreen', type: 'printscreen' },
            { condition: () => e.altKey && e.code === 'PrintScreen', type: 'alt_printscreen' },
            { condition: () => e.metaKey && e.shiftKey && e.ctrlKey && e.code === 'Digit3', type: 'mac_screenshot_clipboard' }
        ];

        for (const screenshotKey of screenshotKeys) {
            if (screenshotKey.condition()) {
                screenshotSuspicionCount++;
                notifyAngular('screenshotAttempt', {
                    type: screenshotKey.type,
                    suspicionCount: screenshotSuspicionCount
                });
                return;
            }
        }

        if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
            notifyAngular('copyAttempt', { key: 'ctrl+c' });
            return;
        }

        if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
            notifyAngular('pasteAttempt', { key: 'ctrl+v' });
            return;
        }

        if (e.ctrlKey && (e.key === 'x' || e.key === 'X')) {
            notifyAngular('cutAttempt', { key: 'ctrl+x' });
            return;
        }

        const devKeys =
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toUpperCase() === 'U');

        if (devKeys) {
            notifyAngular('devToolsViolation', { key: e.key });
        }

        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyR') {
            notifyAngular('refreshAttempt', { key: 'ctrl+r' });
        }

        if (e.key === 'F5') {
            notifyAngular('refreshAttempt', { key: 'f5' });
        }
    }

    function handleCopyCutPaste(e) {
        if (!protectionActive) return;
        notifyAngular(`${e.type}Attempt`, { type: e.type });
    }

    function handleContextMenu(e) {
        if (!protectionActive) return;
        notifyAngular('contextMenuAttempt');
    }

    function handleDragStart(e) {
        if (!protectionActive) return;
        notifyAngular('dragAttempt');
    }

    function detectMediaDevices() {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = function() {
                if (protectionActive) {
                    screenshotSuspicionCount++;
                    notifyAngular('screenRecordingAttempt', {
                        suspicionCount: screenshotSuspicionCount
                    });
                }
                return originalGetDisplayMedia.apply(this, arguments);
            };
        }
    }

    function startDevToolsCheck() {
        if (devToolsInterval) clearInterval(devToolsInterval);

        devToolsInterval = setInterval(() => {
            if (!protectionActive) return;

            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;

            if ((widthDiff > 160 || heightDiff > 160) && !devToolsDetected) {
                devToolsDetected = true;
                notifyAngular('devToolsDetected', { widthDiff, heightDiff });
            } else if (widthDiff <= 160 && heightDiff <= 160) {
                if (devToolsDetected) {
                    devToolsDetected = false;
                    notifyAngular('devToolsClosed');
                }
            }
        }, 1000);
    }

    detectMediaDevices();

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleTabSwitch);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

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

    console.log('Test protection READY (passive monitoring mode)');
})();