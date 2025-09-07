// Main application script for BreatheWork Chrome Extension

// Global instances
let breathingEngine = null;
let audioManager = null;
let currentTechnique = 'box';
let isExerciseMode = false;

// DOM Elements (will be populated on load)
let elements = {};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('BreatheWork main app initializing...');
    
    // Get DOM elements
    initializeElements();
    
    // Initialize managers
    initializeManagers();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load user preferences
    loadUserPreferences();
    
    // Check for URL parameters
    handleUrlParameters();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    console.log('BreatheWork main app initialized');
});

/**
 * Get and store references to DOM elements
 */
function initializeElements() {
    elements = {
        // Sections
        techniqueSection: document.getElementById('technique-section'),
        exerciseSection: document.getElementById('exercise-section'),
        
        // Header elements
        currentTechniqueTitle: document.getElementById('current-technique-title'),
        closeBtn: document.getElementById('close-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        backToSelection: document.getElementById('back-to-selection'),
        
        // Technique cards
        techniqueCards: document.querySelectorAll('.technique-card'),
        
        // Breathing visual
        breathingCircle: document.getElementById('breathing-circle'),
        phaseText: document.getElementById('phase-text'),
        breathCount: document.getElementById('breath-count'),
        
        // Timers
        inhaleTimer: document.getElementById('inhale-timer'),
        hold1Timer: document.getElementById('hold1-timer'),
        exhaleTimer: document.getElementById('exhale-timer'),
        hold2Timer: document.getElementById('hold2-timer'),
        
        // Session info
        sessionTime: document.getElementById('session-time'),
        sessionGoal: document.getElementById('session-goal'),
        
        // Controls
        startBtn: document.getElementById('start-btn'),
        pauseBtn: document.getElementById('pause-btn'),
        resumeBtn: document.getElementById('resume-btn'),
        stopBtn: document.getElementById('stop-btn'),
        customizeBtn: document.getElementById('customize-btn'),
        
        // Audio controls
        volumeSlider: document.getElementById('volume-slider'),
        soundButtons: document.querySelectorAll('.sound-btn'),
        
        // Modals
        settingsModal: document.getElementById('settings-modal'),
        customizeModal: document.getElementById('customize-modal'),
        
        // Modal elements
        timingControls: document.getElementById('timing-controls'),
        customizeTiming: document.getElementById('customize-timing'),
        customizeTechniqueTitle: document.getElementById('customize-technique-title'),
        goalTypeSelect: document.getElementById('goal-type-select'),
        goalValue: document.getElementById('goal-value'),
        
        // Settings modal elements
        saveSettings: document.getElementById('save-settings'),
        applyCustomize: document.getElementById('apply-customize'),
        
        // Close modal buttons
        closeModalBtns: document.querySelectorAll('.close-modal')
    };
}

/**
 * Initialize breathing engine and audio manager
 */
function initializeManagers() {
    // Initialize breathing engine
    breathingEngine = new BreathingEngine();
    breathingEngine.setCallbacks({
        onPhaseChange: handlePhaseChange,
        onBreathComplete: handleBreathComplete,
        onSessionComplete: handleSessionComplete,
        onTimer: handleTimer
    });
    
    // Initialize audio manager
    audioManager = new AudioManager();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Technique selection
    elements.techniqueCards.forEach(card => {
        card.addEventListener('click', () => {
            const technique = card.dataset.technique;
            selectTechnique(technique);
        });
    });
    
    // Header controls
    if (elements.closeBtn) {
        elements.closeBtn.addEventListener('click', closeApp);
    }
    
    if (elements.settingsBtn) {
        elements.settingsBtn.addEventListener('click', openSettingsModal);
    }
    
    if (elements.backToSelection) {
        elements.backToSelection.addEventListener('click', backToTechniqueSelection);
    }
    
    // Exercise controls
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', startBreathingSession);
    }
    
    if (elements.pauseBtn) {
        elements.pauseBtn.addEventListener('click', pauseSession);
    }
    
    if (elements.resumeBtn) {
        elements.resumeBtn.addEventListener('click', resumeSession);
    }
    
    if (elements.stopBtn) {
        elements.stopBtn.addEventListener('click', stopSession);
    }
    
    if (elements.customizeBtn) {
        elements.customizeBtn.addEventListener('click', openCustomizeModal);
    }
    
    // Audio controls
    if (elements.volumeSlider) {
        elements.volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audioManager.setVolume(volume);
        });
    }
    
    elements.soundButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectSound(btn.dataset.sound);
        });
    });
    
    // Modal controls
    if (elements.saveSettings) {
        elements.saveSettings.addEventListener('click', saveSettings);
    }
    
    if (elements.applyCustomize) {
        elements.applyCustomize.addEventListener('click', applyCustomization);
    }
    
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Click outside modal to close
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

