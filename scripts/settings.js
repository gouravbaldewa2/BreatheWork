// Settings page script for BreatheWork Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
    console.log('BreatheWork settings page initialized');
    
    // Initialize settings page
    initializeSettingsPage();
    setupEventListeners();
    loadCurrentSettings();
    loadStatistics();
});

/**
 * Initialize settings page elements
 */
function initializeSettingsPage() {
    // Setup dynamic volume display
    const volumeSlider = document.getElementById('default-volume');
    const volumeDisplay = document.querySelector('.volume-display');
    
    if (volumeSlider && volumeDisplay) {
        volumeSlider.addEventListener('input', (e) => {
            volumeDisplay.textContent = `${e.target.value}%`;
        });
    }
    
    // Setup goal type toggle
    const goalTypeSelect = document.getElementById('default-goal-type');
    const goalValueInput = document.getElementById('default-goal-value');
    
    if (goalTypeSelect && goalValueInput) {
        goalTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'duration') {
                goalValueInput.placeholder = 'Minutes';
                goalValueInput.max = 60;
                goalValueInput.value = Math.min(goalValueInput.value || 5, 60);
            } else {
                goalValueInput.placeholder = 'Number of breaths';
                goalValueInput.max = 100;
                goalValueInput.value = goalValueInput.value || 10;
            }
        });
    }
}

/**
 * Setup event listeners for settings page
 */
function setupEventListeners() {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
    
    // Save settings button
    const saveBtn = document.getElementById('save-all-settings');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAllSettings);
    }
    
    // Reset defaults button
    const resetBtn = document.getElementById('reset-defaults');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefaults);
    }
    
    // Export data button
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportStatistics);
    }
    
    // Reset data button
    const resetDataBtn = document.getElementById('reset-data');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', resetAllData);
    }
    
    // Real-time setting updates
    setupRealtimeUpdates();
}

/**
 * Setup real-time updates for certain settings
 */
function setupRealtimeUpdates() {
    // Theme toggle
    const darkModeToggle = document.getElementById('dark-mode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            toggleDarkMode(e.target.checked);
        });
    }
    
    // Volume slider updates
    const volumeSlider = document.getElementById('default-volume');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            // Real-time volume preview could be implemented here
            console.log(`Volume set to: ${e.target.value}%`);
        });
    }
}

/**
 * Load current settings from storage
 */
async function loadCurrentSettings() {
    try {
        const result = await chrome.storage.local.get([
            'defaultTechnique',
            'defaultGoalType',
            'defaultGoalValue',
            'defaultSound',
            'defaultVolume',
            'showBreathInstructions',
            'autoStartSound',
            'vibrationFeedback',
            'darkMode'
        ]);
        
        // Populate form fields
        const elements = {
            'default-technique': result.defaultTechnique || 'box',
            'default-goal-type': result.defaultGoalType || 'breaths',
            'default-goal-value': result.defaultGoalValue || 10,
            'default-sound': result.defaultSound || 'rain',
            'default-volume': result.defaultVolume || 30,
            'show-breath-instructions': result.showBreathInstructions !== false,
            'auto-start-sound': result.autoStartSound !== false,
            'vibration-feedback': result.vibrationFeedback || false,
            'dark-mode': result.darkMode || false
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = elements[id];
                } else {
                    element.value = elements[id];
                }
            }
        });
        
        // Update volume display
        const volumeDisplay = document.querySelector('.volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = `${elements['default-volume']}%`;
        }
        
        // Apply dark mode if enabled
        if (elements['dark-mode']) {
            toggleDarkMode(true);
        }
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Load statistics from storage
 */
async function loadStatistics() {
    try {
        const stats = await chrome.runtime.sendMessage({ action: 'getStats' });
        
        // Update statistics display
        const elements = {
            'total-sessions-stat': stats.totalSessions || 0,
            'total-breaths-stat': stats.totalBreaths || 0,
            'total-time-stat': formatTotalTime(stats.totalTime || 0),
            'streak-stat': stats.currentStreak || 0
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        
        // Set default values on error
        const defaultStats = {
            'total-sessions-stat': '0',
            'total-breaths-stat': '0',
            'total-time-stat': '0m',
            'streak-stat': '0'
        };
        
        Object.keys(defaultStats).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = defaultStats[id];
            }
        });
    }
}

/**
 * Format total time in milliseconds to readable format
 */
