// Popup script for BreatheWork Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
    // Initialize popup
    initializePopup();
    setupEventListeners();
    loadStats();
});

/**
 * Initialize popup interface
 */
function initializePopup() {
    console.log('BreatheWork popup initialized');
    
    // Load user preferences
    loadUserPreferences();
}

/**
 * Setup event listeners for popup elements
 */
function setupEventListeners() {
    // Quick start technique buttons
    const techniqueButtons = document.querySelectorAll('.technique-btn');
    techniqueButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const technique = btn.dataset.technique;
            startQuickSession(technique);
        });
    });
    
    // Main action buttons
    const openMainBtn = document.getElementById('open-main');
    if (openMainBtn) {
        openMainBtn.addEventListener('click', openMainApp);
    }
    
    const openSettingsBtn = document.getElementById('open-settings');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', openSettings);
    }
}

/**
 * Load user preferences and stats
 */
async function loadUserPreferences() {
    try {
        const result = await chrome.storage.local.get([
            'defaultTechnique',
            'totalSessions',
            'totalBreaths'
        ]);
        
        // Highlight default technique if available
        if (result.defaultTechnique) {
            const defaultBtn = document.querySelector(`[data-technique="${result.defaultTechnique}"]`);
            if (defaultBtn) {
                defaultBtn.style.background = 'rgba(255, 255, 255, 0.4)';
                defaultBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            }
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

/**
 * Load and display statistics
 */
async function loadStats() {
    try {
        const stats = await chrome.runtime.sendMessage({ action: 'getStats' });
        
        const totalSessionsEl = document.getElementById('total-sessions');
        const totalBreathsEl = document.getElementById('total-breaths');
        
        if (totalSessionsEl) {
            totalSessionsEl.textContent = stats.totalSessions || 0;
        }
        
        if (totalBreathsEl) {
            totalBreathsEl.textContent = stats.totalBreaths || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        // Set default values if error
        const totalSessionsEl = document.getElementById('total-sessions');
        const totalBreathsEl = document.getElementById('total-breaths');
        
        if (totalSessionsEl) totalSessionsEl.textContent = '0';
        if (totalBreathsEl) totalBreathsEl.textContent = '0';
    }
}

/**
 * Start a quick breathing session with selected technique
 */
function startQuickSession(technique) {
    // Visual feedback
    const btn = document.querySelector(`[data-technique="${technique}"]`);
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }
    
    // Open main app with selected technique
    const url = chrome.runtime.getURL(`main.html?technique=${technique}&quick=true`);
    chrome.tabs.create({ url });
    
    // Close popup
    window.close();
}

/**
 * Open main application
 */
function openMainApp() {
    chrome.runtime.sendMessage({ action: 'openMainApp' });
    window.close();
}

/**
 * Open settings page
 */
function openSettings() {
    chrome.runtime.sendMessage({ action: 'openSettings' });
    window.close();
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case '1':
            startQuickSession('box');
            break;
        case '2':
            startQuickSession('478');
            break;
        case '3':
            startQuickSession('triangle');
            break;
        case 'Enter':
            if (event.ctrlKey) {
                openMainApp();
            }
            break;
        case 'Escape':
            window.close();
            break;
    }
});

/**
 * Handle mouse hover effects
 */
document.addEventListener('mouseover', function(event) {
    if (event.target.classList.contains('technique-btn')) {
        event.target.style.transform = 'translateY(-1px)';
    }
});

document.addEventListener('mouseout', function(event) {
    if (event.target.classList.contains('technique-btn')) {
        event.target.style.transform = '';
    }
});

/**
 * Update stats periodically
 */
setInterval(loadStats, 30000); // Update every 30 seconds