/**
 * Load user preferences from storage
 */
async function loadUserPreferences() {
    try {
        const result = await chrome.storage.local.get([
            'defaultTechnique',
            'defaultSound',
            'defaultVolume',
            'defaultGoalType',
            'defaultGoalValue'
        ]);
        
        if (result.defaultTechnique) {
            currentTechnique = result.defaultTechnique;
        }
        
        if (result.defaultSound) {
            selectSound(result.defaultSound);
        }
        
        if (result.defaultVolume !== undefined) {
            elements.volumeSlider.value = result.defaultVolume;
            audioManager.setVolume(result.defaultVolume / 100);
        }
        
        if (result.defaultGoalType && elements.goalTypeSelect) {
            elements.goalTypeSelect.value = result.defaultGoalType;
        }
        
        if (result.defaultGoalValue && elements.goalValue) {
            elements.goalValue.value = result.defaultGoalValue;
        }
        
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

/**
 * Handle URL parameters for direct technique access
 */
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const technique = urlParams.get('technique');
    const quick = urlParams.get('quick');
    
    if (technique) {
        currentTechnique = technique;
        
        if (quick === 'true') {
            // Start immediately with default settings
            selectTechnique(technique);
            setTimeout(() => {
                startBreathingSession();
            }, 1000);
        } else {
            selectTechnique(technique);
        }
    }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName.toLowerCase() === 'input') return;
        
        switch (e.key.toLowerCase()) {
            case ' ':
            case 'enter':
                e.preventDefault();
                if (isExerciseMode) {
                    if (breathingEngine.getSessionState().isRunning) {
                        if (breathingEngine.getSessionState().isPaused) {
                            resumeSession();
                        } else {
                            pauseSession();
                        }
                    } else {
                        startBreathingSession();
                    }
                }
                break;
                
            case 'escape':
                if (isExerciseMode) {
                    stopSession();
                } else {
                    closeApp();
                }
                break;
                
            case 'b':
                if (!isExerciseMode) {
                    backToTechniqueSelection();
                }
                break;
                
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault();
                    openSettingsModal();
                }
                break;
                
            case 'c':
                if (isExerciseMode) {
                    openCustomizeModal();
                }
                break;
        }
    });
}

/**
 * Select a breathing technique
 */
function selectTechnique(technique) {
    currentTechnique = technique;
    
    // Update visual selection
    elements.techniqueCards.forEach(card => {
        card.classList.toggle('active', card.dataset.technique === technique);
    });
    
    // Switch to exercise view
    showExerciseInterface();
    
    // Update technique info
    updateTechniqueInfo();
    
    // Setup timing controls
    setupTimingControls();
}

/**
 * Show exercise interface
 */
function showExerciseInterface() {
    elements.techniqueSection.style.display = 'none';
    elements.exerciseSection.style.display = 'block';
    isExerciseMode = true;
}

/**
 * Show technique selection interface
 */