function formatTotalTime(totalTimeMs) {
    const totalMinutes = Math.floor(totalTimeMs / (60 * 1000));
    
    if (totalMinutes < 60) {
        return `${totalMinutes}m`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours < 24) {
        return `${hours}h ${minutes}m`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    return `${days}d ${remainingHours}h`;
}

/**
 * Save all settings to storage
 */
async function saveAllSettings() {
    try {
        const settings = {
            defaultTechnique: document.getElementById('default-technique')?.value || 'box',
            defaultGoalType: document.getElementById('default-goal-type')?.value || 'breaths',
            defaultGoalValue: parseInt(document.getElementById('default-goal-value')?.value) || 10,
            defaultSound: document.getElementById('default-sound')?.value || 'rain',
            defaultVolume: parseInt(document.getElementById('default-volume')?.value) || 30,
            showBreathInstructions: document.getElementById('show-breath-instructions')?.checked !== false,
            autoStartSound: document.getElementById('auto-start-sound')?.checked !== false,
            vibrationFeedback: document.getElementById('vibration-feedback')?.checked || false,
            darkMode: document.getElementById('dark-mode')?.checked || false
        };
        
        await chrome.storage.local.set(settings);
        
        // Show success feedback
        showSaveConfirmation();
        
        console.log('Settings saved successfully:', settings);
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showErrorMessage('Failed to save settings. Please try again.');
    }
}

/**
 * Reset all settings to defaults
 */
async function resetToDefaults() {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
        return;
    }
    
    try {
        const defaultSettings = {
            defaultTechnique: 'box',
            defaultGoalType: 'breaths',
            defaultGoalValue: 10,
            defaultSound: 'rain',
            defaultVolume: 30,
            showBreathInstructions: true,
            autoStartSound: true,
            vibrationFeedback: false,
            darkMode: false
        };
        
        await chrome.storage.local.set(defaultSettings);
        
        // Reload the page to reflect changes
        location.reload();
        
    } catch (error) {
        console.error('Error resetting settings:', error);
        showErrorMessage('Failed to reset settings. Please try again.');
    }
}

/**
 * Export statistics as JSON file
 */
async function exportStatistics() {
    try {
        const stats = await chrome.runtime.sendMessage({ action: 'getStats' });
        
        const exportData = {
            exportDate: new Date().toISOString(),
            statistics: {
                totalSessions: stats.totalSessions || 0,
                totalBreaths: stats.totalBreaths || 0,
                totalTime: stats.totalTime || 0,
                currentStreak: stats.currentStreak || 0
            },
            sessionHistory: stats.sessionHistory || []
        };
        
        // Create and download file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `breathework-stats-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showSaveConfirmation('Statistics exported successfully!');
        
    } catch (error) {
        console.error('Error exporting statistics:', error);
        showErrorMessage('Failed to export statistics. Please try again.');
    }
}

/**
 * Reset all user data
 */
async function resetAllData() {
    const confirmation = prompt(
        'This will permanently delete ALL your breathing session data, statistics, and history.\n\n' +
        'Type "DELETE ALL DATA" to confirm this action:'
    );
    
    if (confirmation !== 'DELETE ALL DATA') {
        return;
    }
    
    try {
        // Reset statistics and session data
        const resetData = {
            totalSessions: 0,
            totalBreaths: 0,
            totalTime: 0,
            currentStreak: 0,
            lastSessionDate: null,
            sessionHistory: []
        };
        
        await chrome.storage.local.set(resetData);
        
        // Reload statistics display
        loadStatistics();
        
        showSaveConfirmation('All data has been reset successfully.');
        
    } catch (error) {
        console.error('Error resetting data:', error);
        showErrorMessage('Failed to reset data. Please try again.');
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        document.documentElement.style.setProperty('--primary-color', '#4a67d8');
        document.documentElement.style.setProperty('--bg-primary', '#1a202c');
        document.documentElement.style.setProperty('--bg-secondary', '#2d3748');
        document.documentElement.style.setProperty('--text-primary', '#e2e8f0');
        document.documentElement.style.setProperty('--text-secondary', '#cbd5e0');
    } else {
        document.body.classList.remove('dark-mode');
        // Reset to default values
        document.documentElement.style.removeProperty('--primary-color');
        document.documentElement.style.removeProperty('--bg-primary');
        document.documentElement.style.removeProperty('--bg-secondary');
        document.documentElement.style.removeProperty('--text-primary');
        document.documentElement.style.removeProperty('--text-secondary');
    }
}

/**
 * Show save confirmation message
 */
function showSaveConfirmation(message = 'Settings saved successfully!') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f56565;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

/**
 * Go back to main app
 */
function goBack() {
    // Close current tab and go back to main app
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.remove(tabs[0].id);
    });
}

/**
 * Keyboard shortcuts for settings page
 */
document.addEventListener('keydown', (e) => {
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'select') {
        return;
    }
    
    switch (e.key.toLowerCase()) {
        case 'escape':
            goBack();
            break;
            
        case 's':
            if (e.ctrlKey) {
                e.preventDefault();
                saveAllSettings();
            }
            break;
            
        case 'r':
            if (e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                resetToDefaults();
            }
            break;
    }
});

/**
 * Auto-save settings on change (for better UX)
 */
function setupAutoSave() {
    const settingInputs = document.querySelectorAll('input, select');
    
    settingInputs.forEach(input => {
        let timeout;
        
        input.addEventListener('change', () => {
            // Clear previous timeout
            if (timeout) {
                clearTimeout(timeout);
            }
            
            // Auto-save after 2 seconds of no changes
            timeout = setTimeout(() => {
                saveAllSettings();
            }, 2000);
        });
    });
}

// Initialize auto-save after page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupAutoSave, 1000);
});