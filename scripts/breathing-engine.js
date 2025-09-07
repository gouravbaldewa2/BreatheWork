// Breathing Engine - Core breathing exercise logic

/**
 * Breathing Exercise Engine
 * Manages breathing sessions, timing, and state transitions
 */
class BreathingEngine {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTechnique = 'box';
        this.currentPhase = 'inhale';
        this.phaseTimer = null;
        this.sessionTimer = null;
        this.breathCount = 0;
        this.sessionStartTime = null;
        this.sessionDuration = 0;
        this.goalType = 'breaths'; // 'breaths' or 'duration'
        this.goalValue = 10;
        this.customTiming = {};
        
        // Callbacks
        this.onPhaseChange = null;
        this.onBreathComplete = null;
        this.onSessionComplete = null;
        this.onTimer = null;
        
        // Current phase progress
        this.phaseStartTime = null;
        this.phaseDuration = 0;
        this.phaseProgress = 0;
        
        this.initializeEngine();
    }
    
    /**
     * Initialize the breathing engine
     */
    initializeEngine() {
        // Load saved preferences
        this.loadSettings();
        
        // Bind methods
        this.tick = this.tick.bind(this);
        this.nextPhase = this.nextPhase.bind(this);
    }
    
    /**
     * Load settings from storage
     */
    async loadSettings() {
        try {
            const result = await chrome.storage.local.get([
                'defaultTechnique',
                'defaultGoalType',
                'defaultGoalValue'
            ]);
            
            this.currentTechnique = result.defaultTechnique || 'box';
            this.goalType = result.defaultGoalType || 'breaths';
            this.goalValue = result.defaultGoalValue || 10;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    /**
     * Start breathing exercise
     * @param {Object} config - Configuration object
     */
    startSession(config = {}) {
        // Stop any existing session
        this.stopSession();
        
        // Apply configuration
        this.currentTechnique = config.technique || this.currentTechnique;
        this.goalType = config.goalType || this.goalType;
        this.goalValue = config.goalValue || this.goalValue;
        this.customTiming = config.customTiming || {};
        
        // Reset counters
        this.breathCount = 0;
        this.sessionDuration = 0;
        this.sessionStartTime = Date.now();
        
        // Start with first phase
        this.currentPhase = this.getFirstPhase();
        this.isRunning = true;
        this.isPaused = false;
        
        // Start session timer
        this.sessionTimer = setInterval(() => {
            if (!this.isPaused) {
                this.sessionDuration = Date.now() - this.sessionStartTime;
                if (this.onTimer) {
                    this.onTimer(this.sessionDuration);
                }
                
                // Check duration goal
                if (this.goalType === 'duration' && this.sessionDuration >= this.goalValue * 60 * 1000) {
                    this.completeSession();
                }
            }
        }, 100);
        
        // Start first phase
        this.startPhase();
        
        console.log(`Starting ${this.currentTechnique} session with goal: ${this.goalValue} ${this.goalType}`);
    }
    
    /**
     * Pause the current session
     */
    pauseSession() {
        if (!this.isRunning) return;
        
        this.isPaused = true;
        
        if (this.phaseTimer) {
            clearTimeout(this.phaseTimer);
            this.phaseTimer = null;
        }
        
        console.log('Session paused');
    }
    
    /**
     * Resume the paused session
     */
    resumeSession() {
        if (!this.isRunning || !this.isPaused) return;
        
        this.isPaused = false;
        
        // Calculate remaining time for current phase
        const elapsed = Date.now() - this.phaseStartTime;
        const remaining = Math.max(0, this.phaseDuration - elapsed);
        
        if (remaining > 0) {
            this.phaseTimer = setTimeout(this.nextPhase, remaining);
        } else {
            this.nextPhase();
        }
        
        console.log('Session resumed');
    }
    
    /**
     * Stop the current session
     */
    stopSession() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.phaseTimer) {
            clearTimeout(this.phaseTimer);
            this.phaseTimer = null;
        }
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        console.log('Session stopped');
    }
    
    /**
     * Complete the session successfully
     */
    completeSession() {
        const finalDuration = Date.now() - this.sessionStartTime;
        
        // Save session data
        this.saveSessionData({
            technique: this.currentTechnique,
            duration: finalDuration,
            breathCount: this.breathCount,
            goalType: this.goalType,
            goalValue: this.goalValue,
            completed: true
        });
        
        this.stopSession();
        
        if (this.onSessionComplete) {
            this.onSessionComplete({
                technique: this.currentTechnique,
                duration: finalDuration,
                breathCount: this.breathCount,
                completed: true
            });
        }
        
        console.log(`Session completed: ${this.breathCount} breaths in ${Math.round(finalDuration / 1000)}s`);
    }
    
    /**
     * Start a breathing phase
     */
    startPhase() {
        if (!this.isRunning || this.isPaused) return;
        
        const technique = getTechnique(this.currentTechnique);
        const timing = this.getEffectiveTiming();
        
        this.phaseDuration = this.getPhaseDuration(this.currentPhase, timing) * 1000;
        this.phaseStartTime = Date.now();
        this.phaseProgress = 0;
        
        // Handle special techniques
        if (isSpecialTechnique(this.currentTechnique)) {
            this.handleSpecialPhase();
        } else {
            // Standard phase handling
            this.phaseTimer = setTimeout(this.nextPhase, this.phaseDuration);
        }
        
        // Start progress tracking
        this.startProgressTracking();
        
        // Notify phase change
        if (this.onPhaseChange) {
            this.onPhaseChange({
                phase: this.currentPhase,
                duration: this.phaseDuration / 1000,
                instruction: getPhaseInstruction(this.currentTechnique, this.currentPhase),
                breathCount: this.breathCount
            });
        }
        
        console.log(`Starting phase: ${this.currentPhase} for ${this.phaseDuration / 1000}s`);
    }
    
    /**
     * Move to next phase
     */
    nextPhase() {
        if (!this.isRunning) return;
        
        const technique = getTechnique(this.currentTechnique);
        const currentPhaseIndex = technique.phases.indexOf(this.currentPhase);
        const isLastPhase = currentPhaseIndex === technique.phases.length - 1;
        
        if (isLastPhase) {
            // Complete breath cycle
            this.breathCount++;
            
            if (this.onBreathComplete) {
                this.onBreathComplete(this.breathCount);
            }
            
            // Check if goal reached
            if (this.goalType === 'breaths' && this.breathCount >= this.goalValue) {
                this.completeSession();
                return;
            }
            
            // Start new cycle
            this.currentPhase = technique.phases[0];
        } else {
            // Next phase in cycle
            this.currentPhase = technique.phases[currentPhaseIndex + 1];
        }
        
        this.startPhase();
    }
    
    /**
     * Handle special breathing techniques
     */
    handleSpecialPhase() {
        switch (this.currentTechnique) {
            case 'wim-hof':
                this.handleWimHofPhase();
                break;
            case 'bellows':
                this.handleBellowsPhase();
                break;
            case 'alternate':
                this.handleAlternateNostrilPhase();
                break;
            default:
                this.phaseTimer = setTimeout(this.nextPhase, this.phaseDuration);
        }
    }
    
    /**
     * Handle Wim Hof method phases
     */
    handleWimHofPhase() {
        const timing = this.getEffectiveTiming();
        
        switch (this.currentPhase) {
            case 'power-breath':
                // Rapid breathing for specified count
                const breathInterval = 2000; // 2 seconds per power breath
                const totalBreaths = timing['power-breath'];
                let currentBreath = 0;
                
                const powerBreathInterval = setInterval(() => {
                    currentBreath++;
                    
                    if (this.onPhaseChange) {
                        this.onPhaseChange({
                            phase: this.currentPhase,
                            progress: currentBreath / totalBreaths,
                            instruction: `Power breath ${currentBreath}/${totalBreaths}`,
                            breathCount: this.breathCount
                        });
                    }
                    
                    if (currentBreath >= totalBreaths) {
                        clearInterval(powerBreathInterval);
                        this.nextPhase();
                    }
                }, breathInterval);
                break;
                
            default:
                this.phaseTimer = setTimeout(this.nextPhase, this.phaseDuration);
        }
    }
    
    /**
     * Handle bellows breathing
     */
    handleBellowsPhase() {
        // Rapid breathing for duration
        this.phaseTimer = setTimeout(this.nextPhase, this.phaseDuration);
    }
    
    /**
     * Handle alternate nostril breathing
     */
    handleAlternateNostrilPhase() {
        // Standard timing but with special visual cues
        this.phaseTimer = setTimeout(this.nextPhase, this.phaseDuration);
    }
    
    /**
     * Start progress tracking for current phase
     */
    startProgressTracking() {
        const updateInterval = 50; // Update every 50ms
        
        const progressTimer = setInterval(() => {
            if (!this.isRunning || this.isPaused) {
                clearInterval(progressTimer);
                return;
            }
            
            const elapsed = Date.now() - this.phaseStartTime;
            this.phaseProgress = Math.min(1, elapsed / this.phaseDuration);
            
            // Notify progress update
            if (this.onPhaseChange) {
                this.onPhaseChange({
                    phase: this.currentPhase,
                    progress: this.phaseProgress,
                    duration: this.phaseDuration / 1000,
                    instruction: getPhaseInstruction(this.currentTechnique, this.currentPhase),
                    breathCount: this.breathCount
                });
            }
            
            if (this.phaseProgress >= 1) {
                clearInterval(progressTimer);
            }
        }, updateInterval);
    }
    
    /**
     * Get effective timing (custom or default)
     */
    getEffectiveTiming() {
        const technique = getTechnique(this.currentTechnique);
        const timing = { ...technique.defaultTiming };
        
        // Apply custom timing if provided
        Object.keys(this.customTiming).forEach(phase => {
            if (timing.hasOwnProperty(phase)) {
                timing[phase] = this.customTiming[phase];
            }
        });
        
        return validateTiming(this.currentTechnique, timing);
    }
    
    /**
     * Get duration for specific phase
     */
    getPhaseDuration(phase, timing) {
        return timing[phase] || timing.inhale || 4;
    }
    
    /**
     * Get first phase for technique
     */
    getFirstPhase() {
        const technique = getTechnique(this.currentTechnique);
        return technique.phases[0];
    }
    
    /**
     * Save session data to storage
     */
    async saveSessionData(sessionData) {
        try {
            await chrome.runtime.sendMessage({
                action: 'saveSession',
                data: sessionData
            });
        } catch (error) {
            console.error('Error saving session data:', error);
        }
    }
    
    /**
     * Get current session state
     */
    getSessionState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            technique: this.currentTechnique,
            phase: this.currentPhase,
            breathCount: this.breathCount,
            sessionDuration: this.sessionDuration,
            goalType: this.goalType,
            goalValue: this.goalValue,
            progress: this.phaseProgress
        };
    }
    
    /**
     * Set callback functions
     */
    setCallbacks(callbacks) {
        this.onPhaseChange = callbacks.onPhaseChange || null;
        this.onBreathComplete = callbacks.onBreathComplete || null;
        this.onSessionComplete = callbacks.onSessionComplete || null;
        this.onTimer = callbacks.onTimer || null;
    }
    
    /**
     * Update session configuration
     */
    updateConfiguration(config) {
        if (config.technique && config.technique !== this.currentTechnique) {
            this.currentTechnique = config.technique;
            // Reset to first phase if technique changes
            if (this.isRunning) {
                this.currentPhase = this.getFirstPhase();
            }
        }
        
        if (config.goalType) this.goalType = config.goalType;
        if (config.goalValue) this.goalValue = config.goalValue;
        if (config.customTiming) this.customTiming = { ...config.customTiming };
    }
    
    /**
     * Cleanup resources
     */
    cleanup() {
        this.stopSession();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreathingEngine;
}