function showTechniqueSelection() {
    elements.exerciseSection.style.display = 'none';
    elements.techniqueSection.style.display = 'block';
    isExerciseMode = false;
}

/**
 * Update technique information display
 */
function updateTechniqueInfo() {
    const technique = getTechnique(currentTechnique);
    
    if (elements.currentTechniqueTitle) {
        elements.currentTechniqueTitle.textContent = technique.name;
    }
    
    if (elements.customizeTechniqueTitle) {
        elements.customizeTechniqueTitle.textContent = technique.name;
    }
    
    // Update session goal display
    updateSessionGoalDisplay();
}

/**
 * Setup timing controls based on selected technique
 */
function setupTimingControls() {
    const technique = getTechnique(currentTechnique);
    
    // Show/hide relevant timer boxes
    const timerBoxes = {
        'inhale-timer': technique.phases.includes('inhale'),
        'hold1-timer': technique.phases.includes('hold') || technique.phases.includes('hold1'),
        'exhale-timer': technique.phases.includes('exhale'),
        'hold2-timer': technique.phases.includes('hold2')
    };
    
    Object.keys(timerBoxes).forEach(timerId => {
        const element = document.getElementById(timerId);
        if (element) {
            element.style.display = timerBoxes[timerId] ? 'block' : 'none';
        }
    });
    
    // Setup customize modal timing inputs
    setupCustomizeTimingInputs();
}

/**
 * Setup timing inputs in customize modal
 */
function setupCustomizeTimingInputs() {
    if (!elements.customizeTiming) return;
    
    const technique = getTechnique(currentTechnique);
    elements.customizeTiming.innerHTML = '';
    
    Object.keys(technique.defaultTiming).forEach(phase => {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'timing-control';
        
        const label = document.createElement('label');
        label.textContent = `${getPhaseDisplayName(phase)}:`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `timing-${phase}`;
        input.min = technique.minTiming[phase];
        input.max = technique.maxTiming[phase];
        input.value = technique.defaultTiming[phase];
        input.step = phase.includes('breath') ? '1' : '0.5';
        
        phaseDiv.appendChild(label);
        phaseDiv.appendChild(input);
        elements.customizeTiming.appendChild(phaseDiv);
    });
}

/**
 * Start breathing session
 */
function startBreathingSession() {
    const config = {
        technique: currentTechnique,
        goalType: elements.goalTypeSelect ? elements.goalTypeSelect.value : 'breaths',
        goalValue: elements.goalValue ? parseInt(elements.goalValue.value) : 10,
        customTiming: getCustomTiming()
    };
    
    // Start audio if enabled
    const activeSound = document.querySelector('.sound-btn.active');
    if (activeSound && activeSound.dataset.sound !== 'none') {
        audioManager.playSound(activeSound.dataset.sound);
    }
    
    // Start breathing session
    breathingEngine.startSession(config);
    
    // Update UI
    updateControlButtons('running');
    elements.breathCount.textContent = '0';
    
    console.log('Breathing session started:', config);
}

/**
 * Pause current session
 */
function pauseSession() {
    breathingEngine.pauseSession();
    updateControlButtons('paused');
}

/**
 * Resume paused session
 */
function resumeSession() {
    breathingEngine.resumeSession();
    updateControlButtons('running');
}

/**
 * Stop current session
 */
function stopSession() {
    breathingEngine.stopSession();
    audioManager.stopSound();
    updateControlButtons('stopped');
    
    // Reset visual elements
    elements.breathingCircle.className = 'breathing-circle';
    elements.phaseText.textContent = 'Session Ended';
    
    // Clear all timer displays
    clearTimerDisplays();
}

/**
 * Handle phase changes during breathing exercise
 */
