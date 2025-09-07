// Background service worker for BreatheWork Chrome Extension

// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
    console.log('BreatheWork extension installed');
    
    // Set default settings on first install
    if (details.reason === 'install') {
        initializeDefaultSettings();
    }
});

// Initialize default settings
async function initializeDefaultSettings() {
    const defaultSettings = {
        defaultTechnique: 'box',
        defaultGoalType: 'breaths',
        defaultGoalValue: 10,
        defaultSound: 'rain',
        defaultVolume: 30,
        showBreathInstructions: true,
        autoStartSound: true,
        vibrationFeedback: false,
        darkMode: false,
        totalSessions: 0,
        totalBreaths: 0,
        totalTime: 0,
        currentStreak: 0,
        lastSessionDate: null,
        sessionHistory: []
    };
    
    try {
        await chrome.storage.local.set(defaultSettings);
        console.log('Default settings initialized');
    } catch (error) {
        console.error('Error initializing default settings:', error);
    }
}

// Handle extension icon click - open popup
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup defined in manifest.json
    console.log('Extension icon clicked');
});

// Message handling from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'openMainApp':
            openMainApp();
            sendResponse({ success: true });
            break;
            
        case 'openSettings':
            openSettings();
            sendResponse({ success: true });
            break;
            
        case 'saveSession':
            saveSessionData(request.data);
            sendResponse({ success: true });
            break;
            
        case 'getStats':
            getStatistics().then(stats => sendResponse(stats));
            return true; // Keep message channel open for async response
            
        default:
            sendResponse({ error: 'Unknown action' });
    }
});

// Open main breathing app in new tab
function openMainApp() {
    chrome.tabs.create({
        url: chrome.runtime.getURL('main.html')
    });
}

// Open settings page in new tab
function openSettings() {
    chrome.tabs.create({
        url: chrome.runtime.getURL('settings.html')
    });
}

// Save session data to storage
async function saveSessionData(sessionData) {
    try {
        const result = await chrome.storage.local.get([
            'totalSessions', 
            'totalBreaths', 
            'totalTime', 
            'sessionHistory',
            'lastSessionDate',
            'currentStreak'
        ]);
        
        const now = new Date();
        const today = now.toDateString();
        const lastDate = result.lastSessionDate ? new Date(result.lastSessionDate).toDateString() : null;
        
        // Update streak
        let newStreak = result.currentStreak || 0;
        if (lastDate === today) {
            // Same day, keep streak
        } else if (lastDate === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
            // Yesterday, increment streak
            newStreak++;
        } else if (lastDate) {
            // More than one day gap, reset streak
            newStreak = 1;
        } else {
            // First session ever
            newStreak = 1;
        }
        
        const updatedData = {
            totalSessions: (result.totalSessions || 0) + 1,
            totalBreaths: (result.totalBreaths || 0) + sessionData.breathCount,
            totalTime: (result.totalTime || 0) + sessionData.duration,
            currentStreak: newStreak,
            lastSessionDate: now.toISOString(),
            sessionHistory: [
                ...(result.sessionHistory || []).slice(-99), // Keep last 100 sessions
                {
                    date: now.toISOString(),
                    technique: sessionData.technique,
                    duration: sessionData.duration,
                    breathCount: sessionData.breathCount,
                    goalType: sessionData.goalType,
                    goalValue: sessionData.goalValue,
                    completed: sessionData.completed
                }
            ]
        };
        
        await chrome.storage.local.set(updatedData);
        console.log('Session data saved successfully');
    } catch (error) {
        console.error('Error saving session data:', error);
    }
}

// Get statistics
async function getStatistics() {
    try {
        const result = await chrome.storage.local.get([
            'totalSessions',
            'totalBreaths', 
            'totalTime',
            'currentStreak',
            'sessionHistory'
        ]);
        
        return {
            totalSessions: result.totalSessions || 0,
            totalBreaths: result.totalBreaths || 0,
            totalTime: result.totalTime || 0,
            currentStreak: result.currentStreak || 0,
            sessionHistory: result.sessionHistory || []
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        return {
            totalSessions: 0,
            totalBreaths: 0,
            totalTime: 0,
            currentStreak: 0,
            sessionHistory: []
        };
    }
}

// Cleanup old data periodically
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
        cleanupOldData();
    }
});

// Set up periodic cleanup (once a week)
chrome.runtime.onStartup.addListener(() => {
    chrome.alarms.create('cleanup', {
        delayInMinutes: 1,
        periodInMinutes: 10080 // 7 days
    });
});

// Clean up old session data (keep last 3 months)
async function cleanupOldData() {
    try {
        const result = await chrome.storage.local.get(['sessionHistory']);
        const history = result.sessionHistory || [];
        
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        const filteredHistory = history.filter(session => 
            new Date(session.date) > threeMonthsAgo
        );
        
        if (filteredHistory.length !== history.length) {
            await chrome.storage.local.set({ sessionHistory: filteredHistory });
            console.log(`Cleaned up ${history.length - filteredHistory.length} old sessions`);
        }
    } catch (error) {
        console.error('Error cleaning up old data:', error);
    }
}