function handlePhaseChange(phaseData) {
    // Update phase text
    elements.phaseText.textContent = getPhaseDisplayName(phaseData.phase);
    
    // Update breathing circle animation
    updateBreathingCircle(phaseData.phase, phaseData.progress || 0);
    
    // Update timer displays
    updateTimerDisplays(phaseData);
    
    // Update audio based on phase
    if (audioManager.isCurrentlyPlaying()) {
        audioManager.fadeForBreathingPhase(phaseData.phase, phaseData.progress || 0);
    }
    
    // Update breath count display
    elements.breathCount.textContent = phaseData.breathCount;
}

/**
 * Handle breath completion
 */
function handleBreathComplete(breathCount) {
    elements.breathCount.textContent = breathCount;
    
    // Visual feedback for completed breath
    elements.breathingCircle.style.boxShadow = '0 0 20px rgba(72, 187, 120, 0.5)';
    setTimeout(() => {
        elements.breathingCircle.style.boxShadow = '';
    }, 200);
}

/**
 * Handle session completion
 */
function handleSessionComplete(sessionData) {
    // Stop audio
    audioManager.stopSound();
    
    // Update UI
    updateControlButtons('completed');
    elements.phaseText.textContent = 'Session Complete! 🎉';
    
    // Show completion feedback
    showCompletionFeedback(sessionData);
    
    console.log('Session completed:', sessionData);
}

/**
 * Handle timer updates
 */
function handleTimer(duration) {
    const minutes = Math.floor(duration / (60 * 1000));
    const seconds = Math.floor((duration % (60 * 1000)) / 1000);
    elements.sessionTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Update breathing circle animation
 */
function updateBreathingCircle(phase, progress) {
    elements.breathingCircle.className = `breathing-circle ${phase}`;
    
    // Apply scaling based on progress for smooth animation
    let scale = 1;
    switch (phase) {
        case 'inhale':
            scale = 1 + (progress * 0.4); // Scale from 1 to 1.4
            break;
        case 'exhale':
            scale = 1.4 - (progress * 0.6); // Scale from 1.4 to 0.8
            break;
        case 'hold':
        case 'hold1':
        case 'hold2':
            scale = 1.4; // Maintain expanded state
            break;
    }
    
    elements.breathingCircle.style.transform = `scale(${scale})`;
}

/**
 * Update timer displays
 */
function updateTimerDisplays(phaseData) {
    // Clear all active states
    document.querySelectorAll('.timer-box').forEach(box => {
        box.classList.remove('active');
    });
    
    // Highlight current phase timer
    const currentTimerBox = document.getElementById(`${phaseData.phase.replace(/\d+$/, '')}-timer`);
    if (currentTimerBox) {
        currentTimerBox.classList.add('active');
        const valueElement = currentTimerBox.querySelector('.timer-value');
        if (valueElement) {
            const remaining = Math.ceil(phaseData.duration * (1 - (phaseData.progress || 0)));
            valueElement.textContent = remaining;
        }
    }
}

/**
 * Clear all timer displays
 */
function clearTimerDisplays() {
    document.querySelectorAll('.timer-value').forEach(el => {
        el.textContent = '0';
    });
    
    document.querySelectorAll('.timer-box').forEach(box => {
        box.classList.remove('active');
    });
}

/**
 * Update control buttons based on session state
 */
function updateControlButtons(state) {
    const buttons = {
        start: elements.startBtn,
        pause: elements.pauseBtn,
        resume: elements.resumeBtn,
        stop: elements.stopBtn
    };
    
    // Hide all buttons first
    Object.values(buttons).forEach(btn => {
        if (btn) btn.style.display = 'none';
    });
    
    // Show appropriate buttons based on state
    switch (state) {
        case 'stopped':
        case 'completed':
            if (buttons.start) buttons.start.style.display = 'inline-block';
            break;
        case 'running':
            if (buttons.pause) buttons.pause.style.display = 'inline-block';
            if (buttons.stop) buttons.stop.style.display = 'inline-block';
            break;
        case 'paused':
            if (buttons.resume) buttons.resume.style.display = 'inline-block';
            if (buttons.stop) buttons.stop.style.display = 'inline-block';
            break;
    }
}

/**
 * Select background sound
 */
function selectSound(soundType) {
    // Update button states
    elements.soundButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sound === soundType);
    });
    
    // Play sound if not already playing
    if (soundType !== 'none' && !audioManager.isCurrentlyPlaying()) {
        audioManager.playSound(soundType);
    } else if (soundType === 'none') {
        audioManager.stopSound();
    }
}

/**
 * Get custom timing from inputs
 */
function getCustomTiming() {
    const customTiming = {};
    const technique = getTechnique(currentTechnique);
    
    Object.keys(technique.defaultTiming).forEach(phase => {
        const input = document.getElementById(`timing-${phase}`);
        if (input) {
            customTiming[phase] = parseFloat(input.value) || technique.defaultTiming[phase];
        }
    });
    
    return customTiming;
}

/**
 * Update session goal display
 */
function updateSessionGoalDisplay() {
    if (!elements.sessionGoal) return;
    
    const goalType = elements.goalTypeSelect ? elements.goalTypeSelect.value : 'breaths';
    const goalValue = elements.goalValue ? elements.goalValue.value : '10';
    
    const goalText = goalType === 'breaths' ? `${goalValue} breaths` : `${goalValue} minutes`;
    elements.sessionGoal.textContent = goalText;
}

/**
 * Show completion feedback
 */
function showCompletionFeedback(sessionData) {
    // Create a simple feedback overlay
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(72, 187, 120, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        text-align: center;
        z-index: 1001;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    `;
    
    feedback.innerHTML = `
        <h3>🎉 Session Complete!</h3>
        <p>${sessionData.breathCount} breaths in ${Math.round(sessionData.duration / 1000)}s</p>
        <p>Great work! 💪</p>
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 3000);
}

/**
 * Modal functions
 */
function openSettingsModal() {
    elements.settingsModal.style.display = 'flex';
}

function openCustomizeModal() {
    setupCustomizeTimingInputs();
    updateSessionGoalDisplay();
    elements.customizeModal.style.display = 'flex';
}

function closeModal() {
    elements.settingsModal.style.display = 'none';
    elements.customizeModal.style.display = 'none';
}

/**
 * Apply customization settings
 */
function applyCustomization() {
    // Update goal display
    updateSessionGoalDisplay();
    
    // Close modal
    closeModal();
    
    // If session is running, update configuration
    if (breathingEngine.getSessionState().isRunning) {
        breathingEngine.updateConfiguration({
            goalType: elements.goalTypeSelect.value,
            goalValue: parseInt(elements.goalValue.value),
            customTiming: getCustomTiming()
        });
    }
}

/**
 * Save settings to storage
 */
async function saveSettings() {
    try {
        const settings = {
            defaultTechnique: currentTechnique,
            defaultGoalType: elements.goalTypeSelect ? elements.goalTypeSelect.value : 'breaths',
            defaultGoalValue: elements.goalValue ? parseInt(elements.goalValue.value) : 10,
            defaultSound: document.querySelector('.sound-btn.active')?.dataset.sound || 'rain',
            defaultVolume: parseInt(elements.volumeSlider.value)
        };
        
        await chrome.storage.local.set(settings);
        closeModal();
        
        // Show feedback
        console.log('Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

/**
 * Navigation functions
 */
function backToTechniqueSelection() {
    // Stop any running session
    if (breathingEngine.getSessionState().isRunning) {
        stopSession();
    }
    
    showTechniqueSelection();
}

function closeApp() {
    // Cleanup
    if (breathingEngine) {
        breathingEngine.cleanup();
    }
    
    if (audioManager) {
        audioManager.cleanup();
    }
    
    // Close tab
    window.close();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (breathingEngine) {
        breathingEngine.cleanup();
    }
    
    if (audioManager) {
        audioManager.cleanup();
    }
});